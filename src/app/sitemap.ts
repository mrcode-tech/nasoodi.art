import type { MetadataRoute } from "next";
import { artworks } from "@/content/artworks";
import { galleries } from "@/content/galleries";
import { journalEntries } from "@/content/journal";
import { cvEntries } from "@/content/cv";
import { contactDetails } from "@/content/contact";
import { artistProfile } from "@/content/artist";
import { locales, type Locale } from "@/types/locale";
import { getPublicArtworks, getPublicGalleries, getPublicCvEntries, getPublicArtistProfile, getPublicContactDetails } from "@/lib/content/publication";
import { getPublicJournal } from "@/lib/content/journal";
import { getLocalizedSlug } from "@/lib/content/paths";
import { hasEquivalentContentSet } from "@/lib/content/identity";

const base = "https://nasoodi.art";
const localizedUrl = (locale: Locale, path = "") => base + "/" + locale + (path ? "/" + path : "");

export default function sitemap(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = [];
  const add = (locale: Locale, path: string, alternatePaths: Partial<Record<Locale, string>> = {}) => {
    const url = localizedUrl(locale, path);
    const languages = Object.fromEntries([
      [locale, url],
      ...Object.entries(alternatePaths).map(([target, targetPath]) => [target, localizedUrl(target as Locale, targetPath)]),
    ]);
    entries.push({
      url,
      ...(Object.keys(alternatePaths).length ? { alternates: { languages } } : {}),
    });
  };

  for (const locale of locales) {
    const targets = locales.filter((target) => target !== locale);
    const homeAlternates = Object.fromEntries(targets.map((target) => [target, ""])) as Partial<Record<Locale, string>>;
    add(locale, "", homeAlternates);

    const works = getPublicArtworks(artworks, locale);
    const workSets = new Map(targets.map((target) => [target, getPublicArtworks(artworks, target)]));
    const workArchiveAlternates = Object.fromEntries(targets
      .filter((target) => hasEquivalentContentSet(works, workSets.get(target) ?? []))
      .map((target) => [target, "works"])) as Partial<Record<Locale, string>>;
    if (works.length) add(locale, "works", workArchiveAlternates);
    for (const work of works) {
      const alternates = Object.fromEntries(targets.flatMap((target) => {
        const translated = workSets.get(target)?.find((item) => item.id === work.id);
        return translated ? [[target, "works/" + getLocalizedSlug(translated, target)]] : [];
      })) as Partial<Record<Locale, string>>;
      add(locale, "works/" + getLocalizedSlug(work, locale), alternates);
    }

    const sets = getPublicGalleries(galleries, artworks, locale);
    const gallerySets = new Map(targets.map((target) => [target, getPublicGalleries(galleries, artworks, target)]));
    const galleryArchiveAlternates = Object.fromEntries(targets
      .filter((target) => hasEquivalentContentSet(sets, gallerySets.get(target) ?? []))
      .map((target) => [target, "galleries"])) as Partial<Record<Locale, string>>;
    if (sets.length) add(locale, "galleries", galleryArchiveAlternates);
    for (const gallery of sets) {
      const alternates = Object.fromEntries(targets.flatMap((target) => {
        const translated = gallerySets.get(target)?.find((item) => item.id === gallery.id);
        return translated ? [[target, "galleries/" + getLocalizedSlug(translated, target)]] : [];
      })) as Partial<Record<Locale, string>>;
      add(locale, "galleries/" + getLocalizedSlug(gallery, locale), alternates);
    }

    const journal = getPublicJournal(journalEntries, locale);
    const journalSets = new Map(targets.map((target) => [target, getPublicJournal(journalEntries, target)]));
    const journalArchiveAlternates = Object.fromEntries(targets
      .filter((target) => hasEquivalentContentSet(journal, journalSets.get(target) ?? []))
      .map((target) => [target, "journal"])) as Partial<Record<Locale, string>>;
    if (journal.length) add(locale, "journal", journalArchiveAlternates);
    for (const entry of journal) {
      const alternates = Object.fromEntries(targets.flatMap((target) => {
        const translated = journalSets.get(target)?.find((item) => item.id === entry.id);
        return translated ? [[target, "journal/" + getLocalizedSlug(translated, target)]] : [];
      })) as Partial<Record<Locale, string>>;
      add(locale, "journal/" + getLocalizedSlug(entry, locale), alternates);
    }

    const cv = getPublicCvEntries(cvEntries, locale);
    const cvAlternates = Object.fromEntries(targets
      .filter((target) => hasEquivalentContentSet(cv, getPublicCvEntries(cvEntries, target)))
      .map((target) => [target, "cv"])) as Partial<Record<Locale, string>>;
    if (cv.length) add(locale, "cv", cvAlternates);

    const profile = getPublicArtistProfile(artistProfile, locale);
    if (profile) {
      const aboutAlternates = Object.fromEntries(targets
        .filter((target) => Boolean(getPublicArtistProfile(artistProfile, target)))
        .map((target) => [target, "about"])) as Partial<Record<Locale, string>>;
      add(locale, "about", aboutAlternates);
    }

    const contact = getPublicContactDetails(contactDetails);
    if (contact && contactDetails.title?.[locale] && contactDetails.description?.[locale]) {
      const contactAlternates = Object.fromEntries(targets
        .filter((target) => Boolean(getPublicContactDetails(contactDetails)) && contactDetails.title?.[target] && contactDetails.description?.[target])
        .map((target) => [target, "contact"])) as Partial<Record<Locale, string>>;
      add(locale, "contact", contactAlternates);
    }
  }

  return entries;
}
