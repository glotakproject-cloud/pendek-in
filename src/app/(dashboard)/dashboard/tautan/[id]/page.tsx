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
  Laptop,
  Settings,
} from "lucide-react";
import { DUMMY_LINKS, DUMMY_ANALYTICS_7_DAYS, DUMMY_REFERRERS, type DummyLink } from "@/lib/dummy-data";
import { Mini7DayChart } from "@/components/dashboard/dashboard-charts";
import { getAnalytics, type AnalyticsResult } from "@/actions/analytics";

export default function DetailTautanPage() {
  const router = useRouter();
  const params = useParams();
  const rawId = (params?.id as string) || "1";

  // Match by id or slug or default to first link
  const initialLink =
    DUMMY_LINKS.find((l) => l.id === rawId || l.slug === rawId) || DUMMY_LINKS[0];

  const [linkData, setLinkData] = useState<DummyLink>(initialLink);
  const [title, setTitle] = useState(initialLink.title);
  const [originalUrl, setOriginalUrl] = useState(initialLink.originalUrl);
  const [status, setStatus] = useState(initialLink.status);
  const [expiresAt, setExpiresAt] = useState(initialLink.expiresAt || "");
  const [tags] = useState(initialLink.tags);
  const [isSaving, setIsSaving] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [analytics, setAnalytics] = useState<AnalyticsResult | null>(null);

  useEffect(() => {
    let isMounted = true;
    getAnalytics({ linkId: linkData.id, timeRange: "7d" }).then((res) => {
      if (isMounted && res.data) {
        setAnalytics(res.data);
      }
    });

    return () => {
      isMounted = false;
    };
  }, [linkData.id]);

  const handleCopy = () => {
    navigator.clipboard.writeText(linkData.shortUrl);
    toast.success("Tautan Disalin! 📋", {
      description: `Short link "${linkData.shortUrl}" berhasil disalin ke papan klip.`,
    });
  };

  const handleSaveInfo = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      setLinkData({
        ...linkData,
        title,
        originalUrl,
        status,
        expiresAt: expiresAt || null,
        tags,
      });
      toast.success("Perubahan Disimpan! 🎉", {
        description: "Informasi tautan berhasil diperbarui.",
      });
    }, 400);
  };

  const handleDelete = () => {
    toast.success("Tautan Dihapus!", {
      description: `Tautan "${linkData.title}" telah dihapus.`,
    });
    router.push("/dashboard/tautan");
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

      {/* Hero Header Card */}
      <div className="border-2 border-black bg-white p-6 shadow-brutal flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <Badge
              variant={
                linkData.status === "active"
                  ? "default"
                  : linkData.status === "expired"
                  ? "warning"
                  : "destructive"
              }
            >
              {linkData.status === "active"
                ? "Aktif"
                : linkData.status === "expired"
                ? "Kadaluarsa"
                : "Nonaktif"}
            </Badge>
            <span className="text-xs font-mono font-bold text-neutral-500">
              Dibuat pada {linkData.createdAt}
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black font-heading text-black">
            {linkData.title}
          </h1>

          <div className="flex flex-wrap items-center gap-2 text-xs font-mono font-bold">
            <span className="text-primary-dark font-black">{linkData.shortUrl}</span>
            <span className="text-neutral-400">&bull;</span>
            <span className="text-neutral-500 truncate max-w-[280px]">
              {linkData.originalUrl}
            </span>
          </div>
        </div>

        {/* Quick Action Buttons */}
        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <Button variant="outline" size="sm" onClick={handleCopy} className="gap-1.5">
            <Copy className="h-4 w-4" strokeWidth={2.5} />
            <span>Salin Link</span>
          </Button>

          <Button variant="cream" size="sm" asChild className="gap-1.5">
            <a href={linkData.originalUrl} target="_blank" rel="noreferrer">
              <ExternalLink className="h-4 w-4" strokeWidth={2.5} />
              <span>Buka Asli</span>
            </a>
          </Button>

          <Button variant="secondary" size="sm" asChild className="gap-1.5">
            <Link href={`/dashboard/tautan/${linkData.id}/qr`}>
              <QrCode className="h-4 w-4" strokeWidth={2.5} />
              <span>Editor QR</span>
            </Link>
          </Button>
        </div>
      </div>

      {/* Tabs Layout: Info / Analitik / QR */}
      <Tabs defaultValue="info" className="w-full">
        <TabsList className="w-full sm:w-auto grid grid-cols-3 sm:inline-flex">
          <TabsTrigger value="info">Info Tautan</TabsTrigger>
          <TabsTrigger value="analitik">Analitik Klik</TabsTrigger>
          <TabsTrigger value="qr">Kode QR</TabsTrigger>
        </TabsList>

        {/* ================= TAB 1: INFO & EDIT TAUTAN ================= */}
        <TabsContent value="info" className="space-y-6 pt-2">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Form Info (8 cols) */}
            <form onSubmit={handleSaveInfo} className="lg:col-span-8 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Edit Informasi Tautan</CardTitle>
                  <CardDescription>
                    Perbarui judul tampilan, URL tujuan, atau status aktif tautan ini.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-5">
                  {/* Judul */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-black uppercase tracking-wider text-black">
                      Judul Tautan
                    </label>
                    <Input
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="h-11 bg-white"
                      required
                    />
                  </div>

                  {/* URL Target */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-black uppercase tracking-wider text-black">
                      URL Target Asli
                    </label>
                    <Input
                      type="url"
                      value={originalUrl}
                      onChange={(e) => setOriginalUrl(e.target.value)}
                      className="h-11 bg-white"
                      required
                    />
                  </div>

                  {/* Back-half (read only) */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-black uppercase tracking-wider text-black flex items-center justify-between">
                      <span>Slug Back-Half</span>
                      <span className="text-[11px] font-mono text-neutral-500 font-normal">
                        Permanen
                      </span>
                    </label>
                    <div className="flex items-center border-2 border-black bg-cream p-2.5 font-mono text-sm font-bold shadow-brutal-sm">
                      <span className="text-neutral-500">pendek.in/s/</span>
                      <span className="text-black font-black">{linkData.slug}</span>
                    </div>
                  </div>

                  {/* Status & Tanggal Kadaluarsa */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-black uppercase tracking-wider text-black">
                        Status Tautan
                      </label>
                      <select
                        value={status}
                        onChange={(e) => setStatus(e.target.value as "active" | "inactive" | "expired")}
                        className="w-full h-11 px-3 border-2 border-black bg-white text-xs font-bold uppercase tracking-wider focus:outline-none focus:ring-2 focus:ring-primary shadow-brutal-sm cursor-pointer"
                      >
                        <option value="active">Aktif (Redirect Berjalan)</option>
                        <option value="inactive">Nonaktifkan Sementara</option>
                        <option value="expired">Tandai Kadaluarsa</option>
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-black uppercase tracking-wider text-black">
                        Tanggal Kadaluarsa
                      </label>
                      <Input
                        type="date"
                        value={expiresAt}
                        onChange={(e) => setExpiresAt(e.target.value)}
                        className="h-11 bg-white"
                      />
                    </div>
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
                    <span className="font-black text-black">{linkData.clicks.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-neutral-200">
                    <span className="text-neutral-600">Klik Unik:</span>
                    <span className="font-black text-black">{linkData.uniqueClicks.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-neutral-200">
                    <span className="text-neutral-600">Tanggal Buat:</span>
                    <span className="font-black text-black">{linkData.createdAt}</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-neutral-600">Perlindungan:</span>
                    <span className="font-black text-black">
                      {linkData.password ? "Kata Sandi" : "Tidak Ada"}
                    </span>
                  </div>
                </CardContent>
              </Card>

              {/* Quick QR Preview Box */}
              <Card>
                <CardHeader className="p-4 border-b-2 border-black">
                  <CardTitle className="text-sm font-black">Kode QR Cepat</CardTitle>
                </CardHeader>
                <CardContent className="p-4 flex flex-col items-center space-y-3">
                  <div className="p-3 border-2 border-black bg-white shadow-brutal-sm">
                    <QRCodeSVG
                      value={linkData.shortUrl}
                      size={140}
                      fgColor={linkData.qrColor || "#0A0A0A"}
                      bgColor={linkData.qrBg || "#FFFFFF"}
                    />
                  </div>
                  <Button variant="outline" size="sm" asChild className="w-full">
                    <Link href={`/dashboard/tautan/${linkData.id}/qr`}>
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
                  {analytics ? analytics.totalClicks.toLocaleString("id-ID") : linkData.clicks.toLocaleString("id-ID")}
                </div>
                <div className="flex items-center gap-1 text-xs font-bold text-neutral-700 mt-1">
                  <TrendingUp className="h-3.5 w-3.5 text-primary-dark" strokeWidth={2.5} />
                  <span>+24.5% minggu ini</span>
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
                  {analytics ? analytics.uniqueClicks.toLocaleString("id-ID") : linkData.uniqueClicks.toLocaleString("id-ID")}
                </div>
                <div className="text-xs font-bold text-neutral-700 mt-1">
                  {analytics && analytics.totalClicks > 0
                    ? ((analytics.uniqueClicks / analytics.totalClicks) * 100).toFixed(1)
                    : ((linkData.uniqueClicks / (linkData.clicks || 1)) * 100).toFixed(1)}% rasio unik
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
                  Dominan dari smartphone
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
                  {analytics?.topCountries[0] ? `${analytics.topCountries[0].percentage}% dari pengunjung` : "88.4% dari pengunjung"}
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
              <Mini7DayChart data={analytics?.timeSeries || DUMMY_ANALYTICS_7_DAYS} />
            </CardContent>
          </Card>

          {/* Top Referrer List */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Sumber Pengunjung (Referrer)</CardTitle>
                <CardDescription>Dari mana audiens membuka tautan ini</CardDescription>
              </CardHeader>
              <CardContent className="p-4 space-y-3 font-mono text-xs">
                {(analytics?.topReferrers || DUMMY_REFERRERS.slice(0, 5)).map((ref) => (
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
              <CardContent className="p-4 space-y-4">
                <div className="flex items-center justify-between p-3 border-2 border-black bg-cream shadow-brutal-sm">
                  <div className="flex items-center gap-3">
                    <Smartphone className="h-5 w-5" strokeWidth={2.5} />
                    <span className="font-heading font-black">Smartphone / Mobile</span>
                  </div>
                  <span className="font-mono font-black text-sm">68.2%</span>
                </div>
                <div className="flex items-center justify-between p-3 border-2 border-black bg-white shadow-brutal-sm">
                  <div className="flex items-center gap-3">
                    <Laptop className="h-5 w-5" strokeWidth={2.5} />
                    <span className="font-heading font-black">Desktop / Laptop</span>
                  </div>
                  <span className="font-mono font-black text-sm">27.5%</span>
                </div>
                <div className="flex items-center justify-between p-3 border-2 border-black bg-accent/30 shadow-brutal-sm">
                  <div className="flex items-center gap-3">
                    <Globe className="h-5 w-5" strokeWidth={2.5} />
                    <span className="font-heading font-black">Tablet</span>
                  </div>
                  <span className="font-mono font-black text-sm">4.3%</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* ================= TAB 3: QR CODE PREVIEW ================= */}
        <TabsContent value="qr" className="space-y-6 pt-2">
          <Card>
            <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <CardTitle>Kode QR Dinamis Tautan</CardTitle>
                <CardDescription>
                  Kode QR ini otomatis mengarahkan scanner ke {linkData.shortUrl}
                </CardDescription>
              </div>
              <Button variant="default" asChild className="gap-2">
                <Link href={`/dashboard/tautan/${linkData.id}/qr`}>
                  <Settings className="h-4 w-4" strokeWidth={2.5} />
                  <span>Kustomisasi Warna &amp; Unduh Lengkap</span>
                </Link>
              </Button>
            </CardHeader>
            <CardContent className="p-8 flex flex-col md:flex-row items-center justify-center gap-8">
              <div className="p-6 border-[3px] border-black bg-white shadow-brutal-lg flex flex-col items-center space-y-3">
                <QRCodeSVG
                  value={linkData.shortUrl}
                  size={200}
                  fgColor={linkData.qrColor || "#0A0A0A"}
                  bgColor={linkData.qrBg || "#FFFFFF"}
                />
                <span className="font-mono text-xs font-black text-primary-dark">
                  {linkData.shortUrl}
                </span>
              </div>

              <div className="max-w-md space-y-4">
                <div className="p-4 border-2 border-black bg-cream shadow-brutal-sm space-y-2">
                  <h4 className="font-heading font-black text-sm text-black">
                    Kelebihan Kode QR Dinamis:
                  </h4>
                  <ul className="text-xs font-semibold text-neutral-700 space-y-1.5 list-disc list-inside">
                    <li>URL tujuan asli dapat diubah sewaktu-waktu tanpa mencetak ulang QR.</li>
                    <li>Setiap scan tercatat di analitik secara real-time.</li>
                    <li>Mendukung kustomisasi warna brand dan download SVG untuk cetak resolusi tinggi.</li>
                  </ul>
                </div>

                <div className="flex items-center gap-3">
                  <Button variant="outline" size="sm" asChild className="flex-1">
                    <Link href={`/dashboard/tautan/${linkData.id}/qr`}>
                      Unduh PNG / SVG
                    </Link>
                  </Button>
                  <Button variant="cream" size="sm" onClick={handleCopy} className="flex-1">
                    Salin URL QR
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Delete Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-destructive flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" strokeWidth={2.5} />
              Hapus Tautan Permanen?
            </DialogTitle>
            <DialogDescription className="font-semibold text-black">
              Apakah Anda yakin ingin menghapus tautan &ldquo;{linkData.title}&rdquo;? Semua data analitik tautan ini juga akan terhapus.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Batal
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Ya, Hapus Sekarang
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
