import { getAdminStorage } from "@/lib/firebase/admin";
import {
  ACCEPTED_IMAGE_TYPES,
  MAX_AVATAR_SIZE,
} from "@/features/citizen-card/schemas/citizen-card.schema";

const MAX_DATA_URL_BYTES = 750_000; // Stay under Firestore 1 MB doc limit

function isFirebaseStorageEnabled(): boolean {
  return process.env.USE_FIREBASE_STORAGE === "true";
}

/** Spark plan: store compressed JPEG as data URL in Firestore (no Storage needed). */
export async function avatarToDataUrl(file: File): Promise<string> {
  if (!ACCEPTED_IMAGE_TYPES.includes(file.type) && file.type !== "image/jpeg") {
    throw new Error("Chỉ chấp nhận file JPG, PNG hoặc WebP");
  }
  if (file.size > MAX_AVATAR_SIZE) {
    throw new Error("Ảnh không được vượt quá 5MB");
  }

  const buffer = Buffer.from(await file.arrayBuffer());

  if (buffer.length > MAX_DATA_URL_BYTES) {
    throw new Error(
      "Ảnh vẫn quá lớn sau khi nén. Vui lòng chọn ảnh nhỏ hơn."
    );
  }

  const mime = file.type === "image/png" ? "image/png" : "image/jpeg";
  return `data:${mime};base64,${buffer.toString("base64")}`;
}

/** Blaze plan: upload to Firebase Storage (enable with USE_FIREBASE_STORAGE=true). */
export async function uploadAvatarToStorage(
  file: File,
  cardId: string
): Promise<string> {
  if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
    throw new Error("Chỉ chấp nhận file JPG, PNG hoặc WebP");
  }
  if (file.size > MAX_AVATAR_SIZE) {
    throw new Error("Ảnh không được vượt quá 5MB");
  }

  const ext = file.name.split(".").pop() ?? "jpg";
  const buffer = Buffer.from(await file.arrayBuffer());
  const bucket = getAdminStorage().bucket();
  const filePath = `avatars/${cardId}.${ext}`;
  const gcsFile = bucket.file(filePath);

  await gcsFile.save(buffer, {
    metadata: { contentType: file.type },
  });
  await gcsFile.makePublic();

  return `https://storage.googleapis.com/${bucket.name}/${filePath}`;
}

export async function resolveAvatarUrl(
  file: File,
  cardId: string
): Promise<string> {
  if (isFirebaseStorageEnabled()) {
    try {
      return await uploadAvatarToStorage(file, cardId);
    } catch (err) {
      console.warn("Storage upload failed, falling back to Firestore:", err);
    }
  }
  return avatarToDataUrl(file);
}
