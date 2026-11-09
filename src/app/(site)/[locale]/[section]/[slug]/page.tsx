import Image from "next/image";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { createLocalizedMetadata } from "@/lib/seo/metadata";
import { ArtworkExperience } from "@/components/artwork-experience";
import { SiteBreadcrumbs } from "@/components/site-breadcrumbs";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { getArtworkById, getArtworkBySlug, getArtworks } from "@/content/repositories/artwork.repository";
import { getGalleryById, getGalleryBySlug, getGalleries } from "@/content/repositories/gallery.repository";
import { getJournalEntryById, getJournalEntryBySlug, getJournalEntries } from "@/content/repositories/journal.repository";
import { getEvents } from "@/content/repositories/event.repository";
import { getGalleryCoverArtwork, primaryImageFor } from "@/lib/content/publication";
import { getUpcomingJournalEvents, journalCoverImageFor, isSafeJournalHref } from "@/lib/content/journal";
import { isLocale,pagePath,locales,type Locale } from "@/types/locale";
import { getLocalizedSlug, matchesLocalizedSlug } from "@/lib/content/paths";
import { formatLocaleNumber } from "@/lib/locale-number";
import { resolveArtworkReturnHref } from "@/lib/artwork-return-navigation";
import { getArtworkStructuredData,getGalleryStructuredData,getJournalStructuredData,serializeJsonLd } from "@/lib/seo/structured-data";
type DetailProps={params:Promise<{locale:string;section:string;slug:string}>;searchParams:Promise<{fromGallery?:string;returnTo?:string|string[]}>};
export async function generateMetadata({params}:DetailProps):Promise<Metadata>{
 const {locale,section,slug}=await params;
 if(!isLocale(locale))return {};
 setRequestLocale(locale);
 const path=section+"/"+slug;
 if(section==="works"){
  const work=getArtworkBySlug(slug,locale);
  if(!work)return {robots:{index:false,follow:true}};
  const image=primaryImageFor(work);
  const alternatePaths=Object.fromEntries(locales.filter(target=>target!==locale).flatMap(target=>{
   const translated=getArtworkById(work.id,target);
   return translated?[[target,pagePath(target,"works/"+getLocalizedSlug(translated,target))]]:[];
  })) as Partial<Record<Locale,string>>;
  return createLocalizedMetadata({
   locale,
   path,
   title:work.title[locale]??work.slug,
   description:work.description?.[locale]??work.title[locale],
   alternatePaths,
   indexable:true,
   openGraphType:"article",
   images:image?[image.src]:undefined,
  });
 }
 if(section==="galleries"){
  const gallery=getGalleryBySlug(slug,locale);
  if(!gallery)return {robots:{index:false,follow:true}};
  const alternatePaths=Object.fromEntries(locales.filter(target=>target!==locale).flatMap(target=>{
   const translated=getGalleryById(gallery.id,target);
   return translated?[[target,pagePath(target,"galleries/"+getLocalizedSlug(translated,target))]]:[];
  })) as Partial<Record<Locale,string>>;
  const cover=getGalleryCoverArtwork(gallery,getArtworks(locale),locale)?.image;
  return createLocalizedMetadata({
   locale,
   path,
   title:gallery.title[locale]??gallery.slug,
   description:gallery.description[locale],
   alternatePaths,
   indexable:true,
   images:cover?[cover.src]:undefined,
  });
 }
 if(section==="journal"){
  const entry=getJournalEntryBySlug(slug,locale);
  if(!entry)return {robots:{index:false,follow:true}};
  const alternatePaths=Object.fromEntries(locales.filter(target=>target!==locale).flatMap(target=>{
   const translated=getJournalEntryById(entry.id,target);
   return translated?[[target,pagePath(target,"journal/"+getLocalizedSlug(translated,target))]]:[];
  })) as Partial<Record<Locale,string>>;
  const cover=journalCoverImageFor(entry,locale);
  return createLocalizedMetadata({
   locale,
   path,
   title:entry.title[locale]??entry.slug,
   description:entry.summary[locale],
   alternatePaths,
   indexable:true,
   openGraphType:"article",
   images:cover?[cover.src]:undefined,
   publishedTime:entry.publishedAt,
  });
 }
 return {robots:{index:false,follow:true}};
}
export const revalidate = 60;
export default async function Detail({params,searchParams}:DetailProps){
 const [{locale,section,slug},query]=await Promise.all([params,searchParams]);if(!isLocale(locale))notFound();setRequestLocale(locale);const t=await getTranslations({ locale });
 if(section==="works"){const w=getArtworkBySlug(slug,locale);if(!w)notFound();const localizedSlug=getLocalizedSlug(w,locale);if(!matchesLocalizedSlug(w,locale,slug))redirect(pagePath(locale,`works/${encodeURIComponent(localizedSlug)}`));const img=primaryImageFor(w);if(!img)notFound();
 const returnHref=resolveArtworkReturnHref(locale,typeof query.returnTo==="string"?query.returnTo:undefined);
 const originGallery=typeof query.fromGallery==="string"?getGalleries(locale).find(gallery=>matchesLocalizedSlug(gallery,locale,query.fromGallery!)&&gallery.artworkIds.includes(w.id)):undefined;
 const breadcrumbItems=originGallery?[{label:t("home"),href:pagePath(locale)},{label:t("galleries"),href:pagePath(locale,"galleries")},{label:originGallery.title[locale]??originGallery.slug,href:pagePath(locale,`galleries/${getLocalizedSlug(originGallery,locale)}`)},{label:w.title[locale]??w.slug}]:[{label:t("home"),href:pagePath(locale)},{label:t("selected"),href:pagePath(locale,"works")},{label:w.title[locale]??w.slug}];
 return <><script type="application/ld+json" dangerouslySetInnerHTML={{__html:serializeJsonLd(getArtworkStructuredData(w,locale))}}/><div className="page-content"><SiteBreadcrumbs locale={locale} items={breadcrumbItems}/><Link className="back-link artwork-back-link" href={returnHref}>{t("artworkBackToWorks")}</Link><article className="artwork-detail"><div className="artwork-detail-image"><Image sizes="(max-width: 600px) 100vw, (max-width: 900px) 90vw, 50vw" src={img.src} alt={img.alt[locale]??""} width={img.width} height={img.height}/></div><div className="artwork-detail-copy"><h1>{w.title[locale]}</h1>{w.medium?.[locale]&&<p>{w.medium[locale]}</p>}{w.year&&<p>{formatLocaleNumber(w.year,locale)}</p>}{w.description?.[locale]&&<p>{w.description[locale]}</p>}</div></article></div></>;}
 if(section==="galleries"){
  const g=getGalleryBySlug(slug,locale);
  if(!g)notFound();
  const publicWorks=getArtworks(locale);
  const members=g.artworkIds.map(id=>publicWorks.find(w=>w.id===id)).filter((w):w is (typeof publicWorks)[number]=>w!==undefined);
  const cover=getGalleryCoverArtwork(g,getArtworks(locale),locale);
  return <><script type="application/ld+json" dangerouslySetInnerHTML={{__html:serializeJsonLd(getGalleryStructuredData(g,getArtworks(locale),locale,`https://nasoodi.art${pagePath(locale,`galleries/${getLocalizedSlug(g,locale)}`)}`))}}/><div className="page-content">
   <SiteBreadcrumbs locale={locale} items={[{label:t("home"),href:pagePath(locale)},{label:t("galleries"),href:pagePath(locale,"galleries")},{label:g.title[locale] ?? g.slug}]}/>
   <header className="page-heading"><p className="eyebrow">{t("galleries")}</p><h1>{g.title[locale]}</h1><p>{g.description[locale]}</p></header>
   {cover&&<figure className="gallery-detail-cover"><Image sizes="(max-width: 800px) 90vw, 54vw" src={cover.image.src} alt={cover.image.alt[locale]??""} width={cover.image.width} height={cover.image.height}/></figure>}
   <ArtworkExperience artworks={members} locale={locale} context={`gallery:${getLocalizedSlug(g,locale)}`} />
  </div></>;
 }
 if(section==="journal"){
  const entry=getJournalEntryBySlug(slug,locale);if(!entry)notFound();const localizedSlug=getLocalizedSlug(entry,locale);if(!matchesLocalizedSlug(entry,locale,slug))redirect(pagePath(locale,`journal/${encodeURIComponent(localizedSlug)}`));
  const relatedEntries=getJournalEntries(locale).filter(item=>item.id!==entry.id).slice(0,3);
  const dateLabel=(value:string,timeZone?:string)=>new Intl.DateTimeFormat(locale,{dateStyle:"long",...(timeZone?{timeStyle:"short" as const,timeZone}:{})}).format(new Date(value));
  const event=entry.event;
  const cover=journalCoverImageFor(entry,locale);
  const registrationStillRelevant=Boolean(event?.registrationUrl&&getUpcomingJournalEvents(getEvents(locale),locale).some(item=>item.id===entry.id));
  const typeLabel=entry.type==="event"?t("journalEvents"):entry.type==="exhibition"?t("journalExhibitions"):entry.type==="studio-update"?t("journalStudio"):t("journalStories");
  return <><script type="application/ld+json" dangerouslySetInnerHTML={{__html:serializeJsonLd(getJournalStructuredData(entry,locale,`https://nasoodi.art${pagePath(locale,`journal/${getLocalizedSlug(entry,locale)}`)}`))}}/>
   <article className="page-content article-page journal-detail">
    <SiteBreadcrumbs locale={locale} items={[{label:t("home"),href:pagePath(locale)},{label:t("journal"),href:pagePath(locale,"journal")},{label:entry.title[locale] ?? entry.slug}]}/>
    <p className="eyebrow">{typeLabel}</p><h1>{entry.title[locale]}</h1><p className="article-summary">{entry.summary[locale]}</p>
    {entry.publishedAt&&Number.isFinite(Date.parse(entry.publishedAt))&&<p className="article-publication-date"><time dateTime={entry.publishedAt}>{t("publicationDate")}: {dateLabel(entry.publishedAt)}</time></p>}
    {cover&&<figure className="journal-detail-cover"><Image src={cover.src} alt={cover.alt[locale] ?? entry.title[locale] ?? entry.slug} width={cover.width} height={cover.height} sizes="(max-width: 900px) 100vw, 58rem" /></figure>}
    {event&&<section className="event-details" aria-label={t("eventInformation")}>
      <h2>{t("eventDate")}</h2><p><time dateTime={event.startsAt}>{dateLabel(event.startsAt,event.timeZone)}</time> <span dir="ltr">{event.timeZone}</span></p>
      {event.endsAt&&<p>{t("eventEnds")}: <time dateTime={event.endsAt}>{dateLabel(event.endsAt,event.timeZone)}</time></p>}
      {event.venue?.[locale]&&<p>{t("eventVenue")}: {event.venue[locale]}</p>}
      {event.attendanceMode&&<p>{t("attendanceMode")}: {event.attendanceMode==="in-person"?t("inPerson"):event.attendanceMode==="online"?t("online"):t("hybrid")}</p>}
      {registrationStillRelevant&&<a className="text-link" href={event.registrationUrl!} rel="noopener noreferrer" target="_blank">{t("registration")} ↗</a>}
    </section>}
    {entry.body?.[locale]&&<div className="prose">{entry.body[locale].map((block,index)=>{
      if(block.type==="paragraph")return <p key={index}>{block.text}</p>;
      if(block.type==="heading")return block.level===2?<h2 key={index}>{block.text}</h2>:<h3 key={index}>{block.text}</h3>;
      if(block.type==="list"){const items=block.items.map((item,i)=><li key={i}>{item}</li>);return block.ordered?<ol key={index}>{items}</ol>:<ul key={index}>{items}</ul>;}
      if(block.type==="quote")return <blockquote key={index}><p>{block.text}</p>{block.attribution&&<cite>{block.attribution}</cite>}</blockquote>;
      if(block.type==="link"&&isSafeJournalHref(block.href)){const external=block.href.startsWith("https://");return <p key={index}><a href={block.href} {...(external?{target:"_blank",rel:"noopener noreferrer"}:{})}>{block.text} ↗</a></p>;}
      return null;
    })}</div>}
    {relatedEntries.length>0&&<nav className="journal-more" aria-label={t("moreFromJournal")}><h2>{t("moreFromJournal")}</h2><ul>{relatedEntries.map(item=><li key={item.id}><Link href={pagePath(locale,`journal/${getLocalizedSlug(item,locale)}`)}>{item.title[locale]}</Link></li>)}</ul></nav>}
   </article>
  </>;
 }
 notFound();
}