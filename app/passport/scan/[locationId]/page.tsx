import { createPageMetadata } from "@/lib/seo";
import { ScanPageClient } from "@/features/passport";

interface PageProps {
  params: Promise<{ locationId: string }>;
  searchParams: Promise<{ t?: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { locationId } = await params;
  return createPageMetadata(
    "Quét Tem",
    `Sưu tập tem hộ chiếu tại ${locationId}`
  );
}

export default async function ScanPage({ params, searchParams }: PageProps) {
  const { locationId } = await params;
  const { t: token = "" } = await searchParams;

  return <ScanPageClient locationId={locationId} token={token} />;
}
