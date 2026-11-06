import { artworks } from "../artworks";
import { getPublicArtworks } from "../../lib/content/publication";
import { matchesLocalizedSlug } from "../../lib/content/paths";
import type { Locale } from "../../types/locale";

export function getArtworks(locale: Locale) {
  return getPublicArtworks(artworks, locale);
}

export function getArtworkById(id: string, locale: Locale) {
  return getArtworks(locale).find((artwork) => artwork.id === id);
}

export function getArtworkBySlug(slug: string, locale: Locale) {
  return getArtworks(locale).find((artwork) => matchesLocalizedSlug(artwork, locale, slug) || artwork.slug === slug);
}
