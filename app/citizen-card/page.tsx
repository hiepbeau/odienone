import { createPageMetadata } from "@/lib/seo";
import { CitizenCardPageClient } from "@/features/citizen-card";

export const metadata = createPageMetadata(
  "Thẻ Công Dân",
  "Tạo thẻ công dân Ô Diên độc nhất với ảnh và QR code."
);

export default function CitizenCardPage() {
  return <CitizenCardPageClient />;
}
