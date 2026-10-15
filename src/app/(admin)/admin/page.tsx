"use client";

import { useState, useEffect } from "react";
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
import { Admin30DayChart } from "@/components/dashboard/dashboard-charts";
import {
  getAdminStats,
  getAdminUsers,
  getAdminLinks,
  getAuditLogs,
  type AdminUserItem,
  type AdminLinkItem,
  type AuditLogItem,
} from "@/actions/admin";
import { getAnalytics, type AnalyticsTimeSeries } from "@/actions/analytics";

export default function AdminDashboardPage() {
  const [stats, setStats] = useState({
    totalUsers: 842,
    newUsersThisWeek: 42,
    totalLinks: 4921,
    blockedLinks: 17,
    totalClicks: 189420,
    activeRatePercent: 98.4,
  });

  const [latestUsers, setLatestUsers] = useState<AdminUserItem[]>([]);
  const [latestLinks, setLatestLinks] = useState<AdminLinkItem[]>([]);
  const [recentLogs, setRecentLogs] = useState<AuditLogItem[]>([]);
  const [timeSeries, setTimeSeries] = useState<AnalyticsTimeSeries[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);

    Promise.all([
      getAdminStats(),
      getAdminUsers({ limit: 5 }),
      getAdminLinks({ limit: 5 }),
      getAuditLogs({ limit: 3 }),
      getAnalytics({ timeRange: "30d" }),
    ])
      .then(([statsRes, usersRes, linksRes, logsRes, analyticsRes]) => {
        if (!isMounted) return;

        if (statsRes.success && statsRes.data) {
          setStats(statsRes.data as typeof stats);
        }
        if (usersRes.success && usersRes.data) {
          setLatestUsers(usersRes.data);
        }
        if (linksRes.success && linksRes.data) {
          setLatestLinks(linksRes.data);
        }
        if (logsRes.success && logsRes.data) {
          setRecentLogs(logsRes.data);
        }
        if (analyticsRes.success && analyticsRes.data) {
          setTimeSeries(analyticsRes.data.timeSeries);
        }
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

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
              {isLoading ? "Sinkronisasi..." : "Sistem Aktif 🟢"}
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black font-heading tracking-tight mt-2 text-black">
            Pusat Kendali Sistem Pendek-In
          </h1>
          <p className="text-sm font-semibold text-neutral-700 mt-1 max-w-2xl">
            Awasi statistik global, moderasi tautan berbahaya, kelola izin pengguna, dan pantau log audit sistem secara terpusat.
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
            <div className="font-mono text-3xl font-black text-black">
              {stats.totalUsers.toLocaleString("id-ID")}
            </div>
            <div className="text-xs font-bold text-neutral-700 mt-1 flex items-center justify-between">
              <span>+{stats.newUsersThisWeek} pengguna baru</span>
              <span className="bg-primary/30 border border-black px-1.5 text-[10px] font-mono">Terdaftar</span>
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
            <div className="font-mono text-3xl font-black text-black">
              {stats.totalLinks.toLocaleString("id-ID")}
            </div>
            <div className="text-xs font-bold text-neutral-700 mt-1">
              {stats.activeRatePercent}% tautan aktif beroperasi
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
            <div className="font-mono text-3xl font-black text-black">
              {stats.totalClicks.toLocaleString("id-ID")}
            </div>
            <div className="text-xs font-bold text-neutral-700 mt-1">
              Agregasi seluruh trafik jaringan
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
            <div className="font-mono text-3xl font-black text-destructive">
              {stats.blockedLinks.toLocaleString("id-ID")}
            </div>
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
              <CardTitle className="text-xl">Volume Trafik &amp; Kunjungan Global (30 Hari)</CardTitle>
              <Badge variant="default" className="text-[11px]">Real-Time Monitoring</Badge>
            </div>
            <CardDescription className="text-neutral-700 font-medium text-xs mt-1">
              Tren pengalihan short-link dan deteksi anomali trafik sistem dalam 30 hari terakhir.
            </CardDescription>
          </div>
          <div className="flex items-center gap-3 text-xs font-mono font-black">
            <span className="flex items-center gap-1.5 bg-white border-2 border-black px-2 py-1 shadow-brutal-sm">
              <span className="w-2.5 h-2.5 bg-primary border border-black inline-block" />
              Trafik Valid
            </span>
          </div>
        </CardHeader>
        <CardContent className="p-4 sm:p-6">
          <Admin30DayChart data={timeSeries.length > 0 ? timeSeries : []} />
        </CardContent>
      </Card>

      {/* 2 Kolom: Pengguna Terbaru & Tautan Terbaru */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Kolom Kiri: 5 Pengguna Terbaru */}
        <Card className="border-[3px] border-black shadow-brutal">
          <CardHeader className="border-b-2 border-black bg-cream p-4 flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-base flex items-center gap-2">
                <Users className="h-5 w-5 text-black" strokeWidth={2.5} />
                <span>Pengguna Terbaru</span>
              </CardTitle>
            </div>
            <Button size="sm" variant="outline" asChild className="text-xs font-bold">
              <Link href="/admin/pengguna" className="flex items-center gap-1">
                <span>Semua Pengguna</span>
                <ArrowRight className="h-3.5 w-3.5" strokeWidth={2.5} />
              </Link>
            </Button>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="border-b-2 border-black bg-neutral-100">
                  <TableHead className="font-heading font-black text-black text-xs">Pengguna</TableHead>
                  <TableHead className="font-heading font-black text-black text-xs">Role</TableHead>
                  <TableHead className="font-heading font-black text-black text-xs">Status</TableHead>
                  <TableHead className="font-heading font-black text-black text-xs text-right">Tautan</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {latestUsers.map((user) => (
                  <TableRow key={user.id} className="border-b border-neutral-200 hover:bg-cream/40">
                    <TableCell className="py-3">
                      <div className="font-heading font-black text-sm text-black">{user.fullName}</div>
                      <div className="font-mono text-xs text-neutral-500 truncate max-w-[180px]">
                        {user.email}
                      </div>
                    </TableCell>
                    <TableCell className="py-3">
                      <Badge variant={user.role === "super_admin" ? "destructive" : "secondary"} className="text-[10px]">
                        {user.role}
                      </Badge>
                    </TableCell>
                    <TableCell className="py-3">
                      <span className={`inline-flex items-center px-2 py-0.5 text-[10px] font-mono font-bold border ${
                        user.status === "active"
                          ? "bg-primary/20 text-black border-black"
                          : "bg-destructive/20 text-destructive border-destructive"
                      }`}>
                        {user.status === "active" ? "Aktif" : "Banned"}
                      </span>
                    </TableCell>
                    <TableCell className="text-right font-mono font-black text-sm py-3">
                      {user.linksCount}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Kolom Kanan: 5 Tautan Terbaru Masuk */}
        <Card className="border-[3px] border-black shadow-brutal">
          <CardHeader className="border-b-2 border-black bg-cream p-4 flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-base flex items-center gap-2">
                <Link2 className="h-5 w-5 text-black" strokeWidth={2.5} />
                <span>Tautan Terakhir Dimoderasi</span>
              </CardTitle>
            </div>
            <Button size="sm" variant="outline" asChild className="text-xs font-bold">
              <Link href="/admin/tautan" className="flex items-center gap-1">
                <span>Moderasi Global</span>
                <ArrowRight className="h-3.5 w-3.5" strokeWidth={2.5} />
              </Link>
            </Button>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="border-b-2 border-black bg-neutral-100">
                  <TableHead className="font-heading font-black text-black text-xs">Tautan</TableHead>
                  <TableHead className="font-heading font-black text-black text-xs">Pembuat</TableHead>
                  <TableHead className="font-heading font-black text-black text-xs">Status</TableHead>
                  <TableHead className="font-heading font-black text-black text-xs text-right">Klik</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {latestLinks.map((link) => (
                  <TableRow key={link.id} className="border-b border-neutral-200 hover:bg-cream/40">
                    <TableCell className="py-3">
                      <div className="font-heading font-black text-sm text-black truncate max-w-[160px]">
                        {link.title}
                      </div>
                      <div className="font-mono text-xs text-primary-dark font-black">
                        /s/{link.slug}
                      </div>
                    </TableCell>
                    <TableCell className="py-3 text-xs font-medium font-sans">
                      {link.authorName}
                    </TableCell>
                    <TableCell className="py-3">
                      <span className={`inline-flex items-center px-2 py-0.5 text-[10px] font-mono font-bold border ${
                        link.status === "active"
                          ? "bg-primary/20 text-black border-black"
                          : link.status === "blocked"
                          ? "bg-destructive text-white border-black"
                          : "bg-warning/30 text-black border-black"
                      }`}>
                        {link.status === "active" ? "Aktif" : link.status === "blocked" ? "Blokir" : "Kadaluarsa"}
                      </span>
                    </TableCell>
                    <TableCell className="text-right font-mono font-black text-sm py-3">
                      {link.clickCount.toLocaleString("id-ID")}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      {/* Bagian Bawah: Log Aktivitas Audit Terakhir */}
      <Card className="border-[3px] border-black shadow-brutal">
        <CardHeader className="border-b-2 border-black bg-cream p-4 flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-base flex items-center gap-2">
              <Activity className="h-5 w-5 text-black" strokeWidth={2.5} />
              <span>Log Aktivitas &amp; Audit Trail Terkini</span>
            </CardTitle>
          </div>
          <Button size="sm" variant="outline" asChild className="text-xs font-bold">
            <Link href="/admin/log-aktivitas">
              <span>Buka Audit Trail Lengkap &rarr;</span>
            </Link>
          </Button>
        </CardHeader>
        <CardContent className="p-4 space-y-3 font-mono text-xs">
          {recentLogs.map((log) => (
            <div
              key={log.id}
              className="p-3 border-2 border-black bg-white shadow-brutal-sm flex flex-col sm:flex-row sm:items-center justify-between gap-2"
            >
              <div className="flex items-center gap-2">
                <span className="font-black text-black uppercase bg-primary/20 px-2 py-0.5 border border-black">
                  {log.action}
                </span>
                <span className="text-neutral-700 font-bold">Target: {log.targetId || log.targetType}</span>
                <span className="text-neutral-400">&bull;</span>
                <span className="text-neutral-500 font-sans">Oleh {log.actorName}</span>
              </div>
              <span className="text-neutral-400 text-[11px] font-bold">
                {new Date(log.createdAt).toLocaleTimeString("id-ID")}
              </span>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
