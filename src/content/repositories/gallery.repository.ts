import { artworks } from "../artworks";
import { galleries } from "../galleries";
import { getPublicGalleries } from "../../lib/content/publication";
import { getLocalizedSlug } from "../../lib/content/paths";
import type { Locale } from "../../types/locale";

export function getGalleries(locale: Locale) {
  return getPublicGalleries(galleries, artworks, locale);
}

export function getGalleryById(id: string, locale: Locale) {
  return getGalleries(locale).find((gallery) => gallery.id === id);
}

export function getGalleryBySlug(slug: string, locale: Locale) {
  return getGalleries(locale).find((gallery) => getLocalizedSlug(gallery, locale) === slug);
}
