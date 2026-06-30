"use client";

import { useEffect, useRef, useState } from "react";
import { toJpeg, toPng } from "html-to-image";
import QRCode from "qrcode";
import { Check, Copy, Download, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { buildCitizenProfileUrl } from "@/lib/app-url";
import type { WrappedPayload } from "../types";

interface PosterGeneratorProps {
  payload: WrappedPayload;
}

type PosterSize = "story" | "feed";

export function PosterGenerator({ payload }: PosterGeneratorProps) {
  const posterRef = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState<PosterSize>("story");
  const [copied, setCopied] = useState(false);
  const [qrDataUrl, setQrDataUrl] = useState<string>("");

  const profileSlug = payload.progress.citizenCard?.profileSlug ?? "";
  const profileUrl = buildCitizenProfileUrl(
    profileSlug,
    payload.progress.citizenCard?.profileUrl
  );

  useEffect(() => {
    if (!profileUrl) return;
    QRCode.toDataURL(profileUrl, { width: 140, margin: 0 }).then(setQrDataUrl);
  }, [profileUrl]);

  const dimensions =
    size === "story"
      ? { width: 360, height: 640, label: "1080 x 1920" }
      : { width: 360, height: 450, label: "1080 x 1350" };

  async function downloadPng() {
    if (!posterRef.current) return;
    const dataUrl = await toPng(posterRef.current, { pixelRatio: 3, cacheBust: true });
    const link = document.createElement("a");
    link.href = dataUrl;
    link.download = `my-odien-2026-${size}.png`;
    link.click();
  }

  async function downloadJpg() {
    if (!posterRef.current) return;
    const dataUrl = await toJpeg(posterRef.current, {
      pixelRatio: 3,
      quality: 0.95,
      cacheBust: true,
    });
    const link = document.createElement("a");
    link.href = dataUrl;
    link.download = `my-odien-2026-${size}.jpg`;
    link.click();
  }

  async function share() {
    const text = "My Ô Diên 2026 - Wrapped của tôi tại Ô Diên One";
    if (navigator.share) {
      try {
        await navigator.share({
          title: "My Ô Diên 2026",
          text,
          url: window.location.href,
        });
        return;
      } catch {
        // ignore
      }
    }
    await copyLink();
  }

  async function copyLink() {
    await navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <Button
          size="sm"
          variant={size === "story" ? "default" : "outline"}
          onClick={() => setSize("story")}
        >
          Story {dimensions.label}
        </Button>
        <Button
          size="sm"
          variant={size === "feed" ? "default" : "outline"}
          onClick={() => setSize("feed")}
        >
          Feed 1080 x 1350
        </Button>
      </div>

      <div className="flex justify-center">
        <div
          ref={posterRef}
          className="rounded-3xl overflow-hidden shadow-2xl"
          style={{
            width: dimensions.width,
            height: dimensions.height,
            fontFamily: "system-ui, sans-serif",
          }}
        >
          <div className="relative w-full h-full bg-gradient-to-br from-[#831829] via-[#C41E3A] to-[#1F0A0E] text-white p-7 flex flex-col">
            <p className="text-xs tracking-[0.22em] text-odien-gold font-bold uppercase">
              My Ô Diên 2026
            </p>
            <p className="text-[10px] text-white/70 mt-1 tracking-[0.18em] uppercase">
              O DIEN ONE
            </p>

            <div className="mt-6 flex items-center gap-3">
              <img
                src={payload.progress.citizenCard?.avatarUrl ?? ""}
                alt="avatar"
                className="w-16 h-16 rounded-2xl object-cover border border-white/30"
              />
              <div>
                <p className="font-semibold leading-tight">
                  {payload.progress.citizenCard?.fullName}
                </p>
                <p className="text-xs text-white/70">
                  {payload.progress.citizenCard?.citizenId}
                </p>
              </div>
            </div>

            <div className="mt-7">
              <p className="text-white/70 text-xs">DNA Ô Diên</p>
              <p className="text-5xl font-black leading-none mt-1">
                {payload.progress.quiz?.score ?? 0}%
              </p>
              <p className="text-odien-gold font-semibold mt-1">
                {payload.progress.quiz?.title ?? "Người Bạn Của Ô Diên"}
              </p>
            </div>

            <div className="mt-6 space-y-2">
              {payload.achievements.slice(0, 4).map((item) => (
                <p
                  key={item.id}
                  className="inline-flex mr-2 mb-2 rounded-full bg-white/10 px-3 py-1 text-[11px]"
                >
                  {item.label}
                </p>
              ))}
            </div>

            <div className="mt-auto flex items-end justify-between">
              <div className="text-xs">
                <p className="text-white/70">Mở Time Capsule</p>
                <p className="font-semibold">01/07/2027</p>
              </div>
              {qrDataUrl ? (
                <img
                  src={qrDataUrl}
                  alt="qr"
                  className="w-16 h-16 rounded-md bg-white p-1"
                />
              ) : (
                <div className="w-16 h-16 rounded-md bg-white/20" />
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 justify-center">
        <Button size="sm" onClick={downloadPng}>
          <Download />
          PNG
        </Button>
        <Button size="sm" variant="outline" onClick={downloadJpg}>
          <Download />
          JPG
        </Button>
        <Button size="sm" variant="secondary" onClick={share}>
          <Share2 />
          Chia sẻ
        </Button>
        <Button size="sm" variant="ghost" onClick={copyLink}>
          {copied ? <Check /> : <Copy />}
          {copied ? "Đã sao chép" : "Copy link"}
        </Button>
      </div>
    </div>
  );
}
