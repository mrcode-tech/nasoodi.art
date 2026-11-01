"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import type { Locale } from "@/lib/site";
import styles from "./journal-announcement.module.css";
type AnnouncementEvent = { id: string; title: string; startsAt: string; timeZone: string };
export function JournalAnnouncement({ locale, event, eyebrow, dismissLabel, href }: { locale: Locale; event: AnnouncementEvent; eyebrow: string; dismissLabel: string; href: string }) {
 const [visibility,setVisibility]=useState<"pending"|"visible"|"dismissed">("pending");
 const storageKey=`nasoodi:journal-announcement:dismissed:${event.id}`;
 useEffect(()=>{
  const frame=window.requestAnimationFrame(()=>{
   try { setVisibility(window.sessionStorage.getItem(storageKey)==="1"?"dismissed":"visible"); }
   catch { setVisibility("visible"); }
  });
  return ()=>window.cancelAnimationFrame(frame);
 },[storageKey]);
 const dismiss=()=>{
  try { window.sessionStorage.setItem(storageKey,"1"); } catch { /* Storage may be disabled. */ }
  setVisibility("dismissed");
 };
 if(visibility!=="visible")return null;
 const date=new Intl.DateTimeFormat(locale,{dateStyle:"medium",timeZone:event.timeZone}).format(new Date(event.startsAt));
 return <aside className={`${styles.container} ${locale==="fa"?styles.rtl:""}`} aria-label={eyebrow} dir={locale==="fa"?"rtl":"ltr"}>
  <span className={`${styles.paper} ${locale==="fa"?styles.paperRtl:""}`} aria-hidden="true"/>
  <Link className={`${styles.link} ${locale==="fa"?styles.linkRtl:""}`} href={href}>
   <span className={styles.eyebrow}>{eyebrow}</span>
   <span className={`${styles.title} ${locale==="fa"?styles.persianTitle:""}`}>{event.title}</span>
   <time className={styles.date} dateTime={event.startsAt}>{date}</time>
  </Link>
  <Button className={`${styles.dismiss} ${locale==="fa"?styles.dismissRtl:""}`} variant="ghost" size="sm" onClick={dismiss} aria-label={dismissLabel}>×</Button>
 </aside>;
}
