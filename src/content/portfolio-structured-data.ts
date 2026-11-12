import { getArtist } from "./repositories/artist.repository";
import { getCv } from "./repositories/cv.repository";
import { getContact } from "./repositories/contact.repository";
import { getArtworks } from "./repositories/artwork.repository";
import type { ArtistProfile, CvEntry } from "../types/content";
import { locales, type Locale, otherLocale, pagePath } from "../types/locale";

type PortfolioStructuredDataInput = {
  profile: ArtistProfile;
  cvEntries: readonly CvEntry[];
  locale: Locale;
  officialProfiles?: readonly (string | undefined)[];
  artworkMedia?: readonly string[];
};

function uniqueNonEmpty(values: readonly (string | undefined)[]): string[] {
  return [...new Set(values.map((value) => value?.trim()).filter((value): value is string => Boolean(value)))];
}

function normalizeNameKey(value: string): string {
  return value.normalize("NFKC").replace(/[\\u200c\\s]+/g, " ").replace(/\\u064a/g, "\\u06cc").replace(/\\u0643/g, "\\u06a9").trim().toLowerCase();
}

function uniqueNameValues(values: readonly (string | undefined)[], excluded: readonly string[] = []): string[] {
  const seen = new Set(excluded.map(normalizeNameKey));
  return values.map((value) => value?.trim()).filter((value): value is string => {
    if (!value) return false;
    const key = normalizeNameKey(value);
    if (!key || seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

/**
 * Pure structured-data mapper. It consumes only canonical, already-public
 * profile/CV/contact/artwork values; it never creates editorial content.
 */
export function createPortfolioStructuredData({
  profile,
  cvEntries,
  locale,
  officialProfiles = [],
  artworkMedia = [],
}: PortfolioStructuredDataInput) {
  const alternateLocale = otherLocale(locale);
  const name = profile.name?.[locale];
  const alternateCanonicalName = profile.name?.[alternateLocale];
  const jobTitle = profile.discipline?.[locale];

  if (!name || !alternateCanonicalName || !jobTitle) {
    throw new Error("Canonical artist identity must be complete in every supported locale before rendering structured data.");
  }

  const curatedAliases = (profile.nameAliases?.[locale]?.completeName ?? [])
    .filter((alias) => alias.kind === "complete-name" &&
      (alias.confidence === "core" || alias.confidence === "supported") &&
      Number.isInteger(alias.structuredDataPriority) && (alias.structuredDataPriority ?? -1) >= 0)
    .sort((left, right) =>
      (left.structuredDataPriority ?? Number.MAX_SAFE_INTEGER) - (right.structuredDataPriority ?? Number.MAX_SAFE_INTEGER) ||
      normalizeNameKey(left.value).localeCompare(normalizeNameKey(right.value)))
    .map((alias) => alias.value);

  // Keep the other locale canonical spelling as an identity link; additional aliases are explicitly prioritized and locale-specific.
  const alternateNames = uniqueNameValues([alternateCanonicalName, ...curatedAliases], [name]);
  const education = uniqueNonEmpty(cvEntries
    .filter((entry) => entry.category === "education")
    .map((entry) => entry.organization?.[locale]))
    .map((organization) => ({ "@type": "EducationalOrganization", name: organization }));
  const memberships = uniqueNonEmpty(cvEntries
    .filter((entry) => entry.category === "membership")
    .map((entry) => entry.organization?.[locale]))
    .map((organization) => ({ "@type": "Organization", name: organization }));
  const teachingRoles = uniqueNonEmpty(cvEntries
    .filter((entry) => entry.category === "teaching")
    .map((entry) => entry.title[locale]));
  const knowsAbout = uniqueNonEmpty([
    ...(profile.interests?.[locale] ?? []),
    ...artworkMedia,
  ]);
  const sameAs = uniqueNonEmpty([...officialProfiles]);

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Person",
        "@id": "https://nasoodi.art/#artist",
        name,
        alternateName: alternateNames,
        jobTitle: uniqueNonEmpty([jobTitle, ...teachingRoles]),
        description: profile.biography[locale],
        url: "https://nasoodi.art" + pagePath(locale, "about"),
        ...(profile.portrait?.src ? { image: new URL(profile.portrait.src, "https://nasoodi.art").toString() } : {}),
        ...(knowsAbout.length ? { knowsAbout } : {}),
        ...(education.length ? { alumniOf: education } : {}),
        ...(memberships.length ? { memberOf: memberships } : {}),
        ...(sameAs.length ? { sameAs } : {}),
      },
      {
        "@type": "WebSite",
        "@id": "https://nasoodi.art/#website",
        name: "Nasoodi.art",
        url: "https://nasoodi.art/",
        inLanguage: [...locales],
        publisher: { "@id": "https://nasoodi.art/#artist" },
      },
    ],
  } as const;
}

export function getPortfolioStructuredData(locale: Locale) {
  const profile = getArtist(locale);
  if (!profile) {
    throw new Error("A published artist profile is required before rendering portfolio structured data.");
  }

  const cvEntries = getCv(locale).entries;
  const contact = getContact(locale)?.details;
  const officialProfiles = [contact?.instagramUrl, contact?.telegramUrl];
  const artworkMedia = getArtworks(locale).flatMap((artwork) => artwork.medium?.[locale] ? [artwork.medium[locale]] : []);

  return createPortfolioStructuredData({
    profile,
    cvEntries,
    locale,
    officialProfiles,
    artworkMedia,
  });
}
