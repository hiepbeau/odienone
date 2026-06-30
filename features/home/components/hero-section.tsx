"use client";

import { motion } from "framer-motion";
import { ArrowDown } from "lucide-react";
import { Countdown } from "@/components/effects/countdown";
import { WordmarkLogo } from "@/components/branding/wordmark-logo";
import {
  APP_TAGLINE,
  FOUNDING_DATE,
  ANNIVERSARY_DATE,
} from "@/lib/constants";

export function HeroSection() {
  return (
    <section className="relative min-h-[90vh] flex flex-col items-center justify-center px-4 hero-glow overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-odien-red/10 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-odien-gold/10 rounded-full blur-3xl animate-float" style={{ animationDelay: "2s" }} />
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="text-6xl mb-6"
      >
        🎉
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.2 }}
        className="text-center"
      >
        <WordmarkLogo className="items-center" />
      </motion.div>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="mt-4 text-lg sm:text-xl text-muted-foreground text-center"
      >
        Kỷ niệm 1 năm thành lập
      </motion.p>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.5 }}
        className="mt-2 text-sm text-muted-foreground font-medium"
      >
        {FOUNDING_DATE} → {ANNIVERSARY_DATE}
      </motion.p>

      <motion.blockquote
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.6 }}
        className="mt-8 max-w-lg text-center text-muted-foreground italic"
      >
        &ldquo;{APP_TAGLINE}&rdquo;
      </motion.blockquote>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.7 }}
        className="mt-10"
      >
        <Countdown />
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-8 animate-bounce"
      >
        <ArrowDown className="text-muted-foreground" size={24} />
      </motion.div>
    </section>
  );
}
