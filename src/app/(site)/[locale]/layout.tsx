import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SiteShell } from "@/components/site-shell";
import { getUpcomingJournalEvent, isLocale, journalEntries, portfolioStructuredData, serializeJsonLd, type Locale } from "@/lib/site";
import "../../globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://nasoodi.art"), applicationName: "Nasoodi.art",
  title: { default: "Ghazaleh Abdolahzade Nasoodi — Artist", template: "%s | Nasoodi.art" },
  description: "The artist portfolio of Ghazaleh Abdolahzade Nasoodi.",
  openGraph: { type: "website", siteName: "Nasoodi.art" },
};
export const dynamicParams = false;
export function generateStaticParams() { return [{ locale: "fa" }, { locale: "en" }]; }
export default async function LocaleLayout({ children, params }: { children: React.ReactNode; params: Promise<{ locale: string }> }) {
  const { locale: value } = await params;
  if (!isLocale(value)) notFound();
  const locale: Locale = value;
  const upcoming = getUpcomingJournalEvent(journalEntries, locale);
  const announcement = upcoming?.event ? { id: upcoming.id, slug: upcoming.slug, title: upcoming.title[locale]!, startsAt: upcoming.event.startsAt, timeZone: upcoming.event.timeZone } : undefined;
  return <html lang={locale} dir={locale === "fa" ? "rtl" : "ltr"}><body>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(portfolioStructuredData) }} />
    <SiteShell locale={locale} announcement={announcement}>{children}</SiteShell>
  </body></html>;
}
