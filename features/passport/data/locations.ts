import type { LocationCategory } from "@/types";

export interface PassportLocationSeed {
  id: string;
  name: string;
  nameVi: string;
  description: string;
  category: LocationCategory;
  qrSecret: string;
  order: number;
  icon: string;
}

export const PASSPORT_LOCATIONS: PassportLocationSeed[] = [
  {
    id: "ubnd",
    name: "UBND Xã Ô Diên",
    nameVi: "UBND Xã Ô Diên",
    description: "Trụ sở chính quyền xã — trái tim hành chính của Ô Diên.",
    category: "government",
    qrSecret: "ODIEN-UBND-2026",
    order: 1,
    icon: "🏛️",
  },
  {
    id: "tieu-hoc",
    name: "Trường Tiểu Học Ô Diên",
    nameVi: "Trường Tiểu Học Ô Diên",
    description: "Nơi thế hệ nhỏ học chữ, lớn lên cùng quê hương.",
    category: "education",
    qrSecret: "ODIEN-TH-2026",
    order: 2,
    icon: "🏫",
  },
  {
    id: "thcs",
    name: "Trường THCS Ô Diên",
    nameVi: "Trường THCS Ô Diên",
    description: "Tuổi học trò đầy kỷ niệm của tuổi teen Ô Diên.",
    category: "education",
    qrSecret: "ODIEN-THCS-2026",
    order: 3,
    icon: "📚",
  },
  {
    id: "chua",
    name: "Chùa Ô Diên",
    nameVi: "Chùa Ô Diên",
    description: "Ngôi chùa cổ — nơi lắng đọng tâm hồn thanh bình.",
    category: "culture",
    qrSecret: "ODIEN-CHUA-2026",
    order: 4,
    icon: "🛕",
  },
  {
    id: "dinh-lang",
    name: "Đình Làng Ô Diên",
    nameVi: "Đình Làng Ô Diên",
    description: "Đình làng — chứng nhân lễ hội và truyền thống.",
    category: "culture",
    qrSecret: "ODIEN-DINH-2026",
    order: 5,
    icon: "⛩️",
  },
  {
    id: "cho",
    name: "Chợ Ô Diên",
    nameVi: "Chợ Ô Diên",
    description: "Chợ quê sôi động — đủ thứ từ rau vườn đến tiếng cười.",
    category: "commerce",
    qrSecret: "ODIEN-CHO-2026",
    order: 6,
    icon: "🏪",
  },
  {
    id: "tuong-niem",
    name: "Khu Tưởng Niệm",
    nameVi: "Khu Tưởng Niệm",
    description: "Nơi tưởng nhớ những người đã cống hiến cho quê hương.",
    category: "culture",
    qrSecret: "ODIEN-TN-2026",
    order: 7,
    icon: "🕯️",
  },
  {
    id: "cong-vien",
    name: "Công Viên Ô Diên",
    nameVi: "Công Viên Ô Diên",
    description: "Không gian xanh để dạo chơi và hóng mát chiều.",
    category: "nature",
    qrSecret: "ODIEN-CV-2026",
    order: 8,
    icon: "🌳",
  },
  {
    id: "nha-van-hoa",
    name: "Nhà Văn Hóa",
    nameVi: "Nhà Văn Hóa",
    description: "Sân khấu của các đêm văn nghệ và hội thi.",
    category: "culture",
    qrSecret: "ODIEN-NVH-2026",
    order: 9,
    icon: "🎭",
  },
  {
    id: "thu-vien",
    name: "Thư Viện Cộng Đồng",
    nameVi: "Thư Viện Cộng Đồng",
    description: "Góc đọc sách nhỏ nhưng đầy ước mơ.",
    category: "education",
    qrSecret: "ODIEN-TV-2026",
    order: 10,
    icon: "📖",
  },
  {
    id: "san-bong",
    name: "Sân Bóng Đá",
    nameVi: "Sân Bóng Đá",
    description: "Chiến trường của những trận cầu địa phương căng thẳng.",
    category: "nature",
    qrSecret: "ODIEN-SB-2026",
    order: 11,
    icon: "⚽",
  },
  {
    id: "buu-dien",
    name: "Bưu Điện Văn Hóa Xã",
    nameVi: "Bưu Điện Văn Hóa Xã",
    description: "Điểm hẹn thư từ và tin tức làng xóm.",
    category: "government",
    qrSecret: "ODIEN-BD-2026",
    order: 12,
    icon: "📮",
  },
  {
    id: "tram-y-te",
    name: "Trạm Y Tế",
    nameVi: "Trạm Y Tế",
    description: "Chăm sóc sức khỏe cộng đồng ngày đêm.",
    category: "government",
    qrSecret: "ODIEN-TYT-2026",
    order: 13,
    icon: "🏥",
  },
  {
    id: "htx",
    name: "Hợp Tác Xã",
    nameVi: "Hợp Tác Xã",
    description: "Trung tâm kinh tế tập thể của xã.",
    category: "commerce",
    qrSecret: "ODIEN-HTX-2026",
    order: 14,
    icon: "🤝",
  },
  {
    id: "ao-lang",
    name: "Ao Làng",
    nameVi: "Ao Làng",
    description: "Ao nước trong veo — gắn liền tuổi thơ bắt cá.",
    category: "nature",
    qrSecret: "ODIEN-AO-2026",
    order: 15,
    icon: "🐟",
  },
  {
    id: "cay-da",
    name: "Cây Đa Đầu Làng",
    nameVi: "Cây Đa Đầu Làng",
    description: "Biểu tượng làng — bóng mát của bao thế hệ.",
    category: "culture",
    qrSecret: "ODIEN-DA-2026",
    order: 16,
    icon: "🌳",
  },
  {
    id: "mieu",
    name: "Miếu Thờ",
    nameVi: "Miếu Thờ",
    description: "Nơi thờ cúng tổ tiên và thành hoàng làng.",
    category: "culture",
    qrSecret: "ODIEN-MIEU-2026",
    order: 17,
    icon: "🏮",
  },
  {
    id: "khu-dan-cu",
    name: "Khu Dân Cư Trung Tâm",
    nameVi: "Khu Dân Cư Trung Tâm",
    description: "Trái tim nhịp sống đô thị nông thôn mới.",
    category: "commerce",
    qrSecret: "ODIEN-KDC-2026",
    order: 18,
    icon: "🏘️",
  },
  {
    id: "cong-chao",
    name: "Cổng Chào Ô Diên",
    nameVi: "Cổng Chào Ô Diên",
    description: "Cổng chào — điểm check-in đầu tiên của mọi khách.",
    category: "culture",
    qrSecret: "ODIEN-CC-2026",
    order: 19,
    icon: "🚪",
  },
  {
    id: "quang-truong",
    name: "Quảng Trường 01/07",
    nameVi: "Quảng Trường 01/07",
    description: "Nơi diễn ra lễ kỷ niệm 1 năm thành lập xã.",
    category: "culture",
    qrSecret: "ODIEN-QT-2026",
    order: 20,
    icon: "🎉",
  },
];

export const TOTAL_LOCATIONS = PASSPORT_LOCATIONS.length;

export const CULTURAL_CATEGORIES: LocationCategory[] = ["culture", "government"];

export function getLocationById(id: string): PassportLocationSeed | undefined {
  return PASSPORT_LOCATIONS.find((l) => l.id === id);
}

export function getScanUrl(locationId: string): string {
  const loc = getLocationById(locationId);
  if (!loc) return "";
  const base = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
  return `${base}/passport/scan/${locationId}?t=${loc.qrSecret}`;
}
