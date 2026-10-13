"use server";

import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";

// ==========================================
// SKEMA VALIDASI ZOD (PRD BAB 8 & 10)
// ==========================================

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, "Alamat email wajib diisi")
    .email("Format alamat email tidak valid"),
  password: z
    .string()
    .min(6, "Kata sandi minimal 6 karakter"),
});

export const registerSchema = z.object({
  full_name: z
    .string()
    .min(2, "Nama lengkap minimal 2 karakter")
    .max(100, "Nama lengkap maksimal 100 karakter"),
  email: z
    .string()
    .min(1, "Alamat email wajib diisi")
    .email("Format alamat email tidak valid"),
  password: z
    .string()
    .min(8, "Kata sandi minimal 8 karakter"),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;

// ==========================================
// SERVER ACTIONS AUTENTIKASI
// ==========================================

/**
 * Server Action: Masuk dengan Email & Kata Sandi
 */
export async function signInAction(input: LoginInput) {
  const parseResult = loginSchema.safeParse(input);
  if (!parseResult.success) {
    return {
      success: false,
      error: parseResult.error.issues[0]?.message || "Input tidak valid",
    };
  }

  const { email, password } = parseResult.data;
  const supabase = await createClient();

  const isConfigured =
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    !process.env.NEXT_PUBLIC_SUPABASE_URL.includes("xxxxxxxxxxxx") &&
    process.env.NEXT_PUBLIC_SUPABASE_URL !== "https://placeholder.supabase.co";

  // Jika belum terkoneksi ke Supabase aktif (Mode Mock/Simulasi UI)
  if (!isConfigured) {
    // Simulasi login sukses untuk pengujian UI
    if (email === "admin@pendek.in") {
      return { success: true, redirect: "/admin" };
    }
    return { success: true, redirect: "/dashboard" };
  }

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return {
      success: false,
      error: error.message === "Invalid login credentials"
        ? "Email atau kata sandi yang Anda masukkan salah."
        : error.message,
    };
  }

  if (data.user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("role, status")
      .eq("id", data.user.id)
      .single();

    if (profile?.status === "suspended") {
      await supabase.auth.signOut();
      return {
        success: false,
        error: "Akun Anda telah disuspend oleh administrator sistem karena pelanggaran kebijakan.",
      };
    }

    if (profile?.role === "super_admin") {
      return { success: true, redirect: "/admin" };
    }
  }

  return { success: true, redirect: "/dashboard" };
}

/**
 * Server Action: Mendaftar Akun Baru dengan Email & Kata Sandi
 */
export async function signUpAction(input: RegisterInput) {
  const parseResult = registerSchema.safeParse(input);
  if (!parseResult.success) {
    return {
      success: false,
      error: parseResult.error.issues[0]?.message || "Input tidak valid",
    };
  }

  const { full_name, email, password } = parseResult.data;
  const supabase = await createClient();

  const isConfigured =
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    !process.env.NEXT_PUBLIC_SUPABASE_URL.includes("xxxxxxxxxxxx") &&
    process.env.NEXT_PUBLIC_SUPABASE_URL !== "https://placeholder.supabase.co";

  // Mode Simulasi UI jika kredensial live belum dimasukkan
  if (!isConfigured) {
    return {
      success: true,
      redirect: "/dashboard",
      message: "Pendaftaran berhasil disimulasikan!",
    };
  }

  const headersList = await headers();
  const origin = headersList.get("origin") || process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name,
      },
      emailRedirectTo: `${origin}/auth/callback`,
    },
  });

  if (error) {
    return {
      success: false,
      error: error.message,
    };
  }

  // Jika Supabase membutuhkan konfirmasi email
  if (data.session === null) {
    return {
      success: true,
      requiresEmailConfirmation: true,
      message: "Tautan verifikasi telah dikirimkan ke email Anda. Silakan periksa kotak masuk atau spam.",
    };
  }

  return {
    success: true,
    redirect: "/dashboard",
  };
}

/**
 * Server Action: Dapatkan URL Redirect OAuth Google
 */
export async function signInWithGoogleAction() {
  const supabase = await createClient();

  const isConfigured =
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    !process.env.NEXT_PUBLIC_SUPABASE_URL.includes("xxxxxxxxxxxx") &&
    process.env.NEXT_PUBLIC_SUPABASE_URL !== "https://placeholder.supabase.co";

  const headersList = await headers();
  const origin = headersList.get("origin") || process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  if (!isConfigured) {
    return {
      success: true,
      redirect: "/dashboard",
    };
  }

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${origin}/auth/callback`,
      queryParams: {
        access_type: "offline",
        prompt: "consent",
      },
    },
  });

  if (error) {
    return {
      success: false,
      error: error.message,
    };
  }

  return {
    success: true,
    url: data.url,
  };
}

/**
 * Server Action: Keluar dari Akun (Logout)
 */
export async function signOutAction() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/masuk");
}
