"use client";

import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import type { WrappedAchievement } from "../types";

interface AchievementBadgeProps {
  achievement: WrappedAchievement;
  index: number;
}

export function AchievementBadge({ achievement, index }: AchievementBadgeProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08 }}
      className="rounded-2xl border bg-background/70 px-4 py-3"
    >
      <div className="flex items-center gap-2 text-odien-gold">
        <Sparkles size={14} />
        <p className="text-sm font-semibold">{achievement.label}</p>
      </div>
      <p className="text-xs text-muted-foreground mt-1">
        {achievement.description}
      </p>
    </motion.div>
  );
}
