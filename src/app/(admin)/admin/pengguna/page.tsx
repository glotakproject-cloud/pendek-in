"use client";

import { useState } from "react";
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
import { DUMMY_ADMIN_USERS, type DummyAdminUser } from "@/lib/dummy-data";

export default function KelolaPenggunaPage() {
  const [users, setUsers] = useState<DummyAdminUser[]>(DUMMY_ADMIN_USERS);
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [suspendTarget, setSuspendTarget] = useState<DummyAdminUser | null>(null);
  const [suspendReason, setSuspendReason] = useState("");

  // Filtering Logic
  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === "all" || user.role === roleFilter;
    const matchesStatus = statusFilter === "all" || user.status === statusFilter;
    return matchesSearch && matchesRole && matchesStatus;
  });

  const handleToggleStatus = (userId: string, currentStatus: "active" | "suspended") => {
    const newStatus = currentStatus === "active" ? "suspended" : "active";
    setUsers(users.map((u) => (u.id === userId ? { ...u, status: newStatus } : u)));

    if (newStatus === "suspended") {
      toast.warning("Pengguna Ditangguhkan!", {
        description: "Akses login dan seluruh tautan pengguna telah dinonaktifkan sementara.",
      });
    } else {
      toast.success("Pengguna Diaktifkan Kembali!", {
        description: "Akses akun telah dipulihkan dan dapat menggunakan layanan kembali.",
      });
    }
  };

  const handleConfirmSuspend = () => {
    if (!suspendTarget) return;
    setUsers(
      users.map((u) =>
        u.id === suspendTarget.id ? { ...u, status: "suspended" } : u
      )
    );
    toast.error("Pengguna Berhasil Ditangguhkan", {
      description: `Akun ${suspendTarget.name} telah disuspend dengan alasan: ${suspendReason || "Pelanggaran pedoman layanan"}.`,
    });
    setSuspendTarget(null);
    setSuspendReason("");
  };

  const handleResetPassword = (user: DummyAdminUser) => {
    toast.info("Tautan Reset Sandi Dikirim", {
      description: `Email instruksi pembuatan sandi baru telah dikirimkan ke ${user.email}.`,
    });
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="border-[3px] border-black bg-white p-6 shadow-brutal flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-black font-heading text-black">
              Kelola Pengguna
            </h1>
            <Badge variant="outline" className="font-mono text-xs font-black bg-cream">
              {users.length} Akun Terdaftar
            </Badge>
          </div>
          <p className="text-sm font-semibold text-neutral-700 mt-1">
            Kelola hak akses pengguna, pantau aktivitas pembuatan tautan, dan moderasi akun yang terindikasi melanggar aturan.
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <Card className="border-[3px] border-black shadow-brutal bg-white p-4">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-600" strokeWidth={2.5} />
            <Input
              type="text"
              placeholder="Cari berdasarkan nama atau alamat email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 font-medium text-sm border-2 border-black bg-white h-11"
            />
          </div>

          {/* Role Filter */}
          <div className="flex items-center gap-2 flex-wrap">
            <div className="flex items-center gap-1.5 bg-cream border-2 border-black px-3 py-1.5 h-11">
              <Filter className="h-4 w-4 text-black" strokeWidth={2.5} />
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="bg-transparent text-xs font-black text-black outline-none cursor-pointer"
              >
                <option value="all">Semua Role</option>
                <option value="member">Hanya Member</option>
                <option value="super_admin">Super Admin</option>
              </select>
            </div>

            {/* Status Filter */}
            <div className="flex items-center gap-1.5 bg-cream border-2 border-black px-3 py-1.5 h-11">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-transparent text-xs font-black text-black outline-none cursor-pointer"
              >
                <option value="all">Semua Status</option>
                <option value="active">Status Aktif</option>
                <option value="suspended">Status Disuspend</option>
              </select>
            </div>
          </div>
        </div>
      </Card>

      {/* Main Table */}
      <Card className="border-[3px] border-black shadow-brutal bg-white overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-b-2 border-black bg-primary">
                <TableHead className="font-heading font-black text-black">Profil Pengguna</TableHead>
                <TableHead className="font-heading font-black text-black">Role</TableHead>
                <TableHead className="font-heading font-black text-black">Status</TableHead>
                <TableHead className="font-heading font-black text-black text-center">Tautan</TableHead>
                <TableHead className="font-heading font-black text-black text-center">Total Klik</TableHead>
                <TableHead className="font-heading font-black text-black">Bergabung</TableHead>
                <TableHead className="font-heading font-black text-black text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="divide-y-2 divide-black font-semibold text-xs">
              {filteredUsers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-12 text-neutral-600 font-bold">
                    Tidak ada pengguna yang sesuai dengan kriteria pencarian atau filter.
                  </TableCell>
                </TableRow>
              ) : (
                filteredUsers.map((user) => (
                  <TableRow key={user.id} className="hover:bg-cream/40">
                    {/* User Identity */}
                    <TableCell className="py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 border-2 border-black bg-cream flex items-center justify-center font-heading font-black text-sm shrink-0 shadow-brutal-sm">
                          {user.name.slice(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <Link
                            href={`/admin/pengguna/${user.id}`}
                            className="font-black text-sm text-black hover:underline hover:text-primary-dark"
                          >
                            {user.name}
                          </Link>
                          <p className="font-mono text-[11px] text-neutral-600">{user.email}</p>
                        </div>
                      </div>
                    </TableCell>

                    {/* Role */}
                    <TableCell className="py-4">
                      {user.role === "super_admin" ? (
                        <Badge variant="destructive" className="font-mono text-[10px] uppercase font-black">
                          SUPER ADMIN
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="font-mono text-[10px] uppercase font-bold bg-white">
                          MEMBER
                        </Badge>
                      )}
                    </TableCell>

                    {/* Status */}
                    <TableCell className="py-4">
                      {user.status === "active" ? (
                        <Badge variant="default" className="text-[11px]">
                          Aktif
                        </Badge>
                      ) : (
                        <Badge variant="destructive" className="text-[11px]">
                          Disuspend
                        </Badge>
                      )}
                    </TableCell>

                    {/* Links Count */}
                    <TableCell className="py-4 text-center font-mono font-black text-sm text-black">
                      {user.linksCount}
                    </TableCell>

                    {/* Total Clicks */}
                    <TableCell className="py-4 text-center font-mono font-black text-sm text-black">
                      {user.totalClicks.toLocaleString("id-ID")}
                    </TableCell>

                    {/* Joined At */}
                    <TableCell className="py-4 font-mono text-[11px] text-neutral-700">
                      {user.joinedAt}
                    </TableCell>

                    {/* Actions Dropdown */}
                    <TableCell className="py-4 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="outline" size="icon" className="h-9 w-9 bg-white">
                            <MoreVertical className="h-4 w-4" strokeWidth={2.5} />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-52 border-2 border-black shadow-brutal bg-white">
                          <DropdownMenuLabel className="font-heading font-black text-xs uppercase">
                            Aksi Pengguna
                          </DropdownMenuLabel>
                          <DropdownMenuSeparator className="bg-black" />

                          <DropdownMenuItem asChild className="font-semibold text-xs cursor-pointer">
                            <Link href={`/admin/pengguna/${user.id}`} className="flex items-center gap-2">
                              <Eye className="h-3.5 w-3.5" />
                              <span>Lihat Detail &amp; Tautan</span>
                            </Link>
                          </DropdownMenuItem>

                          <DropdownMenuItem
                            onClick={() => handleResetPassword(user)}
                            className="font-semibold text-xs cursor-pointer flex items-center gap-2"
                          >
                            <KeyRound className="h-3.5 w-3.5" />
                            <span>Kirim Reset Sandi</span>
                          </DropdownMenuItem>

                          <DropdownMenuSeparator className="bg-black" />

                          {user.status === "active" ? (
                            <DropdownMenuItem
                              onClick={() => {
                                setSuspendTarget(user);
                                setSuspendReason("");
                              }}
                              className="font-semibold text-xs cursor-pointer text-destructive focus:text-destructive flex items-center gap-2"
                            >
                              <UserX className="h-3.5 w-3.5" />
                              <span>Suspend Pengguna</span>
                            </DropdownMenuItem>
                          ) : (
                            <DropdownMenuItem
                              onClick={() => handleToggleStatus(user.id, "suspended")}
                              className="font-semibold text-xs cursor-pointer text-primary-dark focus:text-primary-dark flex items-center gap-2"
                            >
                              <UserCheck className="h-3.5 w-3.5" />
                              <span>Aktifkan Akun Kembali</span>
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </Card>

      {/* Suspend Confirmation Modal */}
      <Dialog open={!!suspendTarget} onOpenChange={(open) => !open && setSuspendTarget(null)}>
        <DialogContent className="border-[3px] border-black bg-white shadow-brutal-xl sm:max-w-md">
          <DialogHeader className="space-y-2">
            <div className="w-12 h-12 bg-destructive text-white border-2 border-black flex items-center justify-center shadow-brutal-sm">
              <ShieldAlert className="h-6 w-6" strokeWidth={2.5} />
            </div>
            <DialogTitle className="font-heading font-black text-xl text-black">
              Konfirmasi Suspend Pengguna
            </DialogTitle>
            <DialogDescription className="text-xs font-semibold text-neutral-700">
              Menangguhkan akun <strong className="text-black">{suspendTarget?.name}</strong> ({suspendTarget?.email}) akan memblokir seluruh sesi login dan menonaktifkan seluruh tautan publik miliknya.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-2 py-2">
            <label className="text-xs font-black uppercase tracking-wider text-black">
              Alasan Penangguhan (Wajib Dicatat ke Audit Log)
            </label>
            <Input
              type="text"
              placeholder="Contoh: Pembuatan link phishing undian palsu bermodus SMS..."
              value={suspendReason}
              onChange={(e) => setSuspendReason(e.target.value)}
              className="border-2 border-black bg-white text-xs font-semibold"
            />
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setSuspendTarget(null)} className="bg-white">
              Batal
            </Button>
            <Button variant="destructive" onClick={handleConfirmSuspend}>
              Suspend Akun Sekarang
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
