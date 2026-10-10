import type { Metadata } from "next";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Zap,
  ShieldCheck,
  Code2,
  Users,
  Heart,
  Globe,
  Layers,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Tentang Kami | Cerita, Visi, & Tim - Pendek-In",
  description:
    "Pelajari cerita di balik Pendek-In, visi kami untuk ekosistem digital Indonesia, dan prinsip desain Neobrutalisme yang kami usung.",
};

const values = [
  {
    icon: Zap,
    title: "Performa Cepat Kilat",
    desc: "Redirect non-blocking dengan latensi di bawah 100 milidetik. Tidak ada jeda countdown iklan yang mengganggu pengunjung Anda.",
    color: "bg-primary",
  },
  {
    icon: ShieldCheck,
    title: "Privasi Pengunjung Terjaga",
    desc: "Kami tidak pernah memperjualbelikan data. Alamat IP pengunjung dienkripsi dengan SHA-256 dan salt server unik untuk menghitung analitik.",
    color: "bg-accent",
  },
  {
    icon: Code2,
    title: "Terbuka untuk Developer",
    desc: "Akses Public REST API v1 tanpa biaya langganan. Kami percaya otomatisasi dan integrasi teknologi harus dapat diakses semua kalangan.",
    color: "bg-warning",
  },
];

const team = [
  {
    name: "Dimas Pratama",
    role: "Lead Fullstack Architect",
    location: "Jakarta, Indonesia",
    initials: "DP",
    bg: "bg-primary",
    bio: "Pengembang perangkat lunak dengan pengalaman 8+ tahun di arsitektur distributed systems dan modern web applications.",
  },
  {
    name: "Sarah Az-Zahra",
    role: "Backend & Security Engineer",
    location: "Bandung, Indonesia",
    initials: "SA",
    bg: "bg-accent",
    bio: "Fokus pada keamanan database Supabase RLS, enkripsi kriptografi, dan optimasi query skala tinggi.",
  },
  {
    name: "Reza Ramadhan",
    role: "UI/UX & Creative Designer",
    location: "Yogyakarta, Indonesia",
    initials: "RR",
    bg: "bg-info text-white",
    bio: "Pencinta gaya Neobrutalisme retro-futuristik dengan perhatian mendalam pada micro-animations dan pengalaman pengguna.",
  },
];

export default function AboutPage() {
  return (
    <div className="w-full py-12 md:py-20 space-y-20">
      {/* Header */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 text-center space-y-5">
        <Badge variant="default" className="text-xs sm:text-sm py-1 px-3">
          Cerita &amp; Visi Kami
        </Badge>
        <h1 className="text-4xl sm:text-6xl font-heading font-black tracking-tight text-black">
          Layanan Pemendek Tautan yang{" "}
          <span className="bg-primary px-3 py-1 border-2 border-black shadow-brutal inline-block">
            Berani &amp; Berkarakter
          </span>
        </h1>
        <p className="text-base sm:text-lg font-medium text-neutral-700 max-w-2xl mx-auto leading-relaxed">
          Pendek-In lahir dari keinginan untuk menghadirkan infrastruktur pemendek tautan yang modern, andal, tanpa jebakan paywall, dan didesain khusus dengan gaya visual Neobrutalisme yang tegas.
        </p>
      </section>

      {/* Cerita Lahirnya Pendek-In */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="bg-cream border-[3px] border-black p-6 sm:p-10 shadow-brutal-xl space-y-6">
          <div className="flex items-center gap-3 border-b-2 border-black pb-4">
            <div className="w-10 h-10 bg-primary border-2 border-black flex items-center justify-center shadow-brutal-sm">
              <Heart className="h-5 w-5 text-black" strokeWidth={2.5} />
            </div>
            <div>
              <h2 className="font-heading font-black text-xl sm:text-2xl text-black">
                Mengapa Kami Membangun Pendek-In?
              </h2>
              <span className="text-xs font-mono font-bold text-neutral-600">
                Inisiatif Terbuka untuk Ekosistem Digital Indonesia
              </span>
            </div>
          </div>

          <div className="space-y-4 text-sm sm:text-base font-medium text-neutral-800 leading-relaxed">
            <p>
              Hampir semua pemilik bisnis online, kreator konten, dan developer pernah mengalami hal yang sama: membagikan tautan panjang yang memakan ruang, terlihat mencurigakan, dan tidak memiliki wawasan performa klik.
            </p>
            <p>
              Di sisi lain, layanan pemendek tautan global seringkali mengunci fitur-fitur dasar seperti <strong>kustom slug</strong>, <strong>kode QR dinamis</strong>, dan <strong>analitik klik</strong> di balik paket langganan mahal (US$ 15 - $35 per bulan). Sementara alternatif gratis yang ada dipenuhi iklan intervensi, pop-up spam, dan masa tunggu redirect yang menguji kesabaran pengguna.
            </p>
            <p>
              <strong>Pendek-In hadir untuk meruntuhkan batasan itu.</strong> Kami membangun platform pemendek tautan yang 100% fungsional, bersih dari iklan, menghormati privasi pengunjung, dan menyediakan API publik gratis untuk mendorong inovasi developer lokal.
            </p>
          </div>

          <div className="p-4 bg-white border-2 border-black flex flex-wrap items-center justify-between gap-4 font-mono text-xs font-bold">
            <span className="flex items-center gap-2">
              <Globe className="h-4 w-4 text-primary" strokeWidth={2.5} />
              Serverless Edge Infrastructure
            </span>
            <span className="flex items-center gap-2">
              <Layers className="h-4 w-4 text-accent" strokeWidth={2.5} />
              Next.js 15 &amp; Supabase PostgreSQL
            </span>
          </div>
        </div>
      </section>

      {/* Nilai Utama Kami */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 space-y-8">
        <div className="text-center space-y-2">
          <Badge variant="outline" className="text-xs font-mono bg-white">
            Prinsip Desain &amp; Filosofi
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-heading font-black text-black">
            Nilai yang Kami Pegang Teguh
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {values.map((v, idx) => {
            const Icon = v.icon;
            return (
              <Card key={idx} className="border-[3px] border-black shadow-brutal hover:-translate-y-1 transition-transform">
                <CardHeader className="space-y-3 pb-4">
                  <div className={`w-12 h-12 border-2 border-black flex items-center justify-center shadow-brutal-sm ${v.color}`}>
                    <Icon className="h-6 w-6 text-black" strokeWidth={2.5} />
                  </div>
                  <CardTitle className="text-xl font-heading font-black">
                    {v.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm font-medium text-neutral-700 leading-relaxed">
                    {v.desc}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>

      {/* Tim Pengembang */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 space-y-8">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-1.5 text-xs font-black uppercase text-neutral-600">
            <Users className="h-4 w-4" strokeWidth={2.5} />
            <span>Orang di Balik Layar</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-heading font-black text-black">
            Tim Pengembang
          </h2>
          <p className="text-sm font-medium text-neutral-600 max-w-lg mx-auto">
            Dibuat dengan dedikasi penuh oleh para pengembang perangkat lunak di Indonesia.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {team.map((member, idx) => (
            <Card key={idx} variant="default" className="border-[3px] border-black shadow-brutal">
              <CardContent className="p-6 space-y-4">
                <div className="flex items-center gap-4">
                  <div
                    className={`w-14 h-14 border-2 border-black flex items-center justify-center font-heading font-black text-lg shadow-brutal-sm ${member.bg}`}
                  >
                    {member.initials}
                  </div>
                  <div>
                    <h3 className="font-heading font-black text-lg text-black">
                      {member.name}
                    </h3>
                    <p className="text-xs font-bold text-neutral-600">
                      {member.role}
                    </p>
                    <p className="text-[11px] font-mono text-neutral-500">
                      {member.location}
                    </p>
                  </div>
                </div>

                <p className="text-xs sm:text-sm font-medium text-neutral-700 leading-relaxed pt-2 border-t border-black/10">
                  {member.bio}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 text-center">
        <div className="bg-primary border-[3px] border-black p-8 sm:p-12 shadow-brutal-xl space-y-6">
          <h2 className="text-2xl sm:text-4xl font-heading font-black text-black">
            Bergabunglah dengan Ekosistem Pendek-In
          </h2>
          <p className="text-sm sm:text-base font-semibold text-black/85 max-w-xl mx-auto">
            Dukung gerakan utilitas digital lokal yang mandiri, berani, dan cepat.
          </p>
          <div className="flex justify-center gap-4 flex-wrap">
            <Button variant="outline" size="lg" className="bg-white text-black hover:bg-cream" asChild>
              <Link href="/daftar">Mulai Gratis Sekarang</Link>
            </Button>
            <Button variant="secondary" size="lg" asChild>
              <Link href="/kontak">Hubungi Tim Kami</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
