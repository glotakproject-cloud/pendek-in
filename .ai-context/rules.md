# Aturan Coding & Pengembangan AI (rules.md)

Dokumen ini berisi pedoman wajib untuk AI Coding Assistant maupun tim pengembang dalam membangun dan memelihara proyek **Pendek-In**.

---

## 1. Prinsip Utama & Siklus Eksekusi

1. **Eksekusi Bertahap (Phase Mode)**:
   - Dilarang membuat semua kode atau file sekaligus dalam satu putaran.
   - Pekerjaan harus dibagi per fase sesuai Bab 11 PRD:
     - **Fase 1**: Fondasi Proyek, UI/UX Neobrutalism, & Seluruh Halaman dengan Dummy Data (Task 1.1 s/d 1.6).
     - **Fase 2**: Database Supabase, Autentikasi, & Integrasi Data Dinamis (Task 2.1 s/d 2.8).
     - **Fase 3**: Integrasi Email, Keamanan, SEO, Testing, & Production Build (Task 3.1 s/d 3.5).
   - Setelah satu fase tuntas, hentikan proses, laporkan hasil, dan tunggu konfirmasi pengguna sebelum masuk ke fase berikutnya.

2. **Dilarang Menggunakan Placeholder / Halaman Kosong**:
   - Dilarang membuat teks seperti "Sedang dalam pengembangan" atau "Coming Soon" tanpa layout lengkap.
   - Semua halaman wajib dibangun dengan tata letak visual utuh dan interaktif.
   - **Dilarang menggunakan "Lorem Ipsum"**. Wajib gunakan data dummy realistis berbahasa Indonesia (contoh: "Dimas Pratama", "Buket Pernikahan Premium", "Tutorial Copywriting UMKM").

---

## 2. Arsitektur & Standar Kode Next.js 15

1. **Framework & Paradigma**:
   - Gunakan **Next.js 15 App Router** dengan **TypeScript (Strict Mode)**.
   - Terapkan **React Server Components (RSC)** sebagai default.
   - Gunakan directive `'use client'` hanya pada komponen yang membutuhkan interaksi pengguna, browser API, atau React Hooks (`useState`, `useEffect`, form event handlers).

2. **Data Fetching & Mutasi**:
   - Gunakan **Server Actions** untuk operasi mutasi data (create, update, delete).
   - Gunakan **Next.js Route Handlers** (`app/api/v1/...`) untuk antarmuka Public REST API.
   - Hindari waterfall request dengan memanggil data secara paralel (`Promise.all`) atau mengoptimasi Suspense streaming.

3. **Validasi & Keamanan**:
   - Semua input formulir dan request payload wajib divalidasi menggunakan skema **Zod** sebelum diproses.
   - Lakukan sanitasi data string (terutama `title`, `description`, `slug`) untuk mencegah XSS.
   - Amankan API Key dengan enkripsi hashing **SHA-256** (hanya simpan hash di database, jangan simpan plain token).
   - Simpan IP pengunjung dalam bentuk **hash SHA-256 + salt rahasia** (`IP_HASH_SALT`) untuk pelacakan klik unik demi menjaga privasi.
   - Lindungi rute Member (`/dashboard/*`) dan Super Admin (`/admin/*`) via Next.js `middleware.ts` dan Row-Level Security (RLS) Supabase.

---

## 3. Standar UI/UX Neobrutalism

1. **Batas & Sudut (Border & Radius)**:
   - Border wajib: `border-2 border-black` atau `border-[3px] border-black` pada card, button, input, badge, dan modal.
   - Sudut: `rounded-none` (kotak tegas) atau maksimal `rounded-md`. Hindari penggunaan `rounded-full` kecuali pada badge status pill kecil atau avatar profil.

2. **Bayangan Keras (Hard Shadow)**:
   - Gunakan shadow tanpa blur: `shadow-[4px_4px_0px_0px_#0A0A0A]`.
   - Efek hover: geser tombol sedikit ke atas-kiri dengan shadow membesar: `hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_0px_#0A0A0A]`.
   - Efek aktif/klik: `active:translate-x-[2px] active:translate-y-[2px] active:shadow-none`.

3. **Tipografi & Ikon**:
   - Heading: Font **Space Grotesk** atau **Archivo Black** (bold, tegas, tight letter-spacing).
   - Body & Label: Font **Inter** (terbaca jelas).
   - Angka & Metrik: Font **Space Mono** (nuansa teknikal).
   - Ikon: **Lucide React** dengan ketebalan garis tegas (`strokeWidth={2.5}`).

4. **Warna Dasar**:
   - Primary: `#00D26A` (Green) & `#00A653` (Dark Green Hover)
   - Accent: `#B4FF39` (Lime)
   - Foreground / Border / Shadow: `#0A0A0A` (Black)
   - Backgrounds: `#FFFFFF` (White) & `#F5F5F0` (Cream / Off-white)
   - Accents status: Danger `#FF5C5C`, Warning `#FFD23F`, Info `#3B82F6`

---

## 4. Standar Database & Supabase

1. **Row Level Security (RLS)**:
   - RLS wajib selalu aktif di semua tabel publik (`profiles`, `links`, `clicks`, `api_keys`, `audit_logs`).
   - Member hanya boleh membaca dan mengubah data miliknya sendiri.
   - Super Admin memiliki akses baca/kelola menyeluruh melalui policy terverifikasi (`role = 'super_admin'`).
   - Tautan berstatus `active` diperbolehkan dibaca publik khusus untuk proses redirect handler `/{slug}`.

2. **Performa Redirect**:
   - Pencatatan analitik klik di route `/s/[slug]` wajib dijalankan secara **non-blocking (fire-and-forget)** agar waktu respon redirect ke target URL tetap di bawah 100 milidetik.
