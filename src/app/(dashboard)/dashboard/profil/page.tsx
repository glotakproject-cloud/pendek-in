"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  User,
  Lock,
  Save,
  ShieldCheck,
} from "lucide-react";
import { getUserProfile, updateUserProfile, type UserProfileData } from "@/actions/profile";
import { createClient } from "@/lib/supabase/client";

export default function ProfilSayaPage() {
  const [profile, setProfile] = useState<UserProfileData | null>(null);
  const [fullName, setFullName] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [isSavingProfile, setIsSavingProfile] = useState(false);

  // Password form state
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);

  useEffect(() => {
    let isMounted = true;

    getUserProfile().then((res) => {
      if (!isMounted) return;
      if (res.success && res.data) {
        setProfile(res.data);
        setFullName(res.data.fullName);
        setAvatarUrl(res.data.avatarUrl || "");
      }
    });

    return () => {
      isMounted = false;
    };
  }, []);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim()) {
      toast.error("Nama lengkap tidak boleh kosong!");
      return;
    }

    setIsSavingProfile(true);
    try {
      const res = await updateUserProfile({
        fullName: fullName.trim(),
        avatarUrl: avatarUrl.trim() || undefined,
      });

      if (res.success) {
        toast.success("Profil Diperbarui! 🎉", {
          description: "Data identitas akun Anda berhasil disimpan ke database.",
        });
      } else {
        toast.error(res.error || "Gagal memperbarui profil.");
      }
    } catch {
      toast.error("Terjadi kesalahan sistem saat menyimpan profil.");
    } finally {
      setIsSavingProfile(false);
    }
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword || !confirmPassword) {
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
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) {
        toast.error(error.message || "Gagal memperbarui kata sandi.");
      } else {
        setNewPassword("");
        setConfirmPassword("");
        toast.success("Kata Sandi Berhasil Diperbarui! 🔐", {
          description: "Gunakan kata sandi baru Anda pada sesi login berikutnya.",
        });
      }
    } catch {
      toast.error("Terjadi kesalahan saat menghubungi server auth.");
    } finally {
      setIsUpdatingPassword(false);
    }
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
            <Badge variant="default">
              {profile?.role === "super_admin" ? "Super Admin" : "Member"}
            </Badge>
          </div>
          <p className="text-sm font-semibold text-neutral-600 mt-1">
            Kelola identitas personal, foto profil, dan kata sandi akun Pendek-In Anda.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="font-mono text-xs">
            Status: {profile?.status === "active" ? "Aktif 🟢" : "Tangguh 🔴"}
          </Badge>
        </div>
      </div>

      {/* Form Identitas */}
      <form onSubmit={handleSaveProfile} className="space-y-6">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <User className="h-5 w-5 text-black" strokeWidth={2.5} />
              <CardTitle>Informasi Pribadi</CardTitle>
            </div>
            <CardDescription>
              Data identitas Anda yang akan digunakan pada sistem dan email laporan.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Avatar Section */}
            <div className="flex flex-col sm:flex-row items-center gap-5 p-4 border-2 border-black bg-cream shadow-brutal-sm">
              <div className="w-20 h-20 border-[3px] border-black bg-primary overflow-hidden shadow-brutal-sm flex items-center justify-center font-heading font-black text-2xl text-black">
                {avatarUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={avatarUrl} alt={fullName} className="w-full h-full object-cover" />
                ) : (
                  fullName.charAt(0).toUpperCase() || "U"
                )}
              </div>
              <div className="space-y-1.5 flex-1 w-full text-center sm:text-left">
                <label className="text-xs font-black uppercase tracking-wider text-black">
                  URL Foto Avatar
                </label>
                <Input
                  value={avatarUrl}
                  onChange={(e) => setAvatarUrl(e.target.value)}
                  placeholder="https://images.unsplash.com/... atau URL gambar publik"
                  className="bg-white h-10"
                />
                <p className="text-[11px] font-semibold text-neutral-500">
                  Masukkan link gambar langsung (JPG/PNG).
                </p>
              </div>
            </div>

            {/* Input Fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-black uppercase tracking-wider text-black">
                  Nama Lengkap
                </label>
                <Input
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Nama Lengkap Anda"
                  className="bg-white h-11"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-black uppercase tracking-wider text-black">
                  Alamat Email (Akun)
                </label>
                <div className="relative">
                  <Input
                    value={profile?.email || ""}
                    disabled
                    className="bg-neutral-100 h-11 pr-8 text-neutral-600 font-mono font-bold cursor-not-allowed"
                  />
                  <ShieldCheck className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-primary-dark" />
                </div>
                <p className="text-[10px] font-semibold text-neutral-500">
                  Email terikat dengan otentikasi login Supabase.
                </p>
              </div>
            </div>

            <Button type="submit" variant="default" disabled={isSavingProfile} className="gap-2">
              <Save className="h-4 w-4" strokeWidth={2.5} />
              <span>{isSavingProfile ? "Menyimpan..." : "Simpan Perubahan Profil"}</span>
            </Button>
          </CardContent>
        </Card>
      </form>

      {/* Ganti Password */}
      <form onSubmit={handleUpdatePassword}>
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Lock className="h-5 w-5 text-black" strokeWidth={2.5} />
              <CardTitle>Keamanan &amp; Kata Sandi</CardTitle>
            </div>
            <CardDescription>
              Perbarui kata sandi akun Anda untuk meningkatkan keamanan.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-black uppercase tracking-wider text-black">
                  Kata Sandi Baru
                </label>
                <Input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Minimal 8 karakter..."
                  className="bg-white h-11"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-black uppercase tracking-wider text-black">
                  Konfirmasi Kata Sandi Baru
                </label>
                <Input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Ulangi kata sandi baru..."
                  className="bg-white h-11"
                />
              </div>
            </div>

            <Button
              type="submit"
              variant="outline"
              disabled={isUpdatingPassword || !newPassword}
              className="gap-2"
            >
              <Save className="h-4 w-4" strokeWidth={2.5} />
              <span>{isUpdatingPassword ? "Memperbarui..." : "Perbarui Kata Sandi"}</span>
            </Button>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}
