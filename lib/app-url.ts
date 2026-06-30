function stripTrailingSlash(url: string): string {
  return url.replace(/\/$/, "");
}

function isLocalhostUrl(url: string): boolean {
  try {
    const { hostname } = new URL(url);
    return hostname === "localhost" || hostname === "127.0.0.1";
  } catch {
    return false;
  }
}

/** Base URL for links, OG tags, and server-generated QR codes. */
export function getAppBaseUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_APP_URL?.trim();
  if (explicit) return stripTrailingSlash(explicit);

  if (typeof window !== "undefined") {
    return window.location.origin;
  }

  const vercelProduction = process.env.VERCEL_PROJECT_PRODUCTION_URL?.trim();
  if (vercelProduction) {
    return `https://${vercelProduction}`;
  }

  const vercelUrl = process.env.VERCEL_URL?.trim();
  if (vercelUrl) {
    return `https://${vercelUrl}`;
  }

  return "http://localhost:3000";
}

export function buildAppUrl(path: string): string {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${getAppBaseUrl()}${normalizedPath}`;
}

export function buildCitizenProfileUrl(
  profileSlug: string,
  cachedUrl?: string
): string {
  if (typeof window !== "undefined") {
    return `${window.location.origin}/citizen-card/${profileSlug}`;
  }

  if (cachedUrl && !isLocalhostUrl(cachedUrl)) {
    return cachedUrl;
  }

  return buildAppUrl(`/citizen-card/${profileSlug}`);
}
