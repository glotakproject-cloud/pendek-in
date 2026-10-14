import { NextResponse } from "next/server";
import { authenticateApiKey } from "@/lib/api-auth";
import { createAdminClient } from "@/lib/supabase/admin";
import {
  createLinkSchema,
  checkSlugSchema,
  generateRandomSlug,
} from "@/lib/validations/link";
import { type LinkStatus } from "@/types/database";

const DEFAULT_RESERVED_WORDS = [
  "admin", "api", "dashboard", "login", "masuk", "daftar", "s", "p", "qr", "about",
  "tentang", "harga", "kontak", "syarat-ketentuan", "kebijakan-privasi", "bca", "mandiri", "bri"
];

const DEFAULT_BLOCKED_DOMAINS = [
  "bit.ly-phishing.example", "klik-menang-undian.xyz", "necopromo-scam.top", "hadiah-telkomsel-palsu.online"
];

function isSupabaseConfigured(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      !process.env.NEXT_PUBLIC_SUPABASE_URL.includes("xxxxxxxxxxxx") &&
      process.env.NEXT_PUBLIC_SUPABASE_URL !== "https://placeholder.supabase.co"
  );
}

// In-Memory store untuk mock fallback API
const globalMockLinks = globalThis as unknown as {
  __mockLinks?: Array<{
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
  }>;
};

/**
 * POST /api/v1/links - Buat Tautan Singkat Baru via REST API
 */
export async function POST(request: Request) {
  const auth = await authenticateApiKey(request);
  if (!auth.authorized) {
    return NextResponse.json(
      { success: false, error: auth.error, message: auth.message },
      { status: auth.status }
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { success: false, error: "INVALID_JSON", message: "Body request harus berupa JSON yang valid." },
      { status: 400 }
    );
  }

  const parseResult = createLinkSchema.safeParse(body);
  if (!parseResult.success) {
    return NextResponse.json(
      {
        success: false,
        error: "VALIDATION_ERROR",
        message: parseResult.error.issues[0]?.message || "Input tidak valid",
      },
      { status: 400 }
    );
  }

  const { original_url, custom_slug, title, description, tags, expires_at } =
    parseResult.data;

  // 1. Cek Blocked Domains
  try {
    const hostname = new URL(original_url).hostname.toLowerCase().replace(/^www\./, "");
    for (const b of DEFAULT_BLOCKED_DOMAINS) {
      if (hostname === b || hostname.endsWith("." + b)) {
        return NextResponse.json(
          {
            success: false,
            error: "BLOCKED_DOMAIN",
            message: "Domain URL tujuan masuk dalam daftar hitam malware/phishing.",
          },
          { status: 400 }
        );
      }
    }
  } catch {
    return NextResponse.json(
      { success: false, error: "INVALID_URL", message: "URL tujuan tidak valid." },
      { status: 400 }
    );
  }

  // 2. Cek Custom Slug
  let finalSlug = "";
  let isCustom = false;

  if (custom_slug) {
    const slugCheck = checkSlugSchema.safeParse({ slug: custom_slug });
    if (!slugCheck.success) {
      return NextResponse.json(
        {
          success: false,
          error: "INVALID_SLUG_FORMAT",
          message: slugCheck.error.issues[0]?.message,
        },
        { status: 400 }
      );
    }

    const cleanSlug = custom_slug.toLowerCase();
    if (DEFAULT_RESERVED_WORDS.includes(cleanSlug)) {
      return NextResponse.json(
        {
          success: false,
          error: "RESERVED_SLUG",
          message: `Slug "${cleanSlug}" adalah kata terlarang sistem (reserved word).`,
        },
        { status: 400 }
      );
    }

    finalSlug = cleanSlug;
    isCustom = true;
  } else {
    finalSlug = generateRandomSlug(6);
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://pendek.in";

  // 3. Simpan ke database Supabase jika aktif
  if (isSupabaseConfigured()) {
    try {
      const supabaseAdmin = createAdminClient();

      // Cek bentrok slug
      const { data: existing } = await supabaseAdmin
        .from("links")
        .select("id")
        .eq("slug", finalSlug)
        .maybeSingle();

      if (existing) {
        return NextResponse.json(
          {
            success: false,
            error: "SLUG_ALREADY_EXISTS",
            message: `Slug "${finalSlug}" telah digunakan oleh tautan lain.`,
          },
          { status: 400 }
        );
      }

      const { data: link, error } = await supabaseAdmin
        .from("links")
        .insert({
          user_id: auth.userId,
          original_url,
          slug: finalSlug,
          title: title || null,
          description: description || null,
          tags: tags || [],
          status: "active",
          is_custom_slug: isCustom,
          click_count: 0,
          unique_click_count: 0,
          expires_at: expires_at ? new Date(expires_at).toISOString() : null,
        })
        .select()
        .single();

      if (error) {
        return NextResponse.json(
          { success: false, error: "DATABASE_ERROR", message: error.message },
          { status: 500 }
        );
      }

      return NextResponse.json(
        {
          success: true,
          data: {
            id: link.id,
            slug: link.slug,
            short_url: `${appUrl}/s/${link.slug}`,
            original_url: link.original_url,
            title: link.title,
            status: link.status,
            created_at: link.created_at,
          },
        },
        { status: 201 }
      );
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Kesalahan server";
      return NextResponse.json(
        { success: false, error: "INTERNAL_SERVER_ERROR", message },
        { status: 500 }
      );
    }
  }

  // Fallback Mock Store
  const newLink = {
    id: `c1f7b0e1-${Date.now().toString().slice(-4)}-46b2-a42e-9d22fa998a12`,
    user_id: auth.userId,
    original_url,
    slug: finalSlug,
    title: title || "Tautan REST API",
    description: description || null,
    tags: tags || [],
    status: "active" as LinkStatus,
    is_custom_slug: isCustom,
    click_count: 0,
    unique_click_count: 0,
    password_hash: null,
    expires_at: expires_at ? new Date(expires_at).toISOString() : null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  if (!globalMockLinks.__mockLinks) {
    globalMockLinks.__mockLinks = [];
  }
  globalMockLinks.__mockLinks.unshift(newLink);

  return NextResponse.json(
    {
      success: true,
      data: {
        id: newLink.id,
        slug: newLink.slug,
        short_url: `${appUrl}/s/${newLink.slug}`,
        original_url: newLink.original_url,
        title: newLink.title,
        status: newLink.status,
        created_at: newLink.created_at,
      },
    },
    { status: 201 }
  );
}

/**
 * GET /api/v1/links - Ambil Daftar Tautan Pengguna
 */
export async function GET(request: Request) {
  const auth = await authenticateApiKey(request);
  if (!auth.authorized) {
    return NextResponse.json(
      { success: false, error: auth.error, message: auth.message },
      { status: auth.status }
    );
  }

  const { searchParams } = new URL(request.url);
  const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
  const limit = Math.min(100, Math.max(1, parseInt(searchParams.get("limit") || "20", 10)));
  const statusFilter = searchParams.get("status");

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://pendek.in";

  if (isSupabaseConfigured()) {
    try {
      const supabaseAdmin = createAdminClient();

      let query = supabaseAdmin
        .from("links")
        .select("*", { count: "exact" })
        .eq("user_id", auth.userId)
        .order("created_at", { ascending: false });

      if (statusFilter && statusFilter !== "all") {
        query = query.eq("status", statusFilter as LinkStatus);
      }

      const from = (page - 1) * limit;
      const to = from + limit - 1;
      query = query.range(from, to);

      const { data, count, error } = await query;
      if (error) {
        return NextResponse.json(
          { success: false, error: "DATABASE_ERROR", message: error.message },
          { status: 500 }
        );
      }

      const totalItems = count || 0;
      const totalPages = Math.ceil(totalItems / limit);

      const items = (data || []).map((l) => ({
        id: l.id,
        slug: l.slug,
        short_url: `${appUrl}/s/${l.slug}`,
        original_url: l.original_url,
        title: l.title,
        status: l.status,
        click_count: l.click_count,
        unique_click_count: l.unique_click_count,
        created_at: l.created_at,
      }));

      return NextResponse.json({
        success: true,
        data: {
          items,
          pagination: {
            page,
            limit,
            total_items: totalItems,
            total_pages: totalPages,
          },
        },
      });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Kesalahan server";
      return NextResponse.json(
        { success: false, error: "INTERNAL_SERVER_ERROR", message },
        { status: 500 }
      );
    }
  }

  // Fallback Mock Store
  const mockItems = (globalMockLinks.__mockLinks || []).map((l) => ({
    id: l.id,
    slug: l.slug,
    short_url: `${appUrl}/s/${l.slug}`,
    original_url: l.original_url,
    title: l.title,
    status: l.status,
    click_count: l.click_count,
    unique_click_count: l.unique_click_count,
    created_at: l.created_at,
  }));

  return NextResponse.json({
    success: true,
    data: {
      items: mockItems.slice((page - 1) * limit, page * limit),
      pagination: {
        page,
        limit,
        total_items: mockItems.length,
        total_pages: Math.ceil(mockItems.length / limit) || 1,
      },
    },
  });
}
