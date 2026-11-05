import Image from "next/image";
import Link from "next/link";
import { SiteBreadcrumbs } from "@/components/site-breadcrumbs";
import { JournalPagination } from "@/components/journal-pagination";
import { getJournalEntries } from "@/content/repositories/journal.repository";
import { getJournalEntriesForCategory,journalCategories,journalCoverImageFor } from "@/lib/content/journal";
import type { JournalCategory } from "@/types/content";
import { paginateItems,resolveGalleryPagination } from "@/lib/gallery-pagination";
import { getLocalizedSlug } from "@/lib/content/paths";
import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { isLocale,pagePath } from "@/types/locale";
import { getSectionMetadata } from "@/lib/seo/section-metadata";
type Props={params:Promise<{locale:string}>};
type SearchParams={category?:string;page?:string;pageSize?:string};
type PropsWithSearch=Props & {searchParams:Promise<SearchParams>};
export async function generateMetadata({params}:Props):Promise<Metadata>{
 const {locale}=await params;
 return isLocale(locale)?getSectionMetadata("journal",locale):{};
}

export default async function JournalPage({params,searchParams}:PropsWithSearch){
 const [{locale},{category:rawCategory,page:rawPage,pageSize:rawPageSize}]=await Promise.all([params,searchParams]);
 if(!isLocale(locale))notFound();
 setRequestLocale(locale);
 const t=await getTranslations({locale});
 const entries=getJournalEntries(locale);
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
