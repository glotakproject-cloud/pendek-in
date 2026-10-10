import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, Quote } from "lucide-react";

const testimonials = [
  {
    name: "Rian Kurniawan",
    role: "Senior Growth Marketer",
    company: "Fashion Hub Jakarta",
    tag: "Kampanye Influencer",
    avatarBg: "bg-primary",
    avatarInitial: "RK",
    quote:
      "Fitur custom slug dan analitik klik real-time dari Pendek-In bikin tracking kampanye influencer kami jauh lebih terukur. CTR tautan naik hingga 40% setelah pakai custom branding.",
    rating: 5,
  },
  {
    name: "Siti Rahmawati",
    role: "Founder & Creative Director",
    company: "Buket Cantik Bandung",
    tag: "UMKM Retail",
    avatarBg: "bg-accent",
    avatarInitial: "SR",
    quote:
      "Kode QR dinamisnya sangat membantu toko offline kami! Kami cetak di kartu nama dan kemasan, dan kalau ada promo baru, link tujuannya tinggal diubah dari dashboard tanpa cetak ulang.",
    rating: 5,
  },
  {
    name: "Dimas Pratama",
    role: "Tech Lead",
    company: "Startup Edutech Yogyakarta",
    tag: "Developer Integrasi",
    avatarBg: "bg-info text-white",
    avatarInitial: "DP",
    quote:
      "REST API-nya sangat cepat dan mudah diintegrasikan ke bot Telegram internal kami. Dokumentasinya to-the-point dan latency redirect-nya konsisten di bawah 50 milidetik.",
    rating: 5,
  },
  {
    name: "Nadia Putri",
    role: "Content Creator & Affiliate",
    company: "Kreator Digital Surabaya",
    tag: "Kreator Konten",
    avatarBg: "bg-warning text-black",
    avatarInitial: "NP",
    quote:
      "Tautan bio Instagram dan TikTok saya jadi rapi banget. Audiens jauh lebih percaya untuk klik tautan pendek.in daripada link generator acak yang terlihat spam.",
    rating: 5,
  },
];

export function TestimonialsSection() {
  return (
    <section className="py-20 md:py-28 bg-cream border-b-2 border-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <Badge variant="default" className="text-xs sm:text-sm py-1 px-3">
            Ulasan Pengguna
          </Badge>
          <h2 className="text-3xl sm:text-5xl font-heading font-black tracking-tight text-black">
            Dipercaya Ribuan{" "}
            <span className="bg-primary px-2 py-0.5 border-2 border-black shadow-brutal inline-block">
              Pebisnis &amp; Kreator
            </span>{" "}
            di Indonesia
          </h2>
          <p className="text-base sm:text-lg font-medium text-neutral-700">
            Berikut cerita mereka yang telah mengoptimalkan tautan dan meningkatkan kepercayaan audiens bersama Pendek-In.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {testimonials.map((item, idx) => (
            <Card
              key={idx}
              variant="default"
              className="flex flex-col justify-between hover:-translate-y-1.5 transition-transform"
            >
              <CardContent className="p-6 space-y-4">
                <div className="flex items-center justify-between">
                  {/* Star Rating */}
                  <div className="flex items-center gap-1 text-warning">
                    {Array.from({ length: item.rating }).map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-[#FFD23F] text-black" strokeWidth={2} />
                    ))}
                  </div>
                  <Quote className="h-6 w-6 text-neutral-300" />
                </div>

                <p className="text-sm font-medium text-neutral-800 leading-relaxed italic">
                  &ldquo;{item.quote}&rdquo;
                </p>

                <div className="pt-2">
                  <Badge variant="outline" className="text-[11px] font-mono bg-cream">
                    {item.tag}
                  </Badge>
                </div>
              </CardContent>

              {/* User Bio Footer */}
              <div className="p-6 pt-0 border-t border-black/10 mt-auto flex items-center gap-3">
                <div
                  className={`w-10 h-10 border-2 border-black flex items-center justify-center font-heading font-black text-sm shadow-brutal-sm shrink-0 ${item.avatarBg}`}
                >
                  {item.avatarInitial}
                </div>
                <div className="min-w-0">
                  <h4 className="font-heading font-black text-sm text-black truncate">
                    {item.name}
                  </h4>
                  <p className="text-xs font-semibold text-neutral-600 truncate">
                    {item.role}
                  </p>
                  <p className="text-[11px] font-medium text-neutral-500 truncate">
                    {item.company}
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Trust Badges Bar */}
        <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-12 pt-6 text-center text-xs font-mono font-bold uppercase tracking-wider text-neutral-600">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 bg-primary border border-black inline-block" />
            <span>1.000.000+ Tautan Terpendekkan</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 bg-accent border border-black inline-block" />
            <span>99.9% Uptime Terjamin</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 bg-info border border-black inline-block" />
            <span>50.000+ Kode QR Tergenerate</span>
          </div>
        </div>
      </div>
    </section>
  );
}
