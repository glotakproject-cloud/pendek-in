"use client";

import { useState } from "react";
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
  Filter,
  Shield,
} from "lucide-react";
import {
  DUMMY_RESERVED_WORDS,
  type DummyReservedWord,
} from "@/lib/dummy-data";

export default function KataTerlarangPage() {
  const [words, setWords] = useState<DummyReservedWord[]>(DUMMY_RESERVED_WORDS);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newWord, setNewWord] = useState("");
  const [newCategory, setNewCategory] = useState<"system" | "brand" | "security">("system");

  const filteredWords = words.filter((w) => {
    const matchesSearch = w.word.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === "all" || w.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const handleAddWord = (e: React.FormEvent) => {
    e.preventDefault();
    const cleaned = newWord.trim().toLowerCase().replace(/[^a-z0-9-_]/g, "");

    if (!cleaned) {
      toast.error("Format kata terlarang tidak valid!");
      return;
    }

    if (words.some((w) => w.word === cleaned)) {
      toast.error("Kata ini sudah terdaftar dalam reserved words!");
      return;
    }

    const newItem: DummyReservedWord = {
      id: `rw-${Date.now()}`,
      word: cleaned,
      category: newCategory,
      addedBy: "Admin Pendek-In",
      createdAt: "Hari ini",
    };

    setWords([newItem, ...words]);
    toast.success("Kata Terlarang Berhasil Ditambahkan!", {
      description: `Slug /${cleaned} kini dikunci dan tidak dapat digunakan sebagai kustom back-half pengguna.`,
    });
    setNewWord("");
    setIsAddModalOpen(false);
  };

  const handleDeleteWord = (id: string, word: string) => {
    setWords(words.filter((w) => w.id !== id));
    toast.success("Kata Terlarang Dihapus", {
      description: `Slug /${word} kini tidak lagi dikunci dari sistem.`,
    });
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
          <p className="text-sm font-semibold text-neutral-700 mt-1 max-w-2xl">
            Kelola kata dan slug yang tidak boleh digunakan oleh pengguna saat membuat kustom back-half tautan untuk menghindari konflik rute sistem dan impersonasi brand.
          </p>
        </div>

        <Button
          variant="default"
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-2 shrink-0 h-11 shadow-brutal"
        >
          <PlusCircle className="h-5 w-5" strokeWidth={2.5} />
          <span>Tambah Kata Terlarang</span>
        </Button>
      </div>

      {/* Info Notice */}
      <div className="bg-cream border-[3px] border-black p-4 shadow-brutal flex items-start gap-3">
        <Shield className="h-5 w-5 text-black shrink-0 mt-0.5" strokeWidth={2.5} />
        <p className="text-xs font-semibold text-neutral-800 leading-relaxed">
          <strong>Perhatian:</strong> Kata-kata sistem bawaan seperti <code className="bg-white border border-black px-1 font-mono font-bold">admin</code>, <code className="bg-white border border-black px-1 font-mono font-bold">api</code>, <code className="bg-white border border-black px-1 font-mono font-bold">dashboard</code>, <code className="bg-white border border-black px-1 font-mono font-bold">masuk</code>, dan <code className="bg-white border border-black px-1 font-mono font-bold">daftar</code> diperlukan agar tidak terjadi tabrakan navigasi pada router aplikasi publik.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <Card className="border-[3px] border-black shadow-brutal bg-white p-4">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-600" strokeWidth={2.5} />
            <Input
              type="text"
              placeholder="Cari kata atau slug terlarang..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 font-mono text-sm border-2 border-black bg-white h-11"
            />
          </div>

          <div className="flex items-center gap-1.5 bg-cream border-2 border-black px-3 py-1.5 h-11">
            <Filter className="h-4 w-4 text-black" strokeWidth={2.5} />
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="bg-transparent text-xs font-black text-black outline-none cursor-pointer"
            >
              <option value="all">Semua Kategori</option>
              <option value="system">Sistem (Route)</option>
              <option value="brand">Merek Dagang (Brand)</option>
              <option value="security">Keamanan (Security)</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Table */}
      <Card className="border-[3px] border-black shadow-brutal bg-white overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-b-2 border-black bg-primary">
                <TableHead className="font-heading font-black text-black">Kata / Slug Terlarang</TableHead>
                <TableHead className="font-heading font-black text-black">Kategori</TableHead>
                <TableHead className="font-heading font-black text-black">Ditambahkan Oleh</TableHead>
                <TableHead className="font-heading font-black text-black">Tanggal Dibuat</TableHead>
                <TableHead className="font-heading font-black text-black text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="divide-y-2 divide-black font-semibold text-xs">
              {filteredWords.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-12 text-neutral-600 font-bold">
                    Tidak ada kata terlarang yang sesuai dengan pencarian Anda.
                  </TableCell>
                </TableRow>
              ) : (
                filteredWords.map((item) => (
                  <TableRow key={item.id} className="hover:bg-cream/40">
                    <TableCell className="py-4 font-mono font-black text-sm text-black">
                      <span className="bg-cream border border-black px-2 py-0.5">
                        /{item.word}
                      </span>
                    </TableCell>
                    <TableCell className="py-4">
                      {item.category === "system" && (
                        <Badge variant="outline" className="font-mono text-[10px] bg-white">
                          RUTE SISTEM
                        </Badge>
                      )}
                      {item.category === "brand" && (
                        <Badge variant="warning" className="font-mono text-[10px]">
                          MEREK DAGANG
                        </Badge>
                      )}
                      {item.category === "security" && (
                        <Badge variant="destructive" className="font-mono text-[10px]">
                          KEAMANAN
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="py-4 font-mono text-[11px] text-neutral-700">
                      {item.addedBy}
                    </TableCell>
                    <TableCell className="py-4 font-mono text-[11px] text-neutral-600">
                      {item.createdAt}
                    </TableCell>
                    <TableCell className="py-4 text-right">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteWord(item.id, item.word)}
                        className="h-8 text-xs border-destructive text-destructive hover:bg-destructive/10"
                      >
                        <Trash2 className="h-3.5 w-3.5 mr-1" />
                        Hapus
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </Card>

      {/* Add Reserved Word Modal */}
      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <DialogContent className="border-[3px] border-black bg-white shadow-brutal-xl sm:max-w-md">
          <form onSubmit={handleAddWord}>
            <DialogHeader className="space-y-2">
              <div className="w-12 h-12 bg-primary text-black border-2 border-black flex items-center justify-center shadow-brutal-sm">
                <Ban className="h-6 w-6" strokeWidth={2.5} />
              </div>
              <DialogTitle className="font-heading font-black text-xl text-black">
                Tambah Kata Terlarang Baru
              </DialogTitle>
              <DialogDescription className="text-xs font-semibold text-neutral-700">
                Slug ini tidak akan dapat dipilih oleh member saat membuat kustom back-half tautan pendek.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              <div className="space-y-1.5">
                <label className="text-xs font-black uppercase tracking-wider text-black">
                  Kata Slug (Huruf kecil, angka, tanda hubung)
                </label>
                <Input
                  type="text"
                  placeholder="contoh-brand-official"
                  value={newWord}
                  onChange={(e) => setNewWord(e.target.value)}
                  required
                  className="font-mono text-sm border-2 border-black bg-white"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-black uppercase tracking-wider text-black">
                  Kategori Pembatasan
                </label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value as "system" | "brand" | "security")}
                  className="w-full border-2 border-black bg-white px-3 py-2 text-xs font-bold outline-none"
                >
                  <option value="system">Rute Sistem (System Route)</option>
                  <option value="brand">Merek Dagang Resmi (Brand Protection)</option>
                  <option value="security">Keamanan &amp; Anti-Impersonasi (Security)</option>
                </select>
              </div>
            </div>

            <DialogFooter className="gap-2 sm:gap-0">
              <Button type="button" variant="outline" onClick={() => setIsAddModalOpen(false)} className="bg-white">
                Batal
              </Button>
              <Button type="submit" variant="default" className="shadow-brutal">
                Kunci Kata Terlarang
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
