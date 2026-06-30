"use client";

import { useMutation } from "@tanstack/react-query";
import { createCitizenCardAction } from "@/actions/citizen-card";
import { compressAvatarImage } from "../lib/compress-image";
import type { CreateCitizenCardResult } from "../services/citizen-card.service";
import type { CitizenCardFormValues } from "../schemas/citizen-card.schema";

export interface CreateCitizenCardInput extends CitizenCardFormValues {
  avatarFile: File;
}

export function useCreateCitizenCard() {
  return useMutation<CreateCitizenCardResult, Error, CreateCitizenCardInput>({
    mutationFn: async (input) => {
      const compressed = await compressAvatarImage(input.avatarFile);

      const formData = new FormData();
      formData.append("fullName", input.fullName);
      formData.append("birthday", input.birthday);
      formData.append("village", input.village);
      formData.append("avatar", compressed);

      return createCitizenCardAction(formData);
    },
  });
}
