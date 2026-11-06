import type { Locale } from "../../types/locale";
import type { JournalCategory, JournalEntry } from "../../types/content";
import { getLocalizedSlug, isSafeContentSlug, isSafeLocalImagePath } from "./paths";

export function isSafeJournalHref(href: string): boolean {
  if (!href || href.includes("\\") || /[\u0000-\u001f]/.test(href)) return false;

  if (href.startsWith("/") && !href.startsWith("//")) {
    try {
      return new URL(href, "https://nasoodi.art").origin === "https://nasoodi.art";
    } catch {
      return false;
    }
  }

  try {
    const url = new URL(href);
    return url.protocol === "https:" && !url.username && !url.password;
  } catch {
    return false;
  }
}

export const journalCategories: readonly JournalCategory[] = [
  "exhibition",
  "event",
  "studio-update",
  "story",
];

export function journalCategoryFor(entry: JournalEntry): JournalCategory {
  return entry.type;
}

export function getJournalEntriesForCategory(
  items: readonly JournalEntry[],
  category?: JournalCategory,
): JournalEntry[] {
  return category ? items.filter((entry) => journalCategoryFor(entry) === category) : [...items];
}

export function hasExplicitTimeZone(value: string): boolean {
  return /(?:Z|[+-]\d{2}:\d{2})$/i.test(value) && Number.isFinite(Date.parse(value));
}

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

export function getPublicJournal(items: readonly JournalEntry[], locale: Locale): JournalEntry[] {
  const visible = items.filter((entry) => {
    if (
      entry.status !== "published" ||
      !entry.artistApproved ||
      !entry.approvedLocales.includes(locale) ||
      !entry.id.trim() ||
      !isSafeContentSlug(getLocalizedSlug(entry, locale)) ||
      !entry.title[locale]?.trim() ||
      !entry.summary[locale]?.trim()
    ) return false;

    if (entry.type === "event" && !entry.event) return false;
    if (!entry.event) return true;

    const event = entry.event;
    if (
      !hasExplicitTimeZone(event.startsAt) ||
      !event.timeZone ||
      (!event.venue?.[locale]?.trim() && !event.attendanceMode)
    ) return false;

    try {
      new Intl.DateTimeFormat(locale, { timeZone: event.timeZone });
    } catch {
      return false;
    }

    if (
      event.endsAt &&
      (!hasExplicitTimeZone(event.endsAt) || Date.parse(event.endsAt) < Date.parse(event.startsAt))
    ) return false;

    if (event.registrationUrl && !isSafeJournalHref(event.registrationUrl)) return false;
    return true;
  });

  return keepUniqueBy(
    keepUniqueBy(visible, (entry) => entry.id),
    (entry) => getLocalizedSlug(entry, locale),
  ).sort((a, b) => {
    const timestamp = (entry: JournalEntry) =>
      entry.publishedAt && Number.isFinite(Date.parse(entry.publishedAt))
        ? Date.parse(entry.publishedAt)
        : Number.NEGATIVE_INFINITY;

    return timestamp(b) - timestamp(a) ||
      (a.id < b.id ? -1 : a.id > b.id ? 1 : a.slug < b.slug ? -1 : a.slug > b.slug ? 1 : 0);
  });
}

export function journalCoverImageFor(
  entry: JournalEntry,
  locale: Locale,
): NonNullable<JournalEntry["coverImage"]> | undefined {
  const image = entry.coverImage;
  if (
    !image ||
    !image.rightsConfirmed ||
    !isSafeLocalImagePath(image.src) ||
    !Number.isSafeInteger(image.width) ||
    image.width < 1 ||
    !Number.isSafeInteger(image.height) ||
    image.height < 1 ||
    !image.alt[locale]?.trim()
  ) return undefined;

  return image;
}

export function getHomepageJournalPreview(items: readonly JournalEntry[], locale: Locale): JournalEntry[] {
  return getPublicJournal(items, locale).slice(0, 1);
}

export function getUpcomingJournalEvents(
  items: readonly JournalEntry[],
  locale: Locale,
  now: Date = new Date(),
): JournalEntry[] {
  const nowMs = now.getTime();

  return getPublicJournal(items, locale)
    .filter((entry) => {
      if ((entry.type !== "event" && entry.type !== "exhibition") || !entry.event) return false;
      const startsAt = Date.parse(entry.event.startsAt);
      const endsAt = entry.event.endsAt ? Date.parse(entry.event.endsAt) : startsAt;
      return Number.isFinite(startsAt) && startsAt > nowMs && endsAt > nowMs;
    })
    .sort((a, b) =>
      Date.parse(a.event!.startsAt) - Date.parse(b.event!.startsAt) ||
      a.id.localeCompare(b.id) ||
      a.slug.localeCompare(b.slug),
    );
}

export function getUpcomingJournalEvent(
  items: readonly JournalEntry[],
  locale: Locale,
  now: Date = new Date(),
): JournalEntry | undefined {
  return getUpcomingJournalEvents(items, locale, now)[0];
}
