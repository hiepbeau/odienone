import { createPageMetadata } from "@/lib/seo";
import { WrappedPageClient } from "@/features/wrapped";

export const metadata = createPageMetadata(
  "My Ô Diên 2026",
  "Tổng kết cá nhân phong cách để chia sẻ cùng cộng đồng Ô Diên."
);

export default function WrappedPage() {
  return <WrappedPageClient />;
}
