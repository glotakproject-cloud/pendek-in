import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dokumentasi REST API Publik v1",
  description:
    "Dokumentasi resmi Pendek-In Public REST API v1. Integrasikan pemendekan URL, pengelolaan slug kustom, dan analitik performa ke dalam sistem aplikasi Anda.",
  openGraph: {
    title: "Dokumentasi Public REST API v1 | Pendek-In",
    description:
      "Integrasikan engine pemendek tautan Pendek-In langsung ke aplikasi Anda melalui Bearer API Key dengan kuota 120 req/menit.",
  },
};

export default function ApiPublikLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
