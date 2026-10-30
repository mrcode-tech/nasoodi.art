"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { alternatePathFor, copyFor, cvEntries, getPublicCvEntries, pagePath, type Locale } from "@/lib/site";
import { Button } from "@/components/ui/button";
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";
import { Sheet, SheetClose, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

function LanguageSelector({ locale, alternate, pathname, label, onNavigate }: { locale: Locale; alternate: string; pathname: string; label: string; onNavigate?: () => void }) {
  const englishHref = locale === "en" ? pathname : alternate;
  const persianHref = locale === "fa" ? pathname : alternate;
  return <DropdownMenu>
    <DropdownMenuTrigger asChild><Button variant="ghost" size="sm" aria-label={label}><span>{locale === "fa" ? "فارسی" : "English"}</span><span className="language-chevron" aria-hidden="true">⌄</span></Button></DropdownMenuTrigger>
    <DropdownMenuContent align={locale === "fa" ? "start" : "end"} dir={locale === "fa" ? "rtl" : "ltr"} aria-label={label}>
      <DropdownMenuItem asChild><Link href={englishHref} hrefLang="en" lang="en" aria-current={locale === "en" ? "page" : undefined} onClick={onNavigate}>English{locale === "en" ? " · Current" : ""}</Link></DropdownMenuItem>
      <DropdownMenuItem asChild><Link href={persianHref} hrefLang="fa" lang="fa" aria-current={locale === "fa" ? "page" : undefined} onClick={onNavigate}>فارسی{locale === "fa" ? " · جاری" : ""}</Link></DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>;
}

export function SiteShell({ locale, children }: { locale: Locale; children: React.ReactNode }) {
  const labels = copyFor(locale);
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  useEffect(() => {
    const desktopQuery = window.matchMedia("(min-width: 901px)");
    const closeMobileNavigation = (event: MediaQueryListEvent) => {
      if (event.matches) setMobileOpen(false);
    };
    if (desktopQuery.matches) setMobileOpen(false);
    desktopQuery.addEventListener("change", closeMobileNavigation);
    return () => desktopQuery.removeEventListener("change", closeMobileNavigation);
  }, []);
  const drawerHomeRef = useRef<HTMLAnchorElement>(null);
  const alternate = alternatePathFor(pathname, locale);
  const links: [string, string, string][] = [
    ["home", labels.home, pagePath(locale)],
    ["works", labels.works, pagePath(locale, "works")],
    ["galleries", labels.galleries, pagePath(locale, "galleries")],
    ["journal", labels.journal, pagePath(locale, "journal")],
    ["about", labels.about, pagePath(locale, "about")],
    ["contact", labels.contact, pagePath(locale, "contact")],
  ];
  if (getPublicCvEntries(cvEntries, locale).length > 0) links.splice(5, 0, ["cv", labels.cv, pagePath(locale, "cv")]);

  const navigation = (insideSheet = false) => <nav dir={locale === "fa" ? "rtl" : "ltr"} aria-label={locale === "fa" ? "راهبری اصلی" : "Primary navigation"}>
    <SidebarMenu className="nav-list">
      {links.map(([key, label, href]) => {
        const active = key === "home" ? pathname === href : pathname === href || pathname.startsWith(href + "/");
        return <SidebarMenuItem key={key}><SidebarMenuButton><Link className="nav-link" dir={locale === "fa" ? "rtl" : "ltr"} href={href} aria-current={active ? "page" : undefined} onClick={() => insideSheet && setMobileOpen(false)}>{label}</Link></SidebarMenuButton></SidebarMenuItem>;
      })}
    </SidebarMenu>
  </nav>;

  return <>
    <a className="skip-link" href="#main-content">{labels.skip}</a>
    <Sidebar className="desktop-sidebar" dir={locale === "fa" ? "rtl" : "ltr"} aria-label="Nasoodi.art">
      <SidebarHeader><Link className="artist-wordmark" href={pagePath(locale)} aria-label="Ghazaleh Abdolahzade Nasoodi — Home">
        <span className="wordmark-name" dir="ltr">Ghazaleh</span><span className="wordmark-surname" dir="ltr">Abdolahzade Nasoodi</span><span className="wordmark-role" dir="auto">{labels.discipline}</span>
      </Link></SidebarHeader>
      <SidebarContent>{navigation()}</SidebarContent>
      <SidebarFooter className="sidebar-bottom"><span>nasoodi.art</span><span>© {new Date().getFullYear()}</span></SidebarFooter>
    </Sidebar>

    <header className={`mobile-header mobile-header-${locale}`} data-locale={locale}>
      <Link className="mobile-wordmark" dir="ltr" href={pagePath(locale)}>Nasoodi<span>.</span></Link>
      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetTrigger asChild><Button className="menu-trigger" variant="ghost" size="sm" aria-label={labels.menu} aria-controls="mobile-navigation" aria-expanded={mobileOpen}><span className="menu-trigger-lines" aria-hidden="true"><span/><span/></span></Button></SheetTrigger>
        <SheetContent id="mobile-navigation" side={locale === "fa" ? "right" : "left"} className="mobile-drawer" dir={locale === "fa" ? "rtl" : "ltr"} aria-describedby={undefined} onOpenAutoFocus={(event) => { event.preventDefault(); drawerHomeRef.current?.focus(); }}>
          <SheetTitle className="sr-only">{labels.menu}</SheetTitle>
          <div className="drawer-heading"><Link ref={drawerHomeRef} className="mobile-wordmark" dir="ltr" href={pagePath(locale)}>Nasoodi<span>.</span></Link><SheetClose asChild><Button className="drawer-close" variant="ghost" size="sm" aria-label={labels.close}>×</Button></SheetClose></div>
          {navigation(true)}
          <div className="drawer-settings" dir={locale === "fa" ? "rtl" : "ltr"}><span>{labels.language}</span><LanguageSelector locale={locale} alternate={alternate} pathname={pathname} label={labels.language} onNavigate={() => setMobileOpen(false)}/></div>
          <div className="drawer-copyright" dir="ltr"><span>nasoodi.art</span><span>© {new Date().getFullYear()}</span></div>
        </SheetContent>
      </Sheet>
    </header>

    <div className="desktop-utility" dir={locale === "fa" ? "rtl" : "ltr"}><span className="language-label">{labels.language}</span><LanguageSelector locale={locale} alternate={alternate} pathname={pathname} label={labels.language}/></div>
    <div className="site-main"><main id="main-content">{children}</main></div>
  </>;
}
