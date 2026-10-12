"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  User,
  Lock,
  Camera,
  Save,
  CheckCircle2,
  AlertTriangle,
  Mail,
  Smartphone,
  Calendar,
  KeyRound,
} from "lucide-react";
import { DUMMY_USER_PROFILE } from "@/lib/dummy-data";

export default function ProfilSayaPage() {
  // Profile form state
  const [name, setName] = useState(DUMMY_USER_PROFILE.name);
  const [username, setUsername] = useState(DUMMY_USER_PROFILE.username);
  const [phone, setPhone] = useState(DUMMY_USER_PROFILE.phone);
  const [bio, setBio] = useState(DUMMY_USER_PROFILE.bio);
  const [isSavingProfile, setIsSavingProfile] = useState(false);

  // Password form state
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);

  // Danger zone modal state
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingProfile(true);
    setTimeout(() => {
      setIsSavingProfile(false);
      toast.success("Profil Diperbarui! 🎉", {
        description: "Data identitas akun Anda berhasil disimpan.",
      });
    }, 400);
  };

  const handleUpdatePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error("Semua kolom kata sandi wajib diisi!");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("Konfirmasi sandi baru tidak cocok!");
      return;
    }
    if (newPassword.length < 8) {
      toast.error("Kata sandi baru minimal 8 karakter!");
      return;
    }

    setIsUpdatingPassword(true);
    setTimeout(() => {
      setIsUpdatingPassword(false);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      toast.success("Kata Sandi Berhasil Diperbarui! 🔐", {
        description: "Gunakan kata sandi baru Anda pada sesi login berikutnya.",
      });
    }, 500);
  };

  const handleDeleteAccount = () => {
    toast.error("Akun Telah Dihapus!", {
      description: "Sesi Anda telah dihentikan.",
    });
    setIsDeleteModalOpen(false);
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="border-2 border-black bg-white p-6 shadow-brutal flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-black font-heading text-black">
              Profil Saya
            </h1>
            <Badge variant="default">Akun Member</Badge>
          </div>
          <p className="text-sm font-semibold text-neutral-600 mt-1">
            Kelola data akun, informasi kontak, dan keamanan kata sandi Anda.
          </p>
        </div>

        <div className="flex items-center gap-2 font-mono text-xs font-bold text-neutral-600 bg-cream px-3 py-1.5 border border-black shadow-brutal-sm">
          <Calendar className="h-4 w-4" strokeWidth={2.5} />
          <span>Bergabung sejak {DUMMY_USER_PROFILE.joinedAt}</span>
        </div>
      </div>

      {/* Section 1: Informasi Profil */}
      <form onSubmit={handleSaveProfile}>
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <User className="h-5 w-5 text-primary-dark" strokeWidth={2.5} />
              <CardTitle>Informasi Data Diri</CardTitle>
            </div>
            <CardDescription>
              Informasi dasar yang tampil di dashboard dan laporan tautan Anda.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Avatar Row */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-5 p-4 border-2 border-black bg-cream shadow-brutal-sm">
              <div className="w-20 h-20 bg-primary border-[3px] border-black flex items-center justify-center font-heading font-black text-2xl shadow-brutal-sm shrink-0">
                DP
              </div>
              <div className="space-y-2">
                <div className="font-heading font-black text-base text-black">
                  Foto / Avatar Profil
                </div>
                <p className="text-xs font-semibold text-neutral-600">
                  Dukung format PNG, JPG, atau WebP (maks. 2MB).
                </p>
                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => toast.info("Fitur upload gambar akan aktif di Fase 2.")}
                    className="gap-1.5"
                  >
                    <Camera className="h-3.5 w-3.5" strokeWidth={2.5} />
                    <span>Ubah Foto Avatar</span>
                  </Button>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {/* Nama Lengkap */}
              <div className="space-y-1.5">
                <label className="text-xs font-black uppercase tracking-wider text-black">
                  Nama Lengkap <span className="text-destructive">*</span>
                </label>
                <Input
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="h-11 bg-white"
                />
              </div>

              {/* Username */}
              <div className="space-y-1.5">
                <label className="text-xs font-black uppercase tracking-wider text-black">
                  Nama Pengguna (Username)
                </label>
                <div className="flex items-center border-2 border-black bg-cream shadow-brutal-sm">
                  <span className="px-3 text-xs font-mono font-bold text-neutral-500 border-r-2 border-black">
                    @
                  </span>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full h-11 px-3 bg-white font-mono text-sm font-bold text-black focus:outline-none"
                  />
                </div>
              </div>

              {/* Email (Read Only) */}
              <div className="space-y-1.5">
                <label className="text-xs font-black uppercase tracking-wider text-black flex items-center justify-between">
                  <span>Alamat Email</span>
                  <Badge variant="default" className="text-[10px] py-0 gap-1">
                    <CheckCircle2 className="h-3 w-3" strokeWidth={2.5} />
                    Terverifikasi
                  </Badge>
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-500" strokeWidth={2.5} />
                  <Input
                    disabled
                    value={DUMMY_USER_PROFILE.email}
                    className="pl-10 h-11 bg-cream/70 text-neutral-600 font-mono text-xs cursor-not-allowed border-dashed"
                  />
                </div>
                <p className="text-[11px] font-semibold text-neutral-500">
                  Email terikat dengan login Google / Supabase Auth.
                </p>
              </div>

              {/* WhatsApp */}
              <div className="space-y-1.5">
                <label className="text-xs font-black uppercase tracking-wider text-black">
                  Nomor WhatsApp / Kontak
                </label>
                <div className="relative">
                  <Smartphone className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-500" strokeWidth={2.5} />
                  <Input
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="pl-10 h-11 bg-white font-mono text-xs"
                  />
                </div>
              </div>
            </div>

            {/* Bio Singkat */}
            <div className="space-y-1.5">
              <label className="text-xs font-black uppercase tracking-wider text-black">
                Bio Singkat
              </label>
              <textarea
                rows={3}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="w-full border-2 border-black bg-white p-3 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-primary shadow-brutal-sm"
              />
            </div>

            <div className="pt-2 flex justify-end">
              <Button type="submit" variant="default" disabled={isSavingProfile} className="gap-2">
                <Save className="h-4 w-4" strokeWidth={2.5} />
                <span>{isSavingProfile ? "Menyimpan..." : "Simpan Perubahan Profil"}</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>

      {/* Section 2: Keamanan & Sandi */}
      <form onSubmit={handleUpdatePassword}>
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <KeyRound className="h-5 w-5 text-black" strokeWidth={2.5} />
              <CardTitle>Keamanan &amp; Kata Sandi</CardTitle>
            </div>
            <CardDescription>
              Perbarui kata sandi akun Anda secara berkala untuk menjaga keamanan koleksi tautan dan API Key.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-5">
            <div className="space-y-1.5">
              <label className="text-xs font-black uppercase tracking-wider text-black">
                Kata Sandi Saat Ini <span className="text-destructive">*</span>
              </label>
              <Input
                type="password"
                placeholder="••••••••••••"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="h-11 bg-white"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="space-y-1.5">
                <label className="text-xs font-black uppercase tracking-wider text-black">
                  Kata Sandi Baru <span className="text-destructive">*</span>
                </label>
                <Input
                  type="password"
                  placeholder="Minimal 8 karakter..."
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="h-11 bg-white"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-black uppercase tracking-wider text-black">
                  Ulangi Kata Sandi Baru <span className="text-destructive">*</span>
                </label>
                <Input
                  type="password"
                  placeholder="Ulangi sandi baru..."
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="h-11 bg-white"
                />
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <Button
                type="submit"
                variant="outline"
                disabled={isUpdatingPassword}
                className="gap-2"
              >
                <Lock className="h-4 w-4" strokeWidth={2.5} />
                <span>{isUpdatingPassword ? "Memperbarui..." : "Perbarui Kata Sandi"}</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>

      {/* Section 3: Zona Bahaya (Danger Zone) */}
      <Card className="border-destructive/80 bg-destructive/5">
        <CardHeader>
          <CardTitle className="text-destructive flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" strokeWidth={2.5} />
            Zona Bahaya (Hapus Akun)
          </CardTitle>
          <CardDescription>
            Menghapus akun akan memusnahkan seluruh riwayat tautan, kode QR, data analitik pengunjung, dan API Key secara permanen.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <p className="text-xs font-semibold text-neutral-700 max-w-lg">
            Setelah dihapus, akun dan domain slug yang pernah Anda gunakan tidak dapat dipulihkan kembali.
          </p>
          <Button
            type="button"
            variant="destructive"
            onClick={() => setIsDeleteModalOpen(true)}
            className="shrink-0"
          >
            Hapus Akun Saya
          </Button>
        </CardContent>
      </Card>

      {/* Modal Konfirmasi Hapus Akun */}
      <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-destructive flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" strokeWidth={2.5} />
              Konfirmasi Penghapusan Akun
            </DialogTitle>
            <DialogDescription className="font-semibold text-black">
              Apakah Anda yakin ingin menghapus akun Pendek-In Anda secara permanen? Tindakan ini tidak dapat dibatalkan.
            </DialogDescription>
          </DialogHeader>
          <div className="p-3 border-2 border-black bg-cream text-xs font-mono space-y-1">
            <div className="font-black text-black">Dimas Pratama ({DUMMY_USER_PROFILE.email})</div>
            <div className="text-destructive font-bold">Semua 8 tautan dan 8.449 data klik akan dihapus.</div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteModalOpen(false)}>
              Batal
            </Button>
            <Button variant="destructive" onClick={handleDeleteAccount}>
              Saya Mengerti, Hapus Akun
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
