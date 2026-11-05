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
  artistProfile: ArtistProfile;
  cvDocument?: CvDocument;
  contactDetails: ContactDetails;
  siteContent: SiteContent;
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
      if (!localizedSlug?.trim()) {
        issues.push({ path: path + ".localizedSlugs." + locale, message: "A localized slug is required for every supported locale." });
      } else if (!isSafeContentSlug(localizedSlug)) {
        issues.push({ path: path + ".localizedSlugs." + locale, message: "The localized slug must be one safe URL segment." });
      }

      const resolvedSlug = getLocalizedSlug(record, locale);
      if (isSafeContentSlug(resolvedSlug)) {
        const localeSlugs = slugs.get(locale)!;
        if (localeSlugs.has(resolvedSlug)) {
          issues.push({ path: path + ".localizedSlugs." + locale, message: "Duplicate " + locale + " route slug " + resolvedSlug + " in " + kind + "." });
        }
        localeSlugs.add(resolvedSlug);
      }
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
    for (const locale of locales) {
      if (!work.title[locale]?.trim()) issues.push({ path: path + ".title." + locale, message: "Published artwork requires a localized title." });
      if (!work.description?.[locale]?.trim()) issues.push({ path: path + ".description." + locale, message: "Published artwork requires a localized description." });
      if (!primaryImages[0]?.alt[locale]?.trim()) issues.push({ path: path + ".images.primary.alt." + locale, message: "Published artwork requires localized primary-image alt text." });
    }
  });

  source.galleries.forEach((gallery, index) => {
    const path = "galleries[" + index + "]";
    for (const locale of locales) {
      if (!gallery.title[locale]?.trim()) issues.push({ path: path + ".title." + locale, message: "Published gallery requires a localized title." });
      if (!gallery.description[locale]?.trim()) issues.push({ path: path + ".description." + locale, message: "Published gallery requires a localized description." });
    }
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
    if (entry.status === "published") {
      for (const locale of locales) {
        if (!entry.approvedLocales.includes(locale)) issues.push({ path: path + ".approvedLocales", message: "Published Journal entries require locale approval for " + locale + "." });
      }
    }
    if (new Set(entry.approvedLocales).size !== entry.approvedLocales.length) {
      issues.push({ path: path + ".approvedLocales", message: "Approved locales must be unique." });
    }
    entry.approvedLocales.forEach((locale, localeIndex) => {
      if (!locales.includes(locale)) issues.push({ path: path + ".approvedLocales[" + localeIndex + "]", message: "Unsupported locale " + locale + "." });
    });
    if (entry.status === "published") {
      for (const locale of locales) {
        if (!entry.title[locale]?.trim() || !entry.summary[locale]?.trim()) {
          issues.push({ path: path + ".localizedContent." + locale, message: "Published Journal records require a localized title and summary in every supported locale." });
        }
        const blocks = entry.body?.[locale];
        if (!blocks?.length) {
          issues.push({ path: path + ".body." + locale, message: "Published Journal records require a non-empty localized JSON rich-text body in every supported locale." });
        } else {
          blocks.forEach((block, blockIndex) => {
            const blockPath = path + ".body." + locale + "[" + blockIndex + "]";
            if (block.type === "paragraph" || block.type === "heading" || block.type === "quote") {
              if (!block.text.trim()) issues.push({ path: blockPath + ".text", message: "Rich-text block content cannot be empty." });
            } else if (block.type === "list") {
              if (!block.items.length || block.items.some((item) => !item.trim())) {
                issues.push({ path: blockPath + ".items", message: "Rich-text lists require non-empty items." });
              }
            } else if (block.type === "link" && (!block.text.trim() || !isSafeJournalHref(block.href))) {
              issues.push({ path: blockPath, message: "Rich-text links require a label and a safe HTTPS or same-origin destination." });
            }
          });
        }
      }
    }
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

  {
    const profile = source.artistProfile;
    if (!profile.id?.trim()) issues.push({ path: "artistProfile.id", message: "A stable artist profile ID is required." });
    for (const locale of locales) {
      if (!profile.name?.[locale]?.trim()) issues.push({ path: "artistProfile.name." + locale, message: "Artist name is required in every supported locale." });
      if (!profile.statement[locale]?.trim()) issues.push({ path: "artistProfile.statement." + locale, message: "Artist statement is required in every supported locale." });
      if (!profile.biography[locale]?.trim()) issues.push({ path: "artistProfile.biography." + locale, message: "Artist biography is required in every supported locale." });
      if (!profile.slug?.[locale]?.trim()) issues.push({ path: "artistProfile.slug." + locale, message: "Artist profile requires a localized slug in every supported locale." });
      else if (!isSafeContentSlug(profile.slug[locale]!)) issues.push({ path: "artistProfile.slug." + locale, message: "Artist profile slug must be one safe URL segment." });
      if (!profile.discipline?.[locale]?.trim()) issues.push({ path: "artistProfile.discipline." + locale, message: "Artist discipline is required in every supported locale." });
      if (!profile.shortIntroduction?.[locale]?.trim()) issues.push({ path: "artistProfile.shortIntroduction." + locale, message: "Artist introduction is required in every supported locale." });
      if (!profile.artisticApproach?.[locale]?.trim()) issues.push({ path: "artistProfile.artisticApproach." + locale, message: "Artist approach is required in every supported locale." });
      if (!profile.interests?.[locale]?.length || profile.interests[locale]!.some((interest) => !interest.trim())) issues.push({ path: "artistProfile.interests." + locale, message: "Artist interests require non-empty localized entries." });
    }
    if (profile.portrait) validateImage(profile.portrait, "artistProfile.portrait", issues);
  }

  {
    const site = source.siteContent;
    if (!site.id?.trim()) issues.push({ path: "siteContent.id", message: "A stable site metadata ID is required." });
    for (const page of ["works", "galleries", "journal", "cv"] as const) {
      for (const locale of locales) {
        if (!site.pages?.[page]?.title?.[locale]?.trim()) issues.push({ path: "siteContent.pages." + page + ".title." + locale, message: "Localized page title is required." });
        if (!site.pages?.[page]?.description?.[locale]?.trim()) issues.push({ path: "siteContent.pages." + page + ".description." + locale, message: "Localized page description is required." });
      }
    }
  }

  {
    const contact = source.contactDetails;
    for (const locale of locales) {
      if (!contact.title?.[locale]?.trim()) issues.push({ path: "contactDetails.title." + locale, message: "Localized Contact title is required." });
      if (!contact.description?.[locale]?.trim()) issues.push({ path: "contactDetails.description." + locale, message: "Localized Contact description is required." });
    }
    let validDestination = false;
    if (contact.email) {
      if (/^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(contact.email)) validDestination = true;
      else issues.push({ path: "contactDetails.email", message: "Contact email must be a valid email address." });
    }
    if (contact.telegramHandle) {
      if (/^[A-Za-z0-9_]{5,32}$/.test(contact.telegramHandle)) validDestination = true;
      else issues.push({ path: "contactDetails.telegramHandle", message: "Telegram handle must be a valid public handle." });
    }
    if (contact.instagramUrl) {
      try {
        const url = new URL(contact.instagramUrl);
        const segments = url.pathname.split("/").filter(Boolean);
        if (url.protocol === "https:" && ["instagram.com", "www.instagram.com"].includes(url.hostname) && segments.length === 1 && /^[A-Za-z0-9._]{1,30}$/.test(segments[0])) validDestination = true;
        else issues.push({ path: "contactDetails.instagramUrl", message: "Instagram destination must be a valid HTTPS profile URL." });
      } catch {
        issues.push({ path: "contactDetails.instagramUrl", message: "Instagram destination must be a valid HTTPS profile URL." });
      }
    }
    if (!validDestination) issues.push({ path: "contactDetails", message: "At least one owner-supplied public Contact destination is required." });
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
