import { getQuizTitle } from "@/lib/constants";
import { getAnswerScore } from "../data/questions";

export interface QuizSubmission {
  questionId: string;
  answerId: string;
}

export interface QuizScoreResult {
  score: number;
  title: string;
}

export function calculateQuizScore(answers: QuizSubmission[]): QuizScoreResult {
  if (answers.length === 0) {
    return { score: 0, title: getQuizTitle(0) };
  }

  const total = answers.reduce(
    (sum, a) => sum + getAnswerScore(a.questionId, a.answerId),
    0
  );
  const score = Math.round(total / answers.length);
  const title = getQuizTitle(score);

  return { score, title };
}

export const CATEGORY_LABELS: Record<string, string> = {
  food: "Ẩm thực",
  history: "Lịch sử",
  landmarks: "Địa danh",
  daily: "Đời sống",
  dialect: "Giọng địa phương",
  festival: "Lễ hội",
};
