import type { Metadata } from "next";
import { Toaster } from "sonner";
import "./globals.css";

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
