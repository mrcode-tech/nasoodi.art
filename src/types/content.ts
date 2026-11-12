import type { Locale, Localized } from "./locale";

export type Status = "draft" | "scheduled" | "needs-review" | "approved" | "published" | "archived";
export type ImageRecord = {
  src: string;
  alt: Localized;
  role: "primary" | "detail" | "installation";
  width: number;
  height: number;
};
export type Artwork = {
  id: string;
  slug: string;
  localizedSlugs?: Partial<Record<Locale, string>>;
  title: Localized;
  images: ImageRecord[];
  rightsConfirmed: boolean;
  status: Status;
  year?: number;
  medium?: Localized;
  description?: Localized;
  sortOrder?: number;
};
export type Gallery = {
  id: string;
  slug: string;
  localizedSlugs?: Partial<Record<Locale, string>>;
  title: Localized;
  description: Localized;
  coverArtworkId: string;
  artworkIds: string[];
  status: Status;
  sortOrder: number;
};
export type JournalEvent = {
  startsAt: string;
  endsAt?: string;
  timeZone: string;
  venue?: Localized;
  /** Full venue address, required for in-person and hybrid event publication. */
  address?: Localized;
  attendanceMode?: "in-person" | "online" | "hybrid";
  /** Public URL for the virtual venue, required for online and hybrid events. */
  onlineUrl?: string;
  registrationUrl?: string;
};
export type JournalCategory = "exhibition" | "event" | "studio-update" | "story";
export type JournalTextBlock =
  | { type: "paragraph"; text: string }
  | { type: "heading"; level: 2 | 3; text: string }
  | { type: "list"; ordered?: boolean; items: string[] }
  | { type: "quote"; text: string; attribution?: string }
  | { type: "link"; text: string; href: string };
export type LocalizedRichText = Partial<Record<Locale, JournalTextBlock[]>>;
export type JournalEntry = {
  id: string;
  slug: string;
  localizedSlugs?: Partial<Record<Locale, string>>;
  type: JournalCategory;
  title: Localized;
  summary: Localized;
  body?: LocalizedRichText;
  coverImage?: {
    src: string;
    alt: Localized;
    width: number;
    height: number;
    rightsConfirmed: boolean;
  };
  status: Status;
  publishedAt?: string;
  approvedLocales: Locale[];
  artistApproved: boolean;
  event?: JournalEvent;
};
export type ArtistNameAlias = {
  value: string;
  kind: "transliteration" | "orthographic" | "spacing" | "hyphenation" | "complete-name";
  confidence: "core" | "supported" | "exploratory";
  /** Explicit publication order for reviewed complete-name JSON-LD aliases; lower values come first. */
  structuredDataPriority?: number;
  note?: string;
};
export type ArtistNameAliasLocale = {
  given: ArtistNameAlias[];
  middle: ArtistNameAlias[];
  family: ArtistNameAlias[];
  completeName: ArtistNameAlias[];
  partialSearchQueries: string[];
};
export type ArtistNameAliasInventory = Record<Locale, ArtistNameAliasLocale>;
export type ArtistProfile = {
  id?: string;
  name?: Localized;
  nameAliases?: ArtistNameAliasInventory;
  brand?: string;
  slug?: Localized;
  discipline?: Localized;
  shortIntroduction?: Localized;
  artisticApproach?: Localized;
  interests?: Partial<Record<Locale, string[]>>;
  statement: Localized;
  biography: Localized;
  portrait?: {
    src: string;
    alt: Localized;
    width: number;
    height: number;
    rightsConfirmed: boolean;
  };
};
export type ContactDetails = {
  title?: Localized;
  description?: Localized;
  email?: string;
  telegramHandle?: string;
  instagramUrl?: string;
};
export type CvEntry = {
  id: string;
  category: "education" | "membership" | "teaching" | "solo-exhibition" | "group-exhibition" | "award" | "publication" | "collection" | "other";
  title: Localized;
  organization?: Localized;
  location?: Localized;
  year?: number;
  period?: Localized;
  status: Status;
  sortOrder?: number;
};
export type CvDocument = {
  src: string;
  fileName: string;
  artistApproved: boolean;
  status: Status;
};
export type HomepageSelection = {
  heroArtworkId?: string;
  featuredArtworkIds: string[];
  featuredGalleryIds: string[];
};

export type SiteContent = {
  id: string;
  entranceArtworkId?: string;
  pages: Record<"works" | "galleries" | "journal" | "cv", {
    title: Record<Locale, string>;
    description: Record<Locale, string>;
  }>;
};
