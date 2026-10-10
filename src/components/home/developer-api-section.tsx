"use client";

import * as React from "react";
import Link from "next/link";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Code2,
  Copy,
  Check,
  Terminal,
  ArrowRight,
  KeyRound,
  Gauge,
  CheckCircle,
} from "lucide-react";
import { toast } from "sonner";

const codeSnippets = {
  curl: `curl -X POST https://pendek.in/api/v1/links \\
  -H "Authorization: Bearer pk_live_98a76bc32d4e5f6081..." \\
  -H "Content-Type: application/json" \\
  -d '{
    "original_url": "https://tokoonline.id/katalog/diskon-ramadhan",
    "custom_slug": "diskon-ramadhan",
    "title": "Promo Diskon Ramadhan 2026"
  }'`,

  javascript: `// Menggunakan fetch di Node.js atau Browser
const response = await fetch("https://pendek.in/api/v1/links", {
  method: "POST",
  headers: {
    "Authorization": "Bearer pk_live_98a76bc32d4e5f6081...",
    "Content-Type": "application/json"
  },
  body: JSON.stringify({
    original_url: "https://tokoonline.id/katalog/diskon-ramadhan",
    custom_slug: "diskon-ramadhan",
    title: "Promo Diskon Ramadhan 2026"
  })
});

const data = await response.json();
console.log(data.data.short_url); // https://pendek.in/diskon-ramadhan`,

  python: `import requests

url = "https://pendek.in/api/v1/links"
headers = {
    "Authorization": "Bearer pk_live_98a76bc32d4e5f6081...",
    "Content-Type": "application/json"
}
payload = {
    "original_url": "https://tokoonline.id/katalog/diskon-ramadhan",
    "custom_slug": "diskon-ramadhan",
    "title": "Promo Diskon Ramadhan 2026"
}

response = requests.post(url, json=payload, headers=headers)
print(response.json()["data"]["short_url"])`,

  php: `<?php
$ch = curl_init("https://pendek.in/api/v1/links");
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    "Authorization: Bearer pk_live_98a76bc32d4e5f6081...",
    "Content-Type: application/json"
]);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode([
    "original_url" => "https://tokoonline.id/katalog/diskon-ramadhan",
    "custom_slug" => "diskon-ramadhan",
    "title" => "Promo Diskon Ramadhan 2026"
]));
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

$result = json_decode(curl_exec($ch), true);
curl_close($ch);

echo $result['data']['short_url'];`,
};

const sampleResponse = `{
  "success": true,
  "data": {
    "id": "lnk_92f8a1c4",
    "slug": "diskon-ramadhan",
    "short_url": "https://pendek.in/diskon-ramadhan",
    "original_url": "https://tokoonline.id/katalog/diskon-ramadhan",
    "title": "Promo Diskon Ramadhan 2026",
    "clicks": 0,
    "created_at": "2026-10-10T12:00:00Z"
  }
}`;

export function DeveloperApiSection() {
  const [activeTab, setActiveTab] = React.useState<keyof typeof codeSnippets>("curl");
  const [copiedSnippet, setCopiedSnippet] = React.useState(false);
  const [copiedResponse, setCopiedResponse] = React.useState(false);

  const handleCopyCode = async (code: string, isResponse = false) => {
    try {
      await navigator.clipboard.writeText(code);
      if (isResponse) {
        setCopiedResponse(true);
        setTimeout(() => setCopiedResponse(false), 2000);
      } else {
        setCopiedSnippet(true);
        setTimeout(() => setCopiedSnippet(false), 2000);
      }
      toast.success("Kode berhasil disalin!");
    } catch {
      toast.error("Gagal menyalin kode");
    }
  };

  return (
    <section id="api-developer" className="py-20 md:py-28 bg-white border-b-2 border-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b-2 border-black pb-8">
          <div className="space-y-3 max-w-2xl">
            <div className="flex items-center gap-2">
              <Badge variant="default" className="text-xs">
                <Code2 className="h-3.5 w-3.5 mr-1" strokeWidth={2.5} /> Public REST API v1
              </Badge>
              <Badge variant="secondary" className="text-xs">
                Open Access
              </Badge>
            </div>
            <h2 className="text-3xl sm:text-5xl font-heading font-black tracking-tight text-black">
              Dibangun untuk Developer,{" "}
              <span className="bg-primary px-2 py-0.5 border-2 border-black shadow-brutal inline-block">
                Siap Integrasi
              </span>
            </h2>
            <p className="text-base font-medium text-neutral-700 leading-relaxed">
              Otomatiskan pemendekan tautan langsung dari bot Telegram, webhook, form pendaftaran, atau aplikasi backend Anda dengan REST API sederhana &amp; andal.
            </p>
          </div>

          <div className="shrink-0">
            <Button variant="default" size="lg" asChild>
              <Link href="/api-publik" className="flex items-center gap-2">
                <span>Dokumentasi Lengkap API</span>
                <ArrowRight className="h-4 w-4" strokeWidth={2.5} />
              </Link>
            </Button>
          </div>
        </div>

        {/* Code Showcase & Specs Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Interactive Code Tabs (7 Cols) */}
          <div className="lg:col-span-7 space-y-4">
            <Tabs
              defaultValue="curl"
              value={activeTab}
              onValueChange={(val) => setActiveTab(val as keyof typeof codeSnippets)}
              className="w-full"
            >
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <TabsList className="bg-cream border-2 border-black shadow-brutal-sm">
                  <TabsTrigger value="curl" className="text-xs">
                    cURL
                  </TabsTrigger>
                  <TabsTrigger value="javascript" className="text-xs">
                    JavaScript
                  </TabsTrigger>
                  <TabsTrigger value="python" className="text-xs">
                    Python
                  </TabsTrigger>
                  <TabsTrigger value="php" className="text-xs">
                    PHP
                  </TabsTrigger>
                </TabsList>

                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => handleCopyCode(codeSnippets[activeTab])}
                  className="h-10 text-xs flex items-center gap-1.5"
                >
                  {copiedSnippet ? (
                    <>
                      <Check className="h-3.5 w-3.5" strokeWidth={2.5} />
                      <span>Tersalin!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-3.5 w-3.5" strokeWidth={2.5} />
                      <span>Salin Snippet</span>
                    </>
                  )}
                </Button>
              </div>

              {Object.entries(codeSnippets).map(([lang, code]) => (
                <TabsContent key={lang} value={lang} className="mt-3">
                  <div className="bg-[#0A0A0A] border-[3px] border-black shadow-brutal-lg overflow-hidden">
                    <div className="flex items-center justify-between px-4 py-2.5 bg-black border-b-2 border-neutral-800 text-neutral-400 text-xs font-mono">
                      <div className="flex items-center gap-2">
                        <Terminal className="h-3.5 w-3.5 text-primary" strokeWidth={2.5} />
                        <span className="text-white font-bold uppercase">{lang}</span>
                        <span>• POST /api/v1/links</span>
                      </div>
                      <span className="text-[11px] text-neutral-500">Bearer Token Auth</span>
                    </div>
                    <pre className="p-4 sm:p-5 font-mono text-xs sm:text-sm text-green-400 overflow-x-auto leading-relaxed select-all">
                      <code>{code}</code>
                    </pre>
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          </div>

          {/* Right Column: JSON Response Preview & Specs (5 Cols) */}
          <div className="lg:col-span-5 space-y-6">
            {/* JSON Response Card */}
            <Card className="border-[3px] border-black bg-cream shadow-brutal">
              <div className="p-3 bg-white border-b-2 border-black flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 bg-primary border border-black inline-block" />
                  <span className="font-heading font-black text-xs uppercase tracking-wider text-black">
                    Contoh Respon JSON (201 Created)
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => handleCopyCode(sampleResponse, true)}
                  className="text-xs font-bold text-neutral-600 hover:text-black flex items-center gap-1"
                >
                  {copiedResponse ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                  <span>{copiedResponse ? "Tersalin" : "Salin"}</span>
                </button>
              </div>
              <CardContent className="p-4 font-mono text-xs text-black bg-[#F5F5F0] overflow-x-auto">
                <pre className="select-all">
                  <code>{sampleResponse}</code>
                </pre>
              </CardContent>
            </Card>

            {/* Quick Specs Badges */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-3.5 bg-white border-2 border-black shadow-brutal-sm space-y-1">
                <div className="flex items-center gap-1.5 text-black font-heading font-black text-xs uppercase">
                  <Gauge className="h-4 w-4 text-primary-dark" strokeWidth={2.5} />
                  <span>Rate Limit Cepat</span>
                </div>
                <p className="font-mono text-base font-bold text-black">
                  120 req / menit
                </p>
                <p className="text-[11px] font-medium text-neutral-600">
                  Cukup untuk skala tinggi &amp; bot otomatis.
                </p>
              </div>

              <div className="p-3.5 bg-white border-2 border-black shadow-brutal-sm space-y-1">
                <div className="flex items-center gap-1.5 text-black font-heading font-black text-xs uppercase">
                  <KeyRound className="h-4 w-4 text-accent" strokeWidth={2.5} />
                  <span>Autentikasi Aman</span>
                </div>
                <p className="font-mono text-base font-bold text-black">
                  pk_live_...
                </p>
                <p className="text-[11px] font-medium text-neutral-600">
                  Enkripsi hash SHA-256 di database.
                </p>
              </div>
            </div>

            {/* Getting Started Callout */}
            <div className="p-4 bg-primary/20 border-2 border-black shadow-brutal-sm space-y-2">
              <h4 className="font-heading font-black text-sm text-black flex items-center gap-1.5">
                <CheckCircle className="h-4 w-4 text-black" strokeWidth={2.5} />
                <span>Cara Mendapatkan API Key</span>
              </h4>
              <p className="text-xs font-semibold text-neutral-800 leading-relaxed">
                Cukup buat akun Member gratis, buka menu <span className="font-mono font-bold bg-white px-1 border border-black">API Key</span> di dashboard, lalu klik &quot;Generate Key Baru&quot;. Token siap digunakan tanpa masa tunggu!
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
