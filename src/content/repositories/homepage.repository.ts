import { homepageSelection } from "../homepage";
import { getArtist } from "./artist.repository";
import { getArtworks } from "./artwork.repository";
import { getGalleries } from "./gallery.repository";
import { getJournalEntries } from "./journal.repository";
import { getContact } from "./contact.repository";
import {
  getHomepageFeaturedArtworks,
  getHomepageFeaturedGalleries,
  getHomepageHero,
} from "../../lib/content/publication";
import { getHomepageJournalPreview } from "../../lib/content/journal";
import type { Locale } from "../../types/locale";

/** Resolve every homepage editorial domain from its canonical repository. */
export function getHomepageContent(locale: Locale) {
  const artworks = getArtworks(locale);
  const galleries = getGalleries(locale);
  const journal = getJournalEntries(locale);

  return {
    artist: getArtist(locale),
    hero: getHomepageHero(artworks, homepageSelection, locale),
    artworks,
    galleries,
    featuredArtworks: getHomepageFeaturedArtworks(artworks, homepageSelection, locale),
    featuredGalleries: getHomepageFeaturedGalleries(galleries, artworks, homepageSelection, locale),
    journalPreview: getHomepageJournalPreview(journal, locale),
    contact: getContact(locale)?.details,
  };
}
