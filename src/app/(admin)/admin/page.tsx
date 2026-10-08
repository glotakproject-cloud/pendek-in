import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Users,
  Link2,
  MousePointerClick,
  ShieldAlert,
  Ban,
} from "lucide-react";

export default function AdminDashboardPage() {
  return (
    <div className="space-y-8">
      {/* Admin Warning/Status Bar */}
      <div className="border-[3px] border-black bg-white p-6 shadow-brutal flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Badge variant="destructive">MODE SUPER ADMIN</Badge>
            <span className="text-xs font-mono font-bold text-neutral-600">
              Hak Akses Penuh Sistem
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black font-heading tracking-tight mt-2 text-black">
            Dasbor Kendali Sistem Pendek-In
          </h1>
          <p className="text-sm font-semibold text-neutral-700 mt-1">
            Pantau seluruh trafik global, kelola pengguna, moderasi domain berbahaya, dan periksa kata terlarang.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button size="sm" variant="destructive" asChild>
            <Link href="/admin/domain-terblokir">
              <ShieldAlert className="mr-1.5 h-4 w-4" strokeWidth={2.5} />
              Domain Blacklist
            </Link>
          </Button>
        </div>
      </div>

      {/* 4 Statistik Cards Global */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="p-4 border-b-2 border-black flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-xs font-black uppercase tracking-wider text-neutral-600">
              Total Pengguna
            </CardTitle>
            <div className="p-2 bg-primary border-2 border-black">
              <Users className="h-4 w-4" strokeWidth={2.5} />
            </div>
          </CardHeader>
          <CardContent className="p-4 pt-3">
            <div className="font-mono text-3xl font-black text-black">842</div>
            <div className="text-xs font-bold text-neutral-700 mt-1">
              839 member &bull; 3 super admin
            </div>
          </CardContent>
        </Card>

        <Card variant="cream">
          <CardHeader className="p-4 border-b-2 border-black flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-xs font-black uppercase tracking-wider text-neutral-600">
              Total Tautan Global
            </CardTitle>
            <div className="p-2 bg-accent border-2 border-black">
              <Link2 className="h-4 w-4" strokeWidth={2.5} />
            </div>
          </CardHeader>
          <CardContent className="p-4 pt-3">
            <div className="font-mono text-3xl font-black text-black">4.921</div>
            <div className="text-xs font-bold text-neutral-700 mt-1">
              +142 tautan baru hari ini
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="p-4 border-b-2 border-black flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-xs font-black uppercase tracking-wider text-neutral-600">
              Total Klik Sistem
            </CardTitle>
            <div className="p-2 bg-cream border-2 border-black">
              <MousePointerClick className="h-4 w-4" strokeWidth={2.5} />
            </div>
          </CardHeader>
          <CardContent className="p-4 pt-3">
            <div className="font-mono text-3xl font-black text-black">189.420</div>
            <div className="text-xs font-bold text-neutral-700 mt-1">
              Rata-rata 38 klik/tautan
            </div>
          </CardContent>
        </Card>

        <Card variant="cream">
          <CardHeader className="p-4 border-b-2 border-black flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-xs font-black uppercase tracking-wider text-neutral-600">
              Tautan Terblokir
            </CardTitle>
            <div className="p-2 bg-destructive text-white border-2 border-black">
              <Ban className="h-4 w-4" strokeWidth={2.5} />
            </div>
          </CardHeader>
          <CardContent className="p-4 pt-3">
            <div className="font-mono text-3xl font-black text-destructive">17</div>
            <div className="text-xs font-bold text-neutral-700 mt-1">
              Phishing &amp; scam terdeteksi
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Audit Log / Moderasi Cepat */}
      <Card>
        <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <CardTitle>Aktivitas Moderasi Terbaru</CardTitle>
            <CardDescription>
              Riwayat aksi Super Admin dalam memblokir ancaman dan mengamankan sistem
            </CardDescription>
          </div>
          <Button variant="outline" size="sm" asChild>
            <Link href="/admin/log-aktivitas">Lihat Seluruh Log</Link>
          </Button>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y-2 divide-black">
            <div className="p-4 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Badge variant="destructive">Domain Diblokir</Badge>
                  <span className="font-mono font-bold text-sm">klik-menang-undian.xyz</span>
                </div>
                <p className="text-xs text-neutral-600 font-medium">
                  Alasan: Terdeteksi website penipuan undian palsu (SMS spam).
                </p>
              </div>
              <div className="text-right text-xs font-mono text-neutral-500">
                12 menit yang lalu &bull; Aktor: Super Admin
              </div>
            </div>

            <div className="p-4 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Badge variant="warning">Kata Terlarang Ditambah</Badge>
                  <span className="font-mono font-bold text-sm">slug: &quot;bank-bca-official&quot;</span>
                </div>
                <p className="text-xs text-neutral-600 font-medium">
                  Alasan: Pencegahan impersonasi institusi perbankan.
                </p>
              </div>
              <div className="text-right text-xs font-mono text-neutral-500">
                1 jam yang lalu &bull; Aktor: Super Admin
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
