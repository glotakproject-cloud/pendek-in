"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Bell,
  Mail,
  ShieldCheck,
  Clock,
  CheckCheck,
  AlertTriangle,
  Award,
  Zap,
  Trash2,
} from "lucide-react";
import { DUMMY_NOTIFICATIONS, type DummyNotification } from "@/lib/dummy-data";

export default function NotifikasiPage() {
  // Preferences State
  const [weeklyDigest, setWeeklyDigest] = useState(true);
  const [clickMilestones, setClickMilestones] = useState(true);
  const [securityAlerts, setSecurityAlerts] = useState(true);
  const [expiryWarnings, setExpiryWarnings] = useState(true);
  const [productUpdates, setProductUpdates] = useState(false);
  const [isSavingPrefs, setIsSavingPrefs] = useState(false);

  // Notification Items State
  const [notifications, setNotifications] = useState<DummyNotification[]>(DUMMY_NOTIFICATIONS);

  const handleSavePreferences = () => {
    setIsSavingPrefs(true);
    setTimeout(() => {
      setIsSavingPrefs(false);
      toast.success("Preferensi Notifikasi Disimpan! 🔔", {
        description: "Pengaturan pengiriman email berkala Anda telah diperbarui.",
      });
    }, 400);
  };

  const handleMarkAllRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, read: true })));
    toast.success("Semua Notifikasi Ditandai Sudah Dibaca!");
  };

  const handleDeleteNotif = (id: string) => {
    setNotifications(notifications.filter((n) => n.id !== id));
    toast.info("Notifikasi dihapus.");
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Page Header */}
      <div className="border-2 border-black bg-white p-6 shadow-brutal flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-black font-heading text-black">
              Notifikasi &amp; Preferensi
            </h1>
            {unreadCount > 0 && (
              <Badge variant="default" className="text-xs">
                {unreadCount} Baru
              </Badge>
            )}
          </div>
          <p className="text-sm font-semibold text-neutral-600 mt-1">
            Atur frekuensi pengiriman laporan berkala dan pantau riwayat peringatan penting akun Anda.
          </p>
        </div>

        {unreadCount > 0 && (
          <Button variant="outline" size="sm" onClick={handleMarkAllRead} className="gap-1.5 shrink-0">
            <CheckCheck className="h-4 w-4" strokeWidth={2.5} />
            <span>Tandai Semua Dibaca</span>
          </Button>
        )}
      </div>

      {/* Grid: 2 Kolom (Kiri: Preferensi Email, Kanan: Riwayat Notifikasi) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Kolom Kiri: Preferensi Notifikasi Email (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <Card>
            <CardHeader className="bg-primary border-b-2 border-black">
              <div className="flex items-center gap-2">
                <Mail className="h-5 w-5 text-black" strokeWidth={2.5} />
                <CardTitle className="text-lg">Preferensi Email</CardTitle>
              </div>
              <CardDescription className="text-black/80 font-medium text-xs">
                Pilih jenis informasi yang ingin Anda terima via email (dimas.pratama@gmail.com).
              </CardDescription>
            </CardHeader>

            <CardContent className="p-5 space-y-4">
              {/* Toggle 1: Weekly Digest */}
              <div className="flex items-start justify-between gap-3 p-3 border-2 border-black bg-cream shadow-brutal-sm">
                <div className="space-y-0.5">
                  <div className="text-xs font-black text-black">Ringkasan Mingguan (Weekly Digest)</div>
                  <div className="text-[11px] font-semibold text-neutral-600 leading-tight">
                    Laporan statistik klik dan performa link teratas dikirim setiap hari Senin pagi.
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={weeklyDigest}
                  onChange={(e) => setWeeklyDigest(e.target.checked)}
                  className="w-5 h-5 border-2 border-black accent-primary cursor-pointer mt-0.5 shrink-0"
                />
              </div>

              {/* Toggle 2: Click Milestones */}
              <div className="flex items-start justify-between gap-3 p-3 border-2 border-black bg-white shadow-brutal-sm">
                <div className="space-y-0.5">
                  <div className="text-xs font-black text-black">Pencapaian Milestone Klik</div>
                  <div className="text-[11px] font-semibold text-neutral-600 leading-tight">
                    Notifikasi otomatis saat link Anda menembus 100, 500, atau 1.000 total klik.
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={clickMilestones}
                  onChange={(e) => setClickMilestones(e.target.checked)}
                  className="w-5 h-5 border-2 border-black accent-primary cursor-pointer mt-0.5 shrink-0"
                />
              </div>

              {/* Toggle 3: Security Alerts */}
              <div className="flex items-start justify-between gap-3 p-3 border-2 border-black bg-white shadow-brutal-sm">
                <div className="space-y-0.5">
                  <div className="text-xs font-black text-black">Peringatan Keamanan Akun</div>
                  <div className="text-[11px] font-semibold text-neutral-600 leading-tight">
                    Login dari perangkat baru atau pembuatan API Key baru yang tidak biasa.
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={securityAlerts}
                  onChange={(e) => setSecurityAlerts(e.target.checked)}
                  className="w-5 h-5 border-2 border-black accent-primary cursor-pointer mt-0.5 shrink-0"
                />
              </div>

              {/* Toggle 4: Expiry Warnings */}
              <div className="flex items-start justify-between gap-3 p-3 border-2 border-black bg-white shadow-brutal-sm">
                <div className="space-y-0.5">
                  <div className="text-xs font-black text-black">Peringatan Tautan Kadaluarsa</div>
                  <div className="text-[11px] font-semibold text-neutral-600 leading-tight">
                    Pengingat 3 hari sebelum tanggal kedaluwarsa link promo Anda berakhir.
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={expiryWarnings}
                  onChange={(e) => setExpiryWarnings(e.target.checked)}
                  className="w-5 h-5 border-2 border-black accent-primary cursor-pointer mt-0.5 shrink-0"
                />
              </div>

              {/* Toggle 5: Product Updates */}
              <div className="flex items-start justify-between gap-3 p-3 border-2 border-black bg-cream shadow-brutal-sm">
                <div className="space-y-0.5">
                  <div className="text-xs font-black text-black">Info Fitur Baru Pendek-In</div>
                  <div className="text-[11px] font-semibold text-neutral-600 leading-tight">
                    Kabar pembaruan teknologi, rilis fitur baru, dan tips optimasi tautan.
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={productUpdates}
                  onChange={(e) => setProductUpdates(e.target.checked)}
                  className="w-5 h-5 border-2 border-black accent-primary cursor-pointer mt-0.5 shrink-0"
                />
              </div>

              <div className="pt-2">
                <Button
                  onClick={handleSavePreferences}
                  variant="default"
                  disabled={isSavingPrefs}
                  className="w-full"
                >
                  {isSavingPrefs ? "Menyimpan..." : "Simpan Preferensi Email"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Kolom Kanan: Riwayat Notifikasi Terbaru (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-heading font-black text-lg text-black flex items-center gap-2">
              <Bell className="h-5 w-5 text-black" strokeWidth={2.5} />
              <span>Aktivitas &amp; Notifikasi Terbaru ({notifications.length})</span>
            </h2>
          </div>

          {notifications.length === 0 ? (
            <Card className="p-8 text-center border-dashed">
              <p className="text-sm font-semibold text-neutral-600">
                Tidak ada notifikasi saat ini. Anda telah membaca semuanya!
              </p>
            </Card>
          ) : (
            <div className="space-y-3">
              {notifications.map((notif) => {
                const getCategoryStyle = () => {
                  switch (notif.category) {
                    case "milestone":
                      return { badge: "bg-primary text-black", icon: Award };
                    case "security":
                      return { badge: "bg-warning text-black", icon: ShieldCheck };
                    case "expiry":
                      return { badge: "bg-destructive text-white", icon: AlertTriangle };
                    default:
                      return { badge: "bg-info text-white", icon: Zap };
                  }
                };

                const style = getCategoryStyle();
                const IconComponent = style.icon;

                return (
                  <Card
                    key={notif.id}
                    className={`transition-all ${
                      !notif.read ? "border-[3px] bg-white shadow-brutal" : "bg-cream/40 opacity-80"
                    }`}
                  >
                    <CardContent className="p-4 sm:p-5">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-start gap-3">
                          <div
                            className={`p-2 border-2 border-black shrink-0 ${style.badge}`}
                          >
                            <IconComponent className="h-4 w-4" strokeWidth={2.5} />
                          </div>

                          <div className="space-y-1">
                            <div className="flex items-center gap-2 flex-wrap">
                              <h3 className="font-heading font-black text-sm text-black">
                                {notif.title}
                              </h3>
                              {!notif.read && (
                                <Badge variant="secondary" className="text-[9px] px-1.5 py-0">
                                  BARU
                                </Badge>
                              )}
                            </div>
                            <p className="text-xs font-semibold text-neutral-700 leading-normal">
                              {notif.message}
                            </p>
                            <div className="flex items-center gap-1.5 text-[10px] font-mono font-bold text-neutral-500 pt-1">
                              <Clock className="h-3 w-3" strokeWidth={2.5} />
                              <span>{notif.timestamp}</span>
                            </div>
                          </div>
                        </div>

                        <Button
                          size="iconSm"
                          variant="ghost"
                          title="Hapus notifikasi"
                          onClick={() => handleDeleteNotif(notif.id)}
                          className="shrink-0 text-neutral-400 hover:text-destructive"
                        >
                          <Trash2 className="h-3.5 w-3.5" strokeWidth={2.5} />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
