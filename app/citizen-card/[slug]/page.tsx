import { createPageMetadata } from "@/lib/seo";
import { PublicProfileClient } from "@/features/citizen-card";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  return createPageMetadata(
    "Hồ sơ Công Dân",
    `Xem thẻ công dân Ô Diên — ${slug}`
  );
}

export default async function PublicProfilePage({ params }: PageProps) {
  const { slug } = await params;
  return <PublicProfileClient slug={slug} />;
}
