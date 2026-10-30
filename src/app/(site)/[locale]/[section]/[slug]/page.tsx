import Image from "next/image";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { artworks,galleries,journalEntries,getPublicArtworks,getPublicGalleries,getPublicJournal,copyFor,isLocale,pagePath,otherLocale,primaryImageFor,isSafeJournalHref,getArtworkStructuredData,getGalleryStructuredData,getJournalStructuredData,serializeJsonLd } from "@/lib/site";
type DetailProps={params:Promise<{locale:string;section:string;slug:string}>};
export async function generateMetadata({params}:DetailProps):Promise<Metadata>{
 const {locale,section,slug}=await params;
 if(!isLocale(locale))return {};
 const canonical=pagePath(locale,`${section}/${slug}`);
 if(section==="works"){
  const work=getPublicArtworks(artworks,locale).find(item=>item.slug===slug);
  if(!work)return {robots:{index:false,follow:true}};
  const image=primaryImageFor(work);
  const description=work.description?.[locale]??work.title[locale];
  const translated=getPublicArtworks(artworks,otherLocale(locale)).some(item=>item.slug===slug);
  return {title:work.title[locale],description,alternates:{canonical,...(translated?{languages:{[locale]:canonical,[otherLocale(locale)]:pagePath(otherLocale(locale),`works/${slug}`)}}:{})},openGraph:{type:"article",title:work.title[locale],description,...(image?{images:[image.src]}:{})}};
 }
 if(section==="galleries"){
  const gallery=getPublicGalleries(galleries,artworks,locale).find(item=>item.slug===slug);
  if(!gallery)return {robots:{index:false,follow:true}};
  const translated=getPublicGalleries(galleries,artworks,otherLocale(locale)).some(item=>item.slug===slug);
  return {title:gallery.title[locale],description:gallery.description[locale],alternates:{canonical,...(translated?{languages:{[locale]:canonical,[otherLocale(locale)]:pagePath(otherLocale(locale),`galleries/${slug}`)}}:{})},openGraph:{type:"website",title:gallery.title[locale],description:gallery.description[locale]}};
 }
 if(section==="journal"){
  const entry=getPublicJournal(journalEntries,locale).find(item=>item.slug===slug);
  if(!entry)return {robots:{index:false,follow:true}};
  const translated=getPublicJournal(journalEntries,otherLocale(locale)).some(item=>item.slug===slug);
  return {title:entry.title[locale],description:entry.summary[locale],alternates:{canonical,...(translated?{languages:{[locale]:canonical,[otherLocale(locale)]:pagePath(otherLocale(locale),`journal/${slug}`)}}:{})},openGraph:{type:"article",title:entry.title[locale],description:entry.summary[locale],...(entry.publishedAt?{publishedTime:entry.publishedAt}:{})}};
 }
 return {robots:{index:false,follow:true}};
}
export default async function Detail({params}:{params:Promise<{locale:string;section:string;slug:string}>}){
 const {locale,section,slug}=await params;if(!isLocale(locale))notFound();const t=copyFor(locale);
 if(section==="works"){const w=getPublicArtworks(artworks,locale).find(x=>x.slug===slug);if(!w)notFound();const img=w.images.find(x=>x.role==="primary");if(!img)notFound();
 return <><script type="application/ld+json" dangerouslySetInnerHTML={{__html:serializeJsonLd(getArtworkStructuredData(w,locale))}}/><article className="page-content artwork-detail"><div className="artwork-detail-image"><Image sizes="(max-width: 600px) 100vw, (max-width: 900px) 90vw, 50vw" src={img.src} alt={img.alt[locale]??""} width={img.width} height={img.height}/></div><div className="artwork-detail-copy"><h1>{w.title[locale]}</h1>{w.medium?.[locale]&&<p>{w.medium[locale]}</p>}{w.year&&<p>{w.year}</p>}{w.description?.[locale]&&<p>{w.description[locale]}</p>}</div></article></>;}
 if(section==="galleries"){const g=getPublicGalleries(galleries,artworks,locale).find(x=>x.slug===slug);if(!g)notFound();const publicWorks=getPublicArtworks(artworks,locale);const members=g.artworkIds.map(id=>publicWorks.find(w=>w.id===id)).filter(w=>w!==undefined);
 return <><script type="application/ld+json" dangerouslySetInnerHTML={{__html:serializeJsonLd(getGalleryStructuredData(g,artworks,locale,`https://nasoodi.art${pagePath(locale,`galleries/${g.slug}`)}`))}}/><div className="page-content"><Link className="back-link" href={pagePath(locale,"galleries")}>← {t.galleries}</Link><header className="page-heading"><p className="eyebrow">{t.galleries}</p><h1>{g.title[locale]}</h1><p>{g.description[locale]}</p></header><div className="artwork-grid">{members.map(w=>{const img=w.images.find(x=>x.role==="primary");return img?<Link className="artwork-item" key={w.id} href={pagePath(locale,`works/${w.slug}`)}><Image sizes="(max-width: 600px) 100vw, (max-width: 900px) 90vw, 50vw" src={img.src} alt={img.alt[locale]??""} width={img.width} height={img.height}/><span>{w.title[locale]}</span></Link>:null;})}</div></div></>;}
 if(section==="journal"){const entry=getPublicJournal(journalEntries,locale).find(x=>x.slug===slug);if(!entry)notFound();return <><script type="application/ld+json" dangerouslySetInnerHTML={{__html:serializeJsonLd(getJournalStructuredData(entry,locale,`https://nasoodi.art${pagePath(locale,`journal/${entry.slug}`)}`))}}/><article className="page-content article-page"><p className="eyebrow">{t.journal}</p><h1>{entry.title[locale]}</h1><p className="article-summary">{entry.summary[locale]}</p>{entry.type==="event"&&entry.event&&<div className="event-details"><time dateTime={entry.event.startsAt}>{new Intl.DateTimeFormat(locale,{dateStyle:"long",timeStyle:"short",timeZone:entry.event.timeZone}).format(new Date(entry.event.startsAt))}</time><span dir="ltr">{entry.event.timeZone}</span>{entry.event.endsAt&&<time dateTime={entry.event.endsAt}>{locale==="fa"?"پایان":"Ends"}: {new Intl.DateTimeFormat(locale,{dateStyle:"long",timeStyle:"short",timeZone:entry.event.timeZone}).format(new Date(entry.event.endsAt))}</time>}{entry.event.venue?.[locale]&&<p>{entry.event.venue[locale]}</p>}{entry.event.registrationUrl&&<a className="text-link" href={entry.event.registrationUrl} rel="noopener noreferrer" target="_blank">{locale==="fa"?"اطلاعات و ثبت‌نام":"Details and registration"} ↗</a>}</div>}{entry.body?.[locale]&&<div className="prose">{entry.body[locale].map((block,index)=>{
  if(block.type==="paragraph")return <p key={index}>{block.text}</p>;
  if(block.type==="heading")return block.level===2?<h2 key={index}>{block.text}</h2>:<h3 key={index}>{block.text}</h3>;
  if(block.type==="list"){const items=block.items.map((item,i)=><li key={i}>{item}</li>);return block.ordered?<ol key={index}>{items}</ol>:<ul key={index}>{items}</ul>;}
  if(block.type==="quote")return <blockquote key={index}><p>{block.text}</p>{block.attribution&&<cite>{block.attribution}</cite>}</blockquote>;
  if(block.type==="link"&&isSafeJournalHref(block.href)){const external=block.href.startsWith("https://");return <p key={index}><a href={block.href} {...(external?{target:"_blank",rel:"noopener noreferrer"}:{})}>{block.text} ↗</a></p>;}
  return null;
 })}</div>}</article></>;}
 notFound();
}
