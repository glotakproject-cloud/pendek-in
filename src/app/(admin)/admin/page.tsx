"use client";

import Link from "next/link";
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
  Users,
  Link2,
  MousePointerClick,
  ShieldAlert,
  Ban,
  ArrowRight,
  Settings,
  Activity,
} from "lucide-react";
import {
  DUMMY_ADMIN_USERS,
  DUMMY_ADMIN_LINKS,
  DUMMY_ANALYTICS_30_DAYS,
  DUMMY_AUDIT_LOGS,
} from "@/lib/dummy-data";
import { Admin30DayChart } from "@/components/dashboard/dashboard-charts";

export default function AdminDashboardPage() {
  const latestUsers = DUMMY_ADMIN_USERS.slice(0, 5);
  const latestLinks = DUMMY_ADMIN_LINKS.slice(0, 5);
  const recentLogs = DUMMY_AUDIT_LOGS.slice(0, 3);

  return (
    <div className="space-y-8">
      {/* Admin Top Status Bar */}
      <div className="border-[3px] border-black bg-white p-6 shadow-brutal flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Badge variant="destructive" className="font-mono text-xs font-black uppercase">
              MODE SUPER ADMIN
            </Badge>
            <span className="text-xs font-mono font-bold text-neutral-600 bg-cream border border-black px-2 py-0.5">
              Sistem Aktif &bull; Latensi &lt; 40ms
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black font-heading tracking-tight mt-2 text-black">
            Pusat Kendali Sistem Pendek-In
          </h1>
          <p className="text-sm font-semibold text-neutral-700 mt-1 max-w-2xl">
            Awasi statistik global, moderasi tautan berbahaya, kelola izin pengguna, dan pantau kesehatan infrastruktur sistem secara terpusat.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <Button size="sm" variant="outline" asChild className="bg-white">
            <Link href="/admin/domain-terblokir">
              <ShieldAlert className="mr-1.5 h-4 w-4 text-destructive" strokeWidth={2.5} />
              Domain Blacklist
            </Link>
          </Button>
          <Button size="sm" variant="default" asChild>
            <Link href="/admin/pengaturan">
              <Settings className="mr-1.5 h-4 w-4" strokeWidth={2.5} />
              Pengaturan Sistem
            </Link>
          </Button>
        </div>
      </div>

      {/* 4 Statistik Cards Global */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-[3px] border-black shadow-brutal">
          <CardHeader className="p-4 border-b-2 border-black flex flex-row items-center justify-between space-y-0 bg-cream">
            <CardTitle className="text-xs font-black uppercase tracking-wider text-neutral-700">
              Total Pengguna
            </CardTitle>
            <div className="p-2 bg-primary border-2 border-black shadow-brutal-sm">
              <Users className="h-4 w-4 text-black" strokeWidth={2.5} />
            </div>
          </CardHeader>
          <CardContent className="p-4 pt-3">
            <div className="font-mono text-3xl font-black text-black">842</div>
            <div className="text-xs font-bold text-neutral-700 mt-1 flex items-center justify-between">
              <span>839 Member</span>
              <span className="bg-primary/30 border border-black px-1.5 text-[10px] font-mono">3 Admin</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-[3px] border-black shadow-brutal">
          <CardHeader className="p-4 border-b-2 border-black flex flex-row items-center justify-between space-y-0 bg-cream">
            <CardTitle className="text-xs font-black uppercase tracking-wider text-neutral-700">
              Total Tautan Global
            </CardTitle>
            <div className="p-2 bg-accent border-2 border-black shadow-brutal-sm">
              <Link2 className="h-4 w-4 text-black" strokeWidth={2.5} />
            </div>
          </CardHeader>
          <CardContent className="p-4 pt-3">
            <div className="font-mono text-3xl font-black text-black">4.921</div>
            <div className="text-xs font-bold text-neutral-700 mt-1">
              +142 tautan baru terdaftar hari ini
            </div>
          </CardContent>
        </Card>

        <Card className="border-[3px] border-black shadow-brutal">
          <CardHeader className="p-4 border-b-2 border-black flex flex-row items-center justify-between space-y-0 bg-cream">
            <CardTitle className="text-xs font-black uppercase tracking-wider text-neutral-700">
              Total Klik Sistem
            </CardTitle>
            <div className="p-2 bg-white border-2 border-black shadow-brutal-sm">
              <MousePointerClick className="h-4 w-4 text-black" strokeWidth={2.5} />
            </div>
          </CardHeader>
          <CardContent className="p-4 pt-3">
            <div className="font-mono text-3xl font-black text-black">189.420</div>
            <div className="text-xs font-bold text-neutral-700 mt-1">
              Rata-rata 38,4 klik per tautan
            </div>
          </CardContent>
        </Card>

        <Card className="border-[3px] border-black shadow-brutal">
          <CardHeader className="p-4 border-b-2 border-black flex flex-row items-center justify-between space-y-0 bg-cream">
            <CardTitle className="text-xs font-black uppercase tracking-wider text-neutral-700">
              Tautan Terblokir
            </CardTitle>
            <div className="p-2 bg-destructive text-white border-2 border-black shadow-brutal-sm">
              <Ban className="h-4 w-4" strokeWidth={2.5} />
            </div>
          </CardHeader>
          <CardContent className="p-4 pt-3">
            <div className="font-mono text-3xl font-black text-destructive">17</div>
            <div className="text-xs font-bold text-neutral-700 mt-1">
              Domain phishing &amp; spam dicekal
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 30-Day Global Traffic Chart Section */}
      <Card className="border-[3px] border-black shadow-brutal bg-white">
        <CardHeader className="border-b-2 border-black bg-cream p-4 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <div className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-black" strokeWidth={2.5} />
              <CardTitle className="text-lg sm:text-xl font-heading font-black">
                Tren Lalu Lintas Klik Global (30 Hari Terakhir)
              </CardTitle>
            </div>
            <CardDescription className="text-xs font-semibold text-neutral-700 mt-0.5">
              Agregasi klik dan estimasi pengunjung unik di seluruh tautan Pendek-In aktif
            </CardDescription>
          </div>
          <Badge variant="outline" className="font-mono text-xs font-bold bg-white w-fit">
            30 Hari: 189.420 Klik
          </Badge>
        </CardHeader>
        <CardContent className="p-4 sm:p-6">
          <Admin30DayChart data={DUMMY_ANALYTICS_30_DAYS} />
        </CardContent>
      </Card>

      {/* Parallel Tables: Pengguna Terbaru & Tautan Terbaru */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Tabel 5 Pengguna Terbaru */}
        <Card className="border-[3px] border-black shadow-brutal bg-white">
          <CardHeader className="border-b-2 border-black bg-cream p-4 flex flex-row items-center justify-between">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-black" strokeWidth={2.5} />
              <CardTitle className="text-base font-heading font-black">
                Pengguna Terbaru
              </CardTitle>
            </div>
            <Button variant="outline" size="sm" asChild className="text-xs font-bold h-8 bg-white">
              <Link href="/admin/pengguna" className="flex items-center gap-1">
                <span>Kelola Semua</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent className="p-0 overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-b-2 border-black bg-neutral-100 font-bold">
                  <TableHead className="font-black text-black">Pengguna</TableHead>
                  <TableHead className="font-black text-black">Role</TableHead>
                  <TableHead className="font-black text-black">Status</TableHead>
                  <TableHead className="font-black text-black text-right">Tautan</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className="divide-y-2 divide-black font-semibold text-xs">
                {latestUsers.map((user) => (
                  <TableRow key={user.id} className="hover:bg-cream/40">
                    <TableCell className="py-3">
                      <Link href={`/admin/pengguna/${user.id}`} className="hover:underline">
                        <p className="font-black text-black">{user.name}</p>
                        <p className="font-mono text-[11px] text-neutral-600 truncate max-w-[160px]">{user.email}</p>
                      </Link>
                    </TableCell>
                    <TableCell className="py-3">
                      <span className="font-mono text-[11px] uppercase font-bold">
                        {user.role === "super_admin" ? (
                          <Badge variant="destructive" className="text-[10px] px-1 py-0">ADMIN</Badge>
                        ) : (
                          <Badge variant="outline" className="text-[10px] px-1 py-0 bg-white">MEMBER</Badge>
                        )}
                      </span>
                    </TableCell>
                    <TableCell className="py-3">
                      {user.status === "active" ? (
                        <Badge variant="default" className="text-[10px] px-1.5 py-0">Aktif</Badge>
                      ) : (
                        <Badge variant="destructive" className="text-[10px] px-1.5 py-0">Disuspend</Badge>
                      )}
                    </TableCell>
                    <TableCell className="py-3 text-right font-mono font-black text-black">
                      {user.linksCount} link
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Tabel 5 Tautan Terbaru Global */}
        <Card className="border-[3px] border-black shadow-brutal bg-white">
          <CardHeader className="border-b-2 border-black bg-cream p-4 flex flex-row items-center justify-between">
            <div className="flex items-center gap-2">
              <Link2 className="h-4 w-4 text-black" strokeWidth={2.5} />
              <CardTitle className="text-base font-heading font-black">
                Tautan Global Terbaru
              </CardTitle>
            </div>
            <Button variant="outline" size="sm" asChild className="text-xs font-bold h-8 bg-white">
              <Link href="/admin/tautan" className="flex items-center gap-1">
                <span>Moderasi Semua</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent className="p-0 overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-b-2 border-black bg-neutral-100 font-bold">
                  <TableHead className="font-black text-black">Tautan</TableHead>
                  <TableHead className="font-black text-black">Pemilik</TableHead>
                  <TableHead className="font-black text-black">Status</TableHead>
                  <TableHead className="font-black text-black text-right">Klik</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className="divide-y-2 divide-black font-semibold text-xs">
                {latestLinks.map((link) => (
                  <TableRow key={link.id} className="hover:bg-cream/40">
                    <TableCell className="py-3 max-w-[180px]">
                      <Link href={`/admin/tautan/${link.id}`} className="hover:underline">
                        <p className="font-mono font-black text-black truncate">/{link.slug}</p>
                        <p className="text-[11px] text-neutral-600 truncate">{link.title}</p>
                      </Link>
                    </TableCell>
                    <TableCell className="py-3 font-medium text-neutral-800 text-[11px] truncate max-w-[120px]">
                      {link.userName}
                    </TableCell>
                    <TableCell className="py-3">
                      {link.status === "active" && (
                        <Badge variant="default" className="text-[10px] px-1.5 py-0">Aktif</Badge>
                      )}
                      {link.status === "blocked" && (
                        <Badge variant="destructive" className="text-[10px] px-1.5 py-0">Diblokir</Badge>
                      )}
                      {link.status === "expired" && (
                        <Badge variant="warning" className="text-[10px] px-1.5 py-0">Kedaluwarsa</Badge>
                      )}
                    </TableCell>
                    <TableCell className="py-3 text-right font-mono font-black text-black">
                      {link.clicks}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      {/* Audit Log / Moderasi Cepat */}
      <Card className="border-[3px] border-black shadow-brutal bg-white">
        <CardHeader className="border-b-2 border-black bg-cream flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-4 sm:p-6">
          <div>
            <CardTitle className="text-lg font-heading font-black">
              Aktivitas Moderasi &amp; Audit Log Terbaru
            </CardTitle>
            <CardDescription className="text-xs font-semibold text-neutral-700 mt-0.5">
              Riwayat aksi Super Admin dalam memblokir ancaman dan mengamankan sistem
            </CardDescription>
          </div>
          <Button variant="outline" size="sm" asChild className="bg-white">
            <Link href="/admin/log-aktivitas" className="flex items-center gap-1.5">
              <span>Buka Seluruh Audit Log</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y-2 divide-black">
            {recentLogs.map((log) => (
              <div key={log.id} className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-cream/30">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <Badge
                      variant={
                        log.action.includes("BLOCK") || log.action.includes("SUSPEND")
                          ? "destructive"
                          : log.action.includes("ADD")
                          ? "warning"
                          : "outline"
                      }
                      className="font-mono text-[10px]"
                    >
                      {log.action}
                    </Badge>
                    <span className="font-mono font-black text-sm text-black">{log.target}</span>
                  </div>
                  <p className="text-xs text-neutral-700 font-semibold">{log.metadata}</p>
                </div>
                <div className="text-right text-xs font-mono text-neutral-600 shrink-0">
                  <p>{log.timestamp}</p>
                  <p className="text-[11px] text-neutral-500">Oleh: {log.actor}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
