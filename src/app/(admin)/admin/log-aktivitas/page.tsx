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
  Search,
  Filter,
  Shield,
  Clock,
  Download,
} from "lucide-react";
import {
  DUMMY_AUDIT_LOGS,
  type DummyAuditLog,
} from "@/lib/dummy-data";

export default function LogAktivitasAdminPage() {
  const [logs] = useState<DummyAuditLog[]>(DUMMY_AUDIT_LOGS);
  const [searchQuery, setSearchQuery] = useState("");
  const [targetTypeFilter, setTargetTypeFilter] = useState<string>("all");
  const [timeFilter, setTimeFilter] = useState<string>("all");

  const filteredLogs = logs.filter((log) => {
    const matchesSearch =
      log.actor.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.target.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.metadata.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType =
      targetTypeFilter === "all" || log.targetType === targetTypeFilter;
    return matchesSearch && matchesType;
  });

  const handleExportCSV = () => {
    toast.success("Audit Log Berhasil Diekspor!", {
      description: "File audit_logs_pendekin_2026.csv telah siap diunduh.",
    });
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

          <div className="flex items-center gap-2 flex-wrap">
            <div className="flex items-center gap-1.5 bg-cream border-2 border-black px-3 py-1.5 h-11">
              <Filter className="h-4 w-4 text-black" strokeWidth={2.5} />
              <select
                value={targetTypeFilter}
                onChange={(e) => setTargetTypeFilter(e.target.value)}
                className="bg-transparent text-xs font-black text-black outline-none cursor-pointer"
              >
                <option value="all">Semua Tipe Target</option>
                <option value="domain">Domain</option>
                <option value="link">Tautan (Link)</option>
                <option value="user">Pengguna (User)</option>
                <option value="word">Kata Terlarang</option>
                <option value="system">Konfigurasi Sistem</option>
              </select>
            </div>

            <div className="flex items-center gap-1.5 bg-cream border-2 border-black px-3 py-1.5 h-11">
              <Clock className="h-4 w-4 text-black" strokeWidth={2.5} />
              <select
                value={timeFilter}
                onChange={(e) => setTimeFilter(e.target.value)}
                className="bg-transparent text-xs font-black text-black outline-none cursor-pointer"
              >
                <option value="all">Semua Waktu</option>
                <option value="24h">24 Jam Terakhir</option>
                <option value="7d">7 Hari Terakhir</option>
                <option value="30d">30 Hari Terakhir</option>
              </select>
            </div>
          </div>
        </div>
      </Card>

      {/* Audit Log Table */}
      <Card className="border-[3px] border-black shadow-brutal bg-white overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-b-2 border-black bg-primary">
                <TableHead className="font-heading font-black text-black">Aksi Audit</TableHead>
                <TableHead className="font-heading font-black text-black">Target</TableHead>
                <TableHead className="font-heading font-black text-black">Detail Metadata &amp; Alasan</TableHead>
                <TableHead className="font-heading font-black text-black">Aktor</TableHead>
                <TableHead className="font-heading font-black text-black">IP Address</TableHead>
                <TableHead className="font-heading font-black text-black text-right">Waktu</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="divide-y-2 divide-black font-semibold text-xs">
              {filteredLogs.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-12 text-neutral-600 font-bold">
                    Tidak ada log audit yang sesuai dengan filter pencarian.
                  </TableCell>
                </TableRow>
              ) : (
                filteredLogs.map((log) => {
                  const isDestructive =
                    log.action.includes("BLOCK") || log.action.includes("SUSPEND");
                  const isWarning =
                    log.action.includes("ADD") || log.action.includes("RESET");

                  return (
                    <TableRow key={log.id} className="hover:bg-cream/40">
                      {/* Action */}
                      <TableCell className="py-4">
                        <Badge
                          variant={
                            isDestructive
                              ? "destructive"
                              : isWarning
                              ? "warning"
                              : "outline"
                          }
                          className="font-mono text-[11px] font-black"
                        >
                          {log.action}
                        </Badge>
                      </TableCell>

                      {/* Target */}
                      <TableCell className="py-4 font-mono font-black text-xs text-black max-w-[180px] truncate">
                        {log.target}
                      </TableCell>

                      {/* Metadata */}
                      <TableCell className="py-4 font-medium text-neutral-800 max-w-[320px]">
                        {log.metadata}
                      </TableCell>

                      {/* Actor */}
                      <TableCell className="py-4 font-bold text-black">
                        <div>
                          <p>{log.actor}</p>
                          <span className="font-mono text-[10px] text-neutral-500 uppercase">
                            {log.actorRole}
                          </span>
                        </div>
                      </TableCell>

                      {/* IP Address */}
                      <TableCell className="py-4 font-mono text-[11px] text-neutral-600">
                        {log.ipAddress}
                      </TableCell>

                      {/* Timestamp */}
                      <TableCell className="py-4 text-right font-mono text-[11px] text-neutral-700">
                        {log.timestamp}
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  );
}
