"use client";

import * as React from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Code2,
  Copy,
  Check,
  Terminal,
  KeyRound,
  Gauge,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";
import { toast } from "sonner";

interface EndpointDoc {
  method: "POST" | "GET" | "DELETE";
  path: string;
  title: string;
  description: string;
  curl: string;
  requestBody?: string;
  response: string;
}

const endpoints: EndpointDoc[] = [
  {
    method: "POST",
    path: "/api/v1/links",
    title: "Buat Tautan Baru",
    description: "Membuat tautan pendek baru untuk pengguna terotentikasi.",
    curl: `curl -X POST https://pendek.in/api/v1/links \\
  -H "Authorization: Bearer pk_live_98a76bc32d4e5f6081ab..." \\
  -H "Content-Type: application/json" \\
  -d '{
    "original_url": "https://tokobunga.id/katalog/buket-pernikahan-premium",
    "custom_slug": "buket-nikah-jkt",
    "title": "Buket Pernikahan Jakarta",
    "description": "Katalog promosi buket pernikahan premium",
    "tags": ["wedding", "promo"]
  }'`,
    requestBody: `{
  "original_url": "https://tokobunga.id/katalog/buket-pernikahan-premium", // Wajib
  "custom_slug": "buket-nikah-jkt",                                      // Opsional (3-30 karakter)
  "title": "Buket Pernikahan Jakarta",                                   // Opsional
  "description": "Katalog promosi buket pernikahan premium",             // Opsional
  "tags": ["wedding", "promo"],                                          // Opsional array string
  "expires_at": "2026-12-31T23:59:59Z"                                   // Opsional format ISO8601
}`,
    response: `// HTTP 201 Created
{
  "success": true,
  "data": {
    "id": "c1f7b0e1-4c16-46b2-a42e-9d22fa998a12",
    "slug": "buket-nikah-jkt",
    "short_url": "https://pendek.in/s/buket-nikah-jkt",
    "original_url": "https://tokobunga.id/katalog/buket-pernikahan-premium",
    "title": "Buket Pernikahan Jakarta",
    "status": "active",
    "created_at": "2026-10-08T10:30:00Z"
  }
}`,
  },
  {
    method: "GET",
    path: "/api/v1/links",
    title: "Ambil Daftar Tautan (List Links)",
    description: "Mengambil daftar seluruh tautan pendek yang dibuat oleh API Key akun Anda.",
    curl: `curl -X GET "https://pendek.in/api/v1/links?page=1&limit=20&status=active" \\
  -H "Authorization: Bearer pk_live_98a76bc32d4e5f6081ab..."`,
    response: `// HTTP 200 OK
{
  "success": true,
  "data": {
    "items": [
      {
        "id": "c1f7b0e1-4c16-46b2-a42e-9d22fa998a12",
        "slug": "buket-nikah-jkt",
        "short_url": "https://pendek.in/s/buket-nikah-jkt",
        "original_url": "https://tokobunga.id/katalog/buket-pernikahan-premium",
        "title": "Buket Pernikahan Jakarta",
        "status": "active",
        "click_count": 1247,
        "unique_click_count": 983,
        "created_at": "2026-10-08T10:30:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total_items": 42,
      "total_pages": 3
    }
  }
}`,
  },
  {
    method: "GET",
    path: "/api/v1/links/{id}",
    title: "Detail Tautan Tunggal",
    description: "Mengambil informasi lengkap satu tautan berdasarkan ID tautan.",
    curl: `curl -X GET https://pendek.in/api/v1/links/c1f7b0e1-4c16-46b2-a42e-9d22fa998a12 \\
  -H "Authorization: Bearer pk_live_98a76bc32d4e5f6081ab..."`,
    response: `// HTTP 200 OK
{
  "success": true,
  "data": {
    "id": "c1f7b0e1-4c16-46b2-a42e-9d22fa998a12",
    "slug": "buket-nikah-jkt",
    "short_url": "https://pendek.in/s/buket-nikah-jkt",
    "original_url": "https://tokobunga.id/katalog/buket-pernikahan-premium",
    "title": "Buket Pernikahan Jakarta",
    "description": "Tautan katalog promosi buket nikah",
    "tags": ["wedding", "promo"],
    "status": "active",
    "click_count": 1247,
    "unique_click_count": 983,
    "expires_at": "2026-12-31T23:59:59Z",
    "created_at": "2026-10-08T10:30:00Z"
  }
}`,
  },
  {
    method: "DELETE",
    path: "/api/v1/links/{id}",
    title: "Hapus Tautan",
    description: "Menghapus tautan secara permanen dari sistem.",
    curl: `curl -X DELETE https://pendek.in/api/v1/links/c1f7b0e1-4c16-46b2-a42e-9d22fa998a12 \\
  -H "Authorization: Bearer pk_live_98a76bc32d4e5f6081ab..."`,
    response: `// HTTP 200 OK
{
  "success": true,
  "data": {
    "message": "Tautan berhasil dihapus secara permanen."
  }
}`,
  },
  {
    method: "GET",
    path: "/api/v1/links/{id}/analytics",
    title: "Ringkasan Analitik Tautan",
    description: "Mengambil data analitik terperinci termasuk klik harian, referrer, dan tipe perangkat.",
    curl: `curl -X GET "https://pendek.in/api/v1/links/c1f7b0e1-4c16-46b2-a42e-9d22fa998a12/analytics?range=7d" \\
  -H "Authorization: Bearer pk_live_98a76bc32d4e5f6081ab..."`,
    response: `// HTTP 200 OK
{
  "success": true,
  "data": {
    "total_clicks": 1247,
    "unique_clicks": 983,
    "top_referrers": [
      { "name": "instagram.com", "count": 412 },
      { "name": "whatsapp.com", "count": 301 }
    ],
    "top_countries": [
      { "country": "Indonesia", "count": 1180 },
      { "country": "Singapura", "count": 42 }
    ],
    "devices": {
      "mobile": 1012,
      "desktop": 203,
      "tablet": 32
    }
  }
}`,
  },
];

const errorCodes = [
  { code: "400", err: "INVALID_URL", desc: "Format URL tidak valid atau tidak memiliki protokol http/https" },
  { code: "400", err: "BLOCKED_DOMAIN", desc: "Domain tujuan masuk dalam daftar hitam malware/phishing" },
  { code: "400", err: "RESERVED_SLUG", desc: "Slug yang diminta merupakan kata terlarang sistem (reserved word)" },
  { code: "400", err: "SLUG_ALREADY_EXISTS", desc: "Slug kustom telah digunakan oleh pengguna lain" },
  { code: "401", err: "UNAUTHORIZED", desc: "Header Bearer token tidak valid atau tidak disertakan" },
  { code: "403", err: "FORBIDDEN", desc: "Tidak memiliki hak akses untuk mengelola tautan ini" },
  { code: "404", err: "LINK_NOT_FOUND", desc: "Tautan dengan ID atau slug yang dimaksud tidak ditemukan" },
  { code: "429", err: "RATE_LIMIT_EXCEEDED", desc: "Telah melampaui batas kuota 120 permintaan per menit" },
  { code: "500", err: "INTERNAL_SERVER_ERROR", desc: "Terjadi kesalahan pada server saat memproses data" },
];

export default function ApiPublicDocsPage() {
  const [copiedText, setCopiedText] = React.useState<string | null>(null);

  const handleCopy = async (text: string, id: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedText(id);
      toast.success("Snippet cURL berhasil disalin!");
      setTimeout(() => setCopiedText(null), 2000);
    } catch {
      toast.error("Gagal menyalin teks");
    }
  };

  return (
    <div className="w-full py-12 md:py-20 space-y-16">
      {/* Header */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="default" className="text-xs">
            <Code2 className="h-3.5 w-3.5 mr-1" strokeWidth={2.5} /> Pendek-In API v1
          </Badge>
          <Badge variant="secondary" className="text-xs">
            RESTful JSON
          </Badge>
          <Badge variant="outline" className="text-xs bg-cream font-mono">
            Rate Limit: 120 req/menit
          </Badge>
        </div>

        <h1 className="text-4xl sm:text-6xl font-heading font-black tracking-tight text-black">
          Dokumentasi Public REST API
        </h1>
        <p className="text-base sm:text-lg font-medium text-neutral-700 leading-relaxed max-w-3xl">
          Integrasikan layanan pemendekan tautan Pendek-In ke dalam bot chat, CMS, webhook, formulir pendaftaran, atau aplikasi backend Anda dengan cepat dan andal.
        </p>

        {/* Quick Specs Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
          <div className="bg-cream border-2 border-black p-4 shadow-brutal-sm space-y-1">
            <span className="text-xs font-black uppercase text-neutral-600 flex items-center gap-1.5">
              <Terminal className="h-3.5 w-3.5 text-black" strokeWidth={2.5} />
              Base URL
            </span>
            <p className="font-mono font-bold text-sm text-black truncate select-all">
              https://pendek.in/api/v1
            </p>
          </div>

          <div className="bg-cream border-2 border-black p-4 shadow-brutal-sm space-y-1">
            <span className="text-xs font-black uppercase text-neutral-600 flex items-center gap-1.5">
              <KeyRound className="h-3.5 w-3.5 text-black" strokeWidth={2.5} />
              Autentikasi
            </span>
            <p className="font-mono font-bold text-sm text-black truncate">
              Bearer pk_live_...
            </p>
          </div>

          <div className="bg-cream border-2 border-black p-4 shadow-brutal-sm space-y-1">
            <span className="text-xs font-black uppercase text-neutral-600 flex items-center gap-1.5">
              <Gauge className="h-3.5 w-3.5 text-black" strokeWidth={2.5} />
              Format Data
            </span>
            <p className="font-mono font-bold text-sm text-black">
              JSON (UTF-8)
            </p>
          </div>
        </div>
      </section>

      {/* Cara Mendapatkan API Key Callout */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="bg-accent/30 border-[3px] border-black p-6 sm:p-8 shadow-brutal space-y-4">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-6 w-6 text-black" strokeWidth={2.5} />
            <h2 className="font-heading font-black text-xl text-black">
              Langkah Cepat Mendapatkan API Key
            </h2>
          </div>
          <ol className="list-decimal list-inside space-y-2 text-sm font-semibold text-neutral-800">
            <li>
              Buat akun atau masuk ke akun Anda melalui halaman{" "}
              <Link href="/daftar" className="underline font-bold text-black hover:bg-white px-1">
                Daftar Gratis
              </Link>.
            </li>
            <li>
              Buka menu dasbor{" "}
              <Link href="/dashboard/api-key" className="underline font-bold text-black hover:bg-white px-1">
                Kelola API Key
              </Link>.
            </li>
            <li>
              Klik tombol <strong>&ldquo;Generate API Key Baru&rdquo;</strong>. Token berformat <code className="bg-white border border-black px-1.5 py-0.5 font-mono text-xs font-bold">pk_live_...</code> akan langsung digenerate.
            </li>
            <li>
              Salin dan simpan token Anda di tempat yang aman (environment variable <code className="bg-white border border-black px-1.5 py-0.5 font-mono text-xs font-bold">.env</code>).
            </li>
          </ol>
        </div>
      </section>

      {/* List Endpoints */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 space-y-10">
        <div className="space-y-2">
          <h2 className="text-2xl sm:text-3xl font-heading font-black text-black">
            Daftar Endpoint API v1
          </h2>
          <p className="text-sm font-medium text-neutral-600">
            Seluruh endpoint menggunakan prefix <code className="font-mono font-bold text-black">https://pendek.in/api/v1</code>.
          </p>
        </div>

        <div className="space-y-8">
          {endpoints.map((ep, idx) => {
            const methodColors = {
              POST: "bg-primary text-black",
              GET: "bg-info text-white",
              DELETE: "bg-destructive text-white",
            }[ep.method];

            return (
              <Card key={idx} className="border-[3px] border-black shadow-brutal overflow-hidden">
                <CardHeader className="bg-cream flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b-2 border-black">
                  <div className="flex items-center gap-3">
                    <span
                      className={`px-3 py-1 font-mono font-black text-xs border-2 border-black shadow-brutal-sm ${methodColors}`}
                    >
                      {ep.method}
                    </span>
                    <span className="font-mono font-bold text-sm sm:text-base text-black">
                      {ep.path}
                    </span>
                  </div>
                  <span className="font-heading font-black text-sm text-neutral-700">
                    {ep.title}
                  </span>
                </CardHeader>

                <CardContent className="p-6 space-y-5">
                  <p className="text-sm font-medium text-neutral-700 leading-relaxed">
                    {ep.description}
                  </p>

                  {/* Request Body if POST */}
                  {ep.requestBody && (
                    <div className="space-y-2">
                      <span className="text-xs font-black uppercase text-neutral-600 block">
                        Payload Permintaan (JSON Body):
                      </span>
                      <pre className="bg-[#0A0A0A] text-accent p-4 font-mono text-xs border-2 border-black shadow-brutal-sm overflow-x-auto">
                        <code>{ep.requestBody}</code>
                      </pre>
                    </div>
                  )}

                  {/* cURL Example */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black uppercase text-neutral-600 flex items-center gap-1.5">
                        <Terminal className="h-3.5 w-3.5" strokeWidth={2.5} />
                        Contoh cURL:
                      </span>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => handleCopy(ep.curl, `curl-${idx}`)}
                        className="h-8 text-xs flex items-center gap-1"
                      >
                        {copiedText === `curl-${idx}` ? (
                          <>
                            <Check className="h-3 w-3" />
                            <span>Tersalin!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="h-3 w-3" />
                            <span>Salin cURL</span>
                          </>
                        )}
                      </Button>
                    </div>
                    <pre className="bg-[#0A0A0A] text-green-400 p-4 font-mono text-xs border-2 border-black shadow-brutal-sm overflow-x-auto">
                      <code>{ep.curl}</code>
                    </pre>
                  </div>

                  {/* Expected Response */}
                  <div className="space-y-2">
                    <span className="text-xs font-black uppercase text-neutral-600 block">
                      Contoh Respon Server:
                    </span>
                    <pre className="bg-[#121212] text-neutral-200 p-4 font-mono text-xs border-2 border-black shadow-brutal-sm overflow-x-auto">
                      <code>{ep.response}</code>
                    </pre>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>

      {/* Error Codes Table */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 space-y-6">
        <div className="space-y-2">
          <h2 className="text-2xl sm:text-3xl font-heading font-black text-black">
            Tabel Kode Kesalahan (Error Codes)
          </h2>
          <p className="text-sm font-medium text-neutral-600">
            Respon gagal selalu memiliki format standar <code className="font-mono text-xs font-bold text-black">&#123; &quot;success&quot;: false, &quot;error&quot;: &#123; &quot;code&quot;, &quot;message&quot; &#125; &#125;</code>.
          </p>
        </div>

        <div className="border-[3px] border-black shadow-brutal-lg overflow-x-auto bg-white">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="bg-cream border-b-2 border-black font-heading font-black text-black">
                <th className="p-4 border-r-2 border-black w-24 text-center">Status</th>
                <th className="p-4 border-r-2 border-black w-60">Error Code</th>
                <th className="p-4">Keterangan</th>
              </tr>
            </thead>
            <tbody className="divide-y-2 divide-black font-medium">
              {errorCodes.map((row, idx) => (
                <tr key={idx} className={idx % 2 === 0 ? "bg-white" : "bg-cream/50"}>
                  <td className="p-4 border-r-2 border-black text-center font-mono font-bold">
                    <span
                      className={`px-2 py-0.5 border border-black text-xs ${
                        row.code.startsWith("4") ? "bg-warning" : "bg-destructive text-white"
                      }`}
                    >
                      {row.code}
                    </span>
                  </td>
                  <td className="p-4 border-r-2 border-black font-mono text-xs font-bold text-black">
                    {row.err}
                  </td>
                  <td className="p-4 text-xs font-semibold text-neutral-700">
                    {row.desc}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 text-center">
        <div className="bg-cream border-[3px] border-black p-8 sm:p-12 shadow-brutal-xl space-y-6">
          <h2 className="text-2xl sm:text-3xl font-heading font-black text-black">
            Siap Mencoba REST API Sekarang?
          </h2>
          <p className="text-sm font-medium text-neutral-700 max-w-md mx-auto">
            Dapatkan token <code className="font-mono font-bold bg-white px-1 border border-black">pk_live_...</code> Anda secara gratis di dashboard member.
          </p>
          <Button variant="default" size="lg" asChild>
            <Link href="/daftar" className="flex items-center gap-2">
              <span>Buat Akun Developer Gratis</span>
              <ArrowRight className="h-4 w-4" strokeWidth={2.5} />
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
