# ⚡ Pendek-In — Modern Neobrutalism URL Shortener

<div align="center">

![Next.js](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-Auth%20%26%20Database-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-00D26A?style=for-the-badge)

<p align="center">
  <strong>Layanan pemendek tautan modern dengan gaya visual Neobrutalisme yang berani, cepat, dan kaya fitur.</strong><br />
  Dilengkapi kustomisasi back-half URL, generator QR dinamis, analitik klik real-time, perlindungan keamanan tingkat tinggi, serta Public REST API untuk developer.
</p>

[Fitur Utama](#-fitur-utama) • [Tech Stack](#-tech-stack) • [Panduan Instalasi](#-cara-instalasi--menjalankan-proyek) • [Struktur Folder](#-struktur-folder) • [Dokumentasi API & Deployment](#-dokumentasi-terkait) • [Lisensi](#-lisensi)

</div>

---

## 🎨 Karakteristik Desain (Neobrutalism Design System)

Pendek-In dirancang dengan estetika **Neobrutalism** yang tegas, modern, dan fungsional:

- **Border & Shadow**: Garis luar hitam tegas (`2px` - `3px` solid `#0A0A0A`) dengan bayangan keras tanpa blur (`shadow-[4px_4px_0px_#0A0A0A]`).
- **Palet Warna Kurasi**:
  - 🟢 **Primary Green**: `#00D26A`
  - 🟡 **Accent Lime**: `#B4FF39`
  - ⚫ **Dark / Black**: `#0A0A0A`
  - ⚪ **Clean White**: `#FFFFFF`
  - 🍦 **Background Cream**: `#F5F5F0`
  - 🔴 **Danger / Warning / Info**: `#FF5C5C` / `#FFD23F` / `#3B82F6`
- **Tipografi Berkarakter**:
  - `Archivo Black` & `Space Grotesk` untuk heading tebal & kuat.
  - `Inter` untuk kenyamanan membaca teks panjang dan formulir.
  - `Space Mono` untuk URL pendek, kode slug, token, dan representasi angka.
- **Ikonografi Presisi**: Lucide React dengan ketebalan garis kustom `strokeWidth={2.5}`.

---

## 🛠 Tech Stack

### Frontend & Core Framework
- **Framework**: [Next.js 15 (App Router)](https://nextjs.org/)
- **Bahasa**: [TypeScript 5](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) + [tailwindcss-animate](https://github.com/jamiebuilds/tailwindcss-animate)
- **Komponen UI**: [shadcn/ui](https://ui.shadcn.com/) (Radix UI Primitives)
- **Ikon**: [Lucide React](https://lucide.dev/) (`strokeWidth 2.5`)
- **Visualisasi Data & Grafik**: [Recharts](https://recharts.org/)
- **QR Code Engine**: `qrcode.react` (Canvas & SVG render)
- **Notifikasi Toast**: [Sonner](https://sonner.emilkowal.ski/)

### Backend, Database & Keamanan
- **Backend & Database**: [Supabase](https://supabase.com/) (PostgreSQL dengan 100% Row Level Security)
- **Autentikasi**: Supabase Auth (`@supabase/ssr`) dengan Google OAuth & Email/Password
- **Validasi Skema & Sanitasi**: [Zod](https://zod.dev/) + Modul Sanitasi Input Anti-XSS & Anti-SSRF
- **Rate Limiting**: [Upstash Redis](https://upstash.com/) (`@upstash/ratelimit`) dengan In-Memory Fallback
- **Layanan Email**: [Resend](https://resend.com/) untuk security alert & Supabase Edge Functions cron

---

## 🚀 Fitur Utama

> *Berikut adalah rangkuman kapabilitas utama sistem yang siap digunakan atau dikembangkan lebih lanjut:*

- ⚡ **Pemendekan Tautan Kilat (Guest & Member)**:
  - *Deskripsi*: Pemendekan instan tanpa login untuk tamu serta penyimpanan permanen tautan untuk pengguna terdaftar.
- 🏷️ **Kustom Back-Half (Slug Kustom)**:
  - *Deskripsi*: Kustomisasi slug unik branding dengan pengecekan ketersediaan instan serta pencegahan reserved words.
- 📱 **QR Code Dinamis & Editor Warna**:
  - *Deskripsi*: Pembuatan kode QR otomatis per tautan dengan kustomisasi warna foreground/background dan unduhan format PNG/SVG resolusi tinggi.
- 📊 **Analitik & Agregasi Real-Time**:
  - *Deskripsi*: Pelacakan total klik, pengunjung unik, grafik time-series, referensi traffic, asal negara, dan jenis perangkat.
- 🔒 **Proteksi Kata Sandi & Masa Berlaku Tautan**:
  - *Deskripsi*: Kunci akses tautan sensitif dengan kata sandi (SHA-256) serta penetapan tanggal kadaluarsa (*expiration date*).
- 🔑 **API Key Management & Public REST API v1**:
  - *Deskripsi*: Pembuatan token `pk_live_...` untuk developer mengelola tautan secara terprogram dengan batas rate limit 120 req/menit.
- 🛡️ **Super Admin Dashboard & Moderasi Konten**:
  - *Deskripsi*: Manajemen pengguna (ban/unban), moderasi pemblokiran tautan berbahaya, kelola blacklist domain & kata terlarang, serta audit log lengkap.
- 📧 **Notifikasi & Keamanan Email**:
  - *Deskripsi*: Security alert otomatis saat pembuatan API Key baru atau login dari perangkat tak dikenal, serta laporan ringkasan mingguan (*weekly digest*).

---

## 💻 Cara Instalasi & Menjalankan Proyek

Pastikan Anda telah menginstal **Node.js 18+** (direkomendasikan Node.js 20 LTS) dan package manager favorit Anda (`npm`, `pnpm`, atau `yarn`).

### 1. Clone Repository

```bash
git clone https://github.com/glotakproject-cloud/pendek-in.git
cd pendek-in
```

### 2. Instalasi Dependensi

Pilih salah satu package manager berikut:

```bash
# Menggunakan npm
npm install

# Menggunakan pnpm
pnpm install

# Menggunakan yarn
yarn install
```

### 3. Konfigurasi Variabel Lingkungan (`.env.local`)

Salin file contoh environment ke `.env.local`:

```bash
cp .env.example .env.local
```

Buka `.env.local` dan lengkapi kredensial Anda:

```env
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_APP_NAME=Pendek-In

# Supabase Credentials
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Keamanan & Analitik
IP_HASH_SALT=your_super_secret_ip_salt_random_string

# Email (Resend)
RESEND_API_KEY=re_your_resend_api_key
EMAIL_FROM=Pendek-In <notifications@pendek.in>

# Rate Limiting (Upstash Redis) - Opsional di lokal, otomatis fallback ke memory
UPSTASH_REDIS_REST_URL=https://your-database.upstash.io
UPSTASH_REDIS_REST_TOKEN=your-upstash-token
```

> 💡 *Catatan: Jika kredensial Supabase, Resend, atau Upstash belum diisi, aplikasi akan otomatis berjalan dalam mode simulasi interaktif (Mock Store) yang ramah pengembangan lokal tanpa error.*

### 4. Menjalankan Server Development

```bash
npm run dev
# atau: pnpm dev / yarn dev
```

Buka peramban Anda di [http://localhost:3000](http://localhost:3000) untuk mulai menjelajahi aplikasi Pendek-In.

### 5. Build untuk Produksi

Untuk memvalidasi kesiapan deployment dan kompilasi static pages:

```bash
npm run build
npm start
```

---

## 📂 Struktur Folder

Aplikasi menggunakan arsitektur **Next.js 15 App Router** yang modular dan terstruktur rapi:

```text
pendek-in/
├── .ai-context/                # Dokumen PRD, panduan aturan, dan tech stack
├── public/                     # Aset statis publik (favicon, gambar, og-image)
├── scripts/                    # Script pengujian otomatis (smoke test E2E)
├── supabase/                   # Migrasi SQL database, fungsi edge, & template email
│   ├── email-templates/        # Template konfirmasi pendaftaran & reset password
│   ├── functions/              # Supabase Edge Functions (Weekly Digest Cron)
│   └── migrations/             # Migrasi skema PostgreSQL (0001 s/d 0003)
├── src/
│   ├── actions/                # Server Actions (auth, links, profile, admin, analytics)
│   ├── app/                    # Routing App Router
│   │   ├── (admin)/            # Route group khusus Super Admin (/admin/*)
│   │   ├── (auth)/             # Route group autentikasi (/masuk, /daftar)
│   │   ├── (dashboard)/        # Route group Dashboard Member (/dashboard/*)
│   │   ├── (public)/           # Halaman publik (Beranda, Harga, Tentang, Kontak, API)
│   │   ├── api/v1/             # Route Handlers Public REST API v1
│   │   ├── auth/callback/      # OAuth callback handler Supabase
│   │   ├── s/[slug]/           # Redirect handler & tracking klik non-blocking
│   │   ├── layout.tsx          # Root Layout & Global SEO Configuration
│   │   ├── robots.ts           # Generator robots.txt otomatis
│   │   └── sitemap.ts          # Generator sitemap.xml otomatis
│   ├── components/             # Komponen UI Reusable
│   │   ├── home/               # Komponen spesifik beranda & hero
│   │   ├── layouts/            # Navbar, Footer, Sidebar Member & Admin
│   │   ├── links/              # Komponen pengelolaan tautan & password gate
│   │   └── ui/                 # Desain sistem shadcn/ui bergaya Neobrutalism
│   ├── lib/                    # Helper modul utilitas
│   │   ├── supabase/           # Client Supabase (browser, server, admin)
│   │   ├── validations/        # Skema validasi Zod (link, auth, admin)
│   │   ├── email.ts            # Integrasi Resend client & template alert
│   │   ├── rate-limit.ts       # Rate limiter Upstash Redis + in-memory sliding window
│   │   └── security.ts         # Sanitasi XSS & validasi URL anti-SSRF
│   └── types/                  # Definisi TypeScript & Supabase database types
├── DEPLOYMENT.md               # Panduan pendeployan lengkap ke Vercel / VPS Docker
├── Dockerfile                  # Multi-stage production container build
├── tailwind.config.ts          # Konfigurasi token desain Neobrutalisme & warna
└── tsconfig.json               # Konfigurasi TypeScript compiler
```

---

## 📖 Dokumentasi Terkait

- 📘 [Panduan Deployment Produksi (`DEPLOYMENT.md`)](./DEPLOYMENT.md) — Panduan integrasi Vercel, Docker, pengaturan DNS, dan SSL HTTPS.
- 🌐 [Dokumentasi Public REST API v1 (`/api-publik`)](http://localhost:3000/api-publik) — Spesifikasi lengkap endpoint cURL untuk developer.
- 📋 [Dokumen Product Requirements Document (`PRD.md`)](./.ai-context/PRD.md) — Rincian arsitektur, basis data, dan roadmap proyek.

---

## 🤝 Kontribusi

Kontribusi selalu terbuka lebar! Jika Anda ingin membantu menyempurnakan Pendek-In:

1. *Fork* repository ini.
2. Buat branch fitur baru (`git checkout -b feature/FiturKeren`).
3. Lakukan commit perubahan Anda (`git commit -m 'feat: menambahkan fitur keren'`).
4. *Push* ke branch Anda (`git push origin feature/FiturKeren`).
5. Buat sebuah *Pull Request* baru.

---

## 📄 Lisensi

Proyek ini didistribusikan di bawah lisensi **MIT**. Silakan lihat berkas [LICENSE](./LICENSE) untuk informasi selengkapnya.

---

<div align="center">
  Dibuat dengan ❤️ dan semangat <strong>Neobrutalisme</strong> oleh <strong>Tim Pendek-In</strong>.
</div>
