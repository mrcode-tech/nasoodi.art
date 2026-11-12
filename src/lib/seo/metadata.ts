import type { Metadata } from "next";
import { getOpenGraphLocale, pagePath, type Locale } from "../../types/locale";

const siteOrigin = "https://nasoodi.art";

export type LocalizedMetadataInput = {
  locale: Locale;
  path: string;
  title: string;
  description?: string;
  alternatePaths?: Partial<Record<Locale, string>>;
  xDefaultPath?: string;
  indexable: boolean;
  openGraphType?: "website" | "article";
  images?: readonly string[];
  publishedTime?: string;
};

/**
 * Build consistent canonical, hreflang, and social metadata for a localized page.
 * Callers must resolve alternatePath from the same published content identity.
 */
export function createLocalizedMetadata(input: LocalizedMetadataInput): Metadata {
  const canonical = new URL(pagePath(input.locale, input.path), siteOrigin).toString();
  const alternateEntries = Object.entries(input.alternatePaths ?? {})
    .filter(([target, path]) => target !== input.locale && Boolean(path)) as [Locale, string][];
  const alternateUrls = Object.fromEntries(
    alternateEntries.map(([target, path]) => [target, new URL(path, siteOrigin).toString()]),
  ) as Partial<Record<Locale, string>>;
  const images = input.images?.filter(Boolean).map((image) => new URL(image, siteOrigin).toString());
  const description = input.description?.trim() || undefined;

  const metadata: Metadata = {
    title: input.title,
    ...(description ? { description } : {}),
    alternates: {
      canonical,
      ...(alternateEntries.length || input.xDefaultPath
        ? { languages: { [input.locale]: canonical, ...alternateUrls, ...(input.xDefaultPath ? { "x-default": new URL(input.xDefaultPath, siteOrigin).toString() } : {}) } }
        : {}),
    },
    robots: { index: input.indexable, follow: true },
  };

  if (!input.indexable) return { ...metadata, openGraph: null, twitter: null };

  const localeTag = getOpenGraphLocale(input.locale);
  const commonOpenGraph = {
    title: input.title,
    ...(description ? { description } : {}),
    url: canonical,
    siteName: "Nasoodi.art",
    locale: localeTag,
    ...(alternateEntries.length ? { alternateLocale: alternateEntries.map(([target]) => getOpenGraphLocale(target)) } : {}),
    ...(images?.length ? { images } : {}),
  };

  metadata.openGraph = input.openGraphType === "article"
    ? {
        type: "article",
        ...commonOpenGraph,
        ...(input.publishedTime ? { publishedTime: input.publishedTime } : {}),
      }
    : { type: "website", ...commonOpenGraph };

  metadata.twitter = {
    card: images?.length ? "summary_large_image" : "summary",
    title: input.title,
    ...(description ? { description } : {}),
    ...(images?.length ? { images } : {}),
  };

  return metadata;
}
