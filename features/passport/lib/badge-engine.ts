import {
  CULTURAL_CATEGORIES,
  PASSPORT_LOCATIONS,
  TOTAL_LOCATIONS,
  type PassportLocationSeed,
} from "../data/locations";
import { PASSPORT_BADGES } from "../data/badges";

export interface BadgeCheckContext {
  visitedLocationIds: string[];
  isPioneer: boolean;
}

export function getCulturalLocationIds(): string[] {
  return PASSPORT_LOCATIONS.filter((l) =>
    CULTURAL_CATEGORIES.includes(l.category)
  ).map((l) => l.id);
}

export function checkEarnedBadges(ctx: BadgeCheckContext): string[] {
  const visited = new Set(ctx.visitedLocationIds);
  const culturalIds = getCulturalLocationIds();

  const earned: string[] = [];

  for (const badge of PASSPORT_BADGES) {
    switch (badge.requirement.type) {
      case "locations":
        if (visited.size >= badge.requirement.value) earned.push(badge.id);
        break;
      case "cultural":
        if (
          culturalIds.length > 0 &&
          culturalIds.every((id) => visited.has(id))
        ) {
          earned.push(badge.id);
        }
        break;
      case "early_adopter":
        if (ctx.isPioneer) earned.push(badge.id);
        break;
      case "all_locations":
        if (visited.size >= TOTAL_LOCATIONS) earned.push(badge.id);
        break;
    }
  }

  return earned;
}

export function getCategoryLabel(category: PassportLocationSeed["category"]): string {
  const labels: Record<PassportLocationSeed["category"], string> = {
    government: "Hành chính",
    education: "Giáo dục",
    culture: "Văn hóa",
    nature: "Thiên nhiên",
    commerce: "Thương mại",
  };
  return labels[category];
}
