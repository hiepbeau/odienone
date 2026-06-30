"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CapsuleVault } from "./capsule-vault";
import { CapsuleFutureBanner } from "./capsule-future-banner";
import { CapsuleForm } from "./capsule-form";
import { useSubmitCapsule } from "../hooks/use-submit-capsule";
import { recordTimeCapsuleProgress } from "@/lib/wrapped/progress";
import type { CapsuleFormValues } from "../schemas/capsule.schema";
import type { SerializableCapsuleResult } from "@/actions/time-capsule";

export function TimeCapsulePageClient() {
  const [result, setResult] = useState<SerializableCapsuleResult | null>(null);
  const [showAnimation, setShowAnimation] = useState(false);
  const submitCapsule = useSubmitCapsule();

  async function handleSubmit(values: CapsuleFormValues, photoFile?: File | null) {
    try {
      const res = await submitCapsule.mutateAsync({
        ...values,
        photoFile,
      });
      setShowAnimation(true);
      setTimeout(() => {
        setResult(res);
        recordTimeCapsuleProgress({
          title: res.title,
          milestoneLabel: res.milestoneLabel,
          visibility: res.visibility,
        });
        setShowAnimation(false);
        window.scrollTo({ top: 0, behavior: "smooth" });
      }, 2200);
    } catch {
      /* error shown via mutation */
    }
  }

  function handleReset() {
    setResult(null);
    submitCapsule.reset();
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:py-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-10"
      >
        <motion.span
          animate={{ y: [0, -8, 0] }}
          transition={{ repeat: Infinity, duration: 3 }}
          className="text-5xl inline-block mb-4"
        >
          ⏳
        </motion.span>
        <h1 className="text-3xl sm:text-4xl font-bold">
          Hộp Thời Gian <span className="text-gradient">Tương Lai</span>
        </h1>
        <p className="mt-4 text-muted-foreground max-w-xl mx-auto leading-relaxed">
          Gửi lời nhắn về phía trước — cho ngày mai, cho thế hệ sau, cho Ô Diên
          rực rỡ hơn mỗi ngày. Thư sẽ được niêm phong cho đến khi cộng đồng cùng
          mở hộp.
        </p>
      </motion.div>

      <div className="mb-10">
        <CapsuleFutureBanner />
      </div>

      <div className="flex justify-center mb-10">
        <CapsuleVault sealed animateLetter={showAnimation} />
      </div>

      <AnimatePresence mode="wait">
        {showAnimation ? (
          <motion.p
            key="animating"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-center text-muted-foreground py-8"
          >
            Đang đưa thư vào hộp thời gian...
          </motion.p>
        ) : result ? (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-card p-8 text-center space-y-4"
          >
            <CheckCircle2 className="mx-auto text-green-500" size={48} />
            <h2 className="text-xl font-bold">Thư đã được niêm phong!</h2>
            <p className="text-muted-foreground">
              &ldquo;{result.title}&rdquo; đã được gửi vào hộp thời gian.
            </p>
            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
              <Clock size={16} />
              Niêm phong cho: {result.milestoneLabel}
            </div>
            {result.visibility === "public" && result.status === "pending" && (
              <p className="text-xs text-odien-gold bg-odien-gold/10 rounded-lg px-3 py-2 inline-block">
                Lời nhắn công khai đang chờ duyệt từ ban quản trị
              </p>
            )}
            {result.visibility === "private" && (
              <p className="text-xs text-muted-foreground">
                Lời nhắn riêng tư — chờ ngày cộng đồng mở hộp trong tương lai
              </p>
            )}
            <Button onClick={handleReset} variant="outline" className="mt-4">
              Gửi thư khác
            </Button>
          </motion.div>
        ) : (
          <motion.div key="form" exit={{ opacity: 0 }}>
            {submitCapsule.isError && (
              <div className="mb-6 p-4 rounded-xl bg-destructive/10 text-destructive text-sm text-center">
                {submitCapsule.error.message}
              </div>
            )}
            <CapsuleForm
              onSubmit={handleSubmit}
              isLoading={submitCapsule.isPending}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
