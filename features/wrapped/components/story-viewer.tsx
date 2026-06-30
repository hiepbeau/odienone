"use client";

import { useMemo, useState } from "react";
import { AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AchievementBadge } from "./achievement-badge";
import { WrappedCard } from "./wrapped-card";
import type { WrappedPayload } from "../types";

interface StoryViewerProps {
  payload: WrappedPayload;
}

function useCountdown(targetDate: Date) {
  const now = Date.now();
  const diff = Math.max(targetDate.getTime() - now, 0);
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  return { days };
}

export function StoryViewer({ payload }: StoryViewerProps) {
  const [index, setIndex] = useState(0);
  const maxIndex = 6;
  const { progress, achievements, stats } = payload;
  const { days } = useCountdown(new Date("2027-07-01T00:00:00+07:00"));

  const story = useMemo(() => {
    return [
      <WrappedCard
        key="cover"
        title="Ô Diên Wrapped 2026"
        subtitle="Tổng kết câu chuyện cá nhân của bạn"
      >
        <div className="h-full flex flex-col items-center justify-center text-center">
          <p className="text-7xl mb-4">🎧</p>
          <p className="text-2xl font-black text-gradient">MY Ô DIÊN 2026</p>
          <p className="text-sm text-muted-foreground mt-4 max-w-sm">
            Một năm kết nối, ký ức và câu chuyện của riêng bạn cùng cộng đồng Ô Diên.
          </p>
        </div>
      </WrappedCard>,
      <WrappedCard
        key="citizen"
        title="Citizen Card"
        subtitle="Danh tính số của bạn tại Ô Diên One"
      >
        <div className="flex flex-col sm:flex-row gap-6 items-center">
          <img
            src={progress.citizenCard?.avatarUrl || ""}
            alt="avatar"
            className="w-24 h-24 rounded-2xl object-cover border"
          />
          <div className="space-y-2 text-sm">
            <p>
              <span className="text-muted-foreground">Họ tên:</span>{" "}
              {progress.citizenCard?.fullName}
            </p>
            <p>
              <span className="text-muted-foreground">Citizen ID:</span>{" "}
              {progress.citizenCard?.citizenId}
            </p>
            <p>
              <span className="text-muted-foreground">Ngày tham gia:</span>{" "}
              {progress.citizenCard?.issueDate}
            </p>
          </div>
        </div>
      </WrappedCard>,
      <WrappedCard
        key="dna"
        title="DNA Ô Diên"
        subtitle="Bản sắc của bạn qua quiz cộng đồng"
      >
        <div className="h-full flex flex-col justify-center text-center">
          <p className="text-6xl font-black text-gradient">{progress.quiz?.score}%</p>
          <p className="text-xl font-semibold mt-3">{progress.quiz?.title}</p>
          <p className="text-sm text-muted-foreground mt-2">
            Tên hiển thị: {progress.quiz?.displayName}
          </p>
        </div>
      </WrappedCard>,
      <WrappedCard
        key="capsule"
        title="Time Capsule"
        subtitle="Lời nhắn đã niêm phong cho tương lai"
      >
        <div className="h-full flex flex-col justify-center text-center">
          <p className="text-6xl mb-4">🔒</p>
          <p className="font-semibold">{progress.timeCapsule?.title}</p>
          <p className="text-sm text-muted-foreground mt-2">
            Mốc mở: 01/07/2027 • Còn {days} ngày
          </p>
        </div>
      </WrappedCard>,
      <WrappedCard
        key="achievements"
        title="Achievements"
        subtitle="Những cột mốc bạn đã đạt được"
      >
        <div className="grid sm:grid-cols-2 gap-3">
          {achievements.map((achievement, i) => (
            <AchievementBadge
              key={achievement.id}
              achievement={achievement}
              index={i}
            />
          ))}
        </div>
      </WrappedCard>,
      <WrappedCard key="community" title="Community Stats" subtitle="Ô Diên One năm qua">
        <div className="grid grid-cols-2 gap-3 text-center">
          <div className="rounded-xl border p-4">
            <p className="text-2xl font-bold">{stats.citizenCards}</p>
            <p className="text-xs text-muted-foreground">Thẻ Công Dân</p>
          </div>
          <div className="rounded-xl border p-4">
            <p className="text-2xl font-bold">{stats.quizResults}</p>
            <p className="text-xs text-muted-foreground">Kết Quả Quiz</p>
          </div>
          <div className="rounded-xl border p-4">
            <p className="text-2xl font-bold">{stats.messages}</p>
            <p className="text-xs text-muted-foreground">Lời Nhắn</p>
          </div>
          <div className="rounded-xl border p-4">
            <p className="text-2xl font-bold">{stats.passportLocations}</p>
            <p className="text-xs text-muted-foreground">Địa Điểm</p>
          </div>
        </div>
      </WrappedCard>,
      <WrappedCard
        key="poster"
        title="Final Poster"
        subtitle="Cuộn xuống để tải và chia sẻ poster của bạn"
      >
        <div className="h-full flex flex-col justify-center items-center text-center">
          <p className="text-5xl mb-4">📸</p>
          <p className="text-muted-foreground">
            Xuất ảnh 1080x1920 hoặc 1080x1350 và chia sẻ ngay.
          </p>
        </div>
      </WrappedCard>,
    ];
  }, [achievements, days, progress, stats]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIndex((v) => Math.max(0, v - 1))}
          disabled={index === 0}
        >
          <ChevronLeft />
          Trước
        </Button>
        <p className="text-xs text-muted-foreground">
          Story {index + 1}/{maxIndex + 1}
        </p>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIndex((v) => Math.min(maxIndex, v + 1))}
          disabled={index === maxIndex}
        >
          Sau
          <ChevronRight />
        </Button>
      </div>

      <AnimatePresence mode="wait">{story[index]}</AnimatePresence>
    </div>
  );
}
