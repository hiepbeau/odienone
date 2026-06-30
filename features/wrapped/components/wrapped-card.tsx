"use client";

import { motion } from "framer-motion";

interface WrappedCardProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}

export function WrappedCard({ title, subtitle, children }: WrappedCardProps) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="glass-card p-6 sm:p-8 min-h-[420px] flex flex-col"
    >
      <header className="mb-6">
        <h3 className="text-xl sm:text-2xl font-bold">{title}</h3>
        {subtitle && <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>}
      </header>
      <div className="flex-1">{children}</div>
    </motion.section>
  );
}
