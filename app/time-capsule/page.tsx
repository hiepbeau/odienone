import { createPageMetadata } from "@/lib/seo";
import { TimeCapsulePageClient } from "@/features/time-capsule";

export const metadata = createPageMetadata(
  "Hộp Thời Gian",
  "Gửi lời nhắn niêm phong cho tương lai Ô Diên."
);

export default function TimeCapsulePage() {
  return <TimeCapsulePageClient />;
}
