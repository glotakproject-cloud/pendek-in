"use client";

import { useState, useEffect, useCallback } from "react";
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
  AlertTriangle,
} from "lucide-react";
import { getUserLinks, deleteLink } from "@/actions/links";
import { type LinkStatus } from "@/types/database";

interface LinkItem {
  id: string;
  title: string;
  slug: string;
  originalUrl: string;
  shortUrl: string;
  status: LinkStatus;
  tags: string[];
  clicks: number;
  uniqueClicks: number;
  createdAt: string;
  passwordProtected: boolean;
}

export default function KelolaTautanPage() {
  const [links, setLinks] = useState<LinkItem[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<"newest" | "clicks" | "oldest">("newest");
  const [deleteTarget, setDeleteTarget] = useState<LinkItem | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [totalLinks, setTotalLinks] = useState(0);

  const fetchLinks = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await getUserLinks({
        search: searchQuery.trim() || undefined,
        status: statusFilter !== "all" ? statusFilter : undefined,
        sortBy,
      });

      if (res.success && res.data) {
        const origin = typeof window !== "undefined" ? window.location.origin : "https://pendek.in";
        const mapped: LinkItem[] = res.data.map((l) => ({
          id: l.id,
          title: l.title || l.slug,
          slug: l.slug,
          originalUrl: l.original_url,
          shortUrl: `${origin}/s/${l.slug}`,
          status: l.status,
          tags: l.tags || [],
          clicks: l.click_count,
          uniqueClicks: l.unique_click_count,
          createdAt: new Date(l.created_at).toLocaleDateString("id-ID", {
            day: "numeric",
            month: "short",
            year: "numeric",
          }),
          passwordProtected: Boolean(l.password_hash),
        }));

        setLinks(mapped);
        setTotalLinks(res.total || mapped.length);
      }
    } catch {
      toast.error("Gagal memuat daftar tautan");
    } finally {
      setIsLoading(false);
    }
  }, [searchQuery, statusFilter, sortBy]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchLinks();
    }, 200);

    return () => clearTimeout(timer);
  }, [fetchLinks]);

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
      const res = await deleteLink(deleteTarget.id);
      if (res.success) {
        setLinks((prev) => prev.filter((l) => l.id !== deleteTarget.id));
        setTotalLinks((prev) => Math.max(0, prev - 1));
        toast.success("Tautan Dihapus!", {
          description: `Tautan "${deleteTarget.title}" telah berhasil dihapus permanen.`,
        });
      } else {
        toast.error(res.error || "Gagal menghapus tautan");
      }
    } catch {
      toast.error("Terjadi kesalahan sistem saat menghapus tautan");
    } finally {
      setIsDeleting(false);
      setDeleteTarget(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header & Tombol Buat */}
      <div className="border-2 border-black bg-white p-6 shadow-brutal flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-black font-heading text-black">
              Kelola Tautan
            </h1>
            <Badge variant="default">{totalLinks} Tautan</Badge>
          </div>
          <p className="text-sm font-semibold text-neutral-600 mt-1">
            Daftar lengkap seluruh short link, riwayat analitik, serta akses kustomisasi kode QR Anda.
          </p>
        </div>

        <Button size="default" variant="default" asChild className="shrink-0">
          <Link href="/dashboard/tautan/baru" className="flex items-center gap-2">
            <PlusCircle className="h-4 w-4" strokeWidth={2.5} />
            <span>Buat Tautan Baru</span>
          </Link>
        </Button>
      </div>

      {/* Filter, Search & Sort Bar */}
      <Card>
        <CardContent className="p-4 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          {/* Search Bar */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-500" strokeWidth={2.5} />
            <Input
              placeholder="Cari tautan, judul, atau URL asli..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 bg-cream/40 h-10 border-2 border-black"
            />
          </div>

          <div className="flex items-center gap-2.5 flex-wrap sm:flex-nowrap">
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
                <option value="blocked">Diblokir</option>
                <option value="expired">Kadaluarsa</option>
              </select>
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-1.5 border-2 border-black bg-white px-2.5 py-1.5 shadow-brutal-sm">
              <ArrowUpDown className="h-3.5 w-3.5 text-black" strokeWidth={2.5} />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as "newest" | "clicks" | "oldest")}
                className="bg-transparent text-xs font-mono font-bold text-black focus:outline-none cursor-pointer"
              >
                <option value="newest">Terbaru</option>
                <option value="clicks">Klik Terbanyak</option>
                <option value="oldest">Terlama</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabel Tautan */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[40%]">Informasi Tautan</TableHead>
                <TableHead className="w-[12%]">Status</TableHead>
                <TableHead className="w-[16%] text-right">Statistik Klik</TableHead>
                <TableHead className="w-[14%]">Tanggal Buat</TableHead>
                <TableHead className="w-[18%] text-center">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-10 font-mono text-sm text-neutral-500">
                    Memuat data tautan dari server...
                  </TableCell>
                </TableRow>
              ) : links.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-12 space-y-3">
                    <p className="font-heading font-black text-lg text-black">
                      Tidak ada tautan yang cocok
                    </p>
                    <p className="text-sm font-semibold text-neutral-600">
                      Coba ubah kata kunci pencarian atau buat tautan baru.
                    </p>
                    <Button variant="default" size="sm" asChild>
                      <Link href="/dashboard/tautan/baru">Buat Tautan Pertama</Link>
                    </Button>
                  </TableCell>
                </TableRow>
              ) : (
                links.map((link) => (
                  <TableRow key={link.id}>
                    {/* Info Tautan */}
                    <TableCell className="font-sans">
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/dashboard/tautan/${link.id}`}
                          className="font-heading font-black text-black hover:text-primary-dark transition-colors line-clamp-1 text-base"
                        >
                          {link.title}
                        </Link>
                        {link.passwordProtected && (
                          <Badge variant="outline" className="text-[10px] px-1 py-0 bg-yellow-100 border-black">
                            🔒 Kunci
                          </Badge>
                        )}
                      </div>

                      <div className="flex items-center gap-2 mt-1 text-xs font-mono">
                        <span className="text-primary-dark font-black tracking-tight">
                          {link.shortUrl}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleCopy(link.shortUrl, link.title)}
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
                          className="text-neutral-500 hover:text-black truncate max-w-[220px] flex items-center gap-0.5"
                        >
                          <span className="truncate">{link.originalUrl}</span>
                          <ExternalLink className="h-2.5 w-2.5 shrink-0" />
                        </a>
                      </div>

                      {link.tags && link.tags.length > 0 && (
                        <div className="flex items-center gap-1.5 mt-2 flex-wrap">
                          {link.tags.map((t) => (
                            <span
                              key={t}
                              className="text-[10px] font-mono font-bold bg-cream border border-black px-1.5 py-0.2"
                            >
                              #{t}
                            </span>
                          ))}
                        </div>
                      )}
                    </TableCell>

                    {/* Status */}
                    <TableCell>
                      {link.status === "active" && <Badge variant="default">Aktif</Badge>}
                      {link.status === "blocked" && <Badge variant="destructive">Diblokir</Badge>}
                      {link.status === "expired" && <Badge variant="warning">Kadaluarsa</Badge>}
                    </TableCell>

                    {/* Total Klik */}
                    <TableCell className="text-right font-mono">
                      <div className="font-black text-base text-black">
                        {link.clicks.toLocaleString()}
                      </div>
                      <div className="text-[11px] text-neutral-500 font-bold">
                        {link.uniqueClicks.toLocaleString()} unik
                      </div>
                    </TableCell>

                    {/* Tanggal Buat */}
                    <TableCell className="font-mono text-xs text-neutral-600 font-bold">
                      {link.createdAt}
                    </TableCell>

                    {/* Aksi */}
                    <TableCell>
                      <div className="flex items-center justify-center gap-1.5">
                        <Button
                          size="iconSm"
                          variant="outline"
                          title="Salin Tautan Pendek"
                          onClick={() => handleCopy(link.shortUrl, link.title)}
                        >
                          <Copy className="h-3.5 w-3.5" strokeWidth={2.5} />
                        </Button>

                        <Button
                          size="iconSm"
                          variant="secondary"
                          asChild
                          title="Editor &amp; Unduh QR"
                        >
                          <Link href={`/dashboard/tautan/${link.id}/qr`}>
                            <QrCode className="h-3.5 w-3.5" strokeWidth={2.5} />
                          </Link>
                        </Button>

                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button size="iconSm" variant="outline">
                              <MoreVertical className="h-3.5 w-3.5" strokeWidth={2.5} />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-48">
                            <DropdownMenuLabel>Tindakan</DropdownMenuLabel>
                            <DropdownMenuItem asChild>
                              <Link href={`/dashboard/tautan/${link.id}`} className="cursor-pointer">
                                <Edit className="mr-2 h-4 w-4" strokeWidth={2.5} />
                                <span>Edit &amp; Analitik</span>
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                              <Link href={`/dashboard/tautan/${link.id}/qr`} className="cursor-pointer">
                                <QrCode className="mr-2 h-4 w-4" strokeWidth={2.5} />
                                <span>Kustomisasi QR</span>
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleCopy(link.shortUrl, link.title)}>
                              <Copy className="mr-2 h-4 w-4" strokeWidth={2.5} />
                              <span>Salin Tautan</span>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
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
        </CardContent>
      </Card>

      {/* Dialog Konfirmasi Hapus */}
      <Dialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-destructive flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" strokeWidth={2.5} />
              Hapus Tautan Secara Permanen?
            </DialogTitle>
            <DialogDescription className="font-semibold text-black">
              Apakah Anda yakin ingin menghapus tautan &ldquo;{deleteTarget?.title}&rdquo;?
              Semua trafik yang mengarah ke slug <strong>/s/{deleteTarget?.slug}</strong> akan langsung terputus dan catatan klik akan hilang.
            </DialogDescription>
          </DialogHeader>
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
