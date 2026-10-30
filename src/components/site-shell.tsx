"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { copyFor, otherLocale, pagePath, alternatePathFor, getPublicCvEntries, cvEntries, type Locale } from "@/lib/site";

export function SiteShell({ locale, children }: { locale: Locale; children: React.ReactNode }) {
 const labels=copyFor(locale), pathname=usePathname(), [open,setOpen]=useState(false);
 const drawer=useRef<HTMLElement>(null), trigger=useRef<HTMLButtonElement>(null), wasOpen=useRef(false);
 const alternate=alternatePathFor(pathname,locale);
 const links: [string,string,string][] = [["home",labels.home,pagePath(locale)],["works",labels.works,pagePath(locale,"works")],["galleries",labels.galleries,pagePath(locale,"galleries")],["journal",labels.journal,pagePath(locale,"journal")],["about",labels.about,pagePath(locale,"about")],["contact",labels.contact,pagePath(locale,"contact")]];
 if (getPublicCvEntries(cvEntries, locale).length > 0) links.splice(5, 0, ["cv", labels.cv, pagePath(locale,"cv")]);
 useEffect(()=>{
  if(!open){if(wasOpen.current){trigger.current?.focus();wasOpen.current=false;}return;}
  wasOpen.current=true;const old=document.body.style.overflow;document.body.style.overflow="hidden";
  drawer.current?.querySelector<HTMLElement>("a,button")?.focus();
  const key=(e:KeyboardEvent)=>{if(e.key==="Escape"){setOpen(false);return;}if(e.key!=="Tab"||!drawer.current)return;
   const all=Array.from(drawer.current.querySelectorAll<HTMLElement>('a[href],button:not([disabled])')).filter(x=>x.offsetParent!==null);
   if(!all.length)return;if(e.shiftKey&&document.activeElement===all[0]){e.preventDefault();all[all.length-1].focus();}
   else if(!e.shiftKey&&document.activeElement===all[all.length-1]){e.preventDefault();all[0].focus();}};
  document.addEventListener("keydown",key);return()=>{document.body.style.overflow=old;document.removeEventListener("keydown",key);};
 },[open]);
 const nav=(drawerNav=false)=><nav aria-label={locale==="fa"?"راهبری اصلی":"Primary navigation"}><ul className="nav-list">
  {links.map(([key,label,href])=>{const active=key==="home"?pathname===href:pathname===href||pathname.startsWith(href+"/");
   return <li key={key}><Link className="nav-link" dir="auto" href={href} aria-current={active?"page":undefined} onClick={()=>drawerNav&&setOpen(false)}>{label}</Link></li>;})}
 </ul></nav>;
 return <>
  <a className="skip-link" href="#main-content">{labels.skip}</a>
  <aside className="desktop-sidebar" aria-label="Nasoodi.art">
   <Link className="artist-wordmark" href={pagePath(locale)}><span className="wordmark-name" dir="ltr">Ghazaleh</span><span className="wordmark-surname" dir="ltr">Abdolahzade Nasoodi</span><span className="wordmark-role" dir="auto">{labels.discipline}</span></Link>
   {nav()}<div className="sidebar-bottom"><span>nasoodi.art</span><span>© {new Date().getFullYear()}</span></div>
  </aside>
  <header className="mobile-header"><Link className="mobile-wordmark" dir="ltr" href={pagePath(locale)}>Nasoodi<span>.</span></Link>
   <button ref={trigger} className="menu-trigger" type="button" aria-controls="mobile-navigation" aria-expanded={open} aria-label={open?labels.close:labels.menu} onClick={()=>setOpen(true)}><span/><span/></button>
  </header>
  <div className="desktop-utility"><span>{labels.language}</span><Link href={alternate} hrefLang={otherLocale(locale)}>{otherLocale(locale)==="fa"?"فارسی":"English"}</Link></div>
  {open&&<button className="menu-backdrop" type="button" aria-label={labels.close} onClick={()=>setOpen(false)}/>}
  <section ref={drawer} id="mobile-navigation" className="mobile-drawer" hidden={!open} role="dialog" aria-modal="true" aria-label={labels.menu}>
   <div className="drawer-heading"><Link className="mobile-wordmark" href={pagePath(locale)}>Nasoodi<span>.</span></Link>
    <button className="drawer-close" type="button" aria-label={labels.close} onClick={()=>setOpen(false)}>×</button></div>
   {nav(true)}<div className="drawer-settings"><span>{labels.language}</span><Link href={alternate} hrefLang={otherLocale(locale)}>{otherLocale(locale)==="fa"?"فارسی":"English"}</Link></div>
  </section>
  <div className="site-main"><main id="main-content">{children}</main><footer className="site-footer"><span>Ghazaleh Abdolahzade Nasoodi</span><span>© {new Date().getFullYear()} · {labels.rights}</span></footer></div>
 </>;
}
