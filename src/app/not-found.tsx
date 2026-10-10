import Link from "next/link";
import { BrandLogo } from "@/components/brand-logo";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Home, AlertCircle, Sparkles } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-cream text-black flex flex-col justify-between p-4 sm:p-8">
      {/* Top Header */}
      <header className="max-w-4xl mx-auto w-full flex items-center justify-between">
        <BrandLogo size="default" />
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold border-2 border-black bg-white px-3 py-1.5 shadow-brutal-sm hover:bg-primary transition-all active:translate-x-0.5 active:translate-y-0.5"
        >
          <Home className="h-4 w-4" strokeWidth={2.5} />
          <span>Ke Beranda</span>
        </Link>
      </header>

      {/* Main Content */}
      <main className="my-auto py-12 flex flex-col items-center max-w-2xl mx-auto w-full text-center space-y-6">
        {/* 404 Big Neobrutalist Block */}
        <div className="relative inline-block">
          <div className="bg-destructive text-white border-[4px] border-black text-6xl sm:text-8xl md:text-9xl font-heading font-black px-6 sm:px-10 py-3 sm:py-6 shadow-brutal-xl transform -rotate-2 select-none">
            404
          </div>
          <div className="absolute -bottom-3 -right-3 bg-accent text-black font-mono font-black text-xs sm:text-sm px-3 py-1 border-2 border-black shadow-brutal-sm transform rotate-3">
            NOT_FOUND
          </div>
        </div>

        <div className="space-y-3 pt-2">
          <h1 className="text-2xl sm:text-4xl font-heading font-black tracking-tight text-black">
            Waduh! Tautan Tidak Ditemukan
          </h1>
          <p className="text-sm sm:text-base font-medium text-neutral-700 max-w-lg mx-auto leading-relaxed">
            Tautan pendek yang Anda tuju mungkin sudah kedaluwarsa setelah 7 hari, telah dihapus oleh pemiliknya, atau terdapat kesalahan pengetikan alamat URL.
          </p>
        </div>

        {/* Action Card */}
        <Card className="border-[3px] border-black bg-white p-6 shadow-brutal w-full text-left space-y-4">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-warning border-2 border-black flex items-center justify-center shrink-0">
              <AlertCircle className="h-4 w-4 text-black" strokeWidth={2.5} />
            </div>
            <div className="text-xs sm:text-sm font-medium text-neutral-700 space-y-1">
              <p className="font-bold text-black">Apa yang bisa Anda lakukan sekarang?</p>
              <p>&bull; Pastikan kembali alamat slug di bilah URL peramban Anda.</p>
              <p>&bull; Jika Anda pemilik tautan, masuk ke dasbor akun untuk memeriksa status tautan.</p>
            </div>
          </div>

          <div className="pt-2 border-t-2 border-black flex flex-col sm:flex-row items-center gap-3">
            <Button variant="default" size="default" className="w-full sm:w-auto" asChild>
              <Link href="/" className="flex items-center justify-center gap-2">
                <Home className="h-4 w-4" strokeWidth={2.5} />
                <span>Kembali ke Beranda</span>
              </Link>
            </Button>
            <Button variant="secondary" size="default" className="w-full sm:w-auto" asChild>
              <Link href="/masuk" className="flex items-center justify-center gap-2">
                <Sparkles className="h-4 w-4" strokeWidth={2.5} />
                <span>Masuk ke Akun Member</span>
              </Link>
            </Button>
          </div>
        </Card>
      </main>

      {/* Footer */}
      <footer className="text-center text-xs font-mono font-bold text-neutral-600">
        &copy; {new Date().getFullYear()} Pendek-In &bull; Sistem Pemendek Tautan Neobrutalisme Indonesia
      </footer>
    </div>
  );
}
