import type { MetadataRoute } from "next";
import { artworks, galleries, journalEntries, cvEntries, artistProfile } from "@/content/portfolio";
import { locales } from "@/types/locale";
import { getPublicArtworks, getPublicGalleries, getPublicCvEntries, getPublicArtistProfile } from "@/lib/content/publication";
import { getPublicJournal } from "@/lib/content/journal";
import { getLocalizedSlug } from "@/lib/content/paths";
import { hasEquivalentContentSet } from "@/lib/content/identity";

const base = "https://nasoodi.art";

export default function sitemap(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = [
    { url: `${base}/fa`, alternates: { languages: { fa: `${base}/fa`, en: `${base}/en` } } },
    { url: `${base}/en`, alternates: { languages: { fa: `${base}/fa`, en: `${base}/en` } } },
  ];
  for (const locale of locales) {
    const other = locale === "fa" ? "en" : "fa";
    const add = (path: string, translatedPath?: string) => {
      const url = `${base}/${locale}/${path}`;
      entries.push({ url, ...(translatedPath ? { alternates: { languages: { [locale]: url, [other]: `${base}/${other}/${translatedPath}` } } } : {}) });
    };
    const works = getPublicArtworks(artworks, locale), otherWorks = getPublicArtworks(artworks, other);
    if (works.length) add("works", hasEquivalentContentSet(works, otherWorks) ? "works" : undefined);
    for (const item of works) {
      const translated = otherWorks.find((candidate) => candidate.id === item.id);
      add(`works/${getLocalizedSlug(item, locale)}`, translated ? `works/${getLocalizedSlug(translated, other)}` : undefined);
    }
    const sets = getPublicGalleries(galleries, artworks, locale), otherSets = getPublicGalleries(galleries, artworks, other);
    if (sets.length) add("galleries", hasEquivalentContentSet(sets, otherSets) ? "galleries" : undefined);
    for (const item of sets) {
      const translated = otherSets.find((candidate) => candidate.id === item.id);
      add(`galleries/${getLocalizedSlug(item, locale)}`, translated ? `galleries/${getLocalizedSlug(translated, other)}` : undefined);
    }
    const journal = getPublicJournal(journalEntries, locale), otherJournal = getPublicJournal(journalEntries, other);
    if (journal.length) add("journal", hasEquivalentContentSet(journal, otherJournal) ? "journal" : undefined);
    for (const item of journal) {
      const translated = otherJournal.find((candidate) => candidate.id === item.id);
      add(`journal/${getLocalizedSlug(item, locale)}`, translated ? `journal/${getLocalizedSlug(translated, other)}` : undefined);
    }
    if (getPublicArtistProfile(artistProfile, locale)) add("about", getPublicArtistProfile(artistProfile, other) ? "about" : undefined);
    const cv = getPublicCvEntries(cvEntries, locale), otherCv = getPublicCvEntries(cvEntries, other);
    if (cv.length) add("cv", hasEquivalentContentSet(cv, otherCv) ? "cv" : undefined);
  }
  return entries;
}
