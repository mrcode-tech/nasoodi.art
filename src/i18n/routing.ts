import { defineRouting } from "next-intl/routing";
import { defaultLocale, locales } from "../types/locale";

export const routing = defineRouting({
  locales,
  defaultLocale,
  localePrefix: "always",
  localeDetection: false,
  localeCookie: false,
  // Content routes can have different slugs and per-locale publication states.
  // The app's stable content identities generate hreflang links explicitly.
  alternateLinks: false,
});
