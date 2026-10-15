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
  Search,
  Filter,
  Shield,
  Download,
} from "lucide-react";
import { getAuditLogs, type AuditLogItem } from "@/actions/admin";

export default function LogAktivitasAdminPage() {
  const [logs, setLogs] = useState<AuditLogItem[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [targetTypeFilter, setTargetTypeFilter] = useState<string>("all");
  const [isLoading, setIsLoading] = useState(true);

  const fetchLogs = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await getAuditLogs({
        targetType: targetTypeFilter !== "all" ? targetTypeFilter : undefined,
        limit: 100,
      });

      if (res.success && res.data) {
        setLogs(res.data);
      }
    } catch {
      toast.error("Gagal memuat log aktivitas");
    } finally {
      setIsLoading(false);
    }
  }, [targetTypeFilter]);

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  const filteredLogs = logs.filter((log) => {
    const q = searchQuery.toLowerCase();
    const metaStr = JSON.stringify(log.metadata || "").toLowerCase();
    return (
      log.actorName.toLowerCase().includes(q) ||
      log.action.toLowerCase().includes(q) ||
      (log.targetId && log.targetId.toLowerCase().includes(q)) ||
      metaStr.includes(q)
    );
  });

  const handleExportCSV = () => {
    if (filteredLogs.length === 0) {
      toast.info("Tidak ada log untuk diekspor");
      return;
    }

    const headers = ["ID", "Waktu", "Aksi", "Tipe Target", "Target ID", "Aktor", "Metadata"];
    const rows = filteredLogs.map((l) => [
      l.id,
      l.createdAt,
      l.action,
      l.targetType || "-",
      l.targetId || "-",
      l.actorName,
      JSON.stringify(l.metadata || "").replace(/"/g, '""'),
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((e) => `"${e.join('","')}"`)].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `audit_logs_pendekin_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast.success("Audit Log Berhasil Diekspor! 📥");
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="border-[3px] border-black bg-white p-6 shadow-brutal flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-black font-heading text-black">
              Log Aktivitas &amp; Audit Trail
            </h1>
            <Badge variant="outline" className="font-mono text-xs font-bold bg-cream">
              {logs.length} Rekaman Log
            </Badge>
          </div>
          <p className="text-sm font-semibold text-neutral-700 mt-1 max-w-2xl">
            Catatan kronologis immutable atas setiap tindakan administratif Super Admin untuk transparansi, akuntabilitas, dan keamanan sistem.
          </p>
        </div>

        <Button
          variant="outline"
          onClick={handleExportCSV}
          className="flex items-center gap-2 shrink-0 h-11 bg-white"
        >
          <Download className="h-4 w-4" strokeWidth={2.5} />
          <span>Ekspor CSV</span>
        </Button>
      </div>

      {/* Immutable Security Notice */}
      <div className="bg-cream border-[3px] border-black p-4 shadow-brutal flex items-start gap-3">
        <Shield className="h-5 w-5 text-black shrink-0 mt-0.5" strokeWidth={2.5} />
        <p className="text-xs font-semibold text-neutral-800 leading-relaxed">
          <strong>Keamanan Audit Log:</strong> Sesuai Bab 10 PRD, seluruh entri di tabel <code className="bg-white border border-black px-1 font-mono font-bold">audit_logs</code> bersifat <em>append-only &amp; immutable</em> (tidak dapat diedit atau dihapus oleh siapapun) untuk mencegah manipulasi jejak forensik keamanan.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <Card className="border-[3px] border-black shadow-brutal bg-white p-4">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-600" strokeWidth={2.5} />
            <Input
              type="text"
              placeholder="Cari berdasarkan aksi, target, aktor, atau alasan metadata..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 font-medium text-sm border-2 border-black bg-white h-11"
            />
          </div>

          <div className="flex items-center gap-2.5 flex-wrap sm:flex-nowrap">
            <div className="flex items-center gap-1.5 border-2 border-black bg-white px-3 py-2 shadow-brutal-sm">
              <Filter className="h-4 w-4 text-black" strokeWidth={2.5} />
              <select
                value={targetTypeFilter}
                onChange={(e) => setTargetTypeFilter(e.target.value)}
                className="bg-transparent text-xs font-mono font-bold text-black focus:outline-none cursor-pointer"
              >
                <option value="all">Semua Tipe Target</option>
                <option value="link">Tautan (Link)</option>
                <option value="user">Pengguna (User)</option>
                <option value="domain">Domain</option>
                <option value="reserved_word">Kata Terlarang</option>
                <option value="system">Pengaturan Sistem</option>
              </select>
            </div>
          </div>
        </div>
      </Card>

      {/* Table Audit Logs */}
      <Card className="border-[3px] border-black shadow-brutal bg-white overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-b-2 border-black bg-cream">
                <TableHead className="w-[18%] font-heading font-black text-black">Waktu &amp; Tanggal</TableHead>
                <TableHead className="w-[18%] font-heading font-black text-black">Aksi / Event</TableHead>
                <TableHead className="w-[14%] font-heading font-black text-black">Tipe Target</TableHead>
                <TableHead className="w-[18%] font-heading font-black text-black">Aktor (Admin)</TableHead>
                <TableHead className="w-[32%] font-heading font-black text-black">Detail Metadata</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 font-mono text-sm text-neutral-500">
                    Memuat catatan log audit sistem...
                  </TableCell>
                </TableRow>
              ) : filteredLogs.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-10 font-mono text-sm text-neutral-500">
                    Tidak ada log aktivitas yang cocok dengan kriteria filter.
                  </TableCell>
                </TableRow>
              ) : (
                filteredLogs.map((log) => (
                  <TableRow key={log.id} className="border-b border-neutral-200 hover:bg-cream/20">
                    <TableCell className="font-mono text-xs font-bold text-neutral-600 py-3.5">
                      {new Date(log.createdAt).toLocaleString("id-ID", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </TableCell>

                    <TableCell className="py-3.5">
                      <span className="font-mono text-xs font-black px-2 py-0.5 border-2 border-black bg-primary/20 shadow-brutal-sm">
                        {log.action}
                      </span>
                    </TableCell>

                    <TableCell className="py-3.5">
                      <span className="font-mono text-xs font-bold text-neutral-700 bg-cream border border-black px-1.5 py-0.5">
                        {log.targetType || "global"}
                      </span>
                    </TableCell>

                    <TableCell className="font-sans text-xs font-black text-black py-3.5">
                      {log.actorName}
                    </TableCell>

                    <TableCell className="font-mono text-xs text-neutral-700 py-3.5">
                      <div className="bg-cream/40 p-2 border border-black text-[11px] break-all max-w-md">
                        {log.targetId && (
                          <div className="font-bold text-black mb-0.5">
                            Target ID: {log.targetId}
                          </div>
                        )}
                        {log.metadata ? JSON.stringify(log.metadata) : "-"}
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  );
}
