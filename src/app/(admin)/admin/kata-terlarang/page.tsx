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
  Ban,
  PlusCircle,
  Search,
  Trash2,
  Shield,
} from "lucide-react";
import {
  getReservedWords,
  addReservedWord,
  deleteReservedWord,
  type ReservedWordItem,
} from "@/actions/admin";

export default function KataTerlarangPage() {
  const [words, setWords] = useState<ReservedWordItem[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newWord, setNewWord] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchWords = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await getReservedWords(searchQuery.trim() || undefined);
      if (res.success && res.data) {
        setWords(res.data);
      }
    } catch {
      toast.error("Gagal memuat daftar kata terlarang");
    } finally {
      setIsLoading(false);
    }
  }, [searchQuery]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchWords();
    }, 200);

    return () => clearTimeout(timer);
  }, [fetchWords]);

  const handleAddWord = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleaned = newWord.trim().toLowerCase().replace(/[^a-z0-9-_]/g, "");

    if (!cleaned) {
      toast.error("Format kata terlarang tidak valid!");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await addReservedWord(cleaned);
      if (res.success && res.data) {
        setWords((prev) => [res.data!, ...prev]);
        toast.success("Kata Terlarang Berhasil Ditambahkan!", {
          description: `Slug "/s/${cleaned}" kini dikunci dan tidak dapat digunakan sebagai kustom back-half pengguna.`,
        });
        setNewWord("");
        setIsAddModalOpen(false);
      } else {
        toast.error(res.error || "Gagal menambahkan kata terlarang");
      }
    } catch {
      toast.error("Terjadi kesalahan sistem");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteWord = async (id: number, word: string) => {
    try {
      const res = await deleteReservedWord(id);
      if (res.success) {
        setWords((prev) => prev.filter((w) => w.id !== id));
        toast.success("Kata Terlarang Dihapus", {
          description: `Slug "/s/${word}" kini tidak lagi dikunci dari sistem.`,
        });
      } else {
        toast.error(res.error || "Gagal menghapus kata terlarang");
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
              Kata Terlarang (Reserved Words)
            </h1>
            <Badge variant="outline" className="font-mono text-xs font-bold bg-cream">
              {words.length} Kata Dikunci
            </Badge>
          </div>
          <p className="text-sm font-semibold text-neutral-600 mt-1 max-w-xl">
            Kunci kata-kata sensitif sistem, rute navigasi publik, serta nama brand terkenal agar tidak dapat diklaim sebagai slug URL pendek oleh pengguna.
          </p>
        </div>

        <Button
          size="default"
          variant="default"
          onClick={() => setIsAddModalOpen(true)}
          className="gap-2 shrink-0"
        >
          <PlusCircle className="h-4 w-4" strokeWidth={2.5} />
          <span>Tambah Kata Terlarang</span>
        </Button>
      </div>

      {/* Search Bar */}
      <Card className="border-[3px] border-black shadow-brutal bg-white">
        <div className="p-4 flex items-center justify-between gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-500" strokeWidth={2.5} />
            <Input
              placeholder="Cari kata slug yang dikunci..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 bg-cream/40 h-10 border-2 border-black"
            />
          </div>
        </div>
      </Card>

      {/* Tabel Kata Terlarang */}
      <Card className="border-[3px] border-black shadow-brutal bg-white overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-b-2 border-black bg-cream">
                <TableHead className="w-[45%] font-heading font-black text-black">Kata / Back-Half Terlarang</TableHead>
                <TableHead className="w-[30%] font-heading font-black text-black">Dampak Sistem</TableHead>
                <TableHead className="w-[15%] font-heading font-black text-black">Tanggal Kunci</TableHead>
                <TableHead className="w-[10%] font-heading font-black text-black text-center">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-8 font-mono text-sm text-neutral-500">
                    Memuat daftar kata terlarang...
                  </TableCell>
                </TableRow>
              ) : words.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-10 font-mono text-sm text-neutral-500">
                    Tidak ada kata terlarang yang sesuai filter.
                  </TableCell>
                </TableRow>
              ) : (
                words.map((item) => (
                  <TableRow key={item.id} className="border-b border-neutral-200 hover:bg-cream/30">
                    <TableCell className="font-mono text-sm font-black text-black py-3.5 flex items-center gap-2">
                      <Ban className="h-4 w-4 text-destructive shrink-0" strokeWidth={2.5} />
                      <span className="bg-cream border border-black px-2 py-0.5">/s/{item.word}</span>
                    </TableCell>

                    <TableCell className="text-xs font-semibold text-neutral-700 py-3.5">
                      <div className="flex items-center gap-1.5">
                        <Shield className="h-3.5 w-3.5 text-primary-dark" />
                        <span>Dilindungi dari kustomisasi pengguna</span>
                      </div>
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
                        onClick={() => handleDeleteWord(item.id, item.word)}
                        className="text-neutral-400 hover:text-destructive hover:bg-destructive/10"
                        title="Hapus dari Kata Terlarang"
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

      {/* Modal Tambah Reserved Word */}
      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Ban className="h-5 w-5 text-destructive" strokeWidth={2.5} />
              Tambah Kata Terlarang Baru
            </DialogTitle>
            <DialogDescription className="font-semibold text-black">
              Slug kata ini akan langsung ditolak saat pengguna mencoba menggunakannya pada formulir pembuatan tautan.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleAddWord} className="space-y-4 pt-2">
            <div className="space-y-1.5">
              <label className="text-xs font-black uppercase tracking-wider text-black">
                Kata Slug Terlarang (Huruf Kecil &amp; Angka)
              </label>
              <Input
                placeholder="Contoh: checkout, payment, internal, bca"
                value={newWord}
                onChange={(e) => setNewWord(e.target.value)}
                className="bg-white border-2 border-black font-mono lowercase"
                required
              />
            </div>

            <DialogFooter className="pt-2">
              <Button type="button" variant="outline" onClick={() => setIsAddModalOpen(false)}>
                Batal
              </Button>
              <Button type="submit" variant="default" disabled={isSubmitting}>
                {isSubmitting ? "Menyimpan..." : "Kunci Kata Sekarang"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
