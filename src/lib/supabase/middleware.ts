import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import type { Database } from "@/types/database";

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co";
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "placeholder-anon-key";

  const isConfigured =
    supabaseUrl !== "https://placeholder.supabase.co" &&
    !supabaseUrl.includes("xxxxxxxxxxxx");

  const pathname = request.nextUrl.pathname;

  // If Supabase credentials are not configured in local environment, allow pass-through
  if (!isConfigured) {
    return supabaseResponse;
  }

  try {
    const supabase = createServerClient<Database>(
      supabaseUrl,
      supabaseAnonKey,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll();
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value }) =>
              request.cookies.set(name, value)
            );
            supabaseResponse = NextResponse.next({
              request,
            });
            cookiesToSet.forEach(({ name, value, options }) =>
              supabaseResponse.cookies.set(name, value, options)
            );
          },
        },
      }
    );

    const {
      data: { user },
    } = await supabase.auth.getUser();

    // 1. Proteksi Member Area: /dashboard/*
    if (pathname.startsWith("/dashboard") && !user) {
      const url = request.nextUrl.clone();
      url.pathname = "/masuk";
      url.searchParams.set("redirect", pathname);
      return NextResponse.redirect(url);
    }

    // 2. Proteksi Admin Area: /admin/*
    if (pathname.startsWith("/admin")) {
      if (!user) {
        const url = request.nextUrl.clone();
        url.pathname = "/masuk";
        url.searchParams.set("redirect", pathname);
        return NextResponse.redirect(url);
      }

      // Periksa apakah user memiliki role 'super_admin'
      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();

      if (profile?.role !== "super_admin") {
        const url = request.nextUrl.clone();
        url.pathname = "/dashboard";
        return NextResponse.redirect(url);
      }
    }

    // 3. User yang sudah login tidak boleh mengakses halaman login / daftar
    if ((pathname === "/masuk" || pathname === "/daftar") && user) {
      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();

      const url = request.nextUrl.clone();
      url.pathname = profile?.role === "super_admin" ? "/admin" : "/dashboard";
      return NextResponse.redirect(url);
    }
  } catch (error) {
    console.error("Middleware Auth Error:", error);
  }

  return supabaseResponse;
}
