import Image from "next/image";
import Link from "next/link";
import { SiteBreadcrumbs } from "@/components/site-breadcrumbs";
import { getArtworks } from "@/content/repositories/artwork.repository";
import { primaryImageFor } from "@/lib/content/publication";
import { getLocalizedSlug } from "@/lib/content/paths";
import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { isLocale,pagePath } from "@/types/locale";
import { getSectionMetadata } from "@/lib/seo/section-metadata";
type Props={params:Promise<{locale:string}>};
export async function generateMetadata({params}:Props):Promise<Metadata>{
 const {locale}=await params;
 return isLocale(locale)?getSectionMetadata("works",locale):{};
}

export default async function WorksPage({params}:Props){
 const {locale}=await params;
 if(!isLocale(locale))notFound();
 setRequestLocale(locale);
 const t=await getTranslations({locale});
 const items=getArtworks(locale);return <div className="page-content"><SiteBreadcrumbs locale={locale} items={[{label:t("home"),href:pagePath(locale)},{label:t("selected")}]}/><header className="page-heading"><p className="eyebrow">{t("portfolio")}</p><h1>{t("works")}</h1><p>{t("selectedIntro")}</p></header>{items.length===0?<p className="empty-note">{t("emptyWorks")}</p>:<div className="artwork-grid">{items.map(w=>{const img=primaryImageFor(w);return img?<Link className="artwork-item" key={w.id} href={pagePath(locale,`works/${getLocalizedSlug(w,locale)}`)}><Image sizes="(max-width: 600px) 100vw, (max-width: 900px) 90vw, 50vw" src={img.src} alt={img.alt[locale]??""} width={img.width} height={img.height}/><span>{w.title[locale]}</span></Link>:null;})}</div>}</div>;
}
