"use client";

import * as React from "react";
import { QRCodeCanvas } from "qrcode.react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Copy, Check, Download, ExternalLink } from "lucide-react";
import { toast } from "sonner";

interface QRDialogProps {
  isOpen: boolean;
  onClose: () => void;
  shortUrl: string;
  originalUrl?: string;
  title?: string;
}

export function QRDialog({
  isOpen,
  onClose,
  shortUrl,
  originalUrl,
  title = "Kode QR Tautan",
}: QRDialogProps) {
  const [copied, setCopied] = React.useState(false);
  const qrRef = React.useRef<HTMLDivElement>(null);

  const fullShortUrl = shortUrl.startsWith("http")
    ? shortUrl
    : `https://${shortUrl}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(fullShortUrl);
      setCopied(true);
      toast.success("Tautan berhasil disalin ke clipboard!");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Gagal menyalin tautan");
    }
  };

  const handleDownload = () => {
    try {
      const canvas = qrRef.current?.querySelector("canvas");
      if (!canvas) {
        toast.error("Gagal mengunduh QR Code");
        return;
      }
      const pngUrl = canvas.toDataURL("image/png");
      const downloadLink = document.createElement("a");
      const filename = `qrcode-${shortUrl.replace(/[^a-zA-Z0-9]/g, "-")}.png`;
      downloadLink.href = pngUrl;
      downloadLink.download = filename;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
      toast.success("QR Code berhasil diunduh (PNG)!");
    } catch {
      toast.error("Terjadi kesalahan saat mengunduh QR");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-sm sm:max-w-md bg-white border-[3px] border-black shadow-brutal-xl p-6">
        <DialogHeader className="border-b-2 border-black pb-3 text-left">
          <DialogTitle className="font-heading text-xl font-black text-black">
            {title}
          </DialogTitle>
          <DialogDescription className="text-xs font-semibold text-neutral-600">
            Pindai menggunakan kamera ponsel untuk langsung menuju tautan tujuan.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col items-center justify-center py-4 space-y-4">
          <div
            ref={qrRef}
            className="p-4 bg-white border-2 border-black shadow-brutal flex items-center justify-center"
          >
            <QRCodeCanvas
              value={fullShortUrl}
              size={200}
              bgColor={"#FFFFFF"}
              fgColor={"#0A0A0A"}
              level={"H"}
              includeMargin={false}
            />
          </div>

          <div className="w-full bg-cream border-2 border-black p-3 space-y-1">
            <p className="text-[11px] font-bold text-neutral-500 uppercase tracking-wider">
              Tautan Pendek
            </p>
            <p className="font-mono font-bold text-sm text-black truncate select-all">
              {fullShortUrl}
            </p>
            {originalUrl && (
              <p className="text-xs font-medium text-neutral-600 truncate pt-1 border-t border-black/20">
                Tujuan: {originalUrl}
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-2 w-full pt-1">
            <Button
              type="button"
              variant="default"
              size="sm"
              onClick={handleCopy}
              className="w-full flex items-center justify-center gap-1.5"
            >
              {copied ? (
                <>
                  <Check className="h-4 w-4" strokeWidth={2.5} />
                  <span>Tersalin!</span>
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4" strokeWidth={2.5} />
                  <span>Salin URL</span>
                </>
              )}
            </Button>

            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={handleDownload}
              className="w-full flex items-center justify-center gap-1.5"
            >
              <Download className="h-4 w-4" strokeWidth={2.5} />
              <span>Unduh PNG</span>
            </Button>
          </div>

          <div className="w-full text-center">
            <a
              href={originalUrl || fullShortUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 text-xs font-bold text-neutral-700 hover:text-black underline underline-offset-4 decoration-2"
            >
              <span>Uji Coba Buka Tautan</span>
              <ExternalLink className="h-3 w-3" strokeWidth={2.5} />
            </a>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
