"use server";

import { FieldValue, type Firestore } from "firebase-admin/firestore";
import QRCode from "qrcode";
import { getAdminDb } from "@/lib/firebase/admin";
import { resolveAvatarUrl } from "@/lib/image/avatar-storage";
import { generateCitizenId, generateSlug } from "@/lib/utils";
import { ISSUE_DATE } from "@/lib/constants";
import { citizenCardFormSchema } from "@/features/citizen-card/schemas/citizen-card.schema";
import type { CreateCitizenCardResult } from "@/features/citizen-card/services/citizen-card.service";

const COLLECTION = "citizen_cards";
const COUNTERS_DOC = "analytics/counters";

function getAppUrl(): string {
  return process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
}

async function getNextCitizenSequence(db: Firestore): Promise<number> {
  const counterRef = db.doc(COUNTERS_DOC);

  return db.runTransaction(async (transaction) => {
    const counterDoc = await transaction.get(counterRef);
    const current = counterDoc.exists
      ? (counterDoc.data()?.citizenCardSequence ?? 0)
      : 0;
    const next = current + 1;

    transaction.set(
      counterRef,
      {
        citizenCardSequence: next,
        citizenCards: FieldValue.increment(1),
      },
      { merge: true }
    );

    return next;
  });
}

async function generateQrDataUrl(profileUrl: string): Promise<string> {
  return QRCode.toDataURL(profileUrl, {
    width: 200,
    margin: 1,
    color: { dark: "#1A0A0C", light: "#FFFFFF" },
  });
}

export async function createCitizenCardAction(
  formData: FormData
): Promise<CreateCitizenCardResult> {
  const parsed = citizenCardFormSchema.safeParse({
    fullName: formData.get("fullName"),
    birthday: formData.get("birthday"),
    village: formData.get("village"),
  });

  if (!parsed.success) {
    const firstError =
      parsed.error.issues[0]?.message ?? "Dữ liệu không hợp lệ";
    throw new Error(firstError);
  }

  const avatarFile = formData.get("avatar");
  if (!(avatarFile instanceof File) || avatarFile.size === 0) {
    throw new Error("Vui lòng tải lên ảnh đại diện");
  }

  const db = getAdminDb();
  const sequence = await getNextCitizenSequence(db);
  const citizenId = generateCitizenId(sequence);
  const profileSlug = generateSlug(parsed.data.fullName);
  const cardRef = db.collection(COLLECTION).doc();

  const avatarUrl = await resolveAvatarUrl(avatarFile, cardRef.id);
  const profileUrl = `${getAppUrl()}/citizen-card/${profileSlug}`;
  const qrCodeUrl = await generateQrDataUrl(profileUrl);

  const cardResponse: CreateCitizenCardResult["card"] = {
    id: cardRef.id,
    citizenId,
    fullName: parsed.data.fullName.trim(),
    birthday: parsed.data.birthday,
    village: parsed.data.village,
    avatarUrl,
    issueDate: ISSUE_DATE,
    qrCodeUrl,
    profileSlug,
  };

  await cardRef.set({
    ...cardResponse,
    createdAt: FieldValue.serverTimestamp(),
  });

  return {
    card: cardResponse,
    profileUrl,
  };
}
