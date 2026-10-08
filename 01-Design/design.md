# UI/UX & Design System Guide (design.md)

Dokumen ini adalah acuan visual resmi untuk implementasi gaya **Neobrutalisme** pada antarmuka aplikasi **Pendek-In**.

---

## 1. Filosofi & Vibe Desain

Pendek-In mengusung gaya **Neobrutalism**:
- **Berani & Kontras Tinggi**: Elemen dipisahkan secara tegas dengan garis batas (border) hitam pekat dan bayangan tanpa blur.
- **Snappy & Terasa Hidup**: Animasi mikro cepat (durasi transisi 100ms) saat interaksi hover atau klik.
- **Retro-Futuristik**: Menggabungkan tipografi modern geometris dengan aksen warna pop (hijau mint dan lime neon).
- **Struktur Geometris**: Tata letak kotak tegas, minimalis, dan fungsional tanpa gradien berlebihan atau efek glassmorphism/blur.

---

## 2. Palet Warna (Color Tokens)

| Token Name | Nilai HEX | Kegunaan / Semantic |
| :--- | :--- | :--- |
| `primary` | `#00D26A` | Tombol CTA utama, badge aktif, aksen header tabel |
| `primary-hover`| `#00A653` | State hover untuk tombol utama |
| `accent-lime` | `#B4FF39` | Sorotan visual, kartu sorotan, aksen grafik |
| `black` | `#0A0A0A` | Teks utama, border 2-3px, hard shadow |
| `white` | `#FFFFFF` | Background utama, isi input, kartu putih |
| `cream` | `#F5F5F0` | Background panel samping, section selang-seling, card sekunder |
| `danger` | `#FF5C5C` | Tombol hapus, status blokir, badge error |
| `warning` | `#FFD23F` | Status tautan kedaluwarsa, peringatan |
| `info` | `#3B82F6` | Status informasional, tooltip |

---

## 3. Sistem Tipografi (Typography)

| Elemen | Font Family | Weight | Kegunaan |
| :--- | :--- | :--- | :--- |
| **Heading** | `Space Grotesk` / `Archivo Black` | 700 - 900 | Judul H1-H4, logo, display teks promo |
| **Body & UI** | `Inter` | 400, 500, 700 | Paragraf, label form, teks tombol, navigasi |
| **Data & Stats**| `Space Mono` | 400, 700 | Angka statistik klik, URL pendek, token API, kode |

- **Skala Ukuran Heading**:
  - H1 Display: `3.5rem` (56px) di Desktop, `2.25rem` (36px) di Mobile.
  - H2 Section: `2.25rem` (36px) di Desktop, `1.75rem` (28px) di Mobile.
  - H3 Card Title: `1.5rem` (24px).

---

## 4. Spesifikasi Komponen Neobrutalism

### A. Border & Radius
- **Border Wajib**: `border-2 border-black` atau `border-[3px] border-black` di setiap kontainer interaktif.
- **Border Radius**: `rounded-none` (default kotak tegas) atau maksimal `rounded-md` (maks. 6px). Hindari bentuk pill/lingkaran penuh kecuali pada badge status kecil dan avatar profil pengguna.

### B. Bayangan Keras (Hard Shadow)
- **Normal State**: `shadow-[4px_4px_0px_0px_#0A0A0A]`
- **Hover State**: `hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_0px_#0A0A0A]`
- **Active / Pressed State**: `active:translate-x-[2px] active:translate-y-[2px] active:shadow-none`
- **Modal / Floating Card**: `shadow-[8px_8px_0px_0px_#0A0A0A]`

### C. Komponen Utama
1. **Button**:
   - *Primary*: Background `#00D26A`, teks hitam, border hitam 2-3px, hard shadow 4px.
   - *Secondary / Outline*: Background putih/cream, teks hitam, border hitam 2-3px, hard shadow 4px.
   - *Destructive*: Background `#FF5C5C`, teks putih/hitam, border hitam 2-3px, hard shadow 4px.
2. **Card**:
   - Background putih (`#FFFFFF`) atau cream (`#F5F5F0`), border hitam 2-3px, hard shadow 4px, padding minimal `1.5rem` (24px).
3. **Form Input**:
   - Background `#FFFFFF`, border hitam 2px, teks font Inter, focus outline tebal berwarna hijau `#00D26A` tanpa blur ring.
4. **Badge**:
   - Border hitam 1.5-2px, background solid sesuai status (`#00D26A` aktif, `#FFD23F` kedaluwarsa, `#FF5C5C` diblokir), teks huruf kapital kecil tebal.
5. **Tabel Data**:
   - Header tabel berlatar belakang `#00D26A` dengan garis pemisah hitam tegas.
   - Baris tabel selang-seling putih dan cream (`#F5F5F0`), hover highlight `#B4FF39`.
6. **Modal / Dialog**:
   - Overlay latar belakang 40% hitam pekat tanpa backdrop-blur.
   - Kotak modal berlatar putih dengan border hitam 3px dan hard shadow 8px.

---

## 5. Arsitektur Layout Halaman

1. **Public Layout** (`/`, `/harga`, `/api-publik`, `/tentang`, `/kontak`):
   - **Header**: Logo kotak hijau bertuliskan "Pendek-In", menu navigasi dengan hover underline tegas, tombol CTA "Masuk" (outline) dan "Daftar" (hijau).
   - **Footer**: 4 kolom informasi (Produk, Pengembang, Perusahaan, Hukum) dengan copyright dan tautan media sosial.
2. **Auth Layout** (`/masuk`, `/daftar`):
   - Tanpa header navigasi penuh, terpusat di tengah layar.
   - Kartu form Neobrutalist berlatar cream dengan shadow 8px.
3. **Dashboard Member Layout** (`/dashboard/*`):
   - **Sidebar Kiri**: Lebar tetap 260px, background putih, border kanan hitam 2px, logo di atas, daftar menu dengan icon tebal (Lucide `strokeWidth={2.5}`).
   - **Header Atas**: Breadcrumb navigasi dan profil avatar dropdown.
   - **Main Content**: Padding luas, kartu statistik, dan area kerja tabel/analitik.
   - **Mobile**: Sidebar otomatis menjadi collapsible drawer.
4. **Admin Layout** (`/admin/*`):
   - Struktur serupa dashboard, dengan sidebar berlatar hitam pekat (`#0A0A0A`) dan teks putih.
   - Badge merah terang bertuliskan "SUPER ADMIN" di header atas.
