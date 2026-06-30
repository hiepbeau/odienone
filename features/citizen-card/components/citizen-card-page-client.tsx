"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, AlertCircle } from "lucide-react";
import { CitizenCardForm } from "./citizen-card-form";
import { CardShareActions } from "./card-share-actions";
import { useCreateCitizenCard } from "../hooks/use-create-citizen-card";
import { recordCitizenCardProgress } from "@/lib/wrapped/progress";
import type { CitizenCardFormValues } from "../schemas/citizen-card.schema";
import type { CreateCitizenCardResult } from "../services/citizen-card.service";

export function CitizenCardPageClient() {
  const [result, setResult] = useState<CreateCitizenCardResult | null>(null);
  const [error, setError] = useState<string>("");
  const createCard = useCreateCitizenCard();

  async function handleSubmit(values: CitizenCardFormValues, avatarFile: File) {
    setError("");
    try {
      const res = await createCard.mutateAsync({
        ...values,
        avatarFile,
      });
      setResult(res);
      recordCitizenCardProgress({
        fullName: res.card.fullName,
        avatarUrl: res.card.avatarUrl,
        citizenId: res.card.citizenId,
        issueDate: res.card.issueDate,
        profileSlug: res.card.profileSlug,
        profileUrl: res.profileUrl,
      });
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Không thể tạo thẻ. Vui lòng thử lại.";
      setError(message);
    }
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:py-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12"
      >
        <h1 className="text-3xl sm:text-4xl font-bold">
          Tạo <span className="text-gradient">Thẻ Công Dân</span>
        </h1>
        <p className="mt-4 text-muted-foreground max-w-xl mx-auto">
          Trở thành công dân chính thức của Ô Diên One. Thẻ điện tử độc nhất
          với số định danh và mã QR dẫn đến hồ sơ công khai của bạn.
        </p>
      </motion.div>

      <AnimatePresence mode="wait">
        {result ? (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-8"
          >
            <div className="flex items-center justify-center gap-2 text-green-600">
              <CheckCircle2 size={24} />
              <span className="font-medium">
                Thẻ công dân đã được tạo thành công!
              </span>
            </div>

            <CardShareActions
              data={{
                fullName: result.card.fullName,
                birthday: result.card.birthday,
                village: result.card.village,
                avatarUrl: result.card.avatarUrl,
                citizenId: result.card.citizenId,
                issueDate: result.card.issueDate,
                qrCodeUrl: result.card.qrCodeUrl,
              }}
              profileSlug={result.card.profileSlug}
              profileUrl={result.profileUrl}
            />

            <div className="text-center">
              <button
                onClick={() => setResult(null)}
                className="text-sm text-primary hover:underline"
              >
                Tạo thẻ mới
              </button>
            </div>
          </motion.div>
        ) : (
          <motion.div key="form" exit={{ opacity: 0 }}>
            {error && (
              <div className="mb-6 flex items-center gap-2 p-4 rounded-xl bg-destructive/10 text-destructive text-sm">
                <AlertCircle size={18} />
                {error}
              </div>
            )}
            <CitizenCardForm
              onSubmit={handleSubmit}
              isLoading={createCard.isPending}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
