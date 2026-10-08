"use client";

import Link from "next/link";
import { useState } from "react";
import { BrandLogo } from "@/components/brand-logo";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Menu, ArrowRight } from "lucide-react";

const navLinks = [
  { href: "/#fitur", label: "Fitur" },
  { href: "/harga", label: "Harga" },
  { href: "/api-publik", label: "REST API" },
  { href: "/tentang", label: "Tentang" },
  { href: "/kontak", label: "Kontak" },
];

export function PublicNavbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full border-b-2 border-black bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Logo */}
        <BrandLogo size="default" />

        {/* Desktop Nav Items */}
        <nav className="hidden md:flex items-center gap-8 font-heading font-bold text-sm tracking-wide">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="text-black hover:text-primary-dark hover:underline underline-offset-4 decoration-2 transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Desktop Action Buttons */}
        <div className="hidden md:flex items-center gap-3">
          <Button variant="outline" size="sm" asChild>
            <Link href="/masuk">Masuk</Link>
          </Button>
          <Button variant="default" size="sm" asChild>
            <Link href="/daftar" className="flex items-center gap-1.5">
              <span>Daftar Gratis</span>
              <ArrowRight className="h-4 w-4" strokeWidth={2.5} />
            </Link>
          </Button>
        </div>

        {/* Mobile Hamburger Drawer */}
        <div className="flex md:hidden">
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="iconSm" aria-label="Buka Menu">
                <Menu className="h-5 w-5" strokeWidth={2.5} />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] flex flex-col justify-between">
              <div>
                <SheetHeader className="mb-6">
                  <SheetTitle className="text-left">
                    <BrandLogo size="sm" />
                  </SheetTitle>
                </SheetHeader>
                <nav className="flex flex-col gap-4">
                  {navLinks.map((link) => (
                    <Link
                      key={link.label}
                      href={link.href}
                      onClick={() => setIsOpen(false)}
                      className="text-lg font-heading font-black text-black hover:bg-cream p-2 border-2 border-transparent hover:border-black transition-all"
                    >
                      {link.label}
                    </Link>
                  ))}
                </nav>
              </div>

              <div className="flex flex-col gap-3 pt-6 border-t-2 border-black">
                <Button variant="outline" className="w-full" asChild onClick={() => setIsOpen(false)}>
                  <Link href="/masuk">Masuk</Link>
                </Button>
                <Button variant="default" className="w-full" asChild onClick={() => setIsOpen(false)}>
                  <Link href="/daftar">Daftar Sekarang</Link>
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
