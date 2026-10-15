import type { Metadata } from "next";
import { AdminLayoutClient } from "@/components/layouts/admin-layout-client";

export const metadata: Metadata = {
  title: {
    default: "Super Admin",
    template: "%s | Super Admin Pendek-In",
  },
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: {
      index: false,
      follow: false,
    },
  },
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AdminLayoutClient>{children}</AdminLayoutClient>;
}
