"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Search,
  MoreVertical,
  UserCheck,
  UserX,
  KeyRound,
  Eye,
  Filter,
  ShieldAlert,
} from "lucide-react";
import {
  getAdminUsers,
  updateUserStatus,
  resetUserPasswordAdmin,
  type AdminUserItem,
} from "@/actions/admin";

export default function KelolaPenggunaPage() {
  const [users, setUsers] = useState<AdminUserItem[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [suspendTarget, setSuspendTarget] = useState<AdminUserItem | null>(null);
  const [suspendReason, setSuspendReason] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);

  const fetchUsers = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await getAdminUsers({
        search: searchQuery.trim() || undefined,
        role: roleFilter !== "all" ? roleFilter : undefined,
        status: statusFilter !== "all" ? statusFilter : undefined,
      });

      if (res.success && res.data) {
        setUsers(res.data);
      }
    } catch {
      toast.error("Gagal memuat daftar pengguna");
    } finally {
      setIsLoading(false);
    }
  }, [searchQuery, roleFilter, statusFilter]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchUsers();
    }, 200);

    return () => clearTimeout(timer);
  }, [fetchUsers]);

  const handleToggleStatus = async (user: AdminUserItem) => {
    const newStatus = user.status === "active" ? "suspended" : "active";
    if (newStatus === "suspended") {
      setSuspendTarget(user);
      return;
    }

    try {
      const res = await updateUserStatus(user.id, "active", "Diaktifkan kembali oleh admin");
      if (res.success) {
        setUsers((prev) => prev.map((u) => (u.id === user.id ? { ...u, status: "active" } : u)));
        toast.success("Pengguna Diaktifkan Kembali!", {
          description: `Akses akun ${user.fullName} telah dipulihkan.`,
        });
      }
    } catch {
      toast.error("Gagal mengaktifkan pengguna");
    }
  };

  const handleConfirmSuspend = async () => {
    if (!suspendTarget) return;
    setIsProcessing(true);
    try {
      const res = await updateUserStatus(
        suspendTarget.id,
        "suspended",
        suspendReason || "Pelanggaran pedoman layanan"
      );

      if (res.success) {
        setUsers((prev) =>
          prev.map((u) => (u.id === suspendTarget.id ? { ...u, status: "suspended" } : u))
        );
        toast.error("Pengguna Berhasil Ditangguhkan", {
          description: `Akun ${suspendTarget.fullName} telah dinonaktifkan.`,
        });
      } else {
        toast.error(res.error || "Gagal menangguhkan akun");
      }
    } catch {
      toast.error("Terjadi kesalahan sistem");
    } finally {
      setIsProcessing(false);
      setSuspendTarget(null);
      setSuspendReason("");
    }
  };

  const handleResetPassword = async (user: AdminUserItem) => {
    try {
      const res = await resetUserPasswordAdmin(user.id);
      if (res.success) {
        toast.info("Tautan Reset Sandi Dikirim", {
          description: `Instruksi pembuatan sandi baru telah dikirimkan ke ${user.email}.`,
        });
      }
    } catch {
      toast.error("Gagal mengirim reset sandi");
    }
  };

  return (
    <div className="space-y-8">
      {/* Header Halaman */}
      <div className="border-[3px] border-black bg-white p-6 shadow-brutal flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-black font-heading text-black">
              Manajemen Pengguna
            </h1>
            <Badge variant="default" className="text-xs font-mono">
              {users.length} Terdaftar
            </Badge>
          </div>
          <p className="text-sm font-semibold text-neutral-600 mt-1 max-w-xl">
            Pantau seluruh akun terdaftar, atur role Super Admin, audit aktivitas, serta tindak akun yang melanggar ketentuan.
          </p>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <Card className="border-[3px] border-black shadow-brutal bg-white">
        <div className="p-4 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          {/* Search Box */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-500" strokeWidth={2.5} />
            <Input
              placeholder="Cari nama pengguna atau alamat email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 bg-cream/40 h-10 border-2 border-black"
            />
          </div>

          <div className="flex items-center gap-2.5 flex-wrap sm:flex-nowrap">
            {/* Filter Role */}
            <div className="flex items-center gap-1.5 border-2 border-black bg-white px-2.5 py-1.5 shadow-brutal-sm">
              <Filter className="h-3.5 w-3.5 text-black" strokeWidth={2.5} />
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="bg-transparent text-xs font-mono font-bold text-black focus:outline-none cursor-pointer"
              >
                <option value="all">Semua Role</option>
                <option value="member">Member</option>
                <option value="super_admin">Super Admin</option>
              </select>
            </div>

            {/* Filter Status */}
            <div className="flex items-center gap-1.5 border-2 border-black bg-white px-2.5 py-1.5 shadow-brutal-sm">
              <ShieldAlert className="h-3.5 w-3.5 text-black" strokeWidth={2.5} />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-transparent text-xs font-mono font-bold text-black focus:outline-none cursor-pointer"
              >
                <option value="all">Semua Status</option>
                <option value="active">Aktif</option>
                <option value="suspended">Ditangguhkan (Banned)</option>
              </select>
            </div>
          </div>
        </div>
      </Card>

      {/* Tabel Pengguna */}
      <Card className="border-[3px] border-black shadow-brutal bg-white overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-b-2 border-black bg-cream">
                <TableHead className="w-[30%] font-heading font-black text-black">Profil Pengguna</TableHead>
                <TableHead className="w-[12%] font-heading font-black text-black">Hak Akses</TableHead>
                <TableHead className="w-[12%] font-heading font-black text-black">Status</TableHead>
                <TableHead className="w-[12%] font-heading font-black text-black text-right">Tautan</TableHead>
                <TableHead className="w-[14%] font-heading font-black text-black text-right">Total Klik</TableHead>
                <TableHead className="w-[20%] font-heading font-black text-black text-center">Tindakan</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 font-mono text-sm text-neutral-500">
                    Memuat data pengguna dari sistem...
                  </TableCell>
                </TableRow>
              ) : users.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-10 font-mono text-sm text-neutral-500">
                    Tidak ada pengguna yang memenuhi filter pencarian.
                  </TableCell>
                </TableRow>
              ) : (
                users.map((user) => (
                  <TableRow key={user.id} className="border-b border-neutral-200 hover:bg-cream/30">
                    <TableCell className="font-sans">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 border-2 border-black bg-primary flex items-center justify-center font-heading font-black text-black shadow-brutal-sm shrink-0">
                          {user.fullName.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div className="font-heading font-black text-sm text-black">
                            {user.fullName}
                          </div>
                          <div className="font-mono text-xs text-neutral-500">
                            {user.email}
                          </div>
                        </div>
                      </div>
                    </TableCell>

                    <TableCell>
                      <Badge
                        variant={user.role === "super_admin" ? "destructive" : "secondary"}
                        className="font-mono text-[10px]"
                      >
                        {user.role}
                      </Badge>
                    </TableCell>

                    <TableCell>
                      <span className={`inline-flex items-center px-2 py-0.5 text-xs font-mono font-bold border-2 ${
                        user.status === "active"
                          ? "bg-primary/20 text-black border-black shadow-brutal-sm"
                          : "bg-destructive/20 text-destructive border-black shadow-brutal-sm"
                      }`}>
                        {user.status === "active" ? "Aktif" : "Banned"}
                      </span>
                    </TableCell>

                    <TableCell className="text-right font-mono font-black text-sm">
                      {user.linksCount}
                    </TableCell>

                    <TableCell className="text-right font-mono font-black text-sm text-primary-dark">
                      {user.totalClicks.toLocaleString("id-ID")}
                    </TableCell>

                    <TableCell>
                      <div className="flex items-center justify-center gap-1.5">
                        <Button
                          size="iconSm"
                          variant="outline"
                          asChild
                          title="Lihat Profil Lengkap"
                        >
                          <Link href={`/admin/pengguna/${user.id}`}>
                            <Eye className="h-3.5 w-3.5" strokeWidth={2.5} />
                          </Link>
                        </Button>

                        <Button
                          size="iconSm"
                          variant={user.status === "active" ? "outline" : "default"}
                          onClick={() => handleToggleStatus(user)}
                          title={user.status === "active" ? "Tangguhkan / Ban User" : "Aktifkan Kembali"}
                        >
                          {user.status === "active" ? (
                            <UserX className="h-3.5 w-3.5 text-destructive" strokeWidth={2.5} />
                          ) : (
                            <UserCheck className="h-3.5 w-3.5 text-black" strokeWidth={2.5} />
                          )}
                        </Button>

                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button size="iconSm" variant="outline">
                              <MoreVertical className="h-3.5 w-3.5" strokeWidth={2.5} />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-52">
                            <DropdownMenuLabel>Aksi Super Admin</DropdownMenuLabel>
                            <DropdownMenuItem asChild>
                              <Link href={`/admin/pengguna/${user.id}`} className="cursor-pointer">
                                <Eye className="mr-2 h-4 w-4" strokeWidth={2.5} />
                                <span>Detail &amp; Audit Log</span>
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleResetPassword(user)}>
                              <KeyRound className="mr-2 h-4 w-4" strokeWidth={2.5} />
                              <span>Kirim Reset Password</span>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            {user.status === "active" ? (
                              <DropdownMenuItem
                                onClick={() => setSuspendTarget(user)}
                                className="text-destructive focus:bg-destructive/10 cursor-pointer"
                              >
                                <UserX className="mr-2 h-4 w-4" strokeWidth={2.5} />
                                <span>Tangguhkan (Ban)</span>
                              </DropdownMenuItem>
                            ) : (
                              <DropdownMenuItem
                                onClick={() => handleToggleStatus(user)}
                                className="text-primary-dark focus:bg-primary/10 cursor-pointer"
                              >
                                <UserCheck className="mr-2 h-4 w-4" strokeWidth={2.5} />
                                <span>Pulihkan Akun</span>
                              </DropdownMenuItem>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </Card>

      {/* Dialog Konfirmasi Penangguhan Akun */}
      <Dialog open={!!suspendTarget} onOpenChange={(open) => !open && setSuspendTarget(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-destructive flex items-center gap-2">
              <ShieldAlert className="h-5 w-5" strokeWidth={2.5} />
              Tangguhkan Akun Pengguna?
            </DialogTitle>
            <DialogDescription className="font-semibold text-black">
              Apakah Anda yakin ingin menonaktifkan akun &ldquo;{suspendTarget?.fullName}&rdquo; ({suspendTarget?.email})?
              Pengguna tidak akan bisa login dan seluruh tautan publik miliknya akan dialihkan ke halaman pemblokiran.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-2 py-2">
            <label className="text-xs font-black uppercase tracking-wider text-black">
              Alasan Penangguhan (Tercatat di Audit Log):
            </label>
            <Input
              placeholder="Contoh: Spam tautan affiliate terlarang / laporan phishing..."
              value={suspendReason}
              onChange={(e) => setSuspendReason(e.target.value)}
              className="bg-white border-2 border-black"
            />
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setSuspendTarget(null)} disabled={isProcessing}>
              Batal
            </Button>
            <Button variant="destructive" onClick={handleConfirmSuspend} disabled={isProcessing}>
              {isProcessing ? "Menangguhkan..." : "Ya, Tangguhkan Akun"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
