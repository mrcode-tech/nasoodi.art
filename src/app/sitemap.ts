import type { MetadataRoute } from "next";
import { locales, type Locale } from "@/types/locale";
import { getArtworks } from "@/content/repositories/artwork.repository";
import { getGalleries } from "@/content/repositories/gallery.repository";
import { getJournalEntries } from "@/content/repositories/journal.repository";
import { getCv } from "@/content/repositories/cv.repository";
import { getContact } from "@/content/repositories/contact.repository";
import { getArtist } from "@/content/repositories/artist.repository";
import { getLocalizedSlug } from "@/lib/content/paths";
import { hasEquivalentContentSet } from "@/lib/content/identity";

const base = "https://nasoodi.art";
const localizedUrl = (locale: Locale, path = "") => base + "/" + locale + (path ? "/" + path : "");

export default function sitemap(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = [{ url: base + "/", alternates: { languages: { "x-default": base + "/", en: localizedUrl("en"), fa: localizedUrl("fa") } } }];
  const add = (locale: Locale, path: string, alternatePaths: (Partial<Record<Locale, string>> & { "x-default"?: string }) = {}) => {
    const url = localizedUrl(locale, path);
    const languages = Object.fromEntries([
      [locale, url],
      ...Object.entries(alternatePaths).map(([target, targetPath]) => [target, target === "x-default" ? base + "/" : localizedUrl(target as Locale, targetPath)]),
    ]);
    entries.push({
      url,
      ...(Object.keys(alternatePaths).length ? { alternates: { languages } } : {}),
    });
  };

  for (const locale of locales) {
    const targets = locales.filter((target) => target !== locale);
    const homeAlternates = { ...Object.fromEntries(targets.map((target) => [target, ""])), "x-default": "/" } as Partial<Record<Locale, string>> & { "x-default": string };
    add(locale, "", homeAlternates);

    const works = getArtworks(locale);
    const workSets = new Map(targets.map((target) => [target, getArtworks(target)]));
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

    const sets = getGalleries(locale);
    const gallerySets = new Map(targets.map((target) => [target, getGalleries(target)]));
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

    const journal = getJournalEntries(locale);
    const journalSets = new Map(targets.map((target) => [target, getJournalEntries(target)]));
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

    const cv = getCv(locale).entries;
    const cvAlternates = Object.fromEntries(targets
      .filter((target) => hasEquivalentContentSet(cv, getCv(target).entries))
      .map((target) => [target, "cv"])) as Partial<Record<Locale, string>>;
    if (cv.length) add(locale, "cv", cvAlternates);

    const profile = getArtist(locale);
    if (profile) {
      const aboutAlternates = Object.fromEntries(targets
        .filter((target) => Boolean(getArtist(target)))
        .map((target) => [target, "about"])) as Partial<Record<Locale, string>>;
      add(locale, "about", aboutAlternates);
    }

    const contact = getContact(locale);
    if (contact) {
      const contactAlternates = Object.fromEntries(targets
        .filter((target) => Boolean(getContact(target)))
        .map((target) => [target, "contact"])) as Partial<Record<Locale, string>>;
      add(locale, "contact", contactAlternates);
    }
  }

  return entries;
}
