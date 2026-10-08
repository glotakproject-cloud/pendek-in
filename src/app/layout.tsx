import type { Metadata } from "next";
import { Space_Grotesk, Archivo_Black, Inter, Space_Mono } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  weight: ["500", "700"],
});

const archivoBlack = Archivo_Black({
  subsets: ["latin"],
  variable: "--font-archivo-black",
  weight: "400",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  weight: ["400", "500", "600", "700"],
});

const spaceMono = Space_Mono({
  subsets: ["latin"],
  variable: "--font-space-mono",
  weight: ["400", "700"],
});

export const metadata: Metadata = {
  title: "Pendek-In | Pemendek Tautan Modern Neobrutalisme",
  description:
    "Layanan pemendek tautan modern bergaya Neobrutalisme dengan kustomisasi back-half, kode QR dinamis, dan analitik performa klik real-time.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="id"
      className={`${spaceGrotesk.variable} ${archivoBlack.variable} ${inter.variable} ${spaceMono.variable}`}
    >
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
