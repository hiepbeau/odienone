"use client";

import { motion } from "framer-motion";
import { Lock } from "lucide-react";

interface CapsuleVaultProps {
  sealed?: boolean;
  animateLetter?: boolean;
}

export function CapsuleVault({
  sealed = true,
  animateLetter = false,
}: CapsuleVaultProps) {
  return (
    <div className="relative w-48 h-56 mx-auto">
      {/* Glow */}
      <div className="absolute inset-0 bg-odien-gold/20 rounded-full blur-3xl scale-150" />

      {/* Capsule body */}
      <motion.div
        className="relative z-10 w-full h-full"
        animate={sealed ? { scale: [1, 1.02, 1] } : {}}
        transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
      >
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-40 h-32 rounded-b-[5rem] rounded-t-3xl bg-gradient-to-b from-odien-red to-[#5C0F1A] border-2 border-odien-gold/50 shadow-2xl overflow-hidden">
          <div className="absolute inset-x-4 top-4 h-1 bg-odien-gold/40 rounded-full" />
          <div className="absolute inset-x-0 top-1/2 h-px bg-odien-gold/30" />
          {sealed && (
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center">
              <Lock className="text-odien-gold" size={20} />
              <span className="text-[9px] text-white/60 mt-1 uppercase tracking-widest">
                Tương lai
              </span>
            </div>
          )}
        </div>

        {/* Capsule lid */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-20 rounded-t-[5rem] rounded-b-xl bg-gradient-to-b from-[#D4AF37] to-[#B8941F] border-2 border-odien-gold/60 shadow-lg" />
      </motion.div>

      {/* Flying letter animation */}
      {animateLetter && (
        <motion.div
          initial={{ opacity: 0, y: -80, x: 40, rotate: -15, scale: 0.5 }}
          animate={{ opacity: [0, 1, 1, 0], y: [ -80, -20, 60, 80 ], x: [40, 0, 0, 0], rotate: [-15, 0, 0, 0], scale: [0.5, 1, 0.3, 0] }}
          transition={{ duration: 2, ease: "easeInOut" }}
          className="absolute top-0 left-1/2 -translate-x-1/2 z-20 text-3xl"
        >
          ✉️
        </motion.div>
      )}

      {/* Sparkles */}
      {[...Array(6)].map((_, i) => (
        <motion.span
          key={i}
          className="absolute text-odien-gold text-xs"
          style={{
            left: `${20 + i * 12}%`,
            top: `${30 + (i % 3) * 15}%`,
          }}
          animate={{
            opacity: [0.2, 1, 0.2],
            scale: [0.8, 1.2, 0.8],
          }}
          transition={{
            repeat: Infinity,
            duration: 2,
            delay: i * 0.3,
          }}
        >
          ✦
        </motion.span>
      ))}
    </div>
  );
}
