import type { Metadata } from "next";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { FileText, ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Syarat & Ketentuan Penggunaan | Pendek-In",
  description:
    "Syarat dan ketentuan resmi penggunaan layanan pemendek tautan Pendek-In. Ketentuan ini mengikat seluruh pengunjung dan pengguna terdaftar.",
};

export default function TermsOfServicePage() {
  return (
    <div className="w-full py-12 md:py-20 space-y-12">
      {/* Header */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 text-center space-y-4">
        <Badge variant="default" className="text-xs sm:text-sm py-1 px-3">
          <FileText className="h-3.5 w-3.5 mr-1" strokeWidth={2.5} /> Dokumen Legal
        </Badge>
        <h1 className="text-4xl sm:text-5xl font-heading font-black tracking-tight text-black">
          Syarat &amp; Ketentuan Penggunaan
        </h1>
        <p className="text-xs sm:text-sm font-mono font-bold text-neutral-600">
          Terakhir diperbarui: 10 Oktober 2026 &bull; Berlaku Efektif
        </p>
      </section>

      {/* Main Legal Content Card */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="bg-white border-[3px] border-black p-6 sm:p-10 shadow-brutal-xl space-y-8 leading-relaxed text-sm sm:text-base font-medium text-neutral-800">
          {/* Pasal 1 */}
          <div className="space-y-3">
            <h2 className="font-heading font-black text-xl text-black border-b-2 border-black pb-1.5 flex items-center gap-2">
              <span className="bg-primary px-2 py-0.5 border border-black text-xs font-mono">01</span>
              <span>Penerimaan Ketentuan</span>
            </h2>
            <p>
              Dengan mengakses situs web <strong>Pendek-In</strong> (pendek.in), menggunakan API publik, atau memendekkan tautan melalui layanan kami, Anda menyatakan telah membaca, memahami, dan menyetujui untuk terikat oleh seluruh Syarat &amp; Ketentuan ini. Jika Anda tidak menyetujui salah satu poin di sini, mohon untuk tidak menggunakan layanan kami.
            </p>
          </div>

          {/* Pasal 2 */}
          <div className="space-y-3">
            <h2 className="font-heading font-black text-xl text-black border-b-2 border-black pb-1.5 flex items-center gap-2">
              <span className="bg-primary px-2 py-0.5 border border-black text-xs font-mono">02</span>
              <span>Kelayakan &amp; Akun Pengguna</span>
            </h2>
            <p>
              Pengguna dapat menggunakan layanan pemendekan kilat sebagai Pengunjung Tamu atau mendaftar sebagai Member Terdaftar. Pengguna bertanggung jawab penuh atas keamanan kredensial akun, kerahasiaan kata sandi, dan pengelolaan API Key (<code className="font-mono text-xs font-bold bg-cream px-1 border border-black">pk_live_...</code>) yang diterbitkan untuk akunnya.
            </p>
          </div>

          {/* Pasal 3 */}
          <div className="space-y-3">
            <h2 className="font-heading font-black text-xl text-black border-b-2 border-black pb-1.5 flex items-center gap-2">
              <span className="bg-primary px-2 py-0.5 border border-black text-xs font-mono">03</span>
              <span>Larangan Penggunaan (Prohibited Activities)</span>
            </h2>
            <p>
              Layanan Pendek-In dilarang keras digunakan untuk tujuan atau konten berikut:
            </p>
            <ul className="list-disc list-inside space-y-1.5 pl-2 text-sm text-neutral-800 font-semibold">
              <li>Penyebaran tautan phishing, malware, ransomware, spyware, atau trojan.</li>
              <li>Penipuan keuangan, skema piramida ilegal, atau investasi bodong.</li>
              <li>Konten pornografi terlarang, materi eksploitasi anak, atau kekerasan eksplisit.</li>
              <li>Tautan yang mengarah ke ujaran kebencian, SARA, atau konten terorisme.</li>
              <li>Spam massal di forum, media sosial, atau pesan SMS/WhatsApp otomatis tak berizin.</li>
              <li>Penyalahgunaan rate-limit atau serangan penolakan layanan (Denial of Service/DDoS) pada sistem API Pendek-In.</li>
            </ul>
          </div>

          {/* Pasal 4 */}
          <div className="space-y-3">
            <h2 className="font-heading font-black text-xl text-black border-b-2 border-black pb-1.5 flex items-center gap-2">
              <span className="bg-primary px-2 py-0.5 border border-black text-xs font-mono">04</span>
              <span>Kustom Back-Half (Slug) &amp; Merek Dagang</span>
            </h2>
            <p>
              Pengguna dilarang mendaftarkan slug kustom yang melanggar hak cipta, merek dagang terdaftar pihak lain, atau beritikad buruk melakukan cybersquatting / impersonasi institusi resmi (seperti bank, lembaga pemerintah, atau brand ternama). Pendek-In berhak mencabut, mengubah, atau mengalihkan slug kustom yang terbukti melanggar ketentuan ini.
            </p>
          </div>

          {/* Pasal 5 */}
          <div className="space-y-3">
            <h2 className="font-heading font-black text-xl text-black border-b-2 border-black pb-1.5 flex items-center gap-2">
              <span className="bg-primary px-2 py-0.5 border border-black text-xs font-mono">05</span>
              <span>Hak Moderasi &amp; Pemblokiran Sistem</span>
            </h2>
            <p>
              Tim Administrator Pendek-In memiliki hak mutlak untuk memoderasi, memblokir tautan, menonaktifkan API Key, memasukkan domain target ke dalam daftar hitam (blacklist), atau menangguhkan akun pengguna tanpa pemberitahuan sebelumnya apabila ditemukan indikasi pelanggaran terhadap ketentuan layanan ini atau hukum yang berlaku di Indonesia.
            </p>
          </div>

          {/* Pasal 6 */}
          <div className="space-y-3">
            <h2 className="font-heading font-black text-xl text-black border-b-2 border-black pb-1.5 flex items-center gap-2">
              <span className="bg-primary px-2 py-0.5 border border-black text-xs font-mono">06</span>
              <span>Batasan Tanggung Jawab (Disclaimer)</span>
            </h2>
            <p>
              Pendek-In disediakan secara &ldquo;sebagaimana adanya&rdquo; (as-is) dan &ldquo;sebagaimana tersedia&rdquo; (as-available). Pendek-In tidak bertanggung jawab atas kerugian langsung maupun tidak langsung yang timbul akibat konten situs web pihak ketiga yang ditautkan oleh pengguna melalui layanan kami.
            </p>
          </div>

          {/* Pasal 7 */}
          <div className="space-y-3">
            <h2 className="font-heading font-black text-xl text-black border-b-2 border-black pb-1.5 flex items-center gap-2">
              <span className="bg-primary px-2 py-0.5 border border-black text-xs font-mono">07</span>
              <span>Hukum yang Mengatur</span>
            </h2>
            <p>
              Syarat dan Ketentuan ini diatur dan ditafsirkan sesuai dengan hukum Negara Kesatuan Republik Indonesia. Setiap perselisihan yang timbul akan diselesaikan secara musyawarah untuk mufakat terlebih dahulu.
            </p>
          </div>

          {/* Contact Box */}
          <div className="p-4 bg-cream border-2 border-black flex items-center justify-between flex-wrap gap-3">
            <div className="text-xs font-bold text-neutral-700">
              Pertanyaan mengenai ketentuan ini? Hubungi tim legal kami di{" "}
              <span className="font-mono text-black font-black">legal@pendek.in</span>
            </div>
            <Link
              href="/kontak"
              className="inline-flex items-center gap-1 text-xs font-heading font-black text-black underline underline-offset-4"
            >
              <span>Halaman Kontak</span>
              <ArrowRight className="h-3.5 w-3.5" strokeWidth={2.5} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
