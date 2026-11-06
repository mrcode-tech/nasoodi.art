"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { alternatePathFor } from "@/lib/routing/alternate-path";
import { pagePath, getLocaleDirection, getLocaleName, locales, type Locale } from "@/types/locale";
import { Button } from "@/components/ui/button";
import { Sidebar, SidebarContent, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";
import { Sheet, SheetClose, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { ContentAnnouncement } from "@/components/content-announcement";
import { ThemeSelector } from "@/components/theme-selector";
import { ScrollArea } from "@/components/ui/scroll-area";
import { getArtist } from "@/content/repositories/artist.repository";

function LanguageSelector({ locale, alternates, pathname, label, onNavigate }: { locale: Locale; alternates: Partial<Record<Locale, string>>; pathname: string; label: string; onNavigate?: () => void }) {
  const t = useTranslations();
  const router = useRouter();
  const preserveArchiveState = (event: React.MouseEvent<HTMLAnchorElement>, targetHref: string) => {
    const keys = pathname === pagePath(locale, "galleries")
      ? ["page", "pageSize"]
      : pathname === pagePath(locale, "journal")
        ? ["category", "page", "pageSize"]
        : [];
    if (keys.length === 0) return;

    const current = new URLSearchParams(window.location.search);
    const query = new URLSearchParams();
    for (const key of keys) {
      const value = current.get(key);
      if (!value) continue;
      if (key === "category" && !["exhibition", "event", "studio-update", "story"].includes(value)) continue;
      if (key === "page" && (!/^[1-9]\d*$/.test(value) || value === "1")) continue;
      if (key === "pageSize" && !["10", "20"].includes(value)) continue;
      query.set(key, value);
    }
    const suffix = query.toString();
    if (suffix) {
      event.preventDefault();
      router.push(targetHref + "?" + suffix);
      onNavigate?.();
    }
  };
  return <div className="theme-selector language-selector">
    <DropdownMenu>
    <DropdownMenuTrigger asChild><Button className="theme-trigger language-trigger" variant="ghost" size="sm" aria-label={label}><span className="language-code-icon" aria-hidden="true">{locale.toUpperCase()}</span><span>{getLocaleName(locale)}</span><svg className="selector-chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m6 9 6 6 6-6" /></svg></Button></DropdownMenuTrigger>
    <DropdownMenuContent align={getLocaleDirection(locale) === "rtl" ? "start" : "end"} dir={getLocaleDirection(locale)} aria-label={label}>
      {locales.map((target) => {
        const href = target === locale ? pathname : alternates[target] ?? pagePath(target);
        return <DropdownMenuItem asChild key={target}><Link href={href} hrefLang={target} lang={target} aria-current={locale === target ? "page" : undefined} onClick={(event) => { preserveArchiveState(event, href); onNavigate?.(); }}>{getLocaleName(target)}{locale === target ? " · " + t("current") : ""}</Link></DropdownMenuItem>;
      })}
    </DropdownMenuContent>
    </DropdownMenu>
  </div>;
}
export function SiteShell({ locale, children, announcement }: { locale: Locale; children: React.ReactNode; announcement?: { title: string; description: string; metadata?: string; href: string } }) {
  const t = useTranslations();
  const artist = getArtist(locale);
  const artistName = artist?.name?.[locale] ?? "";
  const [artistGivenName, ...artistFamilyNames] = artistName.split(/\s+/u);
  const artistBrand = artist?.brand ?? "";
  const labels = {
    home: t("home"), about: t("about"), works: t("works"), galleries: t("galleries"),
    journal: t("journal"), contact: t("contact"), skip: t("skip"),
    dismissAnnouncement: t("dismissAnnouncement"),
    discipline: t("discipline"), close: t("close"), menu: t("menu"), language: t("language"),
    appearance: t("appearance"), primaryNavigation: t("primaryNavigation"),
  };
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  useEffect(() => {
    const desktopQuery = window.matchMedia("(min-width: 901px)");
    const closeMobileNavigation = (event: MediaQueryListEvent) => { if (event.matches) setMobileOpen(false); };
    desktopQuery.addEventListener("change", closeMobileNavigation);
    return () => desktopQuery.removeEventListener("change", closeMobileNavigation);
  }, []);
  const drawerHomeRef = useRef<HTMLAnchorElement>(null);
  const alternatePaths = Object.fromEntries(locales.filter((target) => target !== locale).map((target) => [target, alternatePathFor(pathname, locale, target)])) as Partial<Record<Locale, string>>;
  const links: [string, string, string][] = [
    ["home", labels.home, pagePath(locale)], ["about", labels.about, pagePath(locale, "about")],
    ["works", labels.works, pagePath(locale, "works")], ["galleries", labels.galleries, pagePath(locale, "galleries")],
    ["journal", labels.journal, pagePath(locale, "journal")], ["contact", labels.contact, pagePath(locale, "contact")],
  ];
  const navigation = (insideSheet = false) => <nav dir={getLocaleDirection(locale)} aria-label={labels.primaryNavigation}>
    <SidebarMenu className="nav-list">{links.map(([key, label, href]) => {
      const active = key === "home" ? pathname === href : pathname === href || pathname.startsWith(href + "/");
      return <SidebarMenuItem key={key}><SidebarMenuButton><Link className="nav-link" dir={getLocaleDirection(locale)} href={href} aria-current={active ? "page" : undefined} onClick={() => insideSheet && setMobileOpen(false)}>{label}</Link></SidebarMenuButton></SidebarMenuItem>;
    })}</SidebarMenu>
  </nav>;
  const isHomePage = pathname === pagePath(locale);

  return <>
    <a className="skip-link" href="#main-content">{labels.skip}</a>
    {announcement && isHomePage && (
      <ContentAnnouncement
        locale={locale}
        title={announcement.title}
        description={announcement.description}
        metadata={announcement.metadata}
                dismissLabel={labels.dismissAnnouncement}
        href={announcement.href}
        placement="viewport"
      />
    )}
    <Sidebar className="desktop-sidebar" dir={getLocaleDirection(locale)} aria-label={artistBrand}>
      <SidebarHeader><Link className="artist-wordmark" href={pagePath(locale)} aria-label={labels.home}>
        <span className="wordmark-name" dir="ltr">{artistGivenName}</span><span className="wordmark-surname" dir="ltr">{artistFamilyNames.join(" ")}</span><span className="wordmark-role" dir="auto">{labels.discipline}</span>
      </Link></SidebarHeader>
      <SidebarContent>
        <ScrollArea dir={getLocaleDirection(locale)} className="sidebar-scroll-area">
          {navigation()}
          {announcement && !isHomePage && (
            <ContentAnnouncement
              locale={locale}
              title={announcement.title}
        description={announcement.description}
        metadata={announcement.metadata}
                            dismissLabel={labels.dismissAnnouncement}
              href={announcement.href}
              placement="desktop-sidebar"
            />
          )}
          <div className="sidebar-flex-spacer" aria-hidden="true" />
          <div className="sidebar-bottom" dir="ltr"><span>{artistBrand} · © {new Date().getFullYear()}</span></div>
        </ScrollArea>
      </SidebarContent>
    </Sidebar>
    <header className={`mobile-header mobile-header-${locale}`} data-locale={locale}>
      <Link className="mobile-wordmark" dir="ltr" href={pagePath(locale)}>{artistBrand.split(".")[0]}<span>{artistBrand.includes(".") ? "." + artistBrand.split(".").slice(1).join(".") : ""}</span></Link>
      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetTrigger asChild><Button className="menu-trigger" variant="ghost" size="sm" aria-label={mobileOpen ? labels.close : labels.menu} aria-controls="mobile-navigation" aria-expanded={mobileOpen}><span className="menu-trigger-lines" aria-hidden="true"><span/><span/></span></Button></SheetTrigger>
        <SheetContent id="mobile-navigation" side={getLocaleDirection(locale) === "rtl" ? "right" : "left"} className="mobile-drawer" dir={getLocaleDirection(locale)} aria-describedby={undefined} onOpenAutoFocus={(event) => { event.preventDefault(); drawerHomeRef.current?.focus(); }}>
          <SheetTitle className="sr-only">{labels.menu}</SheetTitle>
          <div className="drawer-heading"><Link ref={drawerHomeRef} className="mobile-wordmark" dir="ltr" href={pagePath(locale)}>{artistBrand.split(".")[0]}<span>{artistBrand.includes(".") ? "." + artistBrand.split(".").slice(1).join(".") : ""}</span></Link><SheetClose asChild><Button className="drawer-close" variant="ghost" size="sm" aria-label={labels.close}>×</Button></SheetClose></div>
          <ScrollArea dir={getLocaleDirection(locale)} className="mobile-drawer-scroll">
            {navigation(true)}
            {announcement && (
              <ContentAnnouncement
                locale={locale}
                title={announcement.title}
        description={announcement.description}
        metadata={announcement.metadata}
                                dismissLabel={labels.dismissAnnouncement}
                href={announcement.href}
                placement="mobile-sidebar"
                onNavigate={() => setMobileOpen(false)}
              />
            )}
            <div className="drawer-flex-spacer" aria-hidden="true" />
            <div className="drawer-bottom">
              <div className="drawer-settings" dir={getLocaleDirection(locale)}>
                <div className="drawer-setting-row"><span className="language-label">{labels.language}</span><LanguageSelector locale={locale} alternates={alternatePaths} pathname={pathname} label={labels.language} onNavigate={() => setMobileOpen(false)}/></div>
                <div className="drawer-setting-row"><span className="language-label">{labels.appearance}</span><ThemeSelector locale={locale}/></div>
              </div>
              <div className="drawer-copyright" dir="ltr"><span>{artistBrand}</span><span>© {new Date().getFullYear()}</span></div>
            </div>
          </ScrollArea>
        </SheetContent>
      </Sheet>
    </header>
    <div className="desktop-utility" dir={getLocaleDirection(locale)}><span className="language-label">{labels.language}</span><LanguageSelector locale={locale} alternates={alternatePaths} pathname={pathname} label={labels.language}/><ThemeSelector locale={locale}/></div>
    <div className="site-main"><main id="main-content">{children}</main></div>
  </>;
}
