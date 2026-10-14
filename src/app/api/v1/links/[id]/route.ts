import { NextResponse } from "next/server";
import { authenticateApiKey } from "@/lib/api-auth";
import { createAdminClient } from "@/lib/supabase/admin";

interface RouteParams {
  params: Promise<{ id: string }>;
}

function isSupabaseConfigured(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      !process.env.NEXT_PUBLIC_SUPABASE_URL.includes("xxxxxxxxxxxx") &&
      process.env.NEXT_PUBLIC_SUPABASE_URL !== "https://placeholder.supabase.co"
  );
}

const globalMockLinks = globalThis as unknown as {
  __mockLinks?: Array<{
    id: string;
    user_id: string | null;
    original_url: string;
    slug: string;
    title: string | null;
    description: string | null;
    tags: string[];
    status: string;
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
 * GET /api/v1/links/[id] - Ambil Detail Tautan Tunggal
 */
export async function GET(request: Request, { params }: RouteParams) {
  const auth = await authenticateApiKey(request);
  if (!auth.authorized) {
    return NextResponse.json(
      { success: false, error: auth.error, message: auth.message },
      { status: auth.status }
    );
  }

  const { id } = await params;
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://pendek.in";

  if (isSupabaseConfigured()) {
    try {
      const supabaseAdmin = createAdminClient();
      const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);

      let query = supabaseAdmin.from("links").select("*");
      if (isUUID) {
        query = query.eq("id", id);
      } else {
        query = query.eq("slug", id);
      }

      const { data: link, error } = await query.maybeSingle();

      if (error || !link) {
        return NextResponse.json(
          {
            success: false,
            error: "LINK_NOT_FOUND",
            message: `Tautan dengan ID atau slug "${id}" tidak ditemukan.`,
          },
          { status: 404 }
        );
      }

      // Verifikasi kepemilikan tautan
      if (link.user_id && link.user_id !== auth.userId) {
        return NextResponse.json(
          {
            success: false,
            error: "FORBIDDEN",
            message: "Anda tidak memiliki hak akses untuk melihat tautan ini.",
          },
          { status: 403 }
        );
      }

      return NextResponse.json({
        success: true,
        data: {
          id: link.id,
          slug: link.slug,
          short_url: `${appUrl}/s/${link.slug}`,
          original_url: link.original_url,
          title: link.title,
          description: link.description,
          tags: link.tags || [],
          status: link.status,
          click_count: link.click_count,
          unique_click_count: link.unique_click_count,
          expires_at: link.expires_at,
          created_at: link.created_at,
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
  const found = globalMockLinks.__mockLinks?.find(
    (l) => l.id === id || l.slug.toLowerCase() === id.toLowerCase()
  );

  if (!found) {
    return NextResponse.json(
      {
        success: false,
        error: "LINK_NOT_FOUND",
        message: `Tautan dengan ID "${id}" tidak ditemukan.`,
      },
      { status: 404 }
    );
  }

  return NextResponse.json({
    success: true,
    data: {
      id: found.id,
      slug: found.slug,
      short_url: `${appUrl}/s/${found.slug}`,
      original_url: found.original_url,
      title: found.title,
      description: found.description,
      tags: found.tags || [],
      status: found.status,
      click_count: found.click_count,
      unique_click_count: found.unique_click_count,
      expires_at: found.expires_at,
      created_at: found.created_at,
    },
  });
}

/**
 * DELETE /api/v1/links/[id] - Hapus Tautan Secara Permanen
 */
export async function DELETE(request: Request, { params }: RouteParams) {
  const auth = await authenticateApiKey(request);
  if (!auth.authorized) {
    return NextResponse.json(
      { success: false, error: auth.error, message: auth.message },
      { status: auth.status }
    );
  }

  const { id } = await params;

  if (isSupabaseConfigured()) {
    try {
      const supabaseAdmin = createAdminClient();
      const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);

      // Cek apakah link ada dan milik user
      let query = supabaseAdmin.from("links").select("id, user_id");
      if (isUUID) {
        query = query.eq("id", id);
      } else {
        query = query.eq("slug", id);
      }

      const { data: link, error: findError } = await query.maybeSingle();

      if (findError || !link) {
        return NextResponse.json(
          {
            success: false,
            error: "LINK_NOT_FOUND",
            message: "Tautan tidak ditemukan.",
          },
          { status: 404 }
        );
      }

      if (link.user_id && link.user_id !== auth.userId) {
        return NextResponse.json(
          {
            success: false,
            error: "FORBIDDEN",
            message: "Anda tidak memiliki hak akses untuk menghapus tautan ini.",
          },
          { status: 403 }
        );
      }

      const { error: deleteError } = await supabaseAdmin
        .from("links")
        .delete()
        .eq("id", link.id);

      if (deleteError) {
        return NextResponse.json(
          { success: false, error: "DATABASE_ERROR", message: deleteError.message },
          { status: 500 }
        );
      }

      return NextResponse.json({
        success: true,
        data: {
          message: "Tautan berhasil dihapus secara permanen.",
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
  if (globalMockLinks.__mockLinks) {
    globalMockLinks.__mockLinks = globalMockLinks.__mockLinks.filter(
      (l) => l.id !== id && l.slug.toLowerCase() !== id.toLowerCase()
    );
  }

  return NextResponse.json({
    success: true,
    data: {
      message: "Tautan berhasil dihapus secara permanen.",
    },
  });
}
