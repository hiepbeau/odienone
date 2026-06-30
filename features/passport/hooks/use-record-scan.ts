"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { recordPassportScanAction } from "@/actions/passport";

export function useRecordScan() {
  const { getIdToken } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      locationId,
      token,
    }: {
      locationId: string;
      token: string;
    }) => {
      const idToken = await getIdToken();
      return recordPassportScanAction(idToken, locationId, token);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["passport-dashboard"] });
      queryClient.invalidateQueries({ queryKey: ["passport-leaderboard"] });
    },
  });
}
