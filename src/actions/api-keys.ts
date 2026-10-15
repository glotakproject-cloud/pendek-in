"use server";

import crypto from "crypto";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { sendSecurityAlertEmail } from "@/lib/email";

export interface ApiKeyItem {
  id: string;
  name: string;
  prefix: string;
  createdAt: string;
  lastUsedAt: string | null;
  status: "active" | "revoked";
}

// In-Memory store untuk mock fallback
const globalStore = globalThis as unknown as {
  __mockApiKeys?: Array<{
    id: string;
    user_id: string;
    name: string;
    key_prefix: string;
    key_hash: string;
    last_used_at: string | null;
    revoked_at: string | null;
    created_at: string;
  }>;
};

if (!globalStore.__mockApiKeys) {
  globalStore.__mockApiKeys = [
    {
      id: "key-001",
      user_id: "usr-mock-1",
      name: "Production Server Bot",
      key_prefix: "pk_live_98a7...81ab",
      key_hash: "mock_hash_1",
      last_used_at: new Date(Date.now() - 3600000).toISOString(),
      revoked_at: null,
      created_at: new Date(Date.now() - 14 * 86400000).toISOString(),
    },
    {
      id: "key-002",
      user_id: "usr-mock-1",
      name: "Staging Test Integration",
      key_prefix: "pk_live_41c0...9e21",
      key_hash: "mock_hash_2",
      last_used_at: new Date(Date.now() - 86400000 * 3).toISOString(),
      revoked_at: null,
      created_at: new Date(Date.now() - 30 * 86400000).toISOString(),
    },
  ];
}

function isSupabaseConfigured(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      !process.env.NEXT_PUBLIC_SUPABASE_URL.includes("xxxxxxxxxxxx") &&
      process.env.NEXT_PUBLIC_SUPABASE_URL !== "https://placeholder.supabase.co"
  );
}

/**
 * 1. Ambil Semua API Key Milik Pengguna
 */
export async function getApiKeys(): Promise<{
  success: boolean;
  data: ApiKeyItem[];
  error?: string;
}> {
  const supabase = await createClient();

  if (isSupabaseConfigured()) {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        return { success: false, data: [], error: "Pengguna tidak terautentikasi" };
      }

      const { data, error } = await supabase
        .from("api_keys")
        .select("id, name, key_prefix, created_at, last_used_at, revoked_at")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) {
        return { success: false, data: [], error: error.message };
      }

      const items: ApiKeyItem[] = (data || []).map((k) => ({
        id: k.id,
        name: k.name,
        prefix: k.key_prefix,
        createdAt: k.created_at.split("T")[0],
        lastUsedAt: k.last_used_at ? new Date(k.last_used_at).toLocaleString("id-ID") : "Belum pernah digunakan",
        status: k.revoked_at ? "revoked" : "active",
      }));

      return { success: true, data: items };
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Kesalahan database";
      return { success: false, data: [], error: message };
    }
  }

  // Fallback Mock Store
  const items: ApiKeyItem[] = (globalStore.__mockApiKeys || []).map((k) => ({
    id: k.id,
    name: k.name,
    prefix: k.key_prefix,
    createdAt: k.created_at.split("T")[0],
    lastUsedAt: k.last_used_at ? new Date(k.last_used_at).toLocaleString("id-ID") : "Belum pernah digunakan",
    status: k.revoked_at ? "revoked" : "active",
  }));

  return { success: true, data: items };
}

/**
 * 2. Buat API Key Baru (Generate pk_live_...)
 * Kunci lengkap HANYA dikembalikan satu kali saat fungsi ini dipanggil
 */
export async function createApiKey(name: string): Promise<{
  success: boolean;
  fullKey?: string;
  keyItem?: ApiKeyItem;
  error?: string;
}> {
  const trimmedName = name.trim();
  if (!trimmedName) {
    return { success: false, error: "Nama API Key wajib diisi" };
  }

  // Generate 32 bytes random string hex
  const randomHex = crypto.randomBytes(24).toString("hex");
  const fullToken = `pk_live_${randomHex}`;
  const keyPrefix = `${fullToken.slice(0, 11)}...${fullToken.slice(-4)}`;
  const keyHash = crypto.createHash("sha256").update(fullToken).digest("hex");

  const supabase = await createClient();

  if (isSupabaseConfigured()) {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        return { success: false, error: "Pengguna tidak terautentikasi" };
      }

      const { data, error } = await supabase
        .from("api_keys")
        .insert({
          user_id: user.id,
          name: trimmedName,
          key_prefix: keyPrefix,
          key_hash: keyHash,
        })
        .select()
        .single();

      if (error) {
        return { success: false, error: error.message };
      }

      revalidatePath("/dashboard/api-key");

      const keyItem: ApiKeyItem = {
        id: data.id,
        name: data.name,
        prefix: data.key_prefix,
        createdAt: data.created_at.split("T")[0],
        lastUsedAt: "Belum pernah digunakan",
        status: "active",
      };

      // Kirim Security Alert Email (Fire-and-forget secara aman)
      if (user.email) {
        sendSecurityAlertEmail({
          to: user.email,
          type: "api_key_created",
          metadata: {
            keyName: trimmedName,
            keyPrefix: keyPrefix,
          },
        }).catch((err) => {
          console.error("[SECURITY ALERT EMAIL ERROR]:", err);
        });
      }

      return {
        success: true,
        fullKey: fullToken,
        keyItem,
      };
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Kesalahan database";
      return { success: false, error: message };
    }
  }

  // Fallback Mock Store
  const newMockId = `key-${Date.now()}`;
  const newMockRecord = {
    id: newMockId,
    user_id: "usr-mock-1",
    name: trimmedName,
    key_prefix: keyPrefix,
    key_hash: keyHash,
    last_used_at: null,
    revoked_at: null,
    created_at: new Date().toISOString(),
  };

  globalStore.__mockApiKeys?.unshift(newMockRecord);
  revalidatePath("/dashboard/api-key");

  // Simulasi Security Alert Email
  sendSecurityAlertEmail({
    to: "dimas.pratama@gmail.com",
    type: "api_key_created",
    metadata: {
      keyName: trimmedName,
      keyPrefix: keyPrefix,
    },
  }).catch(() => {});

  return {
    success: true,
    fullKey: fullToken,
    keyItem: {
      id: newMockId,
      name: trimmedName,
      prefix: keyPrefix,
      createdAt: new Date().toISOString().split("T")[0],
      lastUsedAt: "Belum pernah digunakan",
      status: "active",
    },
  };
}

/**
 * 3. Cabut / Nonaktifkan API Key (Revoke)
 */
export async function revokeApiKey(id: string): Promise<{
  success: boolean;
  error?: string;
}> {
  if (!id) {
    return { success: false, error: "ID API Key wajib disertakan" };
  }

  const supabase = await createClient();

  if (isSupabaseConfigured()) {
    try {
      const { error } = await supabase
        .from("api_keys")
        .update({ revoked_at: new Date().toISOString() })
        .eq("id", id);

      if (error) {
        return { success: false, error: error.message };
      }

      revalidatePath("/dashboard/api-key");
      return { success: true };
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Kesalahan database";
      return { success: false, error: message };
    }
  }

  // Mock Store Fallback
  const target = globalStore.__mockApiKeys?.find((k) => k.id === id);
  if (target) {
    target.revoked_at = new Date().toISOString();
  }

  revalidatePath("/dashboard/api-key");
  return { success: true };
}
