"use client";

import { forwardRef } from "react";
import { cn, formatBirthday } from "@/lib/utils";
import { ISSUE_DATE } from "@/lib/constants";

export interface CitizenCardDisplayData {
  fullName: string;
  birthday: string;
  village: string;
  avatarUrl: string;
  citizenId?: string;
  issueDate?: string;
  qrCodeUrl?: string;
}

interface CitizenCardDisplayProps {
  data: CitizenCardDisplayData;
  className?: string;
}

export const CitizenCardDisplay = forwardRef<
  HTMLDivElement,
  CitizenCardDisplayProps
>(function CitizenCardDisplay({ data, className }, ref) {
  const issueDate = data.issueDate ?? ISSUE_DATE;
  const citizenId = data.citizenId ?? "OD-2026-XXXXX";

  return (
    <div
      ref={ref}
      className={cn(
        "relative w-full max-w-[680px] aspect-[1.586/1] rounded-2xl overflow-hidden shadow-2xl select-none",
        className
      )}
      style={{ fontFamily: "system-ui, sans-serif" }}
    >
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#8B1528] via-[#C41E3A] to-[#5C0F1A]" />

      {/* Decorative pattern */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `repeating-linear-gradient(
            45deg,
            transparent,
            transparent 10px,
            rgba(212, 175, 55, 0.3) 10px,
            rgba(212, 175, 55, 0.3) 11px
          )`,
        }}
      />

      {/* Gold border */}
      <div className="absolute inset-2 rounded-xl border-2 border-[#D4AF37]/60 pointer-events-none" />
      <div className="absolute inset-3 rounded-lg border border-[#D4AF37]/30 pointer-events-none" />

      {/* Content */}
      <div className="relative h-full flex flex-col p-5 sm:p-6">
        {/* Header */}
        <div className="text-center mb-3 sm:mb-4">
          <div className="flex items-center justify-center gap-2 mb-1">
            <div className="h-px w-8 sm:w-12 bg-[#D4AF37]" />
            <span className="text-[#D4AF37] text-[10px] sm:text-xs font-bold tracking-[0.2em] uppercase">
              Xã Ô Diên
            </span>
            <div className="h-px w-8 sm:w-12 bg-[#D4AF37]" />
          </div>
          <h2 className="text-white text-sm sm:text-base font-bold tracking-wide">
            THẺ CÔNG DÂN ĐIỆN TỬ
          </h2>
          <p className="text-white/60 text-[9px] sm:text-[10px] mt-0.5">
            Ô DIÊN ONE — Kỷ niệm 1 năm thành lập
          </p>
        </div>

        {/* Body */}
        <div className="flex-1 flex gap-4 sm:gap-5">
          {/* Photo */}
          <div className="flex-shrink-0">
            <div className="w-24 h-32 sm:w-28 sm:h-36 rounded-lg overflow-hidden border-2 border-[#D4AF37]/70 shadow-lg bg-white/10">
              {data.avatarUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={data.avatarUrl}
                  alt={data.fullName}
                  className="w-full h-full object-cover"
                  crossOrigin="anonymous"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-white/40 text-xs">
                  Ảnh
                </div>
              )}
            </div>
          </div>

          {/* Info */}
          <div className="flex-1 flex flex-col justify-between min-w-0 text-white">
            <div className="space-y-2 sm:space-y-2.5">
              <CardField label="Họ và tên" value={data.fullName || "—"} large />
              <CardField
                label="Năm sinh"
                value={formatBirthday(data.birthday) || "—"}
              />
              <CardField label="Thôn/Xóm" value={data.village || "—"} />
              <CardField label="Số định danh" value={citizenId} highlight />
            </div>

            <div className="flex items-end justify-between mt-2">
              <div>
                <p className="text-[#D4AF37]/80 text-[9px] sm:text-[10px] uppercase tracking-wider">
                  Ngày cấp
                </p>
                <p className="text-white text-xs sm:text-sm font-semibold">
                  {issueDate}
                </p>
              </div>

              {data.qrCodeUrl && (
                <div className="bg-white rounded-lg p-1 shadow-md">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={data.qrCodeUrl}
                    alt="QR Code"
                    className="w-14 h-14 sm:w-16 sm:h-16"
                    crossOrigin="anonymous"
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer stripe */}
        <div className="mt-3 h-1 rounded-full bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent opacity-60" />
      </div>
    </div>
  );
});

function CardField({
  label,
  value,
  large,
  highlight,
}: {
  label: string;
  value: string;
  large?: boolean;
  highlight?: boolean;
}) {
  return (
    <div>
      <p className="text-[#D4AF37]/70 text-[9px] sm:text-[10px] uppercase tracking-wider">
        {label}
      </p>
      <p
        className={cn(
          "font-semibold truncate",
          large ? "text-base sm:text-lg" : "text-xs sm:text-sm",
          highlight && "text-[#D4AF37] font-mono tracking-wide"
        )}
      >
        {value}
      </p>
    </div>
  );
}
