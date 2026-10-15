"use client";

import { useState, useEffect } from "react";
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
  Copy,
  UserCheck,
  UserX,
  KeyRound,
  ExternalLink,
} from "lucide-react";
import {
  getAdminUsers,
  getAdminLinks,
  updateUserStatus,
  resetUserPasswordAdmin,
  type AdminUserItem,
  type AdminLinkItem,
} from "@/actions/admin";

export default function DetailPenggunaPage() {
  const params = useParams();
  const rawId = (params?.id as string) || "usr-001";

  const [user, setUser] = useState<AdminUserItem>({
    id: rawId,
    email: "user@pendek.in",
    fullName: "Pengguna",
    avatarUrl: null,
    role: "member",
    status: "active",
    linksCount: 0,
    totalClicks: 0,
    createdAt: new Date().toISOString(),
  });

  const [userLinks, setUserLinks] = useState<AdminLinkItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);

    Promise.all([
      getAdminUsers({ limit: 100 }),
      getAdminLinks({ limit: 100 }),
    ])
      .then(([usersRes, linksRes]) => {
        if (!isMounted) return;

        if (usersRes.success && usersRes.data) {
          const found = usersRes.data.find((u) => u.id === rawId) || usersRes.data[0];
          if (found) {
            setUser(found);
            if (linksRes.success && linksRes.data) {
              const matchedLinks = linksRes.data.filter(
                (l) => l.userId === found.id || l.authorEmail === found.email
              );
              setUserLinks(matchedLinks);
            }
          }
        }
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [rawId]);

  const handleToggleSuspend = async () => {
    const newStatus = user.status === "active" ? "suspended" : "active";
    try {
      const res = await updateUserStatus(
        user.id,
        newStatus,
        newStatus === "suspended" ? "Penangguhan via halaman detail admin" : "Pemulihan akses admin"
      );

      if (res.success) {
        setUser({ ...user, status: newStatus });
        if (newStatus === "suspended") {
          toast.warning("Akun Ditangguhkan", {
            description: `Akun ${user.fullName} telah disuspend. Seluruh tautan pengguna tidak dapat diakses publik.`,
          });
        } else {
          toast.success("Akun Diaktifkan Kembali", {
            description: `Hak akses akun ${user.fullName} berhasil dipulihkan secara normal.`,
          });
        }
      }
    } catch {
      toast.error("Gagal mengubah status pengguna");
    }
  };

  const handleResetPassword = async () => {
    try {
      const res = await resetUserPasswordAdmin(user.id);
      if (res.success) {
        toast.info("Tautan Reset Sandi Dikirim", {
          description: `Email verifikasi reset kata sandi telah dikirimkan ke ${user.email}.`,
        });
      }
    } catch {
      toast.error("Gagal mengirim reset sandi");
    }
  };

  const handleCopyLink = (url: string) => {
    navigator.clipboard.writeText(url);
    toast.success("Tautan Disalin ke Clipboard! 📋");
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
              <span>Tangguhkan Akun</span>
            </Button>
          ) : (
            <Button
              variant="default"
              size="sm"
              onClick={handleToggleSuspend}
              className="flex items-center gap-1.5"
            >
              <UserCheck className="h-4 w-4 text-black" strokeWidth={2.5} />
              <span>Pulihkan Akun</span>
            </Button>
          )}
        </div>
      </div>

      {/* Profil Card Header */}
      <Card className="border-[3px] border-black shadow-brutal bg-white p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 border-[3px] border-black bg-primary flex items-center justify-center font-heading font-black text-2xl text-black shadow-brutal-sm shrink-0">
              {user.fullName.charAt(0).toUpperCase()}
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <h1 className="text-2xl font-black font-heading text-black">{user.fullName}</h1>
                <Badge variant={user.role === "super_admin" ? "destructive" : "secondary"}>
                  {user.role}
                </Badge>
              </div>
              <div className="flex items-center gap-2 text-xs font-mono text-neutral-600 mt-1">
                <Mail className="h-3.5 w-3.5" />
                <span>{user.email}</span>
                <span>&bull;</span>
                <span>ID: {user.id}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span
              className={`inline-flex items-center px-3 py-1 font-mono text-xs font-bold border-2 ${
                user.status === "active"
                  ? "bg-primary/20 text-black border-black shadow-brutal-sm"
                  : "bg-destructive/20 text-destructive border-black shadow-brutal-sm font-black"
              }`}
            >
              Status: {user.status === "active" ? "Aktif 🟢" : "Ditangguhkan (Banned) 🔴"}
            </span>
          </div>
        </div>
      </Card>

      {/* Daftar Tautan Pengguna */}
      <Card className="border-[3px] border-black shadow-brutal bg-white overflow-hidden">
        <CardHeader className="border-b-2 border-black bg-cream p-4">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-base font-black">
                Daftar Tautan Milik Pengguna ({userLinks.length})
              </CardTitle>
              <CardDescription className="text-xs font-semibold text-neutral-700">
                Seluruh tautan yang dibuat oleh akun {user.fullName}
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="border-b-2 border-black bg-neutral-100">
                <TableHead className="w-[40%] font-heading font-black text-black">Tautan &amp; Target</TableHead>
                <TableHead className="w-[15%] font-heading font-black text-black">Status</TableHead>
                <TableHead className="w-[15%] font-heading font-black text-black text-right">Total Klik</TableHead>
                <TableHead className="w-[15%] font-heading font-black text-black">Tanggal Buat</TableHead>
                <TableHead className="w-[15%] font-heading font-black text-black text-center">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 font-mono text-sm text-neutral-500">
                    Memuat tautan pengguna...
                  </TableCell>
                </TableRow>
              ) : userLinks.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 font-mono text-sm text-neutral-500">
                    Pengguna ini belum membuat tautan apapun.
                  </TableCell>
                </TableRow>
              ) : (
                userLinks.map((link) => (
                  <TableRow key={link.id} className="border-b border-neutral-200 hover:bg-cream/30">
                    <TableCell className="font-sans">
                      <div className="font-heading font-black text-sm text-black line-clamp-1">
                        {link.title}
                      </div>
                      <div className="flex items-center gap-2 mt-0.5 text-xs font-mono">
                        <span className="text-primary-dark font-black">{link.shortUrl}</span>
                        <span className="text-neutral-400">&bull;</span>
                        <span className="text-neutral-500 truncate max-w-[200px]">
                          {link.originalUrl}
                        </span>
                      </div>
                    </TableCell>

                    <TableCell>
                      <span className={`inline-flex items-center px-2 py-0.5 text-xs font-mono font-bold border-2 ${
                        link.status === "active"
                          ? "bg-primary/20 text-black border-black shadow-brutal-sm"
                          : link.status === "blocked"
                          ? "bg-destructive text-white border-black shadow-brutal-sm"
                          : "bg-warning/20 text-black border-black shadow-brutal-sm"
                      }`}>
                        {link.status === "active" ? "Aktif" : link.status === "blocked" ? "Diblokir" : "Kadaluarsa"}
                      </span>
                    </TableCell>

                    <TableCell className="text-right font-mono font-black text-sm text-primary-dark">
                      {link.clickCount.toLocaleString("id-ID")}
                    </TableCell>

                    <TableCell className="font-mono text-xs text-neutral-600 font-bold">
                      {new Date(link.createdAt).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </TableCell>

                    <TableCell className="text-center">
                      <div className="flex items-center justify-center gap-2">
                        <Button
                          size="iconSm"
                          variant="outline"
                          onClick={() => handleCopyLink(link.shortUrl)}
                          title="Salin Tautan"
                        >
                          <Copy className="h-3.5 w-3.5" strokeWidth={2.5} />
                        </Button>
                        <Button
                          size="iconSm"
                          variant="secondary"
                          asChild
                          title="Detail Tautan"
                        >
                          <Link href={`/admin/tautan/${link.id}`}>
                            <ExternalLink className="h-3.5 w-3.5" strokeWidth={2.5} />
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
