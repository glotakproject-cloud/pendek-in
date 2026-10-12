"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { toast } from "sonner";
import { QRCodeSVG } from "qrcode.react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  Download,
  Copy,
  Palette,
  RotateCcw,
  Sliders,
} from "lucide-react";
import { DUMMY_LINKS } from "@/lib/dummy-data";

const FG_COLOR_PRESETS = [
  { name: "Hitam Solid", color: "#0A0A0A" },
  { name: "Primary Green", color: "#00D26A" },
  { name: "Dark Green", color: "#00A653" },
  { name: "Info Blue", color: "#3B82F6" },
  { name: "Danger Red", color: "#FF5C5C" },
  { name: "Royal Purple", color: "#8B5CF6" },
  { name: "Navy Blue", color: "#1E3A8A" },
];

const BG_COLOR_PRESETS = [
  { name: "Putih Bersih", color: "#FFFFFF" },
  { name: "Cream Neobrutal", color: "#F5F5F0" },
  { name: "Accent Lime", color: "#B4FF39" },
  { name: "Warning Yellow", color: "#FFD23F" },
];

export default function EditorQRPage() {
  const params = useParams();
  const rawId = (params?.id as string) || "1";

  const link =
    DUMMY_LINKS.find((l) => l.id === rawId || l.slug === rawId) || DUMMY_LINKS[0];

  // QR Customization States
  const [fgColor, setFgColor] = useState(link.qrColor || "#0A0A0A");
  const [bgColor, setBgColor] = useState(link.qrBg || "#FFFFFF");
  const [size, setSize] = useState<number>(240);
  const [includeMargin, setIncludeMargin] = useState(true);
  const [level, setLevel] = useState<"L" | "M" | "Q" | "H">("Q");

  const qrContainerRef = useRef<HTMLDivElement>(null);

  // Download SVG
  const handleDownloadSVG = () => {
    if (!qrContainerRef.current) return;
    const svgElement = qrContainerRef.current.querySelector("svg");
    if (!svgElement) return;

    const svgData = new XMLSerializer().serializeToString(svgElement);
    const svgBlob = new Blob([svgData], { type: "image/svg+xml;charset=utf-8" });
    const svgUrl = URL.createObjectURL(svgBlob);

    const downloadLink = document.createElement("a");
    downloadLink.href = svgUrl;
    downloadLink.download = `qr-${link.slug}.svg`;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
    URL.revokeObjectURL(svgUrl);

    toast.success("QR Berhasil Diunduh (SVG)! 🎨", {
      description: "Format SVG vektor siap digunakan untuk materi cetak resolusi tinggi.",
    });
  };

  // Download PNG via canvas conversion
  const handleDownloadPNG = () => {
    if (!qrContainerRef.current) return;
    const svgElement = qrContainerRef.current.querySelector("svg");
    if (!svgElement) return;

    const svgData = new XMLSerializer().serializeToString(svgElement);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();

    // Scale up for high-resolution PNG
    canvas.width = 1000;
    canvas.height = 1000;

    img.onload = () => {
      if (ctx) {
        ctx.fillStyle = bgColor;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        const pngUrl = canvas.toDataURL("image/png");

        const downloadLink = document.createElement("a");
        downloadLink.href = pngUrl;
        downloadLink.download = `qr-${link.slug}.png`;
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);

        toast.success("QR Berhasil Diunduh (PNG)! 🖼️", {
          description: "Gambar PNG resolusi 1000x1000 siap dibagikan.",
        });
      }
    };

    img.src = "data:image/svg+xml;base64," + btoa(unescape(encodeURIComponent(svgData)));
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(link.shortUrl);
    toast.success("Short Link Disalin!", {
      description: link.shortUrl,
    });
  };

  const handleReset = () => {
    setFgColor("#0A0A0A");
    setBgColor("#FFFFFF");
    setSize(240);
    setIncludeMargin(true);
    setLevel("Q");
    toast.info("Gaya QR Direset ke Bawaan.");
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="border-2 border-black bg-white p-6 shadow-brutal flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <Button variant="ghost" size="sm" asChild className="p-0 h-auto hover:bg-transparent mb-1">
            <Link
              href={`/dashboard/tautan/${link.id}`}
              className="text-neutral-600 hover:text-black flex items-center gap-1 font-bold text-sm"
            >
              <ArrowLeft className="h-4 w-4" strokeWidth={2.5} />
              Kembali ke Detail Tautan
            </Link>
          </Button>
          <div className="flex items-center gap-2 mt-1">
            <h1 className="text-2xl sm:text-3xl font-black font-heading text-black">
              Editor Kode QR Dinamis
            </h1>
            <Badge variant="secondary">Kustomisasi</Badge>
          </div>
          <p className="text-sm font-semibold text-neutral-600">
            Sesuaikan palet warna, rasio kontras, dan unduh dalam format PNG atau SVG vektor.
          </p>
        </div>

        <Button variant="outline" size="sm" onClick={handleReset} className="gap-1.5 shrink-0">
          <RotateCcw className="h-4 w-4" strokeWidth={2.5} />
          <span>Reset Warna</span>
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Editor Controls (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Warna Foreground / Titik QR */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Palette className="h-5 w-5 text-primary-dark" strokeWidth={2.5} />
                <CardTitle>Warna Titik QR (Foreground)</CardTitle>
              </div>
              <CardDescription>
                Pilih warna utama untuk pola kotak-kotak QR code.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {FG_COLOR_PRESETS.map((preset) => {
                  const isSelected = fgColor.toLowerCase() === preset.color.toLowerCase();
                  return (
                    <button
                      key={preset.color}
                      type="button"
                      onClick={() => setFgColor(preset.color)}
                      className={`p-2.5 border-2 border-black flex items-center gap-2 text-xs font-bold transition-all ${
                        isSelected
                          ? "bg-primary text-black shadow-brutal-sm"
                          : "bg-white hover:bg-cream"
                      }`}
                    >
                      <span
                        className="w-4 h-4 rounded-none border border-black inline-block shrink-0"
                        style={{ backgroundColor: preset.color }}
                      />
                      <span className="truncate">{preset.name}</span>
                    </button>
                  );
                })}
              </div>

              {/* Custom Hex Input */}
              <div className="flex items-center gap-3 pt-2">
                <span className="text-xs font-black uppercase tracking-wider text-black">
                  Kustom Hex:
                </span>
                <div className="flex items-center gap-2 border-2 border-black bg-white px-2 py-1 shadow-brutal-sm">
                  <input
                    type="color"
                    value={fgColor}
                    onChange={(e) => setFgColor(e.target.value)}
                    className="w-7 h-7 cursor-pointer border-0 bg-transparent p-0"
                  />
                  <input
                    type="text"
                    value={fgColor}
                    onChange={(e) => setFgColor(e.target.value)}
                    className="w-24 font-mono text-xs font-black uppercase text-black focus:outline-none"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Warna Background */}
          <Card>
            <CardHeader>
              <CardTitle>Warna Latar Belakang (Background)</CardTitle>
              <CardDescription>
                Pastikan warna latar memiliki kontras yang cukup dengan foreground agar mudah discan.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {BG_COLOR_PRESETS.map((preset) => {
                  const isSelected = bgColor.toLowerCase() === preset.color.toLowerCase();
                  return (
                    <button
                      key={preset.color}
                      type="button"
                      onClick={() => setBgColor(preset.color)}
                      className={`p-2.5 border-2 border-black flex items-center gap-2 text-xs font-bold transition-all ${
                        isSelected
                          ? "bg-primary text-black shadow-brutal-sm"
                          : "bg-white hover:bg-cream"
                      }`}
                    >
                      <span
                        className="w-4 h-4 rounded-none border border-black inline-block shrink-0"
                        style={{ backgroundColor: preset.color }}
                      />
                      <span className="truncate">{preset.name}</span>
                    </button>
                  );
                })}
              </div>

              {/* Custom Hex Input */}
              <div className="flex items-center gap-3 pt-2">
                <span className="text-xs font-black uppercase tracking-wider text-black">
                  Kustom Hex:
                </span>
                <div className="flex items-center gap-2 border-2 border-black bg-white px-2 py-1 shadow-brutal-sm">
                  <input
                    type="color"
                    value={bgColor}
                    onChange={(e) => setBgColor(e.target.value)}
                    className="w-7 h-7 cursor-pointer border-0 bg-transparent p-0"
                  />
                  <input
                    type="text"
                    value={bgColor}
                    onChange={(e) => setBgColor(e.target.value)}
                    className="w-24 font-mono text-xs font-black uppercase text-black focus:outline-none"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Ukuran & Margin */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Sliders className="h-5 w-5 text-black" strokeWidth={2.5} />
                <CardTitle>Pengaturan Ukuran &amp; Resolusi</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-5">
              {/* Presets Ukuran */}
              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-wider text-black">
                  Ukuran Tampilan Pratinjau
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[180, 240, 300].map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setSize(s)}
                      className={`py-2 px-3 border-2 border-black text-xs font-mono font-black transition-all ${
                        size === s
                          ? "bg-primary text-black shadow-brutal-sm"
                          : "bg-white hover:bg-cream"
                      }`}
                    >
                      {s} x {s} px
                    </button>
                  ))}
                </div>
              </div>

              {/* Error Correction Level */}
              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-wider text-black">
                  Tingkat Koreksi Error (Error Correction)
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {[
                    { label: "L (7%)", val: "L" as const },
                    { label: "M (15%)", val: "M" as const },
                    { label: "Q (25%)", val: "Q" as const },
                    { label: "H (30%)", val: "H" as const },
                  ].map((item) => (
                    <button
                      key={item.val}
                      type="button"
                      onClick={() => setLevel(item.val)}
                      className={`py-2 border-2 border-black text-xs font-mono font-bold transition-all ${
                        level === item.val
                          ? "bg-accent text-black shadow-brutal-sm font-black"
                          : "bg-white hover:bg-cream"
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Include Margin Toggle */}
              <div className="flex items-center justify-between p-3 border-2 border-black bg-cream shadow-brutal-sm">
                <div>
                  <div className="text-xs font-black text-black">Sertakan Batas Putih (Margin / Quiet Zone)</div>
                  <div className="text-[11px] font-semibold text-neutral-600">
                    Batas penting agar kamera HP dapat membedakan kode QR dari background sekitar
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={includeMargin}
                  onChange={(e) => setIncludeMargin(e.target.checked)}
                  className="w-5 h-5 border-2 border-black accent-primary cursor-pointer"
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Live Preview & Download Buttons (5 cols) */}
        <div className="lg:col-span-5 sticky top-24 space-y-6">
          <Card className="border-[3px] border-black bg-white shadow-brutal-xl">
            <CardHeader className="bg-primary border-b-2 border-black p-4 text-center">
              <span className="text-[11px] font-mono font-black uppercase tracking-wider bg-white px-2 py-0.5 border border-black shadow-brutal-sm inline-block">
                Pratinjau Nyata (Live QR)
              </span>
              <h3 className="font-heading font-black text-lg text-black mt-1">
                {link.title}
              </h3>
            </CardHeader>

            <CardContent className="p-6 flex flex-col items-center space-y-5">
              {/* QR Container */}
              <div
                ref={qrContainerRef}
                className="p-4 border-[3px] border-black shadow-brutal flex items-center justify-center transition-all"
                style={{ backgroundColor: bgColor }}
              >
                <QRCodeSVG
                  value={link.shortUrl}
                  size={size}
                  fgColor={fgColor}
                  bgColor={bgColor}
                  includeMargin={includeMargin}
                  level={level}
                />
              </div>

              {/* Link Info Box */}
              <div className="w-full p-3 border-2 border-black bg-cream space-y-1 text-center font-mono">
                <span className="text-[10px] uppercase font-black text-neutral-500">
                  Target Tautan Terhubung:
                </span>
                <div className="text-xs font-black text-primary-dark break-all">
                  {link.shortUrl}
                </div>
              </div>

              {/* Download Action Buttons */}
              <div className="w-full space-y-2.5">
                <Button
                  onClick={handleDownloadPNG}
                  variant="default"
                  size="lg"
                  className="w-full gap-2 text-sm"
                >
                  <Download className="h-4 w-4" strokeWidth={2.5} />
                  <span>Unduh Gambar PNG (HD)</span>
                </Button>

                <Button
                  onClick={handleDownloadSVG}
                  variant="secondary"
                  size="lg"
                  className="w-full gap-2 text-sm"
                >
                  <Download className="h-4 w-4" strokeWidth={2.5} />
                  <span>Unduh Format Vektor SVG</span>
                </Button>

                <Button
                  onClick={handleCopyLink}
                  variant="outline"
                  size="default"
                  className="w-full gap-2 text-xs"
                >
                  <Copy className="h-4 w-4" strokeWidth={2.5} />
                  <span>Salin URL Tautan Pendek</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
