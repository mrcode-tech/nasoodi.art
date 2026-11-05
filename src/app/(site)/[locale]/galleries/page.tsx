import { GalleryIndex } from "@/components/gallery-index";
import { SiteBreadcrumbs } from "@/components/site-breadcrumbs";
import { artworks } from "@/content/artworks";
import { galleries } from "@/content/galleries";
import { getPublicArtworks,getPublicGalleries } from "@/lib/content/publication";
import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { isLocale,pagePath } from "@/types/locale";
import { getSectionMetadata } from "@/lib/seo/section-metadata";
type Props={params:Promise<{locale:string}>};
export async function generateMetadata({params}:Props):Promise<Metadata>{
 const {locale}=await params;
 return isLocale(locale)?getSectionMetadata("galleries",locale):{};
}

export default async function GalleriesPage({params}:Props){
 const {locale}=await params;
 if(!isLocale(locale))notFound();
 setRequestLocale(locale);
 const t=await getTranslations({locale});
 const items=getPublicGalleries(galleries,artworks,locale);return <div className="page-content"><SiteBreadcrumbs locale={locale} items={[{label:t("home"),href:pagePath(locale)},{label:t("galleries")}]}/><header className="page-heading"><p className="eyebrow">{t("portfolio")}</p><h1>{t("galleries")}</h1><p>{t("discover")}</p></header>{items.length===0?<p className="empty-note">{t("emptyGalleries")}</p>:<GalleryIndex galleries={items} artworks={artworks} locale={locale} labels={{itemsPerPage:t("itemsPerPage"),previous:t("previousPage"),next:t("nextPage"),page:t("galleryPage"),showing:t("showingGalleries")}} />}</div>;
}
