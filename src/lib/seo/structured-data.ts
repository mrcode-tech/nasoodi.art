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

  const event = entry.type === "event" ? entry.event : undefined;
  const attendanceModes = {
    "in-person": "https://schema.org/OfflineEventAttendanceMode",
    online: "https://schema.org/OnlineEventAttendanceMode",
    hybrid: "https://schema.org/MixedEventAttendanceMode",
  } as const;
  const hasPhysicalLocation = Boolean(event?.venue?.[locale]?.trim() && event.address?.[locale]?.trim());
  const hasVirtualLocation = Boolean(event?.onlineUrl && /^https:\/\//i.test(event.onlineUrl));

  // Do not emit Event JSON-LD for article/exhibition records or incomplete event details.
  // A real event needs an explicit attendance mode and the corresponding venue details.
  const hasCompleteEventLocation = event?.attendanceMode === "in-person"
    ? hasPhysicalLocation
    : event?.attendanceMode === "online"
      ? hasVirtualLocation
      : event?.attendanceMode === "hybrid"
        ? hasPhysicalLocation && hasVirtualLocation
        : false;

  if (event && hasCompleteEventLocation) {
    return {
      ...common,
      "@type": "Event",
      startDate: event.startsAt,
      ...(event.endsAt ? { endDate: event.endsAt } : {}),
      eventAttendanceMode: attendanceModes[event.attendanceMode!],
      ...(hasPhysicalLocation ? {
        location: {
          "@type": "Place",
          name: event.venue![locale],
          address: { "@type": "PostalAddress", streetAddress: event.address![locale] },
        },
      } : {}),
      ...(hasVirtualLocation ? {
        virtualLocation: { "@type": "VirtualLocation", url: event.onlineUrl },
      } : {}),
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
