import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { GoogleIcon } from "@/components/icons";
import { ArrowRight, Lock, Mail } from "lucide-react";

export default function LoginPage() {
  return (
    <div className="space-y-6">
      <div className="text-center space-y-1">
        <h1 className="text-2xl sm:text-3xl font-black font-heading tracking-tight text-black">
          Selamat Datang Kembali
        </h1>
        <p className="text-sm font-medium text-neutral-600">
          Masuk ke akun Pendek-In untuk mengelola tautan &amp; melihat analitik Anda.
        </p>
      </div>

      {/* Tombol Google OAuth */}
      <Button
        type="button"
        variant="outline"
        className="w-full flex items-center justify-center gap-2 bg-white text-black"
      >
        <GoogleIcon className="h-5 w-5" />
        <span>Masuk dengan Google</span>
      </Button>

      {/* Divider */}
      <div className="relative flex items-center justify-center">
        <div className="w-full border-t-2 border-black" />
        <span className="bg-cream px-3 font-mono text-xs font-black uppercase text-neutral-600 absolute">
          atau via email
        </span>
      </div>

      {/* Form Login */}
      <form className="space-y-4">
        <div className="space-y-1.5">
          <label className="text-xs font-black uppercase tracking-wider text-black flex items-center gap-1.5">
            <Mail className="h-3.5 w-3.5" strokeWidth={2.5} />
            <span>Alamat Email</span>
          </label>
          <Input
            type="email"
            placeholder="dimas.pratama@gmail.com"
            defaultValue="dimas.pratama@gmail.com"
            required
            className="font-mono text-sm"
          />
        </div>

        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="text-xs font-black uppercase tracking-wider text-black flex items-center gap-1.5">
              <Lock className="h-3.5 w-3.5" strokeWidth={2.5} />
              <span>Kata Sandi</span>
            </label>
            <Link
              href="#"
              className="text-xs font-bold text-neutral-700 hover:text-black hover:underline"
            >
              Lupa sandi?
            </Link>
          </div>
          <Input
            type="password"
            placeholder="••••••••"
            defaultValue="password123"
            required
            className="font-mono text-sm"
          />
        </div>

        <Button type="submit" variant="default" className="w-full">
          <span>Masuk Sekarang</span>
          <ArrowRight className="ml-1.5 h-4 w-4" strokeWidth={2.5} />
        </Button>
      </form>

      <div className="text-center pt-2 border-t-2 border-black">
        <p className="text-xs font-bold text-neutral-700">
          Belum punya akun?{" "}
          <Link
            href="/daftar"
            className="text-black font-black underline underline-offset-4 hover:text-primary-dark"
          >
            Daftar Gratis di sini
          </Link>
        </p>
      </div>
    </div>
  );
}
