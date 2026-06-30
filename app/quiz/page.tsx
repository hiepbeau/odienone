import { createPageMetadata } from "@/lib/seo";
import { QuizPageClient } from "@/features/quiz";

export const metadata = createPageMetadata(
  "Quiz Ô Diên",
  "Bạn là người Ô Diên bao nhiêu phần trăm?"
);

export default function QuizPage() {
  return <QuizPageClient />;
}
