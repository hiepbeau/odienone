import type { PublicStats } from "@/actions/analytics";

export function hasCommunityActivity(stats: PublicStats): boolean {
  return (
    stats.citizenCards > 0 || stats.messages > 0 || stats.quizResults > 0
  );
}
