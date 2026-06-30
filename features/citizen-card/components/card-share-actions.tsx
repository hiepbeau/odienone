"use client";

import { useMemo, useRef, useState } from "react";
import { toPng } from "html-to-image";
import { Download, Share2, Printer, Link2, Check, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { buildCitizenProfileUrl } from "@/lib/app-url";
import { CitizenCardDisplay } from "./citizen-card-display";
import type { CitizenCardDisplayData } from "./citizen-card-display";

interface CardShareActionsProps {
  data: CitizenCardDisplayData;
  profileSlug: string;
  profileUrl?: string;
}

export function CardShareActions({
  data,
  profileSlug,
  profileUrl,
}: CardShareActionsProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [downloading, setDownloading] = useState(false);
  const [copied, setCopied] = useState(false);

  const shareUrl = useMemo(
    () => buildCitizenProfileUrl(profileSlug, profileUrl),
    [profileSlug, profileUrl]
  );

  async function handleDownload() {
    if (!cardRef.current) return;
    setDownloading(true);
    try {
      const dataUrl = await toPng(cardRef.current, {
        quality: 1,
        pixelRatio: 2,
        cacheBust: true,
      });
      const link = document.createElement("a");
      link.download = `the-cong-dan-${data.citizenId ?? "odien"}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error("Download failed:", err);
    } finally {
      setDownloading(false);
    }
  }

  async function handleShare() {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Thẻ Công Dân — ${data.fullName}`,
          text: `Tôi là công dân Ô Diên! Xem thẻ của tôi tại:`,
          url: shareUrl,
        });
        return;
      } catch {
        // User cancelled or share failed — fall through to copy
      }
    }
    await handleCopyLink();
  }

  async function handleCopyLink() {
    await navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function handlePrint() {
    const printWindow = window.open("", "_blank");
    if (!printWindow || !cardRef.current) return;

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Thẻ Công Dân — ${data.fullName}</title>
          <style>
            body { margin: 0; display: flex; justify-content: center; align-items: center; min-height: 100vh; }
            @media print { body { margin: 0; } }
          </style>
        </head>
        <body>${cardRef.current.outerHTML}</body>
      </html>
    `);
    printWindow.document.close();
    printWindow.onload = () => {
      printWindow.print();
    };
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-center">
        <CitizenCardDisplay ref={cardRef} data={data} />
      </div>

      <div className="flex flex-wrap gap-3 justify-center">
        <Button onClick={handleDownload} disabled={downloading}>
          {downloading ? (
            <Loader2 className="animate-spin" size={18} />
          ) : (
            <Download size={18} />
          )}
          Tải PNG
        </Button>
        <Button variant="secondary" onClick={handleShare}>
          <Share2 size={18} />
          Chia sẻ
        </Button>
        <Button variant="outline" onClick={handlePrint}>
          <Printer size={18} />
          In thẻ
        </Button>
        <Button variant="ghost" onClick={handleCopyLink}>
          {copied ? <Check size={18} /> : <Link2 size={18} />}
          {copied ? "Đã sao chép!" : "Sao chép link"}
        </Button>
      </div>
    </div>
  );
}
