import type { MetadataRoute } from "next";
import {
  artworks, galleries, journalEntries, cvEntries, artistProfile, contactDetails, locales,
  getPublicArtworks, getPublicGalleries, getPublicJournal, getPublicCvEntries, getPublicArtistProfile, getPublicContactDetails,
} from "@/lib/site";

const base = "https://nasoodi.art";

export default function sitemap(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = [
    { url: `${base}/fa`, alternates: { languages: { fa: `${base}/fa`, en: `${base}/en` } } },
    { url: `${base}/en`, alternates: { languages: { fa: `${base}/fa`, en: `${base}/en` } } },
  ];

  for (const locale of locales) {
    const other = locale === "fa" ? "en" : "fa";
    const add = (path: string, translated: boolean) => {
      entries.push({
        url: `${base}/${locale}/${path}`,
        ...(translated ? { alternates: { languages: {
          [locale]: `${base}/${locale}/${path}`,
          [other]: `${base}/${other}/${path}`,
        } } } : {}),
      });
    };

    const works = getPublicArtworks(artworks, locale);
    const otherWorks = new Set(getPublicArtworks(artworks, other).map((item) => item.slug));
    if (works.length) add("works", otherWorks.size > 0);
    for (const item of works) add(`works/${item.slug}`, otherWorks.has(item.slug));

    const sets = getPublicGalleries(galleries, artworks, locale);
    const otherSets = new Set(getPublicGalleries(galleries, artworks, other).map((item) => item.slug));
    if (sets.length) add("galleries", otherSets.size > 0);
    for (const item of sets) add(`galleries/${item.slug}`, otherSets.has(item.slug));

    const journal = getPublicJournal(journalEntries, locale);
    const otherJournal = new Set(getPublicJournal(journalEntries, other).map((item) => item.slug));
    if (journal.length) add("journal", otherJournal.size > 0);
    for (const item of journal) add(`journal/${item.slug}`, otherJournal.has(item.slug));

    if (getPublicArtistProfile(artistProfile, locale)) {
      add("about", Boolean(getPublicArtistProfile(artistProfile, other)));
    }
    if (getPublicContactDetails(contactDetails, locale)) {
      add("contact", Boolean(getPublicContactDetails(contactDetails, other)));
    }

    const cv = getPublicCvEntries(cvEntries, locale);
    if (cv.length) add("cv", getPublicCvEntries(cvEntries, other).length > 0);
  }
  return entries;
}
