import type { Metadata, Viewport } from "next";
import { Toaster } from "sonner";
import "./globals.css";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "https://pendek.in";

export const viewport: Viewport = {
  themeColor: "#00D26A",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL(APP_URL),
  title: {
    default: "Pendek-In | Pemendek Tautan Modern Neobrutalisme",
    template: "%s | Pendek-In",
  },
  description:
    "Layanan pemendek tautan modern bergaya visual Neobrutalisme berani — kustomisasi back-half URL, kode QR dinamis, analitik klik real-time, dan Public REST API developer.",
  keywords: [
    "url shortener",
    "pemendek tautan",
    "short link indonesia",
    "link shortener gratis",
    "kode qr dinamis",
    "analitik tautan",
    "neobrutalism",
    "rest api short link",
    "pendek-in",
  ],
  authors: [{ name: "Tim Pengembang Pendek-In", url: APP_URL }],
  creator: "Pendek-In",
  publisher: "Pendek-In Inc.",
  applicationName: "Pendek-In",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "id_ID",
    url: APP_URL,
    siteName: "Pendek-In",
    title: "Pendek-In | Pemendek Tautan Modern Neobrutalisme",
    description:
      "Ubah URL panjang menjadi tautan pendek yang estetik, aman, dan mudah dibagikan. Dilengkapi QR dinamis dan analitik klik mendalam.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Pendek-In - URL Shortener Modern Neobrutalisme",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Pendek-In | Pemendek Tautan Modern Neobrutalisme",
    description:
      "Ubah URL panjang menjadi tautan pendek yang estetik, aman, dan mudah dibagikan. Dilengkapi QR dinamis dan analitik klik mendalam.",
    images: ["/og-image.png"],
    creator: "@pendekin",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body className="min-h-screen bg-white text-black font-sans antialiased selection:bg-accent selection:text-black">
        {children}
        <Toaster
          position="top-right"
          toastOptions={{
            className:
              "!border-2 !border-black !bg-white !text-black !font-bold !shadow-brutal !rounded-none",
          }}
        />
      </body>
    </html>
  );
}
