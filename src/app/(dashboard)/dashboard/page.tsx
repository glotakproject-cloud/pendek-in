import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Link2,
  MousePointerClick,
  Sparkles,
  TrendingUp,
  PlusCircle,
  Copy,
  QrCode,
} from "lucide-react";

export default function DashboardOverviewPage() {
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
            <div className="font-mono text-3xl font-black text-black">1.247</div>
            <div className="flex items-center gap-1 text-xs font-bold text-neutral-700 mt-1">
              <TrendingUp className="h-3.5 w-3.5 text-primary-dark" strokeWidth={2.5} />
              <span>+18.2% dari minggu lalu</span>
            </div>
          </CardContent>
        </Card>

        <Card variant="cream">
          <CardHeader className="p-4 border-b-2 border-black flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-xs font-black uppercase tracking-wider text-neutral-600">
              Klik Unik
            </CardTitle>
            <div className="p-2 bg-accent border-2 border-black">
              <Sparkles className="h-4 w-4" strokeWidth={2.5} />
            </div>
          </CardHeader>
          <CardContent className="p-4 pt-3">
            <div className="font-mono text-3xl font-black text-black">983</div>
            <div className="text-xs font-bold text-neutral-700 mt-1">
              78.8% rasio pengunjung unik
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
            <div className="font-mono text-3xl font-black text-black">14</div>
            <div className="text-xs font-bold text-neutral-700 mt-1">
              Semua tautan berstatus aktif
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
            <div className="font-mono text-3xl font-black text-black">28</div>
            <div className="text-xs font-bold text-neutral-700 mt-1">
              Format PNG &amp; SVG
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tautan Terbaru Dummy Preview */}
      <Card>
        <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <CardTitle>Tautan Paling Populer</CardTitle>
            <CardDescription>
              Tautan dengan aktivitas pengunjung tertinggi dalam 7 hari terakhir
            </CardDescription>
          </div>
          <Button variant="outline" size="sm" asChild>
            <Link href="/dashboard/tautan">Lihat Semua Tautan</Link>
          </Button>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y-2 divide-black">
            <div className="p-4 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-cream/50 transition-colors">
              <div className="space-y-1 min-w-0">
                <div className="flex items-center gap-2">
                  <Badge variant="default">Kustom</Badge>
                  <span className="font-heading font-black text-base text-black truncate">
                    Katalog Buket Pernikahan Premium Jakarta Selatan
                  </span>
                </div>
                <div className="flex items-center gap-3 text-xs font-mono font-medium text-neutral-600">
                  <span className="text-primary-dark font-bold">pendek.in/buket-nikah-jkt</span>
                  <span>&bull;</span>
                  <span className="truncate max-w-[280px]">
                    https://tokobunga.id/katalog/buket-pernikahan-premium-jakarta-selatan
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <div className="text-right">
                  <div className="font-mono font-black text-lg text-black">1.247 klik</div>
                  <div className="text-[11px] font-mono text-neutral-500">983 unik</div>
                </div>
                <Button size="iconSm" variant="outline" title="Salin Link">
                  <Copy className="h-4 w-4" strokeWidth={2.5} />
                </Button>
                <Button size="iconSm" variant="secondary" asChild title="Editor QR">
                  <Link href="/dashboard/tautan/buket-nikah-jkt/qr">
                    <QrCode className="h-4 w-4" strokeWidth={2.5} />
                  </Link>
                </Button>
              </div>
            </div>

            <div className="p-4 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-cream/50 transition-colors">
              <div className="space-y-1 min-w-0">
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">Kustom</Badge>
                  <span className="font-heading font-black text-base text-black truncate">
                    Tutorial Copywriting untuk UMKM
                  </span>
                </div>
                <div className="flex items-center gap-3 text-xs font-mono font-medium text-neutral-600">
                  <span className="text-primary-dark font-bold">pendek.in/tutorial-copywriting</span>
                  <span>&bull;</span>
                  <span className="truncate max-w-[280px]">
                    https://youtube.com/watch?v=contoh-video-tutorial-copywriting
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <div className="text-right">
                  <div className="font-mono font-black text-lg text-black">452 klik</div>
                  <div className="text-[11px] font-mono text-neutral-500">388 unik</div>
                </div>
                <Button size="iconSm" variant="outline" title="Salin Link">
                  <Copy className="h-4 w-4" strokeWidth={2.5} />
                </Button>
                <Button size="iconSm" variant="secondary" asChild title="Editor QR">
                  <Link href="/dashboard/tautan/tutorial-copywriting/qr">
                    <QrCode className="h-4 w-4" strokeWidth={2.5} />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
