# Product Requirements Document (PRD)

# Pendek-In

---

## 1. Ringkasan & Tujuan Aplikasi
*Bagian ini menjelaskan gambaran umum proyek agar dipahami bersama oleh pemilik ide/klien dan tim pengembang.*
- **Nama Aplikasi**: Pendek-In
- **Penjelasan Singkat**: Pendek-In adalah layanan pemendek tautan modern dengan gaya visual Neobrutalisme yang berani — mengubah URL panjang menjadi tautan pendek yang mudah dibagikan, dilengkapi kustomisasi tautan, kode QR dinamis, analitik performa klik secara real-time, serta Public REST API untuk kebutuhan developer.
- **Masalah yang Diselesaikan**:
  - URL panjang sulit dibagikan, terlihat berantakan, dan rawan terpotong saat dikirim via chat/sosial media.
  - Pelaku bisnis & kreator konten tidak tahu seberapa efektif link yang mereka sebar (tidak ada data klik, asal pengunjung, maupun perangkat).
  - Tautan dengan branding masih jarang, padahal penting untuk kepercayaan audiens.
  - Developer butuh cara cepat memendekkan tautan secara terprogram lewat API, bukan hanya lewat dashboard.
- **Pengguna Aplikasi**:
  - **Pengunjung (Guest)**: Pengguna yang baru mendarat di halaman publik dan ingin mencoba pemendek tautan cepat tanpa login.
  - **Member/User**: Pengguna terdaftar (via Google atau Email) yang mengelola koleksi tautan, membuat QR dinamis, dan memantau analitik.
  - **Super Admin**: Pengelola sistem yang bertanggung jawab mengawasi seluruh tautan, mengelola user, moderasi tautan berbahaya, dan memantau API usage.
- **Target Keberhasilan**:
  - Minimal 1.000 tautan baru dipendekkan pada bulan pertama setelah rilis.
  - Tingkat konversi guest → member (yang mendaftar) minimal 15%.
  - Rata-rata waktu pemendekan tautan di bawah 1,5 detik dari input sampai link siap dibagikan.
  - Minimal 30% member mengaktifkan fitur kustom tautan & QR dinamis pada minggu pertama.
  - Adopsi Public REST API oleh minimal 50 developer/token aktif dalam 3 bulan pertama.
*(PENTING: Tuliskan seluruh 5 poin di atas dalam satu kesatuan daftar tanpa jeda baris kosong pemutus)*

---

## 2. Batasan Pembuatan Sistem (Versi Awal MVP)
*Menegaskan fitur apa yang dikerjakan di versi awal dan apa yang sengaja ditunda agar aplikasi cepat selesai dan tidak membengkak (mencegah scope creep).*
### ✅ Yang Dikerjakan:
- Autentikasi multi-login: Google OAuth & Email/Password via Supabase Auth.
- Pemendekan tautan instan (anonymous untuk guest, tersimpan permanen untuk member).
- Kustom tautan (back-half) dengan validasi ketersediaan & reserved words.
- Kode QR dinamis per tautan (warna kustom sederhana, unduh PNG/SVG).
- Analitik dasar: total klik, klik unik, asal negara/kota, referrer, tipe device, dan grafik per hari.
- Public REST API (buat, lihat, hapus tautan) dengan API Key per user.
- Manajemen user & moderasi tautan oleh Super Admin.
- Notifikasi email dasar (verifikasi akun baru, ringkasan analitik mingguan opsional).
- Redirect handler halaman `/{slug}` dengan pencatatan klik real-time.

### ⛔ Yang Tidak Dikerjakan di Versi Awal:
- Fitur berbayar, langganan, dan payment gateway (aplikasi 100% gratis tanpa transaksi finansial).
- Kolaborasi tim (multi-user workspace/team seats).
- Domain kustom (custom domain/white-label).
- A/B testing link rotator.
- Integrasi Slack, Discord, atau Zapier.
- Mobile native app (fokus web responsive saja).
- AI copywriter untuk membuat deskripsi tautan otomatis.

---

## 3. Daftar Halaman & Struktur Menu (Pages & Routing)
*Daftar lengkap halaman yang harus dibuat, dikelompokkan berdasarkan area atau peran pengguna (Role).*
### A. Public Area (Tanpa Login)
- `/` (Beranda): Hero pemendek tautan instan, input URL besar, riwayat cepat (local state), section fitur, testimoni, FAQ, CTA daftar.
- `/masuk` (Login): Form login email/password + tombol "Masuk dengan Google".
- `/daftar` (Register): Form registrasi email + nama, tombol Google OAuth.
- `/harga` (Harga): Halaman statis yang menegaskan Pendek-In 100% gratis + perbandingan fitur.
- `/api-publik` (Dokumentasi API): Penjelasan endpoint, contoh cURL, cara generate API Key.
- `/tentang` (Tentang Kami): Cerita produk, visi, tim.
- `/kontak` (Kontak): Form kontak + alamat email support.
- `/syarat-ketentuan` (Terms of Service): Kebijakan penggunaan.
- `/kebijakan-privasi` (Privacy Policy): Kebijakan data & privasi.
- `/s/{slug}` (Redirect Handler): Halaman dinamis yang mengarahkan user ke URL target & mencatat klik.
- `/404` & `/404/[slug]` (Not Found): Tampilan ramah saat slug tidak ditemukan.
- `/daftar-tautan-publik` (Directory Tautan Publik) — opsional: menampilkan tautan publik yang di-share.

### B. Member Area (Setelah Login)
- `/dashboard` (Dasbor Utama): Ringkasan statistik total klik, tautan aktif, tautan baru minggu ini, grafik mini 7 hari.
- `/dashboard/tautan` (Kelola Tautan): Tabel daftar semua tautan member dengan search, filter status, sort, dan aksi salin/edit/hapus.
- `/dashboard/tautan/baru` (Buat Tautan Baru): Form pemendekan lengkap (URL target, back-half kustom, judul, tag, tanggal kadaluarsa, password opsional).
- `/dashboard/tautan/[id]` (Detail & Edit Tautan): Info tautan, QR code preview, sub-tab analitik per tautan.
- `/dashboard/tautan/[id]/qr` (Editor QR Dinamis): Kustomisasi warna QR, unduh PNG/SVG, tampilkan URL pendek.
- `/dashboard/analitik` (Analitik Global): Grafik klik per hari/bulan, top referrer, top negara, top device, top tautan.
- `/dashboard/api-key` (Kelola API Key): Generate, tampilkan (sekali), copy, revoke API Key.
- `/dashboard/profil` (Profil Saya): Edit nama, ganti password, email, avatar.
- `/dashboard/notifikasi` (Preferensi Notifikasi): Toggle email ringkasan mingguan.

### C. Admin Area (Setelah Login Sebagai Super Admin)
- `/admin` (Dasbor Admin): Total user, total tautan, tautan baru hari ini, jumlah klik global, grafik 30 hari.
- `/admin/pengguna` (Kelola Pengguna): Tabel semua user, filter role/status, aksi ban/aktifkan/reset.
- `/admin/pengguna/[id]` (Detail Pengguna): Info user, daftar tautan, riwayat aktivitas, tombol suspend.
- `/admin/tautan` (Moderasi Tautan): Tabel semua tautan global, filter status (aktif, kadaluarsa, diblokir), aksi blokir/hapus.
- `/admin/tautan/[id]` (Detail Tautan Global): Info lengkap + analitik + tombol pemblokiran dengan alasan.
- `/admin/domain-terblokir` (Domain Blacklist): Kelola daftar domain yang dilarang dipendekkan (phishing, spam, dsb.).
- `/admin/kata-terlarang` (Reserved Words): Kelola daftar slug yang tidak boleh digunakan (admin, api, dashboard, dst.).
- `/admin/log-aktivitas` (Audit Log): Riwayat aksi admin & aktivitas sistem penting.
- `/admin/pengaturan` (Pengaturan Sistem): Nama site, mode maintenance, batas rate-limit API, template email.

---

## 4. Pedoman UI/UX & Design System
*Panduan visual konkret agar AI coding assistant tidak membuat UI yang kaku atau default.*
- **Skema Warna (Neobrutalism)**:
  - Primary Green: `#00D26A` — warna aksi utama (tombol utama, highlight, badge aktif).
  - Primary Green Dark: `#00A653` — untuk state hover tombol primary.
  - Accent Lime: `#B4FF39` — aksen visual, highlight card, grafik.
  - Black (Foreground): `#0A0A0A` — border tebal, teks utama, shadow keras.
  - White (Background): `#FFFFFF` — background utama halaman.
  - Off-White / Cream: `#F5F5F0` — background panel & section selang-seling.
  - Danger Red: `#FF5C5C` — tombol hapus, badge error.
  - Warning Yellow: `#FFD23F` — badge pending, peringatan.
  - Info Blue: `#3B82F6` — badge informasi.
- **Tipografi**:
  - Heading: `'Space Grotesk'` atau `'Archivo Black'` — weight 700-900, ukuran besar (h1 minimal 3.5rem desktop, 2.25rem mobile), letter-spacing sedikit rapat.
  - Body & UI: `'Inter'` — weight 500-700 untuk label tombol, 400 untuk body teks.
  - Angka statistik/dashboard: `'Space Mono'` — memberi kesan teknis & tegas.
- **Aturan Komponen (Neobrutalism)**:
  - Sudut komponen: `rounded-none` (tegas kotak) atau maksimal `rounded-md` — hindari rounded penuh kecuali badge pill.
  - Border wajib: `border-2 border-black` atau `border-[3px] border-black` pada semua tombol, card, input, dropdown, dan modal.
  - Shadow keras tanpa blur: `shadow-[4px_4px_0px_0px_#0A0A0A]`, hover naik ke `shadow-[6px_6px_0px_0px_#0A0A0A]` dengan `translate-[-2px,-2px]`.
  - Tombol utama: background Primary Green, teks hitam, border hitam tebal, shadow keras. Saat ditekan (`active`), shadow menghilang (`shadow-none`) dan tombol bergeser ke arah shadow.
  - Input: background putih, border hitam 2-3px, focus ring berupa outline hijau tebal 2px.
  - Kartu (Card): background putih/cream, border hitam 2-3px, shadow keras, padding generous (min 1.5rem).
  - Modal/Dialog: seperti kartu tapi full shadow keras `shadow-[8px_8px_0px_0px_#0A0A0A]`, tanpa backdrop blur (background overlay 40% hitam solid).
  - Badge: pill kecil dengan border hitam, warna solid sesuai kategori status.
  - Tabel: header dengan background Primary Green + border hitam, baris selang-seling putih/cream, border antar sel tegas.
- **Nuansa & Vibe**: Berani, tegas, retro-futuristik, penuh kontras. Banyak whitespace tapi "hidup" dengan aksen geometris (kotak, badge, garis tebal). Micro-animation singkat & snappy (translate 100ms, bukan easing lambat). Ikon bergaris tebal (Lucide Icons dengan `strokeWidth={2.5}`).

---

## 5. Pembagian Hak Akses Pengguna
*Tabel hak akses yang menentukan siapa saja yang boleh melihat, mengedit, atau mengelola data.*
| Menu / Halaman | Publik (Tanpa Login) | Member (Login) | Super Admin |
| :--- | :---: | :---: | :---: |
| Beranda `/` | ✅ | ✅ | ✅ |
| Login `/masuk` & Daftar `/daftar` | ✅ | ❌ (redirect ke dashboard) | ❌ |
| Harga, Tentang, Kontak, Syarat, Privasi | ✅ | ✅ | ✅ |
| Dokumentasi API `/api-publik` | ✅ | ✅ | ✅ |
| Redirect Handler `/s/{slug}` | ✅ | ✅ | ✅ |
| Dasbor & Tautan Member (`/dashboard/*`) | ❌ | ✅ (hanya milik sendiri) | ✅ (read-only) |
| Analitik Per Tautan | ❌ | ✅ (hanya tautan sendiri) | ✅ (semua tautan) |
| API Key | ❌ | ✅ (hanya milik sendiri) | ✅ |
| Admin Dasbor `/admin` | ❌ | ❌ | ✅ |
| Kelola Pengguna `/admin/pengguna` | ❌ | ❌ | ✅ |
| Moderasi Tautan `/admin/tautan` | ❌ | ❌ | ✅ |
| Blacklist Domain & Reserved Words | ❌ | ❌ | ✅ |
| Audit Log & Pengaturan Sistem | ❌ | ❌ | ✅ |

---

## 6. Alur Kerja dan Fitur Utama
*Menjelaskan cara kerja setiap fitur utama dalam bahasa yang mudah dipahami serta aturan logikanya.*

### A. Pemendekan Tautan (Link Shortening)
1. **Cara Kerja**:
   - Pengunjung menempelkan URL panjang di input besar pada Beranda `/`, lalu tekan tombol "Pendekkan Sekarang!".
   - Sistem memvalidasi URL (format, protokol `http/https`, domain tidak di-blacklist).
   - Sistem membuat slug acak 6 karakter alfanumerik (misal `aB3xK9`).
   - Untuk guest, tautan disimpan sebagai anonymous link dengan masa aktif 7 hari (`expires_at`).
   - Untuk member yang login, tautan tersimpan permanen di akunnya.
   - Tautan pendek (misal `https://pendek.in/aB3xK9`) ditampilkan dalam card besar dengan tombol Copy, QR, dan Statistik.
2. **Aturan Sistem**:
   - URL target wajib valid dan memiliki protokol `http://` atau `https://` (auto-prepend jika tidak ada).
   - Domain target dicek terhadap tabel `blocked_domains` — jika terblokir, tampilkan error.
   - Slug acak dijamin unik (retry hingga 5x bila tabrakan).
   - Panjang URL target maksimal 2.048 karakter.
   - Rate-limit: guest maksimal 10 tautan/jam per IP; member 200 tautan/jam.

### B. Kustomisasi Tautan (Custom Links / Back-Half)
1. **Cara Kerja**:
   - Di halaman `/dashboard/tautan/baru`, user klik bagian "Kustom Back-Half".
   - User mengetik slug yang diinginkan (misal `promo-akhir-tahun`).
   - Sistem mengecek ketersediaan secara real-time (debounced 400ms).
   - Jika tersedia, tampilkan centang hijau; jika terpakai, tampilkan saran alternatif otomatis.
   - User menyimpan dan slug kustom langsung aktif.
2. **Aturan Sistem**:
   - Format slug: hanya huruf kecil, angka, dan tanda hubung `-`; panjang 3-30 karakter.
   - Tidak boleh mengandung kata di tabel `reserved_words` (`api`, `admin`, `dashboard`, `login`, `daftar`, `s`, `p`, dsb.).
   - Tidak boleh mengandung kata kasar/terlarang (safety list).
   - Hanya member (login) yang boleh membuat tautan kustom — guest hanya slug acak.
   - Slug kustom dijamin unik secara global.

### C. Kode QR Dinamis (Dynamic QR Codes)
1. **Cara Kerja**:
   - Setiap tautan yang dibuat otomatis mendapatkan QR Code berisi URL pendek.
   - Di halaman `/dashboard/tautan/[id]/qr`, user dapat memilih warna latar & warna modul QR, memilih ukuran (256/512/1024 px), dan memilih format unduh (PNG/SVG).
   - Karena QR mengarah ke URL pendek Pendek-In, jika user mengubah destination URL tautan, QR tetap berlaku (dinamis).
   - Preview QR real-time saat mengubah pengaturan warna.
2. **Aturan Sistem**:
   - QR di-generate di sisi server yang divalidasi (menghindari API publik yang tidak stabil) atau library client-side seperti `qrcode.react`.
   - Warna QR wajib memiliki kontras minimum 3:1 terhadap background.
   - Format PNG dan SVG tersedia. Ukuran default 512px.
   - Perubahan warna tidak mengubah isi QR (hanya styling).
   - Fitur ini hanya untuk member (guest tidak menyimpan QR).

### D. Analitik & Pelacakan Performa (Link Analytics)
1. **Cara Kerja**:
   - Setiap kali user mengakses `/s/{slug}`, sistem membaca user-agent & header request.
   - Sistem melihat: waktu, referrer, tipe device (mobile/desktop/tablet), browser, OS, dan negara (dari header `x-vercel-ip-country` atau GeoIP).
   - Data diproses & disimpan ringan di tabel `clicks`.
   - Dashboard member menampilkan: total klik, klik unik (berdasarkan hash IP+UA), grafik time-series (7/30/90 hari), top referrer, top negara, top device, dan top 5 tautan.
   - Di halaman detail tautan, user melihat analitik spesifik tautan tersebut.
2. **Aturan Sistem**:
   - IP user tidak disimpan mentah — hanya hash SHA-256 dengan salt server untuk deteksi klik unik.
   - Pencatatan klik dijalankan secara non-blocking (fire-and-forget, tanpa memperlambat redirect).
   - Retensi data klik: 12 bulan (auto-cleanup setelahnya).
   - Grafik default menampilkan rentang 7 hari terakhir.
   - Filter rentang waktu: 24 jam, 7 hari, 30 hari, 90 hari, kustom.

### E. Integrasi & Public REST API
1. **Cara Kerja**:
   - Member membuka `/dashboard/api-key` dan klik "Generate API Key Baru".
   - Sistem membuat token berformat `pk_live_<32 char random>` — ditampilkan sekali saja.
   - Token disimpan sebagai hash SHA-256 di tabel `api_keys` beserta prefix untuk display.
   - Developer menggunakan header `Authorization: Bearer pk_live_xxxx` pada endpoint REST.
   - Endpoint tersedia:
     - `POST /api/v1/links` — buat tautan.
     - `GET /api/v1/links` — list tautan user (pagination).
     - `GET /api/v1/links/{id}` — detail tautan.
     - `DELETE /api/v1/links/{id}` — hapus tautan.
     - `GET /api/v1/links/{id}/analytics` — ambil ringkasan analitik.
   - Dokumentasi publik di `/api-publik` menampilkan contoh cURL, response schema, dan error codes.
2. **Aturan Sistem**:
   - API Key ditampilkan hanya sekali — user harus menyimpannya sendiri.
   - Rate-limit API: 120 request/menit/API Key.
   - Semua response berformat JSON dengan struktur konsisten `{ success, data, error }`.
   - Token dapat di-revoke kapan saja; token non-aktif langsung ditolak (status 401).
   - Notifikasi email otomatis dikirim ke pemilik akun saat API Key baru dibuat (security alert).

### F. Notifikasi Email
1. **Cara Kerja**:
   - Email verifikasi saat registrasi akun baru via email/password.
   - Email dari Supabase Auth untuk reset password.
   - Email "Ringkasan Mingguan" (opsional, default OFF): berisi total klik mingguan, top 3 tautan, dan insights.
   - Email security alert saat login dari perangkat baru atau API Key dibuat.
2. **Aturan Sistem**:
   - Pengiriman email via Supabase Auth (untuk auth) + Resend atau Supabase Edge Function (untuk kustom email & ringkasan mingguan).
   - User dapat mematikan ringkasan mingguan dari `/dashboard/notifikasi`.
   - Rate-limit email alert: maksimal 1 email security alert/jam/user.

### G. Manajemen Sistem oleh Super Admin
1. **Cara Kerja**:
   - Super Admin melihat seluruh statistik global, daftar user, dan daftar tautan di `/admin/*`.
   - Moderasi tautan: jika ada laporan, Super Admin bisa blokir tautan (status `blocked`) dan menambahkan domain ke blacklist.
   - Kelola reserved words di `/admin/kata-terlarang`.
   - Audit log mencatat semua aksi admin (siapa, kapan, aksi apa, target).
2. **Aturan Sistem**:
   - Tautan berstatus `blocked` akan mengarah ke halaman `404` custom.
   - Suspend user akan memblokir seluruh login user tersebut dan menonaktifkan seluruh tautannya.
   - Audit log immutable (tidak bisa dihapus/diedit, hanya insert).

---

## 7. Alur Navigasi & Arsitektur Layout
*Peta navigasi alur halaman dan struktur tata letak (layout).*

### Arsitektur Layout (Persisten)
- **Public Layout**: Header dengan logo "Pendek-In" (kotak hijau bergaris hitam), navigasi (Fitur, Harga, API, Tentang), tombol "Masuk" (outline) dan "Daftar" (primary green shadow keras). Footer 4 kolom dengan link, sosial, dan copyright.
- **Auth Layout**: Halaman login/daftar tanpa header penuh — hanya logo besar di tengah dengan card Neobrutalism besar (background cream, border hitam 3px, shadow keras 8px).
- **Dashboard Layout (Member)**: Sidebar kiri fixed (width 260px, background putih, border kanan hitam 2px) berisi menu ikon tebal; Header atas berupa breadcrumb + avatar dropdown; konten utama di kanan dengan padding 2rem; responsive collapse ke drawer di mobile.
- **Admin Layout**: Sama seperti dashboard tapi sidebar berwarna hitam (foreground terang), badge "ADMIN" merah di header, dan item menu berbeda.

### Bagan Alur (Flowchart)
```mermaid
flowchart TD
    A[Pengunjung] --> B[Beranda /]
    B --> C{Ingin simpan tautan?}
    C -- Tidak --> D[Paste URL & Dapatkan Link Pendek<br/>Tersimpan sementara 7 hari]
    C -- Ya --> E[Daftar atau Masuk]
    E --> F{Metode Login}
    F -- Google OAuth --> G[Dashboard Member]
    F -- Email/Password --> H[Supabase Kirim Email Verifikasi]
    H --> G
    G --> I[Buat Tautan Baru<br/>/dashboard/tautan/baru]
    I --> J{Pilih Fitur}
    J -- Back-Half Kustom --> K[Cek Ketersediaan Slug]
    J -- QR Kode --> L[Generate & Unduh QR<br/>/dashboard/tautan/id/qr]
    J -- Simpan Saja --> M[Tautan Aktif]
    K --> M
    L --> M
    M --> N[Bagikan Tautan]
    N --> O[User Target Akses /s/slug]
    O --> P[Catat Klik ke Tabel clicks]
    P --> Q[Redirect ke URL Target]
    Q --> R[Statistik Muncul di<br/>/dashboard/analitik]
    G --> S[Generate API Key<br/>/dashboard/api-key]
    S --> T[Developer Pakai REST API<br/>Authorization: Bearer pk_live_xxx]
    T --> U[CRUD via /api/v1/links]
    U --> M
    V[Super Admin] --> W[/admin]
    W --> X[Moderasi Tautan & User]
    X --> Y[Audit Log]
```

---

## 8. Kebutuhan Non-Fungsional (SEO, Keamanan, & Performa)
*Syarat wajib agar website siap rilis ke publik (production-ready).*
- **SEO**: Wajib menggunakan tag `<title>` dinamis, meta description, dan Open Graph (OG) tags di setiap halaman publik. Halaman `/api-publik` dan `/harga` harus di-index Google dengan konten keyword-friendly ("URL shortener gratis Indonesia", "pemendek link gratis", dsb.). Halaman redirect `/s/{slug}` wajib `noindex, nofollow` untuk mencegah duplikasi.
- **Keamanan**: Wajib implementasi proteksi CSRF pada semua form & Server Actions, sanitasi input untuk mencegah XSS (terutama field judul & back-half), dan validasi sisi server menggunakan **Zod**. API Key disimpan dalam hash SHA-256 (bukan plain text). Row-Level Security (RLS) Supabase wajib aktif di semua tabel data user (`links`, `clicks`, `api_keys`) agar member tidak bisa mengakses data member lain.
- **Performa**: Wajib optimasi gambar (`<Image>` Next.js), lazy loading komponen berat (grafik, editor QR), caching halaman publik dengan `revalidate`, ISR untuk halaman statis. Proses pencatatan klik di redirect handler wajib **non-blocking** (background) agar latency redirect < 100ms. Gunakan Supabase Edge Location terdekat & indeks database yang tepat pada kolom `slug` (unique index) & `clicks(link_id, created_at)`.

---

## 9. Panduan Bahasa, Copywriting, & Data Dummy
*Panduan nada bicara (Tone of Voice) dan contoh data agar prototipe terasa nyata.*
- **Gaya Bahasa**: Tegas, ramah, ceria, dan membumi (menggunakan kata "Anda" dan "Kami"). Copywriting singkat dan punchy karena gaya Neobrutalism lebih cocok dengan teks tegas tanpa basa-basi. Contoh: "Panjang? Pendekin aja."
- **Instruksi Data Dummy**: JANGAN PERNAH MENGGUNAKAN "Lorem Ipsum". Selalu gunakan data dummy berbahasa Indonesia yang relevan dengan konteks aplikasi. Berikut contoh spesifik untuk entitas utama:
  - **User Dummy**:
    - Nama: "Dimas Pratama", Email: `dimas.pratama@gmail.com`, Role: `member`.
    - Nama: "Sari Wulandari", Email: `sari@tokobunga.id`, Role: `member`.
    - Nama: "Admin Pendek-In", Email: `admin@pendek.in`, Role: `super_admin`.
  - **Link Dummy**:
    - `original_url`: `https://tokobunga.id/katalog/buket-pernikahan-premium-jakarta-selatan`
    - `slug`: `buket-nikah-jkt`, `title`: "Katalog Buket Pernikahan Premium Jakarta Selatan".
    - `original_url`: `https://youtube.com/watch?v=contoh-video-tutorial-copywriting`
    - `slug`: `tutorial-copywriting`, `title`: "Tutorial Copywriting untuk UMKM".
    - `original_url`: `https://shopee.co.id/produk-kaos-polos-premium-cotton-combed-30s`
    - `slug`: `kaos-premium`, `title`: "Kaos Polos Premium Cotton Combed 30s".
  - **Analytics Dummy** (untuk tautan `buket-nikah-jkt`):
    - Total Klik: 1.247, Klik Unik: 983
    - Top Referrer: `instagram.com` (412), `whatsapp.com` (301), `tiktok.com` (189), `google.com` (81)
    - Top Negara: Indonesia (1.180), Singapura (42), Malaysia (25)
    - Top Device: Mobile (1.012), Desktop (203), Tablet (32)
  - **Reserved Words Dummy**: `api`, `admin`, `dashboard`, `login`, `masuk`, `daftar`, `s`, `p`, `qr`, `about`.
  - **Blocked Domains Dummy**: `bit.ly-phishing.example`, `klik-menang-undian.xyz`, `necopromo-scam.top`.

---

## 10. Fondasi Teknis (Untuk Tim Pengembang / Programmer & AI)
*Petunjuk arsitektur teknis spesifik.*
- **Bahasa & Framework**: Next.js 15 (App Router) + TypeScript + React Server Components & Server Actions.
- **Tampilan Antarmuka (UI)**: Tailwind CSS + shadcn/ui (kustomisasi neobrutalist theme token) + Lucide Icons (strokeWidth 2.5) + Space Grotesk / Archivo Black / Space Mono (via `next/font/google`) + Recharts untuk grafik analitik + `qrcode.react` untuk QR.
- **Autentikasi**: Supabase Auth (`@supabase/ssr`) — Google OAuth Provider + Email/Password.
- **Basis Data (Database)**: Supabase PostgreSQL (dengan Row-Level Security aktif).
- **Storage**: Supabase Storage (untuk menyimpan file logo user/Avatar; tidak dipakai untuk QR — QR di-generate on-the-fly).
- **Email**: Supabase Auth Email (transaksional) + Resend (untuk ringkasan mingguan & security alert).
- **Public API**: Next.js Route Handlers di `app/api/v1/*` dengan validasi Zod dan autentikasi Bearer Token.

### Struktur Skema Database Nyata (`supabase/migrations/0001_init.sql` + TypeScript types)

```sql
-- Ekstensi
create extension if not exists "pgcrypto";
create extension if not exists "uuid-ossp";

-- Enum tipe
create type user_role as enum ('member', 'super_admin');
create type user_status as enum ('active', 'suspended');
create type link_status as enum ('active', 'expired', 'blocked');
create type device_type as enum ('mobile', 'desktop', 'tablet', 'other');

-- Tabel profiles (mirror dari auth.users)
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

-- Tabel links
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

-- Tabel clicks (analytics)
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

-- Tabel api_keys
create table public.api_keys (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  name text not null default 'Default Key',
  key_prefix text not null,            -- ex: pk_live_a1b2 (untuk display)
  key_hash text not null unique,       -- SHA-256 dari full token
  last_used_at timestamptz,
  revoked_at timestamptz,
  created_at timestamptz not null default now()
);

create index idx_api_keys_user on public.api_keys(user_id);

-- Tabel reserved_words
create table public.reserved_words (
  id serial primary key,
  word text not null unique,
  created_at timestamptz not null default now()
);

-- Tabel blocked_domains
create table public.blocked_domains (
  id serial primary key,
  domain text not null unique,
  reason text,
  added_by uuid references public.profiles(id),
  created_at timestamptz not null default now()
);

-- Tabel audit_logs (immutable)
create table public.audit_logs (
  id uuid primary key default gen_random_uuid(),
  actor_id uuid references public.profiles(id),
  action text not null,
  target_type text,
  target_id text,
  metadata jsonb,
  created_at timestamptz not null default now()
);

-- Trigger: auto create profile setelah signup
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

-- Row Level Security
alter table public.profiles enable row level security;
alter table public.links enable row level security;
alter table public.clicks enable row level security;
alter table public.api_keys enable row level security;
alter table public.audit_logs enable row level security;

-- Policy: member lihat & edit profile sendiri
create policy "profiles_select_own_or_admin"
  on public.profiles for select
  using (
    auth.uid() = id
    or exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'super_admin')
  );

create policy "profiles_update_own"
  on public.profiles for update
  using (auth.uid() = id);

-- Policy: links
create policy "links_select_own_or_admin"
  on public.links for select
  using (
    user_id = auth.uid()
    or exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'super_admin')
    or status = 'active'   -- link aktif bisa dibaca publik (untuk redirect handler)
  );

create policy "links_insert_own"
  on public.links for insert
  with check (user_id = auth.uid() or user_id is null);

create policy "links_update_own"
  on public.links for update
  using (user_id = auth.uid());

create policy "links_delete_own"
  on public.links for delete
  using (user_id = auth.uid());

-- Policy: clicks
create policy "clicks_select_own_or_admin"
  on public.clicks for select
  using (
    exists (select 1 from public.links l where l.id = clicks.link_id and l.user_id = auth.uid())
    or exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'super_admin')
  );

-- Policy: api_keys
create policy "api_keys_select_own"
  on public.api_keys for select
  using (user_id = auth.uid());

create policy "api_keys_insert_own"
  on public.api_keys for insert
  with check (user_id = auth.uid());

create policy "api_keys_update_own"
  on public.api_keys for update
  using (user_id = auth.uid());

-- Policy: audit_logs (hanya admin bisa baca)
create policy "audit_logs_select_admin"
  on public.audit_logs for select
  using (exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'super_admin'));
```

### Variabel Lingkungan (`.env.example`)
```env
# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_APP_NAME=Pendek-In

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOi...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOi...      # hanya di server (admin tasks)

# Security
IP_HASH_SALT=random_string_panjang_dari_env

# Email (Resend)
RESEND_API_KEY=re_xxxxxxxxxxxx
EMAIL_FROM=noreply@pendek.in

# Rate Limit / Cache (opsional)
UPSTASH_REDIS_REST_URL=https://xxxxxxxx.upstash.io
UPSTASH_REDIS_REST_TOKEN=xxxxxxxxxxxxxxxx
```

---

## 11. Tahapan Pengerjaan & Task Breakdown (Actionable Work Breakdown Structure)
*Daftar tugas terstruktur dan terurut (Atomic Tasks) dengan format checklist markdown `- [ ] **Task X.Y**`. Dirancang khusus agar pengguna dapat menginstruksikan AI Coding Assistant (Antigravity, Cursor, Claude Code, Roo Code, dll.) untuk mengeksekusi proyek langkah demi langkah secara terukur, modular, dan bebas dari kehabisan context window.*

> **MODE EKSEKUSI: PHASE (Bertahap per Fase)** — AI wajib menyelesaikan satu Fase penuh secara mandiri dalam satu putaran, lalu berhenti melapor dan menunggu konfirmasi user sebelum lanjut Fase berikutnya.

### Fase 1: Fondasi Proyek, UI/UX Neobrutalism, & Semua Halaman (Dummy Data)
*Tujuan: Membangun seluruh antarmuka visual Pendek-In secara 100% lengkap dan responsif dengan data dummy sebelum menyentuh database Supabase.*
- [ ] **Task 1.1 (Foundations & Design System Neobrutalism)**: Setup Next.js 15 + TypeScript + Tailwind CSS, konfigurasi `tailwind.config.ts` dengan palet warna Pendek-In (Primary Green `#00D26A`, Accent Lime `#B4FF39`, Black `#0A0A0A`, White, Cream `#F5F5F0`, Danger, Warning, Info), konfigurasi `next/font` (Space Grotesk, Archivo Black, Inter, Space Mono), instalasi Lucide React (`strokeWidth 2.5`), Recharts, `qrcode.react`, dan shadcn/ui components (Button, Card, Input, Dialog, Table, Badge, Dropdown, Tabs, Tooltip, Sheet, Toast) dengan styling neobrutalist (border hitam tebal + shadow keras tanpa blur).
- [ ] **Task 1.2 (Layouts & Persistent Navigation)**: Buat Root Layout, Public Header/Navbar (logo "Pendek-In" kotak hijau bergaris hitam) + Footer 4 kolom, Auth Layout (card besar cream + shadow keras 8px), Dashboard Layout Member (sidebar kiri 260px + header breadcrumb + avatar dropdown), dan Admin Layout (sidebar hitam + badge ADMIN merah) — semuanya responsive dengan mobile drawer.
- [ ] **Task 1.3 (Public Pages - Beranda & Fitur Hero)**: Buat halaman Beranda `/` lengkap: hero dengan input pemendekan besar, tombol "Pendekkan Sekarang!", riwayat cepat (local state), section fitur 4 kartu (Pemendekan, Kustom, QR Dinamis, Analitik), section "API untuk Developer" dengan code snippet, testimoni, FAQ accordion, dan CTA daftar.
- [ ] **Task 1.4 (Public Pages - Auth, Statis, & API Docs)**: Buat halaman `/masuk`, `/daftar` (form + tombol "Masuk dengan Google"), `/harga` (matrix fitur gratis), `/api-publik` (dokumentasi API dengan contoh cURL), `/tentang`, `/kontak` (form), `/syarat-ketentuan`, `/kebijakan-privasi`, `/404`, dan halaman redirect simulasi `/s/{slug}` (dengan dummy destination).
- [ ] **Task 1.5 (Member Area Pages - Fase UI)**: Buat `/dashboard` (4 stat card + grafik mini 7 hari + tabel 5 tautan terbaru), `/dashboard/tautan` (tabel CRUD dummy + search + filter + sort + aksi copy/edit/hapus via dropdown), `/dashboard/tautan/baru` (form lengkap + section "Kustom Back-Half" dengan cek ketersediaan dummy + preview kartu), `/dashboard/tautan/[id]` (tab Info/Analitik/QR), `/dashboard/tautan/[id]/qr` (editor warna + preview + tombol unduh PNG/SVG dummy), `/dashboard/analitik` (filter rentang waktu + 4 kartu metrik + 3 grafik + tabel top referrer/negara/device), `/dashboard/api-key` (list key dummy + modal Generate Key dengan banner "hanya tampil sekali"), `/dashboard/profil`, `/dashboard/notifikasi`.
- [ ] **Task 1.6 (Admin Area Pages - Fase UI)**: Buat `/admin` (stat global + grafik 30 hari + tabel user/tautan terbaru), `/admin/pengguna` (tabel + filter role/status + aksi ban/aktifkan/reset), `/admin/pengguna/[id]` (profil lengkap + daftar tautan + riwayat), `/admin/tautan` (tabel global + filter status + aksi blokir/hapus), `/admin/tautan/[id]` (detail + analitik + modal blokir dengan alasan), `/admin/domain-terblokir` (CRUD list domain), `/admin/kata-terlarang` (CRUD list reserved words), `/admin/log-aktivitas` (tabel audit log + filter waktu), dan `/admin/pengaturan` (form nama site, mode maintenance, batas rate-limit, template email).

### Fase 2: Database Supabase, Autentikasi, & Integrasi Data Dinamis
*Tujuan: Menghidupkan aplikasi dengan database Supabase nyata, sistem autentikasi Google + Email, Server Actions, dan mengikat seluruh halaman Fase 1 dengan data live.*
- [ ] **Task 2.1 (Supabase Project & Migrations)**: Buat proyek Supabase, tulis file `supabase/migrations/0001_init.sql` (tabel `profiles`, `links`, `clicks`, `api_keys`, `reserved_words`, `blocked_domains`, `audit_logs` + enum + index + RLS policy + trigger `handle_new_user`), jalankan migrasi, dan generate TypeScript types via `supabase gen types typescript`.
- [ ] **Task 2.2 (Authentication Google + Email & Middleware)**: Konfigurasi Google OAuth Provider di dashboard Supabase, setup `@supabase/ssr` dengan cookie handler, buat Server Actions `signIn`/`signUp`/`signInWithGoogle`/`signOut`, halaman callback `/auth/callback`, dan `middleware.ts` untuk melindungi rute `/dashboard/*` (member) & `/admin/*` (super_admin saja), validasi Zod pada form login/daftar.
- [ ] **Task 2.3 (Server Actions - CRUD Links & Reservasi Slug)**: Buat `createLink`, `updateLink`, `deleteLink`, `getUserLinks`, `getLinkDetail`, `checkSlugAvailability` dengan validasi Zod (URL, slug format, reserved words, blocked domains), generate slug acak 6 karakter, dan integrasi trigger update `click_count`.
- [ ] **Task 2.4 (Redirect Handler & Tracking Klik Non-Blocking)**: Implementasi route `/s/[slug]` — cari link aktif, catat klik ke tabel `clicks` secara fire-and-forget (hash IP pakai `IP_HASH_SALT`, parse user-agent untuk device/browser/OS, ambil `country` dari header), lalu `redirect()` ke `original_url`. Handle kasus link expired/blocked/not found.
- [ ] **Task 2.5 (Analitik & Agregasi)**: Buat Server Action `getAnalytics` untuk mengagregasi klik: total, unique, time-series per hari, top referrer/country/device, top 5 link. Integrasikan Recharts di `/dashboard/analitik` dan `/dashboard/tautan/[id]`.
- [ ] **Task 2.6 (API Keys & Public REST API v1)**: Buat halaman `/dashboard/api-key` fungsional (generate `pk_live_...` 32-char random, hash SHA-256 ke `api_keys.key_hash`, tampilkan sekali, list dengan prefix, revoke). Implementasi Route Handlers `/api/v1/links` (POST, GET), `/api/v1/links/[id]` (GET, DELETE), `/api/v1/links/[id]/analytics` dengan middleware autentikasi Bearer Token + rate-limit 120/menit.
- [ ] **Task 2.7 (QR Dinamis & Frontend Data Binding)**: Implementasi generator QR dengan `qrcode.react` (atau server-side), editor warna di `/dashboard/tautan/[id]/qr`, unduh PNG/SVG. Ganti seluruh dummy data Fase 1 dengan data live dari Supabase di semua halaman member & admin.
- [ ] **Task 2.8 (Admin Server Actions & Audit Log)**: Buat Server Action admin: ban/unban user, block/unblock link, CRUD `blocked_domains`, CRUD `reserved_words`, dan helper `logAudit()`. Ikat ke seluruh halaman `/admin/*`.

### Fase 3: Integrasi Email, Keamanan, SEO, Testing, & Deployment
*Tujuan: Menyempurnakan integrasi email, hardening keamanan, optimasi SEO & performa, uji end-to-end, dan rilis ke production.*
- [ ] **Task 3.1 (Email & Notifikasi)**: Konfigurasi template email Supabase (verifikasi, reset password), integrasi Resend untuk security alert (API Key dibuat, login perangkat baru) dan ringkasan mingguan opsional via Supabase Edge Function cron. Toggle preferensi di `/dashboard/notifikasi`.
- [ ] **Task 3.2 (Keamanan, Validasi, & Rate Limiting)**: Aktifkan **Zod** di semua Server Actions & Route Handlers, sanitasi input XSS di field `title`/`description`/`slug`, verifikasi RLS Supabase 100% tertutup, implementasi rate-limit Upstash Redis (guest 10/jam per IP untuk pemendekan publik, member 200/jam, API 120/menit).
- [ ] **Task 3.3 (SEO & Performa)**: Implementasi `generateMetadata` dinamis per halaman publik (title, meta description, Open Graph), `noindex` di `/s/[slug]` & halaman dashboard, tambahkan `sitemap.ts` & `robots.ts`, ISR/caching untuk halaman statis, optimasi `<Image>` Next.js, dan pastikan latency redirect `/s/[slug]` < 100ms (klik pencatatan non-blocking).
- [ ] **Task 3.4 (End-to-End Testing & Bugfix)**: Uji seluruh user journey: guest pemendekan → daftar Google → buat kustom link → generate QR → share → redirect tercatat → analitik muncul → generate API Key → konsumsi REST API → Super Admin moderasi. Perbaiki glitch responsive, bug relasi, dan optimasi query dengan index database.
- [ ] **Task 3.5 (Production Build & Deployment)**: Isi `.env.production` (Supabase URL, anon key, service role, IP_HASH_SALT, Resend key, Upstash), verifikasi `npm run build` sukses tanpa error, deploy ke Vercel (atau VPS/Docker), set custom domain, aktifkan HTTPS, jalankan smoke test pasca-deploy di production.

---

## 12. Master Starter Prompt (Siap Coding untuk AI Agent)
*Salin prompt di bawah ini ke AI Coding Assistant (Google Antigravity / Cursor / Claude Code / Roo Code / dll.) untuk memulai pengerjaan:*

```markdown
Halo! Kamu berperan sebagai Senior Fullstack Architect dan Lead Developer.
Saya ingin membangun aplikasi "Pendek-In" (URL Shortener bergaya Neobrutalism Hijau-Hitam-Putih) berdasarkan dokumen PRD ini.

Silakan baca file @PRD.md secara menyeluruh terlebih dahulu.

ATURAN EKSEKUSI (WAJIB DIPATUHI):
1. JANGAN PERNAH membuat semua kode atau file sekaligus dalam satu waktu — selalu kerjakan per TASK agar tidak error dan tidak kehabisan token/context window.
2. Mode eksekusi = PHASE (Bertahap per Fase). Kerjakan Bab 11 FASE DEMI FASE secara berurutan:
   - Fase 1: Fondasi Proyek, UI/UX Neobrutalism, & Semua Halaman dengan DUMMY DATA (Task 1.1 s/d 1.6).
   - Fase 2: Database Supabase, Autentikasi, & Integrasi Data Dinamis (Task 2.1 s/d 2.8).
   - Fase 3: Integrasi Email, Keamanan, SEO, Testing, & Deployment (Task 3.1 s/d 3.5).
3. Setelah satu FASE SELESAI secara utuh (semua task di fase tersebut tuntas & bisa dijalankan tanpa error), WAJIB BERHENTI, laporkan progres yang telah dikerjakan, tunjukkan bukti (struktur file, screenshot deskriptif, atau command output), lalu MINTA KONFIRMASI SAYA sebelum melanjutkan ke Fase berikutnya.
4. JANGAN PERNAH membuat halaman "Placeholder" atau "Sedang dalam pengembangan" — semua halaman wajib dibangun penuh dengan UI/UX & data dummy berkualitas di Fase 1 (contoh: "Dimas Pratama", "Buket Pernikahan Premium", dsb. — bukan Lorem Ipsum).
5. Selalu patuhi:
   - Tech Stack: Next.js 15 App Router + TypeScript + Supabase (Auth Google + Email, PostgreSQL dengan RLS, Storage) + Tailwind CSS + shadcn/ui.
   - Design System: Neobrutalism — border hitam tebal (2-3px), shadow keras tanpa blur (`shadow-[4px_4px_0px_0px_#0A0A0A]`), font tebal besar (Space Grotesk/Archivo Black untuk heading), palet Primary Green `#00D26A` + Accent Lime `#B4FF39` + Hitam `#0A0A0A` + Putih/Cream `#F5F5F0`.
   - Skema database & RLS policy seperti tertulis di Bab 10 PRD.
   - Validasi Zod di semua Server Action & Route Handler.
6. MANAJEMEN VERSI (GITHUB): Setiap kali kamu SELESAI mengerjakan 1 Task (contoh: Task 1.1 selesai) dan kode berjalan tanpa error, kamu WAJIB secara otomatis melakukan commit dan push ke GitHub menggunakan perintah terminal ini:
   `git add .`
   `git commit -m "feat: menyelesaikan [Nama Task]"`
   `git push`
   (Lakukan hal ini sebelum melapor kepadaku atau sebelum lanjut ke Task selanjutnya).
7. Setelah Fase 1 benar-benar selesai dan saya konfirmasi, baru lanjut ke Fase 2. Demikian seterusnya.

Jika kamu sudah membaca dan memahami PRD ini secara menyeluruh, silakan berikan:
1. Ringkasan singkat pemahamanmu terhadap Pendek-In (produk, fitur utama, tech stack, dan design system).
2. Konfirmasi struktur 3 Fase di Bab 11 yang akan kita eksekusi.
3. Tanyakan kesiapan saya untuk mulai mengeksekusi **Fase 1 dimulai dari Task 1.1 (Foundations & Design System Neobrutalism)**.
'''