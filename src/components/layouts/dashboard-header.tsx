"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { PlusCircle, Bell, User, Key, LogOut, ChevronRight, Menu } from "lucide-react";

export function DashboardHeader({ onOpenMobile }: { onOpenMobile?: () => void }) {
  const pathname = usePathname();

  // Simple breadcrumb generator
  const pathSegments = pathname.split("/").filter(Boolean);
  const breadcrumbTitle =
    pathSegments.length > 1
      ? pathSegments[1].charAt(0).toUpperCase() + pathSegments[1].slice(1)
      : "Dasbor";

  return (
    <header className="h-20 bg-white border-b-2 border-black px-4 sm:px-8 flex items-center justify-between sticky top-0 z-30">
      {/* Left: Mobile hamburger & Breadcrumb */}
      <div className="flex items-center gap-4">
        {onOpenMobile && (
          <Button
            variant="outline"
            size="iconSm"
            className="md:hidden"
            onClick={onOpenMobile}
            aria-label="Menu"
          >
            <Menu className="h-5 w-5" strokeWidth={2.5} />
          </Button>
        )}

        <div className="flex items-center gap-2 text-sm font-heading font-bold">
          <Link href="/dashboard" className="text-neutral-500 hover:text-black">
            Dashboard
          </Link>
          {pathSegments.length > 1 && (
            <>
              <ChevronRight className="h-4 w-4 text-black" strokeWidth={2.5} />
              <span className="text-black bg-cream px-2 py-0.5 border border-black">
                {breadcrumbTitle}
              </span>
            </>
          )}
        </div>
      </div>

      {/* Right: Quick actions, notifications, user avatar */}
      <div className="flex items-center gap-3">
        <Button size="sm" variant="default" asChild className="hidden sm:inline-flex">
          <Link href="/dashboard/tautan/baru" className="flex items-center gap-1.5">
            <PlusCircle className="h-4 w-4" strokeWidth={2.5} />
            <span>Tautan Baru</span>
          </Link>
        </Button>

        {/* Notifications Icon Button */}
        <Link
          href="/dashboard/notifikasi"
          className="relative w-10 h-10 border-2 border-black bg-white flex items-center justify-center shadow-brutal-sm hover:bg-cream transition-all active:translate-x-0.5 active:translate-y-0.5"
          aria-label="Notifikasi"
        >
          <Bell className="h-5 w-5" strokeWidth={2.5} />
          <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-primary border border-black rounded-full" />
        </Link>

        {/* User Avatar Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-2 border-2 border-black bg-white p-1 shadow-brutal-sm hover:bg-cream transition-all active:translate-x-0.5 active:translate-y-0.5 focus:outline-none">
              <div className="w-8 h-8 bg-primary border-2 border-black flex items-center justify-center font-heading font-black text-xs">
                DP
              </div>
              <span className="hidden lg:inline text-xs font-bold pr-1">Dimas P.</span>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel className="border-b-2 border-black pb-2">
              <div className="font-bold text-black">Dimas Pratama</div>
              <div className="font-mono text-[11px] text-neutral-600 font-normal">
                dimas.pratama@gmail.com
              </div>
            </DropdownMenuLabel>
            <DropdownMenuItem asChild>
              <Link href="/dashboard/profil" className="flex items-center gap-2">
                <User className="h-4 w-4" strokeWidth={2.5} />
                <span>Profil Saya</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/dashboard/api-key" className="flex items-center gap-2">
                <Key className="h-4 w-4" strokeWidth={2.5} />
                <span>Kelola API Key</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild className="hover:!bg-destructive hover:!text-white">
              <Link href="/masuk" className="flex items-center gap-2">
                <LogOut className="h-4 w-4" strokeWidth={2.5} />
                <span>Keluar Akun</span>
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
