export const locales = ["fa", "en"] as const;
export type Locale = (typeof locales)[number];

/** Default locale for root redirects and next-intl routing. */
export const defaultLocale: Locale = "fa";
export type Localized = Partial<Record<Locale, string>>;

export const localeNames = {
  fa: "فارسی",
  en: "English",
} as const satisfies Record<Locale, string>;

export const localeDirections = {
  fa: "rtl",
  en: "ltr",
} as const satisfies Record<Locale, "rtl" | "ltr">;

export const localeOpenGraphTags = {
  fa: "fa_IR",
  en: "en_US",
} as const satisfies Record<Locale, string>;

export const getLocaleName = (locale: Locale) => localeNames[locale];
export const getLocaleDirection = (locale: Locale) => localeDirections[locale];
export const getOpenGraphLocale = (locale: Locale) => localeOpenGraphTags[locale];
export const getOtherLocales = (locale: Locale) => locales.filter((candidate) => candidate !== locale);

export const isLocale = (value: string): value is Locale =>
  locales.includes(value as Locale);

export const otherLocale = (locale: Locale): Locale => getOtherLocales(locale)[0] ?? locale;

export const pagePath = (locale: Locale, path = "") => {
  const normalizedPath = path.replace(/^\/+/, "");
  return "/" + locale + (normalizedPath ? "/" + normalizedPath : "");
};
