"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Brain, Loader2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useMutation } from "@tanstack/react-query";
import { submitQuizAction } from "@/actions/quiz";
import { QUIZ_QUESTIONS, TOTAL_QUIZ_QUESTIONS } from "../data/questions";
import type { QuizQuestionData } from "../data/questions";
import { CATEGORY_LABELS } from "../lib/scoring";
import { shuffleArray } from "../lib/shuffle-answers";
import { QuizProgressBar, QuizAnswerButton } from "./quiz-progress";
import { QuizResultActions } from "./quiz-result-actions";
import { recordQuizProgress } from "@/lib/wrapped/progress";
import type { QuizSubmission } from "../lib/scoring";
import type { SerializableQuizResult } from "@/actions/quiz";

type QuizPhase = "intro" | "playing" | "result";

export function QuizPageClient() {
  const [phase, setPhase] = useState<QuizPhase>("intro");
  const [displayName, setDisplayName] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<QuizSubmission[]>([]);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [result, setResult] = useState<SerializableQuizResult | null>(null);
  const [sessionQuestions, setSessionQuestions] = useState<QuizQuestionData[]>(
    []
  );

  const submitQuiz = useMutation({
    mutationFn: submitQuizAction,
    onSuccess: (data) => {
      recordQuizProgress({
        displayName: data.displayName,
        score: data.score,
        title: data.title,
        resultId: data.id,
      });
      setResult(data);
      setPhase("result");
      window.scrollTo({ top: 0, behavior: "smooth" });
    },
  });

  const currentQuestion = sessionQuestions[currentIndex];

  function buildSessionQuestions(): QuizQuestionData[] {
    return QUIZ_QUESTIONS.map((question) => ({
      ...question,
      answers: shuffleArray(question.answers),
    }));
  }

  function handleStart() {
    setSessionQuestions(buildSessionQuestions());
    setPhase("playing");
    setCurrentIndex(0);
    setAnswers([]);
    setSelectedAnswer(null);
    setResult(null);
  }

  function handleSelectAnswer(answerId: string) {
    setSelectedAnswer(answerId);
  }

  function handleNext() {
    if (!selectedAnswer || !currentQuestion) return;

    const newAnswers = [
      ...answers,
      { questionId: currentQuestion.id, answerId: selectedAnswer },
    ];
    setAnswers(newAnswers);
    setSelectedAnswer(null);

    if (currentIndex + 1 >= TOTAL_QUIZ_QUESTIONS) {
      submitQuiz.mutate({
        displayName: displayName.trim() || undefined,
        answers: newAnswers,
      });
    } else {
      setCurrentIndex((i) => i + 1);
    }
  }

  function handleRetry() {
    setPhase("intro");
    setSessionQuestions([]);
    setCurrentIndex(0);
    setAnswers([]);
    setSelectedAnswer(null);
    setResult(null);
    submitQuiz.reset();
  }

  if (phase === "intro") {
    return (
      <div className="mx-auto max-w-xl px-4 py-12 sm:py-20 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
            className="text-6xl mb-6"
          >
            🧠
          </motion.div>

          <h1 className="text-3xl sm:text-4xl font-bold leading-tight">
            Bạn là người Ô Diên
            <br />
            <span className="text-gradient">bao nhiêu %?</span>
          </h1>

          <p className="mt-6 text-muted-foreground leading-relaxed">
            {TOTAL_QUIZ_QUESTIONS} câu hỏi vui về ẩm thực, lịch sử, địa danh,
            đời sống và giọng địa phương. Kết quả sẽ tạo poster đẹp để chia sẻ!
          </p>

          <div className="mt-8 text-left max-w-xs mx-auto">
            <Label htmlFor="quiz-name">Tên hiển thị (tuỳ chọn)</Label>
            <Input
              id="quiz-name"
              placeholder="Nguyễn Văn A"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className="mt-2"
              maxLength={40}
            />
          </div>

          <Button size="lg" className="mt-8 gap-2" onClick={handleStart}>
            <Brain size={20} />
            Bắt đầu Quiz
          </Button>
        </motion.div>
      </div>
    );
  }

  if (submitQuiz.isPending) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4">
        <Loader2 className="animate-spin text-primary" size={40} />
        <p className="text-muted-foreground">Đang tính kết quả...</p>
      </div>
    );
  }

  if (phase === "result" && result) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-12 sm:py-16">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center mb-8"
        >
          <Sparkles className="mx-auto text-odien-gold mb-3" size={28} />
          <h2 className="text-2xl font-bold">Kết quả của bạn!</h2>
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
          onRetry={handleRetry}
        />

        {submitQuiz.isError && (
          <p className="text-center text-destructive text-sm mt-4">
            {submitQuiz.error.message}
          </p>
        )}
      </div>
    );
  }

  if (!currentQuestion) {
    return null;
  }

  return (
    <div className="mx-auto max-w-xl px-4 py-12 sm:py-16">
      <QuizProgressBar
        current={currentIndex + 1}
        total={TOTAL_QUIZ_QUESTIONS}
      />

      <AnimatePresence mode="wait">
        <motion.div
          key={currentQuestion.id}
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -40 }}
          transition={{ duration: 0.3 }}
          className="mt-10"
        >
          <div className="text-center mb-8">
            <span className="text-4xl">{currentQuestion.emoji}</span>
            <span className="ml-2 text-xs uppercase tracking-wide text-muted-foreground">
              {CATEGORY_LABELS[currentQuestion.category]}
            </span>
            <h2 className="text-xl sm:text-2xl font-semibold mt-4 leading-snug">
              {currentQuestion.question}
            </h2>
          </div>

          <div className="space-y-3">
            {currentQuestion.answers.map((answer, i) => (
              <QuizAnswerButton
                key={answer.id}
                text={answer.text}
                index={i}
                selected={selectedAnswer === answer.id}
                onSelect={() => handleSelectAnswer(answer.id)}
              />
            ))}
          </div>

          <Button
            className="w-full mt-8"
            size="lg"
            disabled={!selectedAnswer}
            onClick={handleNext}
          >
            {currentIndex + 1 >= TOTAL_QUIZ_QUESTIONS
              ? "Xem kết quả"
              : "Câu tiếp theo"}
          </Button>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
