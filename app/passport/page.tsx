import { createPageMetadata } from "@/lib/seo";
import { PassportPageClient } from "@/features/passport";

export const metadata = createPageMetadata(
  "Hộ Chiếu Ô Diên",
  "Sưu tập tem tại các địa điểm Ô Diên và mở khóa huy hiệu."
);

export default function PassportPage() {
  return <PassportPageClient />;
}
