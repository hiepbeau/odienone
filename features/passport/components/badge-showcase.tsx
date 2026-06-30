"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { PASSPORT_BADGES, getBadgeById } from "../data/badges";

interface BadgeShowcaseProps {
  earnedBadgeIds: Set<string>;
}

export function BadgeShowcase({ earnedBadgeIds }: BadgeShowcaseProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
      {PASSPORT_BADGES.map((badge, i) => {
        const earned = earnedBadgeIds.has(badge.id);
        return (
          <motion.div
            key={badge.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.08 }}
            className={cn(
              "flex flex-col items-center text-center p-4 rounded-2xl border transition-all",
              earned
                ? "glass-card border-odien-gold/40 bg-odien-gold/5"
                : "bg-muted/20 border-border opacity-50 grayscale"
            )}
          >
            <span className="text-3xl mb-2">{badge.icon}</span>
            <p className="font-semibold text-sm">{badge.nameVi}</p>
            <p className="text-[10px] text-muted-foreground mt-1 leading-snug">
              {badge.description}
            </p>
            {earned && (
              <span className="mt-2 text-[10px] font-bold text-odien-gold uppercase tracking-wide">
                Đã mở khóa
              </span>
            )}
          </motion.div>
        );
      })}
    </div>
  );
}

export function NewBadgeToast({ badgeIds }: { badgeIds: string[] }) {
  if (badgeIds.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2 justify-center">
      {badgeIds.map((id) => {
        const badge = getBadgeById(id);
        if (!badge) return null;
        return (
          <motion.span
            key={id}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-odien-gold/20 text-odien-gold text-sm font-medium"
          >
            {badge.icon} {badge.nameVi}
          </motion.span>
        );
      })}
    </div>
  );
}
