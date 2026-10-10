import type { Metadata } from "next";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardDescription } from "@/components/ui/card";
import { CheckCircle2, Minus, ArrowRight, HelpCircle } from "lucide-react";

export const metadata: Metadata = {
  title: "Paket & Harga | 100% Gratis Selamanya - Pendek-In",
  description:
    "Pendek-In adalah layanan pemendek tautan 100% gratis tanpa biaya tersembunyi. Bandingkan fitur pengguna Tamu, Member, dan Developer di sini.",
};

const tiers = [
  {
    name: "Pengunjung Tamu",
    badge: "Tanpa Login",
    price: "Rp 0",
    period: "selamanya",
    description: "Cocok untuk Anda yang hanya butuh memendekkan tautan kilat sekali pakai.",
    buttonText: "Coba Pemendekan",
    buttonHref: "/",
    buttonVariant: "outline" as const,
    featured: false,
    features: [
      "Pemendekan URL instan",
      "Masa aktif tautan 7 hari",
      "Slug acak 6 karakter",
      "Pratinjau Kode QR standar",
      "Riwayat tersimpan di browser",
    ],
  },
  {
    name: "Member Terdaftar",
    badge: "Paling Populer",
    price: "Rp 0",
    period: "selamanya",
    description: "Pilihan terbaik untuk kreator, pebisnis UMKM, dan marketer modern.",
    buttonText: "Daftar Gratis Sekarang",
    buttonHref: "/daftar",
    buttonVariant: "default" as const,
    featured: true,
    features: [
      "Semua fitur Pengunjung Tamu",
      "Masa aktif tautan PERMANEN",
      "Kustom back-half (slug unik)",
      "Kode QR Dinamis (PNG & SVG)",
      "Dashboard analitik klik real-time",
      "Peta pengunjung, OS, & perangkat",
      "Manajemen & arsip tautan pribadi",
    ],
  },
  {
    name: "Developer & API",
    badge: "Otomatisasi",
    price: "Rp 0",
    period: "selamanya",
    description: "Integrasikan pembuatan tautan pendek ke bot, webhook, atau sistem backend Anda.",
    buttonText: "Buka Dokumentasi API",
    buttonHref: "/api-publik",
    buttonVariant: "secondary" as const,
    featured: false,
    features: [
      "Semua fitur Member Terdaftar",
      "Akses Public REST API v1",
      "Batas kuota 120 req/menit",
      "Pembuatan API Key (Bearer Token)",
      "Dukungan endpoint CRUD & Analitik",
      "Contoh cURL, Node.js, Python, PHP",
    ],
  },
];

const featureMatrix = [
  { feature: "Biaya Langganan / Kartu Kredit", guest: "Tidak Ada", member: "Tidak Ada", dev: "Tidak Ada" },
  { feature: "Masa Aktif Tautan", guest: "7 Hari", member: "Permanen", dev: "Permanen" },
  { feature: "Batas Jumlah Tautan", guest: "10 / Jam (IP)", member: "Tak Terbatas", dev: "Tak Terbatas" },
  { feature: "Kustomisasi Back-Half (Slug)", guest: false, member: true, dev: true },
  { feature: "Kode QR Dinamis (Unduh PNG/SVG)", guest: "Pratinjau saja", member: true, dev: true },
  { feature: "Pelacakan Analitik Klik Real-time", guest: false, member: true, dev: true },
  { feature: "Data Perangkat & Negara Asal", guest: false, member: true, dev: true },
  { feature: "Public REST API Key", guest: false, member: false, dev: true },
  { feature: "Rate Limit API", guest: "-", member: "-", dev: "120 req/menit" },
  { feature: "Proteksi Phishing & Malware", guest: true, member: true, dev: true },
];

export default function PricingPage() {
  return (
    <div className="w-full py-12 md:py-20 space-y-16">
      {/* Page Header */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 text-center space-y-4">
        <Badge variant="default" className="text-xs sm:text-sm py-1 px-3">
          Transparansi 100%
        </Badge>
        <h1 className="text-4xl sm:text-6xl font-heading font-black tracking-tight text-black">
          Satu Tarif untuk Semua:{" "}
          <span className="bg-primary px-3 py-1 border-2 border-black shadow-brutal inline-block">
            Gratis Selamanya!
          </span>
        </h1>
        <p className="text-base sm:text-lg font-medium text-neutral-700 max-w-2xl mx-auto leading-relaxed">
          Tidak ada tier berbayar yang terkunci, tidak ada percobaan 14 hari, dan tidak perlu kartu kredit.
          Pendek-In dibangun sebagai utilitas publik tangguh untuk mendukung pertumbuhan digital Indonesia.
        </p>
      </section>

      {/* 3 Tier Cards */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
          {tiers.map((tier) => (
            <Card
              key={tier.name}
              variant={tier.featured ? "cream" : "default"}
              className={`flex flex-col justify-between border-[3px] border-black transition-all ${
                tier.featured
                  ? "shadow-brutal-xl ring-2 ring-primary relative md:-translate-y-2"
                  : "shadow-brutal"
              }`}
            >
              <div>
                <CardHeader className="space-y-3 pb-6">
                  <div className="flex items-center justify-between">
                    <span className="font-heading font-black text-xl text-black">
                      {tier.name}
                    </span>
                    <Badge
                      variant={tier.featured ? "default" : "outline"}
                      className="text-xs"
                    >
                      {tier.badge}
                    </Badge>
                  </div>
                  <div className="pt-2">
                    <span className="font-mono text-4xl sm:text-5xl font-black text-black">
                      {tier.price}
                    </span>
                    <span className="text-xs font-bold text-neutral-600 ml-2">
                      / {tier.period}
                    </span>
                  </div>
                  <CardDescription className="text-xs font-medium text-neutral-700 leading-relaxed pt-1">
                    {tier.description}
                  </CardDescription>
                </CardHeader>

                <CardContent className="space-y-4 pt-4">
                  <p className="text-xs font-black uppercase tracking-wider text-black">
                    Termasuk dalam paket ini:
                  </p>
                  <ul className="space-y-2.5">
                    {tier.features.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-xs sm:text-sm font-semibold text-black">
                        <CheckCircle2 className="h-4 w-4 text-primary shrink-0 mt-0.5" strokeWidth={2.5} />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </div>

              <div className="p-6 pt-4 border-t-2 border-black">
                <Button
                  variant={tier.buttonVariant}
                  size="lg"
                  className="w-full text-sm font-heading font-black"
                  asChild
                >
                  <Link href={tier.buttonHref} className="flex items-center justify-center gap-2">
                    <span>{tier.buttonText}</span>
                    <ArrowRight className="h-4 w-4" strokeWidth={2.5} />
                  </Link>
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* Feature Matrix Table */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-2xl sm:text-3xl font-heading font-black text-black">
            Matriks Perbandingan Fitur Detail
          </h2>
          <p className="text-sm font-medium text-neutral-600">
            Periksa apa saja hak akses yang Anda peroleh berdasarkan status akun Anda.
          </p>
        </div>

        <div className="border-[3px] border-black shadow-brutal-lg overflow-x-auto bg-white">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="bg-primary border-b-2 border-black font-heading font-black text-black">
                <th className="p-4 border-r-2 border-black">Fitur Layanan</th>
                <th className="p-4 border-r-2 border-black text-center w-36">Tamu</th>
                <th className="p-4 border-r-2 border-black text-center w-40 bg-accent/30">Member</th>
                <th className="p-4 text-center w-40">Developer</th>
              </tr>
            </thead>
            <tbody className="divide-y-2 divide-black font-medium">
              {featureMatrix.map((row, idx) => (
                <tr key={idx} className={idx % 2 === 0 ? "bg-white" : "bg-cream"}>
                  <td className="p-4 font-semibold text-black border-r-2 border-black">
                    {row.feature}
                  </td>
                  <td className="p-4 text-center border-r-2 border-black font-mono text-xs">
                    {typeof row.guest === "boolean" ? (
                      row.guest ? (
                        <CheckCircle2 className="h-5 w-5 text-primary-dark mx-auto" strokeWidth={2.5} />
                      ) : (
                        <Minus className="h-5 w-5 text-neutral-400 mx-auto" strokeWidth={2.5} />
                      )
                    ) : (
                      row.guest
                    )}
                  </td>
                  <td className="p-4 text-center border-r-2 border-black font-mono text-xs font-bold bg-accent/10">
                    {typeof row.member === "boolean" ? (
                      row.member ? (
                        <CheckCircle2 className="h-5 w-5 text-primary-dark mx-auto" strokeWidth={2.5} />
                      ) : (
                        <Minus className="h-5 w-5 text-neutral-400 mx-auto" strokeWidth={2.5} />
                      )
                    ) : (
                      row.member
                    )}
                  </td>
                  <td className="p-4 text-center font-mono text-xs font-bold">
                    {typeof row.dev === "boolean" ? (
                      row.dev ? (
                        <CheckCircle2 className="h-5 w-5 text-primary-dark mx-auto" strokeWidth={2.5} />
                      ) : (
                        <Minus className="h-5 w-5 text-neutral-400 mx-auto" strokeWidth={2.5} />
                      )
                    ) : (
                      row.dev
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Why Free Callout */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="bg-cream border-[3px] border-black p-6 sm:p-8 shadow-brutal space-y-4">
          <div className="flex items-center gap-2">
            <HelpCircle className="h-5 w-5 text-black" strokeWidth={2.5} />
            <h3 className="font-heading font-black text-lg sm:text-xl text-black">
              Mengapa Pendek-In Disediakan Secara 100% Gratis?
            </h3>
          </div>
          <p className="text-sm font-medium text-neutral-700 leading-relaxed">
            Banyak penyedia pemendek URL global membatasi fitur penting seperti kustom slug atau analitik klik di balik biaya langganan yang mahal (US$ 10-35/bulan). Kami percaya bahwa setiap pelaku UMKM, kreator konten, dan developer di Indonesia berhak mendapatkan infrastruktur tautan yang cepat, andal, dan berkelas tanpa terbebani biaya langganan bulanan.
          </p>
          <div className="pt-2 flex flex-wrap gap-4 items-center justify-between border-t border-black/20">
            <span className="text-xs font-mono font-bold text-neutral-600">
              Infrastruktur didukung arsitektur Cloud Serverless modern berbiaya efisien.
            </span>
            <Link
              href="/tentang"
              className="text-xs font-heading font-black text-black underline underline-offset-4 hover:text-primary-dark"
            >
              Baca Cerita Kami di Halaman Tentang &rarr;
            </Link>
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 text-center">
        <div className="bg-primary border-[3px] border-black p-8 sm:p-12 shadow-brutal-xl space-y-6">
          <h2 className="text-2xl sm:text-4xl font-heading font-black text-black">
            Siap Mengoptimalkan Setiap Tautan Anda?
          </h2>
          <p className="text-sm sm:text-base font-semibold text-black/85 max-w-xl mx-auto">
            Daftarkan diri Anda dalam 30 detik. Tidak ada tagihan tersembunyi, selamanya gratis.
          </p>
          <div className="flex justify-center gap-4 flex-wrap">
            <Button variant="outline" size="lg" className="bg-white text-black hover:bg-cream" asChild>
              <Link href="/daftar">Daftar Akun Gratis</Link>
            </Button>
            <Button variant="secondary" size="lg" asChild>
              <Link href="/masuk">Masuk ke Dasbor</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
