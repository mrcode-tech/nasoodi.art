import { GALLERY_PAGE_SIZES, galleryPaginationHref, type GalleryPageSize } from "./gallery-pagination";
import { pagePath, type Locale } from "../types/locale";

const RETURN_URL_BASE = "https://nasoodi.art";
const MAX_RETURN_HREF_LENGTH = 2048;
const ALLOWED_QUERY_KEYS = new Set(["page", "pageSize"]);

function parsePositiveSafeInteger(value: string | null): number | undefined {
  if (value === null || !/^[1-9]\d*$/.test(value)) return undefined;
  const parsed = Number(value);
  return Number.isSafeInteger(parsed) ? parsed : undefined;
}

/** Build a minimal, URL-backed return destination from the resolved Works pagination state. */
export function buildArtworkReturnHref(
  locale: Locale,
  page: number,
  pageSize: GalleryPageSize,
): string {
  return galleryPaginationHref(pagePath(locale, "works"), "", page, pageSize);
}

/**
 * Resolve untrusted artwork return context to a same-locale Works archive URL.
 * Only the archive's supported pagination keys are accepted; every other value
 * falls back to the localized archive root.
 */
export function resolveArtworkReturnHref(locale: Locale, candidate?: string): string {
  const fallback = pagePath(locale, "works");
  if (
    typeof candidate !== "string" ||
    candidate.length === 0 ||
    candidate.length > MAX_RETURN_HREF_LENGTH ||
    !candidate.startsWith("/") ||
    candidate.startsWith("//") ||
    candidate.includes("\\") ||
    candidate.includes("#") ||
    /%(?![\da-f]{2})/i.test(candidate)
  ) {
    return fallback;
  }

  const rawPath = candidate.split(/[?#]/, 1)[0];
  if (rawPath !== fallback) return fallback;

  let parsed: URL;
  try {
    parsed = new URL(candidate, RETURN_URL_BASE);
  } catch {
    return fallback;
  }

  if (parsed.origin !== RETURN_URL_BASE || parsed.pathname !== fallback || parsed.hash) {
    return fallback;
  }

  const keys = [...parsed.searchParams.keys()];
  if (keys.some((key) => !ALLOWED_QUERY_KEYS.has(key))) return fallback;
  if (keys.some((key, index) => keys.indexOf(key) !== index)) return fallback;

  const rawPage = parsed.searchParams.get("page");
  const rawPageSize = parsed.searchParams.get("pageSize");
  const page = rawPage === null ? 1 : parsePositiveSafeInteger(rawPage);
  const pageSizeValue = rawPageSize === null ? 6 : parsePositiveSafeInteger(rawPageSize);
  if (page === undefined || pageSizeValue === undefined ||
      !GALLERY_PAGE_SIZES.includes(pageSizeValue as GalleryPageSize)) {
    return fallback;
  }

  return galleryPaginationHref(fallback, "", page, pageSizeValue as GalleryPageSize);
}
