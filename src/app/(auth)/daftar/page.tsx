import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { GoogleIcon } from "@/components/icons";
import { ArrowRight, Lock, Mail, User } from "lucide-react";

export default function RegisterPage() {
  return (
    <div className="space-y-6">
      <div className="text-center space-y-1">
        <h1 className="text-2xl sm:text-3xl font-black font-heading tracking-tight text-black">
          Buat Akun Baru
        </h1>
        <p className="text-sm font-medium text-neutral-600">
          Nikmati tautan permanen, custom slug, analitik klik, dan QR dinamis 100% gratis.
        </p>
      </div>

      {/* Tombol Google OAuth */}
      <Button
        type="button"
        variant="outline"
        className="w-full flex items-center justify-center gap-2 bg-white text-black"
      >
        <GoogleIcon className="h-5 w-5" />
        <span>Daftar dengan Google</span>
      </Button>

      {/* Divider */}
      <div className="relative flex items-center justify-center">
        <div className="w-full border-t-2 border-black" />
        <span className="bg-cream px-3 font-mono text-xs font-black uppercase text-neutral-600 absolute">
          atau isi formulir
        </span>
      </div>

      {/* Form Register */}
      <form className="space-y-4">
        <div className="space-y-1.5">
          <label className="text-xs font-black uppercase tracking-wider text-black flex items-center gap-1.5">
            <User className="h-3.5 w-3.5" strokeWidth={2.5} />
            <span>Nama Lengkap</span>
          </label>
          <Input
            type="text"
            placeholder="Dimas Pratama"
            defaultValue="Dimas Pratama"
            required
          />
        </div>

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
          <label className="text-xs font-black uppercase tracking-wider text-black flex items-center gap-1.5">
            <Lock className="h-3.5 w-3.5" strokeWidth={2.5} />
            <span>Kata Sandi Baru</span>
          </label>
          <Input
            type="password"
            placeholder="Minimal 8 karakter"
            defaultValue="password123"
            required
            className="font-mono text-sm"
          />
        </div>

        <Button type="submit" variant="default" className="w-full">
          <span>Daftar Sekarang</span>
          <ArrowRight className="ml-1.5 h-4 w-4" strokeWidth={2.5} />
        </Button>
      </form>

      <div className="text-center pt-2 border-t-2 border-black">
        <p className="text-xs font-bold text-neutral-700">
          Sudah punya akun?{" "}
          <Link
            href="/masuk"
            className="text-black font-black underline underline-offset-4 hover:text-primary-dark"
          >
            Masuk di sini
          </Link>
        </p>
      </div>
    </div>
  );
}
