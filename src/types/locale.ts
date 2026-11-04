export const locales = ["fa", "en"] as const;
export type Locale = (typeof locales)[number];
export type Localized = Partial<Record<Locale, string>>;

export const isLocale = (value: string): value is Locale =>
  locales.includes(value as Locale);

export const otherLocale = (locale: Locale): Locale =>
  locale === "fa" ? "en" : "fa";

export const pagePath = (locale: Locale, path = "") =>
  `/${locale}${path ? `/${path.replace(/^\\/+/, "")}` : ""}`;
