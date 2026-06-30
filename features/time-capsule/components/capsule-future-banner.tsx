"use client";

import { motion } from "framer-motion";
import { Sparkles, Infinity as InfinityIcon } from "lucide-react";
import { CAPSULE_MILESTONE_LABEL, CAPSULE_SEALED_MESSAGE } from "@/lib/constants";

const FUTURE_WORDS = ["Ngày mai", "Thế hệ sau", "Ô Diên rực rỡ", "Kỷ niệm mới"];

export function CapsuleFutureBanner() {
  return (
    <div className="text-center">
      <p className="text-sm text-muted-foreground mb-4">{CAPSULE_SEALED_MESSAGE}</p>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="inline-flex flex-col items-center glass-card px-8 py-6"
      >
        <motion.div
          animate={{ rotate: [0, 5, -5, 0] }}
          transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
          className="mb-3"
        >
          <InfinityIcon className="text-odien-gold" size={36} strokeWidth={1.5} />
        </motion.div>
        <span className="text-2xl font-bold text-gradient">
          {CAPSULE_MILESTONE_LABEL}
        </span>
        <p className="text-xs text-muted-foreground mt-2 max-w-xs">
          Mỗi lời nhắn là mầm xanh gửi về phía trước
        </p>
      </motion.div>

      <div className="flex flex-wrap justify-center gap-2 mt-6">
        {FUTURE_WORDS.map((word, i) => (
          <motion.span
            key={word}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 + i * 0.1 }}
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-medium"
          >
            <Sparkles size={12} />
            {word}
          </motion.span>
        ))}
      </div>
    </div>
  );
}
