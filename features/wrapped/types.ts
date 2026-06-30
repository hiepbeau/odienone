import type { PublicStats } from "@/actions/analytics";
import type { WrappedProgressData } from "@/lib/wrapped/progress";

export interface WrappedAchievement {
  id: string;
  label: string;
  description: string;
}

export interface WrappedPayload {
  progress: WrappedProgressData;
  stats: PublicStats;
  achievements: WrappedAchievement[];
}
