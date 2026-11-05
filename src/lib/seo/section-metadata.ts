import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { createLocalizedMetadata } from "@/lib/seo/metadata";
import { artworks } from "@/content/artworks";
import { galleries } from "@/content/galleries";
import { journalEntries } from "@/content/journal";
import { cvEntries } from "@/content/cv";
import { artistProfile } from "@/content/artist";
import { contactDetails } from "@/content/contact";
import { siteContent } from "@/content/site";
import { getPublicArtistProfile,getPublicContactDetails,getPublicArtworks,getPublicGalleries,getPublicCvEntries,getGalleryCoverArtwork,primaryImageFor } from "@/lib/content/publication";
import { getPublicJournal,journalCoverImageFor } from "@/lib/content/journal";
import { hasEquivalentContentSet } from "@/lib/content/identity";
import { isLocale,pagePath,locales,type Locale } from "@/types/locale";

export type Section = "works" | "galleries" | "journal" | "about" | "contact" | "cv";

export async function getSectionMetadata(section: Section, locale: Locale): Promise<Metadata> {
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
  section==="about"?Boolean(profile):
  section==="contact"?Boolean(getPublicContactDetails(contactDetails)&&contactDetails.title?.[locale]&&contactDetails.description?.[locale]):false;
 const equivalentFor=(target:Locale)=>{
  if(section==="works")return hasEquivalentContentSet(works,getPublicArtworks(artworks,target));
  if(section==="galleries")return hasEquivalentContentSet(sets,getPublicGalleries(galleries,artworks,target));
  if(section==="journal")return hasEquivalentContentSet(journal,getPublicJournal(journalEntries,target));
  if(section==="cv")return hasEquivalentContentSet(cv,getPublicCvEntries(cvEntries,target));
  if(section==="about")return Boolean(profile&&getPublicArtistProfile(artistProfile,target));
  if(section==="contact")return Boolean(getPublicContactDetails(contactDetails)&&contactDetails.title?.[target]&&contactDetails.description?.[target]);
  return false;
 };
 const alternatePaths=Object.fromEntries(locales.filter(target=>target!==locale&&equivalentFor(target)).map(target=>[target,pagePath(target,section)])) as Partial<Record<Locale,string>>;
 const description=section==="works"?siteContent.pages.works.description[locale]:
  section==="galleries"?siteContent.pages.galleries.description[locale]:
  section==="journal"?siteContent.pages.journal.description[locale]:
  section==="cv"?siteContent.pages.cv.description[locale]:
  section==="about"?profile?.shortIntroduction?.[locale]??profile?.statement[locale]:
  section==="contact"?contactDetails.description?.[locale]:undefined;
 const firstWork=works[0];
 const firstGallery=sets[0];
 const firstJournal=journal[0];
 const socialImage=section==="about"&&profile?profile.portrait?.src:
  section==="works"&&firstWork?primaryImageFor(firstWork)?.src:
  section==="galleries"&&firstGallery?getGalleryCoverArtwork(firstGallery,artworks,locale)?.image.src:
  section==="journal"&&firstJournal?journalCoverImageFor(firstJournal,locale)?.src:undefined;
 const indexablePage=indexable;

 return createLocalizedMetadata({
  locale,
  path:section,
  title:section==="about"&&profile?.name?.[locale]?profile.name[locale]+" — "+t("about"):
   section==="cv"?siteContent.pages.cv.title[locale]:
   section==="contact"?contactDetails.title?.[locale]??t("contact"):
   section==="works"?siteContent.pages.works.title[locale]:
   section==="galleries"?siteContent.pages.galleries.title[locale]:
   section==="journal"?siteContent.pages.journal.title[locale]:t(section),
  description,
  alternatePaths:indexablePage?alternatePaths:undefined,
  indexable:indexablePage,
  images:socialImage?[socialImage]:undefined,
 });
}
