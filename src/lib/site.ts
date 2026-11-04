import { artworks, cvEntries, galleries, journalEntries } from "@/content/portfolio";
import enMessages from "@/i18n/messages/en.json";
import faMessages from "@/i18n/messages/fa.json";
import { otherLocale, pagePath } from "@/types/locale";
import type { Locale } from "@/types/locale";
import type {
  Artwork,
  ArtistProfile,
  ContactDetails,
  CvDocument,
  CvEntry,
  Gallery,
  HomepageSelection,
  JournalEntry,
  JournalCategory,
} from "@/types/content";

export { locales, isLocale, otherLocale, pagePath } from "@/types/locale";
export type { Locale, Localized } from "@/types/locale";
export type {
  Artwork,
  ArtistProfile,
  ContactDetails,
  CvDocument,
  CvEntry,
  Gallery,
  HomepageSelection,
  ImageRecord,
  JournalCategory,
  JournalEvent,
  JournalTextBlock,
  LocalizedRichText,
  Status,
} from "@/types/content";
export {
  artworks,
  artistProfile,
  contactDetails,
  cvDocument,
  cvEntries,
  galleries,
  homepageSelection,
  journalEntries,
  portfolioStructuredData,
} from "@/content/portfolio";

export type LocalizedSlugRecord = { slug: string; localizedSlugs?: Partial<Record<Locale, string>> };

export function getLocalizedSlug(record: LocalizedSlugRecord, locale: Locale): string {
  return record.localizedSlugs?.[locale]?.trim() || record.slug;
}

export type PublicContactDetails = {
  email?: string;
  telegramHandle?: string;
  telegramUrl?: string;
  instagramHandle?: string;
  instagramUrl?: string;
};

export function isSafeJournalHref(href: string): boolean {
  if (!href || href.includes("\\") || /[\u0000-\u001f]/.test(href)) return false;
  if (href.startsWith("/") && !href.startsWith("//")) {
    try { return new URL(href, "https://nasoodi.art").origin === "https://nasoodi.art"; }
    catch { return false; }
  }
  try {
    const url = new URL(href);
    return url.protocol === "https:" && !url.username && !url.password;
  } catch { return false; }
}
export const journalCategories: JournalCategory[] = ["exhibition", "event", "studio-update", "story"];
export function journalCategoryFor(entry: JournalEntry): JournalCategory {
  return entry.type;
}
export function getJournalEntriesForCategory(items: JournalEntry[], category?: JournalCategory) {
  return category ? items.filter((entry) => journalCategoryFor(entry) === category) : items;
}

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
export function getGalleryStructuredData(gallery: Gallery, works: Artwork[], locale: Locale, canonicalUrl: string): Record<string, unknown> {
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
            url: `https://nasoodi.art${pagePath(locale, `works/${getLocalizedSlug(work, locale)}`)}`,
            ...(image ? { image: new URL(image.src, "https://nasoodi.art").toString() } : {}),
          },
        };
      }),
    },
  };
}
export function getJournalStructuredData(entry: JournalEntry, locale: Locale, canonicalUrl: string): Record<string, unknown> {
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
export function isSafeLocalImagePath(src: string): boolean {
  if (!src.startsWith("/") || src.startsWith("//") || src.includes("\\") ||
    /[?#\u0000-\u001f]/.test(src) || /%(?:2e|2f|5c)/i.test(src)) return false;
  return src.split("/").every((segment) => segment !== "." && segment !== "..");
}
export function primaryImageFor(work: Artwork) {
  return work.images.find((image) => image.role === "primary" && isSafeLocalImagePath(image.src) &&
    image.width > 0 && image.height > 0);
}
function keepUniqueBy<T>(items: T[], keyOf: (item: T) => string): T[] {
  const counts = new Map<string, number>();
  for (const item of items) {
    const key = keyOf(item);
    counts.set(key, (counts.get(key) ?? 0) + 1);
  }
  return items.filter((item) => {
    const key = keyOf(item);
    return Boolean(key.trim()) && counts.get(key) === 1;
  });
}
export function isSafeContentSlug(slug: string): boolean {
  return /^[\p{L}\p{N}]+(?:-[\p{L}\p{N}]+)*$/u.test(slug);
}
export function getPublicArtworks(items: Artwork[], locale: Locale) {
  const visible = items.filter((work) => work.status === "published" && work.rightsConfirmed &&
    Boolean(work.id.trim()) && isSafeContentSlug(getLocalizedSlug(work, locale)) &&
    Boolean(work.title[locale]?.trim()) && Boolean(primaryImageFor(work)?.alt[locale]?.trim()));
  return keepUniqueBy(keepUniqueBy(visible, (work) => work.id), (work) => getLocalizedSlug(work, locale))
    .sort((a,b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));
}
export function getPublicGalleries(items: Gallery[], works: Artwork[], locale: Locale) {
  const ids = new Set(getPublicArtworks(works, locale).map((work) => work.id));
  const visible = items.filter((g) => g.status === "published" && Boolean(g.id.trim()) &&
    isSafeContentSlug(getLocalizedSlug(g, locale)) && Boolean(g.title[locale]?.trim()) &&
    Boolean(g.description[locale]?.trim()) && g.artworkIds.length > 0 &&
    new Set(g.artworkIds).size === g.artworkIds.length && g.artworkIds.includes(g.coverArtworkId) &&
    g.artworkIds.every((id) => ids.has(id)));
  return keepUniqueBy(keepUniqueBy(visible, (gallery) => gallery.id), (gallery) => getLocalizedSlug(gallery, locale))
    .sort((a,b) => a.sortOrder-b.sortOrder);
}
export function getGalleryCoverArtwork(gallery: Gallery, works: Artwork[], locale: Locale) {
  const cover = getPublicArtworks(works, locale).find((work) => work.id === gallery.coverArtworkId);
  return cover ? primaryImageFor(cover) ? { artwork: cover, image: primaryImageFor(cover)! } : undefined : undefined;
}
export function hasExplicitTimeZone(value: string): boolean {
  return /(?:Z|[+-]\d{2}:\d{2})$/i.test(value) && Number.isFinite(Date.parse(value));
}
export function getPublicJournal(items: JournalEntry[], locale: Locale) {
  const visible = items.filter((entry) => {
    if (entry.status !== "published" || !entry.artistApproved || !entry.approvedLocales.includes(locale) ||
      !entry.id.trim() || !isSafeContentSlug(getLocalizedSlug(entry, locale)) || !entry.title[locale]?.trim() || !entry.summary[locale]?.trim()) return false;
    if (entry.type === "event" && !entry.event) return false;
    if (!entry.event) return true;
    const event = entry.event;
    if (!hasExplicitTimeZone(event.startsAt) || !event.timeZone ||
      (!event.venue?.[locale]?.trim() && !event.attendanceMode)) return false;
    try { new Intl.DateTimeFormat(locale, { timeZone: event.timeZone }); } catch { return false; }
    if (event.endsAt && (!hasExplicitTimeZone(event.endsAt) || Date.parse(event.endsAt) < Date.parse(event.startsAt))) return false;
    if (event.registrationUrl && !isSafeJournalHref(event.registrationUrl)) return false;
    return true;
  });
  return keepUniqueBy(keepUniqueBy(visible, (entry) => entry.id), (entry) => getLocalizedSlug(entry, locale))
    .sort((a, b) => {
      const timestamp = (entry: JournalEntry) => entry.publishedAt && Number.isFinite(Date.parse(entry.publishedAt)) ? Date.parse(entry.publishedAt) : Number.NEGATIVE_INFINITY;
      return timestamp(b) - timestamp(a) || (a.id < b.id ? -1 : a.id > b.id ? 1 : a.slug < b.slug ? -1 : a.slug > b.slug ? 1 : 0);
    });
}
export function journalCoverImageFor(entry: JournalEntry, locale: Locale): NonNullable<JournalEntry["coverImage"]> | undefined {
  const image = entry.coverImage;
  if (!image || !image.rightsConfirmed || !isSafeLocalImagePath(image.src) || !Number.isSafeInteger(image.width) || image.width < 1 || !Number.isSafeInteger(image.height) || image.height < 1 || !image.alt[locale]?.trim()) return undefined;
  return image;
}
export function getHomepageJournalPreview(items: JournalEntry[], locale: Locale): JournalEntry[] {
  return getPublicJournal(items, locale).slice(0, 1);
}
export function getUpcomingJournalEvents(items: JournalEntry[], locale: Locale, now: Date = new Date()) {
  const nowMs = now.getTime();
  return getPublicJournal(items, locale)
    .filter((entry) => {
      if ((entry.type !== "event" && entry.type !== "exhibition") || !entry.event) return false;
      const startsAt = Date.parse(entry.event.startsAt);
      const endsAt = entry.event.endsAt ? Date.parse(entry.event.endsAt) : startsAt;
      return Number.isFinite(startsAt) && startsAt > nowMs && endsAt > nowMs;
    })
    .sort((a, b) => Date.parse(a.event!.startsAt) - Date.parse(b.event!.startsAt) ||
      a.id.localeCompare(b.id) || a.slug.localeCompare(b.slug));
}
export function getUpcomingJournalEvent(items: JournalEntry[], locale: Locale, now: Date = new Date()): JournalEntry | undefined {
  return getUpcomingJournalEvents(items, locale, now)[0];
}
export function getPublicCvEntries(items: CvEntry[], locale: Locale) {
  const visible = items.filter((entry) => entry.status === "published" && entry.verified &&
    Boolean(entry.id.trim()) && Boolean(entry.title[locale]?.trim()) &&
    Number.isInteger(entry.year) && entry.year > 0);
  return keepUniqueBy(visible, (entry) => entry.id)
    .sort((a,b) => b.year - a.year || (a.sortOrder ?? 0) - (b.sortOrder ?? 0));
}
export function getPublicCvDocument(document: CvDocument | undefined) {
  if (!document || document.status !== "published" || !document.artistApproved ||
      !isSafeLocalImagePath(document.src) || !/\.pdf$/i.test(document.src) ||
      !/^[A-Za-z0-9][A-Za-z0-9._-]*\.pdf$/i.test(document.fileName)) return undefined;
  return document;
}
export function getPublicArtistProfile(profile: ArtistProfile | undefined, locale: Locale) {
  if (!profile || profile.status !== "published" || !profile.artistApproved ||
      !profile.approvedLocales.includes(locale) || !profile.statement[locale]?.trim() ||
      !profile.biography[locale]?.trim()) return undefined;
  const portrait = profile.portrait;
  const validPortrait = portrait && portrait.rightsConfirmed && portrait.width > 0 && portrait.height > 0 &&
    isSafeLocalImagePath(portrait.src) && Boolean(portrait.alt[locale]?.trim());
  return { ...profile, portrait: validPortrait ? portrait : undefined };
}
export type PublicContactDetails = {
  email?: string;
  telegramHandle?: string;
  telegramUrl?: string;
  instagramHandle?: string;
  instagramUrl?: string;
};

export function getPublicContactDetails(details: ContactDetails | undefined): PublicContactDetails | undefined {
  if (!details) return undefined;
  const emailValue = details.email?.trim() ?? "";
  const email = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailValue) ? emailValue : undefined;
  const telegramHandle = details.telegramHandle && /^[A-Za-z0-9_]{5,32}$/.test(details.telegramHandle) ? details.telegramHandle : undefined;
  let instagramUrl: string | undefined;
  let instagramHandle: string | undefined;
  if (details.instagramUrl) {
    try {
      const url = new URL(details.instagramUrl);
      const segments = url.pathname.split("/").filter(Boolean);
      const allowedHost = url.hostname === "instagram.com" || url.hostname === "www.instagram.com";
      if (url.protocol === "https:" && allowedHost && segments.length === 1 && /^[A-Za-z0-9._]{1,30}$/.test(segments[0])) {
        instagramUrl = "https://www.instagram.com/" + segments[0] + "/";
        instagramHandle = segments[0];
      }
    } catch {
      // Invalid external destinations are omitted.
    }
  }
  const publicDetails: PublicContactDetails = {
    ...(email ? { email } : {}),
    ...(telegramHandle ? { telegramHandle, telegramUrl: "https://t.me/" + telegramHandle } : {}),
    ...(instagramUrl && instagramHandle ? { instagramUrl, instagramHandle } : {}),
  };
  return Object.keys(publicDetails).length > 0 ? publicDetails : undefined;
}

export function getHomepageHero(items: Artwork[], selection: HomepageSelection, locale: Locale) {
  if (!selection.heroArtworkId) return undefined;
  return getPublicArtworks(items, locale).find((work) => work.id === selection.heroArtworkId);
}
export function getHomepageFeaturedArtworks(items: Artwork[], selection: HomepageSelection, locale: Locale) {
  const available = new Map(getPublicArtworks(items, locale).map((work) => [work.id, work]));
  return [...new Set(selection.featuredArtworkIds)].map((id) => available.get(id)).filter((work) => work !== undefined);
}
export function getHomepageFeaturedGalleries(items: Gallery[], works: Artwork[], selection: HomepageSelection, locale: Locale) {
  const available = new Map(getPublicGalleries(items, works, locale).map((gallery) => [gallery.id, gallery]));
  return [...new Set(selection.featuredGalleryIds)].map((id) => available.get(id)).filter((gallery) => gallery !== undefined);
}
export const copy = { en: enMessages, fa: faMessages } as const;
export const copyFor = (locale: Locale) => copy[locale];


/**
 * Resolve a locale switch to the equivalent published destination when it exists.
 * Static editorial routes have localized shells in both locales; content routes
 * fall back to the target locale home rather than connecting unrelated records.
 */
export function alternatePathFor(pathname: string, locale: Locale): string {
  const target = otherLocale(locale);
  const segments = pathname.split("/").filter(Boolean).slice(1);
  if (segments.length === 0) return pagePath(target);
  const [section, slug] = segments;
  if (section === "about" || section === "contact") return pagePath(target, section);
  if (section === "cv") return getPublicCvEntries(cvEntries, target).length > 0 ? pagePath(target, "cv") : pagePath(target);
  if (section === "works") {
    const sourceItems = getPublicArtworks(artworks, locale);
    const targetItems = getPublicArtworks(artworks, target);
    if (!slug) return sourceItems.length && targetItems.length ? pagePath(target, "works") : pagePath(target);
    const source = sourceItems.find((item) => getLocalizedSlug(item, locale) === slug);
    const translated = source && targetItems.find((item) => item.id === source.id);
    return translated ? pagePath(target, `works/${getLocalizedSlug(translated, target)}`) : pagePath(target);
  }
  if (section === "galleries") {
    const sourceItems = getPublicGalleries(galleries, artworks, locale);
    const targetItems = getPublicGalleries(galleries, artworks, target);
    if (!slug) return sourceItems.length && targetItems.length ? pagePath(target, "galleries") : pagePath(target);
    const source = sourceItems.find((item) => getLocalizedSlug(item, locale) === slug);
    const translated = source && targetItems.find((item) => item.id === source.id);
    return translated ? pagePath(target, `galleries/${getLocalizedSlug(translated, target)}`) : pagePath(target);
  }
  if (section === "journal") {
    const sourceItems = getPublicJournal(journalEntries, locale);
    const targetItems = getPublicJournal(journalEntries, target);
    if (!slug) return sourceItems.length && targetItems.length ? pagePath(target, "journal") : pagePath(target);
    const source = sourceItems.find((item) => getLocalizedSlug(item, locale) === slug);
    const translated = source && targetItems.find((item) => item.id === source.id);
    return translated ? pagePath(target, `journal/${getLocalizedSlug(translated, target)}`) : pagePath(target);
  }
  return pagePath(target);
}
