import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { GalleryIndex } from "@/components/gallery-index";
import { ContactExperience } from "@/components/contact-experience";
import { aboutPreviewFixture } from "@/lib/about-preview-fixtures";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { artworks,galleries,journalEntries,cvEntries,artistProfile,contactDetails,getPublicArtistProfile,getPublicContactDetails,getPublicArtworks,getPublicGalleries,getPublicJournal,getPublicCvEntries,getJournalEntriesForCategory,journalCategories,journalCoverImageFor,primaryImageFor,type JournalCategory } from "@/lib/site";
import { paginateItems, resolveGalleryPagination } from "@/lib/gallery-pagination";
import { JournalPagination } from "@/components/journal-pagination";
import { SiteBreadcrumbs } from "@/components/site-breadcrumbs";
import { isLocale,pagePath,otherLocale,getLocalizedSlug,hasSharedContentIdentity } from "@/lib/site";
type Props={params:Promise<{locale:string;section:string}>;searchParams:Promise<{category?:string;page?:string;pageSize?:string}>};
const names=["works","galleries","journal","about","contact","cv"] as const;
type Section=typeof names[number];
const valid=(s:string):s is Section=>names.includes(s as Section);
export async function generateMetadata({params}:Props):Promise<Metadata>{const {locale,section}=await params;if(!isLocale(locale)||!valid(section))return {};const t=await getTranslations();
 const indexable = section==="works" ? getPublicArtworks(artworks,locale).length>0 :
  section==="galleries" ? getPublicGalleries(galleries,artworks,locale).length>0 :
  section==="journal" ? getPublicJournal(journalEntries,locale).length>0 :
  section==="cv" ? getPublicCvEntries(cvEntries,locale).length>0 :
  section==="about" ? Boolean(getPublicArtistProfile(artistProfile,locale)) : false;
 const other=otherLocale(locale);
 const translated = section==="works" ? hasSharedContentIdentity(getPublicArtworks(artworks,locale),getPublicArtworks(artworks,other)) :
  section==="galleries" ? hasSharedContentIdentity(getPublicGalleries(galleries,artworks,locale),getPublicGalleries(galleries,artworks,other)) :
  section==="journal" ? hasSharedContentIdentity(getPublicJournal(journalEntries,locale),getPublicJournal(journalEntries,other)) :
  section==="cv" ? hasSharedContentIdentity(getPublicCvEntries(cvEntries,locale),getPublicCvEntries(cvEntries,other)) :
  section==="about" ? Boolean(getPublicArtistProfile(artistProfile,other)) : false;
 const profile=section==="about"?getPublicArtistProfile(artistProfile,locale):undefined;
 return {title:t(section),...(profile?{description:profile.statement[locale]}:{}),alternates:{canonical:pagePath(locale,section),...(indexable&&translated?{languages:{[locale]:pagePath(locale,section),[other]:pagePath(other,section)}}:{})},robots:{index:section==="about"||section==="contact"?false:indexable,follow:true}};}
export default async function SectionPage({params,searchParams}:Props){const [{locale,section},{category:rawCategory,page:rawPage,pageSize:rawPageSize}]=await Promise.all([params,searchParams]);if(!isLocale(locale)||!valid(section))notFound();const t=await getTranslations();
 if(section==="about"){
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
