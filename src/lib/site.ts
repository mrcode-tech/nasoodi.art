export const locales = ["fa", "en"] as const;
export type Locale = (typeof locales)[number];
export const isLocale = (v: string): v is Locale => locales.includes(v as Locale);
export const otherLocale = (l: Locale): Locale => l === "fa" ? "en" : "fa";
export const pagePath = (l: Locale, p = "") => `/${l}${p ? `/${p.replace(/^\/+/, "")}` : ""}`;
export type Localized = Partial<Record<Locale, string>>;
export type Status = "draft" | "needs-review" | "approved" | "published" | "archived";
export type ImageRecord = { src: string; alt: Localized; role: "primary" | "detail" | "installation"; width: number; height: number };
export type Artwork = { id: string; slug: string; title: Localized; images: ImageRecord[]; rightsConfirmed: boolean; status: Status; year?: number; medium?: Localized; description?: Localized; sortOrder?: number };
export type Gallery = { id: string; slug: string; title: Localized; description: Localized; coverArtworkId: string; artworkIds: string[]; status: Status; sortOrder: number };
export type JournalEntry = { id: string; slug: string; type: "article" | "event"; title: Localized; summary: Localized; body?: Localized; status: Status; publishedAt?: string };
// Publication remains empty until individual works, translations, rights, and groupings are approved.
export const artworks: Artwork[] = [];
export const galleries: Gallery[] = [];
export const journalEntries: JournalEntry[] = [];
export function primaryImageFor(work: Artwork) {
  return work.images.find((image) => image.role === "primary" && image.src.trim() && image.width > 0 && image.height > 0);
}
export function getPublicArtworks(items: Artwork[], locale: Locale) {
  return items.filter((work) => work.status === "published" && work.rightsConfirmed &&
    Boolean(work.title[locale]?.trim()) && Boolean(primaryImageFor(work)?.alt[locale]?.trim()))
    .sort((a,b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));
}
export function getPublicGalleries(items: Gallery[], works: Artwork[], locale: Locale) {
  const ids = new Set(getPublicArtworks(works, locale).map((work) => work.id));
  return items.filter((g) => g.status === "published" && Boolean(g.title[locale]?.trim()) &&
    Boolean(g.description[locale]?.trim()) && g.artworkIds.length > 0 &&
    new Set(g.artworkIds).size === g.artworkIds.length && g.artworkIds.includes(g.coverArtworkId) &&
    g.artworkIds.every((id) => ids.has(id))).sort((a,b) => a.sortOrder-b.sortOrder);
}
export function getPublicJournal(items: JournalEntry[], locale: Locale) {
  return items.filter((entry) => entry.status === "published" && Boolean(entry.title[locale]?.trim()) &&
    Boolean(entry.summary[locale]?.trim())).sort((a,b) => (b.publishedAt ?? "").localeCompare(a.publishedAt ?? ""));
}
export const copy = {
 en: { home:"Home",works:"Works",galleries:"Galleries",journal:"Journal",about:"About",contact:"Contact",language:"Language",menu:"Open navigation",close:"Close navigation",skip:"Skip to content",portfolio:"Artist portfolio",discipline:"Oil painter",selected:"Selected works",selectedIntro:"A considered selection of paintings.",explore:"Explore works",discover:"Discover the galleries",latest:"From the journal",emptyWorks:"Selected paintings will appear here once their images and details are approved for publication.",emptyGalleries:"Curated galleries will appear here when their titles, selections, and cover works are approved.",emptyJournal:"Journal stories and event announcements will appear here when they are ready to publish.",profilePending:"The artist statement and biography will be added after editorial review.",contactPending:"Public contact details have not yet been confirmed.",notFound:"This page could not be found.",returnHome:"Return home",rights:"All rights reserved." },
 fa: { home:"خانه",works:"آثار",galleries:"گالری‌ها",journal:"یادداشت‌ها",about:"درباره",contact:"تماس",language:"زبان",menu:"باز کردن راهبری",close:"بستن راهبری",skip:"رفتن به محتوای اصلی",portfolio:"پورتفولیوی هنرمند",discipline:"نقاش رنگ‌روغن",selected:"گزیده آثار",selectedIntro:"گزیده‌ای از نقاشی‌ها.",explore:"دیدن آثار",discover:"گشت‌وگذار در گالری‌ها",latest:"از یادداشت‌ها",emptyWorks:"آثار پس از تأیید تصاویر و اطلاعات برای انتشار، در این بخش نمایش داده می‌شوند.",emptyGalleries:"گالری‌های منتخب پس از تأیید عنوان، آثار و تصویر اصلی در این بخش قرار می‌گیرند.",emptyJournal:"یادداشت‌ها و اطلاعیه‌های رویداد پس از آماده‌شدن برای انتشار در این بخش نمایش داده می‌شوند.",profilePending:"بیانیه هنری و زندگی‌نامه پس از بررسی و تأیید منتشر خواهند شد.",contactPending:"اطلاعات تماس عمومی هنوز تأیید نشده است.",notFound:"این صفحه پیدا نشد.",returnHome:"بازگشت به خانه",rights:"تمامی حقوق محفوظ است." }
} as const;
export const copyFor = (l: Locale) => copy[l];
