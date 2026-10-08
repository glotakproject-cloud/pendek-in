# Tech Stack (tech-stack.md)

Dokumen ini merangkum seluruh teknologi, library, dan infrastruktur yang digunakan dalam pembangunan aplikasi **Pendek-In**.

---

## 1. Core Framework & Bahasa Pemrograman

- **Runtime / Framework**: [Next.js 15](https://nextjs.org/) (App Router, React Server Components, Server Actions, Route Handlers)
- **Bahasa**: [TypeScript](https://www.typescriptlang.org/) (Strict Type Checking)
- **Node.js**: LTS (v20+ disarankan)
- **Package Manager**: `npm` / `pnpm`

---

## 2. Antarmuka Pengguna & Desain (UI/UX)

- **Styling**: [Tailwind CSS](https://tailwindcss.com/) dengan ekstensi kustom token warna, border, dan hard shadow Neobrutalism.
- **Komponen UI Dasar**: [shadcn/ui](https://ui.shadcn.com/) (Button, Card, Input, Dialog, Table, Badge, Dropdown Menu, Tabs, Tooltip, Sheet, Toast) dengan modifikasi styling Neobrutalist.
- **Ikon**: [Lucide React](https://lucide.dev/) (dengan prop `strokeWidth={2.5}` untuk garis tebal).
- **Tipografi** (diimpor via `next/font/google`):
  - **Space Grotesk** / **Archivo Black**: Heading & Logo (Bold & Retro-Futuristik)
  - **Inter**: Body text & Label antarmuka
  - **Space Mono**: Data numerik, kode, dan metrik dashboard
- **Visualisasi Data & Grafik**: [Recharts](https://recharts.org/) (Line chart, Bar chart untuk analitik klik harian & perbandingan perangkat/negara).
- **Generator Kode QR**: `qrcode.react` (Kustomisasi warna dinamis, ekspor SVG & PNG).

---

## 3. Backend, Database, & Autentikasi

- **Database**: [Supabase](https://supabase.com/) PostgreSQL (dengan fitur pgcrypto, uuid-ossp, dan Row Level Security).
- **Autentikasi**: Supabase Auth via paket `@supabase/ssr`
  - Google OAuth Provider
  - Email / Password Login & Registrasi
- **Storage**: Supabase Storage (penyimpanan gambar profil / avatar).
- **Validasi Data**: [Zod](https://zod.dev/) untuk validasi form, Server Actions, dan REST API payload.
- **Enkripsi & Hashing**: Modul bawaan `crypto` Node.js (SHA-256) untuk API Key token hashing dan anonymization IP address pengunjung.

---

## 4. Layanan Eksternal & Infrastruktur

- **Email Service**:
  - Supabase Auth Email (Konfirmasi akun & Reset password).
  - [Resend](https://resend.com/) untuk email transaksional khusus (Peringatan keamanan API Key baru & Ringkasan mingguan).
- **Rate Limiting & Caching**: [Upstash Redis](https://upstash.com/) (`@upstash/ratelimit` & `@upstash/redis`) untuk membatasi request pemendekan publik dan kuota REST API.
- **Hosting & Deployment**: [Vercel](https://vercel.com/) (dioptimalkan untuk edge network & header geolokasi `x-vercel-ip-country`).

---

## 5. Ringkasan Dependencies Utama (`package.json`)

```json
{
  "dependencies": {
    "next": "^15.0.0",
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "typescript": "^5.0.0",
    "@supabase/supabase-js": "^2.40.0",
    "@supabase/ssr": "^0.5.0",
    "zod": "^3.23.0",
    "lucide-react": "^0.400.0",
    "recharts": "^2.12.0",
    "qrcode.react": "^3.1.0",
    "clsx": "^2.1.0",
    "tailwind-merge": "^2.3.0",
    "resend": "^3.2.0",
    "@upstash/redis": "^1.30.0",
    "@upstash/ratelimit": "^1.1.0"
  },
  "devDependencies": {
    "tailwindcss": "^3.4.0",
    "postcss": "^8.4.0",
    "autoprefixer": "^10.4.0",
    "@types/node": "^20.0.0",
    "@types/react": "^19.0.0",
    "@types/react-dom": "^19.0.0"
  }
}
```
