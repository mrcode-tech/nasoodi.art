import type { Locale } from "../../types/locale";

export type LocalizedSlugRecord = {
  slug: string;
  localizedSlugs?: Partial<Record<Locale, string>>;
};

/** Resolve a route slug from the canonical content record for one locale. */
export function getLocalizedSlug(record: LocalizedSlugRecord, locale: Locale): string {
  return record.localizedSlugs ? (record.localizedSlugs[locale]?.trim() ?? "") : record.slug;
}

/** Accept one safe URL segment with native-script letters, combining marks, and Persian ZWNJ. */
export function isSafeContentSlug(slug: string): boolean {
  return /^[\p{L}\p{N}](?:[\p{L}\p{N}\p{M}]|\u200c(?=[\p{L}\p{M}]))*(?:-[\p{L}\p{N}](?:[\p{L}\p{N}\p{M}]|\u200c(?=[\p{L}\p{M}]))*)*$/u.test(slug);
}

/** Content images must be same-origin public paths, never remote or traversal paths. */
export function isSafeLocalImagePath(src: string): boolean {
  if (!src.startsWith("/") || src.startsWith("//") || src.includes("\\") ||
    /[?#\u0000-\u001f]/.test(src) || /%(?:2e|2f|5c)/i.test(src)) return false;
  return src.split("/").every((segment) => segment !== "." && segment !== "..");
}
