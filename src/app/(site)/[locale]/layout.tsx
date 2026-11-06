import type { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { SiteShell } from "@/components/site-shell";
import { ThemeProvider } from "@/components/providers/theme-provider";
import announcementConfig from "@/content/announcement.json";
import { assertAnnouncementConfig, getAnnouncementHref } from "@/lib/content/announcement-config";
import { getLocalizedSlug } from "@/lib/content/paths";
import { isLocale, locales, getLocaleDirection, type Locale } from "@/types/locale";
import { getArtworkById } from "@/content/repositories/artwork.repository";
import { getGalleryById } from "@/content/repositories/gallery.repository";
import { getJournalEntryById } from "@/content/repositories/journal.repository";
import { getEvents } from "@/content/repositories/event.repository";
import { getArtist } from "@/content/repositories/artist.repository";
import { getPortfolioStructuredData } from "@/content/portfolio-structured-data";
import { serializeJsonLd } from "@/lib/seo/structured-data";
import "../../globals.css";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale: value } = await params;
  if (!isLocale(value)) return {};
  const profile = getArtist(value);
  if (!profile) return {};
  const name = profile.name?.[value] ?? "Nasoodi.art";
  const description = profile.shortIntroduction?.[value] ?? profile.statement[value];
  return {
    metadataBase: new URL("https://nasoodi.art"),
    applicationName: "Nasoodi.art",
    title: { default: name + " — " + (profile.discipline?.[value] ?? "Artist"), template: "%s | Nasoodi.art" },
    ...(description ? { description } : {}),
    openGraph: { type: "website", siteName: "Nasoodi.art" },
  };
}
type ResolvedAnnouncement = {
  id: string;
  title: string;
  description: string;
  metadata?: string;
  href: string;
};

function resolveAnnouncement(locale: Locale): ResolvedAnnouncement | undefined {
  assertAnnouncementConfig(announcementConfig);
  if (!announcementConfig.active) return undefined;

  let href: string | undefined;
  switch (announcementConfig.type) {
    case "artwork": {
      const artwork = getArtworkById(announcementConfig.contentId, locale);
      if (artwork) href = getAnnouncementHref("artwork", getLocalizedSlug(artwork, locale), locale);
      break;
    }
    case "gallery": {
      const gallery = getGalleryById(announcementConfig.contentId, locale);
      if (gallery) href = getAnnouncementHref("gallery", getLocalizedSlug(gallery, locale), locale);
      break;
    }
    case "journal": {
      const entry = getJournalEntryById(announcementConfig.contentId, locale);
      if (entry) href = getAnnouncementHref("journal", getLocalizedSlug(entry, locale), locale);
      break;
    }
    case "event": {
      const event = getEvents(locale).find((entry) => entry.id === announcementConfig.contentId);
      if (event) href = getAnnouncementHref("event", getLocalizedSlug(event, locale), locale);
      break;
    }
  }

  if (!href) {
    throw new Error("Active announcement references unavailable or unpublished " + announcementConfig.type + " content: " + announcementConfig.contentId);
  }

  return {
    id: announcementConfig.type + ":" + announcementConfig.contentId,
    title: announcementConfig.title[locale],
    description: announcementConfig.description[locale],
    ...(announcementConfig.metadata?.[locale] ? { metadata: announcementConfig.metadata[locale] } : {}),
    href,
  };
}
export const dynamicParams = false;
export function generateStaticParams() { return locales.map((locale) => ({ locale })); }
export default async function LocaleLayout({ children, params }: { children: React.ReactNode; params: Promise<{ locale: string }> }) {
  const { locale: value } = await params;
  if (!isLocale(value)) notFound();
  const locale: Locale = value;
  setRequestLocale(locale);
  // Resolve the validated route locale through next-intl's request configuration.
  // Adding a locale does not require another language-specific branch here.
  const messages = await getMessages({ locale });
  const announcement = resolveAnnouncement(locale);
  return <html lang={locale} dir={getLocaleDirection(locale)} suppressHydrationWarning><body><NextIntlClientProvider locale={locale} messages={messages}><ThemeProvider>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(getPortfolioStructuredData(locale)) }} />
    <SiteShell locale={locale} announcement={announcement}>{children}</SiteShell>
  </ThemeProvider></NextIntlClientProvider></body></html>;
}
