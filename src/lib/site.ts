import {
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
import { isLocale, locales, otherLocale, pagePath } from "@/types/locale";
import type { Locale, Localized } from "@/types/locale";
import type {
  Artwork,
  ArtistProfile,
  ContactDetails,
  CvDocument,
  CvEntry,
  Gallery,
  HomepageSelection,
  JournalEntry,
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

export type PublicContactDetails = {
  email?: string;
  telegramHandle?: string;
  telegramUrl?: string;
  instagramHandle?: string;
  instagramUrl?: string;
};

export function isSafeJournalHref(href: string): boolean {
  if (!href || href.includes("\\") || /[\\u0000-\\u001f]/.test(href)) return false;
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
  return keepUniqueBy(keepUniqueBy(visible, (entry) => entry.id), (entry) => entry.slug)
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
export const copy = {
 en: { home:"Home",works:"Works",galleries:"Galleries",journal:"Journal",about:"About",contact:"Contact",cv:"CV / Exhibitions",statement:"Artist statement",biography:"Biography",email:"Email",instagram:"Instagram",telegram:"Telegram",contactHeading:"Let's start a conversation.",contactIntro:"For exhibition inquiries, collaborations, or to share your thoughts about the artwork, feel free to get in touch.",language:"Language",menu:"Open navigation",close:"Close navigation",skip:"Skip to content",portfolio:"Artist portfolio",discipline:"Oil painter",selected:"Selected works",selectedIntro:"A considered selection of paintings.",explore:"Explore works",discover:"Discover the galleries",latest:"From the journal",upcoming:"Upcoming event",announcementEyebrow:"UPCOMING EXHIBITION",dismissAnnouncement:"Dismiss exhibition announcement",publicationDate:"Published",eventDate:"Event date",eventEnds:"Ends",eventVenue:"Venue",attendanceMode:"Attendance",inPerson:"In person",online:"Online",hybrid:"Hybrid",registration:"Details and registration",emptyWorks:"Selected paintings will appear here once their images and details are approved for publication.",emptyGalleries:"Curated galleries will appear here when their titles, selections, and cover works are approved.",emptyJournal:"Journal stories and event announcements will appear here when they are ready to publish.",profilePending:"The artist statement and biography will be added after editorial review.",contactPending:"Public contact details have not yet been confirmed.",notFound:"This page could not be found.",returnHome:"Return home",rights:"All rights reserved.",journalAll:"All",journalExhibitions:"Exhibitions",journalEvents:"Events",journalStudio:"Studio updates",journalStories:"Stories",journalNoMatches:"There are no published entries in this category yet.",readMore:"Read more",aboutArtist:"About the artist",showLess:"Show less",downloadCvPdf:"Download CV (PDF)",sampleContentNotice:"Sample content for design review — not artist-approved or publishable.",samplePreviewNotice:"Sample preview: all copy and CV entries are fictional layout fixtures and are not approved for publication.",samplePdfNotice:"This clearly marked fictional PDF is available for preview testing only; it is not a real artist CV.",published:"Published",itemsPerPage:"Items per page",previousPage:"Previous page",nextPage:"Next page",galleryPage:"Gallery page",showingGalleries:"Showing {start}–{end} of {total} galleries",showingJournal:"Showing {start}–{end} of {total} Journal entries",journalPage:"Journal pages" },
 fa: { home:"خانه",works:"آثار",galleries:"گالری‌ها",journal:"یادداشت‌ها",about:"درباره",contact:"تماس",cv:"رزومه و نمایشگاه‌ها",statement:"بیانیه هنری",biography:"زندگی‌نامه",email:"ایمیل",instagram:"اینستاگرام",telegram:"تلگرام",contactHeading:"بیایید گفت‌وگویی را آغاز کنیم.",contactIntro:"برای پرسش درباره نمایشگاه‌ها، همکاری‌ها یا به‌اشتراک‌گذاشتن دیدگاهتان درباره آثار، می‌توانید با من در ارتباط باشید.",language:"زبان",menu:"باز کردن راهبری",close:"بستن راهبری",skip:"رفتن به محتوای اصلی",portfolio:"پورتفولیوی هنرمند",discipline:"نقاش رنگ‌روغن",selected:"گزیده آثار",selectedIntro:"گزیده‌ای از نقاشی‌ها.",explore:"دیدن آثار",discover:"گشت‌وگذار در گالری‌ها",latest:"از یادداشت‌ها",upcoming:"رویداد پیشِ رو",announcementEyebrow:"نمایشگاه پیشِ رو",dismissAnnouncement:"بستن اطلاعیه نمایشگاه",publicationDate:"تاریخ انتشار",eventDate:"تاریخ رویداد",eventEnds:"پایان",eventVenue:"محل برگزاری",attendanceMode:"شیوه حضور",inPerson:"حضوری",online:"آنلاین",hybrid:"ترکیبی",registration:"اطلاعات رویداد",emptyWorks:"آثار پس از تأیید تصاویر و اطلاعات برای انتشار، در این بخش نمایش داده می‌شوند.",emptyGalleries:"گالری‌های منتخب پس از تأیید عنوان، آثار و تصویر اصلی در این بخش قرار می‌گیرند.",emptyJournal:"یادداشت‌ها و اطلاعیه‌های رویداد پس از آماده‌شدن برای انتشار در این بخش نمایش داده می‌شوند.",profilePending:"بیانیه هنری و زندگی‌نامه پس از بررسی و تأیید منتشر خواهند شد.",contactPending:"اطلاعات تماس عمومی هنوز تأیید نشده است.",notFound:"این صفحه پیدا نشد.",returnHome:"بازگشت به خانه",rights:"تمامی حقوق محفوظ است.",journalAll:"همه",journalExhibitions:"نمایشگاه‌ها",journalEvents:"رویدادها",journalStudio:"اخبار آتلیه",journalStories:"روایت‌ها",journalNoMatches:"هنوز مطلب منتشرشده‌ای در این دسته وجود ندارد.",readMore:"ادامه مطلب",aboutArtist:"درباره هنرمند",showLess:"نمایش کمتر",downloadCvPdf:"دریافت رزومه (PDF)",sampleContentNotice:"متن نمونه برای بررسی طراحی؛ تأییدنشده و غیرقابل انتشار",samplePreviewNotice:"پیش‌نمایش نمونه: تمام متن‌ها و سوابق این صفحه ساختگی‌اند و برای انتشار تأیید نشده‌اند.",samplePdfNotice:"این فایل PDF کاملاً ساختگی و فقط برای آزمایش پیش‌نمایش است؛ رزومه‌ی واقعی هنرمند نیست.",published:"انتشار",itemsPerPage:"تعداد در هر صفحه",previousPage:"صفحه قبل",nextPage:"صفحه بعد",galleryPage:"صفحه گالری‌ها",showingGalleries:"نمایش {start} تا {end} از {total} گالری",showingJournal:"نمایش {start} تا {end} از {total} مطلب",journalPage:"صفحه‌بندی یادداشت‌ها" }
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
