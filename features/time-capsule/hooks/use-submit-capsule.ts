"use client";

import { useMutation } from "@tanstack/react-query";
import { submitCapsuleAction } from "@/actions/time-capsule";
import { compressAvatarImage } from "@/features/citizen-card/lib/compress-image";
import type { CapsuleFormValues } from "../schemas/capsule.schema";

export interface SubmitCapsuleInput extends CapsuleFormValues {
  photoFile?: File | null;
}

export function useSubmitCapsule() {
  return useMutation({
    mutationFn: async (input: SubmitCapsuleInput) => {
      const formData = new FormData();
      formData.append("authorName", input.authorName ?? "");
      formData.append("village", input.village);
      formData.append("title", input.title);
      formData.append("message", input.message);
      formData.append("isAnonymous", String(input.isAnonymous));
      formData.append("visibility", input.visibility);

      if (input.photoFile) {
        const compressed = await compressAvatarImage(input.photoFile);
        formData.append("photo", compressed);
      }

      return submitCapsuleAction(formData);
    },
  });
}
