"use server";

import { FieldValue } from "firebase-admin/firestore";
import { getAdminDb } from "@/lib/firebase/admin";
import { calculateQuizScore, type QuizSubmission } from "@/features/quiz/lib/scoring";
import { QUIZ_QUESTIONS } from "@/features/quiz/data/questions";
import { z } from "zod";

const submitSchema = z.object({
  displayName: z.string().min(1).max(40).optional(),
  answers: z
    .array(
      z.object({
        questionId: z.string(),
        answerId: z.string(),
      })
    )
    .min(QUIZ_QUESTIONS.length),
});

export interface SerializableQuizResult {
  id: string;
  displayName: string;
  score: number;
  title: string;
  answers: QuizSubmission[];
}

export async function submitQuizAction(input: {
  displayName?: string;
  answers: QuizSubmission[];
}): Promise<SerializableQuizResult> {
  const parsed = submitSchema.safeParse(input);
  if (!parsed.success) {
    throw new Error("Vui lòng trả lời đủ tất cả câu hỏi");
  }

  for (const answer of parsed.data.answers) {
    const question = QUIZ_QUESTIONS.find((q) => q.id === answer.questionId);
    if (!question) throw new Error("Câu hỏi không hợp lệ");
    if (!question.answers.some((a) => a.id === answer.answerId)) {
      throw new Error("Câu trả lời không hợp lệ");
    }
  }

  const { score, title } = calculateQuizScore(parsed.data.answers);
  const displayName = parsed.data.displayName?.trim() || "Bạn bè Ô Diên";

  const db = getAdminDb();
  const resultRef = db.collection("quiz_results").doc();

  const resultData = {
    id: resultRef.id,
    displayName,
    answers: parsed.data.answers,
    score,
    title,
    createdAt: FieldValue.serverTimestamp(),
  };

  await resultRef.set(resultData);

  await db.doc("analytics/counters").set(
    { quizResults: FieldValue.increment(1) },
    { merge: true }
  );

  return {
    id: resultRef.id,
    displayName,
    score,
    title,
    answers: parsed.data.answers,
  };
}

export async function getQuizResultAction(
  id: string
): Promise<SerializableQuizResult | null> {
  const db = getAdminDb();
  const doc = await db.collection("quiz_results").doc(id).get();
  if (!doc.exists) return null;

  const data = doc.data()!;
  return {
    id: doc.id,
    displayName: data.displayName as string,
    score: data.score as number,
    title: data.title as string,
    answers: data.answers as QuizSubmission[],
  };
}
