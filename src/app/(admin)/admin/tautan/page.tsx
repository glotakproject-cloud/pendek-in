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
  Copy,
  ExternalLink,
  Ban,
  CheckCircle2,
  Trash2,
  Filter,
  Eye,
  ShieldAlert,
  AlertTriangle,
} from "lucide-react";
import {
  getAdminLinks,
  updateLinkStatusAdmin,
  deleteLinkAdmin,
  type AdminLinkItem,
} from "@/actions/admin";

export default function ModerasiTautanPage() {
  const [links, setLinks] = useState<AdminLinkItem[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  // Modal Block State
  const [blockTarget, setBlockTarget] = useState<AdminLinkItem | null>(null);
  const [blockReason, setBlockReason] = useState("");

  // Modal Delete State
  const [deleteTarget, setDeleteTarget] = useState<AdminLinkItem | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);

  const fetchLinks = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await getAdminLinks({
        search: searchQuery.trim() || undefined,
        status: statusFilter !== "all" ? statusFilter : undefined,
      });

      if (res.success && res.data) {
        setLinks(res.data);
      }
    } catch {
      toast.error("Gagal memuat daftar tautan");
    } finally {
      setIsLoading(false);
    }
  }, [searchQuery, statusFilter]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchLinks();
    }, 200);

    return () => clearTimeout(timer);
  }, [fetchLinks]);

  const handleCopy = (shortUrl: string) => {
    navigator.clipboard.writeText(shortUrl);
    toast.success("Tautan Disalin ke Clipboard! 📋");
  };

  const handleConfirmBlock = async () => {
    if (!blockTarget) return;
    setIsProcessing(true);
    try {
      const res = await updateLinkStatusAdmin(
        blockTarget.id,
        "blocked",
        blockReason || "Pelanggaran pedoman konten dan keamanan"
      );

      if (res.success) {
        setLinks((prev) =>
          prev.map((l) => (l.id === blockTarget.id ? { ...l, status: "blocked" } : l))
        );
        toast.error("Tautan Berhasil Diblokir!", {
          description: `Slug /s/${blockTarget.slug} kini dicekal dan pengunjung diarahkan ke halaman peringatan.`,
        });
      } else {
        toast.error(res.error || "Gagal memblokir tautan");
      }
    } catch {
      toast.error("Terjadi kesalahan sistem");
    } finally {
      setIsProcessing(false);
      setBlockTarget(null);
      setBlockReason("");
    }
  };

  const handleUnblock = async (link: AdminLinkItem) => {
    try {
      const res = await updateLinkStatusAdmin(link.id, "active", "Dibuka kembali oleh Super Admin");
      if (res.success) {
        setLinks((prev) =>
          prev.map((l) => (l.id === link.id ? { ...l, status: "active" } : l))
        );
        toast.success("Blokir Tautan Dibuka!", {
          description: `Tautan /s/${link.slug} telah dapat diakses kembali secara normal.`,
        });
      }
    } catch {
      toast.error("Gagal membuka blokir tautan");
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    setIsProcessing(true);
    try {
      const res = await deleteLinkAdmin(deleteTarget.id, "Dihapus permanen oleh Super Admin");
      if (res.success) {
        setLinks((prev) => prev.filter((l) => l.id !== deleteTarget.id));
        toast.success("Tautan Dihapus Permanen!", {
          description: `Tautan "${deleteTarget.title}" beserta histori analitiknya telah dihapus.`,
        });
      } else {
        toast.error(res.error || "Gagal menghapus tautan");
      }
    } catch {
      toast.error("Terjadi kesalahan sistem");
    } finally {
      setIsProcessing(false);
      setDeleteTarget(null);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header Halaman */}
      <div className="border-[3px] border-black bg-white p-6 shadow-brutal flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-black font-heading text-black">
              Moderasi Tautan Global
            </h1>
            <Badge variant="destructive" className="text-xs font-mono">
              {links.filter((l) => l.status === "blocked").length} Terblokir
            </Badge>
          </div>
          <p className="text-sm font-semibold text-neutral-600 mt-1 max-w-xl">
            Audit seluruh URL asli tujuan, pantau slug berbahaya (phishing, malware, scam), dan lakukan pemblokiran secara instan.
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
              placeholder="Cari slug, judul tautan, URL tujuan, atau nama pembuat..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 bg-cream/40 h-10 border-2 border-black"
            />
          </div>

          {/* Filter Status */}
          <div className="flex items-center gap-1.5 border-2 border-black bg-white px-2.5 py-1.5 shadow-brutal-sm">
            <Filter className="h-3.5 w-3.5 text-black" strokeWidth={2.5} />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-transparent text-xs font-mono font-bold text-black focus:outline-none cursor-pointer"
            >
              <option value="all">Semua Status</option>
              <option value="active">Aktif</option>
              <option value="blocked">Terblokir</option>
              <option value="expired">Kadaluarsa</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Tabel Tautan Moderasi */}
      <Card className="border-[3px] border-black shadow-brutal bg-white overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-b-2 border-black bg-cream">
                <TableHead className="w-[32%] font-heading font-black text-black">Tautan &amp; Target Asli</TableHead>
                <TableHead className="w-[18%] font-heading font-black text-black">Pembuat</TableHead>
                <TableHead className="w-[12%] font-heading font-black text-black">Status</TableHead>
                <TableHead className="w-[12%] font-heading font-black text-black text-right">Total Klik</TableHead>
                <TableHead className="w-[12%] font-heading font-black text-black">Tanggal Buat</TableHead>
                <TableHead className="w-[14%] font-heading font-black text-black text-center">Tindakan</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 font-mono text-sm text-neutral-500">
                    Memuat data tautan sistem...
                  </TableCell>
                </TableRow>
              ) : links.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-10 font-mono text-sm text-neutral-500">
                    Tidak ada tautan yang sesuai kriteria pencarian.
                  </TableCell>
                </TableRow>
              ) : (
                links.map((link) => (
                  <TableRow key={link.id} className="border-b border-neutral-200 hover:bg-cream/30">
                    <TableCell className="font-sans">
                      <div className="font-heading font-black text-sm text-black line-clamp-1">
                        {link.title}
                      </div>
                      <div className="flex items-center gap-2 mt-0.5 text-xs font-mono">
                        <span className="text-primary-dark font-black">{link.shortUrl}</span>
                        <button
                          type="button"
                          onClick={() => handleCopy(link.shortUrl)}
                          className="text-neutral-500 hover:text-black"
                          title="Salin Tautan"
                        >
                          <Copy className="h-3 w-3" strokeWidth={2.5} />
                        </button>
                        <span className="text-neutral-400">&bull;</span>
                        <a
                          href={link.originalUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-neutral-500 hover:text-black truncate max-w-[200px] flex items-center gap-0.5"
                        >
                          <span className="truncate">{link.originalUrl}</span>
                          <ExternalLink className="h-2.5 w-2.5 shrink-0" />
                        </a>
                      </div>
                    </TableCell>

                    <TableCell className="font-sans text-xs">
                      <div className="font-bold text-black">{link.authorName}</div>
                      <div className="font-mono text-[11px] text-neutral-500 truncate max-w-[140px]">
                        {link.authorEmail}
                      </div>
                    </TableCell>

                    <TableCell>
                      <span className={`inline-flex items-center px-2 py-0.5 text-xs font-mono font-bold border-2 ${
                        link.status === "active"
                          ? "bg-primary/20 text-black border-black shadow-brutal-sm"
                          : link.status === "blocked"
                          ? "bg-destructive text-white border-black shadow-brutal-sm font-black"
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

                    <TableCell>
                      <div className="flex items-center justify-center gap-1.5">
                        <Button
                          size="iconSm"
                          variant="outline"
                          asChild
                          title="Detail Tautan"
                        >
                          <Link href={`/admin/tautan/${link.id}`}>
                            <Eye className="h-3.5 w-3.5" strokeWidth={2.5} />
                          </Link>
                        </Button>

                        {link.status === "blocked" ? (
                          <Button
                            size="iconSm"
                            variant="default"
                            onClick={() => handleUnblock(link)}
                            title="Buka Blokir Tautan"
                          >
                            <CheckCircle2 className="h-3.5 w-3.5 text-black" strokeWidth={2.5} />
                          </Button>
                        ) : (
                          <Button
                            size="iconSm"
                            variant="outline"
                            onClick={() => setBlockTarget(link)}
                            title="Blokir Tautan"
                          >
                            <Ban className="h-3.5 w-3.5 text-destructive" strokeWidth={2.5} />
                          </Button>
                        )}

                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button size="iconSm" variant="outline">
                              <MoreVertical className="h-3.5 w-3.5" strokeWidth={2.5} />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-52">
                            <DropdownMenuLabel>Aksi Super Admin</DropdownMenuLabel>
                            <DropdownMenuItem asChild>
                              <Link href={`/admin/tautan/${link.id}`} className="cursor-pointer">
                                <Eye className="mr-2 h-4 w-4" strokeWidth={2.5} />
                                <span>Detail &amp; Analitik</span>
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleCopy(link.shortUrl)}>
                              <Copy className="mr-2 h-4 w-4" strokeWidth={2.5} />
                              <span>Salin Tautan</span>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            {link.status !== "blocked" && (
                              <DropdownMenuItem
                                onClick={() => setBlockTarget(link)}
                                className="text-destructive focus:bg-destructive/10 cursor-pointer"
                              >
                                <Ban className="mr-2 h-4 w-4" strokeWidth={2.5} />
                                <span>Blokir Tautan Ini</span>
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuItem
                              onClick={() => setDeleteTarget(link)}
                              className="text-destructive focus:bg-destructive/10 cursor-pointer"
                            >
                              <Trash2 className="mr-2 h-4 w-4" strokeWidth={2.5} />
                              <span>Hapus Permanen</span>
                            </DropdownMenuItem>
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

      {/* Dialog Konfirmasi Pemblokiran Tautan */}
      <Dialog open={!!blockTarget} onOpenChange={(open) => !open && setBlockTarget(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-destructive flex items-center gap-2">
              <ShieldAlert className="h-5 w-5" strokeWidth={2.5} />
              Blokir Tautan Publik Ini?
            </DialogTitle>
            <DialogDescription className="font-semibold text-black">
              Apakah Anda yakin ingin memblokir tautan &ldquo;{blockTarget?.title}&rdquo; (<strong>/s/{blockTarget?.slug}</strong>)?
              Pengunjung yang membuka tautan ini tidak akan lagi diarahkan ke URL asli dan sistem akan menampilkan peringatan keamanan.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-2 py-2">
            <label className="text-xs font-black uppercase tracking-wider text-black">
              Alasan Pemblokiran (Audit Trail):
            </label>
            <Input
              placeholder="Contoh: Terindikasi phishing perbankan / domain malware..."
              value={blockReason}
              onChange={(e) => setBlockReason(e.target.value)}
              className="bg-white border-2 border-black"
            />
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setBlockTarget(null)} disabled={isProcessing}>
              Batal
            </Button>
            <Button variant="destructive" onClick={handleConfirmBlock} disabled={isProcessing}>
              {isProcessing ? "Memblokir..." : "Ya, Blokir Tautan"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog Konfirmasi Hapus Tautan */}
      <Dialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-destructive flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" strokeWidth={2.5} />
              Hapus Tautan Secara Permanen?
            </DialogTitle>
            <DialogDescription className="font-semibold text-black">
              Tautan &ldquo;{deleteTarget?.title}&rdquo; beserta seluruh catatan riwayat klik akan dihapus selamanya dari database sistem.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteTarget(null)} disabled={isProcessing}>
              Batal
            </Button>
            <Button variant="destructive" onClick={handleConfirmDelete} disabled={isProcessing}>
              {isProcessing ? "Menghapus..." : "Ya, Hapus Permanen"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
