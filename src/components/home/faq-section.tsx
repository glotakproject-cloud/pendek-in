"use client";

import Link from "next/link";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { HelpCircle, ArrowRight } from "lucide-react";

const faqs = [
  {
    id: "item-1",
    question: "Apakah layanan Pendek-In benar-benar 100% gratis?",
    answer:
      "Ya, seluruh fitur utama Pendek-In gratis selamanya tanpa biaya berlangganan, biaya tersembunyi, maupun kewajiban memasukkan kartu kredit. Anda dapat memendekkan tautan tanpa batas, membuat kode QR dinamis, melihat analitik performa klik, serta mengakses Public REST API secara cuma-cuma.",
  },
  {
    id: "item-2",
    question: "Berapa lama tautan pendek yang dibuat akan tetap aktif?",
    answer:
      "Untuk pengguna tamu (guest yang tidak login), tautan pendek akan aktif selama 7 hari. Namun, bila Anda mendaftar akun gratis (via Google atau Email), seluruh tautan yang Anda buat akan aktif secara permanen tanpa batas waktu selama tidak melanggar ketentuan domain terlarang kami.",
  },
  {
    id: "item-3",
    question: "Apa perbedaan akun Tamu (Guest) dan Member terdaftar?",
    answer:
      "Pengguna Tamu hanya bisa membuat tautan acak cepat yang berlaku 7 hari dan tersimpan di riwayat browser lokal. Sementara itu, Member terdaftar mendapatkan dasbor manajemen tautan pribadi, masa aktif tautan permanen, kustomisasi back-half (slug), editor warna kode QR dinamis, analitik grafik lengkap 7-30 hari, serta API Key developer.",
  },
  {
    id: "item-4",
    question: "Bagaimana cara membuat tautan dengan slug kustom (branding)?",
    answer:
      "Setelah mendaftar dan masuk ke akun Anda, klik 'Buat Tautan Baru' di dasbor. Masukkan URL tujuan dan ketikkan slug yang Anda inginkan (misal: 'diskon-merdeka'). Sistem kami akan langsung mengecek ketersediaan slug tersebut secara real-time. Jika tersedia, tautan pendek Anda akan langsung aktif beralamat pendek.in/diskon-merdeka.",
  },
  {
    id: "item-5",
    question: "Bagaimana cara kerja Kode QR Dinamis di Pendek-In?",
    answer:
      "Setiap QR Code yang diunduh dari Pendek-In mengarahkan pemindai ke tautan pendek dinamis Anda. Artinya, jika di kemudian hari Anda ingin mengubah URL halaman tujuan (misalnya ganti link promo atau brosur), Anda cukup memperbarui link tujuan di dashboard tanpa perlu mencetak ulang stiker, kartu nama, atau kemasan fisik Anda.",
  },
  {
    id: "item-6",
    question: "Bagaimana Pendek-In menjamin privasi pengunjung pada analitik klik?",
    answer:
      "Kami sangat mengutamakan kepatuhan privasi data. Alamat IP pengunjung tidak pernah disimpan secara mentah (plain text) di database kami. Sistem kami mengenkripsi IP menggunakan algoritma hash SHA-256 dipadu dengan salt rahasia server untuk mendeteksi klik unik tanpa mengekspos identitas pribadi pengunjung.",
  },
  {
    id: "item-7",
    question: "Apakah saya bisa mengintegrasikan REST API ke aplikasi saya?",
    answer:
      "Tentu saja! Member terdaftar dapat membuat token API (pk_live_...) di menu API Key dashboard. Anda dapat menggunakan endpoint POST /api/v1/links untuk membuat tautan otomatis dari bot Telegram, WhatsApp, form pendaftaran web, atau aplikasi backend lainnya dengan batas kuota 120 permintaan per menit.",
  },
];

export function FaqSection() {
  return (
    <section className="py-20 md:py-28 bg-white border-b-2 border-black">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Header */}
        <div className="text-center space-y-4">
          <Badge variant="default" className="text-xs sm:text-sm py-1 px-3">
            <HelpCircle className="h-3.5 w-3.5 mr-1" strokeWidth={2.5} /> Tanya Jawab Populer
          </Badge>
          <h2 className="text-3xl sm:text-5xl font-heading font-black tracking-tight text-black">
            Pertanyaan yang Sering{" "}
            <span className="bg-accent px-2 py-0.5 border-2 border-black shadow-brutal inline-block">
              Diajukan
            </span>
          </h2>
          <p className="text-base sm:text-lg font-medium text-neutral-700 max-w-xl mx-auto">
            Semua hal yang perlu Anda ketahui tentang cara kerja, batasan sistem, dan fitur unggulan Pendek-In.
          </p>
        </div>

        {/* Accordion Component */}
        <Accordion type="single" defaultValue="item-1" className="space-y-4">
          {faqs.map((faq) => (
            <AccordionItem key={faq.id} value={faq.id}>
              <AccordionTrigger value={faq.id}>
                {faq.question}
              </AccordionTrigger>
              <AccordionContent>
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>

        {/* Extra Help Callout */}
        <div className="p-6 bg-cream border-2 border-black shadow-brutal text-center space-y-3">
          <h4 className="font-heading font-black text-lg text-black">
            Punya pertanyaan lain yang belum terjawab?
          </h4>
          <p className="text-xs sm:text-sm font-medium text-neutral-700">
            Tim dukungan kami siap membantu Anda menyelesaikan masalah teknis maupun pertanyaan umum.
          </p>
          <div className="pt-2">
            <Link
              href="/kontak"
              className="inline-flex items-center gap-1.5 font-heading font-black text-sm text-black underline underline-offset-4 decoration-2 hover:text-primary-dark"
            >
              <span>Hubungi Dukungan Pendek-In</span>
              <ArrowRight className="h-4 w-4" strokeWidth={2.5} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
