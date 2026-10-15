"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Bell,
  Mail,
  ShieldCheck,
  CheckCheck,
  Trash2,
  Save,
} from "lucide-react";
import { DUMMY_NOTIFICATIONS, type DummyNotification } from "@/lib/dummy-data";
import { getUserProfile, updateUserProfile } from "@/actions/profile";

export default function NotifikasiPage() {
  // Preferences State
  const [weeklyDigest, setWeeklyDigest] = useState(true);
  const [clickMilestones, setClickMilestones] = useState(true);
  const [securityAlerts, setSecurityAlerts] = useState(true);
  const [expiryWarnings, setExpiryWarnings] = useState(true);
  const [isSavingPrefs, setIsSavingPrefs] = useState(false);
  const [userEmail, setUserEmail] = useState("pengguna@pendek.in");

  // Notification Items State
  const [notifications, setNotifications] = useState<DummyNotification[]>(DUMMY_NOTIFICATIONS);

  useEffect(() => {
    let isMounted = true;
    getUserProfile().then((res) => {
      if (isMounted && res.success && res.data) {
        setWeeklyDigest(res.data.emailWeeklyDigest);
        if (res.data.email) setUserEmail(res.data.email);
      }
    });

    return () => {
      isMounted = false;
    };
  }, []);

  const handleSavePreferences = async () => {
    setIsSavingPrefs(true);
    try {
      const res = await updateUserProfile({
        emailWeeklyDigest: weeklyDigest,
      });

      if (res.success) {
        toast.success("Preferensi Notifikasi Disimpan! 🔔", {
          description: "Pengaturan pengiriman ringkasan mingguan Anda telah diperbarui ke database.",
        });
      } else {
        toast.error(res.error || "Gagal menyimpan preferensi");
      }
    } catch {
      toast.error("Terjadi kesalahan sistem.");
    } finally {
      setIsSavingPrefs(false);
    }
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
                Pilih jenis informasi yang ingin Anda terima via email ({userEmail}).
              </CardDescription>
            </CardHeader>

            <CardContent className="p-5 space-y-4">
              {/* Toggle 1: Weekly Digest */}
              <div className="flex items-start justify-between gap-3 p-3 border-2 border-black bg-cream shadow-brutal-sm">
                <div>
                  <div className="text-xs font-black text-black">Ringkasan Mingguan (Weekly Digest)</div>
                  <div className="text-[11px] font-semibold text-neutral-600">
                    Laporan komprehensif performa tautan dan total klik setiap hari Senin.
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
                <div>
                  <div className="text-xs font-black text-black">Pencapaian Target Klik (Milestones)</div>
                  <div className="text-[11px] font-semibold text-neutral-600">
                    Notifikasi ketika tautan Anda menembus 100, 1.000, atau 10.000 klik.
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
                <div>
                  <div className="text-xs font-black text-black">Peringatan Keamanan Akun</div>
                  <div className="text-[11px] font-semibold text-neutral-600">
                    Pemberitahuan bila ada pembuatan API Key baru atau login dari browser tak dikenal.
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
              <div className="flex items-start justify-between gap-3 p-3 border-2 border-black bg-cream shadow-brutal-sm">
                <div>
                  <div className="text-xs font-black text-black">Peringatan Tautan Kadaluarsa</div>
                  <div className="text-[11px] font-semibold text-neutral-600">
                    Email pengingat 24 jam sebelum short link yang memiliki batas waktu dinonaktifkan.
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={expiryWarnings}
                  onChange={(e) => setExpiryWarnings(e.target.checked)}
                  className="w-5 h-5 border-2 border-black accent-primary cursor-pointer mt-0.5 shrink-0"
                />
              </div>

              <Button
                onClick={handleSavePreferences}
                disabled={isSavingPrefs}
                variant="default"
                className="w-full gap-2 mt-2"
              >
                <Save className="h-4 w-4" strokeWidth={2.5} />
                <span>{isSavingPrefs ? "Menyimpan..." : "Simpan Preferensi Email"}</span>
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Kolom Kanan: Riwayat Notifikasi Akun (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-black font-heading text-black flex items-center gap-2">
              <Bell className="h-5 w-5 text-primary-dark" strokeWidth={2.5} />
              <span>Aktivitas &amp; Log Notifikasi</span>
            </h2>
            <span className="text-xs font-mono font-bold text-neutral-500">
              Menampilkan {notifications.length} notifikasi
            </span>
          </div>

          {notifications.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center space-y-2">
                <ShieldCheck className="h-8 w-8 text-primary mx-auto" />
                <p className="font-heading font-black text-base text-black">Tidak Ada Notifikasi</p>
                <p className="text-xs font-semibold text-neutral-600">
                  Kotak masuk notifikasi Anda bersih. Semua aktivitas terbaru akan muncul di sini.
                </p>
              </CardContent>
            </Card>
          ) : (
            notifications.map((item) => (
              <Card
                key={item.id}
                className={`transition-all ${
                  item.read ? "bg-white opacity-80" : "bg-cream/40 border-2 border-black shadow-brutal-sm"
                }`}
              >
                <CardContent className="p-4 flex items-start justify-between gap-3">
                  <div className="space-y-1 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-heading font-black text-sm text-black">
                        {item.title}
                      </span>
                      {!item.read && (
                        <Badge variant="default" className="text-[10px] px-1.5 py-0 h-4">
                          Baru
                        </Badge>
                      )}
                      <span className="text-[11px] font-mono text-neutral-500 font-bold">
                        &bull; {item.timestamp}
                      </span>
                    </div>
                    <p className="text-xs font-medium text-neutral-700 leading-relaxed">
                      {item.message}
                    </p>
                  </div>

                  <Button
                    size="iconSm"
                    variant="ghost"
                    onClick={() => handleDeleteNotif(item.id)}
                    className="text-neutral-400 hover:text-destructive shrink-0"
                    title="Hapus Notifikasi"
                  >
                    <Trash2 className="h-4 w-4" strokeWidth={2} />
                  </Button>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
