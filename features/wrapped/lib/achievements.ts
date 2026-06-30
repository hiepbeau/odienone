import type { WrappedProgressData } from "@/lib/wrapped/progress";
import type { WrappedAchievement } from "../types";

export function getWrappedAchievements(
  progress: WrappedProgressData
): WrappedAchievement[] {
  const achievements: WrappedAchievement[] = [];

  if (progress.citizenCard) {
    achievements.push({
      id: "founding-citizen",
      label: "Công Dân Khai Quốc",
      description: "Bạn đã có thẻ, chính thức nhập hộ khẩu Ô Diên One.",
    });
  }

  if (progress.timeCapsule) {
    achievements.push({
      id: "dreamer",
      label: "Nhà Mơ Mộng Có Kế Hoạch",
      description: "Đã gửi thư cho tương lai, quá là có tầm nhìn luôn.",
    });
  }

  if (progress.quiz) {
    achievements.push({
      id: "historian",
      label: "Sử Gia Vỉa Hè",
      description: "Đã hoàn thành quiz DNA Ô Diên, kể chuyện quê chuẩn bài.",
    });
  }

  if ((progress.quiz?.score ?? 0) >= 90) {
    achievements.push({
      id: "odien-legend",
      label: "Huyền Thoại Ô Diên",
      description: "Điểm quiz từ 90%+, đậm chất người nhà chính hiệu.",
    });
  }

  if (progress.citizenCard && progress.quiz && progress.timeCapsule) {
    achievements.push({
      id: "wrapped-2026",
      label: "Đủ Combo 2026",
      description: "Bạn đã mở khóa trọn bộ My Ô Diên 2026. Quá đỉnh!",
    });
  }

  return achievements;
}
