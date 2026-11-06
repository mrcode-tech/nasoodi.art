import { siteContent } from "../site";
import type { Locale } from "../../types/locale";

export function getSitePageMetadata(page: "works" | "galleries" | "journal" | "cv", locale: Locale) {
  return {
    title: siteContent.pages[page].title[locale],
    description: siteContent.pages[page].description[locale],
  };
}
