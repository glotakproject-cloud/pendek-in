"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BrandLogo } from "@/components/brand-logo";
import {
  LayoutDashboard,
  Link2,
  PlusCircle,
  BarChart3,
  Key,
  User,
  Bell,
  LogOut,
  ExternalLink,
} from "lucide-react";
import { cn } from "@/lib/utils";

export const memberMenuItems = [
  {
    href: "/dashboard",
    label: "Dasbor Utama",
    icon: LayoutDashboard,
  },
  {
    href: "/dashboard/tautan",
    label: "Kelola Tautan",
    icon: Link2,
  },
  {
    href: "/dashboard/tautan/baru",
    label: "Buat Tautan Baru",
    icon: PlusCircle,
    highlight: true,
  },
  {
    href: "/dashboard/analitik",
    label: "Analitik Global",
    icon: BarChart3,
  },
  {
    href: "/dashboard/api-key",
    label: "Kelola API Key",
    icon: Key,
  },
  {
    href: "/dashboard/profil",
    label: "Profil Saya",
    icon: User,
  },
  {
    href: "/dashboard/notifikasi",
    label: "Notifikasi",
    icon: Bell,
  },
];

export function DashboardSidebar({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();

  return (
    <aside className="w-[260px] h-full bg-white border-r-2 border-black flex flex-col justify-between select-none">
      {/* Top Branding */}
      <div>
        <div className="h-20 border-b-2 border-black px-6 flex items-center">
          <BrandLogo size="default" />
        </div>

        {/* Navigation Items */}
        <nav className="p-4 space-y-1.5">
          <div className="text-[11px] font-mono font-black uppercase text-neutral-500 px-3 py-1">
            Menu Member
          </div>
          {memberMenuItems.map((item) => {
            const isActive =
              item.href === "/dashboard"
                ? pathname === "/dashboard"
                : pathname.startsWith(item.href);

            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onNavigate}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 text-sm font-bold border-2 transition-all",
                  isActive
                    ? "bg-primary text-black border-black shadow-brutal-sm"
                    : item.highlight
                    ? "bg-accent/40 text-black border-dashed border-black hover:bg-accent"
                    : "border-transparent text-neutral-800 hover:bg-cream hover:border-black"
                )}
              >
                <Icon className="h-5 w-5 shrink-0" strokeWidth={2.5} />
                <span className="truncate">{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Bottom User Persona Card */}
      <div className="p-4 border-t-2 border-black bg-cream/60">
        <div className="border-2 border-black bg-white p-3 shadow-brutal-sm flex items-center justify-between">
          <div className="flex items-center gap-2.5 overflow-hidden">
            <div className="w-9 h-9 rounded-none border-2 border-black bg-primary flex items-center justify-center font-heading font-black text-sm shrink-0">
              DP
            </div>
            <div className="min-w-0">
              <p className="text-xs font-black truncate text-black">Dimas Pratama</p>
              <p className="text-[10px] font-mono font-medium text-neutral-600 truncate">
                dimas.pratama@gmail.com
              </p>
            </div>
          </div>
          <Link
            href="/masuk"
            className="p-1.5 border border-black hover:bg-destructive hover:text-white transition-colors"
            title="Keluar"
            onClick={onNavigate}
          >
            <LogOut className="h-4 w-4" strokeWidth={2.5} />
          </Link>
        </div>

        <div className="mt-2 flex items-center justify-between px-1 text-[11px] font-mono font-semibold text-neutral-600">
          <Link href="/" target="_blank" className="hover:underline flex items-center gap-1">
            Lihat Web <ExternalLink className="h-3 w-3" strokeWidth={2.5} />
          </Link>
          <span className="bg-accent px-1.5 py-0.5 border border-black text-[10px] font-bold">
            MEMBER
          </span>
        </div>
      </div>
    </aside>
  );
}
