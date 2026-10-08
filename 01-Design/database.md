# Database Architecture & Schema Specification (database.md)

Dokumen ini mendefinisikan arsitektur basis data relasional PostgreSQL di Supabase untuk aplikasi **Pendek-In**, mencakup tabel, tipe enum, trigger, indeks performa, dan aturan keamanan Row-Level Security (RLS).

---

## 1. Ekstensi & Tipe Enum

```sql
-- Ekstensi wajib
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Enum types
CREATE TYPE user_role AS ENUM ('member', 'super_admin');
CREATE TYPE user_status AS ENUM ('active', 'suspended');
CREATE TYPE link_status AS ENUM ('active', 'expired', 'blocked');
CREATE TYPE device_type AS ENUM ('mobile', 'desktop', 'tablet', 'other');
```

---

## 2. Struktur Tabel Lengkap

### A. Tabel `profiles`
*Menyimpan profil publik dan status user, tersinkronisasi otomatis dengan `auth.users`.*

| Kolom | Tipe Data | Keterangan / Constraint |
| :--- | :--- | :--- |
| `id` | `UUID` | Primary Key, `REFERENCES auth.users(id) ON DELETE CASCADE` |
| `full_name` | `TEXT` | Nama lengkap pengguna (NOT NULL) |
| `avatar_url` | `TEXT` | URL gambar profil di Supabase Storage |
| `role` | `user_role` | Default `'member'` |
| `status` | `user_status`| Default `'active'` |
| `email_weekly_digest` | `BOOLEAN` | Default `false` (preferensi email ringkasan) |
| `created_at` | `TIMESTAMPTZ`| Default `now()` |
| `updated_at` | `TIMESTAMPTZ`| Default `now()` |

### B. Tabel `links`
*Menyimpan semua tautan pendek yang dibuat oleh guest maupun member.*

| Kolom | Tipe Data | Keterangan / Constraint |
| :--- | :--- | :--- |
| `id` | `UUID` | Primary Key, Default `gen_random_uuid()` |
| `user_id` | `UUID` | `REFERENCES public.profiles(id) ON DELETE CASCADE` (NULL jika dibuat guest) |
| `original_url` | `TEXT` | URL tujuan panjang (NOT NULL, maks 2048 karakter) |
| `slug` | `TEXT` | Back-half tautan pendek (NOT NULL, UNIQUE) |
| `title` | `TEXT` | Judul / label tautan untuk kemudahan identifikasi |
| `description` | `TEXT` | Catatan opsional tautan |
| `tags` | `TEXT[]` | Kumpulan tag kategori, default `'{}'` |
| `status` | `link_status`| Default `'active'` |
| `is_custom_slug` | `BOOLEAN` | `true` jika slug ditentukan manual oleh user |
| `click_count` | `INT` | Total klik terakumulasi, default `0` |
| `unique_click_count`| `INT` | Total klik unik (berdasarkan salt hash IP+UA), default `0` |
| `password_hash` | `TEXT` | Hash sandi pelindung tautan (opsional) |
| `expires_at` | `TIMESTAMPTZ`| Waktu kedaluwarsa tautan (7 hari untuk guest, custom untuk member) |
| `created_at` | `TIMESTAMPTZ`| Default `now()` |
| `updated_at` | `TIMESTAMPTZ`| Default `now()` |

### C. Tabel `clicks`
*Pencatatan data analitik setiap kali tautan `/s/{slug}` diakses.*

| Kolom | Tipe Data | Keterangan / Constraint |
| :--- | :--- | :--- |
| `id` | `UUID` | Primary Key, Default `gen_random_uuid()` |
| `link_id` | `UUID` | NOT NULL, `REFERENCES public.links(id) ON DELETE CASCADE` |
| `ip_hash` | `TEXT` | NOT NULL, SHA-256 hash dari IP pengunjung + salt rahasia |
| `country` | `TEXT` | Kode/nama negara pengunjung (dari header geolokasi) |
| `city` | `TEXT` | Kota pengunjung |
| `referrer` | `TEXT` | Asal rujukan (domain perujuk / media sosial) |
| `device` | `device_type`| Default `'other'` (`mobile`, `desktop`, `tablet`) |
| `browser` | `TEXT` | Nama browser (Chrome, Firefox, Safari, dll.) |
| `os` | `TEXT` | Sistem operasi (Android, iOS, Windows, macOS, Linux) |
| `user_agent` | `TEXT` | Raw user-agent string |
| `created_at` | `TIMESTAMPTZ`| Default `now()` |

### D. Tabel `api_keys`
*Token akses developer untuk mengonsumsi Public REST API.*

| Kolom | Tipe Data | Keterangan / Constraint |
| :--- | :--- | :--- |
| `id` | `UUID` | Primary Key, Default `gen_random_uuid()` |
| `user_id` | `UUID` | NOT NULL, `REFERENCES public.profiles(id) ON DELETE CASCADE` |
| `name` | `TEXT` | Nama token (default: `'Default Key'`) |
| `key_prefix` | `TEXT` | 8-12 karakter awalan token untuk tampilan UI (misal: `pk_live_a1b2`) |
| `key_hash` | `TEXT` | NOT NULL, UNIQUE, SHA-256 hash dari full key token |
| `last_used_at`| `TIMESTAMPTZ`| Tanggal terakhir token digunakan |
| `revoked_at` | `TIMESTAMPTZ`| Tanggal pencabutan token (jika di-revoke, status non-aktif) |
| `created_at` | `TIMESTAMPTZ`| Default `now()` |

### E. Tabel Pendukung & Moderasi

- **`reserved_words`**:
  - `id SERIAL PRIMARY KEY`
  - `word TEXT NOT NULL UNIQUE` (contoh: `api`, `admin`, `dashboard`, `masuk`, `daftar`, `s`)
  - `created_at TIMESTAMPTZ DEFAULT now()`
- **`blocked_domains`**:
  - `id SERIAL PRIMARY KEY`
  - `domain TEXT NOT NULL UNIQUE` (contoh: `phishing-site.example`, `scam-link.top`)
  - `reason TEXT`
  - `added_by UUID REFERENCES public.profiles(id)`
  - `created_at TIMESTAMPTZ DEFAULT now()`
- **`audit_logs`** *(Immutable log)*:
  - `id UUID PRIMARY KEY DEFAULT gen_random_uuid()`
  - `actor_id UUID REFERENCES public.profiles(id)`
  - `action TEXT NOT NULL` (misal: `user.ban`, `link.block`, `domain.blacklist`)
  - `target_type TEXT`
  - `target_id TEXT`
  - `metadata JSONB`
  - `created_at TIMESTAMPTZ DEFAULT now()`

---

## 3. Indeks & Optimasi Performa

```sql
-- Indeks pencarian cepat redirect slug
CREATE INDEX idx_links_slug ON public.links(slug);
CREATE INDEX idx_links_user_id ON public.links(user_id);

-- Indeks analitik time-series & klik unik
CREATE INDEX idx_clicks_link_id_created ON public.clicks(link_id, created_at DESC);
CREATE INDEX idx_clicks_ip_hash ON public.clicks(ip_hash);

-- Indeks autentikasi API Key
CREATE INDEX idx_api_keys_user ON public.api_keys(user_id);
```

---

## 4. Trigger Sinkronisasi User Baru

```sql
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, avatar_url)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
    new.raw_user_meta_data->>'avatar_url'
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```

---

## 5. Kebijakan Row Level Security (RLS)

1. **Profiles**:
   - `SELECT`: Pengguna dapat membaca profilnya sendiri atau Super Admin dapat membaca semua profil.
   - `UPDATE`: Hanya pemilik profil yang dapat memperbarui profilnya.
2. **Links**:
   - `SELECT`: Pemilik link, Super Admin, ATAU tautan berstatus `active` (untuk handler redirect publik).
   - `INSERT`: Diizinkan untuk user terotentikasi atau `user_id IS NULL` (guest shortener).
   - `UPDATE` & `DELETE`: Hanya pemilik tautan (`user_id = auth.uid()`).
3. **Clicks**:
   - `SELECT`: Hanya pemilik tautan terkait (`l.user_id = auth.uid()`) atau Super Admin.
   - `INSERT`: Publik (service role / non-blocking click tracking).
4. **API Keys**:
   - `SELECT`, `INSERT`, `UPDATE`: Terbatas hanya untuk `user_id = auth.uid()`.
5. **Audit Logs**:
   - `SELECT`: Hanya Super Admin (`profiles.role = 'super_admin'`).
   - `INSERT`: Diizinkan via Server Action admin / sistem internal.
