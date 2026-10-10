import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Zap,
  Sparkles,
  QrCode,
  BarChart3,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";

const features = [
  {
    id: "shortener",
    title: "Pemendekan Super Cepat",
    subtitle: "Redirect kilat < 100ms",
    description:
      "Pangkas tautan panjang dan berantakan dalam satu kedipan mata. Didukung arsitektur non-blocking fire-and-forget yang mengarahkan pengunjung ke tujuan tanpa jeda.",
    icon: Zap,
    boxBg: "bg-primary",
    cardVariant: "default" as const,
    highlights: ["Redirect Non-Blocking < 100ms", "Filter Otomatis Anti-Phishing", "Uptime Handal 99.9%"],
    linkText: "Coba Pemendekan",
    linkHref: "#top",
  },
  {
    id: "custom",
    title: "Branding & Kustom Slug",
    subtitle: "Tingkatkan CTR hingga 39%",
    description:
      "Ubah kode acak menjadi tautan bermerek yang mudah diingat seperti pendek.in/promo-gajian. Bangun rasa percaya audiens Anda di media sosial dan WhatsApp.",
    icon: Sparkles,
    boxBg: "bg-accent",
    cardVariant: "cream" as const,
    highlights: ["Pengecekan Ketersediaan Real-Time", "Proteksi Reserved Words", "Format Slug Bersih & Rapi"],
    linkText: "Pelajari Kustomisasi",
    linkHref: "/daftar",
  },
  {
    id: "qr",
    title: "Kode QR Dinamis",
    subtitle: "Ekspor format PNG & SVG",
    description:
      "Setiap tautan otomatis memiliki kode QR siap cetak. Karena mengarah ke tautan pendek dinamis, Anda bebas mengganti tujuan URL tanpa harus mencetak ulang kemasan fisik.",
    icon: QrCode,
    boxBg: "bg-info text-white",
    cardVariant: "default" as const,
    highlights: ["Resolusi Tinggi untuk Cetak", "Kustomisasi Warna Latar & Modul", "Dukungan Format Vektor SVG"],
    linkText: "Lihat Editor QR",
    linkHref: "/daftar",
  },
  {
    id: "analytics",
    title: "Analitik Klik Real-Time",
    subtitle: "Wawasan pengunjung terukur",
    description:
      "Pantau performa kampanye pemasaran Anda secara langsung. Ukur total klik, pengunjung unik, perangkat (ponsel vs desktop), sistem operasi, hingga referer asal audiens.",
    icon: BarChart3,
    boxBg: "bg-warning text-black",
    cardVariant: "cream" as const,
    highlights: ["Privasi Terjaga (Hash IP SHA-256)", "Grafik Tren Interaktif 7 Hari", "Peta Negara & Tipe Perangkat"],
    linkText: "Buka Dasbor Analitik",
    linkHref: "/daftar",
  },
];

export function FeaturesSection() {
  return (
    <section id="fitur" className="py-20 md:py-28 bg-cream border-b-2 border-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <Badge variant="default" className="text-xs sm:text-sm py-1 px-3">
            Fitur Utama Pendek-In
          </Badge>
          <h2 className="text-3xl sm:text-5xl font-heading font-black tracking-tight text-black">
            Solusi Tautan Lengkap untuk{" "}
            <span className="bg-accent px-2 py-0.5 border-2 border-black shadow-brutal inline-block transform rotate-1">
              Pebisnis &amp; Kreator
            </span>
          </h2>
          <p className="text-base sm:text-lg font-medium text-neutral-700">
            Didesain khusus dengan performa tanpa kompromi. Tidak ada batasan tersembunyi, semua
            fitur penting tersedia secara gratis.
          </p>
        </div>

        {/* 4 Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <Card
                key={feature.id}
                variant={feature.cardVariant}
                className="flex flex-col justify-between hover:-translate-y-1.5 transition-transform"
              >
                <div>
                  <CardHeader className="space-y-4">
                    <div
                      className={`w-12 h-12 border-2 border-black flex items-center justify-center shadow-brutal-sm ${feature.boxBg}`}
                    >
                      <Icon className="h-6 w-6" strokeWidth={2.5} />
                    </div>
                    <div>
                      <CardTitle className="text-xl sm:text-2xl font-heading font-black">
                        {feature.title}
                      </CardTitle>
                      <CardDescription className="text-xs font-bold text-neutral-600 mt-1">
                        {feature.subtitle}
                      </CardDescription>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-4 pt-4">
                    <p className="text-sm font-medium text-neutral-700 leading-relaxed">
                      {feature.description}
                    </p>

                    <div className="space-y-2 pt-2 border-t border-black/10">
                      {feature.highlights.map((item, idx) => (
                        <div key={idx} className="flex items-start gap-2 text-xs font-semibold text-black">
                          <CheckCircle2 className="h-4 w-4 text-primary shrink-0 mt-0.5" strokeWidth={2.5} />
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </div>

                <div className="p-6 pt-0">
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full justify-between group hover:bg-black hover:text-white transition-colors"
                    asChild
                  >
                    <Link href={feature.linkHref}>
                      <span>{feature.linkText}</span>
                      <ArrowRight className="h-4 w-4 transform group-hover:translate-x-1 transition-transform" strokeWidth={2.5} />
                    </Link>
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Bottom Guarantee Banner */}
        <div className="bg-white border-2 border-black p-6 shadow-brutal flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-primary border-2 border-black flex items-center justify-center shadow-brutal-sm shrink-0">
              <ShieldCheck className="h-6 w-6 text-black" strokeWidth={2.5} />
            </div>
            <div>
              <h4 className="font-heading font-black text-lg text-black">
                100% Bebas Malware &amp; Tautan Berbahaya
              </h4>
              <p className="text-xs sm:text-sm font-medium text-neutral-600">
                Sistem moderasi aktif memindai dan memblokir domain spam, phishing, dan konten berbahaya secara real-time.
              </p>
            </div>
          </div>

          <div className="shrink-0 flex items-center gap-3">
            <Badge variant="outline" className="font-mono text-xs bg-cream py-1 px-3">
              Zero Ads Guarantee
            </Badge>
            <Button variant="default" size="sm" asChild>
              <Link href="/daftar">Mulai Pakai Sekarang</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
