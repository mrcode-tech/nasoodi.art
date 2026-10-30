import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { artworks,galleries,journalEntries,getPublicArtworks,getPublicGalleries,getPublicJournal,copyFor,isLocale,pagePath } from "@/lib/site";
export default async function Detail({params}:{params:Promise<{locale:string;section:string;slug:string}>}){
 const {locale,section,slug}=await params;if(!isLocale(locale))notFound();const t=copyFor(locale);
 if(section==="works"){const w=getPublicArtworks(artworks,locale).find(x=>x.slug===slug);if(!w)notFound();const img=w.images.find(x=>x.role==="primary");if(!img)notFound();
 return <article className="page-content artwork-detail"><div className="artwork-detail-image"><Image sizes="(max-width: 600px) 100vw, (max-width: 900px) 90vw, 50vw" src={img.src} alt={img.alt[locale]??""} width={img.width} height={img.height}/></div><div className="artwork-detail-copy"><h1>{w.title[locale]}</h1>{w.medium?.[locale]&&<p>{w.medium[locale]}</p>}{w.year&&<p>{w.year}</p>}{w.description?.[locale]&&<p>{w.description[locale]}</p>}</div></article>;}
 if(section==="galleries"){const g=getPublicGalleries(galleries,artworks,locale).find(x=>x.slug===slug);if(!g)notFound();const publicWorks=getPublicArtworks(artworks,locale);const members=g.artworkIds.map(id=>publicWorks.find(w=>w.id===id)).filter(w=>w!==undefined);
 return <div className="page-content"><Link className="back-link" href={pagePath(locale,"galleries")}>← {t.galleries}</Link><header className="page-heading"><p className="eyebrow">{t.galleries}</p><h1>{g.title[locale]}</h1><p>{g.description[locale]}</p></header><div className="artwork-grid">{members.map(w=>{const img=w.images.find(x=>x.role==="primary");return img?<Link className="artwork-item" key={w.id} href={pagePath(locale,`works/${w.slug}`)}><Image sizes="(max-width: 600px) 100vw, (max-width: 900px) 90vw, 50vw" src={img.src} alt={img.alt[locale]??""} width={img.width} height={img.height}/><span>{w.title[locale]}</span></Link>:null;})}</div></div>;}
 if(section==="journal"){const entry=getPublicJournal(journalEntries,locale).find(x=>x.slug===slug);if(!entry)notFound();return <article className="page-content article-page"><p className="eyebrow">{t.journal}</p><h1>{entry.title[locale]}</h1><p className="article-summary">{entry.summary[locale]}</p>{entry.body?.[locale]&&<div className="prose">{entry.body[locale]}</div>}</article>;}
 notFound();
}
