import type { Metadata } from "next";
import { getOpenGraphLocale, otherLocale, pagePath, type Locale } from "../../types/locale";

const siteOrigin = "https://nasoodi.art";

export type LocalizedMetadataInput = {
  locale: Locale;
  path: string;
  title: string;
  description?: string;
  alternatePath?: string;
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
  const alternate = input.alternatePath
    ? new URL(input.alternatePath, siteOrigin).toString()
    : undefined;
  const images = input.images?.filter(Boolean).map((image) => new URL(image, siteOrigin).toString());
  const description = input.description?.trim() || undefined;

  const metadata: Metadata = {
    title: input.title,
    ...(description ? { description } : {}),
    alternates: {
      canonical,
      ...(alternate
        ? { languages: { [input.locale]: canonical, [otherLocale(input.locale)]: alternate } }
        : {}),
    },
    robots: { index: input.indexable, follow: true },
  };

  if (!input.indexable) return { ...metadata, openGraph: null, twitter: null };

  const localeTag = getOpenGraphLocale(input.locale);
  const alternateLocaleTag = getOpenGraphLocale(otherLocale(input.locale));
  const commonOpenGraph = {
    title: input.title,
    ...(description ? { description } : {}),
    url: canonical,
    siteName: "Nasoodi.art",
    locale: localeTag,
    ...(alternate ? { alternateLocale: [alternateLocaleTag] } : {}),
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
