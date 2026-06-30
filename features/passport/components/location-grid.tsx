"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { PASSPORT_LOCATIONS } from "../data/locations";
import { getCategoryLabel } from "../lib/badge-engine";
import { Check, MapPin } from "lucide-react";

interface LocationGridProps {
  visitedIds: Set<string>;
}

export function LocationGrid({ visitedIds }: LocationGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      {PASSPORT_LOCATIONS.map((location, i) => {
        const visited = visitedIds.has(location.id);
        return (
          <motion.div
            key={location.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.03 }}
            className={cn(
              "flex items-start gap-3 p-4 rounded-xl border transition-all",
              visited
                ? "bg-primary/5 border-primary/30"
                : "bg-muted/30 border-border opacity-70"
            )}
          >
            <div
              className={cn(
                "flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-lg",
                visited ? "bg-primary/15 ring-2 ring-primary/30" : "bg-muted"
              )}
            >
              {visited ? (
                <Check className="text-primary" size={18} />
              ) : (
                <span>{location.icon}</span>
              )}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <p className="font-medium text-sm truncate">{location.nameVi}</p>
                {visited && (
                  <span className="text-[10px] uppercase tracking-wide text-primary font-semibold">
                    Đã tem
                  </span>
                )}
              </div>
              <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
                {location.description}
              </p>
              <div className="flex items-center gap-1 mt-1.5 text-[10px] text-muted-foreground">
                <MapPin size={10} />
                {getCategoryLabel(location.category)}
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
