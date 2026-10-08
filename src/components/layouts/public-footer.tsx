import Link from "next/link";
import { BrandLogo } from "@/components/brand-logo";
import { GithubIcon, TwitterIcon, InstagramIcon } from "@/components/icons";
import { Mail } from "lucide-react";

export function PublicFooter() {
  return (
    <footer className="border-t-2 border-black bg-cream text-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Kolom 1: Profil Brand */}
          <div className="space-y-4 md:col-span-1">
            <BrandLogo size="default" />
            <p className="text-sm font-medium text-neutral-700 leading-relaxed">
              Layanan pemendek tautan modern bergaya Neobrutalisme Indonesia. Cepat, berani, tanpa kompromi.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <a
                href="https://github.com"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 border-2 border-black bg-white flex items-center justify-center shadow-brutal-sm hover:bg-primary transition-all active:translate-x-0.5 active:translate-y-0.5"
                aria-label="GitHub"
              >
                <GithubIcon className="w-4 h-4" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 border-2 border-black bg-white flex items-center justify-center shadow-brutal-sm hover:bg-accent transition-all active:translate-x-0.5 active:translate-y-0.5"
                aria-label="Twitter"
              >
                <TwitterIcon className="w-4 h-4" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 border-2 border-black bg-white flex items-center justify-center shadow-brutal-sm hover:bg-primary transition-all active:translate-x-0.5 active:translate-y-0.5"
                aria-label="Instagram"
              >
                <InstagramIcon className="w-4 h-4" />
              </a>
              <a
                href="mailto:support@pendek.in"
                className="w-9 h-9 border-2 border-black bg-white flex items-center justify-center shadow-brutal-sm hover:bg-accent transition-all active:translate-x-0.5 active:translate-y-0.5"
                aria-label="Email"
              >
                <Mail size={18} strokeWidth={2.5} />
              </a>
            </div>
          </div>

          {/* Kolom 2: Produk & Fitur */}
          <div className="space-y-3">
            <h4 className="font-heading font-black text-sm uppercase tracking-wider text-black border-b-2 border-black pb-1 inline-block">
              Produk
            </h4>
            <ul className="space-y-2 text-sm font-semibold">
              <li>
                <Link href="/#fitur" className="hover:underline underline-offset-4 decoration-2">
                  Pemendek Tautan
                </Link>
              </li>
              <li>
                <Link href="/#fitur" className="hover:underline underline-offset-4 decoration-2">
                  Kustom Back-Half
                </Link>
              </li>
              <li>
                <Link href="/#fitur" className="hover:underline underline-offset-4 decoration-2">
                  Kode QR Dinamis
                </Link>
              </li>
              <li>
                <Link href="/#fitur" className="hover:underline underline-offset-4 decoration-2">
                  Pelacakan Analitik
                </Link>
              </li>
              <li>
                <Link href="/harga" className="hover:underline underline-offset-4 decoration-2">
                  Paket &amp; Harga (100% Gratis)
                </Link>
              </li>
            </ul>
          </div>

          {/* Kolom 3: Developer & Referensi */}
          <div className="space-y-3">
            <h4 className="font-heading font-black text-sm uppercase tracking-wider text-black border-b-2 border-black pb-1 inline-block">
              Pengembang
            </h4>
            <ul className="space-y-2 text-sm font-semibold">
              <li>
                <Link href="/api-publik" className="hover:underline underline-offset-4 decoration-2">
                  Dokumentasi REST API
                </Link>
              </li>
              <li>
                <Link href="/dashboard/api-key" className="hover:underline underline-offset-4 decoration-2">
                  Kelola API Key
                </Link>
              </li>
              <li>
                <a
                  href="https://github.com/glotakproject-cloud/pendek-in"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:underline underline-offset-4 decoration-2"
                >
                  Repositori GitHub
                </a>
              </li>
              <li>
                <Link href="/tentang" className="hover:underline underline-offset-4 decoration-2">
                  Tentang Pendek-In
                </Link>
              </li>
            </ul>
          </div>

          {/* Kolom 4: Legal & Bantuan */}
          <div className="space-y-3">
            <h4 className="font-heading font-black text-sm uppercase tracking-wider text-black border-b-2 border-black pb-1 inline-block">
              Bantuan &amp; Legal
            </h4>
            <ul className="space-y-2 text-sm font-semibold">
              <li>
                <Link href="/kontak" className="hover:underline underline-offset-4 decoration-2">
                  Hubungi Kami
                </Link>
              </li>
              <li>
                <Link href="/syarat-ketentuan" className="hover:underline underline-offset-4 decoration-2">
                  Syarat &amp; Ketentuan
                </Link>
              </li>
              <li>
                <Link href="/kebijakan-privasi" className="hover:underline underline-offset-4 decoration-2">
                  Kebijakan Privasi
                </Link>
              </li>
              <li>
                <span className="inline-flex items-center gap-1 text-xs font-mono bg-white border border-black px-2 py-1">
                  Status Sistem: <span className="w-2 h-2 rounded-full bg-primary inline-block"></span> Normal
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright & Disclaimer Bar */}
        <div className="mt-12 pt-6 border-t-2 border-black flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono font-medium">
          <p>
            &copy; {new Date().getFullYear()} Pendek-In. Hak Cipta Dilindungi Undang-Undang.
          </p>
          <p className="flex items-center gap-1">
            Dibangun dengan rasa bangga di Indonesia
          </p>
        </div>
      </div>
    </footer>
  );
}
