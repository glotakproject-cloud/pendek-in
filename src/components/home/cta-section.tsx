import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle2, Sparkles, LogIn } from "lucide-react";

export function CtaSection() {
  return (
    <section className="py-20 md:py-28 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative border-[3px] border-black bg-primary p-8 sm:p-12 md:p-16 shadow-brutal-xl overflow-hidden">
          {/* Decorative Corner Accents */}
          <div className="absolute top-4 right-4 hidden sm:flex items-center gap-2">
            <span className="w-4 h-4 bg-accent border-2 border-black inline-block" />
            <span className="w-4 h-4 bg-white border-2 border-black inline-block" />
            <span className="w-4 h-4 bg-black border-2 border-black inline-block" />
          </div>

          <div className="max-w-3xl space-y-8 relative z-10">
            {/* Pill Badge */}
            <div className="inline-flex items-center gap-2 bg-white px-3.5 py-1.5 border-2 border-black shadow-brutal-sm font-heading font-black text-xs sm:text-sm uppercase tracking-wider text-black">
              <Sparkles className="h-4 w-4 text-black" strokeWidth={2.5} />
              <span>Mulai Dalam 30 Detik</span>
            </div>

            {/* Headline & Body */}
            <div className="space-y-4">
              <h2 className="text-3xl sm:text-5xl md:text-6xl font-heading font-black text-black tracking-tight leading-tight">
                Siap Memendekkan &amp; Memantau Tautan Anda?
              </h2>
              <p className="text-base sm:text-lg md:text-xl font-medium text-black/90 leading-relaxed max-w-2xl">
                Bergabunglah bersama ribuan pebisnis, UMKM, dan kreator konten di Indonesia. Dapatkan tautan permanen, kode QR dinamis, dan analitik lengkap secara gratis selamanya.
              </p>
            </div>

            {/* Checklist Trust Points */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-sm font-bold text-black">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-black shrink-0" strokeWidth={2.5} />
                <span>100% Gratis Tanpa Kartu Kredit</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-black shrink-0" strokeWidth={2.5} />
                <span>Masa Aktif Tautan Permanen</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-black shrink-0" strokeWidth={2.5} />
                <span>Unduh Kode QR SVG &amp; PNG</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-black shrink-0" strokeWidth={2.5} />
                <span>Akses Penuh Public REST API</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-4">
              <Button
                variant="outline"
                size="lg"
                className="bg-white text-black hover:bg-cream border-2 border-black shadow-brutal text-base font-heading font-black"
                asChild
              >
                <Link href="/daftar" className="flex items-center justify-center gap-2">
                  <span>Daftar Akun Gratis Sekarang</span>
                  <ArrowRight className="h-5 w-5" strokeWidth={2.5} />
                </Link>
              </Button>

              <Button
                variant="secondary"
                size="lg"
                className="bg-accent text-black border-2 border-black shadow-brutal text-base font-heading font-black"
                asChild
              >
                <Link href="/masuk" className="flex items-center justify-center gap-2">
                  <LogIn className="h-5 w-5" strokeWidth={2.5} />
                  <span>Sudah Punya Akun? Masuk</span>
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
