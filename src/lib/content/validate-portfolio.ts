import type {
  Artwork,
  ArtistProfile,
  CvDocument,
  CvEntry,
  Gallery,
  HomepageSelection,
  JournalEntry,
} from "../../types/content";
import { locales as supportedLocales, type Locale } from "../../types/locale";
import { getLocalizedSlug, isSafeContentSlug, isSafeLocalImagePath } from "./paths";
import { isSafeJournalHref } from "./journal";

const locales = supportedLocales;

export type ContentValidationIssue = {
  path: string;
  message: string;
};

export type PortfolioContentSource = {
  artworks: readonly Artwork[];
  galleries: readonly Gallery[];
  journalEntries: readonly JournalEntry[];
  cvEntries: readonly CvEntry[];
  homepageSelection: HomepageSelection;
  artistProfile?: ArtistProfile;
  cvDocument?: CvDocument;
};

function validateRouteIdentity(
  kind: string,
  records: readonly { id: string; slug: string; localizedSlugs?: Partial<Record<Locale, string>> }[],
  issues: ContentValidationIssue[],
) {
  const ids = new Set<string>();
  const slugs = new Map<Locale, Set<string>>(locales.map((locale) => [locale, new Set<string>()]));

  records.forEach((record, index) => {
    const path = kind + "[" + index + "]";
    if (!record.id.trim()) issues.push({ path: path + ".id", message: "A stable content ID is required." });
    else if (ids.has(record.id)) issues.push({ path: path + ".id", message: "Duplicate " + kind + " ID " + record.id + "." });
    ids.add(record.id);

    if (!isSafeContentSlug(record.slug)) {
      issues.push({ path: path + ".slug", message: "The fallback slug must be one safe URL segment." });
    }

    for (const locale of locales) {
      const localizedSlug = record.localizedSlugs?.[locale];
      if (localizedSlug !== undefined && !isSafeContentSlug(localizedSlug)) {
        issues.push({ path: path + ".localizedSlugs." + locale, message: "The localized slug must be one safe URL segment." });
      }

      const resolvedSlug = getLocalizedSlug(record, locale);
      const localeSlugs = slugs.get(locale)!;
      if (localeSlugs.has(resolvedSlug)) {
        issues.push({ path: path + ".localizedSlugs." + locale, message: "Duplicate " + locale + " route slug " + resolvedSlug + " in " + kind + "." });
      }
      localeSlugs.add(resolvedSlug);
    }
  });
}

function validateUniqueIds(kind: string, records: readonly { id: string }[], issues: ContentValidationIssue[]) {
  const ids = new Set<string>();
  records.forEach((record, index) => {
    const path = kind + "[" + index + "].id";
    if (!record.id.trim()) issues.push({ path, message: "A stable content ID is required." });
    else if (ids.has(record.id)) issues.push({ path, message: "Duplicate " + kind + " ID " + record.id + "." });
    ids.add(record.id);
  });
}

function isValidExplicitDate(value: string): boolean {
  return /(?:Z|[+-]\d{2}:\d{2})$/i.test(value) && Number.isFinite(Date.parse(value));
}


function validateImage(
  image: { src: string; width: number; height: number; alt: Partial<Record<Locale, string>> },
  path: string,
  issues: ContentValidationIssue[],
) {
  if (!isSafeLocalImagePath(image.src)) issues.push({ path: path + ".src", message: "Image paths must be safe same-origin public paths." });
  if (!Number.isSafeInteger(image.width) || image.width < 1) issues.push({ path: path + ".width", message: "Image width must be a positive integer." });
  if (!Number.isSafeInteger(image.height) || image.height < 1) issues.push({ path: path + ".height", message: "Image height must be a positive integer." });
  for (const [locale, alt] of Object.entries(image.alt)) {
    if (!locales.includes(locale as Locale) || typeof alt !== "string") {
      issues.push({ path: path + ".alt." + locale, message: "Image alt text must use a supported locale and string value." });
    }
  }
}

export function validatePortfolioContent(source: PortfolioContentSource): ContentValidationIssue[] {
  const issues: ContentValidationIssue[] = [];
  validateRouteIdentity("artworks", source.artworks, issues);
  validateRouteIdentity("galleries", source.galleries, issues);
  validateRouteIdentity("journalEntries", source.journalEntries, issues);

  const artworkIds = new Set(source.artworks.map((item) => item.id));
  const galleryIds = new Set(source.galleries.map((item) => item.id));

  source.artworks.forEach((work, index) => {
    const path = "artworks[" + index + "]";
    const primaryImages = work.images.filter((image) => image.role === "primary");
    if (work.status === "published" && primaryImages.length !== 1) {
      issues.push({ path: path + ".images", message: "A published artwork must have exactly one primary image." });
    }
    work.images.forEach((image, imageIndex) => validateImage(image, path + ".images[" + imageIndex + "]", issues));
  });

  source.galleries.forEach((gallery, index) => {
    const path = "galleries[" + index + "]";
    if (new Set(gallery.artworkIds).size !== gallery.artworkIds.length) {
      issues.push({ path: path + ".artworkIds", message: "Gallery artwork references must be unique." });
    }
    if (!gallery.artworkIds.includes(gallery.coverArtworkId)) {
      issues.push({ path: path + ".coverArtworkId", message: "The cover artwork must belong to the gallery." });
    }
    gallery.artworkIds.forEach((id, artworkIndex) => {
      if (!artworkIds.has(id)) issues.push({ path: path + ".artworkIds[" + artworkIndex + "]", message: "Unknown artwork ID " + id + "." });
    });
    if (gallery.status === "published" && gallery.artworkIds.length === 0) {
      issues.push({ path: path + ".artworkIds", message: "A published gallery must contain at least one artwork." });
    }
  });

  source.journalEntries.forEach((entry, index) => {
    const path = "journalEntries[" + index + "]";
    if (entry.status === "published" && entry.approvedLocales.length === 0) {
      issues.push({ path: path + ".approvedLocales", message: "A published Journal entry must be approved for at least one locale." });
    }
    if (new Set(entry.approvedLocales).size !== entry.approvedLocales.length) {
      issues.push({ path: path + ".approvedLocales", message: "Approved locales must be unique." });
    }
    entry.approvedLocales.forEach((locale, localeIndex) => {
      if (entry.status === "published" && (!entry.title[locale]?.trim() || !entry.summary[locale]?.trim())) {
        issues.push({ path: path + ".approvedLocales[" + localeIndex + "]", message: "Published Journal content requires a localized title and summary for each approved locale." });
      }
      if (!locales.includes(locale)) issues.push({ path: path + ".approvedLocales[" + localeIndex + "]", message: "Unsupported locale " + locale + "." });
    });
    if (entry.event) {
      const event = entry.event;
      if (!isValidExplicitDate(event.startsAt)) issues.push({ path: path + ".event.startsAt", message: "Event start must include an explicit UTC offset or Z." });
      if (event.endsAt && (!isValidExplicitDate(event.endsAt) || Date.parse(event.endsAt) < Date.parse(event.startsAt))) {
        issues.push({ path: path + ".event.endsAt", message: "Event end must be valid and cannot precede its start." });
      }
      if (!event.timeZone) issues.push({ path: path + ".event.timeZone", message: "An IANA time zone is required for events." });
      else {
        try { new Intl.DateTimeFormat("en", { timeZone: event.timeZone }); }
        catch { issues.push({ path: path + ".event.timeZone", message: "Invalid IANA time zone " + event.timeZone + "." }); }
      }
      if (event.registrationUrl && !isSafeJournalHref(event.registrationUrl)) {
        issues.push({ path: path + ".event.registrationUrl", message: "Registration links must use HTTPS or a same-origin path." });
      }
    }
    if (entry.coverImage) validateImage(entry.coverImage, path + ".coverImage", issues);
  });

  validateUniqueIds("cvEntries", source.cvEntries, issues);
  source.cvEntries.forEach((entry, index) => {
    const path = "cvEntries[" + index + "]";
    const validYear = Number.isSafeInteger(entry.year) && (entry.year ?? 0) > 0;
    const hasPeriod = Boolean(entry.period?.en?.trim() && entry.period?.fa?.trim());
    if (!validYear && !hasPeriod) {
      issues.push({ path: path + ".year", message: "A CV entry requires a positive year or a period in every supported locale." });
    }
    if (entry.status === "published") {
      for (const locale of locales) {
        if (!entry.title[locale]?.trim()) {
          issues.push({ path: path + ".title." + locale, message: "A published CV entry requires a localized title." });
        }
      }
    }
  });

  const validateSelection = (kind: "featuredArtworkIds" | "featuredGalleryIds", ids: readonly string[], available: Set<string>) => {
    if (new Set(ids).size !== ids.length) issues.push({ path: "homepageSelection." + kind, message: "Homepage selection IDs must be unique." });
    ids.forEach((id, index) => {
      if (!available.has(id)) issues.push({ path: "homepageSelection." + kind + "[" + index + "]", message: "Unknown content ID " + id + "." });
    });
  };
  validateSelection("featuredArtworkIds", source.homepageSelection.featuredArtworkIds, artworkIds);
  validateSelection("featuredGalleryIds", source.homepageSelection.featuredGalleryIds, galleryIds);

  if (source.artistProfile) {
    const profile = source.artistProfile;
    if (!profile.id?.trim()) issues.push({ path: "artistProfile.id", message: "A stable artist profile ID is required." });
    for (const locale of locales) {
      if (!profile.name?.[locale]?.trim()) issues.push({ path: "artistProfile.name." + locale, message: "Artist name is required in every supported locale." });
      if (!profile.statement[locale]?.trim()) issues.push({ path: "artistProfile.statement." + locale, message: "Artist statement is required in every supported locale." });
      if (!profile.biography[locale]?.trim()) issues.push({ path: "artistProfile.biography." + locale, message: "Artist biography is required in every supported locale." });
      if (profile.slug?.[locale] && !isSafeContentSlug(profile.slug[locale]!)) {
        issues.push({ path: "artistProfile.slug." + locale, message: "Artist profile slug must be one safe URL segment." });
      }
    }
    if (profile.portrait) validateImage(profile.portrait, "artistProfile.portrait", issues);
  }

  if (source.cvDocument) {
    const document = source.cvDocument;
    if (!isSafeLocalImagePath(document.src) || !/\.pdf$/i.test(document.src)) {
      issues.push({ path: "cvDocument.src", message: "CV document must be a same-origin PDF path." });
    }
    if (!/^[A-Za-z0-9][A-Za-z0-9._-]*\.pdf$/i.test(document.fileName)) {
      issues.push({ path: "cvDocument.fileName", message: "CV filename must be a safe PDF filename." });
    }
  }

  return issues;
}
