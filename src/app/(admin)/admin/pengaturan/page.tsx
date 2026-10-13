"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Gauge,
  Mail,
  Save,
  AlertTriangle,
  RotateCcw,
  Globe,
  CheckCircle2,
} from "lucide-react";
import { DUMMY_SYSTEM_SETTINGS } from "@/lib/dummy-data";

export default function PengaturanSistemPage() {
  const [settings, setSettings] = useState(DUMMY_SYSTEM_SETTINGS);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      toast.success("Pengaturan Sistem Berhasil Disimpan! ⚙️", {
        description: "Parameter konfigurasi telah diterapkan di seluruh lingkungan runtime.",
      });
    }, 500);
  };

  const handleReset = () => {
    setSettings(DUMMY_SYSTEM_SETTINGS);
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
                  Base URL Produksi
                </label>
                <Input
                  type="text"
                  value={settings.appUrl}
                  onChange={(e) => setSettings({ ...settings, appUrl: e.target.value })}
                  required
                  className="font-mono text-xs font-bold border-2 border-black bg-white"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-black uppercase tracking-wider text-black">
                Deskripsi Singkat Platform
              </label>
              <Input
                type="text"
                value={settings.siteDescription}
                onChange={(e) => setSettings({ ...settings, siteDescription: e.target.value })}
                required
                className="text-xs font-semibold border-2 border-black bg-white"
              />
            </div>
          </CardContent>
        </Card>

        {/* Section 2: Mode Maintenance (Pemeliharaan) */}
        <Card className="border-[3px] border-black shadow-brutal bg-white">
          <CardHeader className="border-b-2 border-black bg-cream p-4 sm:p-6 flex flex-row items-center gap-3">
            <div className="w-10 h-10 bg-warning border-2 border-black flex items-center justify-center shadow-brutal-sm shrink-0">
              <AlertTriangle className="h-5 w-5 text-black" strokeWidth={2.5} />
            </div>
            <div>
              <CardTitle className="text-lg font-heading font-black">
                Mode Pemeliharaan (Maintenance Mode)
              </CardTitle>
              <CardDescription className="text-xs font-semibold text-neutral-700">
                Kunci akses publik saat pembaruan infrastruktur basis data penting dilakukan
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent className="p-4 sm:p-6 space-y-4">
            <div className="flex items-center justify-between p-4 bg-cream border-2 border-black">
              <div className="space-y-0.5">
                <p className="font-heading font-black text-sm text-black">
                  Status Mode Maintenance
                </p>
                <p className="text-xs font-semibold text-neutral-600">
                  {settings.maintenanceMode
                    ? "Sistem sedang mengunci akses tamu & member umum."
                    : "Sistem beroperasi normal untuk seluruh pengguna."}
                </p>
              </div>

              <button
                type="button"
                onClick={() =>
                  setSettings({ ...settings, maintenanceMode: !settings.maintenanceMode })
                }
                className={`w-14 h-8 border-2 border-black flex items-center p-1 transition-colors ${
                  settings.maintenanceMode ? "bg-destructive justify-end" : "bg-neutral-300 justify-start"
                }`}
              >
                <span className="w-5 h-5 bg-white border border-black inline-block shadow-brutal-sm" />
              </button>
            </div>

            {settings.maintenanceMode && (
              <div className="space-y-1.5 pt-2">
                <label className="text-xs font-black uppercase tracking-wider text-black">
                  Pesan Pemeliharaan untuk Pengunjung
                </label>
                <textarea
                  rows={3}
                  value={settings.maintenanceMessage}
                  onChange={(e) =>
                    setSettings({ ...settings, maintenanceMessage: e.target.value })
                  }
                  className="w-full border-2 border-black p-3 text-xs font-medium text-black focus:outline-none"
                />
              </div>
            )}
          </CardContent>
        </Card>

        {/* Section 3: Batas Kecepatan Permintaan (Rate Limiting) */}
        <Card className="border-[3px] border-black shadow-brutal bg-white">
          <CardHeader className="border-b-2 border-black bg-cream p-4 sm:p-6 flex flex-row items-center gap-3">
            <div className="w-10 h-10 bg-accent border-2 border-black flex items-center justify-center shadow-brutal-sm shrink-0">
              <Gauge className="h-5 w-5 text-black" strokeWidth={2.5} />
            </div>
            <div>
              <CardTitle className="text-lg font-heading font-black">
                Batas Kecepatan &amp; Kuota (Rate Limiting)
              </CardTitle>
              <CardDescription className="text-xs font-semibold text-neutral-700">
                Pencegahan abuse bot, spamming URL, dan beban server berlebih
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent className="p-4 sm:p-6 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1.5 bg-cream border-2 border-black p-4">
                <label className="text-[11px] font-black uppercase text-neutral-700 block">
                  Tamu (Guest / IP)
                </label>
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    min={1}
                    max={100}
                    value={settings.guestRateLimit}
                    onChange={(e) =>
                      setSettings({ ...settings, guestRateLimit: Number(e.target.value) })
                    }
                    className="font-mono font-black text-lg border-2 border-black bg-white h-11"
                  />
                  <span className="text-xs font-bold text-neutral-600">link/jam</span>
                </div>
                <p className="text-[10px] font-medium text-neutral-500 pt-1">
                  Maksimal tautan yang dapat dipendekkan per alamat IP tanpa akun login.
                </p>
              </div>

              <div className="space-y-1.5 bg-cream border-2 border-black p-4">
                <label className="text-[11px] font-black uppercase text-neutral-700 block">
                  Member Terdaftar
                </label>
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    min={10}
                    max={1000}
                    value={settings.memberRateLimit}
                    onChange={(e) =>
                      setSettings({ ...settings, memberRateLimit: Number(e.target.value) })
                    }
                    className="font-mono font-black text-lg border-2 border-black bg-white h-11"
                  />
                  <span className="text-xs font-bold text-neutral-600">link/jam</span>
                </div>
                <p className="text-[10px] font-medium text-neutral-500 pt-1">
                  Batas pemendekan per jam untuk akun pengguna gratis.
                </p>
              </div>

              <div className="space-y-1.5 bg-cream border-2 border-black p-4">
                <label className="text-[11px] font-black uppercase text-neutral-700 block">
                  Public REST API
                </label>
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    min={10}
                    max={600}
                    value={settings.apiRateLimit}
                    onChange={(e) =>
                      setSettings({ ...settings, apiRateLimit: Number(e.target.value) })
                    }
                    className="font-mono font-black text-lg border-2 border-black bg-white h-11"
                  />
                  <span className="text-xs font-bold text-neutral-600">req/menit</span>
                </div>
                <p className="text-[10px] font-medium text-neutral-500 pt-1">
                  Batas request REST API per API Key (Bearer Token).
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Section 4: Konfigurasi Email & Notifikasi Server */}
        <Card className="border-[3px] border-black shadow-brutal bg-white">
          <CardHeader className="border-b-2 border-black bg-cream p-4 sm:p-6 flex flex-row items-center gap-3">
            <div className="w-10 h-10 bg-white border-2 border-black flex items-center justify-center shadow-brutal-sm shrink-0">
              <Mail className="h-5 w-5 text-black" strokeWidth={2.5} />
            </div>
            <div>
              <CardTitle className="text-lg font-heading font-black">
                Integrasi Email &amp; Notifikasi (Resend)
              </CardTitle>
              <CardDescription className="text-xs font-semibold text-neutral-700">
                Penyedia pengiriman email transaksional dan keamanan akun
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent className="p-4 sm:p-6 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-black uppercase tracking-wider text-black">
                  Email Pengirim (Sender From)
                </label>
                <Input
                  type="email"
                  value={settings.senderEmail}
                  onChange={(e) => setSettings({ ...settings, senderEmail: e.target.value })}
                  required
                  className="font-mono text-xs font-bold border-2 border-black bg-white"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-black uppercase tracking-wider text-black">
                  Nama Tampilan Pengirim (Sender Name)
                </label>
                <Input
                  type="text"
                  value={settings.senderName}
                  onChange={(e) => setSettings({ ...settings, senderName: e.target.value })}
                  required
                  className="font-bold text-xs border-2 border-black bg-white"
                />
              </div>
            </div>

            <div className="p-4 bg-cream border-2 border-black flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-primary-dark" strokeWidth={2.5} />
                <div>
                  <p className="font-heading font-black text-xs text-black">
                    Resend API Key Terhubung
                  </p>
                  <p className="text-[11px] font-mono text-neutral-600">
                    Environment key: RESEND_API_KEY (re_xxxxxxxx...)
                  </p>
                </div>
              </div>
              <Badge variant="default" className="text-[10px]">
                AKTIF
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Save Button */}
        <div className="flex justify-end gap-3 pt-2">
          <Button
            type="submit"
            disabled={isSaving}
            size="lg"
            className="shadow-brutal flex items-center gap-2 h-12 px-8 font-heading font-black text-base"
          >
            <Save className="h-5 w-5" strokeWidth={2.5} />
            <span>{isSaving ? "Menyimpan Konfigurasi..." : "Simpan Pengaturan Sistem"}</span>
          </Button>
        </div>
      </form>
    </div>
  );
}
