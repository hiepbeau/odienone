"use server";

import { FieldValue } from "firebase-admin/firestore";
import { getAdminAuth, getAdminDb } from "@/lib/firebase/admin";
import { getLocationById, PASSPORT_LOCATIONS } from "@/features/passport/data/locations";
import { getBadgeById } from "@/features/passport/data/badges";
import { checkEarnedBadges } from "@/features/passport/lib/badge-engine";

async function verifyUser(idToken: string): Promise<{
  uid: string;
  displayName: string;
}> {
  const decoded = await getAdminAuth().verifyIdToken(idToken);
  const db = getAdminDb();
  const profileRef = db.collection("profiles").doc(decoded.uid);
  const profileDoc = await profileRef.get();

  let displayName =
    profileDoc.data()?.displayName ??
    decoded.name ??
    `Khách ${decoded.uid.slice(0, 6)}`;

  if (!profileDoc.exists) {
    await profileRef.set({
      uid: decoded.uid,
      displayName,
      role: "user",
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    });
  }

  return { uid: decoded.uid, displayName };
}

export interface PassportScanRecord {
  locationId: string;
  scannedAt: string;
}

export interface PassportBadgeRecord {
  badgeId: string;
  earnedAt: string;
}

export interface PassportDashboard {
  displayName: string;
  scans: PassportScanRecord[];
  badges: PassportBadgeRecord[];
  stampCount: number;
  totalLocations: number;
}

export interface LeaderboardEntry {
  userId: string;
  displayName: string;
  stampCount: number;
  rank: number;
}

export interface ScanResult {
  success: boolean;
  alreadyVisited: boolean;
  locationName: string;
  locationIcon: string;
  stampCount: number;
  totalLocations: number;
  newBadges: string[];
  message: string;
}

export async function getPassportDashboardAction(
  idToken: string
): Promise<PassportDashboard> {
  const { uid, displayName } = await verifyUser(idToken);
  const db = getAdminDb();

  const scansSnap = await db
    .collection("passport_scans")
    .where("userId", "==", uid)
    .get();

  const scans: PassportScanRecord[] = scansSnap.docs.map((doc) => ({
    locationId: doc.data().locationId as string,
    scannedAt:
      doc.data().scannedAt?.toDate?.()?.toISOString() ??
      new Date().toISOString(),
  }));

  const badgesSnap = await db
    .collection("user_badges")
    .where("userId", "==", uid)
    .get();

  const badges: PassportBadgeRecord[] = badgesSnap.docs.map((doc) => ({
    badgeId: doc.data().badgeId as string,
    earnedAt:
      doc.data().earnedAt?.toDate?.()?.toISOString() ??
      new Date().toISOString(),
  }));

  return {
    displayName,
    scans,
    badges,
    stampCount: scans.length,
    totalLocations: PASSPORT_LOCATIONS.length,
  };
}

export async function getLeaderboardAction(
  limit = 10
): Promise<LeaderboardEntry[]> {
  const db = getAdminDb();
  const snap = await db
    .collection("passport_leaderboard")
    .orderBy("stampCount", "desc")
    .limit(limit)
    .get();

  return snap.docs.map((doc, index) => ({
    userId: doc.id,
    displayName: (doc.data().displayName as string) ?? "Khách",
    stampCount: (doc.data().stampCount as number) ?? 0,
    rank: index + 1,
  }));
}

export async function updatePassportDisplayNameAction(
  idToken: string,
  name: string
): Promise<{ displayName: string }> {
  const trimmed = name.trim();
  if (trimmed.length < 2 || trimmed.length > 40) {
    throw new Error("Tên hiển thị phải từ 2–40 ký tự");
  }

  const { uid, displayName: _ } = await verifyUser(idToken);
  const db = getAdminDb();

  await db.collection("profiles").doc(uid).set(
    {
      displayName: trimmed,
      updatedAt: FieldValue.serverTimestamp(),
    },
    { merge: true }
  );

  await db.collection("passport_leaderboard").doc(uid).set(
    { displayName: trimmed },
    { merge: true }
  );

  return { displayName: trimmed };
}

export async function recordPassportScanAction(
  idToken: string,
  locationId: string,
  token: string
): Promise<ScanResult> {
  const location = getLocationById(locationId);

  if (!location || !location.qrSecret) {
    throw new Error("Địa điểm không hợp lệ");
  }

  if (token !== location.qrSecret) {
    throw new Error("Mã QR không hợp lệ hoặc đã hết hạn");
  }

  const { uid, displayName } = await verifyUser(idToken);
  const db = getAdminDb();

  const existingScan = await db
    .collection("passport_scans")
    .where("userId", "==", uid)
    .where("locationId", "==", locationId)
    .limit(1)
    .get();

  if (!existingScan.empty) {
    const allScans = await db
      .collection("passport_scans")
      .where("userId", "==", uid)
      .get();

    return {
      success: true,
      alreadyVisited: true,
      locationName: location.nameVi,
      locationIcon: location.icon,
      stampCount: allScans.size,
      totalLocations: PASSPORT_LOCATIONS.length,
      newBadges: [],
      message: `Bạn đã sưu tập tem tại ${location.nameVi} rồi!`,
    };
  }

  const countersRef = db.doc("analytics/counters");
  let isPioneer = false;

  await db.runTransaction(async (transaction) => {
    const countersDoc = await transaction.get(countersRef);
    const holders = countersDoc.exists
      ? (countersDoc.data()?.passportHolders ?? 0)
      : 0;

    const userHolderRef = db.collection("passport_holders").doc(uid);
    const userHolderDoc = await transaction.get(userHolderRef);

    if (!userHolderDoc.exists) {
      isPioneer = holders < 100;
      transaction.set(userHolderRef, { userId: uid, joinedAt: FieldValue.serverTimestamp() });
      transaction.set(
        countersRef,
        { passportHolders: FieldValue.increment(1) },
        { merge: true }
      );
    }
  });

  const scanRef = db.collection("passport_scans").doc();
  await scanRef.set({
    id: scanRef.id,
    userId: uid,
    locationId,
    scannedAt: FieldValue.serverTimestamp(),
  });

  const allScansSnap = await db
    .collection("passport_scans")
    .where("userId", "==", uid)
    .get();

  const visitedIds = allScansSnap.docs.map((d) => d.data().locationId as string);
  const earnedBadgeIds = checkEarnedBadges({ visitedLocationIds: visitedIds, isPioneer });

  const existingBadgesSnap = await db
    .collection("user_badges")
    .where("userId", "==", uid)
    .get();

  const existingBadgeIds = new Set(
    existingBadgesSnap.docs.map((d) => d.data().badgeId as string)
  );

  const newBadges: string[] = [];

  for (const badgeId of earnedBadgeIds) {
    if (!existingBadgeIds.has(badgeId)) {
      const badgeRef = db.collection("user_badges").doc();
      await badgeRef.set({
        id: badgeRef.id,
        userId: uid,
        badgeId,
        earnedAt: FieldValue.serverTimestamp(),
      });
      newBadges.push(badgeId);
    }
  }

  await db.collection("passport_leaderboard").doc(uid).set(
    {
      userId: uid,
      displayName,
      stampCount: visitedIds.length,
      lastScanAt: FieldValue.serverTimestamp(),
    },
    { merge: true }
  );

  const badgeNames = newBadges
    .map((id) => getBadgeById(id)?.nameVi)
    .filter(Boolean)
    .join(", ");

  return {
    success: true,
    alreadyVisited: false,
    locationName: location.nameVi,
    locationIcon: location.icon,
    stampCount: visitedIds.length,
    totalLocations: PASSPORT_LOCATIONS.length,
    newBadges,
    message: badgeNames
      ? `Chúc mừng! Bạn mở khóa huy hiệu: ${badgeNames}`
      : `Đã sưu tập tem tại ${location.nameVi}!`,
  };
}
