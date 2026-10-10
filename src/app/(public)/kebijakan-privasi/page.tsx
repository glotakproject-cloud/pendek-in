import type { Metadata } from "next";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { ShieldCheck, Lock, ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Kebijakan Privasi | Perlindungan Data & Enkripsi - Pendek-In",
  description:
    "Kebijakan privasi resmi Pendek-In. Pelajari bagaimana kami melindungi data pengunjung dengan enkripsi hash IP SHA-256 dan arsitektur database Supabase RLS.",
};

export default function PrivacyPolicyPage() {
  return (
    <div className="w-full py-12 md:py-20 space-y-12">
      {/* Header */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 text-center space-y-4">
        <Badge variant="default" className="text-xs sm:text-sm py-1 px-3">
          <ShieldCheck className="h-3.5 w-3.5 mr-1" strokeWidth={2.5} /> Privasi &amp; Kriptografi
        </Badge>
        <h1 className="text-4xl sm:text-5xl font-heading font-black tracking-tight text-black">
          Kebijakan Privasi
        </h1>
        <p className="text-xs sm:text-sm font-mono font-bold text-neutral-600">
          Terakhir diperbarui: 10 Oktober 2026 &bull; Komitmen Tanpa Kompromi
        </p>
      </section>

      {/* Main Legal Content Card */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="bg-white border-[3px] border-black p-6 sm:p-10 shadow-brutal-xl space-y-8 leading-relaxed text-sm sm:text-base font-medium text-neutral-800">
          {/* Section 1 */}
          <div className="space-y-3">
            <h2 className="font-heading font-black text-xl text-black border-b-2 border-black pb-1.5 flex items-center gap-2">
              <span className="bg-primary px-2 py-0.5 border border-black text-xs font-mono">01</span>
              <span>Prinsip Dasar Privasi Kami</span>
            </h2>
            <p>
              Di <strong>Pendek-In</strong>, kami meyakini bahwa utilitas internet yang baik tidak boleh mengorbankan privasi penggunanya. Kami tidak menjual data pengguna, tidak menayangkan iklan berbasis pelacakan perilaku (behavioral ad tracking), dan tidak menyewakan informasi Anda kepada pihak ketiga.
            </p>
          </div>

          {/* Section 2 */}
          <div className="space-y-3">
            <h2 className="font-heading font-black text-xl text-black border-b-2 border-black pb-1.5 flex items-center gap-2">
              <span className="bg-primary px-2 py-0.5 border border-black text-xs font-mono">02</span>
              <span>Data yang Kami Kumpulkan</span>
            </h2>
            <div className="space-y-2">
              <p><strong>A. Pengguna Terdaftar (Member):</strong></p>
              <ul className="list-disc list-inside pl-2 space-y-1 text-sm font-semibold text-neutral-700">
                <li>Alamat email dan nama akun yang diberikan saat registrasi atau Google OAuth.</li>
                <li>Daftar tautan, slug kustom, konfigurasi warna kode QR, dan API Key yang Anda buat.</li>
              </ul>
              <p className="pt-2"><strong>B. Pengunjung Tautan Pendek (/s/slug):</strong></p>
              <ul className="list-disc list-inside pl-2 space-y-1 text-sm font-semibold text-neutral-700">
                <li>Informasi peramban (User-Agent): Tipe perangkat (ponsel/desktop), peramban, dan sistem operasi.</li>
                <li>Sumber rujukan (Referrer): Situs web atau platform tempat tautan diklik (misal: instagram.com).</li>
                <li>Asal negara kasar (berdasarkan header geolokasi IP penyedia cloud).</li>
              </ul>
            </div>
          </div>

          {/* Section 3: Highlight Khusus Hash IP SHA-256 */}
          <div className="bg-cream border-2 border-black p-5 shadow-brutal-sm space-y-3">
            <div className="flex items-center gap-2 text-black font-heading font-black text-base">
              <Lock className="h-5 w-5 text-primary-dark" strokeWidth={2.5} />
              <span>Perlindungan Alamat IP: Hash Kriptografi SHA-256</span>
            </div>
            <p className="text-sm font-medium text-neutral-800 leading-relaxed">
              Kami menerapkan standar privasi ketat: <strong>Alamat IP asli pengunjung TIDAK PERNAH disimpan secara mentah (plain text)</strong> di dalam database kami.
            </p>
            <p className="text-xs font-mono font-bold text-neutral-700 bg-white p-3 border border-black">
              Algoritma: SHA-256(IP_Address + SECRET_SALT) &rarr; Hash Unik 64 Karakter
            </p>
            <p className="text-xs font-medium text-neutral-700">
              Nilai hash ini digunakan semata-mata untuk menghitung rasio &ldquo;Klik Unik&rdquo; pada dasbor analitik pemilik tautan tanpa pernah mengekspos identitas perangkat fisik pengunjung.
            </p>
          </div>

          {/* Section 4 */}
          <div className="space-y-3">
            <h2 className="font-heading font-black text-xl text-black border-b-2 border-black pb-1.5 flex items-center gap-2">
              <span className="bg-primary px-2 py-0.5 border border-black text-xs font-mono">03</span>
              <span>Keamanan Database &amp; Row-Level Security</span>
            </h2>
            <p>
              Data pengguna disimpan pada database PostgreSQL Supabase dengan perlindungan <strong>Row-Level Security (RLS)</strong> aktif di seluruh tabel. Ini menjamin bahwa data tautan, analitik, dan token API Anda hanya dapat dibaca dan dimutasi oleh akun Anda sendiri. API Key disimpan dalam bentuk hash SHA-256 sehingga tidak dapat dilihat bahkan oleh administrator sistem.
            </p>
          </div>

          {/* Section 5 */}
          <div className="space-y-3">
            <h2 className="font-heading font-black text-xl text-black border-b-2 border-black pb-1.5 flex items-center gap-2">
              <span className="bg-primary px-2 py-0.5 border border-black text-xs font-mono">04</span>
              <span>Penggunaan Cookie</span>
            </h2>
            <p>
              Pendek-In hanya menggunakan cookie sesi penting (essential cookies) yang dienkripsi secara aman (<code className="font-mono text-xs font-bold bg-cream px-1 border border-black">HttpOnly, Secure, SameSite=Lax</code>) untuk mengautentikasi login pengguna. Kami tidak menyematkan cookie pelacak pihak ketiga (third-party trackers).
            </p>
          </div>

          {/* Section 6 */}
          <div className="space-y-3">
            <h2 className="font-heading font-black text-xl text-black border-b-2 border-black pb-1.5 flex items-center gap-2">
              <span className="bg-primary px-2 py-0.5 border border-black text-xs font-mono">05</span>
              <span>Hak Pengguna &amp; Penghapusan Data</span>
            </h2>
            <p>
              Anda memiliki hak penuh untuk mengakses, memperbarui, atau menghapus akun Anda beserta seluruh riwayat tautan yang tersimpan kapan saja melalui dasbor profil akun atau dengan menghubungi tim privasi kami.
            </p>
          </div>

          {/* Contact Box */}
          <div className="p-4 bg-cream border-2 border-black flex items-center justify-between flex-wrap gap-3">
            <div className="text-xs font-bold text-neutral-700">
              Ada pertanyaan seputar privasi data Anda? Email kami di{" "}
              <span className="font-mono text-black font-black">privacy@pendek.in</span>
            </div>
            <Link
              href="/kontak"
              className="inline-flex items-center gap-1 text-xs font-heading font-black text-black underline underline-offset-4"
            >
              <span>Hubungi Kami</span>
              <ArrowRight className="h-3.5 w-3.5" strokeWidth={2.5} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
