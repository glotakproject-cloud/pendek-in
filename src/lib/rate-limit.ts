/**
 * Modul Rate Limiting Terintegrasi (Upstash Redis + In-Memory Fallback)
 * Sesuai Dokumen PRD Bab 8 & Task 3.2
 *
 * Kebijakan Pembatasan:
 * 1. Guest: 10 per jam per IP (pemendekan link publik di Beranda)
 * 2. Member: 200 per jam per User ID (pemendekan link via Dashboard)
 * 3. Public REST API v1: 120 per menit per API Key Hash
 */

import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

// Cek apakah kredensial Upstash Redis tersedia di environment
const upstashUrl = process.env.UPSTASH_REDIS_REST_URL;
const upstashToken = process.env.UPSTASH_REDIS_REST_TOKEN;
const isUpstashConfigured = Boolean(
  upstashUrl &&
    upstashToken &&
    !upstashUrl.includes("placeholder") &&
    !upstashToken.includes("placeholder")
);

const redis = isUpstashConfigured
  ? new Redis({
      url: upstashUrl!,
      token: upstashToken!,
    })
  : null;

// =========================================================================
// 1. Upstash Distributed Limiters (Jika Upstash aktif)
// =========================================================================

const guestUpstashLimiter = redis
  ? new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(10, "1 h"),
      analytics: true,
      prefix: "ratelimit:guest",
    })
  : null;

const memberUpstashLimiter = redis
  ? new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(200, "1 h"),
      analytics: true,
      prefix: "ratelimit:member",
    })
  : null;

const apiUpstashLimiter = redis
  ? new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(120, "1 m"),
      analytics: true,
      prefix: "ratelimit:api",
    })
  : null;

// =========================================================================
// 2. In-Memory Sliding Window Fallback (Jika Upstash belum dikonfigurasi)
// =========================================================================

interface MemoryWindowRecord {
  timestamps: number[];
}

const memoryStore = new Map<string, MemoryWindowRecord>();

function checkMemoryRateLimit(
  identifier: string,
  limit: number,
  windowMs: number
): { success: boolean; limit: number; remaining: number; reset: number } {
  const now = Date.now();
  const windowStart = now - windowMs;

  const record = memoryStore.get(identifier) || { timestamps: [] };

  // Filter timestamp yang berada di dalam window aktif
  const validTimestamps = record.timestamps.filter((ts) => ts > windowStart);

  if (validTimestamps.length >= limit) {
    const oldest = validTimestamps[0] || now;
    const resetTime = oldest + windowMs;
    return {
      success: false,
      limit,
      remaining: 0,
      reset: Math.ceil(resetTime / 1000),
    };
  }

  validTimestamps.push(now);
  memoryStore.set(identifier, { timestamps: validTimestamps });

  return {
    success: true,
    limit,
    remaining: limit - validTimestamps.length,
    reset: Math.ceil((now + windowMs) / 1000),
  };
}

// Bersihkan memory store setiap 10 menit agar tidak memory leak
if (typeof setInterval !== "undefined") {
  setInterval(() => {
    const cutoff = Date.now() - 3600 * 1000;
    for (const [key, val] of memoryStore.entries()) {
      const active = val.timestamps.filter((t) => t > cutoff);
      if (active.length === 0) {
        memoryStore.delete(key);
      } else {
        memoryStore.set(key, { timestamps: active });
      }
    }
  }, 10 * 60 * 1000);
}

// =========================================================================
// 3. Helper Functions yang Siap Digunakan di Server Actions & API Routes
// =========================================================================

export interface RateLimitResult {
  success: boolean;
  limit: number;
  remaining: number;
  reset: number;
  error?: string;
}

/**
 * Cek batas kuota Guest: 10 pemendekan per jam per IP
 */
export async function checkGuestRateLimit(ip: string): Promise<RateLimitResult> {
  const identifier = `guest:${ip || "unknown-ip"}`;

  if (guestUpstashLimiter) {
    try {
      const res = await guestUpstashLimiter.limit(identifier);
      return {
        success: res.success,
        limit: res.limit,
        remaining: res.remaining,
        reset: Math.ceil(res.reset / 1000),
        error: res.success
          ? undefined
          : "Batas pemendekan tamu terlampaui (10 tautan/jam). Silakan daftar atau masuk untuk kuota lebih besar.",
      };
    } catch (err) {
      console.warn("[UPSTASH RATE LIMIT FALLBACK]:", err);
    }
  }

  // Fallback In-Memory: 10 per 1 jam (3.600.000 ms)
  const memRes = checkMemoryRateLimit(identifier, 10, 3600 * 1000);
  return {
    ...memRes,
    error: memRes.success
      ? undefined
      : "Batas pemendekan tamu terlampaui (10 tautan/jam). Silakan daftar atau masuk untuk kuota lebih besar.",
  };
}

/**
 * Cek batas kuota Member: 200 pemendekan per jam per User ID
 */
export async function checkMemberRateLimit(userId: string): Promise<RateLimitResult> {
  const identifier = `member:${userId}`;

  if (memberUpstashLimiter) {
    try {
      const res = await memberUpstashLimiter.limit(identifier);
      return {
        success: res.success,
        limit: res.limit,
        remaining: res.remaining,
        reset: Math.ceil(res.reset / 1000),
        error: res.success
          ? undefined
          : "Batas pembuatan tautan akun Anda terlampaui (200 tautan/jam). Silakan tunggu beberapa saat.",
      };
    } catch (err) {
      console.warn("[UPSTASH RATE LIMIT FALLBACK]:", err);
    }
  }

  // Fallback In-Memory: 200 per 1 jam (3.600.000 ms)
  const memRes = checkMemoryRateLimit(identifier, 200, 3600 * 1000);
  return {
    ...memRes,
    error: memRes.success
      ? undefined
      : "Batas pembuatan tautan akun Anda terlampaui (200 tautan/jam). Silakan tunggu beberapa saat.",
  };
}

/**
 * Cek batas kuota API Key: 120 requests per menit
 */
export async function checkApiRateLimit(keyHash: string): Promise<RateLimitResult> {
  const identifier = `api:${keyHash}`;

  if (apiUpstashLimiter) {
    try {
      const res = await apiUpstashLimiter.limit(identifier);
      return {
        success: res.success,
        limit: res.limit,
        remaining: res.remaining,
        reset: Math.ceil(res.reset / 1000),
        error: res.success
          ? undefined
          : "Batas kuota REST API terlampaui (120 permintaan/menit). Harap tunggu waktu reset.",
      };
    } catch (err) {
      console.warn("[UPSTASH RATE LIMIT FALLBACK]:", err);
    }
  }

  // Fallback In-Memory: 120 per 1 menit (60.000 ms)
  const memRes = checkMemoryRateLimit(identifier, 120, 60 * 1000);
  return {
    ...memRes,
    error: memRes.success
      ? undefined
      : "Batas kuota REST API terlampaui (120 permintaan/menit). Harap tunggu waktu reset.",
  };
}
