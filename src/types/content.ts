import type { Locale, Localized } from "@/types/locale";

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
  attendanceMode?: "in-person" | "online" | "hybrid";
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
export type ArtistProfile = {
  statement: Localized;
  biography: Localized;
  portrait?: {
    src: string;
    alt: Localized;
    width: number;
    height: number;
    rightsConfirmed: boolean;
  };
  status: Status;
  approvedLocales: Locale[];
  artistApproved: boolean;
};
export type ContactDetails = {
  email?: string;
  telegramHandle?: string;
  instagramUrl?: string;
};
export type CvEntry = {
  id: string;
  category: "education" | "solo-exhibition" | "group-exhibition" | "award" | "publication" | "collection" | "other";
  title: Localized;
  organization?: Localized;
  location?: Localized;
  year: number;
  verified: boolean;
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
