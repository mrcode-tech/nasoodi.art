import Image from "next/image";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { artworks,galleries,journalEntries,cvEntries,artistProfile,contactDetails,getPublicArtistProfile,getPublicContactDetails,getPublicArtworks,getPublicGalleries,getPublicJournal,getPublicCvEntries,getJournalEntriesForCategory,journalCategories,getGalleryCoverArtwork,type JournalCategory } from "@/lib/site";
import { copyFor,isLocale,pagePath,otherLocale } from "@/lib/site";
type Props={params:Promise<{locale:string;section:string}>;searchParams:Promise<{category?:string}>};
const names=["works","galleries","journal","about","contact","cv"] as const;
type Section=typeof names[number];
const valid=(s:string):s is Section=>names.includes(s as Section);
export async function generateMetadata({params}:Props):Promise<Metadata>{const {locale,section}=await params;if(!isLocale(locale)||!valid(section))return {};
 const indexable = section==="works" ? getPublicArtworks(artworks,locale).length>0 :
  section==="galleries" ? getPublicGalleries(galleries,artworks,locale).length>0 :
  section==="journal" ? getPublicJournal(journalEntries,locale).length>0 :
  section==="cv" ? getPublicCvEntries(cvEntries,locale).length>0 :
  section==="about" ? Boolean(getPublicArtistProfile(artistProfile,locale)) :
  section==="contact" ? Boolean(getPublicContactDetails(contactDetails,locale)) : false;
 const other=otherLocale(locale);
 const translated = section==="works" ? getPublicArtworks(artworks,other).length>0 :
  section==="galleries" ? getPublicGalleries(galleries,artworks,other).length>0 :
  section==="journal" ? getPublicJournal(journalEntries,other).length>0 :
  section==="cv" ? getPublicCvEntries(cvEntries,other).length>0 :
  section==="about" ? Boolean(getPublicArtistProfile(artistProfile,other)) :
  section==="contact" ? Boolean(getPublicContactDetails(contactDetails,other)) : false;
 const profile=section==="about"?getPublicArtistProfile(artistProfile,locale):undefined;
 return {title:copyFor(locale)[section],...(profile?{description:profile.statement[locale]}:{}),alternates:{canonical:pagePath(locale,section),...(translated?{languages:{[locale]:pagePath(locale,section),[other]:pagePath(other,section)}}:{})},robots:{index:indexable,follow:true}};}
export default async function SectionPage({params,searchParams}:Props){const [{locale,section},{category:rawCategory}]=await Promise.all([params,searchParams]);if(!isLocale(locale)||!valid(section))notFound();const t=copyFor(locale);
 if(section==="about"){const profile=getPublicArtistProfile(artistProfile,locale);return <div className="page-content"><header className="page-heading"><p className="eyebrow">{t.about}</p><h1>{locale==="fa"?"غزاله عبداله زاده نسودی":"Ghazaleh Abdolahzade Nasoodi"}</h1><p className="artist-discipline">{t.discipline}</p></header>{profile?<div className="profile-content">{profile.portrait&&<Image className="artist-portrait" src={profile.portrait.src} alt={profile.portrait.alt[locale]??""} width={profile.portrait.width} height={profile.portrait.height} sizes="(max-width: 700px) 100vw, 34rem"/>}<section><h2>{t.statement}</h2><p>{profile.statement[locale]}</p></section><section><h2>{t.biography}</h2><p>{profile.biography[locale]}</p></section></div>:<p className="empty-note">{t.profilePending}</p>}</div>;}
 if(section==="contact"){const details=getPublicContactDetails(contactDetails,locale);return <div className="page-content"><header className="page-heading"><p className="eyebrow">{t.contact}</p><h1>{t.contact}</h1></header>{details?<div className="contact-links">{details.email&&<p><span>{t.email}</span> <a href={`mailto:${details.email}`} dir="ltr">{details.email}</a></p>}{details.instagramUrl&&<p><span>{t.instagram}</span> <a href={details.instagramUrl} target="_blank" rel="noopener noreferrer" dir="ltr">{t.instagram} ↗</a></p>}</div>:<p className="empty-note">{t.contactPending}</p>}</div>;}
 if(section==="cv"){const entries=getPublicCvEntries(cvEntries,locale);if(entries.length===0)notFound();return <div className="page-content"><header className="page-heading"><p className="eyebrow">{t.about}</p><h1>{t.cv}</h1></header><ol className="cv-list">{entries.map(entry=><li key={entry.id}><time>{entry.year}</time><div><strong>{entry.title[locale]}</strong>{entry.organization?.[locale]&&<span>{entry.organization[locale]}</span>}{entry.location?.[locale]&&<span>{entry.location[locale]}</span>}</div></li>)}</ol></div>;}
 if(section==="works"){const items=getPublicArtworks(artworks,locale);return <div className="page-content"><header className="page-heading"><p className="eyebrow">{t.portfolio}</p><h1>{t.works}</h1><p>{t.selectedIntro}</p></header>{items.length===0?<p className="empty-note">{t.emptyWorks}</p>:<div className="artwork-grid">{items.map(w=>{const img=w.images.find(x=>x.role==="primary");return img?<Link className="artwork-item" key={w.id} href={pagePath(locale,`works/${w.slug}`)}><Image sizes="(max-width: 600px) 100vw, (max-width: 900px) 90vw, 50vw" src={img.src} alt={img.alt[locale]??""} width={img.width} height={img.height}/><span>{w.title[locale]}</span></Link>:null;})}</div>}</div>;}
 if(section==="galleries"){const items=getPublicGalleries(galleries,artworks,locale);return <div className="page-content"><header className="page-heading"><p className="eyebrow">{t.portfolio}</p><h1>{t.galleries}</h1><p>{t.discover}</p></header>{items.length===0?<p className="empty-note">{t.emptyGalleries}</p>:<div className="gallery-cards">{items.map(g=>{const cover=getGalleryCoverArtwork(g,artworks,locale);return <Link className="gallery-card" key={g.id} href={pagePath(locale,`galleries/${g.slug}`)}>{cover&&<Image sizes="(max-width: 700px) 100vw, 42vw" src={cover.image.src} alt={cover.image.alt[locale]??""} width={cover.image.width} height={cover.image.height}/>}<span className="gallery-card-copy"><strong>{g.title[locale]}</strong><span>{g.description[locale]}</span></span></Link>;})}</div>}</div>;}
 const entries=getPublicJournal(journalEntries,locale);
 const selectedCategory=journalCategories.includes(rawCategory as JournalCategory)?rawCategory as JournalCategory:undefined;
 const visibleEntries=getJournalEntriesForCategory(entries,selectedCategory);
 const filters:[string,string,JournalCategory|undefined][]=[
  ["all",t.journalAll,undefined],["exhibition",t.journalExhibitions,"exhibition"],["event",t.journalEvents,"event"],["studio-update",t.journalStudio,"studio-update"],["story",t.journalStories,"story"]
 ];
 const dateLabel=(value:string,timeZone="UTC",includeTime=false)=>new Intl.DateTimeFormat(locale,{dateStyle:"long",...(includeTime?{timeStyle:"short" as const}:{}),timeZone}).format(new Date(value));
 return <div className="page-content"><header className="page-heading"><p className="eyebrow">{t.portfolio}</p><h1>{t.journal}</h1></header>
  {entries.length>0&&<nav className="journal-filters" aria-label={locale==="fa"?"دسته‌بندی یادداشت‌ها":"Journal categories"}>{filters.map(([key,label,value])=><Link key={key} className="journal-filter" href={value?pagePath(locale,"journal")+ "?category="+value:pagePath(locale,"journal")} aria-current={(selectedCategory??"all")===key?"page":undefined}>{label}</Link>)}</nav>}
  {entries.length===0?<p className="empty-note">{t.emptyJournal}</p>:visibleEntries.length===0?<p className="empty-note" role="status">{t.journalNoMatches}</p>:<div className="journal-cards">{visibleEntries.map(entry=><article className="journal-card" key={entry.id}>
   <div className="journal-card-meta"><span>{filters.find(([, ,value])=>value===(entry.type))?.[1]}</span>{entry.publishedAt&&Number.isFinite(Date.parse(entry.publishedAt))&&<time dateTime={entry.publishedAt}>{t.published}: {dateLabel(entry.publishedAt)}</time>}</div>
   <h2><Link href={pagePath(locale,`journal/${entry.slug}`)}>{entry.title[locale]}</Link></h2><p>{entry.summary[locale]}</p>
   {entry.type==="event"&&entry.event&&<><p className="journal-event-date"><time dateTime={entry.event.startsAt}>{dateLabel(entry.event.startsAt,entry.event.timeZone,true)}</time> <span dir="ltr">{entry.event.timeZone}</span></p>{entry.event.venue?.[locale]&&<p className="journal-event-date">{entry.event.venue[locale]}</p>}</>}
   <Link className="text-link" href={pagePath(locale,`journal/${entry.slug}`)}>{t.readMore} ↗</Link>
  </article>)}</div>}</div>;
}
