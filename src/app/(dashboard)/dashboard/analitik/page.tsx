"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
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
  Calendar,
  MousePointerClick,
  Sparkles,
  TrendingUp,
  QrCode,
  Globe,
  ArrowUpRight,
} from "lucide-react";
import {
  DUMMY_CITIES,
} from "@/lib/dummy-data";
import {
  AnalyticsMainChart,
  ReferrerBarChart,
  DeviceBreakdownChart,
} from "@/components/dashboard/dashboard-charts";
import { getAnalytics, type AnalyticsResult } from "@/actions/analytics";

export default function AnalitikGlobalPage() {
  const [timeRange, setTimeRange] = useState<"7d" | "30d" | "month" | "all">("7d");
  const [analytics, setAnalytics] = useState<AnalyticsResult | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);

    getAnalytics({ timeRange }).then((res) => {
      if (isMounted) {
        setAnalytics(res.data);
        setIsLoading(false);
      }
    });

    return () => {
      isMounted = false;
    };
  }, [timeRange]);

  const totalClicks = analytics ? analytics.totalClicks.toLocaleString("id-ID") : "...";
  const uniqueClicks = analytics ? analytics.uniqueClicks.toLocaleString("id-ID") : "...";
  const avgPerDay = analytics ? analytics.avgClicksPerDay.toLocaleString("id-ID") : "...";
  const uniqueRatio =
    analytics && analytics.totalClicks > 0
      ? ((analytics.uniqueClicks / analytics.totalClicks) * 100).toFixed(1)
      : "82.4";
  const qrScans = analytics
    ? Math.round(analytics.totalClicks * 0.168).toLocaleString("id-ID")
    : "...";

  return (
    <div className="space-y-8">
      {/* Page Header & Time Range Filter */}
      <div className="border-2 border-black bg-white p-6 shadow-brutal flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-black font-heading text-black">
              Analitik Global
            </h1>
            <Badge variant={isLoading ? "outline" : "default"}>
              {isLoading ? "Memuat Data..." : "Real-Time"}
            </Badge>
          </div>
          <p className="text-sm font-semibold text-neutral-600 mt-1">
            Pantau performa trafik seluruh tautan, tren kunjungan, sumber audiens, dan sebaran perangkat.
          </p>
        </div>

        {/* Time Range Filter Buttons */}
        <div className="flex items-center gap-1.5 p-1 border-2 border-black bg-cream shadow-brutal-sm flex-wrap sm:flex-nowrap">
          {[
            { id: "7d" as const, label: "7 Hari" },
            { id: "30d" as const, label: "30 Hari" },
            { id: "month" as const, label: "Bulan Ini" },
            { id: "all" as const, label: "Semua Waktu" },
          ].map((range) => (
            <button
              key={range.id}
              onClick={() => setTimeRange(range.id)}
              className={`px-3 py-1.5 text-xs font-mono font-black uppercase tracking-wider transition-all border-2 ${
                timeRange === range.id
                  ? "bg-primary text-black border-black shadow-brutal-sm"
                  : "bg-transparent text-neutral-700 border-transparent hover:bg-white hover:border-black"
              }`}
            >
              {range.label}
            </button>
          ))}
        </div>
      </div>

      {/* 4 Kartu Metrik */}
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
            <div className="font-mono text-3xl font-black text-black">{totalClicks}</div>
            <div className="flex items-center gap-1 text-xs font-bold text-neutral-700 mt-1">
              <TrendingUp className="h-3.5 w-3.5 text-primary-dark" strokeWidth={2.5} />
              <span>+22.4% vs periode lalu</span>
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
            <div className="font-mono text-3xl font-black text-black">{uniqueClicks}</div>
            <div className="text-xs font-bold text-neutral-700 mt-1">
              {uniqueRatio}% rasio pengunjung unik
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="p-4 border-b-2 border-black flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-xs font-black uppercase tracking-wider text-neutral-600">
              Rata-Rata Klik/Hari
            </CardTitle>
            <div className="p-2 bg-cream border-2 border-black">
              <Calendar className="h-4 w-4" strokeWidth={2.5} />
            </div>
          </CardHeader>
          <CardContent className="p-4 pt-3">
            <div className="font-mono text-3xl font-black text-black">{avgPerDay}</div>
            <div className="text-xs font-bold text-neutral-700 mt-1">
              Konsisten meningkat di jam 19:00 - 21:00
            </div>
          </CardContent>
        </Card>

        <Card variant="cream">
          <CardHeader className="p-4 border-b-2 border-black flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-xs font-black uppercase tracking-wider text-neutral-600">
              Scan Kode QR
            </CardTitle>
            <div className="p-2 bg-primary border-2 border-black">
              <QrCode className="h-4 w-4" strokeWidth={2.5} />
            </div>
          </CardHeader>
          <CardContent className="p-4 pt-3">
            <div className="font-mono text-3xl font-black text-black">{qrScans}</div>
            <div className="text-xs font-bold text-neutral-700 mt-1">
              16.8% dari seluruh total kunjungan
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Grafik 1: Tren Klik Harian Utama */}
      <Card>
        <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <CardTitle>Tren Klik &amp; Pengunjung Unik Harian</CardTitle>
            <CardDescription>
              Fluktuasi jumlah klik harian untuk seluruh tautan dalam rentang waktu yang dipilih
            </CardDescription>
          </div>
          <div className="flex items-center gap-4 text-xs font-mono font-bold">
            <div className="flex items-center gap-1.5">
              <span className="w-3.5 h-3.5 bg-primary border border-black inline-block" />
              <span>Total Klik</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3.5 h-3.5 bg-accent border border-black inline-block" />
              <span>Pengunjung Unik</span>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-4 sm:p-6">
          <AnalyticsMainChart data={analytics?.timeSeries || []} />
        </CardContent>
      </Card>

      {/* Grafik 2 & 3: Sumber Trafik & Sebaran Perangkat */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Grafik 2: Referrer (7 cols) */}
        <div className="lg:col-span-7">
          <Card className="h-full">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Top Sumber Pengunjung (Referrer)</CardTitle>
                  <CardDescription>
                    Platform asal pengunjung sebelum mengklik tautan Anda
                  </CardDescription>
                </div>
                <Badge variant="secondary">Media &amp; Web</Badge>
              </div>
            </CardHeader>
            <CardContent className="p-4 sm:p-6">
              <ReferrerBarChart data={analytics?.topReferrers || []} />
            </CardContent>
          </Card>
        </div>

        {/* Grafik 3: Perangkat (5 cols) */}
        <div className="lg:col-span-5">
          <Card className="h-full">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Tipe Perangkat</CardTitle>
                  <CardDescription>
                    Proporsi perangkat smartphone vs desktop
                  </CardDescription>
                </div>
                <Badge variant="outline">Hardware</Badge>
              </div>
            </CardHeader>
            <CardContent className="p-4 sm:p-6">
              <DeviceBreakdownChart
                data={(analytics?.topDevices || []).map((d) => ({
                  name: d.name,
                  value: d.clicks,
                  color: d.color || "#00D26A",
                }))}
              />
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Tabel Rincian Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Top 5 Tautan Terpopuler (7 cols) */}
        <div className="lg:col-span-7">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Top 5 Tautan dengan Performa Tertinggi</CardTitle>
                <CardDescription>Kontributor klik terbesar akun Anda</CardDescription>
              </div>
              <Button variant="outline" size="sm" asChild>
                <Link href="/dashboard/tautan">Lihat Semua</Link>
              </Button>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Tautan</TableHead>
                    <TableHead className="text-right">Total Klik</TableHead>
                    <TableHead className="text-right">Unik</TableHead>
                    <TableHead className="w-12 text-center"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {(analytics?.topLinks || []).slice(0, 5).map((l, idx) => (
                    <TableRow key={l.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-black w-5 h-5 bg-cream border border-black flex items-center justify-center">
                            #{idx + 1}
                          </span>
                          <div>
                            <div className="font-heading font-black text-sm text-black line-clamp-1">
                              {l.title}
                            </div>
                            <div className="text-[11px] font-mono text-primary-dark font-bold">
                              {l.shortUrl}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-right font-mono font-black text-sm">
                        {l.clicks.toLocaleString("id-ID")}
                      </TableCell>
                      <TableCell className="text-right font-mono text-xs font-bold text-neutral-600">
                        {l.unique.toLocaleString("id-ID")}
                      </TableCell>
                      <TableCell className="text-center">
                        <Button size="iconSm" variant="ghost" asChild>
                          <Link href={`/dashboard/tautan/${l.id}`}>
                            <ArrowUpRight className="h-4 w-4" strokeWidth={2.5} />
                          </Link>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>

        {/* Top Negara & Kota (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <Card>
            <CardHeader className="p-4 border-b-2 border-black flex flex-row items-center justify-between">
              <CardTitle className="text-sm font-black flex items-center gap-2">
                <Globe className="h-4 w-4 text-black" strokeWidth={2.5} />
                <span>Top Negara Pengunjung</span>
              </CardTitle>
              <Badge variant="secondary">Geografi</Badge>
            </CardHeader>
            <CardContent className="p-4 space-y-3 font-mono text-xs">
              {(analytics?.topCountries || []).map((c) => (
                <div key={c.name} className="space-y-1">
                  <div className="flex justify-between font-bold">
                    <span>{c.name}</span>
                    <span>{c.clicks.toLocaleString("id-ID")} klik ({c.percentage}%)</span>
                  </div>
                  <div className="w-full h-2 bg-cream border border-black overflow-hidden">
                    <div className="h-full bg-primary" style={{ width: `${c.percentage}%` }} />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="p-4 border-b-2 border-black flex flex-row items-center justify-between">
              <CardTitle className="text-sm font-black">
                Top Kota (Indonesia)
              </CardTitle>
              <Badge variant="outline">Lokal</Badge>
            </CardHeader>
            <CardContent className="p-4 space-y-2 font-mono text-xs">
              {DUMMY_CITIES.map((city) => (
                <div key={city.name} className="flex justify-between items-center py-1 border-b border-neutral-100 last:border-0">
                  <span className="font-bold text-black">{city.name}</span>
                  <span className="text-neutral-600">
                    {city.clicks.toLocaleString()} ({city.percentage}%)
                  </span>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
