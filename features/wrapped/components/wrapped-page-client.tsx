"use client";

import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Sparkles } from "lucide-react";
import { getPublicStatsAction } from "@/actions/analytics";
import { getWrappedProgress } from "@/lib/wrapped/progress";
import { getWrappedAchievements } from "../lib/achievements";
import { ProgressTracker } from "./progress-tracker";
import { StoryViewer } from "./story-viewer";
import { PosterGenerator } from "./poster-generator";
import type { WrappedPayload } from "../types";

export function WrappedPageClient() {
  const progress = useMemo(() => getWrappedProgress(), []);
  const unlocked = Boolean(progress.citizenCard && progress.quiz && progress.timeCapsule);

  const statsQuery = useQuery({
    queryKey: ["public-stats"],
    queryFn: getPublicStatsAction,
    staleTime: 2 * 60 * 1000,
  });

  const payload: WrappedPayload | null =
    unlocked && statsQuery.data
      ? {
          progress,
          stats: statsQuery.data,
          achievements: getWrappedAchievements(progress),
        }
      : null;

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:py-16 space-y-8">
      <header className="text-center">
        <p className="text-6xl mb-4">🎼</p>
        <h1 className="text-3xl sm:text-4xl font-bold">
          My <span className="text-gradient">Ô Diên 2026</span>
        </h1>
        <p className="text-muted-foreground mt-3 max-w-2xl mx-auto">
          Tổng kết của riêng bạn, sẵn sàng để chia sẻ.
        </p>
      </header>

      {!unlocked ? (
        <ProgressTracker progress={progress} />
      ) : !payload ? (
        <div className="glass-card p-8 text-center text-muted-foreground">
          Đang tải dữ liệu Wrapped...
        </div>
      ) : (
        <>
          <div className="flex items-center gap-2 text-sm text-odien-gold">
            <Sparkles size={16} />
            Đã mở khóa đầy đủ My Ô Diên 2026
          </div>
          <StoryViewer payload={payload} />
          <PosterGenerator payload={payload} />
        </>
      )}
    </div>
  );
}
