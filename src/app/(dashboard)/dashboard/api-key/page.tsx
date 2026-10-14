"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Key,
  PlusCircle,
  Copy,
  AlertTriangle,
  CheckCircle2,
  ShieldAlert,
  Code2,
  Terminal,
} from "lucide-react";
import {
  getApiKeys,
  createApiKey,
  revokeApiKey,
  type ApiKeyItem,
} from "@/actions/api-keys";

export default function KelolaApiKeyPage() {
  const [keys, setKeys] = useState<ApiKeyItem[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tokenName, setTokenName] = useState("");
  const [generatedKey, setGeneratedKey] = useState<string | null>(null);
  const [revokeTarget, setRevokeTarget] = useState<ApiKeyItem | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isRevoking, setIsRevoking] = useState(false);

  useEffect(() => {
    let isMounted = true;
    getApiKeys().then((res) => {
      if (isMounted && res.data) {
        setKeys(res.data);
      }
    });

    return () => {
      isMounted = false;
    };
  }, []);

  const handleOpenGenerateModal = () => {
    setTokenName("");
    setGeneratedKey(null);
    setIsModalOpen(true);
  };

  const handleGenerateKey = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tokenName.trim()) {
      toast.error("Nama API Key wajib diisi!");
      return;
    }

    setIsGenerating(true);
    try {
      const res = await createApiKey(tokenName);
      if (!res.success || !res.fullKey) {
        toast.error(res.error || "Gagal membuat API Key.");
        setIsGenerating(false);
        return;
      }

      setGeneratedKey(res.fullKey);
      if (res.keyItem) {
        setKeys((prev) => [res.keyItem!, ...prev]);
      }
      toast.success("API Key Berhasil Dibuat! 🔑", {
        description: "Segera salin kunci rahasia Anda sebelum menutup dialog.",
      });
    } catch {
      toast.error("Terjadi kesalahan sistem saat membuat API Key.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Disalin!", {
      description: `${label} berhasil disalin ke papan klip.`,
    });
  };

  const handleRevoke = async () => {
    if (!revokeTarget) return;
    setIsRevoking(true);
    try {
      const res = await revokeApiKey(revokeTarget.id);
      if (!res.success) {
        toast.error(res.error || "Gagal mencabut API Key.");
        setIsRevoking(false);
        return;
      }

      setKeys((prev) =>
        prev.map((k) =>
          k.id === revokeTarget.id ? { ...k, status: "revoked" as const } : k
        )
      );
      toast.success("API Key Dicabut!", {
        description: `Kunci "${revokeTarget.name}" tidak dapat digunakan lagi.`,
      });
    } catch {
      toast.error("Terjadi kesalahan saat mencabut API Key.");
    } finally {
      setIsRevoking(false);
      setRevokeTarget(null);
    }
  };

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="border-2 border-black bg-white p-6 shadow-brutal flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-black font-heading text-black">
              Kelola API Key
            </h1>
            <Badge variant="default">REST API</Badge>
          </div>
          <p className="text-sm font-semibold text-neutral-600 mt-1">
            Gunakan API Key untuk mengintegrasikan pemendekan tautan Pendek-In secara terprogram ke aplikasi Anda.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Button variant="outline" size="default" asChild>
            <Link href="/api-publik" className="flex items-center gap-2">
              <Code2 className="h-4 w-4" strokeWidth={2.5} />
              <span>Dokumentasi API</span>
            </Link>
          </Button>

          <Button variant="default" size="default" onClick={handleOpenGenerateModal}>
            <PlusCircle className="h-4 w-4 mr-1.5" strokeWidth={2.5} />
            <span>Buat API Key Baru</span>
          </Button>
        </div>
      </div>

      {/* Info Banner */}
      <div className="border-2 border-black bg-cream p-4 shadow-brutal-sm flex items-start gap-3">
        <ShieldAlert className="h-5 w-5 text-black shrink-0 mt-0.5" strokeWidth={2.5} />
        <div className="text-xs font-semibold text-black space-y-1">
          <div className="font-black text-sm uppercase">Keamanan Kunci Rahasia</div>
          <p>
            API Key Anda memberikan akses penuh untuk membuat dan menghapus tautan atas nama akun Anda.
            Jangan pernah membagikan kunci rahasia ini di kode frontend publik atau repositori GitHub publik.
          </p>
        </div>
      </div>

      {/* API Keys Table */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Daftar API Key Aktif ({keys.length})</CardTitle>
            <CardDescription>
              Kunci rahasia yang terdaftar dan memiliki izin akses ke REST API Pendek-In
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nama Token &amp; Aplikasi</TableHead>
                <TableHead>Prefix API Key</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Dibuat Pada</TableHead>
                <TableHead>Terakhir Digunakan</TableHead>
                <TableHead className="w-24 text-center">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {keys.map((k) => (
                <TableRow key={k.id}>
                  <TableCell className="font-bold text-black">
                    <div className="font-heading font-black text-base">{k.name}</div>
                    <div className="text-[11px] font-mono text-neutral-500 font-normal">
                      Token ID: {k.id}
                    </div>
                  </TableCell>
                  <TableCell className="font-mono text-xs font-black">
                    <span className="bg-cream px-2 py-1 border border-black inline-block">
                      {k.prefix}
                    </span>
                  </TableCell>
                  <TableCell>
                    {k.status === "active" ? (
                      <Badge variant="default" className="gap-1">
                        <CheckCircle2 className="h-3 w-3" strokeWidth={2.5} />
                        Aktif
                      </Badge>
                    ) : (
                      <Badge variant="destructive">Dicabut</Badge>
                    )}
                  </TableCell>
                  <TableCell className="font-mono text-xs font-bold text-neutral-600">
                    {k.createdAt}
                  </TableCell>
                  <TableCell className="font-mono text-xs font-bold text-neutral-600">
                    {k.lastUsedAt || "Belum digunakan"}
                  </TableCell>
                  <TableCell className="text-center">
                    {k.status === "active" ? (
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => setRevokeTarget(k)}
                        title="Cabut izin API Key ini"
                      >
                        Cabut
                      </Button>
                    ) : (
                      <span className="text-xs font-mono font-bold text-neutral-400">
                        Nonaktif
                      </span>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Code Snippet Quickstart */}
      <Card>
        <CardHeader className="bg-cream border-b-2 border-black">
          <div className="flex items-center gap-2">
            <Terminal className="h-5 w-5 text-black" strokeWidth={2.5} />
            <CardTitle>Contoh Pemanggilan API dengan Header Bearer Token</CardTitle>
          </div>
          <CardDescription>
            Kirimkan token Anda melalui header Authorization pada setiap HTTP request
          </CardDescription>
        </CardHeader>
        <CardContent className="p-4 sm:p-6 bg-black text-white font-mono text-xs leading-relaxed overflow-x-auto">
          <pre>{`curl -X POST https://pendek.in/api/v1/links \\
  -H "Authorization: Bearer pk_live_YOUR_API_KEY_HERE" \\
  -H "Content-Type: application/json" \\
  -d '{
    "original_url": "https://tokoonline.com/promo-spesial",
    "custom_slug": "promo-spesial-2026",
    "title": "Promo Diskon Spesial"
  }'`}</pre>
        </CardContent>
      </Card>

      {/* Modal Dialog: Generate API Key */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[480px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl">
              <Key className="h-5 w-5 text-primary-dark" strokeWidth={2.5} />
              <span>{generatedKey ? "Kunci Berhasil Dibuat" : "Buat API Key Baru"}</span>
            </DialogTitle>
            <DialogDescription className="font-semibold text-neutral-700">
              {generatedKey
                ? "Simpan token Anda sekarang sebelum menutup jendela ini."
                : "Beri nama kunci untuk mengidentifikasi aplikasi atau layanan yang menggunakannya."}
            </DialogDescription>
          </DialogHeader>

          {!generatedKey ? (
            /* Step 1: Input Token Name */
            <form onSubmit={handleGenerateKey} className="space-y-4 pt-2">
              <div className="space-y-1.5">
                <label className="text-xs font-black uppercase tracking-wider text-black">
                  Nama Kunci / Deskripsi Aplikasi <span className="text-destructive">*</span>
                </label>
                <Input
                  required
                  placeholder="Contoh: Integrasi Bot Telegram / Toko Online"
                  value={tokenName}
                  onChange={(e) => setTokenName(e.target.value)}
                  className="h-11 bg-white"
                />
                <p className="text-[11px] font-semibold text-neutral-500">
                  Nama ini akan memudahkan Anda melacak penggunaan kunci di masa mendatang.
                </p>
              </div>

              <DialogFooter className="pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsModalOpen(false)}
                  disabled={isGenerating}
                >
                  Batal
                </Button>
                <Button type="submit" variant="default" disabled={isGenerating}>
                  {isGenerating ? "Membuat Kunci..." : "Generate Kunci Sekarang"}
                </Button>
              </DialogFooter>
            </form>
          ) : (
            /* Step 2: Show Full Key Once with Warning Banner */
            <div className="space-y-4 pt-2">
              {/* Mandatory Neobrutalist Warning Banner */}
              <div className="p-4 border-[3px] border-black bg-warning shadow-brutal-sm text-black space-y-1.5">
                <div className="flex items-center gap-2 font-heading font-black text-sm uppercase">
                  <AlertTriangle className="h-5 w-5 text-black shrink-0" strokeWidth={2.5} />
                  <span>HANYA TAMPIL SEKALI!</span>
                </div>
                <p className="text-xs font-bold leading-normal">
                  Salin dan simpan API Key Anda sekarang di tempat aman (password manager / environment variables). Demi keamanan akun Anda, kunci ini{" "}
                  <strong className="underline">TIDAK AKAN BISA DILIHAT LAGI</strong> setelah dialog ini ditutup.
                </p>
              </div>

              {/* Full Key Box */}
              <div className="space-y-1.5">
                <label className="text-xs font-black uppercase tracking-wider text-black">
                  API Key Rahasia Anda:
                </label>
                <div className="p-3 border-2 border-black bg-cream font-mono text-xs font-black break-all shadow-brutal-sm select-all">
                  {generatedKey}
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <Button
                  type="button"
                  variant="default"
                  className="flex-1 gap-2"
                  onClick={() => handleCopy(generatedKey, "API Key Rahasia")}
                >
                  <Copy className="h-4 w-4" strokeWidth={2.5} />
                  <span>Salin API Key</span>
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsModalOpen(false)}
                >
                  Saya Sudah Menyimpannya
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Dialog Konfirmasi Revoke */}
      <Dialog open={!!revokeTarget} onOpenChange={(open) => !open && setRevokeTarget(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-destructive flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" strokeWidth={2.5} />
              Cabut API Key?
            </DialogTitle>
            <DialogDescription className="font-semibold text-black">
              Apakah Anda yakin ingin mencabut izin akses untuk kunci &ldquo;{revokeTarget?.name}&rdquo;?
              Semua aplikasi atau script yang menggunakan kunci ini akan langsung ditolak.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRevokeTarget(null)} disabled={isRevoking}>
              Batal
            </Button>
            <Button variant="destructive" onClick={handleRevoke} disabled={isRevoking}>
              {isRevoking ? "Mencabut Kunci..." : "Ya, Cabut Kunci Ini"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
