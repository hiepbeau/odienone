export interface BadgeDefinition {
  id: string;
  name: string;
  nameVi: string;
  description: string;
  icon: string;
  requirement: { type: string; value: number };
}

export const PASSPORT_BADGES: BadgeDefinition[] = [
  {
    id: "explorer",
    name: "Explorer",
    nameVi: "Nhà Thám Hiểm",
    description: "Đã ghé thăm 5 địa điểm trở lên.",
    icon: "🧭",
    requirement: { type: "locations", value: 5 },
  },
  {
    id: "historian",
    name: "Historian",
    nameVi: "Sử Gia Ô Diên",
    description: "Đã khám phá tất cả địa điểm văn hóa & lịch sử.",
    icon: "📜",
    requirement: { type: "cultural", value: 10 },
  },
  {
    id: "pioneer",
    name: "Pioneer",
    nameVi: "Người Tiên Phong",
    description: "Thuộc 100 hộ chiếu đầu tiên của Ô Diên One.",
    icon: "🚀",
    requirement: { type: "early_adopter", value: 100 },
  },
  {
    id: "first_anniversary",
    name: "First Anniversary",
    nameVi: "Kỷ Niệm 1 Năm",
    description: "Đã sưu tập đủ tem tại cả 20 địa điểm.",
    icon: "🏆",
    requirement: { type: "all_locations", value: 20 },
  },
];

export function getBadgeById(id: string): BadgeDefinition | undefined {
  return PASSPORT_BADGES.find((b) => b.id === id);
}
