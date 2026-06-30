"use server";

import { FieldValue } from "firebase-admin/firestore";
import { getAdminDb } from "@/lib/firebase/admin";
import { avatarToDataUrl } from "@/lib/image/avatar-storage";
import { CAPSULE_MILESTONE, CAPSULE_MILESTONE_LABEL } from "@/lib/constants";
import {
  capsuleFormSchema,
  ACCEPTED_CAPSULE_IMAGE_TYPES,
  MAX_CAPSULE_PHOTO_SIZE,
} from "@/features/time-capsule/schemas/capsule.schema";

const COLLECTION = "capsules";

export interface SerializableCapsuleResult {
  id: string;
  title: string;
  visibility: "public" | "private";
  isAnonymous: boolean;
  milestone: typeof CAPSULE_MILESTONE;
  milestoneLabel: string;
  status: "pending" | "approved";
}

export async function submitCapsuleAction(
  formData: FormData
): Promise<SerializableCapsuleResult> {
  const parsed = capsuleFormSchema.safeParse({
    authorName: formData.get("authorName") || undefined,
    village: formData.get("village"),
    title: formData.get("title"),
    message: formData.get("message"),
    isAnonymous: formData.get("isAnonymous") === "true",
    visibility: formData.get("visibility"),
  });

  if (!parsed.success) {
    const firstError = parsed.error.issues[0]?.message ?? "Dữ liệu không hợp lệ";
    throw new Error(firstError);
  }

  const photoFile = formData.get("photo");
  let photoUrl: string | undefined;

  if (photoFile instanceof File && photoFile.size > 0) {
    if (!ACCEPTED_CAPSULE_IMAGE_TYPES.includes(photoFile.type)) {
      throw new Error("Ảnh phải là JPG, PNG hoặc WebP");
    }
    if (photoFile.size > MAX_CAPSULE_PHOTO_SIZE) {
      throw new Error("Ảnh không được vượt quá 5MB");
    }
    photoUrl = await avatarToDataUrl(photoFile);
  }

  const data = parsed.data;
  const status = data.visibility === "public" ? "pending" : "approved";
  const authorName = data.isAnonymous
    ? "Ẩn danh"
    : (data.authorName?.trim() ?? "Ẩn danh");

  const db = getAdminDb();
  const capsuleRef = db.collection(COLLECTION).doc();

  await capsuleRef.set({
    id: capsuleRef.id,
    authorName,
    village: data.village,
    title: data.title.trim(),
    message: data.message.trim(),
    photoUrl: photoUrl ?? null,
    isAnonymous: data.isAnonymous,
    visibility: data.visibility,
    status,
    milestone: CAPSULE_MILESTONE,
    createdAt: FieldValue.serverTimestamp(),
  });

  await db.doc("analytics/counters").set(
    { messages: FieldValue.increment(1) },
    { merge: true }
  );

  return {
    id: capsuleRef.id,
    title: data.title.trim(),
    visibility: data.visibility,
    isAnonymous: data.isAnonymous,
    milestone: CAPSULE_MILESTONE,
    milestoneLabel: CAPSULE_MILESTONE_LABEL,
    status,
  };
}

export async function getCapsuleCountAction(): Promise<number> {
  const db = getAdminDb();
  const counter = await db.doc("analytics/counters").get();
  return (counter.data()?.messages as number) ?? 0;
}
