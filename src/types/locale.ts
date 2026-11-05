export const locales = ["fa", "en"] as const;
export type Locale = (typeof locales)[number];
export type Localized = Partial<Record<Locale, string>>;

export const localeAlternates = {
  fa: "en",
  en: "fa",
} as const satisfies Record<Locale, Locale>;

export const localeDirections = {
  fa: "rtl",
  en: "ltr",
} as const satisfies Record<Locale, "rtl" | "ltr">;

export const localeOpenGraphTags = {
  fa: "fa_IR",
  en: "en_US",
} as const satisfies Record<Locale, string>;

export const getLocaleDirection = (locale: Locale) => localeDirections[locale];
export const getOpenGraphLocale = (locale: Locale) => localeOpenGraphTags[locale];

export const isLocale = (value: string): value is Locale =>
  locales.includes(value as Locale);

export const otherLocale = (locale: Locale): Locale => localeAlternates[locale];

export const pagePath = (locale: Locale, path = "") => {
  const normalizedPath = path.replace(/^\/+/, "");
  return "/" + locale + (normalizedPath ? "/" + normalizedPath : "");
};
