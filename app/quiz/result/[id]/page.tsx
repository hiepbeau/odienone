import { createPageMetadata } from "@/lib/seo";
import { QuizResultPageClient } from "@/features/quiz";

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { id } = await params;
  return createPageMetadata(
    "Kết quả Quiz",
    `Xem kết quả quiz Ô Diên — ${id}`
  );
}

export default async function QuizResultPage({ params }: PageProps) {
  const { id } = await params;
  return <QuizResultPageClient resultId={id} />;
}
