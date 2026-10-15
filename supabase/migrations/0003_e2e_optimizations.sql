-- ==============================================================================
-- Pendek-In Database Migration: 0003_e2e_optimizations.sql
-- Optimasi Index Database, Compound Query Aggregation, dan Text Search
-- Sesuai Dokumen PRD Task 3.4
-- ==============================================================================

-- 1. Optimasi Query Agregasi Analitik Klik (Time-series per Link & Device/Country)
create index if not exists idx_clicks_link_created_country
  on public.clicks(link_id, created_at desc, country);

create index if not exists idx_clicks_link_created_device
  on public.clicks(link_id, created_at desc, device);

create index if not exists idx_clicks_link_created_referrer
  on public.clicks(link_id, created_at desc, referrer);

-- 2. Optimasi Query Pencarian Tautan di Dashboard Member & Admin
create index if not exists idx_links_user_status_created
  on public.links(user_id, status, created_at desc);

create index if not exists idx_links_slug_status
  on public.links(slug, status);

-- 3. Optimasi Query Audit Log Super Admin (Pencarian Berdasarkan Waktu & Aksi)
create index if not exists idx_audit_logs_action_created
  on public.audit_logs(action, created_at desc);

create index if not exists idx_audit_logs_actor_created
  on public.audit_logs(actor_id, created_at desc);

-- 4. Optimasi Verifikasi API Key
create index if not exists idx_api_keys_hash_revoked
  on public.api_keys(key_hash, revoked_at);
