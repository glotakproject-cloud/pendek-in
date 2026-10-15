import { z } from "zod";
import { sanitizeText } from "@/lib/security";

export const blockedDomainSchema = z.object({
  domain: z
    .string()
    .min(3, "Nama domain minimal 3 karakter")
    .max(100, "Nama domain maksimal 100 karakter")
    .transform((d) => d.trim().toLowerCase().replace(/^https?:\/\//, "").replace(/\/.*$/, "")),
  reason: z
    .string()
    .max(250, "Alasan maksimal 250 karakter")
    .optional()
    .transform((r) => (r ? sanitizeText(r, 250) : undefined)),
});

export const reservedWordSchema = z.object({
  word: z
    .string()
    .min(2, "Kata terlarang minimal 2 karakter")
    .max(50, "Kata terlarang maksimal 50 karakter")
    .transform((w) => w.trim().toLowerCase().replace(/[^a-z0-9_-]/g, "")),
});

export type BlockedDomainInput = z.infer<typeof blockedDomainSchema>;
export type ReservedWordInput = z.infer<typeof reservedWordSchema>;
