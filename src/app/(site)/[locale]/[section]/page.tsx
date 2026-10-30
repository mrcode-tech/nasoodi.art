import Image from "next/image";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { artworks,galleries,journalEntries,getPublicArtworks,getPublicGalleries,getPublicJournal } from "@/lib/site";
import { copyFor,isLocale,pagePath } from "@/lib/site";
type Props={params:Promise<{locale:string;section:string}>};
const names=["works","galleries","journal","about","contact"] as const;
type Section=typeof names[number];
const valid=(s:string):s is Section=>names.includes(s as Section);
export async function generateMetadata({params}:Props):Promise<Metadata>{const {locale,section}=await params;if(!isLocale(locale)||!valid(section))return {};
 return {title:copyFor(locale)[section],robots:{index:false,follow:true}};}
export default async function SectionPage({params}:Props){const {locale,section}=await params;if(!isLocale(locale)||!valid(section))notFound();const t=copyFor(locale);
 if(section==="about")return <div className="page-content"><header className="page-heading"><p className="eyebrow">{t.about}</p><h1>{locale==="fa"?"غزاله عبداله زاده نسودی":"Ghazaleh Abdolahzade Nasoodi"}</h1><p className="artist-discipline">{t.discipline}</p></header><p className="empty-note">{t.profilePending}</p></div>;
 if(section==="contact")return <div className="page-content"><header className="page-heading"><p className="eyebrow">{t.contact}</p><h1>{t.contact}</h1></header><p className="empty-note">{t.contactPending}</p></div>;
 if(section==="works"){const items=getPublicArtworks(artworks,locale);return <div className="page-content"><header className="page-heading"><p className="eyebrow">{t.portfolio}</p><h1>{t.works}</h1><p>{t.selectedIntro}</p></header>{items.length===0?<p className="empty-note">{t.emptyWorks}</p>:<div className="artwork-grid">{items.map(w=>{const img=w.images.find(x=>x.role==="primary");return img?<Link className="artwork-item" key={w.id} href={pagePath(locale,`works/${w.slug}`)}><Image sizes="(max-width: 600px) 100vw, (max-width: 900px) 90vw, 50vw" src={img.src} alt={img.alt[locale]??""} width={img.width} height={img.height}/><span>{w.title[locale]}</span></Link>:null;})}</div>}</div>;}
 if(section==="galleries"){const items=getPublicGalleries(galleries,artworks,locale);return <div className="page-content"><header className="page-heading"><p className="eyebrow">{t.portfolio}</p><h1>{t.galleries}</h1><p>{t.discover}</p></header>{items.length===0?<p className="empty-note">{t.emptyGalleries}</p>:<div className="gallery-list">{items.map(g=><Link className="gallery-list-item" key={g.id} href={pagePath(locale,`galleries/${g.slug}`)}>{g.title[locale]} ↗</Link>)}</div>}</div>;}
 const entries=getPublicJournal(journalEntries,locale);return <div className="page-content"><header className="page-heading"><p className="eyebrow">{t.portfolio}</p><h1>{t.journal}</h1></header>{entries.length===0?<p className="empty-note">{t.emptyJournal}</p>:<div className="journal-list">{entries.map(e=><Link className="journal-list-item" key={e.id} href={pagePath(locale,`journal/${e.slug}`)}>{e.title[locale]}</Link>)}</div>}</div>;
}
