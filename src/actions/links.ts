"use server";

import { revalidatePath } from "next/cache";
import crypto from "crypto";
import { createClient } from "@/lib/supabase/server";
import { type Database, type LinkStatus } from "@/types/database";
import {
  checkSlugSchema,
  createLinkSchema,
  updateLinkSchema,
  generateRandomSlug,
  type CreateLinkInput,
  type UpdateLinkInput,
} from "@/lib/validations/link";

// ==========================================
// DAFTAR CADANGAN (FALLBACK JIKA DB OFFLINE)
// ==========================================
const DEFAULT_RESERVED_WORDS = [
  "admin",
  "api",
  "dashboard",
  "login",
  "masuk",
  "daftar",
  "s",
  "p",
  "qr",
  "about",
  "tentang",
  "harga",
  "kontak",
  "syarat-ketentuan",
  "kebijakan-privasi",
  "bca",
  "mandiri",
  "bri",
  "bni",
  "support",
  "official",
  "auth",
  "settings",
  "webhook",
  "root",
];

const DEFAULT_BLOCKED_DOMAINS = [
  "bit.ly-phishing.example",
  "klik-menang-undian.xyz",
  "necopromo-scam.top",
  "hadiah-telkomsel-palsu.online",
  "phishing-bank-fake.site",
];

// In-Memory store untuk mock mode ketika belum terhubung Supabase live
interface MockLink {
  id: string;
  user_id: string | null;
  original_url: string;
  slug: string;
  title: string | null;
  description: string | null;
  tags: string[];
  status: LinkStatus;
  is_custom_slug: boolean;
  click_count: number;
  unique_click_count: number;
  password_hash: string | null;
  expires_at: string | null;
  created_at: string;
  updated_at: string;
}

const globalMockStore = globalThis as unknown as {
  __mockLinks?: MockLink[];
};

if (!globalMockStore.__mockLinks) {
  globalMockStore.__mockLinks = [
    {
      id: "lnk-001",
      user_id: "usr-mock-1",
      original_url: "https://toko-bunga-jakarta.com/katalog-pernikahan-2026?ref=instagram-story",
      slug: "buket-nikah-jkt",
      title: "Katalog Buket Pernikahan Jakarta 2026",
      description: "Tautan promo Instagram Story katalog rangkaian bunga pengantin",
      tags: ["Bisnis", "Promo"],
      status: "active",
      is_custom_slug: true,
      click_count: 1420,
      unique_click_count: 980,
      password_hash: null,
      expires_at: null,
      created_at: new Date(Date.now() - 7 * 86400000).toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: "lnk-002",
      user_id: "usr-mock-1",
      original_url: "https://play.google.com/store/apps/details?id=com.pendekin.app&referrer=utm_campaign%3Dramadhan",
      slug: "promo",
      title: "Download Pendek-In Mobile App",
      description: "Direct download landing page aplikasi mobile Android & iOS",
      tags: ["Promo", "E-Commerce"],
      status: "active",
      is_custom_slug: true,
      click_count: 3890,
      unique_click_count: 2450,
      password_hash: null,
      expires_at: null,
      created_at: new Date(Date.now() - 14 * 86400000).toISOString(),
      updated_at: new Date().toISOString(),
    },
  ];
}

// ==========================================
// HELPER INTERNAL
// ==========================================

function isSupabaseConfigured(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      !process.env.NEXT_PUBLIC_SUPABASE_URL.includes("xxxxxxxxxxxx") &&
      process.env.NEXT_PUBLIC_SUPABASE_URL !== "https://placeholder.supabase.co"
  );
}

function extractHostname(urlString: string): string {
  try {
    const parsed = new URL(urlString);
    return parsed.hostname.toLowerCase().replace(/^www\./, "");
  } catch {
    return "";
  }
}

/**
 * Cek apakah domain URL tujuan terindikasi berbahaya/terblokir
 */
async function checkIsDomainBlocked(
  urlString: string,
  supabase: Awaited<ReturnType<typeof createClient>>
): Promise<{ blocked: boolean; reason?: string }> {
  const hostname = extractHostname(urlString);
  if (!hostname) {
    return { blocked: false };
  }

  // 1. Cek default blocked list
  for (const blocked of DEFAULT_BLOCKED_DOMAINS) {
    if (hostname === blocked || hostname.endsWith("." + blocked)) {
      return {
        blocked: true,
        reason: "Domain terindikasi situs berbahaya, phishing, atau penyebar malware.",
      };
    }
  }

  // 2. Cek database jika Supabase aktif
  if (isSupabaseConfigured()) {
    try {
      const { data } = await supabase
        .from("blocked_domains")
        .select("domain, reason")
        .eq("domain", hostname)
        .maybeSingle();

      if (data) {
        return {
          blocked: true,
          reason: data.reason || "Domain masuk dalam daftar blokir keamanan sistem.",
        };
      }
    } catch {
      // Abaikan error koneksi fallback
    }
  }

  return { blocked: false };
}

/**
 * Cek apakah slug adalah kata terlarang (reserved word)
 */
async function checkIsSlugReserved(
  slug: string,
  supabase: Awaited<ReturnType<typeof createClient>>
): Promise<boolean> {
  const lowerSlug = slug.toLowerCase();

  // 1. Cek local list
  if (DEFAULT_RESERVED_WORDS.includes(lowerSlug)) {
    return true;
  }

  // 2. Cek database
  if (isSupabaseConfigured()) {
    try {
      const { data } = await supabase
        .from("reserved_words")
        .select("word")
        .eq("word", lowerSlug)
        .maybeSingle();

      if (data) {
        return true;
      }
    } catch {
      // Abaikan error koneksi fallback
    }
  }

  return false;
}

// ==========================================
// SERVER ACTIONS (HANYA ASYNC FUNCTIONS)
// ==========================================

/**
 * 1. Cek Ketersediaan Back-Half (Slug)
 */
export async function checkSlugAvailability(rawSlug: string): Promise<{
  available: boolean;
  status: "available" | "reserved" | "taken" | "invalid";
  message: string;
}> {
  const parseResult = checkSlugSchema.safeParse({ slug: rawSlug });
  if (!parseResult.success) {
    return {
      available: false,
      status: "invalid",
      message: parseResult.error.issues[0]?.message || "Format slug tidak valid",
    };
  }

  const slug = parseResult.data.slug.toLowerCase();
  const supabase = await createClient();

  // Cek apakah slug termasuk reserved word sistem
  const isReserved = await checkIsSlugReserved(slug, supabase);
  if (isReserved) {
    return {
      available: false,
      status: "reserved",
      message: `Kata "${slug}" adalah kata terlarang sistem (reserved word). Silakan gunakan kata lain.`,
    };
  }

  // Cek apakah sudah terpakai di Supabase atau Mock Store
  if (isSupabaseConfigured()) {
    try {
      const { data } = await supabase
        .from("links")
        .select("id")
        .eq("slug", slug)
        .maybeSingle();

      if (data) {
        return {
          available: false,
          status: "taken",
          message: `Slug "${slug}" sudah digunakan pengguna lain. Coba alternatif kombinasi lainnya.`,
        };
      }
    } catch {
      // Jika terjadi gangguan DB, lanjut ke cek local store
    }
  }

  const isTakenInMock = globalMockStore.__mockLinks?.some(
    (l) => l.slug.toLowerCase() === slug
  );

  if (isTakenInMock) {
    return {
      available: false,
      status: "taken",
      message: `Slug "${slug}" sudah digunakan pengguna lain. Coba alternatif kombinasi lainnya.`,
    };
  }

  return {
    available: true,
    status: "available",
    message: `Slug "${slug}" tersedia dan siap digunakan! 🎉`,
  };
}

/**
 * 2. Buat Tautan Baru (Create Link)
 */
export async function createLink(input: CreateLinkInput) {
  const parseResult = createLinkSchema.safeParse(input);
  if (!parseResult.success) {
    return {
      success: false,
      error: parseResult.error.issues[0]?.message || "Data formulir tidak valid",
    };
  }

  const { original_url, custom_slug, title, description, tags, expires_at, password } =
    parseResult.data;

  const supabase = await createClient();

  // Validasi domain tujuan apakah terindikasi berbahaya/scam/phishing
  const blockedCheck = await checkIsDomainBlocked(original_url, supabase);
  if (blockedCheck.blocked) {
    return {
      success: false,
      error: `URL tujuan tidak diizinkan: ${blockedCheck.reason || "Domain masuk daftar hitam."}`,
    };
  }

  // Tentukan Slug (kustom atau auto-generate 6 karakter)
  let finalSlug = "";
  let isCustom = false;

  if (custom_slug) {
    const slugValidation = await checkSlugAvailability(custom_slug);
    if (!slugValidation.available) {
      return {
        success: false,
        error: slugValidation.message,
      };
    }
    finalSlug = custom_slug.toLowerCase();
    isCustom = true;
  } else {
    // Generate slug 6 karakter unik
    let attempts = 0;
    while (attempts < 5) {
      const candidate = generateRandomSlug(6);
      const check = await checkSlugAvailability(candidate);
      if (check.available) {
        finalSlug = candidate;
        break;
      }
      attempts++;
    }

    if (!finalSlug) {
      finalSlug = generateRandomSlug(8); // Fallback ke 8 karakter jika tabrakan terus
    }
  }

  // Hash kata sandi jika link diproteksi sandi
  let passwordHash: string | null = null;
  if (password) {
    passwordHash = crypto.createHash("sha256").update(password).digest("hex");
  }

  // Ambil user id jika login
  let userId: string | null = null;
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    userId = user?.id || null;
  } catch {
    // Guest link
  }

  // Insert ke database Supabase jika aktif
  if (isSupabaseConfigured()) {
    try {
      const { data: link, error } = await supabase
        .from("links")
        .insert({
          user_id: userId,
          original_url,
          slug: finalSlug,
          title: title || null,
          description: description || null,
          tags: tags || [],
          status: "active",
          is_custom_slug: isCustom,
          click_count: 0,
          unique_click_count: 0,
          password_hash: passwordHash,
          expires_at: expires_at ? new Date(expires_at).toISOString() : null,
        })
        .select()
        .single();

      if (error) {
        return {
          success: false,
          error: `Gagal membuat tautan: ${error.message}`,
        };
      }

      revalidatePath("/dashboard");
      revalidatePath("/dashboard/tautan");
      return {
        success: true,
        data: link,
      };
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Kesalahan database";
      return {
        success: false,
        error: `Gagal menyimpan tautan ke database: ${message}`,
      };
    }
  }

  // Fallback Mock Store untuk pengujian UI tanpa server live
  const newMockLink: MockLink = {
    id: `lnk-${Date.now().toString().slice(-6)}`,
    user_id: userId || "usr-mock-1",
    original_url,
    slug: finalSlug,
    title: title || original_url,
    description: description || null,
    tags: tags || [],
    status: "active",
    is_custom_slug: isCustom,
    click_count: 0,
    unique_click_count: 0,
    password_hash: passwordHash,
    expires_at: expires_at ? new Date(expires_at).toISOString() : null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  globalMockStore.__mockLinks?.unshift(newMockLink);

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/tautan");

  return {
    success: true,
    data: newMockLink,
  };
}

/**
 * 3. Update Data Tautan (Update Link)
 */
export async function updateLink(input: UpdateLinkInput) {
  const parseResult = updateLinkSchema.safeParse(input);
  if (!parseResult.success) {
    return {
      success: false,
      error: parseResult.error.issues[0]?.message || "Data update tidak valid",
    };
  }

  const { id, original_url, title, description, tags, status, expires_at, password } =
    parseResult.data;

  const supabase = await createClient();

  // Cek blocked domain pada URL tujuan baru
  const blockedCheck = await checkIsDomainBlocked(original_url, supabase);
  if (blockedCheck.blocked) {
    return {
      success: false,
      error: `URL tujuan tidak diizinkan: ${blockedCheck.reason || "Domain masuk daftar hitam."}`,
    };
  }

  let passwordHash: string | undefined = undefined;
  if (password !== undefined) {
    passwordHash = password
      ? crypto.createHash("sha256").update(password).digest("hex")
      : undefined;
  }

  if (isSupabaseConfigured()) {
    try {
      const updatePayload: Database["public"]["Tables"]["links"]["Update"] = {
        original_url,
        title: title || null,
        description: description || null,
        tags: tags || [],
        status: status || "active",
        expires_at: expires_at ? new Date(expires_at).toISOString() : null,
        updated_at: new Date().toISOString(),
      };

      if (passwordHash !== undefined) {
        updatePayload.password_hash = passwordHash;
      }

      const { data: updatedLink, error } = await supabase
        .from("links")
        .update(updatePayload)
        .eq("id", id)
        .select()
        .single();

      if (error) {
        return {
          success: false,
          error: error.message,
        };
      }

      revalidatePath("/dashboard");
      revalidatePath("/dashboard/tautan");
      revalidatePath(`/dashboard/tautan/${id}`);

      return {
        success: true,
        data: updatedLink,
      };
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Kesalahan database";
      return {
        success: false,
        error: message,
      };
    }
  }

  // Update in Mock Store
  const mockItem = globalMockStore.__mockLinks?.find((l) => l.id === id);
  if (mockItem) {
    mockItem.original_url = original_url;
    mockItem.title = title || mockItem.title;
    mockItem.description = description !== undefined ? description : mockItem.description;
    if (tags) mockItem.tags = tags;
    if (status) mockItem.status = status;
    if (expires_at !== undefined) mockItem.expires_at = expires_at;
    if (passwordHash !== undefined) mockItem.password_hash = passwordHash;
    mockItem.updated_at = new Date().toISOString();
  }

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/tautan");
  revalidatePath(`/dashboard/tautan/${id}`);

  return {
    success: true,
    data: mockItem,
  };
}

/**
 * 4. Hapus Tautan (Delete Link)
 */
export async function deleteLink(id: string) {
  if (!id) {
    return { success: false, error: "ID Tautan wajib disertakan" };
  }

  const supabase = await createClient();

  if (isSupabaseConfigured()) {
    try {
      const { error } = await supabase.from("links").delete().eq("id", id);
      if (error) {
        return { success: false, error: error.message };
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Kesalahan database";
      return { success: false, error: message };
    }
  }

  // Hapus dari mock store
  if (globalMockStore.__mockLinks) {
    globalMockStore.__mockLinks = globalMockStore.__mockLinks.filter((l) => l.id !== id);
  }

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/tautan");

  return {
    success: true,
    message: "Tautan berhasil dihapus permanen.",
  };
}

/**
 * 5. Ambil Daftar Tautan Pengguna (Get User Links)
 */
export async function getUserLinks(options?: {
  search?: string;
  status?: string;
  sortBy?: "newest" | "clicks" | "oldest";
  page?: number;
  limit?: number;
}) {
  const { search, status, sortBy = "newest", page = 1, limit = 20 } = options || {};
  const supabase = await createClient();

  if (isSupabaseConfigured()) {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        return { success: false, error: "Tidak terautentikasi", data: [], total: 0 };
      }

      let query = supabase
        .from("links")
        .select("*", { count: "exact" })
        .eq("user_id", user.id);

      if (status && status !== "all") {
        query = query.eq("status", status as LinkStatus);
      }

      if (search) {
        query = query.or(
          `title.ilike.%${search}%,slug.ilike.%${search}%,original_url.ilike.%${search}%`
        );
      }

      if (sortBy === "clicks") {
        query = query.order("click_count", { ascending: false });
      } else if (sortBy === "oldest") {
        query = query.order("created_at", { ascending: true });
      } else {
        query = query.order("created_at", { ascending: false });
      }

      const from = (page - 1) * limit;
      const to = from + limit - 1;
      query = query.range(from, to);

      const { data, error, count } = await query;

      if (error) {
        return { success: false, error: error.message, data: [], total: 0 };
      }

      return {
        success: true,
        data: data || [],
        total: count || 0,
      };
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Kesalahan database";
      return { success: false, error: message, data: [], total: 0 };
    }
  }

  // Fallback Mock Store
  let links = [...(globalMockStore.__mockLinks || [])];

  if (status && status !== "all") {
    links = links.filter((l) => l.status === status);
  }

  if (search) {
    const q = search.toLowerCase();
    links = links.filter(
      (l) =>
        l.title?.toLowerCase().includes(q) ||
        l.slug.toLowerCase().includes(q) ||
        l.original_url.toLowerCase().includes(q)
    );
  }

  if (sortBy === "clicks") {
    links.sort((a, b) => b.click_count - a.click_count);
  } else if (sortBy === "oldest") {
    links.sort((a, b) => a.created_at.localeCompare(b.created_at));
  } else {
    links.sort((a, b) => b.created_at.localeCompare(a.created_at));
  }

  const total = links.length;
  const from = (page - 1) * limit;
  const paginated = links.slice(from, from + limit);

  return {
    success: true,
    data: paginated,
    total,
  };
}

/**
 * 6. Ambil Detail Tautan (Get Link Detail)
 */
export async function getLinkDetail(idOrSlug: string) {
  if (!idOrSlug) {
    return { success: false, error: "Identifier link wajib diisi" };
  }

  const supabase = await createClient();

  if (isSupabaseConfigured()) {
    try {
      const isUUID =
        /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
          idOrSlug
        );

      let query = supabase.from("links").select("*");
      if (isUUID) {
        query = query.eq("id", idOrSlug);
      } else {
        query = query.eq("slug", idOrSlug);
      }

      const { data, error } = await query.maybeSingle();

      if (error) {
        return { success: false, error: error.message };
      }

      if (!data) {
        return { success: false, error: "Tautan tidak ditemukan" };
      }

      return {
        success: true,
        data,
      };
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Kesalahan database";
      return { success: false, error: message };
    }
  }

  // Mock Store Fallback
  const found = globalMockStore.__mockLinks?.find(
    (l) => l.id === idOrSlug || l.slug.toLowerCase() === idOrSlug.toLowerCase()
  );

  if (!found) {
    return { success: false, error: "Tautan tidak ditemukan" };
  }

  return {
    success: true,
    data: found,
  };
}

/**
 * 7. Verifikasi Kata Sandi Tautan Terproteksi
 */
export async function verifyLinkPassword(slug: string, passwordAttempt: string) {
  if (!slug || !passwordAttempt) {
    return { success: false, error: "Slug dan kata sandi wajib diisi" };
  }

  const detail = await getLinkDetail(slug);
  if (!detail.success || !detail.data) {
    return { success: false, error: "Tautan tidak ditemukan" };
  }

  const link = detail.data;
  if (!link.password_hash) {
    return { success: true, original_url: link.original_url };
  }

  const attemptHash = crypto
    .createHash("sha256")
    .update(passwordAttempt)
    .digest("hex");

  if (attemptHash !== link.password_hash) {
    return { success: false, error: "Kata sandi yang Anda masukkan salah. Coba lagi." };
  }

  return {
    success: true,
    original_url: link.original_url,
  };
}

