import type { Locale } from "@/types/locale";

/**
 * Format interface numbers using the locale's expected numeral system.
 * Persian explicitly uses Extended Arabic-Indic (Persian) digits; English
 * retains Western digits. Grouping is disabled for compact counters and years.
 */
export function formatLocaleNumber(value: number, locale: Locale): string {
  const numberingLocale = locale === "fa" ? "fa-IR-u-nu-arabext" : "en-US";
  return new Intl.NumberFormat(numberingLocale, { useGrouping: false, maximumFractionDigits: 20 }).format(value);
}
