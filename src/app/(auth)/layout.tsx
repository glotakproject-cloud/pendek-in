import Link from "next/link";
import { BrandLogo } from "@/components/brand-logo";
import { ArrowLeft } from "lucide-react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-white text-black flex flex-col justify-between p-4 sm:p-6 lg:p-8">
      {/* Top Bar with Back Button */}
      <header className="max-w-xl mx-auto w-full flex items-center justify-between">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm font-bold border-2 border-black bg-cream px-3 py-1.5 shadow-brutal-sm hover:bg-white transition-all active:translate-x-0.5 active:translate-y-0.5"
        >
          <ArrowLeft className="h-4 w-4" strokeWidth={2.5} />
          <span>Kembali ke Beranda</span>
        </Link>
        <span className="text-xs font-mono font-bold bg-accent border-2 border-black px-2 py-1">
          Akses Aman
        </span>
      </header>

      {/* Center Auth Container */}
      <main className="my-auto py-8 flex flex-col items-center">
        <div className="mb-6">
          <BrandLogo size="lg" />
        </div>
        <div className="w-full max-w-md bg-cream border-[3px] border-black p-6 sm:p-8 shadow-brutal-xl">
          {children}
        </div>
      </main>

      {/* Bottom Footer Note */}
      <footer className="text-center py-4 text-xs font-mono font-bold text-neutral-600">
        &copy; {new Date().getFullYear()} Pendek-In &bull; Keamanan terjamin dengan enkripsi end-to-end
      </footer>
    </div>
  );
}
