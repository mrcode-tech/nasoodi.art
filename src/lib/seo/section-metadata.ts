import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { createLocalizedMetadata } from "@/lib/seo/metadata";
import { getArtist } from "@/content/repositories/artist.repository";
import { getCv } from "@/content/repositories/cv.repository";
import { getCvSeoDescription } from "@/content/repositories/cv-seo-metadata.repository";
import { getContact } from "@/content/repositories/contact.repository";
import { getArtworks } from "@/content/repositories/artwork.repository";
import { getGalleries } from "@/content/repositories/gallery.repository";
import { getJournalEntries } from "@/content/repositories/journal.repository";
import { getSitePageMetadata } from "@/content/repositories/site.repository";
import { getGalleryCoverArtwork,primaryImageFor } from "@/lib/content/publication";
import { journalCoverImageFor } from "@/lib/content/journal";
import { hasEquivalentContentSet } from "@/lib/content/identity";
import { pagePath,locales,type Locale } from "@/types/locale";

export type Section = "works" | "galleries" | "journal" | "about" | "contact" | "cv";

export async function getSectionMetadata(section: Section, locale: Locale): Promise<Metadata> {
 setRequestLocale(locale);
 const t=await getTranslations({ locale });
 const works=getArtworks(locale);
 const sets=getGalleries(locale);
 const journal=getJournalEntries(locale);
 const cv=getCv(locale).entries;
 const profile=getArtist(locale);
 const contact=getContact(locale);

 const indexable=section==="works"?works.length>0:
  section==="galleries"?sets.length>0:
  section==="journal"?journal.length>0:
  section==="cv"?cv.length>0:
  section==="about"?Boolean(profile):
  section==="contact"?Boolean(contact):false;
 const equivalentFor=(target:Locale)=>{
  if(section==="works")return hasEquivalentContentSet(works,getArtworks(target));
  if(section==="galleries")return hasEquivalentContentSet(sets,getGalleries(target));
  if(section==="journal")return hasEquivalentContentSet(journal,getJournalEntries(target));
  if(section==="cv")return hasEquivalentContentSet(cv,getCv(target).entries);
  if(section==="about")return Boolean(profile&&getArtist(target));
  if(section==="contact")return Boolean(getContact(target));
  return false;
 };
 const alternatePaths=Object.fromEntries(locales.filter(target=>target!==locale&&equivalentFor(target)).map(target=>[target,pagePath(target,section)])) as Partial<Record<Locale,string>>;
 const description=section==="works"?getSitePageMetadata("works",locale).description:
  section==="galleries"?getSitePageMetadata("galleries",locale).description:
  section==="journal"?getSitePageMetadata("journal",locale).description:
  section==="cv"?getCvSeoDescription(locale,getSitePageMetadata("cv",locale).description):
  section==="about"?profile?.shortIntroduction?.[locale]??profile?.statement[locale]:
  section==="contact"?contact?.description:undefined;
 const firstWork=works[0];
 const firstGallery=sets[0];
 const firstJournal=journal[0];
 const socialImage=section==="about"&&profile?profile.portrait?.src:
  section==="works"&&firstWork?primaryImageFor(firstWork)?.src:
  section==="galleries"&&firstGallery?getGalleryCoverArtwork(firstGallery,works,locale)?.image.src:
  section==="journal"&&firstJournal?journalCoverImageFor(firstJournal,locale)?.src:undefined;
 const indexablePage=indexable;

 return createLocalizedMetadata({
  locale,
  path:section,
  title:section==="about"&&profile?.name?.[locale]?profile.name[locale]+" — "+t("about"):
   section==="cv"?getSitePageMetadata("cv",locale).title:
   section==="contact"?contact?.title??t("contact"):
   section==="works"?getSitePageMetadata("works",locale).title:
   section==="galleries"?getSitePageMetadata("galleries",locale).title:
   section==="journal"?getSitePageMetadata("journal",locale).title:t(section),
  description,
  alternatePaths:indexablePage?alternatePaths:undefined,
  indexable:indexablePage,
  images:socialImage?[socialImage]:undefined,
 });
}
