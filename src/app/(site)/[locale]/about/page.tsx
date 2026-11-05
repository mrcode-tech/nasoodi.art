import Image from "next/image";
import { SiteBreadcrumbs } from "@/components/site-breadcrumbs";
import { getAbout } from "@/content/repositories/artist.repository";
import { getCv } from "@/content/repositories/cv.repository";
import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { isLocale,pagePath } from "@/types/locale";
import { getSectionMetadata } from "@/lib/seo/section-metadata";
type Props={params:Promise<{locale:string}>};
export async function generateMetadata({params}:Props):Promise<Metadata>{
 const {locale}=await params;
 return isLocale(locale)?getSectionMetadata("about",locale):{};
}

export default async function AboutPage({params}:Props){
 const {locale}=await params;
 if(!isLocale(locale))notFound();
 setRequestLocale(locale);
 const t=await getTranslations({locale});
 const profile=getPublicArtistProfile(artistProfile,locale);
  if(!profile)notFound();
  const statement=profile.statement[locale]!;
  const biography=profile.biography[locale]!;
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
   <header className="page-heading"><p className="eyebrow">{t("about")}</p><h1>{profile.name?.[locale]??t("artistName")}</h1><p className="artist-discipline">{profile.discipline?.[locale]??t("discipline")}</p>{profile.shortIntroduction?.[locale]&&<p>{profile.shortIntroduction[locale]}</p>}</header>
   <div className="profile-content">
    {portrait?<Image className="artist-portrait" src={portrait.src} alt={portrait.alt[locale]??""} width={portrait.width} height={portrait.height} sizes="(max-width: 700px) 100vw, 34rem"/>:<Image className="artist-portrait" src="/images/homepage-hero.jpg" alt={t("heroAlt")} width={4032} height={3024} sizes="(max-width: 700px) 100vw, 34rem"/>}
    <section className="about-statement"><h2>{t("statement")}</h2>{statement.split(/\n{2,}/).map((paragraph,index)=><p key={index}>{paragraph}</p>)}</section>
    <section className="about-biography"><h2>{t("biography")}</h2>{biography.split(/\n{2,}/).map((paragraph,index)=><p className="about-biography-copy" key={index}>{paragraph}</p>)}</section>
    {(entries.length>0||document)&&<section className="about-cv-section"><h2>{t("cv")}</h2>
     {groups.map(group=>{const rows=entries.filter(entry=>group.categories.includes(entry.category));return rows.length?<section className="cv-category" key={group.id}><h3>{group.label}</h3><ol className="cv-list">{rows.map(entry=><li key={entry.id}><time>{entry.year??entry.period?.[locale]}</time><div><strong>{entry.title[locale]}</strong>{entry.organization?.[locale]&&<span>{entry.organization[locale]}</span>}{entry.location?.[locale]&&<span>{entry.location[locale]}</span>}</div></li>)}</ol></section>:null;})}
     {document&&<p><a className="text-link" href={document.src} download={document.fileName}>{t("downloadCvPdf")}</a></p>}
    </section>}
   </div>
  </div>;
}
