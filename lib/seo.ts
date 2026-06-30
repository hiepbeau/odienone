import type { Metadata } from "next";
import { APP_NAME, APP_TAGLINE } from "@/lib/constants";
import { getAppBaseUrl } from "@/lib/app-url";

const APP_URL = getAppBaseUrl();

export const defaultMetadata: Metadata = {
  title: {
    default: `${APP_NAME} — Kỷ niệm 1 năm thành lập`,
    template: `%s | ${APP_NAME}`,
  },
  description: APP_TAGLINE,
  keywords: [
    "Ô Diên",
    "cộng đồng",
    "kỷ niệm",
    "thẻ công dân",
    "hộ chiếu",
    "time capsule",
  ],
  authors: [{ name: "Ô Diên Community" }],
  openGraph: {
    type: "website",
    locale: "vi_VN",
    url: APP_URL,
    siteName: APP_NAME,
    title: `${APP_NAME} — Kỷ niệm 1 năm thành lập`,
    description: APP_TAGLINE,
  },
  twitter: {
    card: "summary_large_image",
    title: APP_NAME,
    description: APP_TAGLINE,
  },
  robots: {
    index: true,
    follow: true,
  },
};

export function createPageMetadata(
  title: string,
  description?: string,
  overrides?: Metadata
): Metadata {
  return {
    title,
    description: description ?? APP_TAGLINE,
    openGraph: {
      title: `${title} | ${APP_NAME}`,
      description: description ?? APP_TAGLINE,
    },
    ...overrides,
  };
}
