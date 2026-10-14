"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { QRCodeSVG } from "qrcode.react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Link2,
  Sparkles,
  ArrowLeft,
  CheckCircle2,
  XCircle,
  Lock,
  Calendar,
  FileText,
  ChevronDown,
  ChevronUp,
  RefreshCw,
  Eye,
} from "lucide-react";

import { createLink, checkSlugAvailability } from "@/actions/links";
import { generateRandomSlug } from "@/lib/validations/link";

export default function BuatTautanBaruPage() {
  const router = useRouter();

  // Form State
  const [originalUrl, setOriginalUrl] = useState("");
  const [title, setTitle] = useState("");
  const [customSlug, setCustomSlug] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>(["Bisnis"]);

  // Advanced Options State
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [expiresAt, setExpiresAt] = useState("");
  const [password, setPassword] = useState("");
  const [notes, setNotes] = useState("");

  // Slug Availability State: 'idle' | 'checking' | 'available' | 'taken' | 'reserved'
  const [slugStatus, setSlugStatus] = useState<"idle" | "checking" | "available" | "taken" | "reserved">("idle");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Quick tag toggler
  const availableTags = ["Bisnis", "Promo", "E-Commerce", "Edukasi", "Personal", "Portfolio", "Event"];

  const handleToggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter((t) => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const handleRandomizeSlug = () => {
    const randomCode = generateRandomSlug(6);
    setCustomSlug(randomCode);
    setSlugStatus("available");
  };

  const handleCheckSlug = async () => {
    const trimmed = customSlug.trim().toLowerCase();
    if (!trimmed) {
      toast.error("Masukkan kata back-half terlebih dahulu!");
      return;
    }

    setSlugStatus("checking");

    try {
      const res = await checkSlugAvailability(trimmed);
      if (res.available) {
        setSlugStatus("available");
        toast.success("Slug Tersedia! 🎉", {
          description: `Slug "pendek.in/s/${trimmed}" siap Anda gunakan.`,
        });
      } else if (res.status === "reserved") {
        setSlugStatus("reserved");
        toast.error("Slug Tidak Tersedia!", {
          description: res.message,
        });
      } else {
        setSlugStatus("taken");
        toast.error("Slug Sudah Terpakai!", {
          description: res.message,
        });
      }
    } catch {
      setSlugStatus("idle");
      toast.error("Gagal memeriksa ketersediaan slug.");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!originalUrl) {
      toast.error("URL Asli Wajib Diisi!", {
        description: "Masukkan tautan target yang ingin Anda perpendek.",
      });
      return;
    }

    if (slugStatus === "reserved" || slugStatus === "taken") {
      toast.error("Slug Belum Valid!", {
        description: "Silakan ubah back-half kustom Anda sebelum melanjutkan.",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await createLink({
        original_url: originalUrl,
        custom_slug: customSlug.trim() || undefined,
        title: title.trim() || undefined,
        description: notes.trim() || undefined,
        tags: selectedTags,
        expires_at: expiresAt || undefined,
        password: password.trim() || undefined,
      });

      if (!res.success) {
        toast.error("Gagal Membuat Tautan", {
          description: res.error || "Terjadi kesalahan saat menyimpan tautan.",
        });
        setIsSubmitting(false);
        return;
      }

      toast.success("Tautan Berhasil Dibuat! 🚀", {
        description: `Tautan "${title || "Tautan Baru"}" telah aktif dan siap disebarkan.`,
      });
      router.push("/dashboard/tautan");
    } catch {
      toast.error("Terjadi kesalahan sistem saat membuat tautan.");
      setIsSubmitting(false);
    }
  };

  const previewSlug = customSlug.trim() || "link-anda";
  const previewShortUrl = `https://pendek.in/s/${previewSlug}`;

  return (
    <div className="space-y-6">
      {/* Top Header & Breadcrumb */}
      <div className="border-2 border-black bg-white p-6 shadow-brutal flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Button variant="ghost" size="sm" asChild className="p-0 h-auto hover:bg-transparent">
              <Link href="/dashboard/tautan" className="text-neutral-600 hover:text-black flex items-center gap-1 font-bold">
                <ArrowLeft className="h-4 w-4" strokeWidth={2.5} />
                Kembali ke Kelola Tautan
              </Link>
            </Button>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black font-heading text-black">
            Buat Tautan Baru
          </h1>
          <p className="text-sm font-semibold text-neutral-600">
            Perpendek URL panjang, atur slug kustom branding Anda, dan unduh kode QR dinamis.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Main Form (7 cols) */}
        <form onSubmit={handleSubmit} className="lg:col-span-7 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Informasi Dasar Tautan</CardTitle>
              <CardDescription>
                Tentukan alamat tujuan dan identitas utama tautan yang akan dipendekkan.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              {/* Target URL */}
              <div className="space-y-1.5">
                <label className="text-xs font-black uppercase tracking-wider text-black flex items-center justify-between">
                  <span>URL Target Asli <span className="text-destructive">*</span></span>
                  <span className="text-[11px] font-mono text-neutral-500 font-normal">Wajib diisi</span>
                </label>
                <div className="relative">
                  <Link2 className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-neutral-500" strokeWidth={2.5} />
                  <Input
                    required
                    type="url"
                    placeholder="https://tokoanda.com/katalog/produk-terbaru?ref=instagram"
                    value={originalUrl}
                    onChange={(e) => setOriginalUrl(e.target.value)}
                    className="pl-11 h-12 text-sm bg-white"
                  />
                </div>
                <p className="text-[11px] font-semibold text-neutral-500">
                  Harus diawali dengan <code className="bg-cream px-1 py-0.5 border border-black font-mono">http://</code> atau <code className="bg-cream px-1 py-0.5 border border-black font-mono">https://</code>
                </p>
              </div>

              {/* Title */}
              <div className="space-y-1.5">
                <label className="text-xs font-black uppercase tracking-wider text-black">
                  Judul Tautan (Opsional)
                </label>
                <Input
                  placeholder="Contoh: Buket Bunga Pernikahan Promo Spesial"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="h-12 text-sm bg-white"
                />
                <p className="text-[11px] font-semibold text-neutral-500">
                  Judul membantu Anda mengidentifikasi tautan ini di dashboard analitik.
                </p>
              </div>

              {/* Tags */}
              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-wider text-black">
                  Label Kategori / Tag
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {availableTags.map((tag) => {
                    const isSelected = selectedTags.includes(tag);
                    return (
                      <button
                        type="button"
                        key={tag}
                        onClick={() => handleToggleTag(tag)}
                        className={`text-xs font-bold font-mono px-2.5 py-1 border-2 border-black transition-all ${
                          isSelected
                            ? "bg-primary text-black shadow-brutal-sm"
                            : "bg-white text-neutral-700 hover:bg-cream"
                        }`}
                      >
                        #{tag} {isSelected ? "✓" : "+"}
                      </button>
                    );
                  })}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Section: Kustom Back-Half */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Kustom Back-Half (Slug)</CardTitle>
                  <CardDescription>
                    Buat tautan dengan nama brand Anda agar lebih profesional dan mudah diingat.
                  </CardDescription>
                </div>
                <Badge variant="secondary">Fitur Utama</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-black uppercase tracking-wider text-black">
                  Alamat URL Pendek Anda
                </label>
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                  <div className="flex items-center flex-1 border-2 border-black bg-cream shadow-brutal-sm">
                    <span className="px-3 py-2 text-xs font-mono font-black text-black bg-cream shrink-0 border-r-2 border-black">
                      pendek.in/s/
                    </span>
                    <input
                      type="text"
                      placeholder="kustom-nama-slug"
                      value={customSlug}
                      onChange={(e) => {
                        setCustomSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-_]/g, ""));
                        setSlugStatus("idle");
                      }}
                      className="w-full h-11 px-3 bg-white font-mono text-sm font-bold text-black focus:outline-none"
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="default"
                      onClick={handleCheckSlug}
                      className="h-11 shrink-0"
                    >
                      <Sparkles className="h-4 w-4 mr-1 text-primary-dark" strokeWidth={2.5} />
                      <span>Cek Ketersediaan</span>
                    </Button>

                    <Button
                      type="button"
                      variant="cream"
                      size="icon"
                      title="Buat slug acak otomatis"
                      onClick={handleRandomizeSlug}
                      className="h-11 w-11 shrink-0"
                    >
                      <RefreshCw className="h-4 w-4" strokeWidth={2.5} />
                    </Button>
                  </div>
                </div>

                {/* Slug Status Feedback Banner */}
                {slugStatus === "available" && (
                  <div className="p-3 border-2 border-black bg-primary/20 text-xs font-bold text-black flex items-center gap-2 shadow-brutal-sm mt-2">
                    <CheckCircle2 className="h-4 w-4 text-primary-dark shrink-0" strokeWidth={2.5} />
                    <span>Hore! Slug <code className="font-mono bg-white px-1 border border-black font-black">pendek.in/s/{customSlug}</code> tersedia untuk digunakan!</span>
                  </div>
                )}
                {slugStatus === "taken" && (
                  <div className="p-3 border-2 border-black bg-destructive/15 text-xs font-bold text-destructive flex items-center gap-2 shadow-brutal-sm mt-2">
                    <XCircle className="h-4 w-4 shrink-0" strokeWidth={2.5} />
                    <span>Slug <code className="font-mono bg-white px-1 border border-black font-black">{customSlug}</code> sudah terpakai. Coba tambahkan tahun atau angka unik!</span>
                  </div>
                )}
                {slugStatus === "reserved" && (
                  <div className="p-3 border-2 border-black bg-warning/30 text-xs font-bold text-black flex items-center gap-2 shadow-brutal-sm mt-2">
                    <XCircle className="h-4 w-4 text-destructive shrink-0" strokeWidth={2.5} />
                    <span>Slug <code className="font-mono bg-white px-1 border border-black font-black">{customSlug}</code> adalah kata terlarang (reserved word).</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Opsi Lanjutan (Accordion Toggle) */}
          <Card>
            <button
              type="button"
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="w-full p-5 flex items-center justify-between text-left font-black text-sm uppercase tracking-wider text-black hover:bg-cream transition-colors"
            >
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4" strokeWidth={2.5} />
                <span>Opsi Lanjutan (Kadaluarsa, Sandi, &amp; Catatan)</span>
              </div>
              {showAdvanced ? (
                <ChevronUp className="h-5 w-5" strokeWidth={2.5} />
              ) : (
                <ChevronDown className="h-5 w-5" strokeWidth={2.5} />
              )}
            </button>

            {showAdvanced && (
              <CardContent className="p-6 pt-0 border-t-2 border-black space-y-5">
                {/* Tanggal Kadaluarsa */}
                <div className="space-y-1.5 pt-4">
                  <label className="text-xs font-black uppercase tracking-wider text-black flex items-center gap-1.5">
                    <Calendar className="h-4 w-4" strokeWidth={2.5} />
                    <span>Tanggal Kadaluarsa (Opsional)</span>
                  </label>
                  <Input
                    type="date"
                    value={expiresAt}
                    onChange={(e) => setExpiresAt(e.target.value)}
                    className="h-11 bg-white"
                  />
                  <p className="text-[11px] font-semibold text-neutral-500">
                    Setelah tanggal ini tercapai, tautan akan otomatis dinonaktifkan.
                  </p>
                </div>

                {/* Password Protection */}
                <div className="space-y-1.5">
                  <label className="text-xs font-black uppercase tracking-wider text-black flex items-center gap-1.5">
                    <Lock className="h-4 w-4" strokeWidth={2.5} />
                    <span>Sandi Pengaman Tautan (Opsional)</span>
                  </label>
                  <Input
                    type="password"
                    placeholder="Masukkan sandi jika tautan bersifat rahasia..."
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="h-11 bg-white"
                  />
                  <p className="text-[11px] font-semibold text-neutral-500">
                    Pengunjung harus memasukkan sandi ini sebelum diarahkan ke URL asli.
                  </p>
                </div>

                {/* Internal Notes */}
                <div className="space-y-1.5">
                  <label className="text-xs font-black uppercase tracking-wider text-black">
                    Catatan Internal (Hanya untuk Anda)
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Contoh: Tautan khusus campaign webinar batch 3 dengan influencer..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full border-2 border-black bg-white p-3 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-primary shadow-brutal-sm"
                  />
                </div>
              </CardContent>
            )}
          </Card>

          {/* Form Actions */}
          <div className="flex items-center gap-3 pt-2">
            <Button
              type="submit"
              size="lg"
              variant="default"
              disabled={isSubmitting}
              className="flex-1"
            >
              {isSubmitting ? "Membuat Tautan..." : "Buat Tautan Pendek Sekarang"}
            </Button>
            <Button
              type="button"
              size="lg"
              variant="outline"
              onClick={() => router.push("/dashboard/tautan")}
            >
              Batal
            </Button>
          </div>
        </form>

        {/* Live Preview Card (5 cols) */}
        <div className="lg:col-span-5 sticky top-24 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black font-mono uppercase text-neutral-600 flex items-center gap-1.5">
              <Eye className="h-4 w-4" strokeWidth={2.5} />
              Pratinjau Langsung (Live Preview)
            </span>
            <Badge variant="secondary">Real-Time</Badge>
          </div>

          <Card className="border-[3px] border-black bg-white shadow-brutal-lg">
            <CardHeader className="bg-primary border-b-2 border-black p-4">
              <div className="flex items-center justify-between">
                <Badge variant="outline" className="bg-white text-[10px]">
                  Tautan Pendek
                </Badge>
                <span className="font-mono text-[11px] font-black text-black">
                  Status: Aktif
                </span>
              </div>
              <h3 className="font-heading font-black text-lg text-black mt-2 leading-tight">
                {title || "Judul Tautan Anda Muncul di Sini"}
              </h3>
            </CardHeader>

            <CardContent className="p-5 space-y-4">
              {/* Short URL Box */}
              <div className="p-3 border-2 border-black bg-cream shadow-brutal-sm space-y-1">
                <div className="text-[10px] font-mono uppercase font-black text-neutral-500">
                  Tautan Pendek Siap Bagikan
                </div>
                <div className="font-mono text-sm font-black text-primary-dark break-all">
                  {previewShortUrl}
                </div>
              </div>

              {/* Original URL Box */}
              <div className="space-y-1">
                <div className="text-[10px] font-mono uppercase font-black text-neutral-500">
                  Tujuan Asli (Redirect Destination)
                </div>
                <p className="text-xs font-semibold text-neutral-700 break-all bg-white p-2 border border-black">
                  {originalUrl || "https://contoh-url-tujuan-anda.com/halaman-spesial"}
                </p>
              </div>

              {/* Tags Preview */}
              {selectedTags.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {selectedTags.map((tag) => (
                    <span
                      key={tag}
                      className="text-[10px] font-mono font-bold px-1.5 py-0.5 border border-black bg-cream"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}

              {/* Mini QR Code Live Preview */}
              <div className="pt-2 border-t-2 border-black flex items-center gap-4">
                <div className="p-2 border-2 border-black bg-white shadow-brutal-sm shrink-0">
                  <QRCodeSVG
                    value={originalUrl || "https://pendek.in"}
                    size={80}
                    fgColor="#0A0A0A"
                    bgColor="#FFFFFF"
                    level="M"
                  />
                </div>
                <div className="text-xs font-medium space-y-1">
                  <div className="font-black text-black">Kode QR Otomatis</div>
                  <p className="text-neutral-600 text-[11px] leading-tight">
                    Kode QR dinamis ini akan langsung aktif begitu tautan disimpan. Anda dapat mengkustomisasi warna di langkah berikutnya.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
