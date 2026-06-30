"use server";

import { getAdminDb } from "@/lib/firebase/admin";
import { TOTAL_LOCATIONS } from "@/features/passport/data/locations";

export interface PublicStats {
  citizenCards: number;
  messages: number;
  passportLocations: number;
  quizResults: number;
}

export async function getPublicStatsAction(): Promise<PublicStats> {
  const db = getAdminDb();
  const counter = await db.doc("analytics/counters").get();
  const data = counter.data() ?? {};

  return {
    citizenCards: (data.citizenCards as number) ?? 0,
    messages: (data.messages as number) ?? 0,
    passportLocations: TOTAL_LOCATIONS,
    quizResults: (data.quizResults as number) ?? 0,
  };
}
