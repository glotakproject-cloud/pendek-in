-- ==============================================================================
-- Pendek-In Database Migration: 0001_init.sql
-- Arsitektur Skema PostgreSQL untuk Pendek-In URL Shortener
-- Berdasarkan Dokumen PRD Bab 10
-- ==============================================================================

-- 1. Ekstensi Kriptografi & UUID
create extension if not exists "pgcrypto";
create extension if not exists "uuid-ossp";

-- 2. Tipe Enum
create type user_role as enum ('member', 'super_admin');
create type user_status as enum ('active', 'suspended');
create type link_status as enum ('active', 'expired', 'blocked');
create type device_type as enum ('mobile', 'desktop', 'tablet', 'other');

-- 3. Tabel Profiles (Mirror identitas dari auth.users)
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null,
  avatar_url text,
  role user_role not null default 'member',
  status user_status not null default 'active',
  email_weekly_digest boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 4. Tabel Links (Penyimpanan Tautan Singkat)
create table public.links (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete cascade,
  original_url text not null,
  slug text not null unique,
  title text,
  description text,
  tags text[] default '{}',
  status link_status not null default 'active',
  is_custom_slug boolean not null default false,
  click_count int not null default 0,
  unique_click_count int not null default 0,
  password_hash text,
  expires_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index idx_links_slug on public.links(slug);
create index idx_links_user_id on public.links(user_id);
create index idx_links_status on public.links(status);

-- 5. Tabel Clicks (Pencatatan Analitik Kunjungan)
create table public.clicks (
  id uuid primary key default gen_random_uuid(),
  link_id uuid not null references public.links(id) on delete cascade,
  ip_hash text not null,
  country text,
  city text,
  referrer text,
  device device_type default 'other',
  browser text,
  os text,
  user_agent text,
  created_at timestamptz not null default now()
);

create index idx_clicks_link_id_created on public.clicks(link_id, created_at desc);
create index idx_clicks_ip_hash on public.clicks(ip_hash);

-- 6. Tabel API Keys (Token Developer Bearer)
create table public.api_keys (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  name text not null default 'Default Key',
  key_prefix text not null,            -- Contoh: pk_live_a1b2 (tampil di dashboard)
  key_hash text not null unique,       -- SHA-256 dari token lengkap
  last_used_at timestamptz,
  revoked_at timestamptz,
  created_at timestamptz not null default now()
);

create index idx_api_keys_user on public.api_keys(user_id);

-- 7. Tabel Reserved Words (Slug Terlarang)
create table public.reserved_words (
  id serial primary key,
  word text not null unique,
  created_at timestamptz not null default now()
);

-- 8. Tabel Blocked Domains (Blacklist Domain Phishing/Scam)
create table public.blocked_domains (
  id serial primary key,
  domain text not null unique,
  reason text,
  added_by uuid references public.profiles(id),
  created_at timestamptz not null default now()
);

-- 9. Tabel Audit Logs (Immutable Log Administratif)
create table public.audit_logs (
  id uuid primary key default gen_random_uuid(),
  actor_id uuid references public.profiles(id),
  action text not null,
  target_type text,
  target_id text,
  metadata jsonb,
  created_at timestamptz not null default now()
);

-- 10. Trigger: Otomatis Buat Profil setelah User Baru Registrasi
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name, avatar_url)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
    new.raw_user_meta_data->>'avatar_url'
  );
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- 11. Row Level Security (RLS) Wajib Aktif
alter table public.profiles enable row level security;
alter table public.links enable row level security;
alter table public.clicks enable row level security;
alter table public.api_keys enable row level security;
alter table public.reserved_words enable row level security;
alter table public.blocked_domains enable row level security;
alter table public.audit_logs enable row level security;

-- Policies: PROFILES
create policy "profiles_select_own_or_admin"
  on public.profiles for select
  using (
    auth.uid() = id
    or exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'super_admin')
  );

create policy "profiles_update_own"
  on public.profiles for update
  using (auth.uid() = id);

-- Policies: LINKS
create policy "links_select_own_or_admin"
  on public.links for select
  using (
    user_id = auth.uid()
    or exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'super_admin')
    or status = 'active'   -- link aktif bisa dibaca publik untuk keperluan redirect
  );

create policy "links_insert_own"
  on public.links for insert
  with check (user_id = auth.uid() or user_id is null);

create policy "links_update_own"
  on public.links for update
  using (
    user_id = auth.uid()
    or exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'super_admin')
  );

create policy "links_delete_own"
  on public.links for delete
  using (
    user_id = auth.uid()
    or exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'super_admin')
  );

-- Policies: CLICKS
create policy "clicks_select_own_or_admin"
  on public.clicks for select
  using (
    exists (select 1 from public.links l where l.id = clicks.link_id and l.user_id = auth.uid())
    or exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'super_admin')
  );

create policy "clicks_insert_public"
  on public.clicks for insert
  with check (true);

-- Policies: API KEYS
create policy "api_keys_select_own"
  on public.api_keys for select
  using (
    user_id = auth.uid()
    or exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'super_admin')
  );

create policy "api_keys_insert_own"
  on public.api_keys for insert
  with check (user_id = auth.uid());

create policy "api_keys_update_own"
  on public.api_keys for update
  using (user_id = auth.uid());

create policy "api_keys_delete_own"
  on public.api_keys for delete
  using (user_id = auth.uid());

-- Policies: RESERVED WORDS
create policy "reserved_words_select_public"
  on public.reserved_words for select
  using (true);

create policy "reserved_words_modify_admin"
  on public.reserved_words for all
  using (exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'super_admin'));

-- Policies: BLOCKED DOMAINS
create policy "blocked_domains_select_public"
  on public.blocked_domains for select
  using (true);

create policy "blocked_domains_modify_admin"
  on public.blocked_domains for all
  using (exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'super_admin'));

-- Policies: AUDIT LOGS (Immutable, hanya Super Admin)
create policy "audit_logs_select_admin"
  on public.audit_logs for select
  using (exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'super_admin'));

create policy "audit_logs_insert_admin"
  on public.audit_logs for insert
  with check (
    auth.uid() = actor_id
    or exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'super_admin')
  );

-- 12. Seed Data Awal (Kata Terlarang & Domain Blacklist)
insert into public.reserved_words (word) values
  ('admin'),
  ('api'),
  ('dashboard'),
  ('login'),
  ('masuk'),
  ('daftar'),
  ('s'),
  ('p'),
  ('qr'),
  ('about'),
  ('tentang'),
  ('harga'),
  ('kontak'),
  ('syarat-ketentuan'),
  ('kebijakan-privasi'),
  ('bca'),
  ('mandiri'),
  ('bri'),
  ('support'),
  ('official')
on conflict (word) do nothing;

insert into public.blocked_domains (domain, reason) values
  ('bit.ly-phishing.example', 'Impersonasi link perbankan internet banking palsu'),
  ('klik-menang-undian.xyz', 'Situs phising undian palsu bermodus SMS blast'),
  ('necopromo-scam.top', 'Distribusi malware dan dropper trojan otomatis'),
  ('hadiah-telkomsel-palsu.online', 'Pencurian OTP dan credential phishing provider')
on conflict (domain) do nothing;
