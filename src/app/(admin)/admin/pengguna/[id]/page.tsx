"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { toast } from "sonner";
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
  ArrowLeft,
  Mail,
  Phone,
  Calendar,
  Clock,
  Copy,
  UserCheck,
  UserX,
  KeyRound,
} from "lucide-react";
import {
  DUMMY_ADMIN_USERS,
  DUMMY_ADMIN_LINKS,
  type DummyAdminUser,
} from "@/lib/dummy-data";

export default function DetailPenggunaPage() {
  const params = useParams();
  const rawId = (params?.id as string) || "usr-01";

  // Find user by id or default to first
  const initialUser =
    DUMMY_ADMIN_USERS.find((u) => u.id === rawId) || DUMMY_ADMIN_USERS[0];

  const [user, setUser] = useState<DummyAdminUser>(initialUser);

  // User's links
  const userLinks = DUMMY_ADMIN_LINKS.filter(
    (l) => l.userId === user.id || l.userEmail === user.email
  );

  const handleToggleSuspend = () => {
    const newStatus = user.status === "active" ? "suspended" : "active";
    setUser({ ...user, status: newStatus });
    if (newStatus === "suspended") {
      toast.warning("Akun Ditangguhkan", {
        description: `Akun ${user.name} telah disuspend. Seluruh tautan pengguna tidak dapat diakses publik.`,
      });
    } else {
      toast.success("Akun Diaktifkan Kembali", {
        description: `Hak akses akun ${user.name} berhasil dipulihkan secara normal.`,
      });
    }
  };

  const handleResetPassword = () => {
    toast.info("Tautan Reset Sandi Dikirim", {
      description: `Email verifikasi reset kata sandi telah dikirimkan ke ${user.email}.`,
    });
  };

  const handleCopyLink = (url: string) => {
    navigator.clipboard.writeText(url);
    toast.success("Tautan Disalin ke Clipboard!");
  };

  return (
    <div className="space-y-8">
      {/* Back Button & Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <Button variant="outline" size="sm" asChild className="w-fit bg-white">
          <Link href="/admin/pengguna" className="flex items-center gap-1.5">
            <ArrowLeft className="h-4 w-4" strokeWidth={2.5} />
            <span>Kembali ke Kelola Pengguna</span>
          </Link>
        </Button>

        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleResetPassword}
            className="bg-white flex items-center gap-1.5"
          >
            <KeyRound className="h-4 w-4" strokeWidth={2.5} />
            <span>Reset Sandi</span>
          </Button>

          {user.status === "active" ? (
            <Button
              variant="destructive"
              size="sm"
              onClick={handleToggleSuspend}
              className="flex items-center gap-1.5"
            >
              <UserX className="h-4 w-4" strokeWidth={2.5} />
              <span>Suspend Akun</span>
            </Button>
          ) : (
            <Button
              variant="default"
              size="sm"
              onClick={handleToggleSuspend}
              className="flex items-center gap-1.5"
            >
              <UserCheck className="h-4 w-4" strokeWidth={2.5} />
              <span>Aktifkan Akun</span>
            </Button>
          )}
        </div>
      </div>

      {/* User Profile Card */}
      <Card className="border-[3px] border-black shadow-brutal bg-white p-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 border-2 border-black bg-primary text-black flex items-center justify-center font-heading font-black text-2xl shadow-brutal-sm shrink-0">
              {user.name.slice(0, 2).toUpperCase()}
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-2xl font-heading font-black text-black">
                  {user.name}
                </h1>
                {user.role === "super_admin" ? (
                  <Badge variant="destructive" className="font-mono text-xs">SUPER ADMIN</Badge>
                ) : (
                  <Badge variant="outline" className="font-mono text-xs bg-cream">MEMBER</Badge>
                )}
                {user.status === "active" ? (
                  <Badge variant="default">Status Aktif</Badge>
                ) : (
                  <Badge variant="destructive">Status Disuspend</Badge>
                )}
              </div>
              <p className="font-mono text-xs text-neutral-600 flex items-center gap-1">
                <Mail className="h-3.5 w-3.5" />
                <span>{user.email}</span>
              </p>
              <p className="text-xs font-semibold text-neutral-700 max-w-xl pt-1">
                {user.bio || "Tidak ada bio yang dicantumkan oleh pengguna."}
              </p>
            </div>
          </div>

          {/* Quick Stats Block */}
          <div className="flex items-center gap-4 bg-cream border-2 border-black p-4 shadow-brutal-sm w-full md:w-auto justify-around">
            <div className="text-center px-2">
              <span className="text-[10px] font-mono font-bold uppercase text-neutral-600 block">
                Total Tautan
              </span>
              <span className="font-mono text-xl font-black text-black">
                {user.linksCount}
              </span>
            </div>
            <div className="w-px h-8 bg-black/20" />
            <div className="text-center px-2">
              <span className="text-[10px] font-mono font-bold uppercase text-neutral-600 block">
                Total Klik
              </span>
              <span className="font-mono text-xl font-black text-primary-dark">
                {user.totalClicks.toLocaleString("id-ID")}
              </span>
            </div>
            <div className="w-px h-8 bg-black/20" />
            <div className="text-center px-2">
              <span className="text-[10px] font-mono font-bold uppercase text-neutral-600 block">
                Terakhir Login
              </span>
              <span className="font-mono text-xs font-black text-neutral-800">
                {user.lastLoginAt}
              </span>
            </div>
          </div>
        </div>
      </Card>

      {/* Meta Information Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white border-2 border-black p-4 shadow-brutal-sm flex items-center gap-3">
          <Calendar className="h-5 w-5 text-neutral-600 shrink-0" strokeWidth={2.5} />
          <div>
            <span className="text-[11px] font-mono font-bold uppercase text-neutral-500 block">Tanggal Bergabung</span>
            <p className="text-xs font-bold text-black font-mono">{user.joinedAt}</p>
          </div>
        </div>

        <div className="bg-white border-2 border-black p-4 shadow-brutal-sm flex items-center gap-3">
          <Phone className="h-5 w-5 text-neutral-600 shrink-0" strokeWidth={2.5} />
          <div>
            <span className="text-[11px] font-mono font-bold uppercase text-neutral-500 block">Nomor Telepon</span>
            <p className="text-xs font-bold text-black font-mono">{user.phone || "-"}</p>
          </div>
        </div>

        <div className="bg-white border-2 border-black p-4 shadow-brutal-sm flex items-center gap-3">
          <Clock className="h-5 w-5 text-neutral-600 shrink-0" strokeWidth={2.5} />
          <div>
            <span className="text-[11px] font-mono font-bold uppercase text-neutral-500 block">Aktivitas Terakhir</span>
            <p className="text-xs font-bold text-black font-mono">{user.lastLoginAt}</p>
          </div>
        </div>
      </div>

      {/* Tautan yang Dimiliki Pengguna */}
      <Card className="border-[3px] border-black shadow-brutal bg-white overflow-hidden">
        <CardHeader className="border-b-2 border-black bg-cream p-4 flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-base font-heading font-black">
              Koleksi Tautan Pengguna ({userLinks.length})
            </CardTitle>
            <CardDescription className="text-xs font-semibold text-neutral-700">
              Daftar tautan pendek yang dibuat dan dikelola oleh akun {user.name}
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="p-0 overflow-x-auto">
          {userLinks.length === 0 ? (
            <div className="p-8 text-center text-neutral-600 text-xs font-bold">
              Pengguna ini belum pernah memendekkan tautan di platform Pendek-In.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="border-b-2 border-black bg-neutral-100 font-bold text-xs">
                  <TableHead className="font-black text-black">Tautan Pendek</TableHead>
                  <TableHead className="font-black text-black">Target URL</TableHead>
                  <TableHead className="font-black text-black text-center">Status</TableHead>
                  <TableHead className="font-black text-black text-center">Klik</TableHead>
                  <TableHead className="font-black text-black">Dibuat</TableHead>
                  <TableHead className="font-black text-black text-right">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className="divide-y-2 divide-black font-semibold text-xs">
                {userLinks.map((link) => (
                  <TableRow key={link.id} className="hover:bg-cream/40">
                    <TableCell className="py-3">
                      <Link href={`/admin/tautan/${link.id}`} className="hover:underline">
                        <p className="font-mono font-black text-black">/{link.slug}</p>
                        <p className="text-[11px] text-neutral-600 truncate max-w-[200px]">{link.title}</p>
                      </Link>
                    </TableCell>
                    <TableCell className="py-3 font-mono text-[11px] text-neutral-700 truncate max-w-[240px]">
                      {link.originalUrl}
                    </TableCell>
                    <TableCell className="py-3 text-center">
                      {link.status === "active" && <Badge variant="default" className="text-[10px]">Aktif</Badge>}
                      {link.status === "blocked" && <Badge variant="destructive" className="text-[10px]">Diblokir</Badge>}
                      {link.status === "expired" && <Badge variant="warning" className="text-[10px]">Kedaluwarsa</Badge>}
                    </TableCell>
                    <TableCell className="py-3 text-center font-mono font-black text-black">
                      {link.clicks}
                    </TableCell>
                    <TableCell className="py-3 font-mono text-[11px] text-neutral-600">
                      {link.createdAt}
                    </TableCell>
                    <TableCell className="py-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleCopyLink(link.shortUrl)}
                          className="h-8 text-[11px] bg-white"
                        >
                          <Copy className="h-3 w-3 mr-1" />
                          Salin
                        </Button>
                        <Button variant="default" size="sm" asChild className="h-8 text-[11px]">
                          <Link href={`/admin/tautan/${link.id}`}>
                            Detail
                          </Link>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
