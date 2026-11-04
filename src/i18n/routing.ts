import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["fa", "en"],
  defaultLocale: "fa",
  localePrefix: "always",
  localeDetection: false,
  localeCookie: false,
  // Content routes can have different slugs and per-locale publication states.
  // The app's stable content identities generate hreflang links explicitly.
  alternateLinks: false,
});
