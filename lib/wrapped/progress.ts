"use client";

export interface WrappedCitizenCardProgress {
  fullName: string;
  avatarUrl: string;
  citizenId: string;
  issueDate: string;
  profileUrl: string;
}

export interface WrappedQuizProgress {
  displayName: string;
  score: number;
  title: string;
  resultId: string;
}

export interface WrappedCapsuleProgress {
  title: string;
  milestoneLabel: string;
  visibility: "public" | "private";
}

export interface WrappedProgressData {
  citizenCard?: WrappedCitizenCardProgress;
  quiz?: WrappedQuizProgress;
  timeCapsule?: WrappedCapsuleProgress;
}

const STORAGE_KEY = "odienone.wrapped.progress.v1";

function readRaw(): WrappedProgressData {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    return JSON.parse(raw) as WrappedProgressData;
  } catch {
    return {};
  }
}

function writeRaw(data: WrappedProgressData) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function getWrappedProgress(): WrappedProgressData {
  return readRaw();
}

export function recordCitizenCardProgress(input: WrappedCitizenCardProgress) {
  const current = readRaw();
  writeRaw({ ...current, citizenCard: input });
}

export function recordQuizProgress(input: WrappedQuizProgress) {
  const current = readRaw();
  writeRaw({ ...current, quiz: input });
}

export function recordTimeCapsuleProgress(input: WrappedCapsuleProgress) {
  const current = readRaw();
  writeRaw({ ...current, timeCapsule: input });
}

export function clearWrappedProgress() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(STORAGE_KEY);
}
