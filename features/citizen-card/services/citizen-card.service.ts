import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
  limit,
} from "firebase/firestore";
import { db } from "@/lib/firebase/client";
import type { CitizenCard } from "@/types";

const COLLECTION = "citizen_cards";

/** Plain JSON-safe card returned from Server Actions to the client. */
export interface SerializableCitizenCard {
  id: string;
  citizenId: string;
  fullName: string;
  birthday: string;
  village: string;
  avatarUrl: string;
  issueDate: string;
  qrCodeUrl: string;
  profileSlug: string;
}

export interface CreateCitizenCardResult {
  card: SerializableCitizenCard;
  profileUrl: string;
}

export async function getCitizenCardBySlug(
  slug: string
): Promise<CitizenCard | null> {
  const q = query(
    collection(db, COLLECTION),
    where("profileSlug", "==", slug),
    limit(1)
  );
  const snapshot = await getDocs(q);

  if (snapshot.empty) return null;

  const docSnap = snapshot.docs[0];
  return { id: docSnap.id, ...docSnap.data() } as CitizenCard;
}

export async function getCitizenCardById(
  id: string
): Promise<CitizenCard | null> {
  const docSnap = await getDoc(doc(db, COLLECTION, id));
  if (!docSnap.exists()) return null;
  return { id: docSnap.id, ...docSnap.data() } as CitizenCard;
}
