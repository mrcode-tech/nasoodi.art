import { approvedArtworkImageDimensions } from "./approved-artwork-image-dimensions";
export const locales = ["fa", "en"] as const;
export type Locale = (typeof locales)[number];
export const isLocale = (v: string): v is Locale => locales.includes(v as Locale);
export const otherLocale = (l: Locale): Locale => l === "fa" ? "en" : "fa";
export const pagePath = (l: Locale, p = "") => `/${l}${p ? `/${p.replace(/^\/+/, "")}` : ""}`;
export type Localized = Partial<Record<Locale, string>>;
export type Status = "draft" | "scheduled" | "needs-review" | "approved" | "published" | "archived";
export type ImageRecord = { src: string; alt: Localized; role: "primary" | "detail" | "installation"; width: number; height: number };
export type Artwork = { id: string; slug: string; title: Localized; images: ImageRecord[]; rightsConfirmed: boolean; status: Status; year?: number; medium?: Localized; description?: Localized; sortOrder?: number };
export type Gallery = { id: string; slug: string; title: Localized; description: Localized; coverArtworkId: string; artworkIds: string[]; status: Status; sortOrder: number };
export type JournalEvent = { startsAt: string; endsAt?: string; timeZone: string; venue?: Localized; attendanceMode?: "in-person" | "online" | "hybrid"; registrationUrl?: string };
export type JournalCategory = "exhibition" | "event" | "studio-update" | "story";
export type JournalTextBlock =
  | { type: "paragraph"; text: string }
  | { type: "heading"; level: 2 | 3; text: string }
  | { type: "list"; ordered?: boolean; items: string[] }
  | { type: "quote"; text: string; attribution?: string }
  | { type: "link"; text: string; href: string };
export type LocalizedRichText = Partial<Record<Locale, JournalTextBlock[]>>;
export type JournalEntry = { id: string; slug: string; type: JournalCategory; title: Localized; summary: Localized; body?: LocalizedRichText; status: Status; publishedAt?: string; approvedLocales: Locale[]; artistApproved: boolean; event?: JournalEvent };
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
export type ArtistProfile = {
  statement: Localized;
  biography: Localized;
  portrait?: { src: string; alt: Localized; width: number; height: number; rightsConfirmed: boolean };
  status: Status;
  approvedLocales: Locale[];
  artistApproved: boolean;
};
export type ContactDetails = {
  email?: string;
  instagramUrl?: string;
  approvedLocales: Locale[];
  ownerApproved: boolean;
};
export type CvEntry = { id: string; category: "education" | "solo-exhibition" | "group-exhibition" | "award" | "publication" | "collection" | "other"; title: Localized; organization?: Localized; location?: Localized; year: number; verified: boolean; status: Status; sortOrder?: number };
export type CvDocument = { src: string; fileName: string; artistApproved: boolean; status: Status };
export type HomepageSelection = { heroArtworkId?: string; featuredArtworkIds: string[]; featuredGalleryIds: string[] };

// JSON-LD contains only owner-supplied identity facts that are also visible on the homepage.
export const portfolioStructuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Person",
      "@id": "https://nasoodi.art/#artist",
      name: "Ghazaleh Abdolahzade Nasoodi",
      alternateName: "غزاله عبداله زاده نسودی",
      jobTitle: "Oil painter",
      url: "https://nasoodi.art/",
    },
    {
      "@type": "WebSite",
      "@id": "https://nasoodi.art/#website",
      name: "Nasoodi.art",
      url: "https://nasoodi.art/",
      inLanguage: ["fa", "en"],
      publisher: { "@id": "https://nasoodi.art/#artist" },
    },
  ],
} as const;

// The five source photographs were explicitly approved by the site owner for public portfolio use.
// Public derivatives are copied from specification/assets/gallery by scripts/copy-approved-gallery-assets.mjs.
// Intrinsic dimensions are generated from each source JPEG before dev/build, preserving its exact aspect ratio.
const approvedArtworkImages = [
  { src: "/images/approved-artwork-1.jpg", alt: { en: "Painting titled A Quiet Place Between Seasons", fa: "تابلوی نقاشی با عنوان «آرامش میان فصل‌ها»" }, role: "primary" as const, width: approvedArtworkImageDimensions[0].width, height: approvedArtworkImageDimensions[0].height },
  { src: "/images/approved-artwork-2.jpg", alt: { en: "Painting titled The Shape of Remembering", fa: "تابلوی نقاشی با عنوان «شکلِ خاطره»" }, role: "primary" as const, width: approvedArtworkImageDimensions[1].width, height: approvedArtworkImageDimensions[1].height },
  { src: "/images/approved-artwork-3.jpg", alt: { en: "Painting titled Where Light Rests", fa: "تابلوی نقاشی با عنوان «جایی که نور می‌آرامد»" }, role: "primary" as const, width: approvedArtworkImageDimensions[2].width, height: approvedArtworkImageDimensions[2].height },
  { src: "/images/approved-artwork-4.jpg", alt: { en: "Painting titled A Garden of Small Moments", fa: "تابلوی نقاشی با عنوان «باغ لحظه‌های کوچک»" }, role: "primary" as const, width: approvedArtworkImageDimensions[3].width, height: approvedArtworkImageDimensions[3].height },
  { src: "/images/approved-artwork-5.jpg", alt: { en: "Painting titled The Blue Hour Within", fa: "تابلوی نقاشی با عنوان «ساعت آبی درون»" }, role: "primary" as const, width: approvedArtworkImageDimensions[4].width, height: approvedArtworkImageDimensions[4].height },
];

export const artworks: Artwork[] = [
  { id: "artwork-quiet-place", slug: "a-quiet-place-between-seasons", title: { en: "A Quiet Place Between Seasons", fa: "آرامش میان فصل‌ها" }, description: { en: "A visual pause shaped around stillness and the quiet rhythm of looking. Its open-ended title leaves room for a personal reading.", fa: "مکثی تصویری در فضایی از سکون و تماشای آرام؛ عنوانی گشوده که به هر بیننده فرصت می‌دهد برداشت شخصی خود را از اثر داشته باشد." }, images: [approvedArtworkImages[0]], rightsConfirmed: true, status: "published", sortOrder: 1 },
  { id: "artwork-shape-of-remembering", slug: "the-shape-of-remembering", title: { en: "The Shape of Remembering", fa: "شکلِ خاطره" }, description: { en: "A reflection on the way memory gathers fragments into something felt rather than fully explained.", fa: "تأملی درباره‌ی شیوه‌ای که خاطره، تکه‌های پراکنده را کنار هم می‌نشاند و حسی فراتر از توضیح به وجود می‌آورد." }, images: [approvedArtworkImages[1]], rightsConfirmed: true, status: "published", sortOrder: 2 },
  { id: "artwork-where-light-rests", slug: "where-light-rests", title: { en: "Where Light Rests", fa: "جایی که نور می‌آرامد" }, description: { en: "An invitation to slow down and notice the delicate relationship between light, atmosphere, and attention.", fa: "دعوتی به آهسته‌تر دیدن و توجه به رابطه‌ی ظریف میان نور، فضا و نگاه." }, images: [approvedArtworkImages[2]], rightsConfirmed: true, status: "published", sortOrder: 3 },
  { id: "artwork-garden-small-moments", slug: "a-garden-of-small-moments", title: { en: "A Garden of Small Moments", fa: "باغ لحظه‌های کوچک" }, description: { en: "A gentle meditation on the small moments that accumulate into a larger sense of presence.", fa: "نگاهی آرام به لحظه‌های کوچکی که در کنار هم، معنای گسترده‌تری از حضور و زندگی می‌سازند." }, images: [approvedArtworkImages[3]], rightsConfirmed: true, status: "published", sortOrder: 4 },
  { id: "artwork-blue-hour-within", slug: "the-blue-hour-within", title: { en: "The Blue Hour Within", fa: "ساعت آبی درون" }, description: { en: "A contemplative title for a work that invites an inward journey and an unhurried encounter.", fa: "عنوانی تأمل‌برانگیز برای اثری که مخاطب را به سفری درونی و مواجهه‌ای بی‌شتاب دعوت می‌کند." }, images: [approvedArtworkImages[4]], rightsConfirmed: true, status: "published", sortOrder: 5 },
];

export const galleries: Gallery[] = [
  { id: "gallery-quiet-intervals", slug: "quiet-intervals", title: { en: "Quiet Intervals", fa: "فاصله‌های آرام" }, description: { en: "A considered sequence of works for an unhurried encounter with stillness, reflection, and the spaces between moments.", fa: "چیدمانی برای مواجهه‌ای بی‌شتاب با سکون، تأمل و فاصله‌هایی که میان لحظه‌ها شکل می‌گیرند." }, coverArtworkId: "artwork-quiet-place", artworkIds: ["artwork-quiet-place", "artwork-where-light-rests", "artwork-garden-small-moments"], status: "published", sortOrder: 1 },
  { id: "gallery-color-conversation", slug: "color-in-conversation", title: { en: "Color in Conversation", fa: "گفت‌وگوی رنگ‌ها" }, description: { en: "A visual route through selected works, inviting attention to the mood and relationships that emerge when paintings are viewed together.", fa: "مسیر دیداری‌ای میان چند اثر منتخب که با کنار هم دیدن آن‌ها می‌توان به حال‌وهوا و رابطه‌های تازه میان نقاشی‌ها توجه کرد." }, coverArtworkId: "artwork-where-light-rests", artworkIds: ["artwork-where-light-rests", "artwork-shape-of-remembering", "artwork-blue-hour-within"], status: "published", sortOrder: 2 },
  { id: "gallery-fragments-memory", slug: "fragments-of-memory", title: { en: "Fragments of Memory", fa: "پاره‌های خاطره" }, description: { en: "A small collection arranged around recollection, personal association, and the poetry of details.", fa: "مجموعه‌ای کوچک با محوریت یادآوری، تداعی‌های شخصی و شاعرانگی جزئیات." }, coverArtworkId: "artwork-shape-of-remembering", artworkIds: ["artwork-shape-of-remembering", "artwork-garden-small-moments", "artwork-blue-hour-within"], status: "published", sortOrder: 3 },
  { id: "gallery-selected-works", slug: "selected-works", title: { en: "Selected Works", fa: "گزیده آثار" }, description: { en: "Five paintings brought together as an introduction to this selection of the artist’s work.", fa: "پنج نقاشی در کنار هم؛ آشنایی‌ای کوتاه با این گزیده از آثار هنرمند." }, coverArtworkId: "artwork-quiet-place", artworkIds: ["artwork-quiet-place", "artwork-shape-of-remembering", "artwork-where-light-rests", "artwork-garden-small-moments", "artwork-blue-hour-within"], status: "published", sortOrder: 4 },
];
export const journalEntries: JournalEntry[] = [];
export const cvEntries: CvEntry[] = [];
// No artist-approved public CV PDF has been supplied yet.
export const cvDocument: CvDocument | undefined = undefined;
export const artistProfile: ArtistProfile | undefined = undefined;
export const contactDetails: ContactDetails | undefined = undefined;
export const homepageSelection: HomepageSelection = { featuredArtworkIds: ["artwork-quiet-place", "artwork-shape-of-remembering", "artwork-where-light-rests", "artwork-garden-small-moments", "artwork-blue-hour-within"], featuredGalleryIds: ["gallery-quiet-intervals", "gallery-color-conversation", "gallery-fragments-memory", "gallery-selected-works"] };
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
            url: `https://nasoodi.art${pagePath(locale, `works/${work.slug}`)}`,
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
  if (entry.type === "event" && entry.event) {
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
    Boolean(work.id.trim()) && isSafeContentSlug(work.slug) &&
    Boolean(work.title[locale]?.trim()) && Boolean(primaryImageFor(work)?.alt[locale]?.trim()));
  return keepUniqueBy(keepUniqueBy(visible, (work) => work.id), (work) => work.slug)
    .sort((a,b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));
}
export function getPublicGalleries(items: Gallery[], works: Artwork[], locale: Locale) {
  const ids = new Set(getPublicArtworks(works, locale).map((work) => work.id));
  const visible = items.filter((g) => g.status === "published" && Boolean(g.id.trim()) &&
    isSafeContentSlug(g.slug) && Boolean(g.title[locale]?.trim()) &&
    Boolean(g.description[locale]?.trim()) && g.artworkIds.length > 0 &&
    new Set(g.artworkIds).size === g.artworkIds.length && g.artworkIds.includes(g.coverArtworkId) &&
    g.artworkIds.every((id) => ids.has(id)));
  return keepUniqueBy(keepUniqueBy(visible, (gallery) => gallery.id), (gallery) => gallery.slug)
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
      !entry.id.trim() || !isSafeContentSlug(entry.slug) || !entry.title[locale]?.trim() || !entry.summary[locale]?.trim()) return false;
    if (entry.type !== "event") return true;
    const event = entry.event;
    if (!event || !hasExplicitTimeZone(event.startsAt) || !event.timeZone ||
      (!event.venue?.[locale]?.trim() && !event.attendanceMode)) return false;
    try { new Intl.DateTimeFormat(locale, { timeZone: event.timeZone }); } catch { return false; }
    if (event.endsAt && (!hasExplicitTimeZone(event.endsAt) || Date.parse(event.endsAt) < Date.parse(event.startsAt))) return false;
    if (event.registrationUrl) {
      try { if (new URL(event.registrationUrl).protocol !== "https:") return false; } catch { return false; }
    }
    return true;
  });
  return keepUniqueBy(keepUniqueBy(visible, (entry) => entry.id), (entry) => entry.slug)
    .sort((a,b) => {
      const timestamp = (entry: JournalEntry) => entry.publishedAt && Number.isFinite(Date.parse(entry.publishedAt)) ? Date.parse(entry.publishedAt) : Number.NEGATIVE_INFINITY;
      return timestamp(b) - timestamp(a);
    });
}
export function getHomepageJournalPreview(items: JournalEntry[], locale: Locale): JournalEntry[] {
  return getPublicJournal(items, locale).slice(0, 2);
}
export function getUpcomingJournalEvents(items: JournalEntry[], locale: Locale, now: Date = new Date()) {
  const nowMs = now.getTime();
  return getPublicJournal(items, locale)
    .filter((entry) => entry.type === "event" && entry.event !== undefined && Date.parse(entry.event.startsAt) > nowMs)
    .sort((a, b) => Date.parse(a.event!.startsAt) - Date.parse(b.event!.startsAt));
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
export function getPublicContactDetails(details: ContactDetails | undefined, locale: Locale) {
  if (!details || !details.ownerApproved || !details.approvedLocales.includes(locale)) return undefined;
  const email = details.email?.trim();
  const validEmail = email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ? email : undefined;
  let instagramUrl: string | undefined;
  if (details.instagramUrl) {
    try {
      const url = new URL(details.instagramUrl);
      if (url.protocol === "https:" && (url.hostname === "instagram.com" || url.hostname === "www.instagram.com")) {
        instagramUrl = url.toString();
      }
    } catch { /* Invalid external destinations are omitted. */ }
  }
  return validEmail || instagramUrl ? { email: validEmail, instagramUrl } : undefined;
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
export const copy = {
 en: { home:"Home",works:"Works",galleries:"Galleries",journal:"Journal",about:"About",contact:"Contact",cv:"CV / Exhibitions",statement:"Artist statement",biography:"Biography",email:"Email",instagram:"Instagram",language:"Language",menu:"Open navigation",close:"Close navigation",skip:"Skip to content",portfolio:"Artist portfolio",discipline:"Oil painter",selected:"Selected works",selectedIntro:"A considered selection of paintings.",explore:"Explore works",discover:"Discover the galleries",latest:"From the journal",upcoming:"Upcoming event",venue:"Venue",emptyWorks:"Selected paintings will appear here once their images and details are approved for publication.",emptyGalleries:"Curated galleries will appear here when their titles, selections, and cover works are approved.",emptyJournal:"Journal stories and event announcements will appear here when they are ready to publish.",profilePending:"The artist statement and biography will be added after editorial review.",contactPending:"Public contact details have not yet been confirmed.",notFound:"This page could not be found.",returnHome:"Return home",rights:"All rights reserved.",journalAll:"All",journalExhibitions:"Exhibitions",journalEvents:"Events",journalStudio:"Studio updates",journalStories:"Stories",journalNoMatches:"There are no published entries in this category yet.",readMore:"Read more",aboutArtist:"About the artist",showLess:"Show less",downloadCvPdf:"Download CV (PDF)",sampleContentNotice:"Sample content for design review — not artist-approved or publishable.",samplePreviewNotice:"Sample preview: all copy and CV entries are fictional layout fixtures and are not approved for publication.",samplePdfNotice:"This clearly marked fictional PDF is available for preview testing only; it is not a real artist CV.",published:"Published",itemsPerPage:"Items per page",previousPage:"Previous page",nextPage:"Next page",galleryPage:"Gallery page",showingGalleries:"Showing {start}–{end} of {total} galleries" },
 fa: { home:"خانه",works:"آثار",galleries:"گالری‌ها",journal:"یادداشت‌ها",about:"درباره",contact:"تماس",cv:"رزومه و نمایشگاه‌ها",statement:"بیانیه هنری",biography:"زندگی‌نامه",email:"ایمیل",instagram:"اینستاگرام",language:"زبان",menu:"باز کردن راهبری",close:"بستن راهبری",skip:"رفتن به محتوای اصلی",portfolio:"پورتفولیوی هنرمند",discipline:"نقاش رنگ‌روغن",selected:"گزیده آثار",selectedIntro:"گزیده‌ای از نقاشی‌ها.",explore:"دیدن آثار",discover:"گشت‌وگذار در گالری‌ها",latest:"از یادداشت‌ها",upcoming:"رویداد پیشِ رو",venue:"محل برگزاری",emptyWorks:"آثار پس از تأیید تصاویر و اطلاعات برای انتشار، در این بخش نمایش داده می‌شوند.",emptyGalleries:"گالری‌های منتخب پس از تأیید عنوان، آثار و تصویر اصلی در این بخش قرار می‌گیرند.",emptyJournal:"یادداشت‌ها و اطلاعیه‌های رویداد پس از آماده‌شدن برای انتشار در این بخش نمایش داده می‌شوند.",profilePending:"بیانیه هنری و زندگی‌نامه پس از بررسی و تأیید منتشر خواهند شد.",contactPending:"اطلاعات تماس عمومی هنوز تأیید نشده است.",notFound:"این صفحه پیدا نشد.",returnHome:"بازگشت به خانه",rights:"تمامی حقوق محفوظ است.",journalAll:"همه",journalExhibitions:"نمایشگاه‌ها",journalEvents:"رویدادها",journalStudio:"اخبار آتلیه",journalStories:"روایت‌ها",journalNoMatches:"هنوز مطلب منتشرشده‌ای در این دسته وجود ندارد.",readMore:"ادامه مطلب",aboutArtist:"درباره هنرمند",showLess:"نمایش کمتر",downloadCvPdf:"دریافت رزومه (PDF)",sampleContentNotice:"متن نمونه برای بررسی طراحی؛ تأییدنشده و غیرقابل انتشار",samplePreviewNotice:"پیش‌نمایش نمونه: تمام متن‌ها و سوابق این صفحه ساختگی‌اند و برای انتشار تأیید نشده‌اند.",samplePdfNotice:"این فایل PDF کاملاً ساختگی و فقط برای آزمایش پیش‌نمایش است؛ رزومه‌ی واقعی هنرمند نیست.",published:"انتشار",itemsPerPage:"تعداد در هر صفحه",previousPage:"صفحه قبل",nextPage:"صفحه بعد",galleryPage:"صفحه گالری‌ها",showingGalleries:"نمایش {start} تا {end} از {total} گالری" }
} as const;
export const copyFor = (l: Locale) => copy[l];

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
  if (section === "cv") {
    return getPublicCvEntries(cvEntries, target).length > 0 ? pagePath(target, "cv") : pagePath(target);
  }
  if (section === "works") {
    const items = getPublicArtworks(artworks, target);
    if (!slug) return items.length > 0 ? pagePath(target, "works") : pagePath(target);
    return items.some((item) => item.slug === slug) ? pagePath(target, `works/${slug}`) : pagePath(target);
  }
  if (section === "galleries") {
    const items = getPublicGalleries(galleries, artworks, target);
    if (!slug) return items.length > 0 ? pagePath(target, "galleries") : pagePath(target);
    return items.some((item) => item.slug === slug) ? pagePath(target, `galleries/${slug}`) : pagePath(target);
  }
  if (section === "journal") {
    const items = getPublicJournal(journalEntries, target);
    if (!slug) return items.length > 0 ? pagePath(target, "journal") : pagePath(target);
    return items.some((item) => item.slug === slug) ? pagePath(target, `journal/${slug}`) : pagePath(target);
  }
  return pagePath(target);
}
