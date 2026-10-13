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
  ShieldAlert,
  PlusCircle,
  Search,
  Trash2,
  Globe,
  ShieldCheck,
} from "lucide-react";
import {
  DUMMY_BLOCKED_DOMAINS,
  type DummyBlockedDomain,
} from "@/lib/dummy-data";

export default function DomainTerblokirPage() {
  const [domains, setDomains] = useState<DummyBlockedDomain[]>(DUMMY_BLOCKED_DOMAINS);
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newDomain, setNewDomain] = useState("");
  const [newReason, setNewReason] = useState("");

  const filteredDomains = domains.filter(
    (d) =>
      d.domain.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.reason.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalBlockedAttempts = domains.reduce((acc, curr) => acc + curr.blockedAttempts, 0);

  const handleAddDomain = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDomain.trim() || !newReason.trim()) {
      toast.error("Nama domain dan alasan wajib diisi!");
      return;
    }

    // Clean domain format
    const cleaned = newDomain.replace(/^https?:\/\//, "").replace(/\/.*$/, "").toLowerCase();

    if (domains.some((d) => d.domain === cleaned)) {
      toast.error("Domain ini sudah ada dalam daftar blacklist!");
      return;
    }

    const createdItem: DummyBlockedDomain = {
      id: `dom-${Date.now()}`,
      domain: cleaned,
      reason: newReason,
      addedBy: "Admin Pendek-In",
      createdAt: "Hari ini",
      blockedAttempts: 0,
    };

    setDomains([createdItem, ...domains]);
    toast.success("Domain Berhasil Diblokir!", {
      description: `Domain ${cleaned} kini tidak dapat dipendekkan oleh seluruh pengguna.`,
    });
    setNewDomain("");
    setNewReason("");
    setIsAddModalOpen(false);
  };

  const handleDeleteDomain = (id: string, domainName: string) => {
    setDomains(domains.filter((d) => d.id !== id));
    toast.success("Domain Dihapus dari Blacklist", {
      description: `Domain ${domainName} telah dipulihkan dan dapat dipendekkan kembali.`,
    });
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
            <Badge variant="destructive" className="font-mono text-xs font-bold">
              {domains.length} Domain Dicekal
            </Badge>
          </div>
          <p className="text-sm font-semibold text-neutral-700 mt-1 max-w-2xl">
            Daftar domain berbahaya yang dilarang dipendekkan di sistem Pendek-In untuk mencegah phishing, malware, dan bot penipuan.
          </p>
        </div>

        <Button
          variant="destructive"
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-2 shrink-0 h-11"
        >
          <PlusCircle className="h-5 w-5" strokeWidth={2.5} />
          <span>Tambah Domain Blacklist</span>
        </Button>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Card className="border-[3px] border-black bg-cream shadow-brutal p-5 flex items-center justify-between">
          <div>
            <span className="text-xs font-mono font-bold uppercase text-neutral-600">
              Total Domain Terdaftar
            </span>
            <div className="font-mono text-3xl font-black text-black mt-1">
              {domains.length} Domain
            </div>
            <p className="text-xs font-bold text-neutral-700 mt-1">
              Diperbarui secara real-time di seluruh edge node
            </p>
          </div>
          <div className="w-12 h-12 bg-destructive text-white border-2 border-black flex items-center justify-center shadow-brutal-sm">
            <ShieldAlert className="h-6 w-6" strokeWidth={2.5} />
          </div>
        </Card>

        <Card className="border-[3px] border-black bg-white shadow-brutal p-5 flex items-center justify-between">
          <div>
            <span className="text-xs font-mono font-bold uppercase text-neutral-600">
              Upaya Pemendekan Dicegah
            </span>
            <div className="font-mono text-3xl font-black text-primary-dark mt-1">
              {totalBlockedAttempts.toLocaleString("id-ID")} Kali
            </div>
            <p className="text-xs font-bold text-neutral-700 mt-1">
              Percobaan pembuatan link berbahaya yang berhasil ditolak
            </p>
          </div>
          <div className="w-12 h-12 bg-primary text-black border-2 border-black flex items-center justify-center shadow-brutal-sm">
            <ShieldCheck className="h-6 w-6" strokeWidth={2.5} />
          </div>
        </Card>
      </div>

      {/* Search Bar */}
      <Card className="border-[3px] border-black shadow-brutal bg-white p-4">
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-600" strokeWidth={2.5} />
          <Input
            type="text"
            placeholder="Cari domain atau alasan pemblokiran..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 font-medium text-sm border-2 border-black bg-white h-11"
          />
        </div>
      </Card>

      {/* Blacklist Table */}
      <Card className="border-[3px] border-black shadow-brutal bg-white overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-b-2 border-black bg-destructive text-white">
                <TableHead className="font-heading font-black text-white">Nama Domain</TableHead>
                <TableHead className="font-heading font-black text-white">Alasan Pemblokiran</TableHead>
                <TableHead className="font-heading font-black text-white text-center">Percobaan Dicegah</TableHead>
                <TableHead className="font-heading font-black text-white">Ditambahkan Oleh</TableHead>
                <TableHead className="font-heading font-black text-white">Tanggal</TableHead>
                <TableHead className="font-heading font-black text-white text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="divide-y-2 divide-black font-semibold text-xs">
              {filteredDomains.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-12 text-neutral-600 font-bold">
                    Tidak ada domain terblokir yang cocok dengan pencarian Anda.
                  </TableCell>
                </TableRow>
              ) : (
                filteredDomains.map((item) => (
                  <TableRow key={item.id} className="hover:bg-cream/40">
                    <TableCell className="py-4">
                      <div className="flex items-center gap-2 font-mono font-black text-sm text-black">
                        <Globe className="h-4 w-4 text-destructive" strokeWidth={2.5} />
                        <span>{item.domain}</span>
                      </div>
                    </TableCell>
                    <TableCell className="py-4 font-medium text-neutral-800 max-w-[280px]">
                      {item.reason}
                    </TableCell>
                    <TableCell className="py-4 text-center font-mono font-black text-sm text-destructive">
                      {item.blockedAttempts.toLocaleString("id-ID")}x
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
                        onClick={() => handleDeleteDomain(item.id, item.domain)}
                        className="h-8 text-xs border-destructive text-destructive hover:bg-destructive/10"
                      >
                        <Trash2 className="h-3.5 w-3.5 mr-1" />
                        Cabut Blokir
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </Card>

      {/* Add Domain Modal */}
      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <DialogContent className="border-[3px] border-black bg-white shadow-brutal-xl sm:max-w-md">
          <form onSubmit={handleAddDomain}>
            <DialogHeader className="space-y-2">
              <div className="w-12 h-12 bg-destructive text-white border-2 border-black flex items-center justify-center shadow-brutal-sm">
                <ShieldAlert className="h-6 w-6" strokeWidth={2.5} />
              </div>
              <DialogTitle className="font-heading font-black text-xl text-black">
                Tambah Domain ke Blacklist
              </DialogTitle>
              <DialogDescription className="text-xs font-semibold text-neutral-700">
                Setiap URL yang memiliki domain ini akan langsung ditolak saat dibuat oleh pengunjung maupun member.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              <div className="space-y-1.5">
                <label className="text-xs font-black uppercase tracking-wider text-black">
                  Nama Domain (Tanpa http/https)
                </label>
                <Input
                  type="text"
                  placeholder="contoh-phishing-scam.xyz"
                  value={newDomain}
                  onChange={(e) => setNewDomain(e.target.value)}
                  required
                  className="font-mono text-sm border-2 border-black bg-white"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-black uppercase tracking-wider text-black">
                  Alasan Pemblokiran
                </label>
                <Input
                  type="text"
                  placeholder="Contoh: Phishing internet banking, SMS scam undian, malware..."
                  value={newReason}
                  onChange={(e) => setNewReason(e.target.value)}
                  required
                  className="text-xs font-semibold border-2 border-black bg-white"
                />
              </div>
            </div>

            <DialogFooter className="gap-2 sm:gap-0">
              <Button type="button" variant="outline" onClick={() => setIsAddModalOpen(false)} className="bg-white">
                Batal
              </Button>
              <Button type="submit" variant="destructive">
                Simpan &amp; Blokir Domain
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
