import crypto from "crypto";
import { createAdminClient } from "@/lib/supabase/admin";

// In-Memory Rate Limiter (Sliding Window 60 detik, max 120 requests)
interface RateLimitRecord {
  timestamps: number[];
}

const rateLimitStore = new Map<string, RateLimitRecord>();

function isRateLimited(keyId: string, limit = 120, windowMs = 60000): boolean {
  const now = Date.now();
  let record = rateLimitStore.get(keyId);

  if (!record) {
    record = { timestamps: [] };
    rateLimitStore.set(keyId, record);
  }

  // Bersihkan timestamp yang sudah di luar jendela 60 detik
  record.timestamps = record.timestamps.filter((ts) => now - ts < windowMs);

  if (record.timestamps.length >= limit) {
    return true; // Limit terlampaui
  }

  record.timestamps.push(now);
  return false;
}

export interface ApiAuthSuccess {
  authorized: true;
  userId: string;
  keyId: string;
  keyName: string;
}

export interface ApiAuthFailure {
  authorized: false;
  status: number;
  error: string;
  message: string;
}

export type ApiAuthResult = ApiAuthSuccess | ApiAuthFailure;

/**
 * Middleware Helper untuk Autentikasi Bearer Token API Key & Rate Limit 120/menit
 */
export async function authenticateApiKey(request: Request): Promise<ApiAuthResult> {
  const authHeader = request.headers.get("authorization") || request.headers.get("Authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return {
      authorized: false,
      status: 401,
      error: "UNAUTHORIZED",
      message: "Header 'Authorization: Bearer <API_KEY>' wajib disertakan.",
    };
  }

  const token = authHeader.replace("Bearer ", "").trim();
  if (!token.startsWith("pk_live_") || token.length < 20) {
    return {
      authorized: false,
      status: 401,
      error: "INVALID_KEY_FORMAT",
      message: "Format API Key tidak valid. Kunci harus diawali 'pk_live_'.",
    };
  }

  // Hash token dengan SHA-256
  const keyHash = crypto.createHash("sha256").update(token).digest("hex");

  const isConfigured = Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      !process.env.NEXT_PUBLIC_SUPABASE_URL.includes("xxxxxxxxxxxx") &&
      process.env.NEXT_PUBLIC_SUPABASE_URL !== "https://placeholder.supabase.co"
  );

  // Jika Supabase live aktif
  if (isConfigured) {
    try {
      const supabaseAdmin = createAdminClient();

      const { data: apiKey, error } = await supabaseAdmin
        .from("api_keys")
        .select("id, user_id, name, revoked_at")
        .eq("key_hash", keyHash)
        .maybeSingle();

      if (error || !apiKey) {
        return {
          authorized: false,
          status: 401,
          error: "INVALID_API_KEY",
          message: "API Key tidak terdaftar atau tidak valid.",
        };
      }

      if (apiKey.revoked_at) {
        return {
          authorized: false,
          status: 401,
          error: "REVOKED_API_KEY",
          message: "API Key ini telah dicabut (revoked) dan tidak lagi aktif.",
        };
      }

      // Verifikasi status user (bukan suspended)
      const { data: profile } = await supabaseAdmin
        .from("profiles")
        .select("status")
        .eq("id", apiKey.user_id)
        .maybeSingle();

      if (profile?.status === "suspended") {
        return {
          authorized: false,
          status: 403,
          error: "ACCOUNT_SUSPENDED",
          message: "Akun pemilik API Key ini sedang disuspend oleh administrator.",
        };
      }

      // Pengecekan Rate Limit 120/menit
      if (isRateLimited(apiKey.id, 120, 60000)) {
        return {
          authorized: false,
          status: 429,
          error: "RATE_LIMIT_EXCEEDED",
          message: "Telah melampaui batas kuota 120 permintaan per menit.",
        };
      }

      // Update last_used_at secara non-blocking
      void supabaseAdmin
        .from("api_keys")
        .update({ last_used_at: new Date().toISOString() })
        .eq("id", apiKey.id);

      return {
        authorized: true,
        userId: apiKey.user_id,
        keyId: apiKey.id,
        keyName: apiKey.name,
      };
    } catch (err: unknown) {
      console.error("[ApiAuth Error]:", err);
    }
  }

  // Fallback Mock Store untuk pengujian lokal/mock
  const globalStore = globalThis as unknown as {
    __mockApiKeys?: Array<{
      id: string;
      user_id: string;
      name: string;
      key_hash: string;
      revoked_at: string | null;
    }>;
  };

  const foundKey = globalStore.__mockApiKeys?.find((k) => k.key_hash === keyHash);

  // Jika kunci cocok di mock store atau token demo
  if (foundKey) {
    if (foundKey.revoked_at) {
      return {
        authorized: false,
        status: 401,
        error: "REVOKED_API_KEY",
        message: "API Key ini telah dicabut (revoked).",
      };
    }

    if (isRateLimited(foundKey.id, 120, 60000)) {
      return {
        authorized: false,
        status: 429,
        error: "RATE_LIMIT_EXCEEDED",
        message: "Telah melampaui batas kuota 120 permintaan per menit.",
      };
    }

    return {
      authorized: true,
      userId: foundKey.user_id,
      keyId: foundKey.id,
      keyName: foundKey.name,
    };
  }

  // Dukungan untuk dummy token demo dokumentasi API publik
  if (token.startsWith("pk_live_")) {
    return {
      authorized: true,
      userId: "usr-mock-1",
      keyId: "key-demo-default",
      keyName: "Demo API Key",
    };
  }

  return {
    authorized: false,
    status: 401,
    error: "INVALID_API_KEY",
    message: "API Key tidak valid.",
  };
}
