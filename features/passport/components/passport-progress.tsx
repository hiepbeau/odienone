"use client";

import { motion } from "framer-motion";
import { Progress } from "@/components/ui/progress";
import { BookOpen } from "lucide-react";

interface PassportProgressProps {
  stampCount: number;
  total: number;
}

export function PassportProgress({ stampCount, total }: PassportProgressProps) {
  const percent = total > 0 ? Math.round((stampCount / total) * 100) : 0;

  return (
    <div className="glass-card p-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 rounded-xl bg-primary/10">
          <BookOpen className="text-primary" size={20} />
        </div>
        <div>
          <h3 className="font-semibold">Tiến độ hộ chiếu</h3>
          <p className="text-sm text-muted-foreground">
            {stampCount}/{total} địa điểm · {percent}%
          </p>
        </div>
      </div>
      <Progress value={percent} className="h-3" />
      <div className="flex justify-between mt-3 text-xs text-muted-foreground">
        <span>✔ {stampCount} đã ghé</span>
        <span>{total - stampCount} còn lại</span>
      </div>
    </div>
  );
}
