import { cvDocument, cvEntries } from "../cv";
import { getPublicCvDocument, getPublicCvEntries } from "../../lib/content/publication";
import type { Locale } from "../../types/locale";

export function getCv(locale: Locale) {
  return {
    entries: getPublicCvEntries(cvEntries, locale),
    document: getPublicCvDocument(cvDocument),
  };
}
