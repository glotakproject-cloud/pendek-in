"use client";

import { useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
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
  PlusCircle,
  Search,
  MoreVertical,
  Copy,
  ExternalLink,
  Edit,
  QrCode,
  Trash2,
  Filter,
  ArrowUpDown,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";
import { DUMMY_LINKS, type DummyLink } from "@/lib/dummy-data";
import { deleteLink } from "@/actions/links";

export default function KelolaTautanPage() {
  const [links, setLinks] = useState<DummyLink[]>(DUMMY_LINKS);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<"newest" | "clicks" | "oldest">("newest");
  const [deleteTarget, setDeleteTarget] = useState<DummyLink | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Filter & Sort Logic
  const filteredLinks = links
    .filter((link) => {
      const matchesSearch =
        link.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        link.slug.toLowerCase().includes(searchQuery.toLowerCase()) ||
        link.originalUrl.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus =
        statusFilter === "all" ? true : link.status === statusFilter;

      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      if (sortBy === "clicks") return b.clicks - a.clicks;
      if (sortBy === "oldest") return a.createdAt.localeCompare(b.createdAt);
      return b.createdAt.localeCompare(a.createdAt); // newest
    });

  const handleCopy = (shortUrl: string, title: string) => {
    navigator.clipboard.writeText(shortUrl);
    toast.success("Tautan Disalin! 📋", {
      description: `Short link untuk "${title}" berhasil disalin ke papan klip.`,
    });
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      await deleteLink(deleteTarget.id);
      setLinks((prev) => prev.filter((l) => l.id !== deleteTarget.id));
      toast.success("Tautan Dihapus!", {
        description: `Tautan "${deleteTarget.title}" telah berhasil dihapus.`,
      });
    } catch {
      toast.error("Gagal menghapus tautan");
    } finally {
      setIsDeleting(false);
      setDeleteTarget(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="border-2 border-black bg-white p-6 shadow-brutal flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-black font-heading text-black">
              Kelola Tautan
            </h1>
            <Badge variant="default" className="text-xs">
              {links.length} Total
            </Badge>
          </div>
          <p className="text-sm text-neutral-600 font-semibold mt-1">
            Pantau, edit, salin, dan kelola semua tautan pendek aktif maupun arsip Anda.
          </p>
        </div>
        <Button size="default" variant="default" asChild className="shrink-0">
          <Link href="/dashboard/tautan/baru" className="flex items-center gap-2">
            <PlusCircle className="h-4 w-4" strokeWidth={2.5} />
            <span>Buat Tautan Baru</span>
          </Link>
        </Button>
      </div>

      {/* Filter, Search, & Sort Bar */}
      <Card>
        <CardContent className="p-4 sm:p-5">
          <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-black" strokeWidth={2.5} />
              <Input
                placeholder="Cari berdasarkan judul, back-half slug, atau URL target..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-11 text-sm bg-white"
              />
            </div>

            {/* Filter Status & Sort By */}
            <div className="flex flex-wrap sm:flex-nowrap items-center gap-3">
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <span className="text-xs font-mono font-bold text-neutral-600 shrink-0 flex items-center gap-1">
                  <Filter className="h-3.5 w-3.5" strokeWidth={2.5} /> Status:
                </span>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="h-11 px-3 border-2 border-black bg-white text-xs font-bold uppercase tracking-wider focus:outline-none focus:ring-2 focus:ring-primary shadow-brutal-sm cursor-pointer"
                >
                  <option value="all">Semua Status ({links.length})</option>
                  <option value="active">Aktif</option>
                  <option value="inactive">Nonaktif</option>
                  <option value="expired">Kadaluarsa</option>
                </select>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <span className="text-xs font-mono font-bold text-neutral-600 shrink-0 flex items-center gap-1">
                  <ArrowUpDown className="h-3.5 w-3.5" strokeWidth={2.5} /> Urutan:
                </span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as "newest" | "clicks" | "oldest")}
                  className="h-11 px-3 border-2 border-black bg-white text-xs font-bold uppercase tracking-wider focus:outline-none focus:ring-2 focus:ring-primary shadow-brutal-sm cursor-pointer"
                >
                  <option value="newest">Terbaru Dibuat</option>
                  <option value="clicks">Klik Terbanyak</option>
                  <option value="oldest">Terlama Dibuat</option>
                </select>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Table of Links */}
      {filteredLinks.length === 0 ? (
        <Card className="p-12 text-center border-2 border-dashed border-black">
          <div className="max-w-md mx-auto space-y-3">
            <div className="w-12 h-12 bg-cream border-2 border-black mx-auto flex items-center justify-center">
              <Search className="h-6 w-6 text-black" strokeWidth={2.5} />
            </div>
            <h3 className="font-heading font-black text-xl text-black">
              Tidak Ada Tautan Ditemukan
            </h3>
            <p className="text-sm font-semibold text-neutral-600">
              Tidak ada tautan yang cocok dengan kriteria pencarian atau filter status yang Anda pilih.
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setSearchQuery("");
                setStatusFilter("all");
              }}
            >
              Reset Semua Filter
            </Button>
          </div>
        </Card>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[40%]">Informasi Tautan</TableHead>
              <TableHead className="w-[12%]">Status</TableHead>
              <TableHead className="w-[14%] text-right">Performa Klik</TableHead>
              <TableHead className="w-[14%]">Dibuat Pada</TableHead>
              <TableHead className="w-[20%] text-center">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredLinks.map((link) => (
              <TableRow key={link.id}>
                {/* Title & Short URL */}
                <TableCell>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/dashboard/tautan/${link.id}`}
                        className="font-heading font-black text-base text-black hover:text-primary-dark transition-colors line-clamp-1"
                      >
                        {link.title}
                      </Link>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
                      <button
                        onClick={() => handleCopy(link.shortUrl, link.title)}
                        className="bg-primary/20 hover:bg-primary text-black font-black px-2 py-0.5 border border-black flex items-center gap-1 transition-colors"
                        title="Klik untuk salin URL pendek"
                      >
                        <Copy className="h-3 w-3" strokeWidth={2.5} />
                        <span>{link.shortUrl}</span>
                      </button>
                      <span className="text-neutral-400">&bull;</span>
                      <a
                        href={link.originalUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-neutral-500 hover:text-black truncate max-w-[240px] flex items-center gap-1 hover:underline"
                        title={link.originalUrl}
                      >
                        <span className="truncate">{link.originalUrl}</span>
                        <ExternalLink className="h-3 w-3 shrink-0" strokeWidth={2.5} />
                      </a>
                    </div>

                    {link.tags.length > 0 && (
                      <div className="flex items-center gap-1.5 pt-1">
                        {link.tags.map((tag) => (
                          <span
                            key={tag}
                            className="text-[10px] font-mono font-bold px-1.5 py-0.2 border border-black bg-cream"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </TableCell>

                {/* Status Badge */}
                <TableCell>
                  {link.status === "active" && (
                    <Badge variant="default" className="gap-1">
                      <CheckCircle2 className="h-3 w-3" strokeWidth={2.5} />
                      Aktif
                    </Badge>
                  )}
                  {link.status === "inactive" && (
                    <Badge variant="destructive">Nonaktif</Badge>
                  )}
                  {link.status === "expired" && (
                    <Badge variant="warning" className="gap-1">
                      <AlertTriangle className="h-3 w-3" strokeWidth={2.5} />
                      Kadaluarsa
                    </Badge>
                  )}
                </TableCell>

                {/* Performance */}
                <TableCell className="text-right font-mono">
                  <div className="font-black text-base text-black">
                    {link.clicks.toLocaleString()}
                  </div>
                  <div className="text-[11px] font-bold text-neutral-500">
                    {link.uniqueClicks.toLocaleString()} unik
                  </div>
                </TableCell>

                {/* Created Date */}
                <TableCell className="font-mono text-xs font-bold text-neutral-700">
                  <div>{link.createdAt}</div>
                  {link.expiresAt && (
                    <div className="text-[10px] text-destructive mt-0.5">
                      Exp: {link.expiresAt}
                    </div>
                  )}
                </TableCell>

                {/* Actions Dropdown & Quick Buttons */}
                <TableCell>
                  <div className="flex items-center justify-center gap-1.5">
                    <Button
                      size="iconSm"
                      variant="outline"
                      title="Salin Tautan"
                      onClick={() => handleCopy(link.shortUrl, link.title)}
                    >
                      <Copy className="h-3.5 w-3.5" strokeWidth={2.5} />
                    </Button>

                    <Button
                      size="iconSm"
                      variant="secondary"
                      asChild
                      title="Editor QR"
                    >
                      <Link href={`/dashboard/tautan/${link.id}/qr`}>
                        <QrCode className="h-3.5 w-3.5" strokeWidth={2.5} />
                      </Link>
                    </Button>

                    {/* Action Dropdown Menu */}
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          size="iconSm"
                          variant="outline"
                          title="Menu Aksi Tambahan"
                        >
                          <MoreVertical className="h-4 w-4" strokeWidth={2.5} />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-48">
                        <DropdownMenuLabel className="border-b-2 border-black pb-1.5">
                          Aksi Tautan
                        </DropdownMenuLabel>
                        <DropdownMenuItem
                          onClick={() => handleCopy(link.shortUrl, link.title)}
                          className="flex items-center gap-2 cursor-pointer font-bold"
                        >
                          <Copy className="h-4 w-4" strokeWidth={2.5} />
                          <span>Salin Short Link</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild className="cursor-pointer font-bold">
                          <a
                            href={link.originalUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="flex items-center gap-2"
                          >
                            <ExternalLink className="h-4 w-4" strokeWidth={2.5} />
                            <span>Buka URL Asli</span>
                          </a>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild className="cursor-pointer font-bold">
                          <Link
                            href={`/dashboard/tautan/${link.id}`}
                            className="flex items-center gap-2"
                          >
                            <Edit className="h-4 w-4" strokeWidth={2.5} />
                            <span>Detail &amp; Edit</span>
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild className="cursor-pointer font-bold">
                          <Link
                            href={`/dashboard/tautan/${link.id}/qr`}
                            className="flex items-center gap-2"
                          >
                            <QrCode className="h-4 w-4" strokeWidth={2.5} />
                            <span>Editor Kode QR</span>
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => setDeleteTarget(link)}
                          className="flex items-center gap-2 cursor-pointer font-bold text-destructive hover:!bg-destructive hover:!text-white"
                        >
                          <Trash2 className="h-4 w-4" strokeWidth={2.5} />
                          <span>Hapus Tautan</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      {/* Pagination Footer Summary */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 border-2 border-black bg-white shadow-brutal-sm text-xs font-mono font-bold">
        <span>
          Menampilkan <span className="text-black font-black">{filteredLinks.length}</span> dari{" "}
          <span className="text-black font-black">{links.length}</span> total tautan
        </span>
        <div className="flex items-center gap-2">
          <Button size="sm" variant="outline" disabled>
            Sebelumnya
          </Button>
          <span className="px-3 py-1 border-2 border-black bg-primary">1</span>
          <Button size="sm" variant="outline" disabled>
            Selanjutnya
          </Button>
        </div>
      </div>

      {/* Dialog Konfirmasi Hapus */}
      <Dialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-destructive flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" strokeWidth={2.5} />
              Konfirmasi Hapus Tautan
            </DialogTitle>
            <DialogDescription className="font-semibold text-black">
              Apakah Anda yakin ingin menghapus tautan pendek ini secara permanen?
            </DialogDescription>
          </DialogHeader>
          {deleteTarget && (
            <div className="p-3 border-2 border-black bg-cream space-y-1 font-mono text-xs">
              <div className="font-black text-black">{deleteTarget.title}</div>
              <div className="text-primary-dark font-bold">{deleteTarget.shortUrl}</div>
              <div className="text-neutral-500 truncate">{deleteTarget.originalUrl}</div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteTarget(null)} disabled={isDeleting}>
              Batal
            </Button>
            <Button variant="destructive" onClick={handleDelete} disabled={isDeleting}>
              {isDeleting ? "Menghapus..." : "Ya, Hapus Tautan"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
