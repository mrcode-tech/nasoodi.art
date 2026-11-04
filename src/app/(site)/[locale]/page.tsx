import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { ArtworkExperience } from "@/components/artwork-experience";
import { CollectionCarousel } from "@/components/collection-carousel";
import { BiographyDisclosure } from "@/components/biography-disclosure";
import { ContactExperience } from "@/components/contact-experience";
import { getPublicContactDetails, contactDetails } from "@/lib/site";
import { aboutPreviewFixture } from "@/lib/about-preview-fixtures";
import { Button } from "@/components/ui/button";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { artworks,galleries,journalEntries,homepageSelection,getPublicArtworks,getPublicGalleries,getHomepageHero,getHomepageFeaturedArtworks,getHomepageFeaturedGalleries,getHomepageJournalPreview,journalCoverImageFor,primaryImageFor,getLocalizedSlug } from "@/lib/site";
import { isLocale,pagePath } from "@/lib/site";
export const revalidate = 60;
type Props={params:Promise<{locale:string}>};
export async function generateMetadata({params}:Props):Promise<Metadata>{const {locale}=await params;if(!isLocale(locale))return {};const t=await getTranslations({ locale });
 return {title:t("artistName"),
 description:t("homeDescription"),
 alternates:{canonical:pagePath(locale),languages:{fa:"/fa",en:"/en"}}};}
export default async function Home({params}:Props){const {locale}=await params;if(!isLocale(locale))notFound();const t=await getTranslations();const biography=aboutPreviewFixture.biography[locale];
 const hero=getHomepageHero(artworks,homepageSelection,locale),heroImage=hero?primaryImageFor(hero):undefined;
 const heroAlt=heroImage?.alt[locale] ?? (t("heroAlt"));
 const works=getHomepageFeaturedArtworks(artworks,homepageSelection,locale),sets=getHomepageFeaturedGalleries(galleries,artworks,homepageSelection,locale);
 const hasSelectedWorks=getPublicArtworks(artworks,locale).length>0;
 const hasFeaturedGalleries=getPublicGalleries(galleries,artworks,locale).length>0;
 const journal=getHomepageJournalPreview(journalEntries,locale);
 const contact=getPublicContactDetails(contactDetails);
 return <div className="page-content home-page">
  <section className="home-intro has-hero" aria-labelledby="home-title">
   <figure className="hero-artwork">
    {heroImage ? <Image sizes="(max-width: 900px) 100vw, 58vw" src={heroImage.src} alt={heroAlt} width={heroImage.width} height={heroImage.height} priority /> : <Image sizes="(max-width: 900px) 100vw, 58vw" src="/images/homepage-hero.jpg" alt={heroAlt} width={4032} height={3024} priority /> }
    {hero?.title[locale] && <figcaption>{hero.title[locale]}</figcaption>}
   </figure>
   <div className="home-intro-copy">
    <p className="eyebrow">{t("portfolio")}</p>
    <h1 id="home-title">{t("artistName")}</h1>
    <section className="home-biography" aria-label={t("biography")}>
      <BiographyDisclosure biography={biography} readMoreLabel={t("readMore")} showLessLabel={t("showLess")} lines={4}/>
    </section>
    {(hasFeaturedGalleries || hasSelectedWorks) && <div className="hero-actions">
     {hasFeaturedGalleries && <Button asChild variant="default" size="lg"><Link href={pagePath(locale,"galleries")}>{t("exploreGalleries")}</Link></Button>}
     {hasSelectedWorks && <Button asChild variant="outline" size="lg"><Link href={pagePath(locale,"works")}>{t("viewSelectedWorks")}</Link></Button>}
    </div>}
   </div>

  </section>
  <section className="editorial-section" aria-labelledby="featured-works"><div className="section-heading"><div><p className="eyebrow">{t("portfolio")}</p><h2 id="featured-works">{t("selected")}</h2></div><Link className="text-link" href={pagePath(locale,"galleries")}>{t("exploreCollections")} ↗</Link></div>
   {works.length===0?<p className="empty-note">{t("emptyWorks")}</p>:<ArtworkExperience artworks={works.slice(0,6)} locale={locale} context="home" />}
  </section>
  <section className="editorial-section" aria-labelledby="featured-galleries"><div className="section-heading"><div><p className="eyebrow">{t("discover")}</p><h2 id="featured-galleries">{t("galleries")}</h2></div><Link className="text-link" href={pagePath(locale,"galleries")}>{t("discover")} ↗</Link></div>
   {sets.length===0?<p className="empty-note">{t("emptyGalleries")}</p>:<CollectionCarousel galleries={sets} artworks={artworks} locale={locale} label={t("galleries")} />}
  </section>
  {journal.length > 0 && <section className="editorial-section" aria-labelledby="latest-journal">
   <div className="section-heading"><div><p className="eyebrow">{t("latest")}</p><h2 id="latest-journal">{t("journal")}</h2></div><Link className="text-link" href={pagePath(locale,"journal")}>{t("exploreJournal")} ↗</Link></div>
   <div className="journal-preview-list">{journal.map(entry=>{
    const cover=journalCoverImageFor(entry,locale);
    return <article className={`journal-preview-item${cover?" has-cover":""}`} key={entry.id}>
     {cover&&<Image className="journal-cover-image" src={cover.src} alt={cover.alt[locale] ?? entry.title[locale] ?? entry.slug} width={cover.width} height={cover.height} sizes="(max-width: 600px) 100vw, (max-width: 900px) 40vw, 24rem" />}
     <div className="journal-preview-copy">
      {entry.publishedAt && Number.isFinite(Date.parse(entry.publishedAt)) && <time dateTime={entry.publishedAt}>{new Intl.DateTimeFormat(locale,{dateStyle:"long"}).format(new Date(entry.publishedAt))}</time>}
      <h3><Link href={pagePath(locale,`journal/${getLocalizedSlug(entry,locale)}`)}>{entry.title[locale]}</Link></h3>
      <p>{entry.summary[locale]}</p>
      <Link className="text-link" href={pagePath(locale,`journal/${getLocalizedSlug(entry,locale)}`)}>{t("readMore")} ↗</Link>
     </div>
    </article>;
   })}</div>
  </section>}
  <ContactExperience locale={locale} details={contact} variant="home" />
 </div>;
}
