import { siteContent } from "../site";
import { getArtworkById } from "./artwork.repository";
import type { Locale } from "../../types/locale";

export function getSitePageMetadata(page: "works" | "galleries" | "journal" | "cv", locale: Locale) {
  return { title: siteContent.pages[page].title[locale], description: siteContent.pages[page].description[locale] };
}

export function getEntranceArtwork(locale: Locale) {
  const artworkId = siteContent.entranceArtworkId;
  return artworkId ? getArtworkById(artworkId, locale) : undefined;
}
