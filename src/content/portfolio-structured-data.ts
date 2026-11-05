import { artistProfile } from "./artist";
import type { Locale } from "../types/locale";

export function getPortfolioStructuredData(locale: Locale) {
  const profile = artistProfile;
  const alternateLocale: Locale = locale === "en" ? "fa" : "en";
  const name = profile?.name?.[locale];
  const alternateName = profile?.name?.[alternateLocale];
  const jobTitle = profile?.discipline?.[locale];
  if (!name || !alternateName || !jobTitle) {
    throw new Error("Canonical artist identity must be complete in every supported locale before rendering structured data.");
  }

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Person",
        "@id": "https://nasoodi.art/#artist",
        name,
        alternateName,
        jobTitle,
        url: "https://nasoodi.art/",
      },
      {
        "@type": "WebSite",
        "@id": "https://nasoodi.art/#website",
        name: "Nasoodi.art",
        url: "https://nasoodi.art/",
        inLanguage: ["fa", "en"],
        publisher: { "@id": "https://nasoodi.art/#artist" },
      },
    ],
  } as const;
}
