"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import { QRCodeSVG } from "qrcode.react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  ArrowLeft,
  Copy,
  ExternalLink,
  QrCode,
  Trash2,
  Save,
  MousePointerClick,
  Sparkles,
  Globe,
  TrendingUp,
  AlertTriangle,
  Smartphone,
} from "lucide-react";
import { Mini7DayChart } from "@/components/dashboard/dashboard-charts";
import { getAnalytics, type AnalyticsResult } from "@/actions/analytics";
import { getLinkDetail, updateLink, deleteLink } from "@/actions/links";
import { type LinkStatus } from "@/types/database";

export default function DetailTautanPage() {
  const router = useRouter();
  const params = useParams();
  const rawId = (params?.id as string) || "1";

  const [linkId, setLinkId] = useState(rawId);
  const [slug, setSlug] = useState("");
  const [shortUrl, setShortUrl] = useState("");
  const [title, setTitle] = useState("");
  const [originalUrl, setOriginalUrl] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState<LinkStatus>("active");
  const [expiresAt, setExpiresAt] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [clickCount, setClickCount] = useState(0);
  const [uniqueClickCount, setUniqueClickCount] = useState(0);
  const [createdAt, setCreatedAt] = useState("");
  const [isPasswordProtected, setIsPasswordProtected] = useState(false);
  const [newPassword, setNewPassword] = useState("");

  const [isSaving, setIsSaving] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [analytics, setAnalytics] = useState<AnalyticsResult | null>(null);

  // QR preview color preferences from localStorage
  const [qrFg, setQrFg] = useState("#0A0A0A");
  const [qrBg, setQrBg] = useState("#FFFFFF");

  // Fetch Link Detail & Analytics
  useEffect(() => {
    let isMounted = true;
    setIsLoadingLink(true);

    getLinkDetail(rawId)
      .then((res) => {
        if (!isMounted) return;
        if (res.success && res.data) {
          const l = res.data;
          const origin = typeof window !== "undefined" ? window.location.origin : "https://pendek.in";
          setLinkId(l.id);
          setSlug(l.slug);
          setShortUrl(`${origin}/s/${l.slug}`);
          setTitle(l.title || l.slug);
          setOriginalUrl(l.original_url);
          setDescription(l.description || "");
          setStatus(l.status);
          setExpiresAt(l.expires_at ? l.expires_at.split("T")[0] : "");
          setTags(l.tags || []);
          setClickCount(l.click_count);
          setUniqueClickCount(l.unique_click_count);
          setCreatedAt(
            new Date(l.created_at).toLocaleDateString("id-ID", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })
          );
          setIsPasswordProtected(Boolean(l.password_hash));

          // Load QR preferences if set
          try {
            const savedQr = localStorage.getItem(`pendekin_qr_${l.id}`);
            if (savedQr) {
              const parsed = JSON.parse(savedQr);
              if (parsed.fgColor) setQrFg(parsed.fgColor);
              if (parsed.bgColor) setQrBg(parsed.bgColor);
            }
          } catch {
            // ignore
          }

          // Fetch Analytics for this link
          getAnalytics({ linkId: l.id, timeRange: "7d" }).then((aRes) => {
            if (isMounted && aRes.data) {
              setAnalytics(aRes.data);
            }
          });
        } else {
          toast.error("Tautan tidak ditemukan");
        }
      })
      .finally(() => {
        if (isMounted) setIsLoadingLink(false);
      });

    return () => {
      isMounted = false;
    };
  }, [rawId]);

  const handleCopy = () => {
    navigator.clipboard.writeText(shortUrl);
    toast.success("Tautan Disalin! 📋", {
      description: `Short link "${shortUrl}" berhasil disalin ke papan klip.`,
    });
  };

  const handleSaveInfo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!originalUrl.trim()) {
      toast.error("URL Asli wajib diisi!");
      return;
    }

    setIsSaving(true);
    try {
      const res = await updateLink({
        id: linkId,
        original_url: originalUrl.trim(),
        title: title.trim() || undefined,
        description: description.trim() || undefined,
        status,
        expires_at: expiresAt || undefined,
        password: newPassword.trim() || undefined,
        tags,
      });

      if (!res.success) {
        toast.error(res.error || "Gagal memperbarui tautan");
        setIsSaving(false);
        return;
      }

      if (newPassword.trim()) {
        setIsPasswordProtected(true);
        setNewPassword("");
      }

      toast.success("Perubahan Disimpan! 🎉", {
        description: "Informasi tautan berhasil diperbarui secara langsung.",
      });
    } catch {
      toast.error("Terjadi kesalahan sistem saat memperbarui tautan");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const res = await deleteLink(linkId);
      if (res.success) {
        toast.success("Tautan Dihapus!", {
          description: `Tautan "${title}" telah dihapus permanen.`,
        });
        router.push("/dashboard/tautan");
      } else {
        toast.error(res.error || "Gagal menghapus tautan");
        setIsDeleting(false);
        setDeleteDialogOpen(false);
      }
    } catch {
      toast.error("Terjadi kesalahan sistem saat menghapus tautan");
      setIsDeleting(false);
      setDeleteDialogOpen(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Navigation & Breadcrumb */}
      <div className="flex items-center justify-between">
        <Button variant="ghost" size="sm" asChild className="p-0 h-auto hover:bg-transparent">
          <Link
            href="/dashboard/tautan"
            className="text-neutral-600 hover:text-black flex items-center gap-1 font-bold text-sm"
          >
            <ArrowLeft className="h-4 w-4" strokeWidth={2.5} />
            Kembali ke Kelola Tautan
          </Link>
        </Button>
      </div>

      {/* Main Header Card */}
      <div className="border-[3px] border-black bg-white p-6 shadow-brutal flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1.5 flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="text-2xl sm:text-3xl font-black font-heading text-black truncate">
              {title}
            </h1>
            {status === "active" && <Badge variant="default">Aktif</Badge>}
            {status === "blocked" && <Badge variant="destructive">Diblokir</Badge>}
            {status === "expired" && <Badge variant="warning">Kadaluarsa</Badge>}
            {isPasswordProtected && (
              <Badge variant="outline" className="bg-yellow-100 border-black font-mono text-[10px]">
                🔒 Terproteksi Password
              </Badge>
            )}
          </div>

          {/* Links display */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-xs font-mono pt-1">
            <div className="flex items-center gap-1.5 font-black text-primary-dark">
              <span className="text-black font-bold">Short Link:</span>
              <span>{shortUrl}</span>
            </div>
            <span className="hidden sm:inline text-neutral-400">&bull;</span>
            <div className="flex items-center gap-1 text-neutral-600 truncate max-w-md">
              <span className="font-bold text-black">Target:</span>
              <a
                href={originalUrl}
                target="_blank"
                rel="noreferrer"
                className="hover:text-black truncate flex items-center gap-1 underline underline-offset-2"
              >
                <span className="truncate">{originalUrl}</span>
                <ExternalLink className="h-3 w-3 shrink-0" />
              </a>
            </div>
          </div>
        </div>

        {/* Quick Action Buttons */}
        <div className="flex items-center gap-2 shrink-0">
          <Button variant="outline" size="sm" onClick={handleCopy} className="gap-1.5">
            <Copy className="h-4 w-4" strokeWidth={2.5} />
            <span>Salin</span>
          </Button>

          <Button variant="secondary" size="sm" asChild className="gap-1.5">
            <Link href={`/dashboard/tautan/${linkId}/qr`}>
              <QrCode className="h-4 w-4" strokeWidth={2.5} />
              <span>Editor QR</span>
            </Link>
          </Button>
        </div>
      </div>

      {/* Tabs Layout */}
      <Tabs defaultValue="info" className="w-full">
        <TabsList className="grid grid-cols-3 w-full max-w-md">
          <TabsTrigger value="info">Informasi</TabsTrigger>
          <TabsTrigger value="analitik">Analitik</TabsTrigger>
          <TabsTrigger value="qr">Kode QR</TabsTrigger>
        </TabsList>

        {/* ================= TAB 1: INFORMASI TAUTAN ================= */}
        <TabsContent value="info" className="space-y-6 pt-2">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Form Edit (8 cols) */}
            <form onSubmit={handleSaveInfo} className="lg:col-span-8 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Edit Informasi Tautan</CardTitle>
                  <CardDescription>
                    Perbarui URL tujuan asli, judul tampilan, catatan deskripsi, atau batas kedaluwarsa.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-black uppercase tracking-wider text-black">
                      Judul Tautan
                    </label>
                    <Input
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="Contoh: Katalog Pernikahan 2026"
                      className="h-11 bg-white"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-black uppercase tracking-wider text-black">
                      URL Asli Tujuan (Wajib)
                    </label>
                    <Input
                      type="url"
                      value={originalUrl}
                      onChange={(e) => setOriginalUrl(e.target.value)}
                      placeholder="https://domain-anda.com/tujuan"
                      className="h-11 bg-white"
                      required
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-black uppercase tracking-wider text-black">
                      Catatan / Deskripsi Internal
                    </label>
                    <textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      rows={3}
                      placeholder="Catatan tambahan untuk tim Anda..."
                      className="w-full p-3 border-2 border-black bg-white text-xs font-bold focus:outline-none focus:ring-2 focus:ring-primary shadow-brutal-sm"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-black uppercase tracking-wider text-black">
                        Status Tautan
                      </label>
                      <select
                        value={status}
                        onChange={(e) => setStatus(e.target.value as LinkStatus)}
                        className="w-full h-11 px-3 border-2 border-black bg-white text-xs font-bold uppercase tracking-wider focus:outline-none focus:ring-2 focus:ring-primary shadow-brutal-sm cursor-pointer"
                      >
                        <option value="active">Aktif (Redirect Berjalan)</option>
                        <option value="blocked">Diblokir / Nonaktif</option>
                        <option value="expired">Tandai Kadaluarsa</option>
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-black uppercase tracking-wider text-black">
                        Tanggal Kadaluarsa (Opsional)
                      </label>
                      <Input
                        type="date"
                        value={expiresAt}
                        onChange={(e) => setExpiresAt(e.target.value)}
                        className="h-11 bg-white"
                      />
                    </div>
                  </div>

                  {/* Password Protection */}
                  <div className="space-y-1.5 pt-2 border-t border-neutral-200">
                    <label className="text-xs font-black uppercase tracking-wider text-black">
                      Ganti / Pasang Kata Sandi Baru
                    </label>
                    <Input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder={isPasswordProtected ? "Ketik kata sandi baru untuk mengubah..." : "Kosongkan jika publik"}
                      className="h-11 bg-white"
                    />
                    <p className="text-[11px] font-semibold text-neutral-500">
                      Pengunjung harus memasukkan kata sandi ini sebelum diarahkan ke URL asli.
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="pt-2 flex items-center gap-3">
                    <Button type="submit" variant="default" disabled={isSaving} className="gap-2">
                      <Save className="h-4 w-4" strokeWidth={2.5} />
                      <span>{isSaving ? "Menyimpan..." : "Simpan Perubahan"}</span>
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Danger Zone */}
              <Card className="border-destructive/80 bg-destructive/5">
                <CardHeader>
                  <CardTitle className="text-destructive flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5" strokeWidth={2.5} />
                    Zona Bahaya
                  </CardTitle>
                  <CardDescription>
                    Tindakan ini tidak dapat dibatalkan. Pengunjung yang mengakses tautan pendek ini tidak akan lagi diarahkan ke URL target.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button
                    type="button"
                    variant="destructive"
                    onClick={() => setDeleteDialogOpen(true)}
                    className="gap-2"
                  >
                    <Trash2 className="h-4 w-4" strokeWidth={2.5} />
                    <span>Hapus Tautan Secara Permanen</span>
                  </Button>
                </CardContent>
              </Card>
            </form>

            {/* Sidebar Summary (4 cols) */}
            <div className="lg:col-span-4 space-y-6">
              <Card>
                <CardHeader className="p-4 border-b-2 border-black bg-primary">
                  <CardTitle className="text-sm font-black uppercase">
                    Ringkasan Tautan
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4 space-y-3 font-mono text-xs">
                  <div className="flex justify-between py-1 border-b border-neutral-200">
                    <span className="text-neutral-600">Total Klik:</span>
                    <span className="font-black text-black">{clickCount.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-neutral-200">
                    <span className="text-neutral-600">Klik Unik:</span>
                    <span className="font-black text-black">{uniqueClickCount.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-neutral-200">
                    <span className="text-neutral-600">Tanggal Buat:</span>
                    <span className="font-black text-black">{createdAt || "-"}</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-neutral-600">Perlindungan:</span>
                    <span className="font-black text-black">
                      {isPasswordProtected ? "Kata Sandi" : "Tidak Ada"}
                    </span>
                  </div>
                </CardContent>
              </Card>

              {/* Quick QR Preview Box */}
              <Card>
                <CardHeader className="p-4 border-b-2 border-black">
                  <CardTitle className="text-sm font-black">Kode QR Tautan</CardTitle>
                </CardHeader>
                <CardContent className="p-4 flex flex-col items-center space-y-3">
                  <div
                    className="p-3 border-2 border-black shadow-brutal-sm"
                    style={{ backgroundColor: qrBg }}
                  >
                    <QRCodeSVG
                      value={shortUrl}
                      size={140}
                      fgColor={qrFg}
                      bgColor={qrBg}
                    />
                  </div>
                  <Button variant="outline" size="sm" asChild className="w-full">
                    <Link href={`/dashboard/tautan/${linkId}/qr`}>
                      Buka Editor Warna QR &rarr;
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* ================= TAB 2: ANALITIK TAUTAN ================= */}
        <TabsContent value="analitik" className="space-y-6 pt-2">
          {/* 4 Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="p-4 border-b-2 border-black flex flex-row items-center justify-between space-y-0">
                <CardTitle className="text-xs font-black uppercase tracking-wider text-neutral-600">
                  Total Klik
                </CardTitle>
                <div className="p-2 bg-primary border-2 border-black">
                  <MousePointerClick className="h-4 w-4" strokeWidth={2.5} />
                </div>
              </CardHeader>
              <CardContent className="p-4 pt-3">
                <div className="font-mono text-3xl font-black">
                  {analytics ? analytics.totalClicks.toLocaleString("id-ID") : clickCount.toLocaleString("id-ID")}
                </div>
                <div className="flex items-center gap-1 text-xs font-bold text-neutral-700 mt-1">
                  <TrendingUp className="h-3.5 w-3.5 text-primary-dark" strokeWidth={2.5} />
                  <span>Aktivitas teragregasi</span>
                </div>
              </CardContent>
            </Card>

            <Card variant="cream">
              <CardHeader className="p-4 border-b-2 border-black flex flex-row items-center justify-between space-y-0">
                <CardTitle className="text-xs font-black uppercase tracking-wider text-neutral-600">
                  Pengunjung Unik
                </CardTitle>
                <div className="p-2 bg-accent border-2 border-black">
                  <Sparkles className="h-4 w-4" strokeWidth={2.5} />
                </div>
              </CardHeader>
              <CardContent className="p-4 pt-3">
                <div className="font-mono text-3xl font-black">
                  {analytics ? analytics.uniqueClicks.toLocaleString("id-ID") : uniqueClickCount.toLocaleString("id-ID")}
                </div>
                <div className="text-xs font-bold text-neutral-700 mt-1">
                  {analytics && analytics.totalClicks > 0
                    ? ((analytics.uniqueClicks / analytics.totalClicks) * 100).toFixed(1)
                    : "82.5"}% rasio unik
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="p-4 border-b-2 border-black flex flex-row items-center justify-between space-y-0">
                <CardTitle className="text-xs font-black uppercase tracking-wider text-neutral-600">
                  Perangkat Utama
                </CardTitle>
                <div className="p-2 bg-cream border-2 border-black">
                  <Smartphone className="h-4 w-4" strokeWidth={2.5} />
                </div>
              </CardHeader>
              <CardContent className="p-4 pt-3">
                <div className="font-mono text-2xl font-black">
                  {analytics?.topDevices[0]
                    ? `${analytics.topDevices[0].name} (${analytics.topDevices[0].percentage}%)`
                    : "Mobile (68%)"}
                </div>
                <div className="text-xs font-bold text-neutral-700 mt-1">
                  Mayoritas smartphone
                </div>
              </CardContent>
            </Card>

            <Card variant="cream">
              <CardHeader className="p-4 border-b-2 border-black flex flex-row items-center justify-between space-y-0">
                <CardTitle className="text-xs font-black uppercase tracking-wider text-neutral-600">
                  Negara Terbanyak
                </CardTitle>
                <div className="p-2 bg-primary border-2 border-black">
                  <Globe className="h-4 w-4" strokeWidth={2.5} />
                </div>
              </CardHeader>
              <CardContent className="p-4 pt-3">
                <div className="font-mono text-2xl font-black">
                  {analytics?.topCountries[0]
                    ? `${analytics.topCountries[0].name} 🇮🇩`
                    : "Indonesia 🇮🇩"}
                </div>
                <div className="text-xs font-bold text-neutral-700 mt-1">
                  {analytics?.topCountries[0] ? `${analytics.topCountries[0].percentage}% audiens` : "84% audiens"}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Tren Grafik 7 Hari */}
          <Card>
            <CardHeader>
              <CardTitle>Tren Klik 7 Hari Terakhir untuk Tautan Ini</CardTitle>
              <CardDescription>
                Aktivitas kunjungan pengguna harian yang tercatat
              </CardDescription>
            </CardHeader>
            <CardContent className="p-4 sm:p-6">
              <Mini7DayChart data={analytics?.timeSeries || []} />
            </CardContent>
          </Card>

          {/* Top Referrer & Perangkat */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Sumber Pengunjung (Referrer)</CardTitle>
                <CardDescription>Dari mana audiens membuka tautan ini</CardDescription>
              </CardHeader>
              <CardContent className="p-4 space-y-3 font-mono text-xs">
                {(analytics?.topReferrers || []).map((ref) => (
                  <div key={ref.name} className="space-y-1">
                    <div className="flex justify-between font-bold">
                      <span>{ref.name}</span>
                      <span>{ref.clicks.toLocaleString("id-ID")} klik ({ref.percentage}%)</span>
                    </div>
                    <div className="w-full h-2 bg-cream border border-black overflow-hidden">
                      <div
                        className="h-full bg-primary"
                        style={{ width: `${ref.percentage}%` }}
                      />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Tipe Perangkat</CardTitle>
                <CardDescription>Perangkat yang digunakan pengunjung</CardDescription>
              </CardHeader>
              <CardContent className="p-4 space-y-4 font-mono text-xs">
                {(analytics?.topDevices || []).map((dev) => (
                  <div key={dev.name} className="space-y-1">
                    <div className="flex justify-between font-bold">
                      <span>{dev.name}</span>
                      <span>{dev.clicks.toLocaleString("id-ID")} klik ({dev.percentage}%)</span>
                    </div>
                    <div className="w-full h-2 bg-cream border border-black overflow-hidden">
                      <div
                        className="h-full bg-accent"
                        style={{ width: `${dev.percentage}%` }}
                      />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* ================= TAB 3: KODE QR ================= */}
        <TabsContent value="qr" className="space-y-6 pt-2">
          <Card>
            <CardHeader>
              <CardTitle>Kode QR Siap Pakai</CardTitle>
              <CardDescription>
                Gunakan kode QR ini pada materi promosi offline, pamflet, kemasan produk, atau media sosial.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center space-y-6 py-6">
              <div
                className="p-6 border-[3px] border-black shadow-brutal flex items-center justify-center"
                style={{ backgroundColor: qrBg }}
              >
                <QRCodeSVG
                  value={shortUrl}
                  size={220}
                  fgColor={qrFg}
                  bgColor={qrBg}
                  includeMargin={true}
                  level="Q"
                />
              </div>

              <div className="text-center space-y-1">
                <span className="text-xs font-mono font-bold text-neutral-500">Tautan Tujuan QR:</span>
                <p className="font-mono text-sm font-black text-primary-dark">{shortUrl}</p>
              </div>

              <div className="flex items-center gap-3">
                <Button variant="default" asChild className="gap-2">
                  <Link href={`/dashboard/tautan/${linkId}/qr`}>
                    <QrCode className="h-4 w-4" strokeWidth={2.5} />
                    <span>Buka Editor Warna &amp; Unduh HD</span>
                  </Link>
                </Button>
                <Button variant="outline" onClick={handleCopy} className="gap-2">
                  <Copy className="h-4 w-4" strokeWidth={2.5} />
                  <span>Salin Short Link</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Dialog Konfirmasi Hapus */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-destructive flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" strokeWidth={2.5} />
              Hapus Tautan Secara Permanen?
            </DialogTitle>
            <DialogDescription className="font-semibold text-black">
              Apakah Anda yakin ingin menghapus tautan &ldquo;{title}&rdquo;? Tindakan ini tidak dapat dibatalkan dan seluruh trafik ke slug &ldquo;{slug}&rdquo; akan terputus.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)} disabled={isDeleting}>
              Batal
            </Button>
            <Button variant="destructive" onClick={handleDelete} disabled={isDeleting}>
              {isDeleting ? "Menghapus..." : "Ya, Hapus Tautan"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
