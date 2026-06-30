export const APP_NAME = "Ô Diên One";
export const APP_TAGLINE = "Nơi lưu giữ ký ức và kết nối cộng đồng.";
export const ANNIVERSARY_DATE = "01/07/2026";
export const FOUNDING_DATE = "01/07/2025";
/** Time Capsule opens toward the future — no fixed calendar date. */
export const CAPSULE_MILESTONE = "future" as const;
export const CAPSULE_MILESTONE_LABEL = "Tương lai";
export const CAPSULE_SEALED_MESSAGE =
  "Lời nhắn được niêm phong — chờ ngày hộp mở trong tương lai";
export const ISSUE_DATE = "01/07/2026";

export const NAV_LINKS = [
  { href: "/citizen-card", label: "Thẻ Công Dân", icon: "IdCard" },
  { href: "/quiz", label: "Quiz Ô Diên", icon: "Brain" },
  { href: "/time-capsule", label: "Hộp Thời Gian", icon: "Clock" },
  { href: "/wrapped", label: "My Ô Diên 2026", icon: "Sparkles" },
] as const;

export const BADGE_REQUIREMENTS = {
  explorer: { type: "locations", value: 5 },
  historian: { type: "cultural", value: 5 },
  pioneer: { type: "early_adopter", value: 100 },
  first_anniversary: { type: "all_locations", value: 20 },
} as const;

export const QUIZ_TITLES = [
  { min: 90, title: "Ô Diên Chính Hiệu" },
  { min: 75, title: "Người Con Quê Hương" },
  { min: 60, title: "Người Bạn Của Ô Diên" },
  { min: 40, title: "Khách Tham Quan" },
  { min: 0, title: "Người Mới Đến" },
] as const;

export function getQuizTitle(score: number): string {
  return (
    QUIZ_TITLES.find((t) => score >= t.min)?.title ?? "Người Mới Đến"
  );
}
