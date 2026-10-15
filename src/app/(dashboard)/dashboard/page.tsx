"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Link2,
  MousePointerClick,
  Sparkles,
  TrendingUp,
  PlusCircle,
  Copy,
  QrCode,
  ArrowRight,
  Eye,
} from "lucide-react";
import { Mini7DayChart } from "@/components/dashboard/dashboard-charts";
import { getAnalytics, type AnalyticsResult } from "@/actions/analytics";
import { getUserLinks } from "@/actions/links";
import { getUserProfile, type UserProfileData } from "@/actions/profile";
import { type LinkStatus } from "@/types/database";

interface DashboardLinkItem {
  id: string;
  title: string;
  slug: string;
  originalUrl: string;
  shortUrl: string;
  status: LinkStatus;
  clicks: number;
  uniqueClicks: number;
  createdAt: string;
}

export default function DashboardOverviewPage() {
  const [profile, setProfile] = useState<UserProfileData | null>(null);
  const [analytics, setAnalytics] = useState<AnalyticsResult | null>(null);
  const [recentLinks, setRecentLinks] = useState<DashboardLinkItem[]>([]);
  const [totalLinksCount, setTotalLinksCount] = useState<number>(0);
  const [activeCount, setActiveCount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);

    Promise.all([
      getUserProfile(),
      getAnalytics({ timeRange: "7d" }),
      getUserLinks({ limit: 5, sortBy: "newest" }),
    ])
      .then(([profileRes, analyticsRes, linksRes]) => {
        if (!isMounted) return;

        if (profileRes.success && profileRes.data) {
          setProfile(profileRes.data);
        }

        if (analyticsRes.success && analyticsRes.data) {
          setAnalytics(analyticsRes.data);
        }

        if (linksRes.success && linksRes.data) {
          const origin = typeof window !== "undefined" ? window.location.origin : "https://pendek.in";
          const mapped: DashboardLinkItem[] = linksRes.data.map((l) => ({
            id: l.id,
            title: l.title || l.slug,
            slug: l.slug,
            originalUrl: l.original_url,
            shortUrl: `${origin}/s/${l.slug}`,
            status: l.status,
            clicks: l.click_count,
            uniqueClicks: l.unique_click_count,
            createdAt: new Date(l.created_at).toLocaleDateString("id-ID", {
              day: "numeric",
              month: "short",
              year: "numeric",
            }),
          }));

          setRecentLinks(mapped);
          setTotalLinksCount(linksRes.total || mapped.length);
          setActiveCount(mapped.filter((l) => l.status === "active").length);
        }
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const handleCopy = (shortUrl: string, title: string) => {
    navigator.clipboard.writeText(shortUrl);
    toast.success("Tautan Disalin! 📋", {
      description: `URL untuk "${title}" berhasil disalin ke papan klip.`,
    });
  };

  const displayName = profile?.fullName || "Dimas Pratama";
  const totalClicksVal = analytics ? analytics.totalClicks.toLocaleString("id-ID") : "...";
  const uniqueClicksVal = analytics ? analytics.uniqueClicks.toLocaleString("id-ID") : "...";
  const uniqueRatioVal =
    analytics && analytics.totalClicks > 0
      ? ((analytics.uniqueClicks / analytics.totalClicks) * 100).toFixed(1)
      : "82.6";

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="border-[3px] border-black bg-primary p-6 sm:p-8 shadow-brutal flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="bg-white border-2 border-black text-xs font-mono font-black px-2 py-0.5 shadow-brutal-sm uppercase">
            Selamat Datang Kembali
          </span>
          <h1 className="text-3xl sm:text-4xl font-black font-heading tracking-tight mt-2 text-black">
            Halo, {displayName}! 👋
          </h1>
          <p className="text-sm sm:text-base font-semibold text-black/80 mt-1 max-w-xl">
            Tautan Anda mendapatkan performa luar biasa. Pantau tren kunjungan dan kelola tautan Anda dengan mudah.
          </p>
        </div>
        <Button size="lg" variant="outline" asChild className="shrink-0 bg-white">
          <Link href="/dashboard/tautan/baru" className="flex items-center gap-2">
            <PlusCircle className="h-5 w-5" strokeWidth={2.5} />
            <span>Buat Tautan Baru</span>
          </Link>
        </Button>
      </div>

      {/* 4 Statistik Cards */}
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
            <div className="font-mono text-3xl font-black text-black">{totalClicksVal}</div>
            <div className="flex items-center gap-1 text-xs font-bold text-neutral-700 mt-1">
              <TrendingUp className="h-3.5 w-3.5 text-primary-dark" strokeWidth={2.5} />
              <span>{isLoading ? "Memuat..." : "Aktivitas 7 hari terakhir"}</span>
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
            <div className="font-mono text-3xl font-black text-black">{uniqueClicksVal}</div>
            <div className="text-xs font-bold text-neutral-700 mt-1">
              {uniqueRatioVal}% rasio pengunjung unik
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="p-4 border-b-2 border-black flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-xs font-black uppercase tracking-wider text-neutral-600">
              Total Tautan
            </CardTitle>
            <div className="p-2 bg-cream border-2 border-black">
              <Link2 className="h-4 w-4" strokeWidth={2.5} />
            </div>
          </CardHeader>
          <CardContent className="p-4 pt-3">
            <div className="font-mono text-3xl font-black text-black">
              {isLoading ? "..." : totalLinksCount}
            </div>
            <div className="text-xs font-bold text-neutral-700 mt-1">
              {activeCount} aktif dari {totalLinksCount} tautan
            </div>
          </CardContent>
        </Card>

        <Card variant="cream">
          <CardHeader className="p-4 border-b-2 border-black flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-xs font-black uppercase tracking-wider text-neutral-600">
              Kode QR Aktif
            </CardTitle>
            <div className="p-2 bg-primary border-2 border-black">
              <QrCode className="h-4 w-4" strokeWidth={2.5} />
            </div>
          </CardHeader>
          <CardContent className="p-4 pt-3">
            <div className="font-mono text-3xl font-black text-black">
              {isLoading ? "..." : totalLinksCount}
            </div>
            <div className="text-xs font-bold text-neutral-700 mt-1">
              Format PNG &amp; SVG siap diunduh
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Grafik Mini 7 Hari */}
      <Card>
        <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <div className="flex items-center gap-2">
              <CardTitle>Tren Klik 7 Hari Terakhir</CardTitle>
              <Badge variant="secondary">Minggu Ini</Badge>
            </div>
            <CardDescription>
              Aktivitas klik dan rasio pengunjung unik per hari dalam satu pekan
            </CardDescription>
          </div>
          <div className="flex items-center gap-4 text-xs font-mono font-bold">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 bg-primary border border-black inline-block" />
              <span>Total Klik</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 bg-accent border border-black inline-block" />
              <span>Pengunjung Unik</span>
            </div>
            <Button variant="outline" size="sm" asChild>
              <Link href="/dashboard/analitik" className="flex items-center gap-1">
                <span>Analitik Lengkap</span>
                <ArrowRight className="h-3.5 w-3.5" strokeWidth={2.5} />
              </Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-4 sm:p-6">
          <Mini7DayChart data={analytics?.timeSeries || []} />
        </CardContent>
      </Card>

      {/* Tabel 5 Tautan Terbaru */}
      <Card>
        <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <CardTitle>5 Tautan Terbaru &amp; Terpopuler</CardTitle>
            <CardDescription>
              Tautan yang baru saja Anda buat atau mendapatkan lonjakan klik
            </CardDescription>
          </div>
          <Button variant="outline" size="sm" asChild>
            <Link href="/dashboard/tautan" className="flex items-center gap-1.5">
              <span>Kelola Semua Tautan ({totalLinksCount})</span>
              <ArrowRight className="h-4 w-4" strokeWidth={2.5} />
            </Link>
          </Button>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[38%]">Tautan &amp; Target URL</TableHead>
                <TableHead className="w-[15%]">Status</TableHead>
                <TableHead className="w-[15%] text-right">Total Klik</TableHead>
                <TableHead className="w-[12%]">Dibuat</TableHead>
                <TableHead className="w-[20%] text-center">Aksi Cepat</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentLinks.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 font-mono text-sm text-neutral-500">
                    {isLoading ? "Memuat tautan..." : "Belum ada tautan. Buat tautan pertama Anda sekarang!"}
                  </TableCell>
                </TableRow>
              ) : (
                recentLinks.map((link) => (
                  <TableRow key={link.id}>
                    <TableCell className="font-sans">
                      <div className="font-heading font-black text-black line-clamp-1">
                        {link.title}
                      </div>
                      <div className="flex items-center gap-2 mt-0.5 text-xs font-mono">
                        <span className="text-primary-dark font-black">{link.shortUrl}</span>
                        <span className="text-neutral-400">&bull;</span>
                        <span className="text-neutral-500 truncate max-w-[220px]">
                          {link.originalUrl}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      {link.status === "active" && <Badge variant="default">Aktif</Badge>}
                      {link.status === "blocked" && <Badge variant="destructive">Diblokir</Badge>}
                      {link.status === "expired" && <Badge variant="warning">Kadaluarsa</Badge>}
                    </TableCell>
                    <TableCell className="text-right font-mono">
                      <div className="font-black text-base">{link.clicks.toLocaleString()}</div>
                      <div className="text-[11px] text-neutral-500 font-bold">
                        {link.uniqueClicks.toLocaleString()} unik
                      </div>
                    </TableCell>
                    <TableCell className="font-mono text-xs text-neutral-600 font-bold">
                      {link.createdAt}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center justify-center gap-1.5">
                        <Button
                          size="iconSm"
                          variant="outline"
                          title="Salin Tautan Pendek"
                          onClick={() => handleCopy(link.shortUrl, link.title)}
                        >
                          <Copy className="h-3.5 w-3.5" strokeWidth={2.5} />
                        </Button>
                        <Button
                          size="iconSm"
                          variant="secondary"
                          asChild
                          title="Editor &amp; Unduh QR"
                        >
                          <Link href={`/dashboard/tautan/${link.id}/qr`}>
                            <QrCode className="h-3.5 w-3.5" strokeWidth={2.5} />
                          </Link>
                        </Button>
                        <Button
                          size="iconSm"
                          variant="outline"
                          asChild
                          title="Detail &amp; Analitik"
                        >
                          <Link href={`/dashboard/tautan/${link.id}`}>
                            <Eye className="h-3.5 w-3.5" strokeWidth={2.5} />
                          </Link>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
