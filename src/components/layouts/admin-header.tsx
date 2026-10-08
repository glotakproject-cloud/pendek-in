"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Settings, Shield, LogOut, ChevronRight, Menu, ExternalLink } from "lucide-react";

export function AdminHeader({ onOpenMobile }: { onOpenMobile?: () => void }) {
  const pathname = usePathname();

  const pathSegments = pathname.split("/").filter(Boolean);
  const breadcrumbTitle =
    pathSegments.length > 1
      ? pathSegments[1].charAt(0).toUpperCase() + pathSegments[1].slice(1)
      : "Ringkasan";

  return (
    <header className="h-20 bg-white border-b-2 border-black px-4 sm:px-8 flex items-center justify-between sticky top-0 z-30">
      {/* Left: Mobile hamburger, red badge, & Breadcrumb */}
      <div className="flex items-center gap-3 sm:gap-4">
        {onOpenMobile && (
          <Button
            variant="outline"
            size="iconSm"
            className="md:hidden"
            onClick={onOpenMobile}
            aria-label="Menu Admin"
          >
            <Menu className="h-5 w-5" strokeWidth={2.5} />
          </Button>
        )}

        <Badge variant="destructive" className="font-mono text-[11px] shadow-brutal-sm">
          SUPER ADMIN
        </Badge>

        <div className="hidden sm:flex items-center gap-2 text-sm font-heading font-bold">
          <Link href="/admin" className="text-neutral-500 hover:text-black">
            Admin Panel
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

      {/* Right: Quick actions, Admin dropdown */}
      <div className="flex items-center gap-3">
        <Button size="sm" variant="outline" asChild className="hidden sm:inline-flex">
          <Link href="/dashboard" className="flex items-center gap-1.5">
            <span>Area Member</span>
            <ExternalLink className="h-3.5 w-3.5" strokeWidth={2.5} />
          </Link>
        </Button>

        {/* Super Admin Avatar Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-2 border-2 border-black bg-white p-1 shadow-brutal-sm hover:bg-cream transition-all active:translate-x-0.5 active:translate-y-0.5 focus:outline-none">
              <div className="w-8 h-8 bg-destructive text-white border-2 border-black flex items-center justify-center font-heading font-black text-xs">
                SA
              </div>
              <span className="hidden lg:inline text-xs font-bold pr-1">Super Admin</span>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel className="border-b-2 border-black pb-2">
              <div className="font-bold text-black flex items-center gap-1.5">
                <Shield className="h-4 w-4 text-destructive fill-destructive/20" strokeWidth={2.5} />
                <span>Super Administrator</span>
              </div>
              <div className="font-mono text-[11px] text-neutral-600 font-normal">
                admin@pendek.in
              </div>
            </DropdownMenuLabel>
            <DropdownMenuItem asChild>
              <Link href="/admin/pengaturan" className="flex items-center gap-2">
                <Settings className="h-4 w-4" strokeWidth={2.5} />
                <span>Pengaturan Sistem</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild className="hover:!bg-destructive hover:!text-white">
              <Link href="/masuk" className="flex items-center gap-2">
                <LogOut className="h-4 w-4" strokeWidth={2.5} />
                <span>Keluar Panel</span>
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
