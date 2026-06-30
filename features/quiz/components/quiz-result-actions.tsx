"use client";

import { useRef, useState } from "react";
import { toPng } from "html-to-image";
import { Download, Share2, Link2, Check, Loader2, RotateCcw, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { buildAppUrl } from "@/lib/app-url";
import { QuizResultPoster, type QuizPosterData } from "./quiz-result-poster";

interface QuizResultActionsProps {
  data: QuizPosterData;
  resultId: string;
  onRetry?: () => void;
}

export function QuizResultActions({
  data,
  resultId,
  onRetry,
}: QuizResultActionsProps) {
  const posterRef = useRef<HTMLDivElement>(null);
  const [downloading, setDownloading] = useState(false);
  const [copied, setCopied] = useState(false);

  const shareUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/quiz/result/${resultId}`
      : buildAppUrl(`/quiz/result/${resultId}`);

  const shareText = `Tôi là người Ô Diên ${data.score}% — "${data.title}"! Làm quiz tại Ô Diên One:`;

  async function handleDownload() {
    if (!posterRef.current) return;
    setDownloading(true);
    try {
      const dataUrl = await toPng(posterRef.current, {
        quality: 1,
        pixelRatio: 2,
        cacheBust: true,
      });
      const link = document.createElement("a");
      link.download = `odien-quiz-${data.score}.png`;
      link.href = dataUrl;
      link.click();
    } finally {
      setDownloading(false);
    }
  }

  async function handleShare() {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Ô Diên ${data.score}%`,
          text: shareText,
          url: shareUrl,
        });
        return;
      } catch {
        /* cancelled */
      }
    }
    await handleCopyLink();
  }

  function handleFacebookShare() {
    const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}&quote=${encodeURIComponent(shareText)}`;
    window.open(url, "_blank", "noopener,noreferrer,width=600,height=400");
  }

  async function handleCopyLink() {
    await navigator.clipboard.writeText(`${shareText} ${shareUrl}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-center">
        <QuizResultPoster ref={posterRef} data={data} />
      </div>

      <div className="flex flex-wrap gap-3 justify-center">
        <Button onClick={handleDownload} disabled={downloading}>
          {downloading ? (
            <Loader2 className="animate-spin" size={18} />
          ) : (
            <Download size={18} />
          )}
          Tải poster
        </Button>
        <Button variant="secondary" onClick={handleFacebookShare}>
          <ExternalLink size={18} />
          Chia sẻ Facebook
        </Button>
        <Button variant="outline" onClick={handleShare}>
          <Share2 size={18} />
          Chia sẻ
        </Button>
        <Button variant="ghost" onClick={handleCopyLink}>
          {copied ? <Check size={18} /> : <Link2 size={18} />}
          {copied ? "Đã sao chép!" : "Sao chép link"}
        </Button>
        {onRetry && (
          <Button variant="ghost" onClick={onRetry}>
            <RotateCcw size={18} />
            Làm lại
          </Button>
        )}
      </div>
    </div>
  );
}
