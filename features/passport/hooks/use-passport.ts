"use client";

import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import {
  getPassportDashboardAction,
  getLeaderboardAction,
} from "@/actions/passport";

export function usePassportDashboard() {
  const { getIdToken, user, loading: authLoading } = useAuth();

  return useQuery({
    queryKey: ["passport-dashboard", user?.uid],
    queryFn: async () => {
      const token = await getIdToken();
      return getPassportDashboardAction(token);
    },
    enabled: !authLoading && !!user,
  });
}

export function useLeaderboard(limit = 10) {
  return useQuery({
    queryKey: ["passport-leaderboard", limit],
    queryFn: () => getLeaderboardAction(limit),
    staleTime: 30 * 1000,
  });
}
