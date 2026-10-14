-- ==============================================================================
-- Pendek-In Database Migration: 0002_click_trigger.sql
-- Trigger untuk Otomatisasi Perhitungan Click Count dan Unique Clicks
-- Berdasarkan Dokumen PRD Task 2.3 & 2.4
-- ==============================================================================

-- 1. Fungsi trigger untuk meng-update click_count pada tabel links
create or replace function public.update_link_click_count()
returns trigger as $$
declare
  v_is_unique boolean;
begin
  -- Cek apakah IP hash ini sudah pernah mengklik link yang sama sebelumnya
  select not exists (
    select 1
    from public.clicks
    where link_id = new.link_id
      and ip_hash = new.ip_hash
      and id <> new.id
  ) into v_is_unique;

  -- Update jumlah klik total dan unik pada link terkait
  update public.links
  set
    click_count = click_count + 1,
    unique_click_count = unique_click_count + case when v_is_unique then 1 else 0 end,
    updated_at = now()
  where id = new.link_id;

  return new;
end;
$$ language plpgsql security definer;

-- 2. Pasang Trigger pada tabel clicks
drop trigger if exists on_click_created on public.clicks;
create trigger on_click_created
  after insert on public.clicks
  for each row
  execute function public.update_link_click_count();

-- 3. Stored Procedure RPC untuk direct atomic increment (opsional/alternatif fallback)
create or replace function public.increment_link_clicks(target_link_id uuid, is_unique boolean default false)
returns void as $$
begin
  update public.links
  set
    click_count = click_count + 1,
    unique_click_count = unique_click_count + case when is_unique then 1 else 0 end,
    updated_at = now()
  where id = target_link_id;
end;
$$ language plpgsql security definer;
