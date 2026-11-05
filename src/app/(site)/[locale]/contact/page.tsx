import { ContactExperience } from "@/components/contact-experience";
import { SiteBreadcrumbs } from "@/components/site-breadcrumbs";
import { getContact } from "@/content/repositories/contact.repository";
import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { isLocale,pagePath } from "@/types/locale";
import { getSectionMetadata } from "@/lib/seo/section-metadata";
type Props={params:Promise<{locale:string}>};
export async function generateMetadata({params}:Props):Promise<Metadata>{
 const {locale}=await params;
 return isLocale(locale)?getSectionMetadata("contact",locale):{};
}

export default async function ContactPage({params}:Props){
 const {locale}=await params;
 if(!isLocale(locale))notFound();
 setRequestLocale(locale);
 const t=await getTranslations({locale});
 const details=getContact(locale)?.details;return <div className="page-content"><SiteBreadcrumbs locale={locale} items={[{label:t("home"),href:pagePath(locale)},{label:t("contact")}]}/><ContactExperience locale={locale} details={details} variant="page" /></div>;
}
