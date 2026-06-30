"use client";

import { forwardRef } from "react";
import { cn } from "@/lib/utils";
import { APP_NAME, ANNIVERSARY_DATE } from "@/lib/constants";

export interface QuizPosterData {
  displayName: string;
  score: number;
  title: string;
}

interface QuizResultPosterProps {
  data: QuizPosterData;
  className?: string;
}

export const QuizResultPoster = forwardRef<HTMLDivElement, QuizResultPosterProps>(
  function QuizResultPoster({ data, className }, ref) {
    return (
      <div
        ref={ref}
        className={cn(
          "relative w-full max-w-[420px] aspect-[3/4] rounded-3xl overflow-hidden shadow-2xl select-none",
          className
        )}
        style={{ fontFamily: "system-ui, sans-serif" }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-[#8B1528] via-[#C41E3A] to-[#2D0A10]" />

        <div className="absolute top-0 right-0 w-64 h-64 bg-odien-gold/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full blur-2xl translate-y-1/3 -translate-x-1/4" />

        <div className="relative h-full flex flex-col justify-between p-8 text-white">
          <div>
            <p className="text-odien-gold text-xs font-bold tracking-[0.25em] uppercase">
              {APP_NAME}
            </p>
            <p className="text-white/60 text-[10px] mt-1">
              Kỷ niệm {ANNIVERSARY_DATE}
            </p>
          </div>

          <div className="text-center py-6">
            <p className="text-white/70 text-sm mb-2">Bạn là người Ô Diên</p>
            <p
              className="text-[5.5rem] font-black leading-none tracking-tight"
              style={{
                background: "linear-gradient(180deg, #FFF 0%, #D4AF37 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              {data.score}%
            </p>
            <p className="text-xl font-bold mt-4 text-odien-gold">
              {data.title}
            </p>
          </div>

          <div className="border-t border-white/20 pt-6">
            <p className="text-white/50 text-[10px] uppercase tracking-widest">
              Người làm quiz
            </p>
            <p className="font-semibold text-lg mt-1 truncate">{data.displayName}</p>
            <p className="text-white/40 text-[10px] mt-4 text-center">
              #ÔDiênOne #ÔDiênChínhHiệu
            </p>
          </div>
        </div>
      </div>
    );
  }
);
