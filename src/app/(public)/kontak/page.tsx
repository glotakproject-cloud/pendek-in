"use client";

import * as React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import {
  Mail,
  Send,
  AlertTriangle,
  Clock,
  MapPin,
} from "lucide-react";
import { toast } from "sonner";

export default function ContactPage() {
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [category, setCategory] = React.useState("general");
  const [subject, setSubject] = React.useState("");
  const [message, setMessage] = React.useState("");
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !subject || !message) {
      toast.error("Harap lengkapi seluruh kolom formulir");
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      toast.success("Pesan Anda berhasil dikirim! Tim kami akan membalas via email dalam 24 jam.");
      setName("");
      setEmail("");
      setSubject("");
      setMessage("");
    }, 700);
  };

  return (
    <div className="w-full py-12 md:py-20 space-y-16">
      {/* Header */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 text-center space-y-4">
        <Badge variant="default" className="text-xs sm:text-sm py-1 px-3">
          Hubungi Kami
        </Badge>
        <h1 className="text-4xl sm:text-6xl font-heading font-black tracking-tight text-black">
          Kami Siap{" "}
          <span className="bg-accent px-3 py-1 border-2 border-black shadow-brutal inline-block">
            Membantu Anda
          </span>
        </h1>
        <p className="text-base sm:text-lg font-medium text-neutral-700 max-w-2xl mx-auto leading-relaxed">
          Punya pertanyaan seputar integrasi API, kendala teknis, masukan fitur, atau ingin melaporkan tautan mencurigakan? Kirimkan pesan Anda melalui formulir di bawah ini.
        </p>
      </section>

      {/* Main Grid: Info + Form */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Direct Info Cards (5 Cols) */}
          <div className="lg:col-span-5 space-y-6">
            <Card className="border-[3px] border-black bg-cream shadow-brutal p-6 space-y-6">
              <div>
                <h3 className="font-heading font-black text-xl text-black">
                  Informasi Kontak
                </h3>
                <p className="text-xs font-semibold text-neutral-600 mt-1">
                  Saluran komunikasi resmi tim pengembang Pendek-In.
                </p>
              </div>

              <div className="space-y-4 border-t-2 border-black/10 pt-4">
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 bg-primary border-2 border-black flex items-center justify-center shadow-brutal-sm shrink-0">
                    <Mail className="h-4 w-4 text-black" strokeWidth={2.5} />
                  </div>
                  <div>
                    <span className="text-xs font-mono font-bold text-neutral-500 uppercase">
                      Email Dukungan Umum
                    </span>
                    <p className="font-mono font-bold text-sm text-black">
                      support@pendek.in
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 bg-destructive border-2 border-black flex items-center justify-center shadow-brutal-sm shrink-0 text-white">
                    <AlertTriangle className="h-4 w-4" strokeWidth={2.5} />
                  </div>
                  <div>
                    <span className="text-xs font-mono font-bold text-neutral-500 uppercase">
                      Laporan Tautan Bahaya (Abuse)
                    </span>
                    <p className="font-mono font-bold text-sm text-black">
                      abuse@pendek.in
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 bg-accent border-2 border-black flex items-center justify-center shadow-brutal-sm shrink-0">
                    <Clock className="h-4 w-4 text-black" strokeWidth={2.5} />
                  </div>
                  <div>
                    <span className="text-xs font-mono font-bold text-neutral-500 uppercase">
                      Waktu Operasional
                    </span>
                    <p className="text-xs font-bold text-black">
                      Senin - Jumat, 09:00 - 18:00 WIB
                    </p>
                    <p className="text-[11px] font-medium text-neutral-600">
                      Rata-rata respon &lt; 24 jam kerja
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 bg-white border-2 border-black flex items-center justify-center shadow-brutal-sm shrink-0">
                    <MapPin className="h-4 w-4 text-black" strokeWidth={2.5} />
                  </div>
                  <div>
                    <span className="text-xs font-mono font-bold text-neutral-500 uppercase">
                      Lokasi Kantor
                    </span>
                    <p className="text-xs font-bold text-black">
                      Jakarta &amp; Bandung, Indonesia
                    </p>
                  </div>
                </div>
              </div>
            </Card>

            {/* Quick Abuse Callout */}
            <div className="bg-destructive/15 border-2 border-destructive p-5 shadow-brutal-sm space-y-2">
              <div className="flex items-center gap-2 text-destructive font-heading font-black text-sm uppercase">
                <AlertTriangle className="h-4 w-4" strokeWidth={2.5} />
                <span>Menemukan Tautan Phishing?</span>
              </div>
              <p className="text-xs font-semibold text-neutral-800 leading-relaxed">
                Jika Anda menemukan tautan pendek yang mengarah ke penipuan, malware, atau phishing, silakan sertakan slug tautan pada pesan Anda atau email langsung ke <span className="font-mono font-bold">abuse@pendek.in</span>. Sistem kami akan segera meninjau dan memblokirnya.
              </p>
            </div>
          </div>

          {/* Right Column: Contact Form (7 Cols) */}
          <div className="lg:col-span-7">
            <Card className="border-[3px] border-black shadow-brutal-xl bg-white p-6 sm:p-8">
              <CardContent className="p-0 space-y-5">
                <div className="border-b-2 border-black pb-4">
                  <h3 className="font-heading font-black text-2xl text-black">
                    Kirimkan Pesan
                  </h3>
                  <p className="text-xs font-semibold text-neutral-600 mt-1">
                    Isi formulir di bawah ini dan kami akan membalas ke email Anda secepatnya.
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-black uppercase tracking-wider text-black">
                        Nama Lengkap
                      </label>
                      <Input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Dimas Pratama"
                        required
                        className="border-2 border-black bg-white"
                        disabled={isSubmitting}
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-black uppercase tracking-wider text-black">
                        Alamat Email
                      </label>
                      <Input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="dimas@gmail.com"
                        required
                        className="font-mono text-sm border-2 border-black bg-white"
                        disabled={isSubmitting}
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-black uppercase tracking-wider text-black">
                      Kategori Pesan
                    </label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="flex h-12 w-full border-2 border-black bg-white px-4 py-2 text-sm font-semibold text-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                      disabled={isSubmitting}
                    >
                      <option value="general">Pertanyaan Umum</option>
                      <option value="api">Dukungan Teknis &amp; REST API</option>
                      <option value="abuse">Laporan Tautan Phishing / Malware</option>
                      <option value="feature">Saran Fitur Baru</option>
                      <option value="partnership">Kemitraan &amp; Kerjasama</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-black uppercase tracking-wider text-black">
                      Subjek Pesan
                    </label>
                    <Input
                      type="text"
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      placeholder="Contoh: Pertanyaan batas rate limit API untuk bot Telegram"
                      required
                      className="border-2 border-black bg-white"
                      disabled={isSubmitting}
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-black uppercase tracking-wider text-black">
                      Isi Pesan
                    </label>
                    <textarea
                      rows={5}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Tuliskan pertanyaan atau informasi Anda secara terperinci..."
                      required
                      className="w-full border-2 border-black bg-white p-4 text-sm font-semibold text-black placeholder:text-neutral-500 placeholder:font-normal focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                      disabled={isSubmitting}
                    />
                  </div>

                  <Button
                    type="submit"
                    variant="default"
                    size="lg"
                    disabled={isSubmitting}
                    className="w-full h-13 text-base shadow-brutal flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <span className="flex items-center gap-2">
                        <span className="w-5 h-5 border-2 border-black border-t-transparent animate-spin rounded-full inline-block" />
                        <span>Mengirim Pesan...</span>
                      </span>
                    ) : (
                      <>
                        <span>Kirim Pesan Sekarang</span>
                        <Send className="h-4 w-4" strokeWidth={2.5} />
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}
