import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Hubungi Kami | Bantuan & Laporan Abuse",
  description:
    "Hubungi tim dukungan Pendek-In untuk pertanyaan umum, bantuan teknis API, kemitraan, atau pelaporan tautan berbahaya (abuse).",
  openGraph: {
    title: "Hubungi Tim Pendek-In",
    description:
      "Layanan bantuan pengguna dan pelaporan tautan phishing/malware. Respons cepat dalam 1x24 jam.",
  },
};

export default function KontakLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
