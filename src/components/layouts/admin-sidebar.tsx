"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BrandLogo } from "@/components/brand-logo";
import {
  LayoutDashboard,
  Users,
  Link2,
  ShieldAlert,
  Ban,
  FileText,
  Settings,
  LogOut,
  ExternalLink,
} from "lucide-react";
import { cn } from "@/lib/utils";

export const adminMenuItems = [
  {
    href: "/admin",
    label: "Dasbor Admin",
    icon: LayoutDashboard,
  },
  {
    href: "/admin/pengguna",
    label: "Kelola Pengguna",
    icon: Users,
  },
  {
    href: "/admin/tautan",
    label: "Moderasi Tautan",
    icon: Link2,
  },
  {
    href: "/admin/domain-terblokir",
    label: "Domain Terblokir",
    icon: ShieldAlert,
  },
  {
    href: "/admin/kata-terlarang",
    label: "Kata Terlarang",
    icon: Ban,
  },
  {
    href: "/admin/log-aktivitas",
    label: "Log Aktivitas",
    icon: FileText,
  },
  {
    href: "/admin/pengaturan",
    label: "Pengaturan Sistem",
    icon: Settings,
  },
];

export function AdminSidebar({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();

  return (
    <aside className="w-[260px] h-full bg-black text-white border-r-2 border-black flex flex-col justify-between select-none">
      {/* Top Branding */}
      <div>
        <div className="h-20 border-b-2 border-neutral-800 px-6 flex items-center justify-between">
          <BrandLogo size="default" className="text-white [&_span]:text-white" />
          <span className="bg-destructive text-white text-[10px] font-black px-1.5 py-0.5 border border-white uppercase tracking-wider">
            ADMIN
          </span>
        </div>

        {/* Navigation Items */}
        <nav className="p-4 space-y-1.5">
          <div className="text-[11px] font-mono font-black uppercase text-neutral-400 px-3 py-1">
            Menu Super Admin
          </div>
          {adminMenuItems.map((item) => {
            const isActive =
              item.href === "/admin"
                ? pathname === "/admin"
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
                    ? "bg-primary text-black border-white shadow-[4px_4px_0px_0px_#FFFFFF]"
                    : "border-transparent text-neutral-300 hover:bg-neutral-900 hover:text-white hover:border-neutral-700"
                )}
              >
                <Icon className="h-5 w-5 shrink-0" strokeWidth={2.5} />
                <span className="truncate">{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Bottom Admin User Card */}
      <div className="p-4 border-t-2 border-neutral-800 bg-neutral-950">
        <div className="border-2 border-neutral-700 bg-neutral-900 p-3 shadow-brutal-sm flex items-center justify-between">
          <div className="flex items-center gap-2.5 overflow-hidden">
            <div className="w-9 h-9 rounded-none border-2 border-white bg-destructive text-white flex items-center justify-center font-heading font-black text-xs shrink-0">
              SA
            </div>
            <div className="min-w-0">
              <p className="text-xs font-black truncate text-white">Super Admin</p>
              <p className="text-[10px] font-mono font-medium text-neutral-400 truncate">
                admin@pendek.in
              </p>
            </div>
          </div>
          <Link
            href="/masuk"
            className="p-1.5 border border-neutral-700 text-neutral-300 hover:bg-destructive hover:text-white transition-colors"
            title="Keluar"
            onClick={onNavigate}
          >
            <LogOut className="h-4 w-4" strokeWidth={2.5} />
          </Link>
        </div>

        <div className="mt-2 flex items-center justify-between px-1 text-[11px] font-mono font-semibold text-neutral-400">
          <Link href="/dashboard" className="hover:underline flex items-center gap-1 hover:text-white">
            Ke Member <ExternalLink className="h-3 w-3" strokeWidth={2.5} />
          </Link>
          <span className="bg-destructive text-white px-1.5 py-0.5 border border-white text-[10px] font-bold">
            ROOT
          </span>
        </div>
      </div>
    </aside>
  );
}
