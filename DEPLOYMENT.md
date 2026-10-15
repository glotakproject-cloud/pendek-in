# Panduan Deployment & Konfigurasi Produksi — Pendek-In

Dokumen ini memuat panduan lengkap pendeployan aplikasi **Pendek-In** ke lingkungan produksi (*Production*), baik menggunakan platform **Vercel** (Rekomendasi Utama) maupun **VPS / Docker**, konfigurasi domain kustom, sertifikat SSL HTTPS, serta checklist verifikasi pasca-deploy.

---

## 1. Persiapan Variabel Environment Produksi

Pastikan seluruh kredensial produksi telah Anda siapkan mengacu pada file [`.env.production.example`](file:///d:/02_CODING-DEVELOPMENT/PROJECT-BASED%20VAULT/url-shortener/.env.production.example):

| Variabel Environment | Deskripsi & Sumber Kredensial |
| :--- | :--- |
| `NEXT_PUBLIC_APP_URL` | Domain live resmi, contoh: `https://pendek.in` |
| `NEXT_PUBLIC_APP_NAME` | Nama aplikasi: `Pendek-In` |
| `NEXT_PUBLIC_SUPABASE_URL` | URL Proyek Supabase live (`https://xyz.supabase.co`) |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Public Anon JWT Key dari Supabase Project Settings |
| `SUPABASE_SERVICE_ROLE_KEY` | Secret Service Role JWT Key untuk operasi administratif |
| `IP_HASH_SALT` | String rahasia minimal 32 karakter untuk hashing IP analitik |
| `RESEND_API_KEY` | API Key pengiriman email dari Resend (`re_...`) |
| `EMAIL_FROM` | Alamat pengirim resmi: `Pendek-In <notifications@pendek.in>` |
| `UPSTASH_REDIS_REST_URL` | URL endpoint REST Redis dari Upstash Console |
| `UPSTASH_REDIS_REST_TOKEN` | Token otentikasi REST Redis dari Upstash Console |
| `CRON_SECRET` | Token Bearer rahasia untuk trigger scheduled edge function |

---

## 2. Pilihan A: Deployment ke Vercel (Sangat Direkomendasikan)

Platform Vercel merupakan infrastruktur bawaan Next.js dengan dukungan otomatis Global Edge Network, SSR/ISR, dan image optimization.

### Langkah-langkah:
1. **Push Kode ke GitHub:**
   Pastikan branch `main` repository `https://github.com/glotakproject-cloud/pendek-in.git` telah ter-update.
2. **Import Proyek di Vercel Dashboard:**
   - Kunjungi [vercel.com/new](https://vercel.com/new).
   - Pilih repository **glotakproject-cloud/pendek-in**.
   - Framework Preset otomatis terdeteksi: `Next.js`.
3. **Konfigurasi Environment Variables:**
   - Salin seluruh nilai dari tabel di atas ke bagian **Environment Variables** di Vercel.
4. **Klik "Deploy":**
   - Vercel akan mengeksekusi `npm run build` dan mendistribusikan aplikasi secara global.
5. **Konfigurasi Custom Domain:**
   - Masuk ke menu **Project Settings -> Domains**.
   - Tambahkan domain kustom Anda (misal: `pendek.in` dan `www.pendek.in`).
   - Ikuti konfigurasi DNS Vercel di registrar domain Anda:
     - **Tipe A**: `@` diarahkan ke `76.76.21.21`
     - **Tipe CNAME**: `www` diarahkan ke `cname.vercel-dns.com`
   - Vercel akan menerbitkan sertifikat SSL/TLS HTTPS otomatis dalam 1-5 menit.

---

## 3. Pilihan B: Deployment ke VPS / Docker

Jika Anda menggunakan VPS Linux (Ubuntu/Debian) via Docker:

1. **Clone Repository & Siapkan Environment:**
   ```bash
   git clone https://github.com/glotakproject-cloud/pendek-in.git
   cd pendek-in
   cp .env.production.example .env.production
   nano .env.production # sesuaikan nilainya
   ```
2. **Build Docker Image:**
   ```bash
   docker build -t pendek-in:latest .
   ```
3. **Jalankan Container:**
   ```bash
   docker run -d \
     --name pendek-in-app \
     --restart always \
     -p 3000:3000 \
     --env-file .env.production \
     pendek-in:latest
   ```
4. **Setup Reverse Proxy Nginx & Let's Encrypt SSL:**
   - Arahkan reverse proxy port `80/443` ke `http://127.0.0.1:3000`.
   - Jalankan `certbot --nginx -d pendek.in -d www.pendek.in` untuk sertifikat HTTPS gratis.

---

## 4. Konfigurasi OAuth Google Live (Supabase & Google Cloud)

Agar login Google berfungsi di domain produksi:
1. Buka **Google Cloud Console -> APIs & Services -> Credentials**.
2. Edit **OAuth 2.0 Client ID**:
   - Tambahkan ke **Authorized JavaScript Origins**: `https://pendek.in`
   - Tambahkan ke **Authorized Redirect URIs**: `https://<YOUR_SUPABASE_PROJECT_REF>.supabase.co/auth/v1/callback`
3. Buka **Supabase Dashboard -> Authentication -> URL Configuration**:
   - **Site URL**: `https://pendek.in`
   - **Redirect URLs**: Tambahkan `https://pendek.in/auth/callback` dan `http://localhost:3000/auth/callback`.

---

## 5. Checklist Smoke Test Pasca-Deploy (Live Verification)

Jalankan pengujian cepat berikut setelah domain live aktif:

- [ ] **Akses Beranda (`https://pendek.in`):** Tampilan Neobrutalisme tampil sempurna, tidak ada font atau asset gambar 404.
- [ ] **Pemendekan URL Tamu (Guest):** Masukkan URL panjang, tekan *Pendekkan*, pastikan short link muncul dan tersimpan ke riwayat.
- [ ] **Pengujian Redirect Live (`https://pendek.in/s/<slug>`):** Klik tautan pendek yang dibuat, pastikan browser langsung berpindah ke situs asli (< 100ms).
- [ ] **Verifikasi Sitemap & Robots:**
  - Buka `https://pendek.in/robots.txt` (memastikan aturan disallow dashboard & admin aktif).
  - Buka `https://pendek.in/sitemap.xml` (memastikan seluruh rute publik terindeks).
- [ ] **Login & Dashboard:** Coba masuk menggunakan akun Google dan Email/Password ke `/dashboard`.
- [ ] **Download Kode QR:** Coba unduh file PNG dan SVG di `/dashboard/tautan/<id>/qr`.
- [ ] **REST API Check:** Kirim curl request menggunakan API Key live:
  ```bash
  curl -X GET https://pendek.in/api/v1/links \
    -H "Authorization: Bearer pk_live_YOUR_KEY"
  ```
- [ ] **Super Admin Panel:** Masuk ke `/admin` dan verifikasi log audit mencatat aktivitas dengan benar.
