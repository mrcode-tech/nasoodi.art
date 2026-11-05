import { SiteBreadcrumbs } from "@/components/site-breadcrumbs";
import { cvEntries } from "@/content/cv";
import { getPublicCvEntries } from "@/lib/content/publication";
import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { isLocale,pagePath } from "@/types/locale";
import { getSectionMetadata } from "@/lib/seo/section-metadata";
type Props={params:Promise<{locale:string}>};
export async function generateMetadata({params}:Props):Promise<Metadata>{
 const {locale}=await params;
 return isLocale(locale)?getSectionMetadata("cv",locale):{};
}

export default async function CvPage({params}:Props){
 const {locale}=await params;
 if(!isLocale(locale))notFound();
 setRequestLocale(locale);
 const t=await getTranslations({locale});
 const entries=getPublicCvEntries(cvEntries,locale);if(entries.length===0)notFound();return <div className="page-content"><SiteBreadcrumbs locale={locale} items={[{label:t("home"),href:pagePath(locale)},{label:t("about"),href:pagePath(locale,"about")},{label:t("cv")}]}/><header className="page-heading"><p className="eyebrow">{t("about")}</p><h1>{t("cv")}</h1></header><ol className="cv-list">{entries.map(entry=><li key={entry.id}><time>{entry.year??entry.period?.[locale]}</time><div><strong>{entry.title[locale]}</strong>{entry.organization?.[locale]&&<span>{entry.organization[locale]}</span>}{"location" in entry && entry.location?.[locale]&&<span>{entry.location[locale]}</span>}</div></li>)}</ol></div>;
}
