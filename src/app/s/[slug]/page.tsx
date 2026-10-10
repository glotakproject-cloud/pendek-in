"use client";

import * as React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { BrandLogo } from "@/components/brand-logo";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ExternalLink,
  ShieldCheck,
  Clock,
  Terminal,
} from "lucide-react";

const DUMMY_DESTINATIONS: Record<string, { title: string; url: string; clicks: number }> = {
  "buket-nikah": {
    title: "Katalog Buket Pernikahan Premium 2026",
    url: "https://tokobunga.id/katalog/buket-pernikahan-premium-2026",
    clicks: 49,
  },
  "portfolio-dimas": {
    title: "Case Study Redesign Fintech Lokal - Dimas Pratama",
    url: "https://dimaspratama.design/case-study/redesign-aplikasi-fintech-lokal",
    clicks: 125,
  },
  "webinar-umkm": {
    title: "Registrasi Webinar Scaleup UMKM Maju 2026",
    url: "https://bit.ly/registrasi-webinar-scaleup-umkm-indonesia-maju-2026",
    clicks: 90,
  },
  "promo-ramadhan": {
    title: "Katalog Promo Spesial Ramadhan 2026",
    url: "https://tokoonline.id/katalog/promo-spesial-ramadhan-2026",
    clicks: 12,
  },
};

export default function RedirectSimulationPage() {
  const params = useParams();
  const slug = (params?.slug as string) || "contoh-slug";

  const destination = DUMMY_DESTINATIONS[slug] || {
    title: `Halaman Tujuan Eksternal (${slug})`,
    url: `https://contoh-website.id/destinasi-tautan/${slug}`,
    clicks: 1,
  };

  const [countdown, setCountdown] = React.useState(3);
  const [redirectSimulated, setRedirectSimulated] = React.useState(false);

  React.useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setRedirectSimulated(true);
    }
  }, [countdown]);

  return (
    <div className="min-h-screen bg-cream text-black flex flex-col justify-between p-4 sm:p-8">
      {/* Top Header */}
      <header className="max-w-3xl mx-auto w-full flex items-center justify-between">
        <BrandLogo size="default" />
        <Badge variant="outline" className="font-mono text-xs bg-white py-1">
          Simulasi Redirect (Fase 1 UI)
        </Badge>
      </header>

      {/* Center Redirect Card */}
      <main className="my-auto py-8 max-w-xl mx-auto w-full">
        <Card className="border-[3px] border-black bg-white shadow-brutal-xl p-6 sm:p-8 space-y-6">
          {/* Status Bar */}
          <div className="flex items-center justify-between border-b-2 border-black pb-4">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 bg-primary border border-black inline-block animate-pulse" />
              <span className="font-heading font-black text-sm uppercase tracking-wider text-black">
                {redirectSimulated ? "Siap Mengalihkan" : "Sedang Menghubungkan..."}
              </span>
            </div>
            <div className="flex items-center gap-1.5 font-mono text-xs font-bold bg-cream px-2.5 py-1 border border-black">
              <Clock className="h-3.5 w-3.5" strokeWidth={2.5} />
              <span>{countdown > 0 ? `${countdown}s` : "0s"}</span>
            </div>
          </div>

          {/* Heading */}
          <div className="space-y-2 text-center sm:text-left">
            <h1 className="text-2xl sm:text-3xl font-heading font-black text-black">
              Mengarahkan Anda ke Halaman Tujuan
            </h1>
            <p className="text-xs sm:text-sm font-medium text-neutral-600">
              Anda mengakses tautan pendek: <code className="font-mono font-bold text-black bg-accent/40 px-1 border border-black">pendek.in/s/{slug}</code>
            </p>
          </div>

          {/* Destination Preview Box */}
          <div className="bg-cream border-2 border-black p-4 space-y-2 shadow-brutal-sm">
            <span className="text-[11px] font-black uppercase text-neutral-500 tracking-wider block">
              URL Target Asli:
            </span>
            <p className="font-heading font-black text-base text-black">
              {destination.title}
            </p>
            <p className="font-mono text-xs text-neutral-800 break-all bg-white p-2 border border-black select-all">
              {destination.url}
            </p>
          </div>

          {/* Simulated Non-Blocking Analytics Logging */}
          <div className="bg-[#0A0A0A] text-green-400 p-3.5 border-2 border-black font-mono text-[11px] space-y-1 shadow-brutal-sm">
            <div className="flex items-center gap-1.5 text-neutral-400 text-[10px] pb-1 border-b border-neutral-800 uppercase tracking-wider font-bold">
              <Terminal className="h-3 w-3 text-primary" strokeWidth={2.5} />
              <span>Simulasi Pencatatan Klik Non-Blocking</span>
            </div>
            <p className="truncate">&bull; IP Hash: sha256(180.252.xxx.xxx + salt)</p>
            <p>&bull; Status: HTTP 307 Temporary Redirect</p>
            <p>&bull; Latensi redirect: &lt; 45ms</p>
          </div>

          {/* Actions */}
          <div className="pt-2 border-t-2 border-black space-y-3">
            <Button
              variant="default"
              size="lg"
              className="w-full text-base font-heading font-black flex items-center justify-center gap-2"
              asChild
            >
              <a href={destination.url} target="_blank" rel="noreferrer">
                <span>Lanjut ke Situs Tujuan Sekarang</span>
                <ExternalLink className="h-4 w-4" strokeWidth={2.5} />
              </a>
            </Button>

            <div className="flex items-center justify-between text-xs font-semibold text-neutral-600 pt-1">
              <span className="flex items-center gap-1">
                <ShieldCheck className="h-3.5 w-3.5 text-primary-dark" strokeWidth={2.5} />
                <span>Terverifikasi Aman oleh Pendek-In</span>
              </span>
              <Link href="/" className="hover:text-black underline font-bold">
                Batalkan &amp; Kembali
              </Link>
            </div>
          </div>
        </Card>
      </main>

      {/* Footer */}
      <footer className="text-center text-xs font-mono font-bold text-neutral-600">
        &copy; {new Date().getFullYear()} Pendek-In &bull; Layanan Pemendek Tautan Neobrutalisme Indonesia
      </footer>
    </div>
  );
}
