import { Resend } from "resend";

// Inisialisasi Resend client secara kondisional
const resendApiKey = process.env.RESEND_API_KEY;
const resend = resendApiKey ? new Resend(resendApiKey) : null;

const FROM_EMAIL =
  process.env.EMAIL_FROM || "Pendek-In <notifications@pendek.in>";
const APP_URL =
  process.env.NEXT_PUBLIC_APP_URL || "https://pendek.in";

export type SecurityAlertType = "api_key_created" | "new_device_login";

interface SecurityAlertParams {
  to: string;
  type: SecurityAlertType;
  metadata?: {
    keyName?: string;
    keyPrefix?: string;
    userAgent?: string;
    ipAddress?: string;
    timestamp?: string;
  };
}

interface WeeklyDigestParams {
  to: string;
  userName: string;
  totalClicks: number;
  uniqueClicks: number;
  weekRange: string;
  topLinks: Array<{
    title: string;
    slug: string;
    clicks: number;
  }>;
}

/**
 * 1. Kirim Peringatan Keamanan (Security Alert) via Resend
 */
export async function sendSecurityAlertEmail({
  to,
  type,
  metadata = {},
}: SecurityAlertParams): Promise<{
  success: boolean;
  messageId?: string;
  error?: string;
  mocked?: boolean;
}> {
  const timestamp = metadata.timestamp || new Date().toLocaleString("id-ID", {
    timeZone: "Asia/Jakarta",
    dateStyle: "full",
    timeStyle: "medium",
  });

  const isApiKey = type === "api_key_created";
  const subject = isApiKey
    ? "⚠️ [PENTING] Kunci API (API Key) Baru Telah Dibuat - Pendek-In"
    : "🛡️ [PENTING] Aktivitas Login Baru Terdeteksi - Pendek-In";

  const actionText = isApiKey
    ? "Sebuah Kunci API baru telah berhasil di-generate untuk akun Anda. Kunci ini memberikan akses penuh untuk memanipulasi tautan singkat melalui REST API v1."
    : "Kami mendeteksi adanya sesi login baru ke akun Pendek-In Anda. Pastikan bahwa Anda mengenali aktivitas ini.";

  const detailsHtml = isApiKey
    ? `
      <div style="background-color: #FDF6E2; border: 2px solid #000; padding: 16px; margin: 20px 0; box-shadow: 4px 4px 0px #000;">
        <p style="margin: 0 0 8px 0; font-weight: 800; font-size: 14px; text-transform: uppercase; color: #000;">Detail Kunci API:</p>
        <p style="margin: 4px 0; font-size: 13px;"><strong>Label / Nama:</strong> ${metadata.keyName || "API Key"}</p>
        <p style="margin: 4px 0; font-size: 13px;"><strong>Prefix Kunci:</strong> <code style="background: #fff; padding: 2px 6px; border: 1px solid #000; font-weight: bold;">${metadata.keyPrefix || "pk_live_..."}</code></p>
        <p style="margin: 4px 0; font-size: 13px;"><strong>Waktu Dibuat:</strong> ${timestamp} WIB</p>
        ${metadata.ipAddress ? `<p style="margin: 4px 0; font-size: 13px;"><strong>Alamat IP:</strong> ${metadata.ipAddress}</p>` : ""}
      </div>
    `
    : `
      <div style="background-color: #FDF6E2; border: 2px solid #000; padding: 16px; margin: 20px 0; box-shadow: 4px 4px 0px #000;">
        <p style="margin: 0 0 8px 0; font-weight: 800; font-size: 14px; text-transform: uppercase; color: #000;">Detail Sesi Login:</p>
        <p style="margin: 4px 0; font-size: 13px;"><strong>Waktu Login:</strong> ${timestamp} WIB</p>
        ${metadata.ipAddress ? `<p style="margin: 4px 0; font-size: 13px;"><strong>Alamat IP:</strong> ${metadata.ipAddress}</p>` : ""}
        ${metadata.userAgent ? `<p style="margin: 4px 0; font-size: 13px;"><strong>Perangkat / Browser:</strong> ${metadata.userAgent}</p>` : ""}
      </div>
    `;

  const warningAction = isApiKey
    ? `Jika Anda merasa tidak membuat kunci ini, segera cabut (revoke) kunci tersebut di menu <a href="${APP_URL}/dashboard/api-key" style="color: #000; font-weight: bold; text-decoration: underline;">Dashboard API Key</a> untuk mengamankan data Anda.`
    : `Jika aktivitas ini mencurigakan atau bukan Anda, segera amankan akun Anda dengan mengganti kata sandi di menu <a href="${APP_URL}/dashboard/pengaturan" style="color: #000; font-weight: bold; text-decoration: underline;">Pengaturan Akun</a>.`;

  const htmlContent = `
<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${subject}</title>
</head>
<body style="margin: 0; padding: 24px; background-color: #F5F5F0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #000;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width: 600px; margin: 0 auto; background-color: #FFFFFF; border: 3px solid #000000; box-shadow: 8px 8px 0px #000000;">
    <!-- Header -->
    <tr>
      <td style="padding: 24px; border-bottom: 3px solid #000000; background-color: #FFD23F;">
        <div style="display: inline-block; background: #000; color: #fff; padding: 4px 8px; font-weight: 900; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 8px;">
          Keamanan Akun
        </div>
        <h1 style="margin: 0; font-size: 24px; font-weight: 900; color: #000; text-transform: uppercase; line-height: 1.2;">
          ${isApiKey ? "Peringatan: API Key Dibuat" : "Peringatan: Aktivitas Login"}
        </h1>
      </td>
    </tr>

    <!-- Body -->
    <tr>
      <td style="padding: 24px;">
        <p style="font-size: 15px; line-height: 1.6; margin: 0 0 16px 0;">
          Halo,
        </p>
        <p style="font-size: 15px; line-height: 1.6; margin: 0 0 16px 0;">
          ${actionText}
        </p>

        ${detailsHtml}

        <p style="font-size: 14px; line-height: 1.6; color: #222; margin: 20px 0;">
          ${warningAction}
        </p>

        <!-- CTA Button -->
        <div style="margin: 28px 0; text-align: center;">
          <a href="${APP_URL}/dashboard" style="display: inline-block; background-color: #000000; color: #FFFFFF; text-decoration: none; padding: 12px 28px; font-size: 14px; font-weight: 800; text-transform: uppercase; border: 2px solid #000000; box-shadow: 4px 4px 0px #FFD23F;">
            Buka Dashboard Keamanan &rarr;
          </a>
        </div>
      </td>
    </tr>

    <!-- Footer -->
    <tr>
      <td style="padding: 20px 24px; background-color: #F5F5F0; border-top: 3px solid #000000; font-size: 12px; color: #555; text-align: center;">
        <p style="margin: 0 0 4px 0; font-weight: bold; color: #000;">
          Pendek-In &bull; URL Shortener Modern &amp; Cepat
        </p>
        <p style="margin: 0;">
          Email peringatan keamanan otomatis dikirim demi melindungi integritas akun Anda.
        </p>
      </td>
    </tr>
  </table>
</body>
</html>
  `;

  // Fallback simulasi jika Resend API key belum diset di environment
  if (!resend) {
    console.warn(
      `[EMAIL SIMULATION] Security alert (${type}) to "${to}" logged. Set RESEND_API_KEY in .env.local to enable live delivery.`
    );
    return {
      success: true,
      mocked: true,
      messageId: `mock-security-${Date.now()}`,
    };
  }

  try {
    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: [to],
      subject,
      html: htmlContent,
    });

    if (error) {
      console.error("[RESEND ERROR] Failed to send security alert:", error);
      return { success: false, error: error.message };
    }

    return { success: true, messageId: data?.id };
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Gagal mengirim email";
    console.error("[RESEND EXCEPTION]:", msg);
    return { success: false, error: msg };
  }
}

/**
 * 2. Kirim Ringkasan Mingguan (Weekly Digest) via Resend
 */
export async function sendWeeklyDigestEmail({
  to,
  userName,
  totalClicks,
  uniqueClicks,
  weekRange,
  topLinks,
}: WeeklyDigestParams): Promise<{
  success: boolean;
  messageId?: string;
  error?: string;
  mocked?: boolean;
}> {
  const subject = `📊 Ringkasan Mingguan Performa Tautan (${weekRange}) - Pendek-In`;

  const topLinksListHtml =
    topLinks.length > 0
      ? topLinks
          .map(
            (link, idx) => `
        <tr style="border-bottom: 2px solid #000;">
          <td style="padding: 10px; font-weight: 800; font-size: 14px;">#${idx + 1}</td>
          <td style="padding: 10px;">
            <div style="font-weight: 700; font-size: 13px; color: #000;">${link.title || "Tautan Singkat"}</div>
            <a href="${APP_URL}/${link.slug}" style="font-size: 12px; color: #000; text-decoration: underline; font-family: monospace;">
              pendek.in/${link.slug}
            </a>
          </td>
          <td style="padding: 10px; text-align: right; font-weight: 900; font-size: 14px;">
            <span style="background: #00D26A; padding: 2px 8px; border: 1px solid #000; box-shadow: 2px 2px 0px #000;">
              ${link.clicks.toLocaleString("id-ID")}
            </span>
          </td>
        </tr>
      `
          )
          .join("")
      : `
        <tr>
          <td colspan="3" style="padding: 16px; text-align: center; font-size: 13px; color: #666;">
            Belum ada data kunjungan link pada periode minggu ini.
          </td>
        </tr>
      `;

  const htmlContent = `
<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${subject}</title>
</head>
<body style="margin: 0; padding: 24px; background-color: #F5F5F0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #000;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width: 600px; margin: 0 auto; background-color: #FFFFFF; border: 3px solid #000000; box-shadow: 8px 8px 0px #000000;">
    <!-- Header -->
    <tr>
      <td style="padding: 24px; border-bottom: 3px solid #000000; background-color: #00D26A;">
        <div style="display: inline-block; background: #000; color: #fff; padding: 4px 8px; font-weight: 900; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 8px;">
          Weekly Digest
        </div>
        <h1 style="margin: 0; font-size: 24px; font-weight: 900; color: #000; text-transform: uppercase; line-height: 1.2;">
          Ringkasan Mingguan
        </h1>
        <p style="margin: 4px 0 0 0; font-size: 13px; font-weight: 700; color: #000;">
          Periode: ${weekRange}
        </p>
      </td>
    </tr>

    <!-- Body -->
    <tr>
      <td style="padding: 24px;">
        <p style="font-size: 15px; line-height: 1.6; margin: 0 0 16px 0;">
          Halo <strong>${userName}</strong>,
        </p>
        <p style="font-size: 14px; line-height: 1.6; margin: 0 0 20px 0; color: #333;">
          Berikut adalah performa seluruh tautan singkat Anda selama satu pekan terakhir:
        </p>

        <!-- Metrik Utama -->
        <table width="100%" cellspacing="0" cellpadding="0" style="margin-bottom: 24px;">
          <tr>
            <td width="50%" style="padding-right: 8px;">
              <div style="border: 2px solid #000; background: #fff; padding: 16px; box-shadow: 4px 4px 0px #000;">
                <div style="font-size: 11px; font-weight: 800; text-transform: uppercase; color: #666;">Total Kunjungan</div>
                <div style="font-size: 26px; font-weight: 900; margin-top: 4px; color: #000;">
                  ${totalClicks.toLocaleString("id-ID")}
                </div>
              </div>
            </td>
            <td width="50%" style="padding-left: 8px;">
              <div style="border: 2px solid #000; background: #fff; padding: 16px; box-shadow: 4px 4px 0px #000;">
                <div style="font-size: 11px; font-weight: 800; text-transform: uppercase; color: #666;">Pengunjung Unik</div>
                <div style="font-size: 26px; font-weight: 900; margin-top: 4px; color: #000;">
                  ${uniqueClicks.toLocaleString("id-ID")}
                </div>
              </div>
            </td>
          </tr>
        </table>

        <!-- Top Links Table -->
        <div style="border: 2px solid #000; box-shadow: 4px 4px 0px #000; margin-bottom: 24px;">
          <div style="background: #000; color: #fff; padding: 8px 12px; font-weight: 800; font-size: 12px; text-transform: uppercase;">
            Tautan Paling Populer Pekan Ini
          </div>
          <table width="100%" cellspacing="0" cellpadding="0" style="border-collapse: collapse;">
            <tbody>
              ${topLinksListHtml}
            </tbody>
          </table>
        </div>

        <!-- CTA Button -->
        <div style="margin: 28px 0 12px 0; text-align: center;">
          <a href="${APP_URL}/dashboard/analitik" style="display: inline-block; background-color: #00D26A; color: #000000; text-decoration: none; padding: 12px 28px; font-size: 14px; font-weight: 900; text-transform: uppercase; border: 2px solid #000000; box-shadow: 4px 4px 0px #000000;">
            Lihat Analitik Selengkapnya &rarr;
          </a>
        </div>
      </td>
    </tr>

    <!-- Footer -->
    <tr>
      <td style="padding: 20px 24px; background-color: #F5F5F0; border-top: 3px solid #000000; font-size: 12px; color: #555; text-align: center;">
        <p style="margin: 0 0 4px 0; font-weight: bold; color: #000;">
          Pendek-In &bull; URL Shortener Modern &amp; Cepat
        </p>
        <p style="margin: 0 0 8px 0;">
          Anda menerima email ini karena opsi <em>Weekly Digest</em> aktif di profil Anda.
        </p>
        <p style="margin: 0;">
          Ingin berhenti berlangganan? Kelola preferensi Anda di <a href="${APP_URL}/dashboard/notifikasi" style="color: #000; font-weight: bold; text-decoration: underline;">Pengaturan Notifikasi</a>.
        </p>
      </td>
    </tr>
  </table>
</body>
</html>
  `;

  // Fallback simulasi jika Resend API key belum diset di environment
  if (!resend) {
    console.warn(
      `[EMAIL SIMULATION] Weekly digest to "${to}" logged (${totalClicks} clicks). Set RESEND_API_KEY in .env.local to enable live delivery.`
    );
    return {
      success: true,
      mocked: true,
      messageId: `mock-digest-${Date.now()}`,
    };
  }

  try {
    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: [to],
      subject,
      html: htmlContent,
    });

    if (error) {
      console.error("[RESEND ERROR] Failed to send weekly digest:", error);
      return { success: false, error: error.message };
    }

    return { success: true, messageId: data?.id };
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Gagal mengirim email digest";
    console.error("[RESEND EXCEPTION]:", msg);
    return { success: false, error: msg };
  }
}
