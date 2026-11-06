import { journalEntries } from "../journal";
import { getPublicJournal } from "../../lib/content/journal";
import { matchesLocalizedSlug } from "../../lib/content/paths";
import type { Locale } from "../../types/locale";

export function getJournalEntries(locale: Locale) {
  return getPublicJournal(journalEntries, locale);
}

export function getJournalEntryById(id: string, locale: Locale) {
  return getJournalEntries(locale).find((entry) => entry.id === id);
}

export function getJournalEntryBySlug(slug: string, locale: Locale) {
  return getJournalEntries(locale).find((entry) => matchesLocalizedSlug(entry, locale, slug));
}
