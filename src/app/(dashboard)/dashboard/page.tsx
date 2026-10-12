"use client";

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
import { DUMMY_LINKS, DUMMY_ANALYTICS_7_DAYS } from "@/lib/dummy-data";
import { Mini7DayChart } from "@/components/dashboard/dashboard-charts";

export default function DashboardOverviewPage() {
  const top5Links = DUMMY_LINKS.slice(0, 5);

  const handleCopy = (shortUrl: string, title: string) => {
    navigator.clipboard.writeText(shortUrl);
    toast.success("Tautan Disalin!", {
      description: `URL untuk "${title}" berhasil disalin ke papan klip.`,
    });
  };

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="border-[3px] border-black bg-primary p-6 sm:p-8 shadow-brutal flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="bg-white border-2 border-black text-xs font-mono font-black px-2 py-0.5 shadow-brutal-sm uppercase">
            Selamat Datang Kembali
          </span>
          <h1 className="text-3xl sm:text-4xl font-black font-heading tracking-tight mt-2 text-black">
            Halo, Dimas Pratama! 👋
          </h1>
          <p className="text-sm sm:text-base font-semibold text-black/80 mt-1 max-w-xl">
            Tautan Anda mendapatkan performa luar biasa minggu ini. Pantau klik dan buat tautan baru dengan mudah.
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
            <div className="font-mono text-3xl font-black text-black">8.449</div>
            <div className="flex items-center gap-1 text-xs font-bold text-neutral-700 mt-1">
              <TrendingUp className="h-3.5 w-3.5 text-primary-dark" strokeWidth={2.5} />
              <span>+18.2% dari minggu lalu</span>
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
            <div className="font-mono text-3xl font-black text-black">6.980</div>
            <div className="text-xs font-bold text-neutral-700 mt-1">
              82.6% rasio rasio pengunjung unik
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="p-4 border-b-2 border-black flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-xs font-black uppercase tracking-wider text-neutral-600">
              Tautan Aktif
            </CardTitle>
            <div className="p-2 bg-cream border-2 border-black">
              <Link2 className="h-4 w-4" strokeWidth={2.5} />
            </div>
          </CardHeader>
          <CardContent className="p-4 pt-3">
            <div className="font-mono text-3xl font-black text-black">8</div>
            <div className="text-xs font-bold text-neutral-700 mt-1">
              6 aktif &bull; 1 kadaluarsa &bull; 1 nonaktif
            </div>
          </CardContent>
        </Card>

        <Card variant="cream">
          <CardHeader className="p-4 border-b-2 border-black flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-xs font-black uppercase tracking-wider text-neutral-600">
              QR Code Terunduh
            </CardTitle>
            <div className="p-2 bg-primary border-2 border-black">
              <QrCode className="h-4 w-4" strokeWidth={2.5} />
            </div>
          </CardHeader>
          <CardContent className="p-4 pt-3">
            <div className="font-mono text-3xl font-black text-black">42</div>
            <div className="text-xs font-bold text-neutral-700 mt-1">
              Format PNG &amp; SVG resolusi tinggi
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
          <Mini7DayChart data={DUMMY_ANALYTICS_7_DAYS} />
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
              <span>Kelola Semua Tautan ({DUMMY_LINKS.length})</span>
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
              {top5Links.map((link) => (
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
                    {link.status === "inactive" && <Badge variant="destructive">Nonaktif</Badge>}
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
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
