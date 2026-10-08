import { BrandLogo } from "@/components/brand-logo";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { ArrowRight, CheckCircle2, ShieldCheck, Sparkles, Zap } from "lucide-react";

export default function Home() {
  return (
    <main className="min-h-screen bg-white text-black p-6 md:p-12">
      <div className="max-w-5xl mx-auto space-y-10">
        <header className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b-2 border-black pb-6">
          <BrandLogo size="lg" />
          <div className="flex items-center gap-3">
            <Badge variant="default">Fondasi v1.0</Badge>
            <Badge variant="secondary">Neobrutalisme</Badge>
          </div>
        </header>

        <section className="space-y-4">
          <h1 className="text-4xl md:text-6xl font-black font-heading tracking-tight leading-none">
            Design System <span className="bg-primary px-3 py-1 border-2 border-black shadow-brutal inline-block">Pendek-In</span>
          </h1>
          <p className="text-lg md:text-xl font-medium text-neutral-700 max-w-2xl">
            Sistem desain Neobrutalisme modern dengan palet warna hijau-krem-hitam, border hitam tegas, tipografi kuat, dan hard shadow tanpa blur.
          </p>
        </section>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="hover:-translate-y-1 transition-transform">
            <CardHeader className="bg-primary/20">
              <div className="w-10 h-10 bg-primary border-2 border-black flex items-center justify-center shadow-brutal-sm mb-2">
                <Zap size={22} strokeWidth={2.5} />
              </div>
              <CardTitle>Kecepatan Tinggi</CardTitle>
              <CardDescription>Redirect non-blocking &lt; 100ms</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 pt-6">
              <p className="text-sm font-medium">
                Pencatatan klik fire-and-forget dengan pelacakan analitik akurat.
              </p>
              <Button size="sm" variant="default" className="w-full">
                Uji Coba <ArrowRight className="ml-1 h-4 w-4" strokeWidth={2.5} />
              </Button>
            </CardContent>
          </Card>

          <Card variant="cream" className="hover:-translate-y-1 transition-transform">
            <CardHeader className="bg-accent/30">
              <div className="w-10 h-10 bg-accent border-2 border-black flex items-center justify-center shadow-brutal-sm mb-2">
                <Sparkles size={22} strokeWidth={2.5} />
              </div>
              <CardTitle>Kustom Tautan & QR</CardTitle>
              <CardDescription>Back-half kustom & QR dinamis</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 pt-6">
              <p className="text-sm font-medium">
                Sesuaikan slug tautan dan unduh QR code beresolusi tinggi (PNG/SVG).
              </p>
              <Button size="sm" variant="secondary" className="w-full">
                Lihat Fitur <ArrowRight className="ml-1 h-4 w-4" strokeWidth={2.5} />
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:-translate-y-1 transition-transform">
            <CardHeader className="bg-cream">
              <div className="w-10 h-10 bg-white border-2 border-black flex items-center justify-center shadow-brutal-sm mb-2">
                <ShieldCheck size={22} strokeWidth={2.5} />
              </div>
              <CardTitle>Keamanan Ketat</CardTitle>
              <CardDescription>Supabase RLS & Hash SHA-256</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 pt-6">
              <p className="text-sm font-medium">
                Data klik terlindungi, isolasi hak akses per pengguna di tingkat database.
              </p>
              <Button size="sm" variant="outline" className="w-full">
                Dokumentasi <ArrowRight className="ml-1 h-4 w-4" strokeWidth={2.5} />
              </Button>
            </CardContent>
          </Card>
        </div>

        <Card variant="cream">
          <CardHeader>
            <CardTitle>Komponen Input & Tombol</CardTitle>
            <CardDescription>Preview styling elemen formulir neobrutalisme</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 pt-6">
            <div className="flex flex-col sm:flex-row gap-3">
              <Input
                placeholder="https://tokobunga.id/katalog/buket-pernikahan-premium"
                defaultValue="https://tokobunga.id/katalog/buket-pernikahan-premium"
                className="flex-1 font-mono text-sm"
              />
              <Button variant="default">
                Pendekkan Sekarang!
              </Button>
            </div>
            <div className="flex flex-wrap gap-2 pt-2">
              <Badge variant="default"><CheckCircle2 className="mr-1 h-3.5 w-3.5" /> Primary Green #00D26A</Badge>
              <Badge variant="secondary">Accent Lime #B4FF39</Badge>
              <Badge variant="destructive">Danger #FF5C5C</Badge>
              <Badge variant="warning">Warning #FFD23F</Badge>
              <Badge variant="info">Info #3B82F6</Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
