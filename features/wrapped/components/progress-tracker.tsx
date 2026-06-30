"use client";

import Link from "next/link";
import { CheckCircle2, Circle } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { WrappedProgressData } from "@/lib/wrapped/progress";

interface ProgressTrackerProps {
  progress: WrappedProgressData;
}

const STEPS = [
  { key: "citizenCard", label: "Thẻ Công Dân", href: "/citizen-card" },
  { key: "quiz", label: "Ô Diên Quiz", href: "/quiz" },
  { key: "timeCapsule", label: "Hộp Thời Gian", href: "/time-capsule" },
] as const;

export function ProgressTracker({ progress }: ProgressTrackerProps) {
  const completed = STEPS.filter((step) => Boolean(progress[step.key])).length;

  return (
    <div className="glass-card p-6 space-y-5">
      <div>
        <h2 className="text-xl font-semibold">Mở khóa My Ô Diên 2026</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Hoàn thành 3/3 nhiệm vụ để xem story cá nhân và tạo poster chia sẻ.
        </p>
      </div>

      <div className="space-y-3">
        {STEPS.map((step) => {
          const done = Boolean(progress[step.key]);
          return (
            <div
              key={step.key}
              className="flex items-center justify-between rounded-xl border px-4 py-3"
            >
              <div className="flex items-center gap-3">
                {done ? (
                  <CheckCircle2 className="text-green-500" size={18} />
                ) : (
                  <Circle className="text-muted-foreground" size={18} />
                )}
                <span className="text-sm font-medium">{step.label}</span>
              </div>
              {!done && (
                <Button asChild size="sm" variant="outline">
                  <Link href={step.href}>Hoàn thành</Link>
                </Button>
              )}
            </div>
          );
        })}
      </div>

      <div className="text-xs text-muted-foreground">
        Tiến độ: {completed}/3 nhiệm vụ
      </div>
    </div>
  );
}
