import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { artworks,galleries,journalEntries,getPublicArtworks,getPublicGalleries,getPublicJournal } from "@/lib/site";
import { copyFor,isLocale,pagePath } from "@/lib/site";
type Props={params:Promise<{locale:string}>};
export async function generateMetadata({params}:Props):Promise<Metadata>{const {locale}=await params;if(!isLocale(locale))return {};
 return {title:locale==="fa"?"غزاله عبداله زاده نسودی":"Ghazaleh Abdolahzade Nasoodi",
 description:locale==="fa"?"پورتفولیوی غزاله عبداله زاده نسودی، نقاش رنگ‌روغن.":"The artist portfolio of Ghazaleh Abdolahzade Nasoodi, oil painter.",
 alternates:{canonical:pagePath(locale),languages:{fa:"/fa",en:"/en"}}};}
export default async function Home({params}:Props){const {locale}=await params;if(!isLocale(locale))notFound();const t=copyFor(locale);
 const works=getPublicArtworks(artworks,locale),sets=getPublicGalleries(galleries,artworks,locale),journal=getPublicJournal(journalEntries,locale).slice(0,3);
 return <div className="page-content home-page">
  <section className="home-intro" aria-labelledby="home-title"><p className="eyebrow">{t.portfolio}</p>
   <h1 id="home-title">{locale==="fa"?"غزاله عبداله زاده نسودی":"Ghazaleh Abdolahzade Nasoodi"}</h1><p className="artist-discipline">{t.discipline}</p>
   <div className="intro-rule"/><p className="intro-note">{t.selectedIntro}</p><Link className="text-link" href={pagePath(locale,"works")}>{t.explore} ↗</Link>
  </section>
  <section className="editorial-section" aria-labelledby="featured-works"><div className="section-heading"><div><p className="eyebrow">{t.portfolio}</p><h2 id="featured-works">{t.selected}</h2></div><Link className="text-link" href={pagePath(locale,"works")}>{t.explore} ↗</Link></div>
   {works.length===0?<p className="empty-note">{t.emptyWorks}</p>:<div className="artwork-grid">{works.slice(0,4).map(w=>{const img=w.images.find(x=>x.role==="primary");return img?<Link className="artwork-item" key={w.id} href={pagePath(locale,`works/${w.slug}`)}>{/* eslint-disable-next-line @next/next/no-img-element */}<img src={img.src} alt={img.alt[locale]??""} width={img.width} height={img.height}/><span>{w.title[locale]}</span></Link>:null;})}</div>}
  </section>
  <section className="editorial-section" aria-labelledby="featured-galleries"><div className="section-heading"><div><p className="eyebrow">{t.discover}</p><h2 id="featured-galleries">{t.galleries}</h2></div><Link className="text-link" href={pagePath(locale,"galleries")}>{t.discover} ↗</Link></div>
   {sets.length===0?<p className="empty-note">{t.emptyGalleries}</p>:<div className="gallery-list">{sets.map(g=><Link className="gallery-list-item" key={g.id} href={pagePath(locale,`galleries/${g.slug}`)}>{g.title[locale]} ↗</Link>)}</div>}
  </section>
  <section className="editorial-section" aria-labelledby="latest-journal"><div className="section-heading"><div><p className="eyebrow">{t.latest}</p><h2 id="latest-journal">{t.journal}</h2></div><Link className="text-link" href={pagePath(locale,"journal")}>{t.journal} ↗</Link></div>
   {journal.length===0?<p className="empty-note">{t.emptyJournal}</p>:<div className="journal-list">{journal.map(j=><Link className="journal-list-item" key={j.id} href={pagePath(locale,`journal/${j.slug}`)}>{j.title[locale]}</Link>)}</div>}
  </section>
 </div>;
}
