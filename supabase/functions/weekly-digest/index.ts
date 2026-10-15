// Supabase Edge Function: Weekly Digest Cron
// Dijalankan secara terjadwal (misal: setiap Senin pukul 08:00 WIB / 01:00 UTC)
// File: supabase/functions/weekly-digest/index.ts

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.0";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
const CRON_SECRET = Deno.env.get("CRON_SECRET");
const APP_URL = Deno.env.get("APP_URL") || "https://pendek.in";
const FROM_EMAIL = Deno.env.get("EMAIL_FROM") || "Pendek-In <notifications@pendek.in>";

serve(async (req) => {
  // 1. Verifikasi Keamanan Token Cron
  if (CRON_SECRET) {
    const authHeader = req.headers.get("Authorization");
    if (authHeader !== `Bearer ${CRON_SECRET}`) {
      return new Response(JSON.stringify({ error: "Unauthorized cron trigger" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }
  }

  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    return new Response(
      JSON.stringify({ error: "Supabase environment variables missing" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }

  try {
    const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    // 2. Ambil seluruh pengguna aktif yang mengaktifkan email_weekly_digest
    const { data: profiles, error: profileErr } = await supabaseAdmin
      .from("profiles")
      .select("id, full_name, email_weekly_digest")
      .eq("email_weekly_digest", true)
      .eq("status", "active");

    if (profileErr) {
      throw new Error(`Failed to fetch profiles: ${profileErr.message}`);
    }

    if (!profiles || profiles.length === 0) {
      return new Response(
        JSON.stringify({ success: true, message: "No subscribed users found", processed: 0 }),
        { status: 200, headers: { "Content-Type": "application/json" } }
      );
    }

    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const sevenDaysAgoIso = sevenDaysAgo.toISOString();

    const todayStr = new Date().toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
    const pastStr = sevenDaysAgo.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
    });
    const weekRange = `${pastStr} - ${todayStr}`;

    let sentCount = 0;
    const errors: string[] = [];

    // 3. Iterasi setiap pengguna dan kumpulkan performa tautan
    for (const profile of profiles) {
      try {
        // Ambil email dari auth.users
        const { data: userData, error: userErr } =
          await supabaseAdmin.auth.admin.getUserById(profile.id);

        if (userErr || !userData?.user?.email) {
          continue;
        }

        const userEmail = userData.user.email;
        const userName = profile.full_name || "Pengguna";

        // Ambil tautan milik pengguna
        const { data: userLinks } = await supabaseAdmin
          .from("links")
          .select("id, title, slug, click_count")
          .eq("user_id", profile.id);

        if (!userLinks || userLinks.length === 0) {
          continue; // Pengguna belum memiliki tautan
        }

        const linkIds = userLinks.map((l) => l.id);

        // Ambil klik 7 hari terakhir untuk link-link tersebut
        const { data: clicks } = await supabaseAdmin
          .from("clicks")
          .select("link_id, ip_hash")
          .in("link_id", linkIds)
          .gte("created_at", sevenDaysAgoIso);

        const totalClicks = clicks?.length || 0;
        const uniqueIps = new Set((clicks || []).map((c) => c.ip_hash));
        const uniqueClicks = uniqueIps.size;

        // Hitung top links pekan ini berdasarkan frekuensi di `clicks`
        const clickCountByLink: Record<string, number> = {};
        clicks?.forEach((c) => {
          clickCountByLink[c.link_id] = (clickCountByLink[c.link_id] || 0) + 1;
        });

        const topLinks = userLinks
          .map((link) => ({
            title: link.title || "Tautan Singkat",
            slug: link.slug,
            clicks: clickCountByLink[link.id] || 0,
          }))
          .sort((a, b) => b.clicks - a.clicks)
          .slice(0, 5);

        // 4. Kirim Email melalui Resend REST API
        if (RESEND_API_KEY) {
          const topRowsHtml = topLinks
            .map(
              (item, idx) => `
              <tr style="border-bottom: 2px solid #000;">
                <td style="padding: 10px; font-weight: 800; font-size: 14px;">#${idx + 1}</td>
                <td style="padding: 10px;">
                  <div style="font-weight: 700; font-size: 13px; color: #000;">${item.title}</div>
                  <a href="${APP_URL}/${item.slug}" style="font-size: 12px; color: #000; text-decoration: underline; font-family: monospace;">
                    pendek.in/${item.slug}
                  </a>
                </td>
                <td style="padding: 10px; text-align: right; font-weight: 900; font-size: 14px;">
                  <span style="background: #00D26A; padding: 2px 8px; border: 1px solid #000; box-shadow: 2px 2px 0px #000;">
                    ${item.clicks.toLocaleString("id-ID")}
                  </span>
                </td>
              </tr>
            `
            )
            .join("");

          const htmlBody = `
            <!DOCTYPE html>
            <html lang="id">
            <head><meta charset="UTF-8"><title>Ringkasan Mingguan Pendek-In</title></head>
            <body style="margin: 0; padding: 24px; background-color: #F5F5F0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; color: #000;">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width: 600px; margin: 0 auto; background-color: #FFFFFF; border: 3px solid #000000; box-shadow: 8px 8px 0px #000000;">
                <tr>
                  <td style="padding: 24px; border-bottom: 3px solid #000000; background-color: #00D26A;">
                    <div style="display: inline-block; background: #000; color: #fff; padding: 4px 8px; font-weight: 900; font-size: 12px; text-transform: uppercase; margin-bottom: 8px;">
                      Weekly Digest
                    </div>
                    <h1 style="margin: 0; font-size: 24px; font-weight: 900; color: #000; text-transform: uppercase;">
                      Ringkasan Mingguan
                    </h1>
                    <p style="margin: 4px 0 0 0; font-size: 13px; font-weight: 700; color: #000;">
                      Periode: ${weekRange}
                    </p>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 24px;">
                    <p style="font-size: 15px; line-height: 1.6; margin: 0 0 16px 0;">Halo <strong>${userName}</strong>,</p>
                    <p style="font-size: 14px; line-height: 1.6; margin: 0 0 20px 0;">Berikut adalah performa seluruh tautan singkat Anda dalam 7 hari terakhir:</p>
                    
                    <table width="100%" cellspacing="0" cellpadding="0" style="margin-bottom: 24px;">
                      <tr>
                        <td width="50%" style="padding-right: 8px;">
                          <div style="border: 2px solid #000; background: #fff; padding: 16px; box-shadow: 4px 4px 0px #000;">
                            <div style="font-size: 11px; font-weight: 800; text-transform: uppercase; color: #666;">Total Kunjungan</div>
                            <div style="font-size: 26px; font-weight: 900; margin-top: 4px;">${totalClicks}</div>
                          </div>
                        </td>
                        <td width="50%" style="padding-left: 8px;">
                          <div style="border: 2px solid #000; background: #fff; padding: 16px; box-shadow: 4px 4px 0px #000;">
                            <div style="font-size: 11px; font-weight: 800; text-transform: uppercase; color: #666;">Pengunjung Unik</div>
                            <div style="font-size: 26px; font-weight: 900; margin-top: 4px;">${uniqueClicks}</div>
                          </div>
                        </td>
                      </tr>
                    </table>

                    <div style="border: 2px solid #000; box-shadow: 4px 4px 0px #000; margin-bottom: 24px;">
                      <div style="background: #000; color: #fff; padding: 8px 12px; font-weight: 800; font-size: 12px; text-transform: uppercase;">
                        Tautan Paling Populer Pekan Ini
                      </div>
                      <table width="100%" cellspacing="0" cellpadding="0" style="border-collapse: collapse;">
                        <tbody>${topRowsHtml}</tbody>
                      </table>
                    </div>

                    <div style="margin: 28px 0 12px 0; text-align: center;">
                      <a href="${APP_URL}/dashboard/analitik" style="display: inline-block; background-color: #00D26A; color: #000; text-decoration: none; padding: 12px 28px; font-size: 14px; font-weight: 900; text-transform: uppercase; border: 2px solid #000; box-shadow: 4px 4px 0px #000;">
                        Lihat Analitik Selengkapnya &rarr;
                      </a>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 20px 24px; background-color: #F5F5F0; border-top: 3px solid #000; font-size: 12px; color: #555; text-align: center;">
                    <p style="margin: 0 0 4px 0; font-weight: bold; color: #000;">Pendek-In &bull; URL Shortener Modern & Cepat</p>
                    <p style="margin: 0;">Kelola preferensi Anda di <a href="${APP_URL}/dashboard/notifikasi" style="color: #000; font-weight: bold; text-decoration: underline;">Pengaturan Notifikasi</a>.</p>
                  </td>
                </tr>
              </table>
            </body>
            </html>
          `;

          const resendResp = await fetch("https://api.resend.com/emails", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${RESEND_API_KEY}`,
            },
            body: JSON.stringify({
              from: FROM_EMAIL,
              to: [userEmail],
              subject: `📊 Ringkasan Mingguan Performa Tautan (${weekRange}) - Pendek-In`,
              html: htmlBody,
            }),
          });

          if (!resendResp.ok) {
            const errBody = await resendResp.text();
            errors.push(`Resend error for ${userEmail}: ${errBody}`);
          } else {
            sentCount++;
          }
        } else {
          // Mode simulasi/dry-run jika RESEND_API_KEY belum diset
          console.log(`[DRY-RUN DIGEST] Sent to ${userEmail} (${totalClicks} clicks)`);
          sentCount++;
        }
      } catch (userLoopErr: unknown) {
        const msg = userLoopErr instanceof Error ? userLoopErr.message : "Unknown loop error";
        errors.push(`User ${profile.id} failed: ${msg}`);
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: "Weekly digest job completed",
        totalSubscribers: profiles.length,
        emailsSent: sentCount,
        errors: errors.length > 0 ? errors : undefined,
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Server error";
    return new Response(JSON.stringify({ success: false, error: msg }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
});
