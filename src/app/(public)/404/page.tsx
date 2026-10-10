import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Home, AlertCircle, Sparkles } from "lucide-react";

export default function Explicit404Page() {
  return (
    <div className="max-w-2xl mx-auto py-16 px-4 sm:px-6 text-center space-y-8">
      {/* 404 Badge */}
      <div className="relative inline-block">
        <div className="bg-destructive text-white border-[4px] border-black text-6xl sm:text-8xl md:text-9xl font-heading font-black px-6 sm:px-10 py-3 sm:py-6 shadow-brutal-xl transform -rotate-2 select-none">
          404
        </div>
        <div className="absolute -bottom-3 -right-3 bg-accent text-black font-mono font-black text-xs sm:text-sm px-3 py-1 border-2 border-black shadow-brutal-sm transform rotate-3">
          NOT_FOUND
        </div>
      </div>

      <div className="space-y-3">
        <h1 className="text-3xl sm:text-4xl font-heading font-black text-black">
          Tautan Tidak Ditemukan
        </h1>
        <p className="text-sm sm:text-base font-medium text-neutral-700 max-w-md mx-auto leading-relaxed">
          Tautan pendek ini mungkin sudah kedaluwarsa, telah dinonaktifkan oleh sistem karena melanggar ketentuan, atau belum pernah dibuat.
        </p>
      </div>

      <Card className="border-[3px] border-black bg-cream p-6 shadow-brutal text-left space-y-4">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 bg-warning border-2 border-black flex items-center justify-center shrink-0">
            <AlertCircle className="h-4 w-4 text-black" strokeWidth={2.5} />
          </div>
          <div className="text-xs sm:text-sm font-medium text-neutral-800 space-y-1">
            <p className="font-bold text-black">Langkah Rekomendasi:</p>
            <p>&bull; Periksa kembali ejaan slug pada URL Anda.</p>
            <p>&bull; Hubungi pemilik tautan untuk meminta link terbaru.</p>
          </div>
        </div>

        <div className="pt-2 border-t-2 border-black flex flex-col sm:flex-row items-center gap-3">
          <Button variant="default" size="default" className="w-full sm:w-auto" asChild>
            <Link href="/" className="flex items-center justify-center gap-2">
              <Home className="h-4 w-4" strokeWidth={2.5} />
              <span>Ke Beranda</span>
            </Link>
          </Button>
          <Button variant="outline" size="default" className="w-full sm:w-auto bg-white" asChild>
            <Link href="/daftar" className="flex items-center justify-center gap-2">
              <Sparkles className="h-4 w-4" strokeWidth={2.5} />
              <span>Buat Tautan Sendiri</span>
            </Link>
          </Button>
        </div>
      </Card>
    </div>
  );
}
