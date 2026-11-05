import Image from "next/image";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { createLocalizedMetadata } from "@/lib/seo/metadata";
import { GalleryIndex } from "@/components/gallery-index";
import { ContactExperience } from "@/components/contact-experience";
import { aboutPreviewFixture } from "@/lib/about-preview-fixtures";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { artworks,galleries,journalEntries,cvEntries,cvDocument,artistProfile,contactDetails } from "@/content/portfolio";
import { getPublicArtistProfile,getPublicContactDetails,getPublicArtworks,getPublicGalleries,getPublicCvEntries,getPublicCvDocument,getGalleryCoverArtwork,primaryImageFor } from "@/lib/content/publication";
import { getPublicJournal,getJournalEntriesForCategory,journalCategories,journalCoverImageFor } from "@/lib/content/journal";
import type { JournalCategory } from "@/types/content";
import { paginateItems, resolveGalleryPagination } from "@/lib/gallery-pagination";
import { JournalPagination } from "@/components/journal-pagination";
import { SiteBreadcrumbs } from "@/components/site-breadcrumbs";
import { isLocale,pagePath,locales,type Locale } from "@/types/locale";
import { getLocalizedSlug } from "@/lib/content/paths";
import { hasEquivalentContentSet } from "@/lib/content/identity";
type Props={params:Promise<{locale:string;section:string}>;searchParams:Promise<{category?:string;page?:string;pageSize?:string}>};
const names=["works","galleries","journal","about","contact","cv"] as const;
type Section=typeof names[number];
const valid=(s:string):s is Section=>names.includes(s as Section);
export async function generateMetadata({params}:Props):Promise<Metadata>{
 const {locale,section}=await params;
 if(!isLocale(locale)||!valid(section))return {};
 setRequestLocale(locale);
 const t=await getTranslations({ locale });
 const works=getPublicArtworks(artworks,locale);
 const sets=getPublicGalleries(galleries,artworks,locale);
 const journal=getPublicJournal(journalEntries,locale);
 const cv=getPublicCvEntries(cvEntries,locale);
 const profile=getPublicArtistProfile(artistProfile,locale);

 const indexable=section==="works"?works.length>0:
  section==="galleries"?sets.length>0:
  section==="journal"?journal.length>0:
  section==="cv"?cv.length>0:
  section==="about"?Boolean(profile):false;
 const equivalentFor=(target:Locale)=>{
  if(section==="works")return hasEquivalentContentSet(works,getPublicArtworks(artworks,target));
  if(section==="galleries")return hasEquivalentContentSet(sets,getPublicGalleries(galleries,artworks,target));
  if(section==="journal")return hasEquivalentContentSet(journal,getPublicJournal(journalEntries,target));
  if(section==="cv")return hasEquivalentContentSet(cv,getPublicCvEntries(cvEntries,target));
  if(section==="about")return Boolean(profile&&getPublicArtistProfile(artistProfile,target));
  return false;
 };
 const alternatePaths=Object.fromEntries(locales.filter(target=>target!==locale&&equivalentFor(target)).map(target=>[target,pagePath(target,section)])) as Partial<Record<Locale,string>>;
 const description=section==="works"?t("worksDescription"):
  section==="galleries"?t("galleriesDescription"):
  section==="journal"?t("journalDescription"):
  section==="cv"?t("cvDescription"):
  section==="about"?profile?.statement[locale]:undefined;
 const firstWork=works[0];
 const firstGallery=sets[0];
 const firstJournal=journal[0];
 const socialImage=section==="about"&&profile?profile.portrait?.src:
  section==="works"&&firstWork?primaryImageFor(firstWork)?.src:
  section==="galleries"&&firstGallery?getGalleryCoverArtwork(firstGallery,artworks,locale)?.image.src:
  section==="journal"&&firstJournal?journalCoverImageFor(firstJournal,locale)?.src:undefined;
 const indexablePage=indexable&&section!=="contact";

 return createLocalizedMetadata({
  locale,
  path:section,
  title:t(section),
  description,
  alternatePaths:indexablePage?alternatePaths:undefined,
  indexable:indexablePage,
  images:socialImage?[socialImage]:undefined,
 });
}
export default async function SectionPage({params,searchParams}:Props){const [{locale,section},{category:rawCategory,page:rawPage,pageSize:rawPageSize}]=await Promise.all([params,searchParams]);if(!isLocale(locale)||!valid(section))notFound();setRequestLocale(locale);const t=await getTranslations({ locale });
 if(section==="about"){
  const profile=getPublicArtistProfile(artistProfile,locale);
  if(profile){
   const statement=profile.statement[locale]??"";
   const biography=profile.biography[locale]??"";
   const entries=getPublicCvEntries(cvEntries,locale);
   const document=getPublicCvDocument(cvDocument);
   const groups=[
    {id:"education",categories:["education"],label:t("education")},
    {id:"exhibitions",categories:["solo-exhibition","group-exhibition"],label:t("selectedExhibitions")},
    {id:"publications",categories:["publication"],label:t("publications")},
    {id:"awards",categories:["award"],label:t("awards")},
    {id:"collections",categories:["collection"],label:t("collections")},
    {id:"other",categories:["other"],label:t("otherActivities")},
   ];
   const portrait=profile.portrait;
   return <div className="page-content about-page">
    <SiteBreadcrumbs locale={locale} items={[{label:t("home"),href:pagePath(locale)},{label:t("about")}]}/>
    <header className="page-heading"><p className="eyebrow">{t("about")}</p><h1>{t("artistName")}</h1><p className="artist-discipline">{t("discipline")}</p></header>
    <div className="profile-content">
     {portrait?<Image className="artist-portrait" src={portrait.src} alt={portrait.alt[locale]??""} width={portrait.width} height={portrait.height} sizes="(max-width: 700px) 100vw, 34rem"/>:<Image className="artist-portrait" src="/images/homepage-hero.jpg" alt={t("heroAlt")} width={4032} height={3024} sizes="(max-width: 700px) 100vw, 34rem"/>}
     <section className="about-statement"><h2>{t("statement")}</h2>{statement.split(/\n{2,}/).map((paragraph,index)=><p key={index}>{paragraph}</p>)}</section>
     <section className="about-biography"><h2>{t("biography")}</h2>{biography.split(/\n{2,}/).map((paragraph,index)=><p className="about-biography-copy" key={index}>{paragraph}</p>)}</section>
     {(entries.length>0||document)&&<section className="about-cv-section"><h2>{t("cv")}</h2>
      {groups.map(group=>{const rows=entries.filter(entry=>group.categories.includes(entry.category));return rows.length?<section className="cv-category" key={group.id}><h3>{group.label}</h3><ol className="cv-list">{rows.map(entry=><li key={entry.id}><time>{entry.year}</time><div><strong>{entry.title[locale]}</strong>{entry.organization?.[locale]&&<span>{entry.organization[locale]}</span>}{entry.location?.[locale]&&<span>{entry.location[locale]}</span>}</div></li>)}</ol></section>:null;})}
      {document&&<p><a className="text-link" href={document.src} download={document.fileName}>{t("downloadCvPdf")}</a></p>}
     </section>}
    </div>
   </div>;
  }
  const biography=aboutPreviewFixture.biography[locale];
  const statement=aboutPreviewFixture.statement[locale];
  const portraitAlt=t("heroAlt");
  const groups=[
   {id:"education",label:t("education")},
   {id:"exhibition",label:t("selectedExhibitions")},
   {id:"publication",label:t("publications")},
   {id:"award",label:t("awards")},
   {id:"practice",label:t("artisticPractice")},
  ];
  return <div className="page-content about-page">
   <SiteBreadcrumbs locale={locale} items={[{label:t("home"),href:pagePath(locale)},{label:t("about")}]}/>
   <header className="page-heading"><p className="eyebrow">{t("about")}</p><h1>{t("artistName")}</h1><p className="artist-discipline">{t("discipline")}</p></header>
   <div className="profile-content">
    <p className="sample-content-notice" role="note">{t("samplePreviewNotice")}</p>
    <Image className="artist-portrait" src="/images/homepage-hero.jpg" alt={portraitAlt} width={4032} height={3024} sizes="(max-width: 700px) 100vw, 34rem"/>
    <section className="about-statement"><h2>{t("statement")}</h2><p>{statement}</p></section>
    <section className="about-biography"><h2>{t("biography")}</h2><p className="about-biography-copy">{biography}</p></section>
    <section className="about-cv-section"><h2>{t("cv")}</h2>
     {groups.map(group=>{const rows=aboutPreviewFixture.cv.filter(entry=>entry.category===group.id);return rows.length?<section className="cv-category" key={group.id}><h3>{group.label}</h3><ol className="cv-list">{rows.map(entry=><li key={entry.id}><time>{entry.year}</time><div><strong>{entry.title[locale]}</strong><span>{entry.organization[locale]}</span>{"location" in entry&&entry.location?.[locale]&&<span>{entry.location[locale]}</span>}</div></li>)}</ol></section>:null;})}
     <p className="sample-content-notice">{t("samplePdfNotice")} <a className="text-link" href="/api/sample-cv" download="ghazaleh-abdolahzade-nasoodi-sample-cv.pdf">{t("downloadCvPdf")}</a></p>
    </section>
   </div>
  </div>;
 }
 if(section==="contact"){const details=getPublicContactDetails(contactDetails);return <div className="page-content"><SiteBreadcrumbs locale={locale} items={[{label:t("home"),href:pagePath(locale)},{label:t("contact")}]}/><ContactExperience locale={locale} details={details} variant="page" /></div>;}
 if(section==="cv"){const entries=getPublicCvEntries(cvEntries,locale);if(entries.length===0)notFound();return <div className="page-content"><SiteBreadcrumbs locale={locale} items={[{label:t("home"),href:pagePath(locale)},{label:t("about"),href:pagePath(locale,"about")},{label:t("cv")}]}/><header className="page-heading"><p className="eyebrow">{t("about")}</p><h1>{t("cv")}</h1></header><ol className="cv-list">{entries.map(entry=><li key={entry.id}><time>{entry.year}</time><div><strong>{entry.title[locale]}</strong>{entry.organization?.[locale]&&<span>{entry.organization[locale]}</span>}{"location" in entry && entry.location?.[locale]&&<span>{entry.location[locale]}</span>}</div></li>)}</ol></div>;}
 if(section==="works"){const items=getPublicArtworks(artworks,locale);return <div className="page-content"><SiteBreadcrumbs locale={locale} items={[{label:t("home"),href:pagePath(locale)},{label:t("selected")}]}/><header className="page-heading"><p className="eyebrow">{t("portfolio")}</p><h1>{t("works")}</h1><p>{t("selectedIntro")}</p></header>{items.length===0?<p className="empty-note">{t("emptyWorks")}</p>:<div className="artwork-grid">{items.map(w=>{const img=primaryImageFor(w);return img?<Link className="artwork-item" key={w.id} href={pagePath(locale,`works/${getLocalizedSlug(w,locale)}`)}><Image sizes="(max-width: 600px) 100vw, (max-width: 900px) 90vw, 50vw" src={img.src} alt={img.alt[locale]??""} width={img.width} height={img.height}/><span>{w.title[locale]}</span></Link>:null;})}</div>}</div>;}
 if(section==="galleries"){const items=getPublicGalleries(galleries,artworks,locale);return <div className="page-content"><SiteBreadcrumbs locale={locale} items={[{label:t("home"),href:pagePath(locale)},{label:t("galleries")}]}/><header className="page-heading"><p className="eyebrow">{t("portfolio")}</p><h1>{t("galleries")}</h1><p>{t("discover")}</p></header>{items.length===0?<p className="empty-note">{t("emptyGalleries")}</p>:<GalleryIndex galleries={items} artworks={artworks} locale={locale} labels={{itemsPerPage:t("itemsPerPage"),previous:t("previousPage"),next:t("nextPage"),page:t("galleryPage"),showing:t("showingGalleries")}} />}</div>;}
 const entries=getPublicJournal(journalEntries,locale);
 const selectedCategory=journalCategories.includes(rawCategory as JournalCategory)?rawCategory as JournalCategory:undefined;
 const visibleEntries=getJournalEntriesForCategory(entries,selectedCategory);
 const pagination=resolveGalleryPagination(visibleEntries.length,rawPage,rawPageSize);
 const pageEntries=paginateItems(visibleEntries,pagination);
 const filters:[string,string,JournalCategory|undefined][]=[
  ["all",t("journalAll"),undefined],["exhibition",t("journalExhibitions"),"exhibition"],["event",t("journalEvents"),"event"],["studio-update",t("journalStudio"),"studio-update"],["story",t("journalStories"),"story"]
 ];
 const dateLabel=(value:string,timeZone="UTC",includeTime=false)=>new Intl.DateTimeFormat(locale,{dateStyle:"long",...(includeTime?{timeStyle:"short" as const}:{}),timeZone}).format(new Date(value));
 return <div className="page-content"><SiteBreadcrumbs locale={locale} items={[{label:t("home"),href:pagePath(locale)},{label:t("journal")}]}/><header className="page-heading"><p className="eyebrow">{t("portfolio")}</p><h1>{t("journal")}</h1></header>
  {entries.length>0&&<nav className="journal-filters" aria-label={t("journalCategories")}>{filters.map(([key,label,value])=><Link key={key} className="journal-filter" href={value?pagePath(locale,"journal")+ "?category="+value:pagePath(locale,"journal")} aria-current={(selectedCategory??"all")===key?"page":undefined}>{label}</Link>)}</nav>}
  {entries.length===0?<p className="empty-note">{t("emptyJournal")}</p>:visibleEntries.length===0?<p className="empty-note" role="status">{t("journalNoMatches")}</p>:<div className="journal-cards">{pageEntries.map(entry=>{
   const cover=journalCoverImageFor(entry,locale);
   return <article className={`journal-card${cover?" has-cover":""}`} key={entry.id}>
    {cover&&<Image className="journal-cover-image" src={cover.src} alt={cover.alt[locale] ?? entry.title[locale] ?? entry.slug} width={cover.width} height={cover.height} sizes="(max-width: 700px) 100vw, (max-width: 1100px) 40vw, 24rem" />}
    <div className="journal-card-copy">
     <div className="journal-card-meta"><span>{filters.find(([, ,value])=>value===(entry.type))?.[1]}</span>{entry.publishedAt&&Number.isFinite(Date.parse(entry.publishedAt))&&<time dateTime={entry.publishedAt}>{t("published")}: {dateLabel(entry.publishedAt)}</time>}</div>
     <h2><Link href={pagePath(locale,`journal/${getLocalizedSlug(entry,locale)}`)}>{entry.title[locale]}</Link></h2><p>{entry.summary[locale]}</p>
     {entry.type==="event"&&entry.event&&<><p className="journal-event-date"><time dateTime={entry.event.startsAt}>{dateLabel(entry.event.startsAt,entry.event.timeZone,true)}</time> <span dir="ltr">{entry.event.timeZone}</span></p>{entry.event.venue?.[locale]&&<p className="journal-event-date">{entry.event.venue[locale]}</p>}</>}
     <Link className="text-link" href={pagePath(locale,`journal/${getLocalizedSlug(entry,locale)}`)}>{t("readMore")} ↗</Link>
    </div>
   </article>;
  })}</div>}{visibleEntries.length>0&&<JournalPagination totalItems={visibleEntries.length} locale={locale} labels={{itemsPerPage:t("itemsPerPage"),previous:t("previousPage"),next:t("nextPage"),page:t("journalPage"),showing:t("showingJournal")}} />}</div>;
}
