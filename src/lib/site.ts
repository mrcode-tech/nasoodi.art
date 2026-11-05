/**
 * Backwards-compatible application barrel.
 *
 * New code should import from the focused content, routing, and SEO modules.
 * Existing consumers can migrate incrementally without changing public behavior.
 */
export { locales, isLocale, otherLocale, pagePath } from "../types/locale";
export type { Locale, Localized } from "../types/locale";
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
  JournalEntry,
  JournalEvent,
  JournalTextBlock,
  LocalizedRichText,
  Status,
} from "../types/content";

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
} from "../content/portfolio";

export {
  getLocalizedSlug,
  isSafeContentSlug,
  isSafeLocalImagePath,
} from "./content/paths";
export type { LocalizedSlugRecord } from "./content/paths";

export {
  hasSharedContentIdentity,
  hasEquivalentContentSet,
} from "./content/identity";

export {
  primaryImageFor,
  getPublicArtworks,
  getPublicGalleries,
  getGalleryCoverArtwork,
  getPublicCvEntries,
  getPublicCvDocument,
  getPublicArtistProfile,
  getPublicContactDetails,
  getHomepageHero,
  getHomepageFeaturedArtworks,
  getHomepageFeaturedGalleries,
} from "./content/publication";
export type { PublicContactDetails } from "./content/publication";

export {
  isSafeJournalHref,
  journalCategories,
  journalCategoryFor,
  getJournalEntriesForCategory,
  hasExplicitTimeZone,
  getPublicJournal,
  journalCoverImageFor,
  getHomepageJournalPreview,
  getUpcomingJournalEvents,
  getUpcomingJournalEvent,
} from "./content/journal";

export {
  serializeJsonLd,
  getArtworkStructuredData,
  getGalleryStructuredData,
  getJournalStructuredData,
} from "./seo/structured-data";

export { alternatePathFor } from "./routing/alternate-path";
