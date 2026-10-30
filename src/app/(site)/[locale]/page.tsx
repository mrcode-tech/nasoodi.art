import Image from "next/image";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { artworks,galleries,journalEntries,homepageSelection,getPublicJournal,getHomepageHero,getHomepageFeaturedArtworks,getHomepageFeaturedGalleries,getGalleryCoverArtwork,getUpcomingJournalEvents,primaryImageFor } from "@/lib/site";
import { copyFor,isLocale,pagePath } from "@/lib/site";
type Props={params:Promise<{locale:string}>};
export async function generateMetadata({params}:Props):Promise<Metadata>{const {locale}=await params;if(!isLocale(locale))return {};
 return {title:locale==="fa"?"غزاله عبداله زاده نسودی":"Ghazaleh Abdolahzade Nasoodi",
 description:locale==="fa"?"پورتفولیوی غزاله عبداله زاده نسودی، نقاش رنگ‌روغن.":"The artist portfolio of Ghazaleh Abdolahzade Nasoodi, oil painter.",
 alternates:{canonical:pagePath(locale),languages:{fa:"/fa",en:"/en"}}};}
export default async function Home({params}:Props){const {locale}=await params;if(!isLocale(locale))notFound();const t=copyFor(locale);
 const hero=getHomepageHero(artworks,homepageSelection,locale),heroImage=hero?primaryImageFor(hero):undefined;
 const works=getHomepageFeaturedArtworks(artworks,homepageSelection,locale),sets=getHomepageFeaturedGalleries(galleries,artworks,homepageSelection,locale);
 const upcomingEvent=getUpcomingJournalEvents(journalEntries,locale)[0];
 const journal=getPublicJournal(journalEntries,locale).filter(entry=>entry.id!==upcomingEvent?.id).slice(0,2);
 return <div className="page-content home-page">
  <section className={`home-intro${heroImage ? " has-hero" : ""}`} aria-labelledby="home-title">
   <div className="home-intro-copy"><p className="eyebrow">{t.portfolio}</p>
    <h1 id="home-title">{locale==="fa"?"غزاله عبداله زاده نسودی":"Ghazaleh Abdolahzade Nasoodi"}</h1>
    <p className="artist-discipline">{t.discipline}</p><div className="intro-rule"/>
    <p className="intro-note">{t.selectedIntro}</p><Link className="text-link" href={pagePath(locale,"works")}>{t.explore} ↗</Link>
   </div>
   {heroImage && <figure className="hero-artwork">
    <Image sizes="(max-width: 900px) 100vw, 58vw" src={heroImage.src} alt={heroImage.alt[locale] ?? ""} width={heroImage.width} height={heroImage.height} priority />
    {hero?.title[locale] && <figcaption>{hero.title[locale]}</figcaption>}
   </figure>}
  </section>
  <section className="editorial-section" aria-labelledby="featured-works"><div className="section-heading"><div><p className="eyebrow">{t.portfolio}</p><h2 id="featured-works">{t.selected}</h2></div><Link className="text-link" href={pagePath(locale,"works")}>{t.explore} ↗</Link></div>
   {works.length===0?<p className="empty-note">{t.emptyWorks}</p>:<div className="artwork-grid">{works.slice(0,4).map(w=>{const img=primaryImageFor(w);return img?<Link className="artwork-item" key={w.id} href={pagePath(locale,`works/${w.slug}`)}><Image sizes="(max-width: 600px) 100vw, (max-width: 900px) 90vw, 50vw" src={img.src} alt={img.alt[locale]??""} width={img.width} height={img.height}/><span>{w.title[locale]}</span></Link>:null;})}</div>}
  </section>
  <section className="editorial-section" aria-labelledby="featured-galleries"><div className="section-heading"><div><p className="eyebrow">{t.discover}</p><h2 id="featured-galleries">{t.galleries}</h2></div><Link className="text-link" href={pagePath(locale,"galleries")}>{t.discover} ↗</Link></div>
   {sets.length===0?<p className="empty-note">{t.emptyGalleries}</p>:<div className="gallery-cards">{sets.map(g=>{const cover=getGalleryCoverArtwork(g,artworks,locale);return <Link className="gallery-card" key={g.id} href={pagePath(locale,`galleries/${g.slug}`)}>{cover&&<Image sizes="(max-width: 700px) 100vw, 42vw" src={cover.image.src} alt={cover.image.alt[locale]??""} width={cover.image.width} height={cover.image.height}/>}<span className="gallery-card-copy"><strong>{g.title[locale]}</strong><span>{g.description[locale]}</span></span></Link>;})}</div>}
  </section>
  <section className="editorial-section" aria-labelledby="latest-journal"><div className="section-heading"><div><p className="eyebrow">{t.latest}</p><h2 id="latest-journal">{t.journal}</h2></div><Link className="text-link" href={pagePath(locale,"journal")}>{t.journal} ↗</Link></div>
   {upcomingEvent?.event&&<article className="journal-upcoming">
    <p className="eyebrow">{t.upcoming}</p>
    <h3><Link href={pagePath(locale,`journal/${upcomingEvent.slug}`)}>{upcomingEvent.title[locale]}</Link></h3>
    <time dateTime={upcomingEvent.event.startsAt}>{new Intl.DateTimeFormat(locale,{dateStyle:"long",timeStyle:"short",timeZone:upcomingEvent.event.timeZone}).format(new Date(upcomingEvent.event.startsAt))}</time>
    {upcomingEvent.event.venue?.[locale]&&<p>{t.venue}: {upcomingEvent.event.venue[locale]}</p>}
    <p>{upcomingEvent.summary[locale]}</p>
    <Link className="text-link" href={pagePath(locale,`journal/${upcomingEvent.slug}`)}>{t.readMore} ↗</Link>
   </article>}
   {journal.length===0&&!upcomingEvent?<p className="empty-note">{t.emptyJournal}</p>:journal.length>0&&<div className="journal-list">{journal.map(j=><Link className="journal-list-item" key={j.id} href={pagePath(locale,`journal/${j.slug}`)}>{j.title[locale]}</Link>)}</div>}
  </section>
 </div>;
}
