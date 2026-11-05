import type { Locale } from "../../types/locale";
import type {
  Artwork,
  ArtistProfile,
  ContactDetails,
  CvDocument,
  CvEntry,
  Gallery,
  HomepageSelection,
} from "../../types/content";
import { getLocalizedSlug, isSafeContentSlug, isSafeLocalImagePath } from "./paths";

function keepUniqueBy<T>(items: readonly T[], keyOf: (item: T) => string): T[] {
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

export function primaryImageFor(work: Artwork) {
  return work.images.find((image) =>
    image.role === "primary" &&
    isSafeLocalImagePath(image.src) &&
    Number.isSafeInteger(image.width) &&
    image.width > 0 &&
    Number.isSafeInteger(image.height) &&
    image.height > 0,
  );
}

export function getPublicArtworks(items: readonly Artwork[], locale: Locale): Artwork[] {
  const visible = items.filter((work) =>
    work.status === "published" &&
    work.rightsConfirmed &&
    Boolean(work.id.trim()) &&
    isSafeContentSlug(getLocalizedSlug(work, locale)) &&
    Boolean(work.title[locale]?.trim()) &&
    Boolean(primaryImageFor(work)?.alt[locale]?.trim()),
  );

  return keepUniqueBy(
    keepUniqueBy(visible, (work) => work.id),
    (work) => getLocalizedSlug(work, locale),
  ).sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));
}

export function getPublicGalleries(items: readonly Gallery[], works: readonly Artwork[], locale: Locale): Gallery[] {
  const artworkIds = new Set(getPublicArtworks(works, locale).map((work) => work.id));
  const visible = items.filter((gallery) =>
    gallery.status === "published" &&
    Boolean(gallery.id.trim()) &&
    isSafeContentSlug(getLocalizedSlug(gallery, locale)) &&
    Boolean(gallery.title[locale]?.trim()) &&
    Boolean(gallery.description[locale]?.trim()) &&
    gallery.artworkIds.length > 0 &&
    new Set(gallery.artworkIds).size === gallery.artworkIds.length &&
    gallery.artworkIds.includes(gallery.coverArtworkId) &&
    gallery.artworkIds.every((id) => artworkIds.has(id)),
  );

  return keepUniqueBy(
    keepUniqueBy(visible, (gallery) => gallery.id),
    (gallery) => getLocalizedSlug(gallery, locale),
  ).sort((a, b) => a.sortOrder - b.sortOrder);
}

export function getGalleryCoverArtwork(gallery: Gallery, works: readonly Artwork[], locale: Locale) {
  const artwork = getPublicArtworks(works, locale).find((work) => work.id === gallery.coverArtworkId);
  const image = artwork ? primaryImageFor(artwork) : undefined;
  return artwork && image ? { artwork, image } : undefined;
}

export function getPublicCvEntries(items: readonly CvEntry[], locale: Locale): CvEntry[] {
  const visible = items.filter((entry) =>
    entry.status === "published" &&
    entry.verified &&
    Boolean(entry.id.trim()) &&
    Boolean(entry.title[locale]?.trim()) &&
    Number.isInteger(entry.year) &&
    entry.year > 0,
  );

  return keepUniqueBy(visible, (entry) => entry.id)
    .sort((a, b) => b.year - a.year || (a.sortOrder ?? 0) - (b.sortOrder ?? 0));
}

export function getPublicCvDocument(document: CvDocument | undefined): CvDocument | undefined {
  if (
    !document ||
    document.status !== "published" ||
    !document.artistApproved ||
    !isSafeLocalImagePath(document.src) ||
    !/\.pdf$/i.test(document.src) ||
    !/^[A-Za-z0-9][A-Za-z0-9._-]*\.pdf$/i.test(document.fileName)
  ) return undefined;

  return document;
}

export function getPublicArtistProfile(profile: ArtistProfile | undefined, locale: Locale): ArtistProfile | undefined {
  if (
    !profile ||
    profile.status !== "published" ||
    !profile.artistApproved ||
    !profile.approvedLocales.includes(locale) ||
    !profile.statement[locale]?.trim() ||
    !profile.biography[locale]?.trim()
  ) return undefined;

  const portrait = profile.portrait;
  const validPortrait = portrait &&
    portrait.rightsConfirmed &&
    portrait.width > 0 &&
    portrait.height > 0 &&
    isSafeLocalImagePath(portrait.src) &&
    Boolean(portrait.alt[locale]?.trim());

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
  const telegramHandle = details.telegramHandle && /^[A-Za-z0-9_]{5,32}$/.test(details.telegramHandle)
    ? details.telegramHandle
    : undefined;

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

export function getHomepageHero(items: readonly Artwork[], selection: HomepageSelection, locale: Locale) {
  if (!selection.heroArtworkId) return undefined;
  return getPublicArtworks(items, locale).find((work) => work.id === selection.heroArtworkId);
}

export function getHomepageFeaturedArtworks(items: readonly Artwork[], selection: HomepageSelection, locale: Locale) {
  const available = new Map(getPublicArtworks(items, locale).map((work) => [work.id, work]));
  return [...new Set(selection.featuredArtworkIds)]
    .map((id) => available.get(id))
    .filter((work) => work !== undefined);
}

export function getHomepageFeaturedGalleries(
  items: readonly Gallery[],
  works: readonly Artwork[],
  selection: HomepageSelection,
  locale: Locale,
) {
  const available = new Map(getPublicGalleries(items, works, locale).map((gallery) => [gallery.id, gallery]));
  return [...new Set(selection.featuredGalleryIds)]
    .map((id) => available.get(id))
    .filter((gallery) => gallery !== undefined);
}
