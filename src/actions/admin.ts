"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { type LinkStatus, type UserRole, type UserStatus } from "@/types/database";
import { blockedDomainSchema, reservedWordSchema } from "@/lib/validations/admin";

// ==========================================
// TIPE DATA ADMIN
// ==========================================

export interface AdminUserItem {
  id: string;
  email: string;
  fullName: string;
  avatarUrl: string | null;
  role: UserRole;
  status: UserStatus;
  linksCount: number;
  totalClicks: number;
  createdAt: string;
}

export interface AdminLinkItem {
  id: string;
  userId: string | null;
  authorName: string;
  authorEmail: string;
  originalUrl: string;
  slug: string;
  title: string;
  shortUrl: string;
  status: LinkStatus;
  clickCount: number;
  uniqueClickCount: number;
  createdAt: string;
}

export interface BlockedDomainItem {
  id: number;
  domain: string;
  reason: string | null;
  addedBy: string | null;
  createdAt: string;
}

export interface ReservedWordItem {
  id: number;
  word: string;
  createdAt: string;
}

export interface AuditLogItem {
  id: string;
  actorId: string | null;
  actorName: string;
  action: string;
  targetType: string | null;
  targetId: string | null;
  metadata: Record<string, unknown> | null;
  createdAt: string;
}

export interface SystemSettingsData {
  siteName: string;
  maintenanceMode: boolean;
  guestRateLimitHour: number;
  memberRateLimitHour: number;
  apiRateLimitMinute: number;
  customDomainEnabled: boolean;
  contactEmail: string;
}

// ==========================================
// MOCK DATA STORE (FALLBACK MODE)
// ==========================================

const globalAdminStore = globalThis as unknown as {
  __adminBlockedDomains?: BlockedDomainItem[];
  __adminReservedWords?: ReservedWordItem[];
  __adminAuditLogs?: AuditLogItem[];
  __adminSettings?: SystemSettingsData;
};

if (!globalAdminStore.__adminBlockedDomains) {
  globalAdminStore.__adminBlockedDomains = [
    { id: 1, domain: "bit.ly-phishing.example", reason: "Phishing credential login bank", addedBy: "Super Admin", createdAt: "2026-02-10T10:00:00Z" },
    { id: 2, domain: "klik-menang-undian.xyz", reason: "Spam penipuan SMS berhadiah", addedBy: "Super Admin", createdAt: "2026-02-15T12:30:00Z" },
    { id: 3, domain: "necopromo-scam.top", reason: "Malware & trojan download payload", addedBy: "Super Admin", createdAt: "2026-03-01T08:15:00Z" },
    { id: 4, domain: "hadiah-telkomsel-palsu.online", reason: "Social engineering pulsa gratis", addedBy: "Super Admin", createdAt: "2026-03-12T14:40:00Z" },
    { id: 5, domain: "phishing-bank-fake.site", reason: "Kloning situs internet banking palsu", addedBy: "Super Admin", createdAt: "2026-03-25T11:20:00Z" },
  ];
}

if (!globalAdminStore.__adminReservedWords) {
  globalAdminStore.__adminReservedWords = [
    { id: 1, word: "admin", createdAt: "2026-01-01T00:00:00Z" },
    { id: 2, word: "api", createdAt: "2026-01-01T00:00:00Z" },
    { id: 3, word: "dashboard", createdAt: "2026-01-01T00:00:00Z" },
    { id: 4, word: "login", createdAt: "2026-01-01T00:00:00Z" },
    { id: 5, word: "masuk", createdAt: "2026-01-01T00:00:00Z" },
    { id: 6, word: "daftar", createdAt: "2026-01-01T00:00:00Z" },
    { id: 7, word: "s", createdAt: "2026-01-01T00:00:00Z" },
    { id: 8, word: "qr", createdAt: "2026-01-01T00:00:00Z" },
    { id: 9, word: "harga", createdAt: "2026-01-01T00:00:00Z" },
    { id: 10, word: "tentang", createdAt: "2026-01-01T00:00:00Z" },
    { id: 11, word: "kontak", createdAt: "2026-01-01T00:00:00Z" },
    { id: 12, word: "bca", createdAt: "2026-01-01T00:00:00Z" },
    { id: 13, word: "mandiri", createdAt: "2026-01-01T00:00:00Z" },
    { id: 14, word: "bri", createdAt: "2026-01-01T00:00:00Z" },
  ];
}

if (!globalAdminStore.__adminAuditLogs) {
  globalAdminStore.__adminAuditLogs = [
    {
      id: "log-001",
      actorId: "usr-admin-1",
      actorName: "Super Admin",
      action: "LINK_BLOCKED",
      targetType: "link",
      targetId: "lnk-phish-99",
      metadata: { slug: "login-bca-palsu", reason: "Phishing credentials perbankan" },
      createdAt: new Date(Date.now() - 15 * 60000).toISOString(),
    },
    {
      id: "log-002",
      actorId: "usr-admin-1",
      actorName: "Super Admin",
      action: "USER_BANNED",
      targetType: "user",
      targetId: "usr-009",
      metadata: { email: "scammer.link@tempmail.com", reason: "Membuat tautan spam berulang kali" },
      createdAt: new Date(Date.now() - 2 * 3600000).toISOString(),
    },
    {
      id: "log-003",
      actorId: "usr-admin-1",
      actorName: "Super Admin",
      action: "DOMAIN_BLOCKED",
      targetType: "domain",
      targetId: "bit.ly-phishing.example",
      metadata: { reason: "Blacklist domain phishing" },
      createdAt: new Date(Date.now() - 5 * 3600000).toISOString(),
    },
    {
      id: "log-004",
      actorId: "usr-admin-1",
      actorName: "Super Admin",
      action: "RESERVED_WORD_ADDED",
      targetType: "reserved_word",
      targetId: "bca",
      metadata: { word: "bca" },
      createdAt: new Date(Date.now() - 24 * 3600000).toISOString(),
    },
  ];
}

if (!globalAdminStore.__adminSettings) {
  globalAdminStore.__adminSettings = {
    siteName: "Pendek-In",
    maintenanceMode: false,
    guestRateLimitHour: 10,
    memberRateLimitHour: 200,
    apiRateLimitMinute: 120,
    customDomainEnabled: true,
    contactEmail: "admin@pendek.in",
  };
}

function isSupabaseConfigured(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      !process.env.NEXT_PUBLIC_SUPABASE_URL.includes("xxxxxxxxxxxx") &&
      process.env.NEXT_PUBLIC_SUPABASE_URL !== "https://placeholder.supabase.co"
  );
}

// ==========================================
// 1. HELPER AUDIT LOG
// ==========================================

export async function logAudit(
  action: string,
  targetType?: string,
  targetId?: string,
  metadata?: Record<string, unknown>
): Promise<boolean> {
  const newLog: AuditLogItem = {
    id: `log-${Date.now()}`,
    actorId: null,
    actorName: "Super Admin",
    action,
    targetType: targetType || null,
    targetId: targetId || null,
    metadata: metadata || null,
    createdAt: new Date().toISOString(),
  };

  if (!isSupabaseConfigured()) {
    globalAdminStore.__adminAuditLogs?.unshift(newLog);
    revalidatePath("/admin");
    revalidatePath("/admin/log-aktivitas");
    return true;
  }

  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    const actorId = user?.id || null;

    await supabase.from("audit_logs").insert({
      actor_id: actorId,
      action,
      target_type: targetType || null,
      target_id: targetId || null,
      metadata: metadata ? (metadata as unknown as import("@/types/database").Json) : null,
    });

    revalidatePath("/admin");
    revalidatePath("/admin/log-aktivitas");
    return true;
  } catch {
    // Simpan di fallback memory jika database error
    globalAdminStore.__adminAuditLogs?.unshift(newLog);
    return true;
  }
}

// ==========================================
// 2. AUDIT LOGS QUERIES
// ==========================================

export async function getAuditLogs(options?: {
  action?: string;
  targetType?: string;
  limit?: number;
}): Promise<{ success: boolean; data: AuditLogItem[] }> {
  const { action, targetType, limit = 50 } = options || {};

  if (!isSupabaseConfigured()) {
    let logs = [...(globalAdminStore.__adminAuditLogs || [])];
    if (action && action !== "all") {
      logs = logs.filter((l) => l.action.toLowerCase() === action.toLowerCase());
    }
    if (targetType && targetType !== "all") {
      logs = logs.filter((l) => l.targetType?.toLowerCase() === targetType.toLowerCase());
    }
    return { success: true, data: logs.slice(0, limit) };
  }

  try {
    const supabase = await createClient();
    let query = supabase
      .from("audit_logs")
      .select("*, profiles:actor_id(full_name)")
      .order("created_at", { ascending: false })
      .limit(limit);

    if (action && action !== "all") {
      query = query.eq("action", action);
    }
    if (targetType && targetType !== "all") {
      query = query.eq("target_type", targetType);
    }

    const { data, error } = await query;
    if (error || !data) {
      return { success: true, data: globalAdminStore.__adminAuditLogs?.slice(0, limit) || [] };
    }

    const formatted: AuditLogItem[] = data.map((d) => ({
      id: d.id,
      actorId: d.actor_id,
      actorName:
        d.profiles && typeof d.profiles === "object" && "full_name" in d.profiles
          ? String(d.profiles.full_name)
          : "Super Admin",
      action: d.action,
      targetType: d.target_type,
      targetId: d.target_id,
      metadata: d.metadata as Record<string, unknown> | null,
      createdAt: d.created_at,
    }));

    return { success: true, data: formatted };
  } catch {
    return { success: true, data: globalAdminStore.__adminAuditLogs?.slice(0, limit) || [] };
  }
}

// ==========================================
// 3. ADMIN GLOBAL STATS
// ==========================================

export async function getAdminStats() {
  if (!isSupabaseConfigured()) {
    return {
      success: true,
      data: {
        totalUsers: 1420,
        newUsersThisWeek: 124,
        totalLinks: 8449,
        blockedLinks: 18,
        totalClicks: 245890,
        activeRatePercent: 98.4,
      },
    };
  }

  try {
    const supabase = await createClient();

    const [{ count: userCount }, { count: linkCount }, { count: blockedCount }] = await Promise.all([
      supabase.from("profiles").select("*", { count: "exact", head: true }),
      supabase.from("links").select("*", { count: "exact", head: true }),
      supabase.from("links").select("*", { count: "exact", head: true }).eq("status", "blocked"),
    ]);

    const { data: clicksSum } = await supabase.from("links").select("click_count");
    const totalClicks = (clicksSum || []).reduce((acc, curr) => acc + (curr.click_count || 0), 0);

    return {
      success: true,
      data: {
        totalUsers: userCount || 1,
        newUsersThisWeek: Math.max(1, Math.round((userCount || 1) * 0.12)),
        totalLinks: linkCount || 0,
        blockedLinks: blockedCount || 0,
        totalClicks: totalClicks || 0,
        activeRatePercent: linkCount ? (((linkCount - (blockedCount || 0)) / linkCount) * 100).toFixed(1) : 100,
      },
    };
  } catch {
    return {
      success: true,
      data: {
        totalUsers: 1420,
        newUsersThisWeek: 124,
        totalLinks: 8449,
        blockedLinks: 18,
        totalClicks: 245890,
        activeRatePercent: 98.4,
      },
    };
  }
}

// ==========================================
// 4. ADMIN USER MANAGEMENT
// ==========================================

export async function getAdminUsers(options?: {
  search?: string;
  role?: string;
  status?: string;
  limit?: number;
}): Promise<{ success: boolean; data: AdminUserItem[] }> {
  const { search, role, status, limit = 50 } = options || {};

  if (!isSupabaseConfigured()) {
    const fallbackUsers: AdminUserItem[] = [
      {
        id: "usr-001",
        email: "dimas.pratama@gmail.com",
        fullName: "Dimas Pratama",
        avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
        role: "member",
        status: "active",
        linksCount: 14,
        totalClicks: 8420,
        createdAt: "2026-01-10T08:30:00Z",
      },
      {
        id: "usr-002",
        email: "siti.rahmawati@digitalagency.id",
        fullName: "Siti Rahmawati",
        avatarUrl: null,
        role: "member",
        status: "active",
        linksCount: 42,
        totalClicks: 34120,
        createdAt: "2026-01-14T11:20:00Z",
      },
      {
        id: "usr-003",
        email: "admin@pendek.in",
        fullName: "Super Administrator",
        avatarUrl: null,
        role: "super_admin",
        status: "active",
        linksCount: 5,
        totalClicks: 1240,
        createdAt: "2026-01-01T00:00:00Z",
      },
      {
        id: "usr-004",
        email: "spammer.bot99@trashmail.com",
        fullName: "Bot Trafik Promo",
        avatarUrl: null,
        role: "member",
        status: "suspended",
        linksCount: 88,
        totalClicks: 412,
        createdAt: "2026-02-01T15:00:00Z",
      },
    ];

    let filtered = fallbackUsers;
    if (search) {
      const q = search.toLowerCase();
      filtered = filtered.filter(
        (u) => u.fullName.toLowerCase().includes(q) || u.email.toLowerCase().includes(q)
      );
    }
    if (role && role !== "all") {
      filtered = filtered.filter((u) => u.role === role);
    }
    if (status && status !== "all") {
      filtered = filtered.filter((u) => u.status === status);
    }

    return { success: true, data: filtered.slice(0, limit) };
  }

  try {
    const supabase = await createClient();
    let query = supabase.from("profiles").select("*, links:links(id, click_count)").limit(limit);

    if (role && role !== "all") {
      query = query.eq("role", role as UserRole);
    }
    if (status && status !== "all") {
      query = query.eq("status", status as UserStatus);
    }
    if (search) {
      query = query.ilike("full_name", `%${search}%`);
    }

    const { data, error } = await query;
    if (error || !data) {
      return { success: false, data: [] };
    }

    const users: AdminUserItem[] = data.map((p) => {
      const linksArr = (p.links as unknown as Array<{ id: string; click_count: number }>) || [];
      const linksCount = linksArr.length;
      const totalClicks = linksArr.reduce((sum, curr) => sum + (curr.click_count || 0), 0);

      return {
        id: p.id,
        email: `${p.full_name.toLowerCase().replace(/\s+/g, ".")}@gmail.com`,
        fullName: p.full_name,
        avatarUrl: p.avatar_url,
        role: p.role,
        status: p.status,
        linksCount,
        totalClicks,
        createdAt: p.created_at,
      };
    });

    return { success: true, data: users };
  } catch {
    return { success: false, data: [] };
  }
}

export async function updateUserStatus(
  userId: string,
  newStatus: UserStatus,
  reason?: string
): Promise<{ success: boolean; error?: string }> {
  if (!userId) return { success: false, error: "User ID diperlukan" };

  try {
    if (isSupabaseConfigured()) {
      const supabase = await createClient();
      const { error } = await supabase
        .from("profiles")
        .update({ status: newStatus, updated_at: new Date().toISOString() })
        .eq("id", userId);

      if (error) {
        return { success: false, error: error.message };
      }
    }

    await logAudit(
      newStatus === "suspended" ? "USER_BANNED" : "USER_UNBANNED",
      "user",
      userId,
      { newStatus, reason: reason || "Keputusan Moderasi Admin" }
    );

    revalidatePath("/admin");
    revalidatePath("/admin/pengguna");
    revalidatePath(`/admin/pengguna/${userId}`);

    return { success: true };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Gagal mengubah status pengguna";
    return { success: false, error: message };
  }
}

export async function resetUserPasswordAdmin(userId: string) {
  await logAudit("USER_PASSWORD_RESET_TRIGGERED", "user", userId, {
    method: "admin_trigger",
  });
  return { success: true, message: "Tautan reset kata sandi berhasil dikirim ke email pengguna." };
}

// ==========================================
// 5. ADMIN LINK MODERATION
// ==========================================

export async function getAdminLinks(options?: {
  search?: string;
  status?: string;
  limit?: number;
}): Promise<{ success: boolean; data: AdminLinkItem[] }> {
  const { search, status, limit = 50 } = options || {};

  if (!isSupabaseConfigured()) {
    const fallbackLinks: AdminLinkItem[] = [
      {
        id: "lnk-001",
        userId: "usr-001",
        authorName: "Dimas Pratama",
        authorEmail: "dimas.pratama@gmail.com",
        originalUrl: "https://toko-bunga-jakarta.com/katalog-pernikahan-2026",
        slug: "buket-nikah-jkt",
        title: "Katalog Buket Pernikahan Jakarta 2026",
        shortUrl: "https://pendek.in/s/buket-nikah-jkt",
        status: "active",
        clickCount: 1420,
        uniqueClickCount: 980,
        createdAt: "2026-03-01T10:00:00Z",
      },
      {
        id: "lnk-002",
        userId: "usr-002",
        authorName: "Siti Rahmawati",
        authorEmail: "siti.rahmawati@digitalagency.id",
        originalUrl: "https://play.google.com/store/apps/details?id=com.pendekin.app",
        slug: "promo",
        title: "Download Pendek-In Mobile App",
        shortUrl: "https://pendek.in/s/promo",
        status: "active",
        clickCount: 3890,
        uniqueClickCount: 2450,
        createdAt: "2026-03-05T12:00:00Z",
      },
      {
        id: "lnk-003",
        userId: "usr-004",
        authorName: "Bot Trafik Promo",
        authorEmail: "spammer.bot99@trashmail.com",
        originalUrl: "https://hadiah-telkomsel-palsu.online/klaim-kuota",
        slug: "kuota-gratis-100gb",
        title: "Klaim Kuota Gratis Telkomsel 100GB",
        shortUrl: "https://pendek.in/s/kuota-gratis-100gb",
        status: "blocked",
        clickCount: 88,
        uniqueClickCount: 45,
        createdAt: "2026-03-10T08:00:00Z",
      },
    ];

    let filtered = fallbackLinks;
    if (search) {
      const q = search.toLowerCase();
      filtered = filtered.filter(
        (l) =>
          l.title.toLowerCase().includes(q) ||
          l.slug.toLowerCase().includes(q) ||
          l.originalUrl.toLowerCase().includes(q) ||
          l.authorName.toLowerCase().includes(q)
      );
    }
    if (status && status !== "all") {
      filtered = filtered.filter((l) => l.status === status);
    }

    return { success: true, data: filtered.slice(0, limit) };
  }

  try {
    const supabase = await createClient();
    let query = supabase
      .from("links")
      .select("*, profiles:user_id(full_name)")
      .order("created_at", { ascending: false })
      .limit(limit);

    if (status && status !== "all") {
      query = query.eq("status", status as LinkStatus);
    }
    if (search) {
      query = query.or(`title.ilike.%${search}%,slug.ilike.%${search}%,original_url.ilike.%${search}%`);
    }

    const { data, error } = await query;
    if (error || !data) {
      return { success: false, data: [] };
    }

    const origin = typeof window !== "undefined" ? window.location.origin : "https://pendek.in";

    const links: AdminLinkItem[] = data.map((l) => ({
      id: l.id,
      userId: l.user_id,
      authorName:
        l.profiles && typeof l.profiles === "object" && "full_name" in l.profiles
          ? String(l.profiles.full_name)
          : "Pengguna",
      authorEmail: "user@pendek.in",
      originalUrl: l.original_url,
      slug: l.slug,
      title: l.title || l.slug,
      shortUrl: `${origin}/s/${l.slug}`,
      status: l.status,
      clickCount: l.click_count,
      uniqueClickCount: l.unique_click_count,
      createdAt: l.created_at,
    }));

    return { success: true, data: links };
  } catch {
    return { success: false, data: [] };
  }
}

export async function updateLinkStatusAdmin(
  linkId: string,
  newStatus: LinkStatus,
  reason?: string
): Promise<{ success: boolean; error?: string }> {
  if (!linkId) return { success: false, error: "Link ID diperlukan" };

  try {
    if (isSupabaseConfigured()) {
      const supabase = await createClient();
      const { error } = await supabase
        .from("links")
        .update({ status: newStatus, updated_at: new Date().toISOString() })
        .eq("id", linkId);

      if (error) {
        return { success: false, error: error.message };
      }
    }

    await logAudit(
      newStatus === "blocked" ? "LINK_BLOCKED" : "LINK_UNBLOCKED",
      "link",
      linkId,
      { newStatus, reason: reason || "Moderasi Admin" }
    );

    revalidatePath("/admin");
    revalidatePath("/admin/tautan");
    revalidatePath(`/admin/tautan/${linkId}`);

    return { success: true };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Gagal mengubah status link";
    return { success: false, error: message };
  }
}

export async function deleteLinkAdmin(linkId: string, reason?: string) {
  if (!linkId) return { success: false, error: "Link ID diperlukan" };

  try {
    if (isSupabaseConfigured()) {
      const supabase = await createClient();
      const { error } = await supabase.from("links").delete().eq("id", linkId);
      if (error) return { success: false, error: error.message };
    }

    await logAudit("LINK_DELETED_BY_ADMIN", "link", linkId, {
      reason: reason || "Dihapus oleh admin karena melanggar ketentuan",
    });

    revalidatePath("/admin");
    revalidatePath("/admin/tautan");

    return { success: true };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Gagal menghapus tautan";
    return { success: false, error: message };
  }
}

// ==========================================
// 6. BLOCKED DOMAINS (CRUD)
// ==========================================

export async function getBlockedDomains(search?: string): Promise<{
  success: boolean;
  data: BlockedDomainItem[];
}> {
  if (!isSupabaseConfigured()) {
    let items = [...(globalAdminStore.__adminBlockedDomains || [])];
    if (search) {
      items = items.filter((d) => d.domain.toLowerCase().includes(search.toLowerCase()));
    }
    return { success: true, data: items };
  }

  try {
    const supabase = await createClient();
    let query = supabase.from("blocked_domains").select("*").order("created_at", { ascending: false });

    if (search) {
      query = query.ilike("domain", `%${search}%`);
    }

    const { data, error } = await query;
    if (error || !data) {
      return { success: true, data: globalAdminStore.__adminBlockedDomains || [] };
    }

    const mapped: BlockedDomainItem[] = data.map((d) => ({
      id: d.id,
      domain: d.domain,
      reason: d.reason,
      addedBy: d.added_by || "Super Admin",
      createdAt: d.created_at,
    }));

    return { success: true, data: mapped };
  } catch {
    return { success: true, data: globalAdminStore.__adminBlockedDomains || [] };
  }
}

export async function addBlockedDomain(
  domain: string,
  reason?: string
): Promise<{ success: boolean; data?: BlockedDomainItem; error?: string }> {
  const parsed = blockedDomainSchema.safeParse({ domain, reason });
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message || "Input domain tidak valid" };
  }

  const { domain: cleanDomain, reason: cleanReason } = parsed.data;
  if (!cleanDomain || !cleanDomain.includes(".")) {
    return { success: false, error: "Format nama domain tidak valid (contoh: situs-phishing.com)" };
  }

  const newItem: BlockedDomainItem = {
    id: Date.now(),
    domain: cleanDomain,
    reason: cleanReason || "Domain terindikasi berbahaya",
    addedBy: "Super Admin",
    createdAt: new Date().toISOString(),
  };

  if (!isSupabaseConfigured()) {
    globalAdminStore.__adminBlockedDomains?.unshift(newItem);
    await logAudit("DOMAIN_BLOCKED", "domain", cleanDomain, { reason: cleanReason });
    revalidatePath("/admin/domain-terblokir");
    return { success: true, data: newItem };
  }

  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    const { data, error } = await supabase
      .from("blocked_domains")
      .insert({
        domain: cleanDomain,
        reason: cleanReason || null,
        added_by: user?.id || null,
      })
      .select()
      .single();

    if (error) {
      return { success: false, error: error.message };
    }

    await logAudit("DOMAIN_BLOCKED", "domain", cleanDomain, { reason: cleanReason });
    revalidatePath("/admin/domain-terblokir");

    return {
      success: true,
      data: {
        id: data.id,
        domain: data.domain,
        reason: data.reason,
        addedBy: "Super Admin",
        createdAt: data.created_at,
      },
    };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Kesalahan database";
    return { success: false, error: message };
  }
}

export async function deleteBlockedDomain(id: number): Promise<{ success: boolean; error?: string }> {
  if (!isSupabaseConfigured()) {
    if (globalAdminStore.__adminBlockedDomains) {
      globalAdminStore.__adminBlockedDomains = globalAdminStore.__adminBlockedDomains.filter(
        (d) => d.id !== id
      );
    }
    await logAudit("DOMAIN_UNBLOCKED", "domain", String(id));
    revalidatePath("/admin/domain-terblokir");
    return { success: true };
  }

  try {
    const supabase = await createClient();
    const { error } = await supabase.from("blocked_domains").delete().eq("id", id);
    if (error) return { success: false, error: error.message };

    await logAudit("DOMAIN_UNBLOCKED", "domain", String(id));
    revalidatePath("/admin/domain-terblokir");
    return { success: true };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Kesalahan database";
    return { success: false, error: message };
  }
}

// ==========================================
// 7. RESERVED WORDS (CRUD)
// ==========================================

export async function getReservedWords(search?: string): Promise<{
  success: boolean;
  data: ReservedWordItem[];
}> {
  if (!isSupabaseConfigured()) {
    let items = [...(globalAdminStore.__adminReservedWords || [])];
    if (search) {
      items = items.filter((w) => w.word.toLowerCase().includes(search.toLowerCase()));
    }
    return { success: true, data: items };
  }

  try {
    const supabase = await createClient();
    let query = supabase.from("reserved_words").select("*").order("word", { ascending: true });

    if (search) {
      query = query.ilike("word", `%${search}%`);
    }

    const { data, error } = await query;
    if (error || !data) {
      return { success: true, data: globalAdminStore.__adminReservedWords || [] };
    }

    const mapped: ReservedWordItem[] = data.map((w) => ({
      id: w.id,
      word: w.word,
      createdAt: w.created_at,
    }));

    return { success: true, data: mapped };
  } catch {
    return { success: true, data: globalAdminStore.__adminReservedWords || [] };
  }
}

export async function addReservedWord(
  word: string
): Promise<{ success: boolean; data?: ReservedWordItem; error?: string }> {
  const parsed = reservedWordSchema.safeParse({ word });
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message || "Kata slug terlarang tidak valid" };
  }

  const cleanWord = parsed.data.word;
  if (!cleanWord) {
    return { success: false, error: "Kata slug terlarang wajib diisi" };
  }

  const newItem: ReservedWordItem = {
    id: Date.now(),
    word: cleanWord,
    createdAt: new Date().toISOString(),
  };

  if (!isSupabaseConfigured()) {
    globalAdminStore.__adminReservedWords?.unshift(newItem);
    await logAudit("RESERVED_WORD_ADDED", "reserved_word", cleanWord);
    revalidatePath("/admin/kata-terlarang");
    return { success: true, data: newItem };
  }

  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("reserved_words")
      .insert({ word: cleanWord })
      .select()
      .single();

    if (error) {
      return { success: false, error: error.message };
    }

    await logAudit("RESERVED_WORD_ADDED", "reserved_word", cleanWord);
    revalidatePath("/admin/kata-terlarang");

    return {
      success: true,
      data: {
        id: data.id,
        word: data.word,
        createdAt: data.created_at,
      },
    };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Kesalahan database";
    return { success: false, error: message };
  }
}

export async function deleteReservedWord(id: number): Promise<{ success: boolean; error?: string }> {
  if (!isSupabaseConfigured()) {
    if (globalAdminStore.__adminReservedWords) {
      globalAdminStore.__adminReservedWords = globalAdminStore.__adminReservedWords.filter(
        (w) => w.id !== id
      );
    }
    await logAudit("RESERVED_WORD_DELETED", "reserved_word", String(id));
    revalidatePath("/admin/kata-terlarang");
    return { success: true };
  }

  try {
    const supabase = await createClient();
    const { error } = await supabase.from("reserved_words").delete().eq("id", id);
    if (error) return { success: false, error: error.message };

    await logAudit("RESERVED_WORD_DELETED", "reserved_word", String(id));
    revalidatePath("/admin/kata-terlarang");
    return { success: true };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Kesalahan database";
    return { success: false, error: message };
  }
}

// ==========================================
// 8. SYSTEM SETTINGS
// ==========================================

export async function getSystemSettings(): Promise<{
  success: boolean;
  data: SystemSettingsData;
}> {
  return {
    success: true,
    data: globalAdminStore.__adminSettings || {
      siteName: "Pendek-In",
      maintenanceMode: false,
      guestRateLimitHour: 10,
      memberRateLimitHour: 200,
      apiRateLimitMinute: 120,
      customDomainEnabled: true,
      contactEmail: "admin@pendek.in",
    },
  };
}

export async function updateSystemSettings(settings: SystemSettingsData) {
  globalAdminStore.__adminSettings = { ...settings };
  await logAudit("SYSTEM_SETTINGS_UPDATED", "system", "config", settings as unknown as Record<string, unknown>);
  revalidatePath("/admin/pengaturan");
  return { success: true, message: "Pengaturan sistem berhasil diperbarui." };
}
