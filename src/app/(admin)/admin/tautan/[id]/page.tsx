"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  ArrowLeft,
  ExternalLink,
  Copy,
  Ban,
  CheckCircle2,
  Trash2,
  ShieldAlert,
  User,
  AlertTriangle,
} from "lucide-react";
import { Mini7DayChart } from "@/components/dashboard/dashboard-charts";
import {
  getAdminLinks,
  updateLinkStatusAdmin,
  deleteLinkAdmin,
  type AdminLinkItem,
} from "@/actions/admin";
import { getAnalytics, type AnalyticsResult } from "@/actions/analytics";

export default function DetailTautanAdminPage() {
  const params = useParams();
  const router = useRouter();
  const rawId = (params?.id as string) || "lnk-001";

  const [link, setLink] = useState<AdminLinkItem>({
    id: rawId,
    userId: null,
    authorName: "Pengguna",
    authorEmail: "user@pendek.in",
    originalUrl: "https://example.com",
    slug: "slug",
    title: "Detail Tautan",
    shortUrl: "https://pendek.in/s/slug",
    status: "active",
    clickCount: 0,
    uniqueClickCount: 0,
    createdAt: new Date().toISOString(),
  });

  const [isBlockModalOpen, setIsBlockModalOpen] = useState(false);
  const [blockReason, setBlockReason] = useState("");
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [analytics, setAnalytics] = useState<AnalyticsResult | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    let isMounted = true;

    getAdminLinks({ limit: 100 }).then((res) => {
      if (!isMounted) return;
      if (res.success && res.data) {
        const found = res.data.find((l) => l.id === rawId || l.slug === rawId) || res.data[0];
        if (found) {
          setLink(found);
          getAnalytics({ linkId: found.id, timeRange: "7d" }).then((aRes) => {
            if (isMounted && aRes.data) {
              setAnalytics(aRes.data);
            }
          });
        }
      }
    });

    return () => {
      isMounted = false;
    };
  }, [rawId]);

  const handleCopy = () => {
    navigator.clipboard.writeText(link.shortUrl);
    toast.success("Tautan Disalin ke Clipboard! 📋");
  };

  const handleConfirmBlock = async () => {
    setIsProcessing(true);
    try {
      const res = await updateLinkStatusAdmin(
        link.id,
        "blocked",
        blockReason || "Pelanggaran pedoman konten dan keamanan"
      );

      if (res.success) {
        setLink({ ...link, status: "blocked" });
        toast.error("Tautan Berhasil Diblokir!", {
          description: `Tautan /s/${link.slug} telah diblokir secara global.`,
        });
        setIsBlockModalOpen(false);
      } else {
        toast.error(res.error || "Gagal memblokir tautan");
      }
    } catch {
      toast.error("Terjadi kesalahan sistem");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleUnblock = async () => {
    try {
      const res = await updateLinkStatusAdmin(link.id, "active", "Dibuka kembali oleh Super Admin");
      if (res.success) {
        setLink({ ...link, status: "active" });
        toast.success("Pemblokiran Tautan Dicabut!", {
          description: `Tautan /s/${link.slug} telah diaktifkan kembali.`,
        });
      }
    } catch {
      toast.error("Gagal membuka blokir");
    }
  };

  const handleConfirmDelete = async () => {
    setIsProcessing(true);
    try {
      const res = await deleteLinkAdmin(link.id, "Dihapus dari admin detail");
      if (res.success) {
        toast.success("Tautan Dihapus Permanen!");
        router.push("/admin/tautan");
      } else {
        toast.error(res.error || "Gagal menghapus tautan");
      }
    } catch {
      toast.error("Terjadi kesalahan sistem");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header & Back Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <Button variant="outline" size="sm" asChild className="w-fit bg-white">
          <Link href="/admin/tautan" className="flex items-center gap-1.5">
            <ArrowLeft className="h-4 w-4" strokeWidth={2.5} />
            <span>Kembali ke Moderasi Tautan</span>
          </Link>
        </Button>

        <div className="flex flex-wrap items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleCopy} className="bg-white">
            <Copy className="h-4 w-4 mr-1.5" strokeWidth={2.5} />
            Salin Link
          </Button>

          {link.status === "blocked" ? (
            <Button
              variant="default"
              size="sm"
              onClick={handleUnblock}
              className="flex items-center gap-1.5"
            >
              <CheckCircle2 className="h-4 w-4 text-black" strokeWidth={2.5} />
              <span>Buka Blokir Tautan</span>
            </Button>
          ) : (
            <Button
              variant="destructive"
              size="sm"
              onClick={() => setIsBlockModalOpen(true)}
              className="flex items-center gap-1.5"
            >
              <Ban className="h-4 w-4" strokeWidth={2.5} />
              <span>Blokir Tautan Ini</span>
            </Button>
          )}

          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsDeleteModalOpen(true)}
            className="text-destructive hover:bg-destructive/10 border-destructive"
          >
            <Trash2 className="h-4 w-4" strokeWidth={2.5} />
          </Button>
        </div>
      </div>

      {/* Main Link Info Card */}
      <Card className="border-[3px] border-black shadow-brutal bg-white p-6">
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2.5">
                <h1 className="text-2xl font-black font-heading text-black">{link.title}</h1>
                <Badge
                  variant={
                    link.status === "active"
                      ? "default"
                      : link.status === "blocked"
                      ? "destructive"
                      : "warning"
                  }
                >
                  {link.status === "active" ? "Aktif" : link.status === "blocked" ? "Diblokir" : "Kadaluarsa"}
                </Badge>
              </div>
              <div className="flex items-center gap-2 text-xs font-mono font-bold text-primary-dark mt-1">
                <span>{link.shortUrl}</span>
                <span className="text-neutral-400">&bull;</span>
                <span className="text-neutral-500 font-sans">ID: {link.id}</span>
              </div>
            </div>
          </div>

          {/* URL Asli Card */}
          <div className="p-4 border-2 border-black bg-cream shadow-brutal-sm flex items-start justify-between gap-4">
            <div className="space-y-1 min-w-0">
              <span className="text-[11px] font-black uppercase text-neutral-600 font-mono">
                URL Asli Tujuan (Original Destination):
              </span>
              <div className="font-mono text-xs font-bold text-black break-all">
                {link.originalUrl}
              </div>
            </div>
            <Button size="sm" variant="outline" asChild className="shrink-0 bg-white">
              <a href={link.originalUrl} target="_blank" rel="noreferrer" className="flex items-center gap-1">
                <span>Buka Target</span>
                <ExternalLink className="h-3.5 w-3.5" strokeWidth={2.5} />
              </a>
            </Button>
          </div>
        </div>
      </Card>

      {/* Grid: Profil Pembuat & Grafik Klik 7 Hari */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Kolom Kiri: Pembuat & Metadata (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <Card className="border-[3px] border-black shadow-brutal bg-white">
            <CardHeader className="border-b-2 border-black bg-cream p-4">
              <CardTitle className="text-sm font-black flex items-center gap-2">
                <User className="h-4 w-4 text-black" strokeWidth={2.5} />
                <span>Identitas Pembuat Tautan</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-3 font-mono text-xs">
              <div className="flex justify-between py-1 border-b border-neutral-200">
                <span className="text-neutral-600">Nama Akun:</span>
                <span className="font-black text-black">{link.authorName}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-neutral-200">
                <span className="text-neutral-600">Alamat Email:</span>
                <span className="font-black text-black">{link.authorEmail}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-neutral-200">
                <span className="text-neutral-600">Tanggal Dibuat:</span>
                <span className="font-black text-black">
                  {new Date(link.createdAt).toLocaleDateString("id-ID", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-neutral-600">Total Klik Tercatat:</span>
                <span className="font-black text-primary-dark text-sm">
                  {link.clickCount.toLocaleString("id-ID")} klik
                </span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Kolom Kanan: Tren Klik (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          <Card className="border-[3px] border-black shadow-brutal bg-white">
            <CardHeader className="border-b-2 border-black bg-cream p-4">
              <CardTitle className="text-sm font-black">
                Aktivitas Trafik Kunjungan (7 Hari)
              </CardTitle>
              <CardDescription className="text-xs">
                Tren klik harian tautan ini yang terverifikasi di server
              </CardDescription>
            </CardHeader>
            <CardContent className="p-4 sm:p-6">
              <Mini7DayChart data={analytics?.timeSeries || []} />
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Modal Konfirmasi Blokir */}
      <Dialog open={isBlockModalOpen} onOpenChange={setIsBlockModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-destructive flex items-center gap-2">
              <ShieldAlert className="h-5 w-5" strokeWidth={2.5} />
              Blokir Tautan Publik Ini?
            </DialogTitle>
            <DialogDescription className="font-semibold text-black">
              Pengunjung yang mengakses short link ini tidak akan diarahkan ke tujuan dan sistem akan mencatat insiden pemblokiran ke Audit Log.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-2 py-2">
            <label className="text-xs font-black uppercase tracking-wider text-black">
              Alasan Pemblokiran (Wajib):
            </label>
            <Input
              placeholder="Contoh: Scam giveaway, impersonasi domain resmi, spam bot..."
              value={blockReason}
              onChange={(e) => setBlockReason(e.target.value)}
              className="bg-white border-2 border-black"
            />
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsBlockModalOpen(false)} disabled={isProcessing}>
              Batal
            </Button>
            <Button variant="destructive" onClick={handleConfirmBlock} disabled={isProcessing}>
              {isProcessing ? "Memblokir..." : "Ya, Blokir Sekarang"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal Hapus Permanen */}
      <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-destructive flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" strokeWidth={2.5} />
              Hapus Tautan Secara Permanen?
            </DialogTitle>
            <DialogDescription className="font-semibold text-black">
              Apakah Anda yakin ingin menghapus tautan &ldquo;{link.title}&rdquo;? Tindakan ini bersifat destruktif dan tidak dapat dibatalkan.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteModalOpen(false)} disabled={isProcessing}>
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
