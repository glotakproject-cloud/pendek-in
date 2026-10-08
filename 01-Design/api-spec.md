# Public REST API Specification (api-spec.md)

Dokumen ini mendefinisikan spesifikasi antarmuka pemrograman aplikasi (**Pendek-In Public REST API v1**).

---

## 1. Konsep Dasar & Autentikasi

- **Base URL**: `https://pendek.in/api/v1` (atau `/api/v1` pada Next.js Route Handlers)
- **Format Pertukaran Data**: JSON (`Content-Type: application/json`)
- **Autentikasi**:
  Semua request wajib menyertakan header HTTP Authorization dengan format Bearer Token:
  ```http
  Authorization: Bearer pk_live_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
  ```
- **Rate Limiting**:
  - Batas standar: **120 request / menit** per API Key.
  - Header respon penyerta:
    - `X-RateLimit-Limit: 120`
    - `X-RateLimit-Remaining: 119`
    - `X-RateLimit-Reset: 1775704800`

---

## 2. Struktur Respon Standar

Semua endpoint menghasilkan respon dengan format seragam:

### A. Berhasil (Success Response)
```json
{
  "success": true,
  "data": { ... }
}
```

### B. Gagal (Error Response)
```json
{
  "success": false,
  "error": {
    "code": "SLUG_ALREADY_EXISTS",
    "message": "Custom slug 'promo-lebaran' sudah digunakan oleh pengguna lain."
  }
}
```

---

## 3. Daftar Endpoint API

### 1. Buat Tautan Baru
- **Method**: `POST`
- **URL**: `/api/v1/links`
- **Deskripsi**: Membuat tautan pendek baru untuk user terotentikasi.
- **Request Body**:
  ```json
  {
    "original_url": "https://tokobunga.id/katalog/buket-pernikahan-premium",
    "custom_slug": "buket-nikah-jkt", 
    "title": "Buket Pernikahan Jakarta",
    "description": "Tautan katalog promosi buket nikah",
    "tags": ["wedding", "promo"],
    "expires_at": "2026-12-31T23:59:59Z"
  }
  ```
  *(Catatan: `custom_slug`, `title`, `description`, `tags`, dan `expires_at` bersifat opsional)*
- **Response `201 Created`**:
  ```json
  {
    "success": true,
    "data": {
      "id": "c1f7b0e1-4c16-46b2-a42e-9d22fa998a12",
      "slug": "buket-nikah-jkt",
      "short_url": "https://pendek.in/s/buket-nikah-jkt",
      "original_url": "https://tokobunga.id/katalog/buket-pernikahan-premium",
      "title": "Buket Pernikahan Jakarta",
      "status": "active",
      "created_at": "2026-10-08T10:30:00Z"
    }
  }
  ```

---

### 2. Ambil Daftar Tautan (List Links)
- **Method**: `GET`
- **URL**: `/api/v1/links`
- **Query Parameters**:
  - `page` (integer, default: 1)
  - `limit` (integer, default: 20, max: 100)
  - `search` (string, filter pencarian judul/slug/url)
  - `status` (string, `active` | `expired` | `blocked`)
- **Response `200 OK`**:
  ```json
  {
    "success": true,
    "data": {
      "items": [
        {
          "id": "c1f7b0e1-4c16-46b2-a42e-9d22fa998a12",
          "slug": "buket-nikah-jkt",
          "short_url": "https://pendek.in/s/buket-nikah-jkt",
          "original_url": "https://tokobunga.id/katalog/buket-pernikahan-premium",
          "title": "Buket Pernikahan Jakarta",
          "status": "active",
          "click_count": 1247,
          "unique_click_count": 983,
          "created_at": "2026-10-08T10:30:00Z"
        }
      ],
      "pagination": {
        "page": 1,
        "limit": 20,
        "total_items": 42,
        "total_pages": 3
      }
    }
  }
  ```

---

### 3. Detail Tautan
- **Method**: `GET`
- **URL**: `/api/v1/links/{id}`
- **Deskripsi**: Mengambil data lengkap tautan berdasarkan ID.
- **Response `200 OK`**:
  ```json
  {
    "success": true,
    "data": {
      "id": "c1f7b0e1-4c16-46b2-a42e-9d22fa998a12",
      "slug": "buket-nikah-jkt",
      "short_url": "https://pendek.in/s/buket-nikah-jkt",
      "original_url": "https://tokobunga.id/katalog/buket-pernikahan-premium",
      "title": "Buket Pernikahan Jakarta",
      "description": "Tautan katalog promosi buket nikah",
      "tags": ["wedding", "promo"],
      "status": "active",
      "click_count": 1247,
      "unique_click_count": 983,
      "expires_at": "2026-12-31T23:59:59Z",
      "created_at": "2026-10-08T10:30:00Z",
      "updated_at": "2026-10-08T10:30:00Z"
    }
  }
  ```

---

### 4. Hapus Tautan
- **Method**: `DELETE`
- **URL**: `/api/v1/links/{id}`
- **Deskripsi**: Menghapus tautan pendek milik user secara permanen.
- **Response `200 OK`**:
  ```json
  {
    "success": true,
    "data": {
      "message": "Tautan berhasil dihapus."
    }
  }
  ```

---

### 5. Ringkasan Analitik Tautan
- **Method**: `GET`
- **URL**: `/api/v1/links/{id}/analytics`
- **Query Parameters**:
  - `range` (`24h` | `7d` | `30d` | `90d`, default: `7d`)
- **Response `200 OK`**:
  ```json
  {
    "success": true,
    "data": {
      "total_clicks": 1247,
      "unique_clicks": 983,
      "top_referrers": [
        { "name": "instagram.com", "count": 412 },
        { "name": "whatsapp.com", "count": 301 },
        { "name": "tiktok.com", "count": 189 }
      ],
      "top_countries": [
        { "country": "Indonesia", "count": 1180 },
        { "country": "Singapura", "count": 42 },
        { "country": "Malaysia", "count": 25 }
      ],
      "devices": {
        "mobile": 1012,
        "desktop": 203,
        "tablet": 32,
        "other": 0
      },
      "daily_stats": [
        { "date": "2026-10-01", "clicks": 140 },
        { "date": "2026-10-02", "clicks": 195 }
      ]
    }
  }
  ```

---

## 4. Endpoint Publik (Redirect Handler)

- **Method**: `GET`
- **URL**: `/s/{slug}`
- **Deskripsi**: Mengarahkan pengunjung ke `original_url`.
- **Mekanisme**:
  1. Cari baris di tabel `links` yang cocok dengan `slug` dan berstatus `active`.
  2. Jika ditemukan, catat data kunjungan (IP hash, geolokasi, user agent, referrer) ke tabel `clicks` secara asynchronous / non-blocking.
  3. Lakukan redirect HTTP (Status `307 Temporary Redirect` atau `308 Permanent Redirect`).
  4. Jika tautan berstatus `expired`, `blocked`, atau tidak ada, arahkan ke halaman `/404`.

---

## 5. Daftar Kode Kesalahan (Error Codes)

| HTTP Status | Error Code | Keterangan |
| :---: | :--- | :--- |
| `400` | `INVALID_URL` | URL tidak valid atau protokol `http/https` tidak didukung |
| `400` | `BLOCKED_DOMAIN` | Domain target terdaftar dalam daftar hitam (blacklist) |
| `400` | `RESERVED_SLUG` | Slug yang diminta adalah kata kunci sistem terlarang |
| `400` | `SLUG_ALREADY_EXISTS` | Slug kustom telah dipakai oleh pengguna lain |
| `401` | `UNAUTHORIZED` | API Key tidak valid, sudah dicabut, atau tidak disertakan |
| `403` | `FORBIDDEN` | Anda tidak memiliki izin untuk mengelola sumber daya ini |
| `404` | `LINK_NOT_FOUND` | Tautan dengan ID atau slug tersebut tidak ditemukan |
| `429` | `RATE_LIMIT_EXCEEDED` | Batas maksimum request per menit telah terlampaui |
| `500` | `INTERNAL_SERVER_ERROR`| Terjadi kesalahan pada server |
