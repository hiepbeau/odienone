"use server";

import { FieldValue, type QueryDocumentSnapshot } from "firebase-admin/firestore";
import { getAdminDb } from "@/lib/firebase/admin";
import { verifyAdmin, AdminAuthError } from "@/lib/auth/verify-admin";
import { toCsv } from "@/lib/csv";
import { PASSPORT_LOCATIONS } from "@/features/passport/data/locations";
import type { CapsuleStatus } from "@/types";

function toIso(value: unknown): string {
  if (
    value &&
    typeof value === "object" &&
    "toDate" in value &&
    typeof (value as { toDate: () => Date }).toDate === "function"
  ) {
    return (value as { toDate: () => Date }).toDate().toISOString();
  }
  return "";
}

async function requireAdmin(idToken: string) {
  try {
    return await verifyAdmin(idToken);
  } catch (err) {
    if (err instanceof AdminAuthError) throw err;
    throw new AdminAuthError("Phiên đăng nhập đã hết hạn");
  }
}

export interface AdminAnalytics {
  citizenCards: number;
  messages: number;
  passportHolders: number;
  passportScans: number;
  quizResults: number;
  pendingCapsules: number;
  passportLocations: number;
}

export interface AdminCapsuleRow {
  id: string;
  authorName: string;
  village: string;
  title: string;
  message: string;
  visibility: "public" | "private";
  status: CapsuleStatus;
  isAnonymous: boolean;
  milestone: string;
  createdAt: string;
  hasPhoto: boolean;
}

export interface AdminCapsulesResult {
  capsules: AdminCapsuleRow[];
  /** True when Firestore composite index is still building; data uses fallback query */
  indexBuilding?: boolean;
}

function isFirestoreIndexError(err: unknown): boolean {
  if (!err || typeof err !== "object") return false;
  const code = (err as { code?: number }).code;
  const message = String((err as { message?: string }).message ?? "");
  const details = String((err as { details?: string }).details ?? "");
  return (
    code === 9 ||
    message.includes("index") ||
    details.includes("index") ||
    message.includes("FAILED_PRECONDITION")
  );
}

function mapCapsuleDoc(doc: QueryDocumentSnapshot): AdminCapsuleRow {
  const data = doc.data();
  return {
    id: doc.id,
    authorName: (data.authorName as string) ?? "",
    village: (data.village as string) ?? "",
    title: (data.title as string) ?? "",
    message: (data.message as string) ?? "",
    visibility: data.visibility as "public" | "private",
    status: data.status as CapsuleStatus,
    isAnonymous: Boolean(data.isAnonymous),
    milestone: (data.milestone as string) ?? "future",
    createdAt: toIso(data.createdAt),
    hasPhoto: Boolean(data.photoUrl),
  };
}

function sortCapsulesByCreatedAtDesc(rows: AdminCapsuleRow[]): AdminCapsuleRow[] {
  return [...rows].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

async function fetchCapsulesByStatus(
  status: CapsuleStatus
): Promise<{ capsules: AdminCapsuleRow[]; indexBuilding?: boolean }> {
  const db = getAdminDb();
  const collection = db.collection("capsules");

  try {
    const snap = await collection
      .where("status", "==", status)
      .orderBy("createdAt", "desc")
      .limit(100)
      .get();
    return { capsules: snap.docs.map(mapCapsuleDoc) };
  } catch (err) {
    if (!isFirestoreIndexError(err)) throw err;

    const snap = await collection.where("status", "==", status).get();
    return {
      capsules: sortCapsulesByCreatedAtDesc(snap.docs.map(mapCapsuleDoc)).slice(
        0,
        100
      ),
      indexBuilding: true,
    };
  }
}

export interface AdminCitizenCardRow {
  id: string;
  citizenId: string;
  fullName: string;
  village: string;
  birthday: string;
  issueDate: string;
  profileSlug: string;
  createdAt: string;
}

export interface AdminPassportStats {
  holders: number;
  totalScans: number;
  locationScans: { locationId: string; nameVi: string; count: number }[];
  topTravelers: { userId: string; displayName: string; stampCount: number }[];
}

export interface AdminQuizStats {
  totalResults: number;
  averageScore: number;
  titleBreakdown: { title: string; count: number }[];
  recentResults: {
    id: string;
    displayName: string;
    score: number;
    title: string;
    createdAt: string;
  }[];
}

export async function verifyAdminSessionAction(
  idToken: string
): Promise<{ email: string }> {
  const { email } = await requireAdmin(idToken);
  return { email };
}

export async function getAdminAnalyticsAction(
  idToken: string
): Promise<AdminAnalytics> {
  await requireAdmin(idToken);
  const db = getAdminDb();

  const [countersDoc, pendingSnap, scansSnap] = await Promise.all([
    db.doc("analytics/counters").get(),
    db.collection("capsules").where("status", "==", "pending").get(),
    db.collection("passport_scans").count().get(),
  ]);

  const counters = countersDoc.data() ?? {};

  return {
    citizenCards: (counters.citizenCards as number) ?? 0,
    messages: (counters.messages as number) ?? 0,
    passportHolders: (counters.passportHolders as number) ?? 0,
    passportScans: scansSnap.data().count,
    quizResults: (counters.quizResults as number) ?? 0,
    pendingCapsules: pendingSnap.size,
    passportLocations: PASSPORT_LOCATIONS.length,
  };
}

export async function getAdminCapsulesAction(
  idToken: string,
  status?: CapsuleStatus
): Promise<AdminCapsulesResult> {
  await requireAdmin(idToken);
  const db = getAdminDb();

  if (status) {
    return fetchCapsulesByStatus(status);
  }

  const snap = await db
    .collection("capsules")
    .orderBy("createdAt", "desc")
    .limit(100)
    .get();

  return { capsules: snap.docs.map(mapCapsuleDoc) };
}

export async function updateCapsuleStatusAction(
  idToken: string,
  capsuleId: string,
  status: Extract<CapsuleStatus, "approved" | "rejected">
): Promise<{ success: true }> {
  await requireAdmin(idToken);
  const db = getAdminDb();
  const ref = db.collection("capsules").doc(capsuleId);
  const doc = await ref.get();

  if (!doc.exists) {
    throw new Error("Không tìm thấy lời nhắn");
  }

  await ref.update({
    status,
    reviewedAt: FieldValue.serverTimestamp(),
  });

  return { success: true };
}

export async function getAdminCitizenCardsAction(
  idToken: string
): Promise<AdminCitizenCardRow[]> {
  await requireAdmin(idToken);
  const db = getAdminDb();

  const snap = await db
    .collection("citizen_cards")
    .orderBy("createdAt", "desc")
    .limit(200)
    .get();

  return snap.docs.map((doc) => {
    const data = doc.data();
    return {
      id: doc.id,
      citizenId: (data.citizenId as string) ?? "",
      fullName: (data.fullName as string) ?? "",
      village: (data.village as string) ?? "",
      birthday: (data.birthday as string) ?? "",
      issueDate: (data.issueDate as string) ?? "",
      profileSlug: (data.profileSlug as string) ?? "",
      createdAt: toIso(data.createdAt),
    };
  });
}

export async function exportCitizenCardsCsvAction(
  idToken: string
): Promise<string> {
  const cards = await getAdminCitizenCardsAction(idToken);
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

  return toCsv(
    [
      "id",
      "citizenId",
      "fullName",
      "village",
      "birthday",
      "issueDate",
      "profileUrl",
      "createdAt",
    ],
    cards.map((card) => [
      card.id,
      card.citizenId,
      card.fullName,
      card.village,
      card.birthday,
      card.issueDate,
      `${appUrl}/citizen-card/${card.profileSlug}`,
      card.createdAt,
    ])
  );
}

export async function exportCapsulesCsvAction(idToken: string): Promise<string> {
  const { capsules } = await getAdminCapsulesAction(idToken);

  return toCsv(
    [
      "id",
      "authorName",
      "village",
      "title",
      "message",
      "visibility",
      "status",
      "isAnonymous",
      "milestone",
      "hasPhoto",
      "createdAt",
    ],
    capsules.map((capsule) => [
      capsule.id,
      capsule.authorName,
      capsule.village,
      capsule.title,
      capsule.message,
      capsule.visibility,
      capsule.status,
      capsule.isAnonymous,
      capsule.milestone,
      capsule.hasPhoto,
      capsule.createdAt,
    ])
  );
}

export async function getAdminPassportStatsAction(
  idToken: string
): Promise<AdminPassportStats> {
  await requireAdmin(idToken);
  const db = getAdminDb();

  const [holdersSnap, scansSnap, leaderboardSnap] = await Promise.all([
    db.collection("passport_holders").count().get(),
    db.collection("passport_scans").get(),
    db
      .collection("passport_leaderboard")
      .orderBy("stampCount", "desc")
      .limit(10)
      .get(),
  ]);

  const locationCounts = new Map<string, number>();
  for (const doc of scansSnap.docs) {
    const locationId = doc.data().locationId as string;
    locationCounts.set(locationId, (locationCounts.get(locationId) ?? 0) + 1);
  }

  const locationScans = PASSPORT_LOCATIONS.map((location) => ({
    locationId: location.id,
    nameVi: location.nameVi,
    count: locationCounts.get(location.id) ?? 0,
  })).sort((a, b) => b.count - a.count);

  return {
    holders: holdersSnap.data().count,
    totalScans: scansSnap.size,
    locationScans,
    topTravelers: leaderboardSnap.docs.map((doc) => ({
      userId: doc.id,
      displayName: (doc.data().displayName as string) ?? "Khách",
      stampCount: (doc.data().stampCount as number) ?? 0,
    })),
  };
}

export async function getAdminQuizStatsAction(
  idToken: string
): Promise<AdminQuizStats> {
  await requireAdmin(idToken);
  const db = getAdminDb();

  const snap = await db
    .collection("quiz_results")
    .orderBy("createdAt", "desc")
    .limit(200)
    .get();

  const results = snap.docs.map((doc) => {
    const data = doc.data();
    return {
      id: doc.id,
      displayName: (data.displayName as string) ?? "",
      score: (data.score as number) ?? 0,
      title: (data.title as string) ?? "",
      createdAt: toIso(data.createdAt),
    };
  });

  const titleMap = new Map<string, number>();
  let scoreSum = 0;

  for (const result of results) {
    titleMap.set(result.title, (titleMap.get(result.title) ?? 0) + 1);
    scoreSum += result.score;
  }

  return {
    totalResults: results.length,
    averageScore:
      results.length > 0 ? Math.round(scoreSum / results.length) : 0,
    titleBreakdown: [...titleMap.entries()]
      .map(([title, count]) => ({ title, count }))
      .sort((a, b) => b.count - a.count),
    recentResults: results.slice(0, 10),
  };
}
