import { getJournalEntries } from "./journal.repository";

export function getEvents(locale: "en" | "fa") {
  return getJournalEntries(locale).filter((entry) => entry.type === "event" || entry.type === "exhibition");
}
