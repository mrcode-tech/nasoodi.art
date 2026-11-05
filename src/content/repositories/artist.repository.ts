import { artistProfile } from "../artist";
import { getPublicArtistProfile } from "../../lib/content/publication";
import type { Locale } from "../../types/locale";

export function getArtist(locale: Locale) {
  return getPublicArtistProfile(artistProfile, locale);
}

export function getAbout(locale: Locale) {
  const artist = getArtist(locale);
  if (!artist) return undefined;
  return {
    artist,
    biography: artist.biography[locale]!,
    statement: artist.statement[locale]!,
  };
}
