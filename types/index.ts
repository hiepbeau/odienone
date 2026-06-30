import { Timestamp } from "firebase/firestore";

export type UserRole = "user" | "admin";

export interface Profile {
  uid: string;
  displayName: string;
  email?: string;
  village?: string;
  avatarUrl?: string;
  role: UserRole;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface CitizenCard {
  id: string;
  userId?: string;
  citizenId: string;
  fullName: string;
  birthday: string;
  village: string;
  avatarUrl: string;
  issueDate: string;
  qrCodeUrl: string;
  profileSlug: string;
  createdAt: Timestamp;
}

export type LocationCategory =
  | "government"
  | "education"
  | "culture"
  | "nature"
  | "commerce";

export interface PassportLocation {
  id: string;
  name: string;
  nameVi: string;
  description: string;
  category: LocationCategory;
  qrSecret: string;
  badgeId?: string;
  order: number;
  isActive: boolean;
  coordinates?: { lat: number; lng: number };
}

export interface PassportScan {
  id: string;
  userId: string;
  locationId: string;
  scannedAt: Timestamp;
}

export type QuizCategory =
  | "food"
  | "history"
  | "landmarks"
  | "daily"
  | "dialect"
  | "festival";

export interface QuizQuestion {
  id: string;
  question: string;
  category: QuizCategory;
  order: number;
  isActive: boolean;
}

export interface QuizAnswer {
  id: string;
  questionId: string;
  text: string;
  score: number;
  order: number;
}

export interface QuizResult {
  id: string;
  userId?: string;
  displayName?: string;
  answers: { questionId: string; answerId: string }[];
  score: number;
  title: string;
  posterUrl?: string;
  createdAt: Timestamp;
}

export type CapsuleVisibility = "public" | "private";
export type CapsuleStatus = "pending" | "approved" | "rejected";

export interface Capsule {
  id: string;
  userId?: string;
  authorName: string;
  village: string;
  title: string;
  message: string;
  photoUrl?: string;
  isAnonymous: boolean;
  visibility: CapsuleVisibility;
  status: CapsuleStatus;
  /** "future" = no fixed open date; opens when community milestone is reached */
  milestone: "future" | string;
  /** @deprecated legacy documents may use unlockDate */
  unlockDate?: string;
  createdAt: Timestamp;
}

export interface Badge {
  id: string;
  name: string;
  nameVi: string;
  description: string;
  icon: string;
  requirement: { type: string; value: number };
}

export interface UserBadge {
  id: string;
  userId: string;
  badgeId: string;
  earnedAt: Timestamp;
}

export interface AnalyticsSummary {
  citizenCards: number;
  messages: number;
  passportLocations: number;
  quizResults: number;
  lastUpdated: Timestamp;
}

export interface Village {
  id: string;
  name: string;
}
