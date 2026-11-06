import { artworks } from "../../content/artworks";
import { cvEntries } from "../../content/cv";
import { galleries } from "../../content/galleries";
import { journalEntries } from "../../content/journal";
import { otherLocale, pagePath, type Locale } from "../../types/locale";
import { getLocalizedSlug } from "../content/paths";
import { hasEquivalentContentSet } from "../content/identity";
import { getPublicArtworks, getPublicCvEntries, getPublicGalleries } from "../content/publication";
import { getPublicJournal } from "../content/journal";

/**
 * Resolve a language switch to the equivalent published destination when it exists.
 * Static editorial shells exist in both locales; content routes fall back to the
 * target locale home rather than connecting unrelated or unpublished records.
 */
export function alternatePathFor(pathname: string, locale: Locale, targetLocale: Locale = otherLocale(locale)): string {
  const target = targetLocale;
  if (target === locale) return pathname;
  const segments = pathname.split("/").filter(Boolean).slice(1);
  if (segments.length === 0) return pagePath(target);

  const [section, slug] = segments;
  if (section === "about") return pagePath(target, "about");
  if (section === "contact") return pagePath(target, "contact");

  if (section === "cv") {
    return hasEquivalentContentSet(
      getPublicCvEntries(cvEntries, locale),
      getPublicCvEntries(cvEntries, target),
    ) ? pagePath(target, "cv") : pagePath(target);
  }

  if (section === "works") {
    const sourceItems = getPublicArtworks(artworks, locale);
    const targetItems = getPublicArtworks(artworks, target);
    if (!slug) return hasEquivalentContentSet(sourceItems, targetItems) ? pagePath(target, "works") : pagePath(target);
    const source = sourceItems.find((item) => getLocalizedSlug(item, locale) === slug);
    const translated = source && targetItems.find((item) => item.id === source.id);
    return translated ? pagePath(target, "works/" + getLocalizedSlug(translated, target)) : pagePath(target);
  }

  if (section === "galleries") {
    const sourceItems = getPublicGalleries(galleries, artworks, locale);
    const targetItems = getPublicGalleries(galleries, artworks, target);
    if (!slug) return hasEquivalentContentSet(sourceItems, targetItems) ? pagePath(target, "galleries") : pagePath(target);
    const source = sourceItems.find((item) => getLocalizedSlug(item, locale) === slug);
    const translated = source && targetItems.find((item) => item.id === source.id);
    return translated ? pagePath(target, "galleries/" + getLocalizedSlug(translated, target)) : pagePath(target);
  }

  if (section === "journal") {
    const sourceItems = getPublicJournal(journalEntries, locale);
    const targetItems = getPublicJournal(journalEntries, target);
    if (!slug) return hasEquivalentContentSet(sourceItems, targetItems) ? pagePath(target, "journal") : pagePath(target);
    const source = sourceItems.find((item) => getLocalizedSlug(item, locale) === slug);
    const translated = source && targetItems.find((item) => item.id === source.id);
    return translated ? pagePath(target, "journal/" + getLocalizedSlug(translated, target)) : pagePath(target);
  }

  return pagePath(target);
}
