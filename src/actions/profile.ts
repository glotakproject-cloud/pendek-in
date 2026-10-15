"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export interface UserProfileData {
  id: string;
  email: string;
  fullName: string;
  avatarUrl: string | null;
  role: "member" | "super_admin";
  status: "active" | "suspended";
  emailWeeklyDigest: boolean;
  createdAt: string;
}

function isSupabaseConfigured(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      !process.env.NEXT_PUBLIC_SUPABASE_URL.includes("xxxxxxxxxxxx") &&
      process.env.NEXT_PUBLIC_SUPABASE_URL !== "https://placeholder.supabase.co"
  );
}

// Fallback user profile untuk mode simulasi
const DEFAULT_FALLBACK_PROFILE: UserProfileData = {
  id: "usr-mock-1",
  email: "dimas.pratama@gmail.com",
  fullName: "Dimas Pratama",
  avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
  role: "member",
  status: "active",
  emailWeeklyDigest: true,
  createdAt: "2026-01-15T08:30:00Z",
};

/**
 * 1. Ambil Profil Pengguna Terotentikasi
 */
export async function getUserProfile(): Promise<{
  success: boolean;
  data: UserProfileData;
  error?: string;
}> {
  if (!isSupabaseConfigured()) {
    return {
      success: true,
      data: DEFAULT_FALLBACK_PROFILE,
    };
  }

  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return {
        success: false,
        data: DEFAULT_FALLBACK_PROFILE,
        error: "Pengguna tidak terautentikasi",
      };
    }

    const { data: profile, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .maybeSingle();

    if (error || !profile) {
      return {
        success: true,
        data: {
          id: user.id,
          email: user.email || "user@pendek.in",
          fullName:
            user.user_metadata?.full_name ||
            user.email?.split("@")[0] ||
            "Pengguna Pendek-In",
          avatarUrl: user.user_metadata?.avatar_url || null,
          role: "member",
          status: "active",
          emailWeeklyDigest: false,
          createdAt: user.created_at,
        },
      };
    }

    return {
      success: true,
      data: {
        id: profile.id,
        email: user.email || "",
        fullName: profile.full_name,
        avatarUrl: profile.avatar_url,
        role: profile.role,
        status: profile.status,
        emailWeeklyDigest: profile.email_weekly_digest,
        createdAt: profile.created_at,
      },
    };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Kesalahan database";
    return {
      success: false,
      data: DEFAULT_FALLBACK_PROFILE,
      error: message,
    };
  }
}

/**
 * 2. Update Data Profil (Nama Lengkap, Avatar, Preferensi Digest)
 */
export async function updateUserProfile(input: {
  fullName?: string;
  avatarUrl?: string;
  emailWeeklyDigest?: boolean;
}): Promise<{
  success: boolean;
  message?: string;
  error?: string;
}> {
  if (!isSupabaseConfigured()) {
    if (input.fullName) DEFAULT_FALLBACK_PROFILE.fullName = input.fullName;
    if (input.avatarUrl !== undefined) DEFAULT_FALLBACK_PROFILE.avatarUrl = input.avatarUrl;
    if (input.emailWeeklyDigest !== undefined)
      DEFAULT_FALLBACK_PROFILE.emailWeeklyDigest = input.emailWeeklyDigest;

    revalidatePath("/dashboard");
    revalidatePath("/dashboard/profil");
    revalidatePath("/dashboard/notifikasi");

    return {
      success: true,
      message: "Profil berhasil diperbarui (Simulasi).",
    };
  }

  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: "Pengguna tidak terautentikasi" };
    }

    const updatePayload: {
      full_name?: string;
      avatar_url?: string;
      email_weekly_digest?: boolean;
      updated_at: string;
    } = {
      updated_at: new Date().toISOString(),
    };

    if (input.fullName !== undefined) updatePayload.full_name = input.fullName;
    if (input.avatarUrl !== undefined) updatePayload.avatar_url = input.avatarUrl;
    if (input.emailWeeklyDigest !== undefined)
      updatePayload.email_weekly_digest = input.emailWeeklyDigest;

    const { error } = await supabase
      .from("profiles")
      .update(updatePayload)
      .eq("id", user.id);

    if (error) {
      return { success: false, error: error.message };
    }

    revalidatePath("/dashboard");
    revalidatePath("/dashboard/profil");
    revalidatePath("/dashboard/notifikasi");

    return {
      success: true,
      message: "Profil berhasil diperbarui.",
    };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Kesalahan database";
    return { success: false, error: message };
  }
}
