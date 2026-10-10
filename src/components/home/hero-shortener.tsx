"use client";

import * as React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { QRDialog } from "@/components/home/qr-dialog";
import {
  Link2,
  ArrowRight,
  Zap,
  Sparkles,
  Copy,
  Check,
  QrCode,
  ExternalLink,
  SlidersHorizontal,
  Clock,
  ShieldCheck,
  AlertCircle,
} from "lucide-react";
import { toast } from "sonner";

export interface QuickLinkItem {
  id: string;
  originalUrl: string;
  shortUrl: string;
  slug: string;
  clicks: number;
  createdAt: string;
  title?: string;
  isCustom?: boolean;
}

const DEFAULT_LINKS: QuickLinkItem[] = [
  {
    id: "seed-1",
    originalUrl: "https://tokobunga.id/katalog/buket-pernikahan-premium-2026",
    shortUrl: "pendek.in/buket-nikah",
    slug: "buket-nikah",
    clicks: 48,
    createdAt: "Baru saja",
    title: "Katalog Buket Pernikahan Premium 2026",
    isCustom: true,
  },
  {
    id: "seed-2",
    originalUrl: "https://dimaspratama.design/case-study/redesign-aplikasi-fintech-lokal",
    shortUrl: "pendek.in/portfolio-dimas",
    slug: "portfolio-dimas",
    clicks: 124,
    createdAt: "Kemarin",
    title: "Case Study Redesign Fintech Lokal",
    isCustom: true,
  },
  {
    id: "seed-3",
    originalUrl: "https://bit.ly/registrasi-webinar-scaleup-umkm-indonesia-maju-2026",
    shortUrl: "pendek.in/k8LmP2",
    slug: "k8LmP2",
    clicks: 89,
    createdAt: "3 hari lalu",
    title: "Form Registrasi Webinar UMKM Maju 2026",
    isCustom: false,
  },
];

const LOCAL_STORAGE_KEY = "pendek_in_quick_history";

export function HeroShortener() {
  const [inputUrl, setInputUrl] = React.useState("");
  const [customSlug, setCustomSlug] = React.useState("");
  const [showCustomOption, setShowCustomOption] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [errorMsg, setErrorMsg] = React.useState<string | null>(null);

  const [history, setHistory] = React.useState<QuickLinkItem[]>(DEFAULT_LINKS);
  const [latestLink, setLatestLink] = React.useState<QuickLinkItem | null>(null);

  // QR Modal State
  const [selectedQRLink, setSelectedQRLink] = React.useState<QuickLinkItem | null>(null);
  const [copiedId, setCopiedId] = React.useState<string | null>(null);

  // Load from localStorage on mount
  React.useEffect(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setHistory(parsed);
        }
      }
    } catch {
      // Ignore localStorage error
    }
  }, []);

  const saveHistory = (items: QuickLinkItem[]) => {
    setHistory(items);
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(items));
    } catch {
      // Ignore
    }
  };

  const handleCopyLink = async (url: string, id: string) => {
    try {
      const full = url.startsWith("http") ? url : `https://${url}`;
      await navigator.clipboard.writeText(full);
      setCopiedId(id);
      toast.success("Tautan disalin ke papan klip!");
      setTimeout(() => setCopiedId(null), 2000);
    } catch {
      toast.error("Gagal menyalin tautan");
    }
  };

  const handleShorten = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    let cleanUrl = inputUrl.trim();
    if (!cleanUrl) {
      setErrorMsg("Harap masukkan URL yang ingin Anda pendekkan");
      return;
    }

    if (!/^https?:\/\//i.test(cleanUrl)) {
      cleanUrl = `https://${cleanUrl}`;
    }

    try {
      new URL(cleanUrl);
    } catch {
      setErrorMsg("Format URL tidak valid. Contoh: https://tokoonline.id/promo");
      return;
    }

    // Reserved words check dummy
    const cleanSlug = customSlug.trim().toLowerCase();
    if (cleanSlug) {
      if (!/^[a-z0-9-]+$/.test(cleanSlug)) {
        setErrorMsg("Kustom slug hanya boleh berupa huruf, angka, dan tanda hubung (-)");
        return;
      }
      if (["api", "admin", "dashboard", "masuk", "daftar", "s"].includes(cleanSlug)) {
        setErrorMsg("Slug ini termasuk kata terlarang (reserved word). Coba kata lain.");
        return;
      }
    }

    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      const generatedSlug = cleanSlug || Math.random().toString(36).substring(2, 8);
      const newShortUrl = `pendek.in/${generatedSlug}`;

      const newItem: QuickLinkItem = {
        id: `link-${Date.now()}`,
        originalUrl: cleanUrl,
        shortUrl: newShortUrl,
        slug: generatedSlug,
        clicks: 0,
        createdAt: "Baru saja",
        title: cleanSlug ? `Tautan ${cleanSlug}` : `Tautan Pendek ${cleanUrl.replace(/^https?:\/\/(www\.)?/, "").slice(0, 25)}...`,
        isCustom: !!cleanSlug,
      };

      setLatestLink(newItem);
      const updated = [newItem, ...history.filter((h) => h.id !== newItem.id)].slice(0, 10);
      saveHistory(updated);

      toast.success("Tautan pendek berhasil dibuat!");
      setInputUrl("");
      setCustomSlug("");
      setShowCustomOption(false);
    }, 450);
  };

  const handleDeleteHistoryItem = (id: string) => {
    const updated = history.filter((item) => item.id !== id);
    saveHistory(updated);
    if (latestLink?.id === id) {
      setLatestLink(null);
    }
    toast.success("Item riwayat dihapus");
  };

  const handleClearHistory = () => {
    saveHistory([]);
    setLatestLink(null);
    toast.success("Riwayat lokal telah dibersihkan");
  };

  return (
    <section className="relative overflow-hidden pt-12 pb-16 md:pt-16 md:pb-24 bg-white border-b-2 border-black">
      {/* Background Grid Pattern Accent */}
      <div className="absolute inset-0 bg-[radial-gradient(#0A0A0A_1px,transparent_1px)] [background-size:24px_24px] opacity-[0.04] pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-10">
        {/* Top Badges & Heading */}
        <div className="text-center max-w-3xl mx-auto space-y-5">
          <div className="inline-flex flex-wrap items-center justify-center gap-2">
            <Badge variant="default" className="text-xs sm:text-sm py-1 px-3">
              <Zap className="mr-1.5 h-3.5 w-3.5 fill-black" strokeWidth={2.5} />
              Pemendek Tautan #1 Neobrutalisme Indonesia
            </Badge>
            <Badge variant="secondary" className="text-xs sm:text-sm py-1 px-3">
              100% Gratis &amp; Bebas Iklan
            </Badge>
          </div>

          <h1 className="text-4xl sm:text-6xl md:text-7xl font-heading font-black tracking-tight leading-[1.08] text-black">
            URL Panjang Jadi Ringkas,{" "}
            <span className="relative inline-block mt-1 sm:mt-0">
              <span className="bg-primary px-3 py-1 border-2 border-black shadow-brutal transform -rotate-1 inline-block">
                Pantau Klik
              </span>
            </span>{" "}
            Tanpa Ribet!
          </h1>

          <p className="text-base sm:text-lg md:text-xl font-medium text-neutral-700 max-w-2xl mx-auto leading-relaxed">
            Pangkas tautan berantakan menjadi link pendek berkelas. Lengkap dengan kustomisasi slug,
            kode QR dinamis beresolusi tinggi, dan analitik performa pengunjung secara real-time.
          </p>
        </div>

        {/* Big Shortener Input Form Container */}
        <div className="max-w-4xl mx-auto">
          <Card className="border-[3px] border-black bg-cream shadow-brutal-xl p-4 sm:p-7 transition-all">
            <CardContent className="p-0 space-y-4">
              <form onSubmit={handleShorten} className="space-y-4">
                {/* Main Large Input Group */}
                <div className="flex flex-col md:flex-row gap-3">
                  <div className="relative flex-1">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-black pointer-events-none">
                      <Link2 className="h-5 w-5" strokeWidth={2.5} />
                    </div>
                    <Input
                      type="text"
                      value={inputUrl}
                      onChange={(e) => {
                        setInputUrl(e.target.value);
                        if (errorMsg) setErrorMsg(null);
                      }}
                      placeholder="Tempel tautan panjang di sini (mis: https://tokoonline.id/promo-spesial-2026)"
                      className="h-14 sm:h-16 pl-12 pr-4 text-sm sm:text-base font-medium border-2 border-black bg-white shadow-brutal-sm placeholder:text-neutral-500 focus-visible:ring-primary focus-visible:ring-2"
                      disabled={isLoading}
                    />
                  </div>

                  <Button
                    type="submit"
                    variant="default"
                    size="lg"
                    disabled={isLoading}
                    className="h-14 sm:h-16 px-6 sm:px-8 text-base font-heading font-black tracking-wider flex items-center justify-center gap-2 border-2 border-black shadow-brutal shrink-0 hover:bg-primary-dark"
                  >
                    {isLoading ? (
                      <span className="flex items-center gap-2">
                        <span className="w-5 h-5 border-2 border-black border-t-transparent animate-spin rounded-full inline-block" />
                        <span>Memendekkan...</span>
                      </span>
                    ) : (
                      <>
                        <span>Pendekkan Sekarang!</span>
                        <ArrowRight className="h-5 w-5" strokeWidth={2.5} />
                      </>
                    )}
                  </Button>
                </div>

                {/* Optional Custom Slug Toggle & Section */}
                <div className="pt-1 flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-t-2 border-black/10 pt-3">
                  <button
                    type="button"
                    onClick={() => setShowCustomOption(!showCustomOption)}
                    className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-black hover:text-primary-dark transition-colors self-start"
                  >
                    <SlidersHorizontal className="h-4 w-4" strokeWidth={2.5} />
                    <span>{showCustomOption ? "Sembunyikan Opsi Kustom" : "Kustomisasi Back-Half (Slug)?"}</span>
                    <Badge variant="outline" className="text-[10px] ml-1 bg-white font-mono py-0">
                      Opsional
                    </Badge>
                  </button>

                  <div className="flex items-center gap-2 text-xs font-semibold text-neutral-600">
                    <Clock className="h-3.5 w-3.5" strokeWidth={2.5} />
                    <span>Masa aktif guest: 7 hari. Ingin permanen? <Link href="/daftar" className="underline font-bold text-black hover:bg-accent px-1">Daftar Akun</Link></span>
                  </div>
                </div>

                {/* Custom Slug Input Drawer */}
                {showCustomOption && (
                  <div className="bg-white border-2 border-black p-4 space-y-2 shadow-brutal-sm animate-in fade-in-50 duration-150">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                      <span className="font-mono text-sm font-bold bg-cream px-3 py-2.5 border-2 border-black shrink-0">
                        pendek.in/
                      </span>
                      <Input
                        type="text"
                        value={customSlug}
                        onChange={(e) => setCustomSlug(e.target.value)}
                        placeholder="slug-kustom-pilihanmu (contoh: promo-ramadhan)"
                        className="h-11 font-mono text-sm border-2 border-black"
                      />
                    </div>
                    <p className="text-xs font-medium text-neutral-600">
                      Gunakan huruf kecil, angka, dan tanda hubung (-). Contoh: <span className="font-mono font-bold text-black">diskon-lebaran</span>.
                    </p>
                  </div>
                )}

                {/* Error Banner */}
                {errorMsg && (
                  <div className="p-3 bg-destructive/15 border-2 border-destructive flex items-center gap-2 text-destructive font-bold text-xs sm:text-sm shadow-brutal-sm">
                    <AlertCircle className="h-4 w-4 shrink-0" strokeWidth={2.5} />
                    <span>{errorMsg}</span>
                  </div>
                )}
              </form>

              {/* LATEST RESULT CARD */}
              {latestLink && (
                <div className="pt-4 border-t-2 border-black">
                  <div className="bg-white border-2 border-black p-4 sm:p-6 shadow-brutal space-y-4">
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b-2 border-black pb-3">
                      <div className="flex items-center gap-2">
                        <span className="w-3 h-3 bg-primary border border-black inline-block animate-pulse" />
                        <span className="font-heading font-black text-sm uppercase tracking-wider text-black">
                          Tautan Berhasil Dipendekkan!
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="default" className="text-xs">
                          Aktif
                        </Badge>
                        {latestLink.isCustom && (
                          <Badge variant="secondary" className="text-xs">
                            <Sparkles className="h-3 w-3 mr-1" /> Kustom Slug
                          </Badge>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                      <div className="md:col-span-8 space-y-1">
                        <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">
                          Tautan Pendek Siap Sebar
                        </p>
                        <div className="flex items-center gap-2">
                          <span className="font-heading font-black text-xl sm:text-2xl text-black bg-accent/40 px-2.5 py-1 border-2 border-black select-all">
                            https://{latestLink.shortUrl}
                          </span>
                        </div>
                        <p className="text-xs font-medium text-neutral-600 truncate pt-1">
                          Tujuan: <span className="font-mono text-neutral-900">{latestLink.originalUrl}</span>
                        </p>
                      </div>

                      <div className="md:col-span-4 flex flex-wrap md:flex-nowrap gap-2 justify-start md:justify-end">
                        <Button
                          type="button"
                          variant="default"
                          size="sm"
                          onClick={() => handleCopyLink(latestLink.shortUrl, latestLink.id)}
                          className="flex-1 md:flex-none flex items-center justify-center gap-1.5"
                        >
                          {copiedId === latestLink.id ? (
                            <>
                              <Check className="h-4 w-4" strokeWidth={2.5} />
                              <span>Tersalin!</span>
                            </>
                          ) : (
                            <>
                              <Copy className="h-4 w-4" strokeWidth={2.5} />
                              <span>Salin</span>
                            </>
                          )}
                        </Button>

                        <Button
                          type="button"
                          variant="secondary"
                          size="sm"
                          onClick={() => setSelectedQRLink(latestLink)}
                          className="flex-1 md:flex-none flex items-center justify-center gap-1.5"
                        >
                          <QrCode className="h-4 w-4" strokeWidth={2.5} />
                          <span>Kode QR</span>
                        </Button>

                        <Button
                          type="button"
                          variant="outline"
                          size="iconSm"
                          asChild
                          title="Buka URL asli"
                        >
                          <a href={latestLink.originalUrl} target="_blank" rel="noreferrer">
                            <ExternalLink className="h-4 w-4" strokeWidth={2.5} />
                          </a>
                        </Button>
                      </div>
                    </div>

                    {/* Member Upgrade Upsell Note */}
                    <div className="p-3 bg-cream border border-black flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs font-semibold">
                      <span className="text-neutral-800">
                        ⚡ Ingin tautan ini tidak kedaluwarsa setelah 7 hari dan mendapatkan grafik analitik klik?
                      </span>
                      <Link
                        href="/daftar"
                        className="inline-flex items-center gap-1 text-black font-heading font-black hover:underline uppercase tracking-wide shrink-0"
                      >
                        <span>Daftar Gratis</span>
                        <ArrowRight className="h-3.5 w-3.5" strokeWidth={2.5} />
                      </Link>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* QUICK HISTORY SECTION (Local State) */}
        <div className="max-w-4xl mx-auto pt-4 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2 px-1">
            <div className="flex items-center gap-2">
              <h2 className="font-heading font-black text-lg sm:text-xl text-black">
                Riwayat Cepat Sesi Ini
              </h2>
              <Badge variant="outline" className="text-xs bg-white">
                {history.length} Tautan
              </Badge>
            </div>

            {history.length > 0 && (
              <button
                type="button"
                onClick={handleClearHistory}
                className="text-xs font-bold text-neutral-600 hover:text-destructive underline decoration-1"
              >
                Bersihkan Riwayat
              </button>
            )}
          </div>

          {history.length === 0 ? (
            <div className="p-8 text-center bg-cream border-2 border-black border-dashed space-y-2">
              <p className="font-heading font-bold text-base text-neutral-800">
                Belum ada tautan yang dipendekkan di sesi ini.
              </p>
              <p className="text-xs text-neutral-600">
                Tempel URL panjang Anda di kolom input di atas untuk mencobanya sekarang!
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {history.map((item) => (
                <div
                  key={item.id}
                  className="bg-white border-2 border-black p-4 shadow-brutal flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:translate-x-0.5 transition-transform"
                >
                  <div className="space-y-1 min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono font-bold text-base text-black bg-cream px-2 py-0.5 border border-black">
                        https://{item.shortUrl}
                      </span>
                      <Badge variant="outline" className="text-[11px] font-mono py-0 bg-white">
                        {item.clicks} klik
                      </Badge>
                      <span className="text-[11px] font-medium text-neutral-500">
                        {item.createdAt}
                      </span>
                    </div>
                    <p className="text-xs font-medium text-neutral-600 truncate max-w-xl">
                      {item.originalUrl}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => handleCopyLink(item.shortUrl, item.id)}
                      className="h-8 px-2.5 text-xs flex items-center gap-1"
                    >
                      {copiedId === item.id ? (
                        <>
                          <Check className="h-3.5 w-3.5" strokeWidth={2.5} />
                          <span>Disalin</span>
                        </>
                      ) : (
                        <>
                          <Copy className="h-3.5 w-3.5" strokeWidth={2.5} />
                          <span>Salin</span>
                        </>
                      )}
                    </Button>

                    <Button
                      type="button"
                      variant="cream"
                      size="sm"
                      onClick={() => setSelectedQRLink(item)}
                      className="h-8 px-2.5 text-xs flex items-center gap-1"
                      title="Lihat QR Code"
                    >
                      <QrCode className="h-3.5 w-3.5" strokeWidth={2.5} />
                      <span className="hidden sm:inline">QR</span>
                    </Button>

                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteHistoryItem(item.id)}
                      className="h-8 px-2 text-xs text-neutral-500 hover:text-destructive hover:border-destructive"
                      title="Hapus dari riwayat lokal"
                    >
                      ✕
                    </Button>
                  </div>
                </div>
              ))}

              <div className="p-3 bg-white border-2 border-black flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-semibold shadow-brutal-sm">
                <span className="text-neutral-700 flex items-center gap-1.5">
                  <ShieldCheck className="h-4 w-4 text-primary-dark" strokeWidth={2.5} />
                  <span>Riwayat ini hanya tersimpan di browser Anda saat ini.</span>
                </span>
                <Link
                  href="/daftar"
                  className="bg-primary hover:bg-primary-dark text-black px-3 py-1.5 border border-black shadow-brutal-sm font-heading font-bold uppercase tracking-wider inline-flex items-center gap-1 shrink-0"
                >
                  <span>Simpan Semua di Akun Gratis</span>
                  <ArrowRight className="h-3.5 w-3.5" strokeWidth={2.5} />
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* QR Code Dialog Modal */}
      {selectedQRLink && (
        <QRDialog
          isOpen={!!selectedQRLink}
          onClose={() => setSelectedQRLink(null)}
          shortUrl={selectedQRLink.shortUrl}
          originalUrl={selectedQRLink.originalUrl}
          title={`QR Code: ${selectedQRLink.shortUrl}`}
        />
      )}
    </section>
  );
}
