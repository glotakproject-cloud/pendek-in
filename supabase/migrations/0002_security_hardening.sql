-- ==============================================================================
-- Pendek-In Security Hardening Migration: 0002_security_hardening.sql
-- Penguatan Keamanan RLS 100% Tertutup, Policy Super Admin, dan Index Performa
-- Berdasarkan Dokumen PRD Bab 8 & Task 3.2
-- ==============================================================================

-- 1. Pastikan Row Level Security (RLS) Aktif 100% pada Seluruh Tabel
alter table if exists public.profiles enable row level security;
alter table if exists public.links enable row level security;
alter table if exists public.clicks enable row level security;
alter table if exists public.api_keys enable row level security;
alter table if exists public.reserved_words enable row level security;
alter table if exists public.blocked_domains enable row level security;
alter table if exists public.audit_logs enable row level security;

-- 2. Penguatan Policy PROFILES
-- Izinkan Super Admin mengubah status dan role profil pengguna lain (untuk aksi Ban / Suspend)
drop policy if exists "profiles_update_admin" on public.profiles;
create policy "profiles_update_admin"
  on public.profiles for update
  using (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.role = 'super_admin'
    )
  );

-- 3. Penguatan Policy AUDIT LOGS
-- Audit log tidak boleh diubah (UPDATE) atau dihapus (DELETE) oleh siapapun (WORM - Write Once, Read Many)
drop policy if exists "audit_logs_no_update" on public.audit_logs;
drop policy if exists "audit_logs_no_delete" on public.audit_logs;

-- 4. Penguatan Policy CLICKS
-- Publik hanya boleh insert (saat redirect link), sama sekali tidak boleh update/delete
drop policy if exists "clicks_no_update" on public.clicks;
drop policy if exists "clicks_no_delete" on public.clicks;

-- 5. Index Kinerja & Pencegahan DoS pada Query Analitik
create index if not exists idx_clicks_link_id_created_at
  on public.clicks(link_id, created_at desc);

create index if not exists idx_clicks_ip_hash_created_at
  on public.clicks(ip_hash, created_at desc);

create index if not exists idx_links_user_id_created_at
  on public.links(user_id, created_at desc);

create index if not exists idx_api_keys_user_id_hash
  on public.api_keys(user_id, key_hash);
