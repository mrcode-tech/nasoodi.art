import type { Locale } from "../../types/locale";
import { pagePath } from "../../types/locale";
import type { Artwork, Gallery, JournalEntry } from "../../types/content";
import { getLocalizedSlug } from "../content/paths";
import { getPublicArtworks, primaryImageFor } from "../content/publication";

export function serializeJsonLd(value: unknown): string {
  return (JSON.stringify(value) ?? "null").replace(/</g, "\\u003c");
}

export function getArtworkStructuredData(work: Artwork, locale: Locale) {
  const image = primaryImageFor(work);
  return {
    "@context": "https://schema.org",
    "@type": "VisualArtwork",
    name: work.title[locale],
    creator: { "@id": "https://nasoodi.art/#artist" },
    ...(image ? { image: new URL(image.src, "https://nasoodi.art").toString() } : {}),
    ...(Number.isInteger(work.year) && work.year! > 0 ? { dateCreated: String(work.year) } : {}),
    ...(work.medium?.[locale]?.trim() ? { artMedium: work.medium[locale] } : {}),
    ...(work.description?.[locale]?.trim() ? { description: work.description[locale] } : {}),
  };
}

export function getGalleryStructuredData(
  gallery: Gallery,
  works: readonly Artwork[],
  locale: Locale,
  canonicalUrl: string,
): Record<string, unknown> {
  const publishedWorks = getPublicArtworks(works, locale);
  const members = gallery.artworkIds
    .map((id) => publishedWorks.find((work) => work.id === id))
    .filter((work): work is Artwork => work !== undefined);

  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: gallery.title[locale],
    description: gallery.description[locale],
    url: canonicalUrl,
    inLanguage: locale,
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: members.length,
      itemListElement: members.map((work, index) => {
        const image = primaryImageFor(work);
        return {
          "@type": "ListItem",
          position: index + 1,
          item: {
            "@type": "VisualArtwork",
            name: work.title[locale],
            url: "https://nasoodi.art" + pagePath(locale, "works/" + getLocalizedSlug(work, locale)),
            ...(image ? { image: new URL(image.src, "https://nasoodi.art").toString() } : {}),
          },
        };
      }),
    },
  };
}

export function getJournalStructuredData(
  entry: JournalEntry,
  locale: Locale,
  canonicalUrl: string,
): Record<string, unknown> {
  const common = {
    "@context": "https://schema.org",
    name: entry.title[locale],
    description: entry.summary[locale],
    url: canonicalUrl,
    inLanguage: locale,
  };

  if (entry.event) {
    const attendanceModes = {
      "in-person": "https://schema.org/OfflineEventAttendanceMode",
      online: "https://schema.org/OnlineEventAttendanceMode",
      hybrid: "https://schema.org/MixedEventAttendanceMode",
    } as const;

    return {
      ...common,
      "@type": "Event",
      startDate: entry.event.startsAt,
      ...(entry.event.endsAt ? { endDate: entry.event.endsAt } : {}),
      ...(entry.event.attendanceMode
        ? { eventAttendanceMode: attendanceModes[entry.event.attendanceMode] }
        : {}),
      ...(entry.event.venue?.[locale]
        ? { location: { "@type": "Place", name: entry.event.venue[locale] } }
        : {}),
    };
  }

  return {
    ...common,
    "@type": "Article",
    headline: entry.title[locale],
    author: { "@id": "https://nasoodi.art/#artist" },
    ...(entry.publishedAt && Number.isFinite(Date.parse(entry.publishedAt))
      ? { datePublished: entry.publishedAt }
      : {}),
  };
}
