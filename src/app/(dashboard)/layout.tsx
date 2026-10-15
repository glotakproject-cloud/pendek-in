import type { Metadata } from "next";
import { DashboardLayoutClient } from "@/components/layouts/dashboard-layout-client";

export const metadata: Metadata = {
  title: {
    default: "Dashboard",
    template: "%s | Dashboard Pendek-In",
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

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <DashboardLayoutClient>{children}</DashboardLayoutClient>;
}
