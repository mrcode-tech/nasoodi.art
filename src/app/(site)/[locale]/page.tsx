import Image from "next/image";
import { ArtworkExperience } from "@/components/artwork-experience";
import { CollectionCarousel } from "@/components/collection-carousel";
import { BiographyDisclosure } from "@/components/biography-disclosure";
import { JournalAnnouncement } from "@/components/journal-announcement";
import { aboutPreviewFixture } from "@/lib/about-preview-fixtures";
import { Button } from "@/components/ui/button";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { artworks,galleries,journalEntries,homepageSelection,getPublicArtworks,getPublicGalleries,getHomepageHero,getHomepageFeaturedArtworks,getHomepageFeaturedGalleries,getHomepageJournalPreview,journalCoverImageFor,getUpcomingJournalEvent,primaryImageFor } from "@/lib/site";
import { copyFor,isLocale,pagePath } from "@/lib/site";
export const revalidate = 60;
type Props={params:Promise<{locale:string}>};
export async function generateMetadata({params}:Props):Promise<Metadata>{const {locale}=await params;if(!isLocale(locale))return {};
 return {title:locale==="fa"?"غزاله عبداله زاده نسودی":"Ghazaleh Abdolahzade Nasoodi",
 description:locale==="fa"?"پورتفولیوی هنری غزاله عبداله زاده نسودی.":"The artist portfolio of Ghazaleh Abdolahzade Nasoodi.",
 alternates:{canonical:pagePath(locale),languages:{fa:"/fa",en:"/en"}}};}
export default async function Home({params}:Props){const {locale}=await params;if(!isLocale(locale))notFound();const t=copyFor(locale);const biography=aboutPreviewFixture.biography[locale];
 const hero=getHomepageHero(artworks,homepageSelection,locale),heroImage=hero?primaryImageFor(hero):undefined;
 const heroAlt=heroImage?.alt[locale] ?? (locale==="fa" ? "هنرمند در آتلیه، روبه‌روی بوم نقاشی ایستاده است." : "The artist standing before a canvas in her studio.");
 const works=getHomepageFeaturedArtworks(artworks,homepageSelection,locale),sets=getHomepageFeaturedGalleries(galleries,artworks,homepageSelection,locale);
 const hasSelectedWorks=getPublicArtworks(artworks,locale).length>0;
 const hasFeaturedGalleries=getPublicGalleries(galleries,artworks,locale).length>0;
 const journal=getHomepageJournalPreview(journalEntries,locale);
 const announcement=getUpcomingJournalEvent(journalEntries,locale);
 return <div className="page-content home-page">
  <section className="home-intro has-hero" aria-labelledby="home-title">
   <figure className="hero-artwork">
    {heroImage ? <Image sizes="(max-width: 900px) 100vw, 58vw" src={heroImage.src} alt={heroAlt} width={heroImage.width} height={heroImage.height} priority /> : <Image sizes="(max-width: 900px) 100vw, 58vw" src="/images/homepage-hero.jpg" alt={heroAlt} width={4032} height={3024} priority /> }
    {hero?.title[locale] && <figcaption>{hero.title[locale]}</figcaption>}
   </figure>
   <div className="home-intro-copy">
    <p className="eyebrow">{t.portfolio}</p>
    <h1 id="home-title">{locale==="fa"?"غزاله عبداله زاده نسودی":"Ghazaleh Abdolahzade Nasoodi"}</h1>
    <section className="home-biography" aria-label={locale==="fa"?"زندگی‌نامه":"Biography"}>
      <BiographyDisclosure biography={biography} readMoreLabel={t.readMore} showLessLabel={t.showLess} lines={4}/>
    </section>
    {(hasFeaturedGalleries || hasSelectedWorks) && <div className="hero-actions">
     {hasFeaturedGalleries && <Button asChild variant="default" size="lg"><Link href={pagePath(locale,"galleries")}>{locale==="fa"?"گالری‌ها را ببینید":"Explore galleries"}</Link></Button>}
     {hasSelectedWorks && <Button asChild variant="outline" size="lg"><Link href={pagePath(locale,"works")}>{locale==="fa"?"گزیده آثار را ببینید":"View selected works"}</Link></Button>}
    </div>}
   </div>

  </section>
  <section className="editorial-section" aria-labelledby="featured-works"><div className="section-heading"><div><p className="eyebrow">{t.portfolio}</p><h2 id="featured-works">{t.selected}</h2></div><Link className="text-link" href={pagePath(locale,"galleries")}>{locale==="fa"?"گشت‌وگذار در مجموعه‌ها":"Explore collections"} ↗</Link></div>
   {works.length===0?<p className="empty-note">{t.emptyWorks}</p>:<ArtworkExperience artworks={works.slice(0,6)} locale={locale} context="home" />}
  </section>
  <section className="editorial-section" aria-labelledby="featured-galleries"><div className="section-heading"><div><p className="eyebrow">{t.discover}</p><h2 id="featured-galleries">{t.galleries}</h2></div><Link className="text-link" href={pagePath(locale,"galleries")}>{t.discover} ↗</Link></div>
   {sets.length===0?<p className="empty-note">{t.emptyGalleries}</p>:<CollectionCarousel galleries={sets} artworks={artworks} locale={locale} label={locale==="fa"?"مجموعه‌های هنری":"Featured collections"} />}
  </section>
  {journal.length > 0 && <section className="editorial-section" aria-labelledby="latest-journal">
   <div className="section-heading"><div><p className="eyebrow">{t.latest}</p><h2 id="latest-journal">{t.journal}</h2></div><Link className="text-link" href={pagePath(locale,"journal")}>{locale==="fa"?"مشاهده همه یادداشت‌ها":"Explore Journal"} ↗</Link></div>
   <div className="journal-preview-list">{journal.map(entry=>{
    const cover=journalCoverImageFor(entry,locale);
    return <article className={`journal-preview-item${cover?" has-cover":""}`} key={entry.id}>
     {cover&&<Image className="journal-cover-image" src={cover.src} alt={cover.alt[locale]} width={cover.width} height={cover.height} sizes="(max-width: 600px) 100vw, (max-width: 900px) 40vw, 24rem" />}
     <div className="journal-preview-copy">
      {entry.publishedAt && Number.isFinite(Date.parse(entry.publishedAt)) && <time dateTime={entry.publishedAt}>{new Intl.DateTimeFormat(locale,{dateStyle:"long"}).format(new Date(entry.publishedAt))}</time>}
      <h3><Link href={pagePath(locale,`journal/${entry.slug}`)}>{entry.title[locale]}</Link></h3>
      <p>{entry.summary[locale]}</p>
      <Link className="text-link" href={pagePath(locale,`journal/${entry.slug}`)}>{t.readMore} ↗</Link>
     </div>
    </article>;
   })}</div>
  </section>}
  {announcement?.event&&<JournalAnnouncement locale={locale} eyebrow={t.announcementEyebrow} dismissLabel={t.dismissAnnouncement} href={pagePath(locale,`journal/${announcement.slug}`)} event={{id:announcement.id,slug:announcement.slug,title:announcement.title[locale]!,startsAt:announcement.event.startsAt,timeZone:announcement.event.timeZone}} />}
 </div>;
}
