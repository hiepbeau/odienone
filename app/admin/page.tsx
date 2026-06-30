import { createPageMetadata } from "@/lib/seo";
import { AdminPageClient } from "@/features/admin";

export const metadata = createPageMetadata(
  "Bảng Quản Trị",
  "Quản lý nội dung và thống kê Ô Diên One.",
  { robots: { index: false, follow: false } }
);

export default function AdminPage() {
  return <AdminPageClient />;
}
