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
  if (href.startsWith("/") && !href.startsWith("//")) return true;
  try { return new URL(href).protocol === "https:"; } catch { return false; }
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

// Publication remains empty until individual works, translations, rights, and groupings are approved.
export const artworks: Artwork[] = [];
export const galleries: Gallery[] = [];
export const journalEntries: JournalEntry[] = [];
export const cvEntries: CvEntry[] = [];
export const artistProfile: ArtistProfile | undefined = undefined;
export const contactDetails: ContactDetails | undefined = undefined;
export const homepageSelection: HomepageSelection = { featuredArtworkIds: [], featuredGalleryIds: [] };
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
  return /^[\\p{L}\\p{N}]+(?:-[\\p{L}\\p{N}]+)*$/u.test(slug);
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
    .sort((a,b) => (b.publishedAt ?? "").localeCompare(a.publishedAt ?? ""));
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
 en: { home:"Home",works:"Works",galleries:"Galleries",journal:"Journal",about:"About",contact:"Contact",cv:"CV / Exhibitions",statement:"Artist statement",biography:"Biography",email:"Email",instagram:"Instagram",language:"Language",menu:"Open navigation",close:"Close navigation",skip:"Skip to content",portfolio:"Artist portfolio",discipline:"Oil painter",selected:"Selected works",selectedIntro:"A considered selection of paintings.",explore:"Explore works",discover:"Discover the galleries",latest:"From the journal",upcoming:"Upcoming event",venue:"Venue",emptyWorks:"Selected paintings will appear here once their images and details are approved for publication.",emptyGalleries:"Curated galleries will appear here when their titles, selections, and cover works are approved.",emptyJournal:"Journal stories and event announcements will appear here when they are ready to publish.",profilePending:"The artist statement and biography will be added after editorial review.",contactPending:"Public contact details have not yet been confirmed.",notFound:"This page could not be found.",returnHome:"Return home",rights:"All rights reserved.",journalAll:"All",journalExhibitions:"Exhibitions",journalEvents:"Events",journalStudio:"Studio updates",journalStories:"Stories",journalNoMatches:"There are no published entries in this category yet.",readMore:"Read more",published:"Published" },
 fa: { home:"خانه",works:"آثار",galleries:"گالری‌ها",journal:"یادداشت‌ها",about:"درباره",contact:"تماس",cv:"رزومه و نمایشگاه‌ها",statement:"بیانیه هنری",biography:"زندگی‌نامه",email:"ایمیل",instagram:"اینستاگرام",language:"زبان",menu:"باز کردن راهبری",close:"بستن راهبری",skip:"رفتن به محتوای اصلی",portfolio:"پورتفولیوی هنرمند",discipline:"نقاش رنگ‌روغن",selected:"گزیده آثار",selectedIntro:"گزیده‌ای از نقاشی‌ها.",explore:"دیدن آثار",discover:"گشت‌وگذار در گالری‌ها",latest:"از یادداشت‌ها",upcoming:"رویداد پیشِ رو",venue:"محل برگزاری",emptyWorks:"آثار پس از تأیید تصاویر و اطلاعات برای انتشار، در این بخش نمایش داده می‌شوند.",emptyGalleries:"گالری‌های منتخب پس از تأیید عنوان، آثار و تصویر اصلی در این بخش قرار می‌گیرند.",emptyJournal:"یادداشت‌ها و اطلاعیه‌های رویداد پس از آماده‌شدن برای انتشار در این بخش نمایش داده می‌شوند.",profilePending:"بیانیه هنری و زندگی‌نامه پس از بررسی و تأیید منتشر خواهند شد.",contactPending:"اطلاعات تماس عمومی هنوز تأیید نشده است.",notFound:"این صفحه پیدا نشد.",returnHome:"بازگشت به خانه",rights:"تمامی حقوق محفوظ است.",journalAll:"همه",journalExhibitions:"نمایشگاه‌ها",journalEvents:"رویدادها",journalStudio:"اخبار آتلیه",journalStories:"روایت‌ها",journalNoMatches:"هنوز مطلب منتشرشده‌ای در این دسته وجود ندارد.",readMore:"ادامه مطلب",published:"انتشار" }
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
