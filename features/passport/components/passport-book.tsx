"use client";

import { motion } from "framer-motion";
import { Stamp } from "lucide-react";
import { PASSPORT_LOCATIONS } from "../data/locations";

interface PassportBookProps {
  visitedIds: Set<string>;
  displayName: string;
}

export function PassportBook({ visitedIds, displayName }: PassportBookProps) {
  const stamps = PASSPORT_LOCATIONS.filter((l) => visitedIds.has(l.id));

  return (
    <div className="relative rounded-2xl overflow-hidden shadow-2xl border-2 border-odien-gold/40">
      <div className="bg-gradient-to-br from-[#8B1528] via-[#C41E3A] to-[#5C0F1A] p-6 sm:p-8">
        <div className="text-center mb-6">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Stamp className="text-odien-gold" size={24} />
            <h2 className="text-white font-bold text-lg tracking-wide">
              HỘ CHIẾU Ô DIÊN
            </h2>
          </div>
          <p className="text-white/70 text-sm">{displayName}</p>
          <p className="text-odien-gold/80 text-xs mt-1">Ô DIÊN ONE · 2026</p>
        </div>

        {stamps.length === 0 ? (
          <div className="text-center py-12 text-white/50 text-sm">
            Chưa có tem nào. Quét QR tại các địa điểm để bắt đầu!
          </div>
        ) : (
          <div className="grid grid-cols-4 sm:grid-cols-5 gap-3">
            {stamps.map((loc, i) => (
              <motion.div
                key={loc.id}
                initial={{ opacity: 0, rotate: -10, scale: 0.5 }}
                animate={{ opacity: 1, rotate: 0, scale: 1 }}
                transition={{ delay: i * 0.05, type: "spring" }}
                className="aspect-square rounded-xl bg-white/10 border border-odien-gold/30 flex flex-col items-center justify-center p-2 backdrop-blur-sm"
                title={loc.nameVi}
              >
                <span className="text-2xl">{loc.icon}</span>
                <span className="text-[8px] text-white/80 mt-1 text-center leading-tight line-clamp-2">
                  {loc.nameVi.split(" ").slice(-2).join(" ")}
                </span>
              </motion.div>
            ))}
          </div>
        )}

        <div className="mt-6 h-px bg-gradient-to-r from-transparent via-odien-gold/50 to-transparent" />
        <p className="text-center text-white/40 text-[10px] mt-3 tracking-widest uppercase">
          {stamps.length} / {PASSPORT_LOCATIONS.length} tem
        </p>
      </div>
    </div>
  );
}
