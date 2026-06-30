"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { BarChart3, IdCard, MessageSquare, Brain, MapPin, Sparkles } from "lucide-react";
import { StatCounter } from "@/components/shared/stat-counter";
import { GlassCard } from "@/components/shared/glass-card";
import { Button } from "@/components/ui/button";
import { getPublicStatsAction } from "@/actions/analytics";
import { hasCommunityActivity } from "../lib/stats";
import { TOTAL_LOCATIONS } from "@/features/passport/data/locations";

function StatsSkeleton() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="text-center space-y-3 animate-pulse">
          <div className="h-10 bg-muted rounded-lg mx-auto w-20" />
          <div className="h-4 bg-muted rounded-md mx-auto w-24" />
        </div>
      ))}
    </div>
  );
}

function StatsEmptyState() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="text-center max-w-lg mx-auto py-4"
    >
      <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 text-primary mb-6">
        <Sparkles size={32} />
      </div>
      <h3 className="text-xl font-semibold mb-2">
        Cộng đồng đang bắt đầu hành trình
      </h3>
      <p className="text-muted-foreground text-sm leading-relaxed mb-8">
        Chưa có thống kê hoạt động — hãy là người đầu tiên tạo thẻ công dân,
        gửi lời nhắn vào hộp thời gian, hoặc thử sức với quiz Ô Diên.
      </p>
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Button asChild size="sm">
          <Link href="/citizen-card">
            <IdCard className="mr-2 h-4 w-4" />
            Tạo Thẻ Công Dân
          </Link>
        </Button>
        <Button asChild size="sm" variant="outline">
          <Link href="/time-capsule">
            <MessageSquare className="mr-2 h-4 w-4" />
            Gửi Lời Nhắn
          </Link>
        </Button>
        <Button asChild size="sm" variant="outline">
          <Link href="/quiz">
            <Brain className="mr-2 h-4 w-4" />
            Làm Quiz
          </Link>
        </Button>
      </div>
      <p className="text-xs text-muted-foreground mt-8 flex items-center justify-center gap-1.5">
        <MapPin className="h-3.5 w-3.5" />
        {TOTAL_LOCATIONS} địa điểm hộ chiếu đang chờ bạn khám phá
      </p>
    </motion.div>
  );
}

export function StatsSection() {
  const { data: stats, isLoading, isError } = useQuery({
    queryKey: ["public-stats"],
    queryFn: getPublicStatsAction,
    staleTime: 2 * 60 * 1000,
  });

  const statItems = stats
    ? [
        { value: stats.citizenCards, label: "Thẻ Công Dân", icon: IdCard },
        { value: stats.messages, label: "Lời Nhắn", icon: MessageSquare },
        {
          value: stats.passportLocations,
          label: "Địa Điểm Hộ Chiếu",
          icon: MapPin,
        },
        { value: stats.quizResults, label: "Kết Quả Quiz", icon: Brain },
      ]
    : [];

  const showEmpty = stats && !hasCommunityActivity(stats);
  const showStats = stats && hasCommunityActivity(stats);

  return (
    <section className="py-20 px-4">
      <div className="mx-auto max-w-5xl">
        <GlassCard hover={false} className="p-8 sm:p-12">
          {isLoading ? (
            <StatsSkeleton />
          ) : isError ? (
            <div className="text-center py-4">
              <BarChart3 className="mx-auto h-10 w-10 text-muted-foreground mb-4" />
              <p className="text-sm text-muted-foreground">
                Không thể tải thống kê lúc này. Vui lòng thử lại sau.
              </p>
            </div>
          ) : showEmpty ? (
            <StatsEmptyState />
          ) : showStats ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {statItems.map((stat, i) => (
                <StatCounter
                  key={stat.label}
                  value={stat.value}
                  label={stat.label}
                  delay={i * 0.15}
                />
              ))}
            </div>
          ) : null}
        </GlassCard>
      </div>
    </section>
  );
}
