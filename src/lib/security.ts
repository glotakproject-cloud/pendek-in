/**
 * Modul Keamanan: Sanitasi Input, Pencegahan XSS, dan Validasi URL (Anti-SSRF)
 * Sesuai Dokumen PRD Bab 8 & Task 3.2
 */

// Daftar IP/Host privat & berbahaya untuk perlindungan SSRF (Server-Side Request Forgery)
const BLOCKED_HOSTNAMES = new Set([
  "localhost",
  "127.0.0.1",
  "0.0.0.0",
  "::1",
  "169.254.169.254", // AWS/Cloud metadata endpoint
  "metadata.google.internal",
  "instance-data",
]);

/**
 * 1. Sanitasi teks umum (title, description, tags, dsb.)
 * Menghilangkan tag HTML, entitas script berbahaya, dan atribut on* (XSS prevention)
 */
export function sanitizeText(
  input: string | null | undefined,
  maxLength: number = 500
): string {
  if (!input) return "";

  // 1. Potong panjang string jika melebihi batas
  let text = input.trim().slice(0, maxLength);

  // 2. Bersihkan tag HTML (strip tags)
  text = text.replace(/<[^>]*>?/gm, "");

  // 3. Hapus pola berbahaya seperti javascript:, data:text/html, vbscript:
  text = text.replace(/(javascript|vbscript|data):/gi, "");

  // 4. Escape karakter berbahaya sisa
  text = text
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

  return text.trim();
}

/**
 * 2. Sanitasi Slug (Back-half URL)
 * Memastikan slug hanya terdiri dari karakter alfanumerik, strip, dan garis bawah
 */
export function sanitizeSlug(slug: string): string {
  if (!slug) return "";

  return slug
    .trim()
    .toLowerCase()
    .replace(/[\s_]+/g, "-") // Konversi spasi dan underscore menjadi tanda hubung
    .replace(/[^a-z0-9-]/g, "") // Hanya izinkan huruf kecil, angka, dan hyphen
    .replace(/-{2,}/g, "-") // Normalisasi multiple hyphen
    .replace(/^-+|-+$/g, "") // Hapus hyphen di awal dan akhir
    .slice(0, 50); // Maksimal 50 karakter
}

/**
 * 3. Validasi URL Mendalam & Pencegahan SSRF (Server-Side Request Forgery)
 * Memastikan URL memiliki protokol http/https yang valid dan tidak menargetkan IP lokal/internal
 */
export function validateUrlSecurity(urlString: string): {
  valid: boolean;
  error?: string;
  sanitizedUrl?: string;
} {
  try {
    const trimmed = urlString.trim();
    if (!trimmed) {
      return { valid: false, error: "URL tujuan tidak boleh kosong" };
    }

    const parsed = new URL(trimmed);

    // 1. Wajib protokol http atau https
    if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
      return {
        valid: false,
        error: "URL wajib menggunakan protokol http:// atau https://",
      };
    }

    const hostname = parsed.hostname.toLowerCase();

    // 2. Cek apakah menargetkan private host / internal cloud metadata
    if (BLOCKED_HOSTNAMES.has(hostname)) {
      return {
        valid: false,
        error: "URL tujuan dilarang mengarah ke host lokal atau server internal",
      };
    }

    // 3. Cek subnet private IPv4 (10.x.x.x, 192.168.x.x, 172.16-31.x.x)
    const ipv4Regex = /^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/;
    const ipMatch = hostname.match(ipv4Regex);
    if (ipMatch) {
      const first = parseInt(ipMatch[1], 10);
      const second = parseInt(ipMatch[2], 10);

      if (
        first === 10 ||
        (first === 172 && second >= 16 && second <= 31) ||
        (first === 192 && second === 168) ||
        first === 127 ||
        first === 0
      ) {
        return {
          valid: false,
          error: "URL tujuan dilarang mengarah ke rentang IP privat",
        };
      }
    }

    return {
      valid: true,
      sanitizedUrl: parsed.toString(),
    };
  } catch {
    return {
      valid: false,
      error: "Format URL tidak valid",
    };
  }
}
