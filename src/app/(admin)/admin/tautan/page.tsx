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
import { DUMMY_ADMIN_LINKS, type DummyAdminLink } from "@/lib/dummy-data";

export default function ModerasiTautanPage() {
  const [links, setLinks] = useState<DummyAdminLink[]>(DUMMY_ADMIN_LINKS);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  // Modal Block State
  const [blockTarget, setBlockTarget] = useState<DummyAdminLink | null>(null);
  const [blockReason, setBlockReason] = useState("");

  // Modal Delete State
  const [deleteTarget, setDeleteTarget] = useState<DummyAdminLink | null>(null);

  // Filtering Logic
  const filteredLinks = links.filter((link) => {
    const matchesSearch =
      link.slug.toLowerCase().includes(searchQuery.toLowerCase()) ||
      link.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      link.originalUrl.toLowerCase().includes(searchQuery.toLowerCase()) ||
      link.userName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || link.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleCopy = (shortUrl: string) => {
    navigator.clipboard.writeText(shortUrl);
    toast.success("Tautan Disalin ke Clipboard!");
  };

  const handleConfirmBlock = () => {
    if (!blockTarget) return;
    setLinks(
      links.map((l) =>
        l.id === blockTarget.id
          ? {
              ...l,
              status: "blocked",
              blockReason: blockReason || "Pelanggaran pedoman konten dan keamanan",
            }
          : l
      )
    );
    toast.error("Tautan Berhasil Diblokir!", {
      description: `Slug /${blockTarget.slug} kini mengarah ke halaman 404 custom dan tidak dapat diakses.`,
    });
    setBlockTarget(null);
    setBlockReason("");
  };

  const handleUnblock = (linkId: string) => {
    setLinks(
      links.map((l) =>
        l.id === linkId ? { ...l, status: "active", blockReason: undefined } : l
      )
    );
    toast.success("Pemblokiran Tautan Dicabut!", {
      description: "Tautan telah diaktifkan kembali dan dapat diakses publik.",
    });
  };

  const handleConfirmDelete = () => {
    if (!deleteTarget) return;
    setLinks(links.filter((l) => l.id !== deleteTarget.id));
    toast.success("Tautan Dihapus Permanen", {
      description: `Tautan /${deleteTarget.slug} telah dihapus dari seluruh database sistem.`,
    });
    setDeleteTarget(null);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="border-[3px] border-black bg-white p-6 shadow-brutal flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-black font-heading text-black">
              Moderasi Tautan Global
            </h1>
            <Badge variant="outline" className="font-mono text-xs font-black bg-cream">
              {links.length} Tautan Terdata
            </Badge>
          </div>
          <p className="text-sm font-semibold text-neutral-700 mt-1">
            Pantau seluruh tautan pengguna aktif, blokir konten berbahaya/phishing, dan pertahankan integritas domain pendek.in.
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
              placeholder="Cari berdasarkan slug, judul, target URL, atau nama pemilik..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 font-medium text-sm border-2 border-black bg-white h-11"
            />
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 bg-cream border-2 border-black px-3 py-1.5 h-11">
              <Filter className="h-4 w-4 text-black" strokeWidth={2.5} />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-transparent text-xs font-black text-black outline-none cursor-pointer"
              >
                <option value="all">Semua Status</option>
                <option value="active">Aktif</option>
                <option value="blocked">Diblokir (Blocked)</option>
                <option value="expired">Kedaluwarsa (Expired)</option>
              </select>
            </div>
          </div>
        </div>
      </Card>

      {/* Table */}
      <Card className="border-[3px] border-black shadow-brutal bg-white overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-b-2 border-black bg-primary">
                <TableHead className="font-heading font-black text-black">Tautan Pendek &amp; Judul</TableHead>
                <TableHead className="font-heading font-black text-black">Target URL</TableHead>
                <TableHead className="font-heading font-black text-black">Pemilik</TableHead>
                <TableHead className="font-heading font-black text-black text-center">Status</TableHead>
                <TableHead className="font-heading font-black text-black text-center">Klik</TableHead>
                <TableHead className="font-heading font-black text-black">Dibuat</TableHead>
                <TableHead className="font-heading font-black text-black text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="divide-y-2 divide-black font-semibold text-xs">
              {filteredLinks.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-12 text-neutral-600 font-bold">
                    Tidak ada tautan yang sesuai dengan filter pencarian.
                  </TableCell>
                </TableRow>
              ) : (
                filteredLinks.map((link) => (
                  <TableRow key={link.id} className="hover:bg-cream/40">
                    {/* Slug & Title */}
                    <TableCell className="py-4">
                      <div className="space-y-0.5">
                        <Link
                          href={`/admin/tautan/${link.id}`}
                          className="font-mono font-black text-sm text-black hover:underline hover:text-primary-dark"
                        >
                          /{link.slug}
                        </Link>
                        <p className="text-xs text-neutral-700 font-medium truncate max-w-[220px]">
                          {link.title}
                        </p>
                      </div>
                    </TableCell>

                    {/* Original URL */}
                    <TableCell className="py-4 font-mono text-[11px] text-neutral-800 break-all max-w-[240px]">
                      {link.originalUrl}
                    </TableCell>

                    {/* Owner */}
                    <TableCell className="py-4">
                      <Link
                        href={`/admin/pengguna/${link.userId}`}
                        className="font-bold text-black hover:underline"
                      >
                        {link.userName}
                      </Link>
                      <p className="font-mono text-[10px] text-neutral-500">{link.userEmail}</p>
                    </TableCell>

                    {/* Status */}
                    <TableCell className="py-4 text-center">
                      {link.status === "active" && (
                        <Badge variant="default" className="text-[11px]">Aktif</Badge>
                      )}
                      {link.status === "blocked" && (
                        <Badge variant="destructive" className="text-[11px]">Diblokir</Badge>
                      )}
                      {link.status === "expired" && (
                        <Badge variant="warning" className="text-[11px]">Kedaluwarsa</Badge>
                      )}
                    </TableCell>

                    {/* Clicks */}
                    <TableCell className="py-4 text-center font-mono font-black text-sm text-black">
                      {link.clicks.toLocaleString("id-ID")}
                    </TableCell>

                    {/* Created At */}
                    <TableCell className="py-4 font-mono text-[11px] text-neutral-600">
                      {link.createdAt}
                    </TableCell>

                    {/* Actions */}
                    <TableCell className="py-4 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="outline" size="icon" className="h-9 w-9 bg-white">
                            <MoreVertical className="h-4 w-4" strokeWidth={2.5} />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-52 border-2 border-black shadow-brutal bg-white">
                          <DropdownMenuLabel className="font-heading font-black text-xs uppercase">
                            Moderasi Tautan
                          </DropdownMenuLabel>
                          <DropdownMenuSeparator className="bg-black" />

                          <DropdownMenuItem asChild className="font-semibold text-xs cursor-pointer">
                            <Link href={`/admin/tautan/${link.id}`} className="flex items-center gap-2">
                              <Eye className="h-3.5 w-3.5" />
                              <span>Lihat Detail Lengkap</span>
                            </Link>
                          </DropdownMenuItem>

                          <DropdownMenuItem
                            onClick={() => handleCopy(link.shortUrl)}
                            className="font-semibold text-xs cursor-pointer flex items-center gap-2"
                          >
                            <Copy className="h-3.5 w-3.5" />
                            <span>Salin Tautan Pendek</span>
                          </DropdownMenuItem>

                          <DropdownMenuItem asChild className="font-semibold text-xs cursor-pointer">
                            <a href={link.shortUrl} target="_blank" rel="noreferrer" className="flex items-center gap-2">
                              <ExternalLink className="h-3.5 w-3.5" />
                              <span>Uji Redirect /s/{link.slug}</span>
                            </a>
                          </DropdownMenuItem>

                          <DropdownMenuSeparator className="bg-black" />

                          {link.status === "blocked" ? (
                            <DropdownMenuItem
                              onClick={() => handleUnblock(link.id)}
                              className="font-semibold text-xs cursor-pointer text-primary-dark focus:text-primary-dark flex items-center gap-2"
                            >
                              <CheckCircle2 className="h-3.5 w-3.5" />
                              <span>Buka Blokir Tautan</span>
                            </DropdownMenuItem>
                          ) : (
                            <DropdownMenuItem
                              onClick={() => {
                                setBlockTarget(link);
                                setBlockReason("");
                              }}
                              className="font-semibold text-xs cursor-pointer text-destructive focus:text-destructive flex items-center gap-2"
                            >
                              <Ban className="h-3.5 w-3.5" />
                              <span>Blokir Tautan Ini</span>
                            </DropdownMenuItem>
                          )}

                          <DropdownMenuItem
                            onClick={() => setDeleteTarget(link)}
                            className="font-semibold text-xs cursor-pointer text-destructive focus:text-destructive flex items-center gap-2"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                            <span>Hapus Permanen</span>
                          </DropdownMenuItem>
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

      {/* Modal Blokir Tautan */}
      <Dialog open={!!blockTarget} onOpenChange={(open) => !open && setBlockTarget(null)}>
        <DialogContent className="border-[3px] border-black bg-white shadow-brutal-xl sm:max-w-md">
          <DialogHeader className="space-y-2">
            <div className="w-12 h-12 bg-destructive text-white border-2 border-black flex items-center justify-center shadow-brutal-sm">
              <ShieldAlert className="h-6 w-6" strokeWidth={2.5} />
            </div>
            <DialogTitle className="font-heading font-black text-xl text-black">
              Konfirmasi Pemblokiran Tautan
            </DialogTitle>
            <DialogDescription className="text-xs font-semibold text-neutral-700">
              Tautan <code className="bg-cream px-1 border border-black font-mono font-bold">pendek.in/s/{blockTarget?.slug}</code> akan dinonaktifkan secara instan dan mengarahkan pengunjung ke halaman 404 sistem.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-2 py-2">
            <label className="text-xs font-black uppercase tracking-wider text-black">
              Alasan Pemblokiran (Audit Trail)
            </label>
            <Input
              type="text"
              placeholder="Contoh: Terdeteksi phishing, malware, atau penipuan undian..."
              value={blockReason}
              onChange={(e) => setBlockReason(e.target.value)}
              className="border-2 border-black bg-white text-xs font-semibold"
            />
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setBlockTarget(null)} className="bg-white">
              Batal
            </Button>
            <Button variant="destructive" onClick={handleConfirmBlock}>
              Blokir Tautan Sekarang
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal Hapus Tautan */}
      <Dialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <DialogContent className="border-[3px] border-black bg-white shadow-brutal-xl sm:max-w-md">
          <DialogHeader className="space-y-2">
            <div className="w-12 h-12 bg-destructive text-white border-2 border-black flex items-center justify-center shadow-brutal-sm">
              <AlertTriangle className="h-6 w-6" strokeWidth={2.5} />
            </div>
            <DialogTitle className="font-heading font-black text-xl text-black">
              Hapus Tautan Secara Permanen?
            </DialogTitle>
            <DialogDescription className="text-xs font-semibold text-neutral-700">
              Aksi ini bersifat permanen dan tidak dapat dibatalkan. Seluruh riwayat analitik klik pada tautan <strong className="text-black">/{deleteTarget?.slug}</strong> akan dihapus dari sistem.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setDeleteTarget(null)} className="bg-white">
              Batal
            </Button>
            <Button variant="destructive" onClick={handleConfirmDelete}>
              Ya, Hapus Permanen
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
