"use client";

import { useQuery } from "@tanstack/react-query";
import { getCitizenCardBySlug } from "../services/citizen-card.service";

export function useCitizenCardBySlug(slug: string) {
  return useQuery({
    queryKey: ["citizen-card", slug],
    queryFn: () => getCitizenCardBySlug(slug),
    enabled: !!slug,
  });
}
