import * as React from "react";
import Link from "next/link";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import {
  AlertTriangle,
  Clock,
  ShieldAlert,
  ArrowLeft,
  Home,
  PlusCircle,
} from "lucide-react";
import { BrandLogo } from "@/components/brand-logo";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { PasswordGate } from "@/components/links/password-gate";
import { trackLinkClick } from "@/lib/analytics";
import { getLinkDetail } from "@/actions/links";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function RedirectHandlerPage({ params }: PageProps) {
  const { slug } = await params;
  const headersList = await headers();

  // Ekstraksi Metadata Kunjungan untuk Tracking Non-Blocking
  const forwardedFor = headersList.get("x-forwarded-for");
  const ip =
    forwardedFor?.split(",")[0]?.trim() ||
    headersList.get("x-real-ip") ||
    headersList.get("cf-connecting-ip") ||
    "127.0.0.1";

  const userAgent = headersList.get("user-agent") || "";
  const referrer = headersList.get("referer") || headersList.get("referrer") || null;
  const country =
    headersList.get("x-vercel-ip-country") ||
    headersList.get("cf-ipcountry") ||
    headersList.get("x-country-code") ||
    "ID";
  const city = headersList.get("x-vercel-ip-city") || null;

  // 1. Ambil Data Tautan
  const result = await getLinkDetail(slug);
  const link = result.success ? result.data : null;

  // ==========================================
  // KASUS 1: TAUTAN TIDAK DITEMUKAN (404)
  // ==========================================
  if (!link) {
    return (
      <div className="min-h-screen bg-cream text-black flex flex-col justify-between p-4 sm:p-8">
        <header className="max-w-2xl mx-auto w-full flex items-center justify-between">
          <BrandLogo size="default" />
          <Link
            href="/"
            className="text-xs font-bold text-neutral-600 hover:text-black flex items-center gap-1"
          >
            <ArrowLeft className="h-3.5 w-3.5" strokeWidth={2.5} />
            <span>Ke Beranda</span>
          </Link>
        </header>

        <main className="my-auto py-8 max-w-lg mx-auto w-full">
          <Card className="border-[3px] border-black bg-white shadow-brutal-xl p-6 sm:p-8 space-y-6 text-center">
            <div className="w-16 h-16 mx-auto bg-primary border-2 border-black rounded-xl shadow-brutal flex items-center justify-center">
              <AlertTriangle className="h-8 w-8 text-black" strokeWidth={2.5} />
            </div>

            <div className="space-y-2">
              <div className="inline-block bg-black text-white px-3 py-1 font-mono text-xs font-black uppercase">
                Status 404 &bull; Not Found
              </div>
              <h1 className="text-2xl sm:text-3xl font-black font-heading text-black">
                Tautan Tidak Ditemukan
              </h1>
              <p className="text-sm font-medium text-neutral-600">
                Tautan pendek dengan slug <code className="font-mono font-bold text-black bg-cream px-1.5 py-0.5 border border-black">{slug}</code> tidak terdaftar di sistem Pendek-In atau telah dihapus oleh pemiliknya.
              </p>
            </div>

            <div className="p-4 border-2 border-black bg-cream font-mono text-xs text-neutral-700 text-left space-y-1">
              <p className="font-bold text-black">&bull; Periksa kembali ejaan URL yang Anda tuju.</p>
              <p>&bull; Hubungi penyedia tautan jika menurut Anda ini kesalahan.</p>
            </div>

            <div className="pt-2 border-t-2 border-black flex flex-col sm:flex-row gap-3">
              <Button asChild variant="outline" className="flex-1 border-2 border-black font-bold shadow-brutal">
                <Link href="/">
                  <Home className="h-4 w-4 mr-1.5" strokeWidth={2.5} />
                  <span>Halaman Utama</span>
                </Link>
              </Button>
              <Button asChild variant="default" className="flex-1 font-bold shadow-brutal">
                <Link href="/dashboard/tautan/baru">
                  <PlusCircle className="h-4 w-4 mr-1.5" strokeWidth={2.5} />
                  <span>Buat Tautan Sendiri</span>
                </Link>
              </Button>
            </div>
          </Card>
        </main>

        <footer className="text-center text-xs font-bold text-neutral-600">
          &copy; {new Date().getFullYear()} Pendek-In URL Shortener.
        </footer>
      </div>
    );
  }

  // ==========================================
  // KASUS 2: TAUTAN DIBLOKIR SISTEM (BLOCKED)
  // ==========================================
  if (link.status === "blocked") {
    return (
      <div className="min-h-screen bg-rose-50 text-black flex flex-col justify-between p-4 sm:p-8">
        <header className="max-w-2xl mx-auto w-full flex items-center justify-between">
          <BrandLogo size="default" />
          <Link
            href="/"
            className="text-xs font-bold text-neutral-600 hover:text-black flex items-center gap-1"
          >
            <ArrowLeft className="h-3.5 w-3.5" strokeWidth={2.5} />
            <span>Ke Beranda</span>
          </Link>
        </header>

        <main className="my-auto py-8 max-w-lg mx-auto w-full">
          <Card className="border-[3px] border-black bg-white shadow-brutal-xl p-6 sm:p-8 space-y-6 text-center">
            <div className="w-16 h-16 mx-auto bg-destructive text-white border-2 border-black rounded-xl shadow-brutal flex items-center justify-center">
              <ShieldAlert className="h-8 w-8 text-white" strokeWidth={2.5} />
            </div>

            <div className="space-y-2">
              <div className="inline-block bg-destructive text-white px-3 py-1 font-mono text-xs font-black uppercase border border-black">
                Peringatan Keamanan Sistem
              </div>
              <h1 className="text-2xl sm:text-3xl font-black font-heading text-black">
                Tautan Ini Telah Diblokir!
              </h1>
              <p className="text-sm font-medium text-neutral-700">
                Akses menuju tautan <strong className="font-mono text-black font-bold">pendek.in/s/{slug}</strong> telah dinonaktifkan oleh administrator keamanan Pendek-In.
              </p>
            </div>

            <div className="p-4 border-2 border-black bg-rose-100 font-mono text-xs text-rose-950 text-left space-y-1.5 shadow-brutal-sm">
              <p className="font-bold">&bull; Alasan Pemblokiran:</p>
              <p className="text-neutral-800">
                Tautan tujuan terindikasi phishing, penipuan, malware, atau melanggar Kebijakan Layanan &amp; Hukum yang berlaku.
              </p>
            </div>

            <div className="pt-2 border-t-2 border-black">
              <Button asChild variant="outline" className="w-full border-2 border-black font-bold shadow-brutal hover:bg-cream">
                <Link href="/">
                  <Home className="h-4 w-4 mr-1.5" strokeWidth={2.5} />
                  <span>Kembali ke Halaman Aman</span>
                </Link>
              </Button>
            </div>
          </Card>
        </main>

        <footer className="text-center text-xs font-bold text-neutral-600">
          Dilindungi oleh Modul Keamanan Pendek-In Anti-Abuse Shield.
        </footer>
      </div>
    );
  }

  // ==========================================
  // KASUS 3: TAUTAN KEDALUWARSA (EXPIRED)
  // ==========================================
  const isTimeExpired = link.expires_at && new Date(link.expires_at).getTime() < Date.now();
  if (link.status === "expired" || isTimeExpired) {
    return (
      <div className="min-h-screen bg-cream text-black flex flex-col justify-between p-4 sm:p-8">
        <header className="max-w-2xl mx-auto w-full flex items-center justify-between">
          <BrandLogo size="default" />
          <Link
            href="/"
            className="text-xs font-bold text-neutral-600 hover:text-black flex items-center gap-1"
          >
            <ArrowLeft className="h-3.5 w-3.5" strokeWidth={2.5} />
            <span>Ke Beranda</span>
          </Link>
        </header>

        <main className="my-auto py-8 max-w-lg mx-auto w-full">
          <Card className="border-[3px] border-black bg-white shadow-brutal-xl p-6 sm:p-8 space-y-6 text-center">
            <div className="w-16 h-16 mx-auto bg-amber-300 border-2 border-black rounded-xl shadow-brutal flex items-center justify-center">
              <Clock className="h-8 w-8 text-black" strokeWidth={2.5} />
            </div>

            <div className="space-y-2">
              <div className="inline-block bg-amber-400 text-black px-3 py-1 font-mono text-xs font-black uppercase border border-black">
                Masa Berlaku Habis
              </div>
              <h1 className="text-2xl sm:text-3xl font-black font-heading text-black">
                Tautan Telah Kedaluwarsa
              </h1>
              <p className="text-sm font-medium text-neutral-600">
                Masa aktif tautan pendek ini telah berakhir dan tidak lagi dapat mengalihkan pengunjung.
              </p>
            </div>

            {link.expires_at && (
              <div className="p-3 border-2 border-black bg-cream font-mono text-xs text-neutral-700">
                Batas waktu aktif:{" "}
                <strong className="text-black">
                  {new Date(link.expires_at).toLocaleString("id-ID", {
                    dateStyle: "full",
                    timeStyle: "short",
                  })}
                </strong>
              </div>
            )}

            <div className="pt-2 border-t-2 border-black">
              <Button asChild variant="default" className="w-full font-bold shadow-brutal">
                <Link href="/">
                  <Home className="h-4 w-4 mr-1.5" strokeWidth={2.5} />
                  <span>Kembali ke Beranda</span>
                </Link>
              </Button>
            </div>
          </Card>
        </main>

        <footer className="text-center text-xs font-bold text-neutral-600">
          &copy; {new Date().getFullYear()} Pendek-In URL Shortener.
        </footer>
      </div>
    );
  }

  // ==========================================
  // KASUS 4: TAUTAN DILINDUNGI KATA SANDI
  // ==========================================
  if (link.password_hash) {
    return <PasswordGate slug={slug} title={link.title} />;
  }

  // ==========================================
  // KASUS 5: TAUTAN AKTIF & VALID (REDIRECT CEPAT)
  // ==========================================
  // Pencatatan klik non-blocking (fire-and-forget)
  // Menggunakan unawaited promise agar respons redirect tidak tertunda sama sekali
  void trackLinkClick(link.id, {
    ip,
    userAgent,
    referrer,
    country,
    city,
  });

  // Eksekusi HTTP 307 Temporary Redirect ke original URL
  redirect(link.original_url);
}
