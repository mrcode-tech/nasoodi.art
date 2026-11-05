import type { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { SiteShell } from "@/components/site-shell";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { getUpcomingJournalEvent } from "@/lib/content/journal";
import { getLocalizedSlug } from "@/lib/content/paths";
import { isLocale, locales, getLocaleDirection, type Locale } from "@/types/locale";
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
export const dynamicParams = false;
export function generateStaticParams() { return locales.map((locale) => ({ locale })); }
export default async function LocaleLayout({ children, params }: { children: React.ReactNode; params: Promise<{ locale: string }> }) {
  const { locale: value } = await params;
  if (!isLocale(value)) notFound();
  const locale: Locale = value;
  setRequestLocale(locale);
  // Load the catalog from the validated route locale directly. This keeps the
  // client provider independent from implicit request-locale inference.
  const messages = locale === "fa"
    ? (await import("@/i18n/messages/fa")).default
    : (await import("@/i18n/messages/en")).default;
  const upcoming = getUpcomingJournalEvent(getEvents(locale), locale);
  const announcement = upcoming?.event ? { id: upcoming.id, slug: getLocalizedSlug(upcoming, locale), title: upcoming.title[locale]!, startsAt: upcoming.event.startsAt, timeZone: upcoming.event.timeZone } : undefined;
  return <html lang={locale} dir={getLocaleDirection(locale)} suppressHydrationWarning><body><NextIntlClientProvider locale={locale} messages={messages}><ThemeProvider>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(getPortfolioStructuredData(locale)) }} />
    <SiteShell locale={locale} announcement={announcement}>{children}</SiteShell>
  </ThemeProvider></NextIntlClientProvider></body></html>;
}
