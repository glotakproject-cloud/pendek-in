"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Gauge,
  Save,
  AlertTriangle,
  RotateCcw,
  Globe,
} from "lucide-react";
import {
  getSystemSettings,
  updateSystemSettings,
  type SystemSettingsData,
} from "@/actions/admin";

export default function PengaturanSistemPage() {
  const [settings, setSettings] = useState<SystemSettingsData>({
    siteName: "Pendek-In",
    maintenanceMode: false,
    guestRateLimitHour: 10,
    memberRateLimitHour: 200,
    apiRateLimitMinute: 120,
    customDomainEnabled: true,
    contactEmail: "admin@pendek.in",
  });
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    getSystemSettings().then((res) => {
      if (res.success && res.data) {
        setSettings(res.data);
      }
    });
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const res = await updateSystemSettings(settings);
      if (res.success) {
        toast.success("Pengaturan Sistem Berhasil Disimpan! ⚙️", {
          description: "Parameter konfigurasi telah diterapkan di seluruh lingkungan runtime.",
        });
      } else {
        toast.error("Gagal menyimpan pengaturan.");
      }
    } catch {
      toast.error("Terjadi kesalahan sistem.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = () => {
    setSettings({
      siteName: "Pendek-In",
      maintenanceMode: false,
      guestRateLimitHour: 10,
      memberRateLimitHour: 200,
      apiRateLimitMinute: 120,
      customDomainEnabled: true,
      contactEmail: "admin@pendek.in",
    });
    toast.info("Pengaturan Dikembalikan ke Default");
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="border-[3px] border-black bg-white p-6 shadow-brutal flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-black font-heading text-black">
              Pengaturan Sistem
            </h1>
            <Badge variant="default" className="font-mono text-xs">
              v1.2.0 Production
            </Badge>
          </div>
          <p className="text-sm font-semibold text-neutral-700 mt-1 max-w-xl">
            Konfigurasi parameter global aplikasi, kuota batas kecepatan (rate limiting), mode maintenance, dan integrasi email server.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleReset} className="bg-white">
            <RotateCcw className="h-4 w-4 mr-1.5" strokeWidth={2.5} />
            Reset Default
          </Button>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-8">
        {/* Section 1: Identitas & Domain Aplikasi */}
        <Card className="border-[3px] border-black shadow-brutal bg-white">
          <CardHeader className="border-b-2 border-black bg-cream p-4 sm:p-6 flex flex-row items-center gap-3">
            <div className="w-10 h-10 bg-primary border-2 border-black flex items-center justify-center shadow-brutal-sm shrink-0">
              <Globe className="h-5 w-5 text-black" strokeWidth={2.5} />
            </div>
            <div>
              <CardTitle className="text-lg font-heading font-black">
                Identitas &amp; Domain Aplikasi
              </CardTitle>
              <CardDescription className="text-xs font-semibold text-neutral-700">
                Nama platform, URL dasar, dan metadata yang ditampilkan ke pengunjung
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent className="p-4 sm:p-6 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-black uppercase tracking-wider text-black">
                  Nama Aplikasi (Site Name)
                </label>
                <Input
                  type="text"
                  value={settings.siteName}
                  onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
                  required
                  className="font-bold border-2 border-black bg-white"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-black uppercase tracking-wider text-black">
                  Email Kontak Bantuan
                </label>
                <Input
                  type="email"
                  value={settings.contactEmail}
                  onChange={(e) => setSettings({ ...settings, contactEmail: e.target.value })}
                  required
                  className="font-mono text-sm border-2 border-black bg-white"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Section 2: Kebijakan Rate Limiting */}
        <Card className="border-[3px] border-black shadow-brutal bg-white">
          <CardHeader className="border-b-2 border-black bg-cream p-4 sm:p-6 flex flex-row items-center gap-3">
            <div className="w-10 h-10 bg-accent border-2 border-black flex items-center justify-center shadow-brutal-sm shrink-0">
              <Gauge className="h-5 w-5 text-black" strokeWidth={2.5} />
            </div>
            <div>
              <CardTitle className="text-lg font-heading font-black">
                Kebijakan Rate Limiting (Ambang Batas Kecepatan)
              </CardTitle>
              <CardDescription className="text-xs font-semibold text-neutral-700">
                Pencegahan serangan DDoS, spam tautan massal, dan brute-force API
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent className="p-4 sm:p-6 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-black uppercase tracking-wider text-black">
                  Tamu / Publik (Per Jam)
                </label>
                <Input
                  type="number"
                  value={settings.guestRateLimitHour}
                  onChange={(e) => setSettings({ ...settings, guestRateLimitHour: Number(e.target.value) })}
                  min={1}
                  max={100}
                  className="font-mono font-bold border-2 border-black bg-white"
                />
                <span className="text-[11px] font-semibold text-neutral-500">Maksimum pemendekan guest</span>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-black uppercase tracking-wider text-black">
                  Member Login (Per Jam)
                </label>
                <Input
                  type="number"
                  value={settings.memberRateLimitHour}
                  onChange={(e) => setSettings({ ...settings, memberRateLimitHour: Number(e.target.value) })}
                  min={10}
                  max={5000}
                  className="font-mono font-bold border-2 border-black bg-white"
                />
                <span className="text-[11px] font-semibold text-neutral-500">Kuota pengguna terdaftar</span>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-black uppercase tracking-wider text-black">
                  Public REST API (Per Menit)
                </label>
                <Input
                  type="number"
                  value={settings.apiRateLimitMinute}
                  onChange={(e) => setSettings({ ...settings, apiRateLimitMinute: Number(e.target.value) })}
                  min={10}
                  max={1000}
                  className="font-mono font-bold border-2 border-black bg-white"
                />
                <span className="text-[11px] font-semibold text-neutral-500">Batas API Bearer Token</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Section 3: Mode Pemeliharaan Sistem */}
        <Card className="border-[3px] border-black shadow-brutal bg-white">
          <CardHeader className="border-b-2 border-black bg-cream p-4 sm:p-6 flex flex-row items-center gap-3">
            <div className="w-10 h-10 bg-destructive text-white border-2 border-black flex items-center justify-center shadow-brutal-sm shrink-0">
              <AlertTriangle className="h-5 w-5" strokeWidth={2.5} />
            </div>
            <div>
              <CardTitle className="text-lg font-heading font-black">
                Mode Pemeliharaan (Maintenance Mode)
              </CardTitle>
              <CardDescription className="text-xs font-semibold text-neutral-700">
                Mengunci seluruh rute publik &amp; member saat terjadi pembaruan arsitektur besar
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent className="p-4 sm:p-6 space-y-4">
            <div className="flex items-center justify-between p-4 border-2 border-black bg-cream shadow-brutal-sm">
              <div>
                <div className="text-sm font-black text-black">Aktifkan Maintenance Mode Global</div>
                <div className="text-xs font-semibold text-neutral-600">
                  Hanya akun dengan peran Super Admin yang dapat mengakses dashboard. Pengunjung akan melihat layar pemeliharaan.
                </div>
              </div>
              <input
                type="checkbox"
                checked={settings.maintenanceMode}
                onChange={(e) => setSettings({ ...settings, maintenanceMode: e.target.checked })}
                className="w-6 h-6 border-2 border-black accent-destructive cursor-pointer"
              />
            </div>
          </CardContent>
        </Card>

        {/* Submit Button Bar */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <Button
            type="submit"
            disabled={isSaving}
            size="lg"
            variant="default"
            className="flex items-center gap-2"
          >
            <Save className="h-5 w-5" strokeWidth={2.5} />
            <span>{isSaving ? "Menyimpan Perubahan..." : "Simpan Semua Pengaturan"}</span>
          </Button>
        </div>
      </form>
    </div>
  );
}
