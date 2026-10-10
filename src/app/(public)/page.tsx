import type { Metadata } from "next";
import { HeroShortener } from "@/components/home/hero-shortener";
import { FeaturesSection } from "@/components/home/features-section";
import { DeveloperApiSection } from "@/components/home/developer-api-section";
import { TestimonialsSection } from "@/components/home/testimonials-section";
import { FaqSection } from "@/components/home/faq-section";
import { CtaSection } from "@/components/home/cta-section";

export const metadata: Metadata = {
  title: "Pendek-In | Pemendek Tautan Modern Bergaya Neobrutalisme",
  description:
    "Layanan pemendek tautan modern Indonesia. Ubah URL panjang jadi ringkas, buat kode QR dinamis siap unduh, kustomisasi slug branding, dan pantau analitik performa klik secara real-time.",
  openGraph: {
    title: "Pendek-In | Pemendek Tautan Modern Neobrutalisme",
    description:
      "Ubah URL panjang jadi ringkas, buat kode QR dinamis, kustomisasi slug branding, dan pantau analitik performa klik secara gratis.",
    url: "https://pendek.in",
    siteName: "Pendek-In",
    locale: "id_ID",
    type: "website",
  },
};

export default function HomePage() {
  return (
    <main className="w-full">
      {/* 1. Hero dengan input pemendekan besar, hasil instan, & riwayat cepat */}
      <HeroShortener />

      {/* 2. Section Fitur 4 Kartu (Pemendekan, Kustom, QR Dinamis, Analitik) */}
      <FeaturesSection />

      {/* 3. Section API untuk Developer dengan code snippet interaktif */}
      <DeveloperApiSection />

      {/* 4. Section Testimoni Pengguna */}
      <TestimonialsSection />

      {/* 5. Section FAQ Accordion */}
      <FaqSection />

      {/* 6. Section CTA Daftar */}
      <CtaSection />
    </main>
  );
}
