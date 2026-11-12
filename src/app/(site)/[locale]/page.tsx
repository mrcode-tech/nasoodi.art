import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ArrowUpRightIcon } from "@/components/ui/arrow-up-right-icon";
import { ArtworkExperience } from "@/components/artwork-experience";
import { ArtistHeroCarousel } from "@/components/artist-hero-carousel";
import { BiographyDisclosure } from "@/components/biography-disclosure";
import { CollectionCarousel } from "@/components/collection-carousel";
import { HomepageContactFooter } from "@/components/homepage-contact-footer";
import { Button } from "@/components/ui/button";
import { getHomepageContent } from "@/content/repositories/homepage.repository";
import { journalCoverImageFor } from "@/lib/content/journal";
import { getLocalizedSlug } from "@/lib/content/paths";
import { createLocalizedMetadata } from "@/lib/seo/metadata";
import { isLocale, pagePath, locales, type Locale } from "@/types/locale";

export const revalidate = 60;
type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};

  setRequestLocale(locale);
  const home = getHomepageContent(locale);
  const profile = home.artist;
  if (!profile) return {};

  return createLocalizedMetadata({
    locale,
    path: "",
    title: profile.name?.[locale] ?? profile.slug?.[locale] ?? "Nasoodi.art",
    description: profile.shortIntroduction?.[locale] ?? profile.statement[locale],
    alternatePaths: Object.fromEntries(
      locales.filter((target) => target !== locale).map((target) => [target, pagePath(target)]),
    ) as Partial<Record<Locale, string>>,
    indexable: true,
    xDefaultPath: "/",
    images: ["/images/artist/artist-at-work.jpg"],
  });
}

export default async function Home({ params }: Props) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  setRequestLocale(locale);
  const t = await getTranslations({ locale });
  const home = getHomepageContent(locale);
  const profile = home.artist;
  if (!profile) notFound();

  const biography = profile.biography[locale] ?? "";
  const heroAlt = t("heroAlt");
  const works = home.featuredArtworks;
  const sets = home.featuredGalleries;
  const hasSelectedWorks = home.artworks.length > 0;
  const hasFeaturedGalleries = home.galleries.length > 0;
  const journal = home.journalPreview;

  return (
    <div className="page-content home-page">
      <section className="home-intro has-hero" aria-labelledby="home-title">
        <ArtistHeroCarousel locale={locale} alt={heroAlt} />
        <div className="home-intro-copy">
          <p className="eyebrow">{t("portfolio")}</p>
          <h1 id="home-title">{profile.name?.[locale] ?? t("artistName")}</h1>
          <section className="home-biography" aria-label={t("biography")}>
            <BiographyDisclosure biography={biography} readMoreLabel={t("readMore")} showLessLabel={t("showLess")} lines={4} alwaysShowToggle={locale === "fa"} />
          </section>
          {(hasFeaturedGalleries || hasSelectedWorks) && (
            <div className="hero-actions">
              {hasFeaturedGalleries && (
                <Button asChild variant="default" size="lg">
                  <Link href={pagePath(locale, "galleries")}>{t("exploreGalleries")}</Link>
                </Button>
              )}
              {hasSelectedWorks && (
                <Button asChild variant="outline" size="lg">
                  <Link href={pagePath(locale, "works")}>{t("viewSelectedWorks")}</Link>
                </Button>
              )}
            </div>
          )}
        </div>
      </section>

      <section className="editorial-section" aria-labelledby="featured-works">
        <div className="section-heading">
          <div><p className="eyebrow">{t("portfolio")}</p><h2 id="featured-works">{t("selected")}</h2></div>
          <Link className="text-link" href={pagePath(locale, "works")}>{t("exploreCollections")} <ArrowUpRightIcon /></Link>
        </div>
        {works.length === 0 ? <p className="empty-note">{t("emptyWorks")}</p> : <ArtworkExperience artworks={works.slice(0, 6)} locale={locale} context="home" />}
      </section>

      <section className="editorial-section" aria-labelledby="featured-galleries">
        <div className="section-heading">
          <div><p className="eyebrow">{t("discover")}</p><h2 id="featured-galleries">{t("galleries")}</h2></div>
          <Link className="text-link" href={pagePath(locale, "galleries")}>{t("discover")} <ArrowUpRightIcon /></Link>
        </div>
        {sets.length === 0 ? <p className="empty-note">{t("emptyGalleries")}</p> : <CollectionCarousel galleries={sets} artworks={home.artworks} locale={locale} label={t("galleries")} />}
      </section>

      {journal.length > 0 && (
        <section className="editorial-section" aria-labelledby="latest-journal">
          <div className="section-heading">
            <div><p className="eyebrow">{t("latest")}</p><h2 id="latest-journal">{t("journal")}</h2></div>
            <Link className="text-link" href={pagePath(locale, "journal")}>{t("exploreJournal")} <ArrowUpRightIcon /></Link>
          </div>
          <div className="journal-preview-list">
            {journal.map((entry) => {
              const cover = journalCoverImageFor(entry, locale);
              return (
                <article className={`journal-preview-item${cover ? " has-cover" : ""}`} key={entry.id}>
                  {cover && (
                    <Image
                      className="journal-cover-image"
                      src={cover.src}
                      alt={cover.alt[locale] ?? entry.title[locale] ?? entry.slug}
                      width={cover.width}
                      height={cover.height}
                      sizes="(max-width: 600px) 100vw, (max-width: 900px) 40vw, 24rem"
                    />
                  )}
                  <div className="journal-preview-copy">
                    {entry.publishedAt && Number.isFinite(Date.parse(entry.publishedAt)) && (
                      <time dateTime={entry.publishedAt}>{new Intl.DateTimeFormat(locale, { dateStyle: "long" }).format(new Date(entry.publishedAt))}</time>
                    )}
                    <h3><Link href={pagePath(locale, `journal/${getLocalizedSlug(entry, locale)}`)}>{entry.title[locale]}</Link></h3>
                    <p>{entry.summary[locale]}</p>
                    <Link className="text-link" href={pagePath(locale, `journal/${getLocalizedSlug(entry, locale)}`)}>{t("readMore")} <ArrowUpRightIcon /></Link>
                  </div>
                </article>
              );
            })}
          </div>
        </section>
      )}
      <HomepageContactFooter locale={locale} details={home.contact} />
    </div>
  );
}
