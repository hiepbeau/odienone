"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import { getQuizResultAction } from "@/actions/quiz";
import { QuizResultActions } from "./quiz-result-actions";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface QuizResultPageClientProps {
  resultId: string;
}

export function QuizResultPageClient({ resultId }: QuizResultPageClientProps) {
  const [result, setResult] = useState<Awaited<
    ReturnType<typeof getQuizResultAction>
  > | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    getQuizResultAction(resultId)
      .then((data) => {
        if (!data) setError(true);
        else setResult(data);
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [resultId]);

  if (loading) {
    return (
      <div className="flex justify-center min-h-[50vh] items-center">
        <Loader2 className="animate-spin text-primary" size={32} />
      </div>
    );
  }

  if (error || !result) {
    return (
      <div className="text-center py-20 px-4">
        <p className="text-muted-foreground mb-4">Không tìm thấy kết quả quiz.</p>
        <Button asChild>
          <Link href="/quiz">Làm Quiz</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-12 sm:py-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <h1 className="text-2xl font-bold">{result.displayName}</h1>
        <p className="text-muted-foreground mt-2">
          {result.score}% — {result.title}
        </p>
      </motion.div>

      <QuizResultActions
        data={{
          displayName: result.displayName,
          score: result.score,
          title: result.title,
        }}
        resultId={result.id}
      />

      <div className="text-center mt-8">
        <Button asChild variant="outline">
          <Link href="/quiz">Làm Quiz của bạn</Link>
        </Button>
      </div>
    </div>
  );
}
