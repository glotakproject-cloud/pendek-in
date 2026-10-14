import crypto from "crypto";
import { createAdminClient } from "@/lib/supabase/admin";
import { type DeviceType } from "@/types/database";

// ==========================================
// TIPE & STRUKTUR METADATA KUNJUNGAN KLIK
// ==========================================

export interface RequestClickMetadata {
  ip: string;
  userAgent: string;
  referrer: string | null;
  country: string | null;
  city: string | null;
}

export interface ParsedUserAgent {
  device: DeviceType;
  browser: string;
  os: string;
}

/**
 * Hash IP menggunakan algoritma SHA-256 dengan salt rahasia
 * Mematuhi regulasi privasi data (GDPR / PDP)
 */
export function hashIp(ip: string): string {
  const salt = process.env.IP_HASH_SALT || "pendekin_secret_ip_salt_2026_secure";
  const cleanIp = ip.trim().toLowerCase();
  return crypto
    .createHash("sha256")
    .update(`${cleanIp}:${salt}`)
    .digest("hex");
}

/**
 * Parser User-Agent ringan, cepat, dan non-blocking
 */
export function parseUserAgent(uaString: string): ParsedUserAgent {
  const ua = uaString.toLowerCase();

  // 1. Deteksi Device Type
  let device: DeviceType = "desktop";
  if (/ipad|tablet|(android(?!.*mobile))/.test(ua)) {
    device = "tablet";
  } else if (/mobile|iphone|ipod|android|blackberry|opera mini|windows phone/.test(ua)) {
    device = "mobile";
  } else if (!/windows nt|macintosh|linux|x11/.test(ua)) {
    device = "other";
  }

  // 2. Deteksi Browser
  let browser = "Lainnya";
  if (ua.includes("edg/")) {
    browser = "Microsoft Edge";
  } else if (ua.includes("opr/") || ua.includes("opera/")) {
    browser = "Opera";
  } else if (ua.includes("samsungbrowser")) {
    browser = "Samsung Internet";
  } else if (ua.includes("ucbrowser")) {
    browser = "UC Browser";
  } else if (ua.includes("chrome") && !ua.includes("edg/")) {
    browser = "Google Chrome";
  } else if (ua.includes("firefox")) {
    browser = "Mozilla Firefox";
  } else if (ua.includes("safari") && !ua.includes("chrome")) {
    browser = "Apple Safari";
  } else if (ua.includes("bot") || ua.includes("crawl") || ua.includes("spider")) {
    browser = "Web Bot";
  }

  // 3. Deteksi Sistem Operasi (OS)
  let os = "Lainnya";
  if (ua.includes("windows nt 10.0") || ua.includes("windows nt 11.0")) {
    os = "Windows 10/11";
  } else if (ua.includes("windows")) {
    os = "Windows";
  } else if (ua.includes("android")) {
    os = "Android";
  } else if (ua.includes("iphone") || ua.includes("ipad") || ua.includes("ipod")) {
    os = "iOS";
  } else if (ua.includes("mac os x") || ua.includes("macintosh")) {
    os = "macOS";
  } else if (ua.includes("linux")) {
    os = "Linux";
  } else if (ua.includes("cros")) {
    os = "ChromeOS";
  }

  return { device, browser, os };
}

/**
 * Catat Kunjungan Klik ke Database secara Non-Blocking (Fire-and-Forget)
 */
export async function trackLinkClick(
  linkId: string,
  metadata: RequestClickMetadata
): Promise<void> {
  try {
    const ip_hash = hashIp(metadata.ip);
    const { device, browser, os } = parseUserAgent(metadata.userAgent);

    const isConfigured = Boolean(
      process.env.NEXT_PUBLIC_SUPABASE_URL &&
        !process.env.NEXT_PUBLIC_SUPABASE_URL.includes("xxxxxxxxxxxx") &&
        process.env.NEXT_PUBLIC_SUPABASE_URL !== "https://placeholder.supabase.co"
    );

    if (isConfigured) {
      const supabaseAdmin = createAdminClient();
      await supabaseAdmin.from("clicks").insert({
        link_id: linkId,
        ip_hash,
        country: metadata.country || "ID",
        city: metadata.city || null,
        referrer: metadata.referrer || "Direct",
        device,
        browser,
        os,
        user_agent: metadata.userAgent.slice(0, 500),
      });
      return;
    }

    // Fallback Mock Store: Tambah klik ke mock in-memory jika belum terhubung DB live
    const mockStore = globalThis as unknown as {
      __mockLinks?: Array<{ id: string; click_count: number; unique_click_count: number }>;
      __mockClicks?: Array<unknown>;
    };

    if (mockStore.__mockLinks) {
      const target = mockStore.__mockLinks.find((l) => l.id === linkId);
      if (target) {
        target.click_count += 1;
        target.unique_click_count += 1;
      }
    }

    if (!mockStore.__mockClicks) {
      mockStore.__mockClicks = [];
    }

    mockStore.__mockClicks.push({
      link_id: linkId,
      ip_hash,
      device,
      browser,
      os,
      referrer: metadata.referrer || "Direct",
      country: metadata.country || "ID",
      created_at: new Date().toISOString(),
    });
  } catch (err) {
    // Log error secara silent tanpa memblokir pengalaman pengguna
    console.error("[Tracking Non-Blocking Error]:", err);
  }
}
