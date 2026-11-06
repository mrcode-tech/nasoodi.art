import { getJournalEntries } from "./journal.repository";
import type { Locale } from "../../types/locale";

export function getEvents(locale: Locale) {
  return getJournalEntries(locale).filter((entry) => entry.type === "event" || entry.type === "exhibition");
}
