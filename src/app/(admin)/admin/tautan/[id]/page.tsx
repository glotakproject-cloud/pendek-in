"use client";

import { useState } from "react";
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
  Globe,
  Tag,
} from "lucide-react";
import {
  DUMMY_ADMIN_LINKS,
  DUMMY_ANALYTICS_7_DAYS,
  type DummyAdminLink,
} from "@/lib/dummy-data";
import { Mini7DayChart } from "@/components/dashboard/dashboard-charts";

export default function DetailTautanAdminPage() {
  const params = useParams();
  const router = useRouter();
  const rawId = (params?.id as string) || "link-01";

  const initialLink =
    DUMMY_ADMIN_LINKS.find((l) => l.id === rawId || l.slug === rawId) ||
    DUMMY_ADMIN_LINKS[0];

  const [link, setLink] = useState<DummyAdminLink>(initialLink);
  const [isBlockModalOpen, setIsBlockModalOpen] = useState(false);
  const [blockReason, setBlockReason] = useState("");
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(link.shortUrl);
    toast.success("Tautan Disalin ke Clipboard!");
  };

  const handleConfirmBlock = () => {
    setLink({
      ...link,
      status: "blocked",
      blockReason: blockReason || "Pelanggaran pedoman konten dan keamanan",
    });
    toast.error("Tautan Berhasil Diblokir!", {
      description: `Tautan /${link.slug} telah diblokir secara global.`,
    });
    setIsBlockModalOpen(false);
  };

  const handleUnblock = () => {
    setLink({
      ...link,
      status: "active",
      blockReason: undefined,
    });
    toast.success("Pemblokiran Tautan Dicabut!", {
      description: `Tautan /${link.slug} telah diaktifkan kembali.`,
    });
  };

  const handleConfirmDelete = () => {
    toast.success("Tautan Dihapus Permanen!");
    router.push("/admin/tautan");
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

          <Button variant="outline" size="sm" asChild className="bg-white">
            <a href={link.shortUrl} target="_blank" rel="noreferrer">
              <ExternalLink className="h-4 w-4 mr-1.5" strokeWidth={2.5} />
              Buka /s/{link.slug}
            </a>
          </Button>

          {link.status === "blocked" ? (
            <Button variant="default" size="sm" onClick={handleUnblock}>
              <CheckCircle2 className="h-4 w-4 mr-1.5" strokeWidth={2.5} />
              Buka Blokir
            </Button>
          ) : (
            <Button variant="destructive" size="sm" onClick={() => setIsBlockModalOpen(true)}>
              <Ban className="h-4 w-4 mr-1.5" strokeWidth={2.5} />
              Blokir Tautan
            </Button>
          )}

          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsDeleteModalOpen(true)}
            className="border-destructive text-destructive hover:bg-destructive/10"
          >
            <Trash2 className="h-4 w-4 mr-1.5" strokeWidth={2.5} />
            Hapus
          </Button>
        </div>
      </div>

      {/* Main Info Card */}
      <Card className="border-[3px] border-black shadow-brutal bg-white p-6 space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b-2 border-black pb-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-mono text-xs font-black bg-cream border border-black px-2 py-0.5">
                SLUG: /{link.slug}
              </span>
              {link.status === "active" && <Badge variant="default">Status Aktif</Badge>}
              {link.status === "blocked" && <Badge variant="destructive">Status Diblokir</Badge>}
              {link.status === "expired" && <Badge variant="warning">Kedaluwarsa</Badge>}
            </div>
            <h1 className="text-2xl sm:text-3xl font-heading font-black text-black pt-1">
              {link.title}
            </h1>
            <p className="font-mono text-xs text-primary-dark font-bold">
              {link.shortUrl}
            </p>
          </div>

          {/* Quick Metrics */}
          <div className="flex items-center gap-4 bg-cream border-2 border-black p-4 shadow-brutal-sm shrink-0">
            <div className="text-center px-3">
              <span className="text-[10px] font-mono font-bold uppercase text-neutral-600 block">Total Klik</span>
              <span className="font-mono text-2xl font-black text-black">{link.clicks.toLocaleString("id-ID")}</span>
            </div>
            <div className="w-px h-8 bg-black/20" />
            <div className="text-center px-3">
              <span className="text-[10px] font-mono font-bold uppercase text-neutral-600 block">Klik Unik</span>
              <span className="font-mono text-2xl font-black text-primary-dark">{link.uniqueClicks.toLocaleString("id-ID")}</span>
            </div>
          </div>
        </div>

        {/* Reason Banner if Blocked */}
        {link.status === "blocked" && (
          <div className="bg-destructive/15 border-2 border-destructive p-4 shadow-brutal-sm space-y-1">
            <div className="flex items-center gap-1.5 text-destructive font-black text-xs font-mono uppercase">
              <ShieldAlert className="h-4 w-4" strokeWidth={2.5} />
              <span>Alasan Pemblokiran Sistem</span>
            </div>
            <p className="text-xs font-bold text-black">
              {link.blockReason || "Konten terdeteksi melanggar ketentuan layanan pencegahan penipuan online."}
            </p>
          </div>
        )}

        {/* Detail Meta Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-cream border-2 border-black p-4 space-y-1.5">
            <span className="text-[11px] font-black uppercase text-neutral-600 flex items-center gap-1.5">
              <Globe className="h-3.5 w-3.5" />
              Target URL Asli
            </span>
            <p className="font-mono text-xs font-bold text-black break-all bg-white p-2.5 border border-black select-all">
              {link.originalUrl}
            </p>
          </div>

          <div className="bg-cream border-2 border-black p-4 space-y-1.5">
            <span className="text-[11px] font-black uppercase text-neutral-600 flex items-center gap-1.5">
              <User className="h-3.5 w-3.5" />
              Pemilik Akun Tautan
            </span>
            <div className="bg-white p-2.5 border border-black flex items-center justify-between">
              <div>
                <p className="font-black text-xs text-black">{link.userName}</p>
                <p className="font-mono text-[11px] text-neutral-600">{link.userEmail}</p>
              </div>
              <Button variant="outline" size="sm" asChild className="h-7 text-[10px] font-bold">
                <Link href={`/admin/pengguna/${link.userId}`}>
                  Lihat Profil
                </Link>
              </Button>
            </div>
          </div>
        </div>

        {/* Additional Tags & Info */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t-2 border-black/10">
          <span className="text-xs font-bold text-neutral-600 flex items-center gap-1">
            <Tag className="h-3.5 w-3.5" /> Tag:
          </span>
          {link.tags.map((t, idx) => (
            <Badge key={idx} variant="outline" className="text-xs bg-white">
              {t}
            </Badge>
          ))}
          <span className="text-xs font-mono text-neutral-500 ml-auto">
            Dibuat pada: {link.createdAt}
          </span>
        </div>
      </Card>

      {/* Mini Analytics Section */}
      <Card className="border-[3px] border-black shadow-brutal bg-white">
        <CardHeader className="border-b-2 border-black bg-cream p-4">
          <CardTitle className="text-base font-heading font-black">
            Analitik Performa Klik (7 Hari Terakhir)
          </CardTitle>
          <CardDescription className="text-xs font-semibold text-neutral-700">
            Riwayat klik harian tautan /{link.slug}
          </CardDescription>
        </CardHeader>
        <CardContent className="p-4 sm:p-6">
          <Mini7DayChart data={DUMMY_ANALYTICS_7_DAYS} />
        </CardContent>
      </Card>

      {/* Block Dialog */}
      <Dialog open={isBlockModalOpen} onOpenChange={setIsBlockModalOpen}>
        <DialogContent className="border-[3px] border-black bg-white shadow-brutal-xl sm:max-w-md">
          <DialogHeader className="space-y-2">
            <div className="w-12 h-12 bg-destructive text-white border-2 border-black flex items-center justify-center shadow-brutal-sm">
              <ShieldAlert className="h-6 w-6" strokeWidth={2.5} />
            </div>
            <DialogTitle className="font-heading font-black text-xl text-black">
              Blokir Tautan /{link.slug}
            </DialogTitle>
            <DialogDescription className="text-xs font-semibold text-neutral-700">
              Tautan ini tidak akan dapat diakses oleh siapapun dan pengunjung akan langsung diarahkan ke halaman 404.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-2 py-2">
            <label className="text-xs font-black uppercase tracking-wider text-black">
              Alasan Pemblokiran
            </label>
            <Input
              type="text"
              placeholder="Contoh: Terdeteksi phishing, malware, atau penipuan..."
              value={blockReason}
              onChange={(e) => setBlockReason(e.target.value)}
              className="border-2 border-black bg-white text-xs font-semibold"
            />
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setIsBlockModalOpen(false)} className="bg-white">
              Batal
            </Button>
            <Button variant="destructive" onClick={handleConfirmBlock}>
              Konfirmasi Blokir
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <DialogContent className="border-[3px] border-black bg-white shadow-brutal-xl sm:max-w-md">
          <DialogHeader className="space-y-2">
            <div className="w-12 h-12 bg-destructive text-white border-2 border-black flex items-center justify-center shadow-brutal-sm">
              <AlertTriangle className="h-6 w-6" strokeWidth={2.5} />
            </div>
            <DialogTitle className="font-heading font-black text-xl text-black">
              Hapus Tautan /{link.slug}?
            </DialogTitle>
            <DialogDescription className="text-xs font-semibold text-neutral-700">
              Aksi ini bersifat permanen. Tautan dan seluruh data klik di dalamnya akan dihapus.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setIsDeleteModalOpen(false)} className="bg-white">
              Batal
            </Button>
            <Button variant="destructive" onClick={handleConfirmDelete}>
              Ya, Hapus Tautan
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
