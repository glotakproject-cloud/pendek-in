"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { GoogleIcon } from "@/components/icons";
import { ArrowRight, Lock, Mail, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = React.useState("dimas.pratama@gmail.com");
  const [password, setPassword] = React.useState("password123");
  const [showPassword, setShowPassword] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = React.useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Harap isi email dan kata sandi Anda");
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      toast.success("Berhasil masuk! Mengarahkan ke Dasbor...");
      router.push("/dashboard");
    }, 700);
  };

  const handleGoogleLogin = () => {
    setIsGoogleLoading(true);
    setTimeout(() => {
      setIsGoogleLoading(false);
      toast.success("Autentikasi Google berhasil! Mengarahkan...");
      router.push("/dashboard");
    }, 800);
  };

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
        onClick={handleGoogleLogin}
        disabled={isGoogleLoading || isLoading}
        className="w-full flex items-center justify-center gap-2 bg-white text-black h-12 shadow-brutal hover:bg-cream"
      >
        {isGoogleLoading ? (
          <span className="w-5 h-5 border-2 border-black border-t-transparent animate-spin rounded-full inline-block" />
        ) : (
          <GoogleIcon className="h-5 w-5" />
        )}
        <span>{isGoogleLoading ? "Menghubungkan ke Google..." : "Masuk dengan Google"}</span>
      </Button>

      {/* Divider */}
      <div className="relative flex items-center justify-center">
        <div className="w-full border-t-2 border-black" />
        <span className="bg-cream px-3 font-mono text-xs font-black uppercase text-neutral-600 absolute">
          atau via email
        </span>
      </div>

      {/* Form Login */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1.5">
          <label className="text-xs font-black uppercase tracking-wider text-black flex items-center gap-1.5">
            <Mail className="h-3.5 w-3.5" strokeWidth={2.5} />
            <span>Alamat Email</span>
          </label>
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="dimas.pratama@gmail.com"
            required
            className="font-mono text-sm border-2 border-black bg-white"
            disabled={isLoading}
          />
        </div>

        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="text-xs font-black uppercase tracking-wider text-black flex items-center gap-1.5">
              <Lock className="h-3.5 w-3.5" strokeWidth={2.5} />
              <span>Kata Sandi</span>
            </label>
            <button
              type="button"
              onClick={() => toast.info("Fitur reset sandi via email akan aktif pada Fase 2.")}
              className="text-xs font-bold text-neutral-700 hover:text-black hover:underline"
            >
              Lupa sandi?
            </button>
          </div>
          <div className="relative">
            <Input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="font-mono text-sm border-2 border-black bg-white pr-10"
              disabled={isLoading}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-600 hover:text-black"
              tabIndex={-1}
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" strokeWidth={2.5} />
              ) : (
                <Eye className="h-4 w-4" strokeWidth={2.5} />
              )}
            </button>
          </div>
        </div>

        <Button
          type="submit"
          variant="default"
          disabled={isLoading || isGoogleLoading}
          className="w-full h-12 shadow-brutal text-base"
        >
          {isLoading ? (
            <span className="flex items-center gap-2">
              <span className="w-4 h-4 border-2 border-black border-t-transparent animate-spin rounded-full inline-block" />
              <span>Memverifikasi...</span>
            </span>
          ) : (
            <span className="flex items-center gap-1.5">
              <span>Masuk Sekarang</span>
              <ArrowRight className="h-4 w-4" strokeWidth={2.5} />
            </span>
          )}
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
