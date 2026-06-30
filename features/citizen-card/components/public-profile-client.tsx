"use client";

import { motion } from "framer-motion";
import { Loader2, UserX } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CitizenCardDisplay } from "./citizen-card-display";
import { CardShareActions } from "./card-share-actions";
import { useCitizenCardBySlug } from "../hooks/use-citizen-card";

interface PublicProfileClientProps {
  slug: string;
}

export function PublicProfileClient({ slug }: PublicProfileClientProps) {
  const { data: card, isLoading, error } = useCitizenCardBySlug(slug);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <Loader2 className="animate-spin text-primary" size={32} />
      </div>
    );
  }

  if (error || !card) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-col items-center justify-center min-h-[50vh] gap-4"
      >
        <UserX className="text-muted-foreground" size={48} />
        <h2 className="text-xl font-semibold">Không tìm thấy thẻ công dân</h2>
        <p className="text-muted-foreground text-sm">
          Thẻ này có thể đã bị xóa hoặc đường dẫn không đúng.
        </p>
        <Button asChild>
          <Link href="/citizen-card">Tạo thẻ mới</Link>
        </Button>
      </motion.div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:py-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-10"
      >
        <h1 className="text-2xl sm:text-3xl font-bold">{card.fullName}</h1>
        <p className="text-muted-foreground mt-2">
          Công dân Ô Diên — {card.citizenId}
        </p>
      </motion.div>

      <CardShareActions
        data={{
          fullName: card.fullName,
          birthday: card.birthday,
          village: card.village,
          avatarUrl: card.avatarUrl,
          citizenId: card.citizenId,
          issueDate: card.issueDate,
          qrCodeUrl: card.qrCodeUrl,
        }}
        profileSlug={slug}
      />
    </div>
  );
}
