"use client";

import { motion } from "framer-motion";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

interface QuizProgressBarProps {
  current: number;
  total: number;
}

export function QuizProgressBar({ current, total }: QuizProgressBarProps) {
  const percent = total > 0 ? Math.round((current / total) * 100) : 0;

  return (
    <div className="w-full max-w-xl mx-auto">
      <div className="flex justify-between text-xs text-muted-foreground mb-2">
        <span>
          Câu {current}/{total}
        </span>
        <span>{percent}%</span>
      </div>
      <Progress value={percent} className="h-2" />
    </div>
  );
}

interface QuizAnswerButtonProps {
  text: string;
  index: number;
  selected: boolean;
  onSelect: () => void;
  disabled?: boolean;
}

export function QuizAnswerButton({
  text,
  index,
  selected,
  onSelect,
  disabled,
}: QuizAnswerButtonProps) {
  const labels = ["A", "B", "C", "D"];

  return (
    <motion.button
      type="button"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.08 }}
      onClick={onSelect}
      disabled={disabled}
      className={cn(
        "w-full text-left p-4 rounded-xl border transition-all flex items-start gap-3",
        "hover:border-primary hover:bg-primary/5 disabled:opacity-50",
        selected
          ? "border-primary bg-primary/10 ring-2 ring-primary/20"
          : "border-border bg-card"
      )}
    >
      <span
        className={cn(
          "flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold",
          selected ? "bg-primary text-primary-foreground" : "bg-muted"
        )}
      >
        {labels[index]}
      </span>
      <span className="text-sm leading-relaxed pt-1">{text}</span>
    </motion.button>
  );
}
