"use client";

import { motion } from "framer-motion";
import { Trophy, Medal } from "lucide-react";
import { useLeaderboard } from "../hooks/use-passport";
import { Loader2 } from "lucide-react";

export function Leaderboard() {
  const { data, isLoading } = useLeaderboard(10);

  return (
    <div className="glass-card p-6">
      <div className="flex items-center gap-2 mb-6">
        <Trophy className="text-odien-gold" size={22} />
        <h3 className="font-semibold text-lg">Bảng xếp hạng</h3>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-8">
          <Loader2 className="animate-spin text-muted-foreground" />
        </div>
      ) : !data?.length ? (
        <p className="text-center text-sm text-muted-foreground py-8">
          Chưa có ai trên bảng xếp hạng. Hãy là người đầu tiên!
        </p>
      ) : (
        <div className="space-y-2">
          {data.map((entry, i) => (
            <motion.div
              key={entry.userId}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              className="flex items-center gap-3 p-3 rounded-xl hover:bg-muted/50 transition-colors"
            >
              <RankBadge rank={entry.rank} />
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm truncate">{entry.displayName}</p>
                <p className="text-xs text-muted-foreground">
                  {entry.stampCount} tem
                </p>
              </div>
              <Medal
                className={
                  entry.rank <= 3 ? "text-odien-gold" : "text-muted-foreground"
                }
                size={18}
              />
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}

function RankBadge({ rank }: { rank: number }) {
  const colors: Record<number, string> = {
    1: "bg-odien-gold text-odien-dark",
    2: "bg-gray-300 text-gray-800",
    3: "bg-amber-700 text-white",
  };

  return (
    <span
      className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
        colors[rank] ?? "bg-muted text-muted-foreground"
      }`}
    >
      {rank}
    </span>
  );
}
