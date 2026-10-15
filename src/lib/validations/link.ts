import { z } from "zod";
import crypto from "crypto";
import { sanitizeText, sanitizeSlug, validateUrlSecurity } from "@/lib/security";

// ==========================================
// SKEMA VALIDASI ZOD UNTUK TAUTAN (PRD BAB 8 & 10)
// ==========================================

export const checkSlugSchema = z.object({
  slug: z
    .string()
    .min(3, "Slug kustom minimal 3 karakter")
    .max(50, "Slug kustom maksimal 50 karakter")
    .transform((val) => sanitizeSlug(val))
    .refine(
      (val) => /^[a-z0-9_-]+$/.test(val),
      "Slug hanya boleh berisi huruf, angka, tanda strip (-), atau garis bawah (_)"
    ),
});

export const createLinkSchema = z.object({
  original_url: z
    .string()
    .min(1, "URL Asli wajib diisi")
    .refine((val) => validateUrlSecurity(val).valid, {
      message: "Format URL tidak valid atau mengarah ke host lokal/terlarang (SSRF protection)",
    })
    .transform((val) => validateUrlSecurity(val).sanitizedUrl || val.trim()),
  custom_slug: z
    .string()
    .optional()
    .transform((val) => (val?.trim() ? sanitizeSlug(val) : undefined)),
  title: z
    .string()
    .max(150, "Judul tautan maksimal 150 karakter")
    .optional()
    .transform((val) => (val?.trim() ? sanitizeText(val, 150) : undefined)),
  description: z
    .string()
    .max(500, "Deskripsi tautan maksimal 500 karakter")
    .optional()
    .transform((val) => (val?.trim() ? sanitizeText(val, 500) : undefined)),
  tags: z
    .array(z.string().transform((t) => sanitizeText(t, 30)))
    .optional()
    .default([]),
  expires_at: z
    .string()
    .optional()
    .transform((val) => (val?.trim() === "" ? undefined : val?.trim())),
  password: z
    .string()
    .min(4, "Kata sandi tautan minimal 4 karakter")
    .max(50, "Kata sandi tautan maksimal 50 karakter")
    .optional()
    .transform((val) => (val?.trim() === "" ? undefined : val?.trim())),
});

export const updateLinkSchema = z.object({
  id: z.string().min(1, "ID Tautan wajib diisi"),
  original_url: z
    .string()
    .min(1, "URL Asli wajib diisi")
    .refine((val) => validateUrlSecurity(val).valid, {
      message: "Format URL tidak valid atau mengarah ke host lokal/terlarang (SSRF protection)",
    })
    .transform((val) => validateUrlSecurity(val).sanitizedUrl || val.trim()),
  title: z
    .string()
    .max(150, "Judul tautan maksimal 150 karakter")
    .nullish()
    .transform((val) => (val?.trim() ? sanitizeText(val, 150) : val)),
  description: z
    .string()
    .max(500, "Deskripsi tautan maksimal 500 karakter")
    .nullish()
    .transform((val) => (val?.trim() ? sanitizeText(val, 500) : val)),
  tags: z
    .array(z.string().transform((t) => sanitizeText(t, 30)))
    .optional(),
  status: z.enum(["active", "expired", "blocked"]).optional(),
  expires_at: z.string().nullish(),
  password: z.string().nullish(),
});

export type CreateLinkInput = z.infer<typeof createLinkSchema>;
export type UpdateLinkInput = z.infer<typeof updateLinkSchema>;

/**
 * Generate slug acak 6 karakter (base62 dengan karakter aman tanpa 0, O, 1, l, I)
 */
export function generateRandomSlug(length = 6): string {
  const chars = "abcdefghjkmnpqrstuvwxyz23456789";
  let result = "";
  const randomBytes = crypto.randomBytes(length);
  for (let i = 0; i < length; i++) {
    result += chars[randomBytes[i] % chars.length];
  }
  return result;
}
