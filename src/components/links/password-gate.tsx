"use client";

import * as React from "react";
import Link from "next/link";
import { Lock, ArrowRight, Eye, EyeOff, ShieldAlert, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { BrandLogo } from "@/components/brand-logo";
import { verifyLinkPassword } from "@/actions/links";

interface PasswordGateProps {
  slug: string;
  title?: string | null;
}

export function PasswordGate({ slug, title }: PasswordGateProps) {
  const [password, setPassword] = React.useState("");
  const [showPassword, setShowPassword] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password) {
      setErrorMessage("Harap masukkan kata sandi tautan");
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    try {
      const res = await verifyLinkPassword(slug, password);
      if (!res.success) {
        setErrorMessage(res.error || "Kata sandi salah. Silakan coba lagi.");
        setIsLoading(false);
        return;
      }

      toast.success("Kata sandi benar! Mengalihkan...");
      if (res.original_url) {
        window.location.href = res.original_url;
      }
    } catch {
      setErrorMessage("Terjadi kesalahan sistem saat memverifikasi kata sandi.");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-cream text-black flex flex-col justify-between p-4 sm:p-8">
      {/* Header */}
      <header className="max-w-xl mx-auto w-full flex items-center justify-between">
        <BrandLogo size="default" />
        <Link
          href="/"
          className="text-xs font-bold text-neutral-600 hover:text-black flex items-center gap-1"
        >
          <ArrowLeft className="h-3.5 w-3.5" strokeWidth={2.5} />
          <span>Ke Beranda</span>
        </Link>
      </header>

      {/* Main Card */}
      <main className="my-auto py-8 max-w-md mx-auto w-full">
        <Card className="border-[3px] border-black bg-white shadow-brutal-xl p-6 sm:p-8 space-y-6">
          <div className="w-16 h-16 mx-auto bg-amber-400 border-2 border-black rounded-xl shadow-brutal flex items-center justify-center">
            <Lock className="h-8 w-8 text-black" strokeWidth={2.5} />
          </div>

          <div className="text-center space-y-2">
            <h1 className="text-2xl font-black font-heading text-black">
              Tautan Dilindungi Sandi
            </h1>
            <p className="text-sm font-medium text-neutral-600">
              Pemilik tautan <strong className="font-mono text-black">pendek.in/s/{slug}</strong>{" "}
              telah mengaktifkan proteksi keamanan sandi.
            </p>
            {title && (
              <p className="text-xs font-bold text-neutral-500 uppercase tracking-wider">
                Target: {title}
              </p>
            )}
          </div>

          {errorMessage && (
            <div className="p-3 border-2 border-black bg-rose-100 flex items-start gap-2 text-xs font-bold text-rose-900 shadow-brutal-sm">
              <ShieldAlert className="h-4 w-4 shrink-0 text-rose-700 mt-0.5" strokeWidth={2.5} />
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-black uppercase tracking-wider text-black flex items-center gap-1.5">
                <Lock className="h-3.5 w-3.5" strokeWidth={2.5} />
                <span>Masukkan Kata Sandi</span>
              </label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  autoFocus
                  disabled={isLoading}
                  className="font-mono text-sm border-2 border-black bg-white pr-10"
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
              disabled={isLoading}
              className="w-full h-12 shadow-brutal text-base font-heading font-black"
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-black border-t-transparent animate-spin rounded-full inline-block" />
                  <span>Memverifikasi...</span>
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  <span>Buka Tautan</span>
                  <ArrowRight className="h-4 w-4" strokeWidth={2.5} />
                </span>
              )}
            </Button>
          </form>

          <div className="pt-2 border-t-2 border-black text-center">
            <p className="text-xs text-neutral-500 font-medium">
              Keamanan diverifikasi otomatis oleh sistem Pendek-In URL Protection.
            </p>
          </div>
        </Card>
      </main>

      <footer className="text-center text-xs font-bold text-neutral-600">
        &copy; {new Date().getFullYear()} Pendek-In. Hak Cipta Dilindungi.
      </footer>
    </div>
  );
}
