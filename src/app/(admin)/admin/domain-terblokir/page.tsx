"use client";

import { useState, useEffect, useCallback } from "react";
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  ShieldAlert,
  PlusCircle,
  Search,
  Trash2,
  Globe,
} from "lucide-react";
import {
  getBlockedDomains,
  addBlockedDomain,
  deleteBlockedDomain,
  type BlockedDomainItem,
} from "@/actions/admin";

export default function DomainTerblokirPage() {
  const [domains, setDomains] = useState<BlockedDomainItem[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newDomain, setNewDomain] = useState("");
  const [newReason, setNewReason] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchDomains = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await getBlockedDomains(searchQuery.trim() || undefined);
      if (res.success && res.data) {
        setDomains(res.data);
      }
    } catch {
      toast.error("Gagal memuat daftar domain terblokir");
    } finally {
      setIsLoading(false);
    }
  }, [searchQuery]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchDomains();
    }, 200);

    return () => clearTimeout(timer);
  }, [fetchDomains]);

  const handleAddDomain = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDomain.trim()) {
      toast.error("Nama domain wajib diisi!");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await addBlockedDomain(newDomain, newReason);
      if (res.success && res.data) {
        setDomains((prev) => [res.data!, ...prev]);
        toast.success("Domain Berhasil Diblokir! 🛡️", {
          description: `Domain "${res.data.domain}" telah ditambahkan ke blacklist global.`,
        });
        setNewDomain("");
        setNewReason("");
        setIsAddModalOpen(false);
      } else {
        toast.error(res.error || "Gagal memblokir domain");
      }
    } catch {
      toast.error("Terjadi kesalahan sistem saat memblokir domain");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteDomain = async (id: number, domainName: string) => {
    try {
      const res = await deleteBlockedDomain(id);
      if (res.success) {
        setDomains((prev) => prev.filter((d) => d.id !== id));
        toast.success("Domain Dihapus dari Blacklist", {
          description: `Domain "${domainName}" telah dipulihkan dan dapat dipendekkan kembali.`,
        });
      } else {
        toast.error(res.error || "Gagal menghapus domain dari blacklist");
      }
    } catch {
      toast.error("Terjadi kesalahan sistem");
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="border-[3px] border-black bg-white p-6 shadow-brutal flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-black font-heading text-black">
              Domain Terblokir (Blacklist)
            </h1>
            <Badge variant="destructive" className="text-xs font-mono">
              {domains.length} Domain Dicekal
            </Badge>
          </div>
          <p className="text-sm font-semibold text-neutral-600 mt-1 max-w-xl">
            Cegah pengguna memendekkan tautan berbahaya (malware, phishing, penipuan, konten terlarang) secara otomatis.
          </p>
        </div>

        <Button
          size="default"
          variant="destructive"
          onClick={() => setIsAddModalOpen(true)}
          className="gap-2 shrink-0"
        >
          <PlusCircle className="h-4 w-4" strokeWidth={2.5} />
          <span>Tambah Blacklist</span>
        </Button>
      </div>

      {/* Search Bar */}
      <Card className="border-[3px] border-black shadow-brutal bg-white">
        <div className="p-4 flex items-center justify-between gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-500" strokeWidth={2.5} />
            <Input
              placeholder="Cari domain terblokir atau alasan pemblokiran..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 bg-cream/40 h-10 border-2 border-black"
            />
          </div>
        </div>
      </Card>

      {/* Tabel Domain Terblokir */}
      <Card className="border-[3px] border-black shadow-brutal bg-white overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-b-2 border-black bg-cream">
                <TableHead className="w-[35%] font-heading font-black text-black">Nama Domain</TableHead>
                <TableHead className="w-[30%] font-heading font-black text-black">Alasan Pemblokiran</TableHead>
                <TableHead className="w-[15%] font-heading font-black text-black">Ditambahkan Oleh</TableHead>
                <TableHead className="w-[10%] font-heading font-black text-black">Tanggal</TableHead>
                <TableHead className="w-[10%] font-heading font-black text-black text-center">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 font-mono text-sm text-neutral-500">
                    Memuat daftar domain terblokir...
                  </TableCell>
                </TableRow>
              ) : domains.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-10 font-mono text-sm text-neutral-500">
                    Belum ada domain dalam daftar hitam yang cocok.
                  </TableCell>
                </TableRow>
              ) : (
                domains.map((item) => (
                  <TableRow key={item.id} className="border-b border-neutral-200 hover:bg-cream/30">
                    <TableCell className="font-mono text-sm font-black text-destructive flex items-center gap-2 py-3.5">
                      <Globe className="h-4 w-4 shrink-0 text-black" strokeWidth={2.5} />
                      <span>{item.domain}</span>
                    </TableCell>

                    <TableCell className="text-xs font-semibold text-neutral-700 py-3.5">
                      {item.reason || "Terindikasi phishing / malware"}
                    </TableCell>

                    <TableCell className="font-sans text-xs font-bold text-black py-3.5">
                      {item.addedBy || "Super Admin"}
                    </TableCell>

                    <TableCell className="font-mono text-xs text-neutral-600 font-bold py-3.5">
                      {new Date(item.createdAt).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </TableCell>

                    <TableCell className="text-center py-3.5">
                      <Button
                        size="iconSm"
                        variant="ghost"
                        onClick={() => handleDeleteDomain(item.id, item.domain)}
                        className="text-neutral-400 hover:text-destructive hover:bg-destructive/10"
                        title="Hapus dari Blacklist"
                      >
                        <Trash2 className="h-4 w-4" strokeWidth={2.5} />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </Card>

      {/* Modal Tambah Blacklist */}
      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-destructive">
              <ShieldAlert className="h-5 w-5" strokeWidth={2.5} />
              Tambah Domain ke Blacklist
            </DialogTitle>
            <DialogDescription className="font-semibold text-black">
              Domain yang didaftarkan ke sini akan ditolak secara otomatis ketika pengguna mencoba membuat tautan baru.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleAddDomain} className="space-y-4 pt-2">
            <div className="space-y-1.5">
              <label className="text-xs font-black uppercase tracking-wider text-black">
                Nama Domain Target
              </label>
              <Input
                placeholder="Contoh: bitly-login-palsu.xyz (tanpa https://)"
                value={newDomain}
                onChange={(e) => setNewDomain(e.target.value)}
                className="bg-white border-2 border-black"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-black uppercase tracking-wider text-black">
                Alasan Pemblokiran
              </label>
              <Input
                placeholder="Contoh: Phishing credentials, malware payload, judi online"
                value={newReason}
                onChange={(e) => setNewReason(e.target.value)}
                className="bg-white border-2 border-black"
                required
              />
            </div>

            <DialogFooter className="pt-2">
              <Button type="button" variant="outline" onClick={() => setIsAddModalOpen(false)}>
                Batal
              </Button>
              <Button type="submit" variant="destructive" disabled={isSubmitting}>
                {isSubmitting ? "Menyimpan..." : "Blokir Domain Sekarang"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
