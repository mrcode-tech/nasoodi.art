"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import {
  alternatePathFor,
  copyFor,
  cvEntries,
  getPublicCvEntries,
  otherLocale,
  pagePath,
  type Locale,
} from "@/lib/site";

export function SiteShell({ locale, children }: { locale: Locale; children: React.ReactNode }) {
  const labels = copyFor(locale);
  const pathname = usePathname();
  const [openPath, setOpenPath] = useState<string | null>(null);
  const open = openPath === pathname;
  const drawer = useRef<HTMLElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const wasOpen = useRef(false);
  const alternate = alternatePathFor(pathname, locale);

  const links: [string, string, string][] = [
    ["home", labels.home, pagePath(locale)],
    ["works", labels.works, pagePath(locale, "works")],
    ["galleries", labels.galleries, pagePath(locale, "galleries")],
    ["journal", labels.journal, pagePath(locale, "journal")],
    ["about", labels.about, pagePath(locale, "about")],
    ["contact", labels.contact, pagePath(locale, "contact")],
  ];

  if (getPublicCvEntries(cvEntries, locale).length > 0) {
    links.splice(5, 0, ["cv", labels.cv, pagePath(locale, "cv")]);
  }

  useEffect(() => {
    if (!open) {
      if (wasOpen.current) {
        trigger.current?.focus();
        wasOpen.current = false;
      }
      return;
    }

    wasOpen.current = true;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    drawer.current?.querySelector<HTMLElement>("a, button")?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        setOpenPath(null);
        return;
      }

      if (event.key !== "Tab" || !drawer.current) return;
      const focusable = Array.from(
        drawer.current.querySelectorAll<HTMLElement>('a[href], button:not([disabled])'),
      ).filter((element) => element.offsetParent !== null);

      if (!focusable.length) return;
      if (event.shiftKey && document.activeElement === focusable[0]) {
        event.preventDefault();
        focusable[focusable.length - 1].focus();
      } else if (!event.shiftKey && document.activeElement === focusable[focusable.length - 1]) {
        event.preventDefault();
        focusable[0].focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  const navigation = (isDrawer = false) => (
    <nav aria-label={locale === "fa" ? "راهبری اصلی" : "Primary navigation"}>
      <ul className="nav-list">
        {links.map(([key, label, href]) => {
          const active =
            key === "home"
              ? pathname === href
              : pathname === href || pathname.startsWith(href + "/");

          return (
            <li key={key}>
              <Link
                className="nav-link"
                dir="auto"
                href={href}
                aria-current={active ? "page" : undefined}
                onClick={() => isDrawer && href === pathname && setOpen(false)}
              >
                {label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );

  return (
    <>
      <a className="skip-link" href="#main-content">
        {labels.skip}
      </a>

      <aside className="desktop-sidebar" aria-label="Nasoodi.art">
        <Link className="artist-wordmark" href={pagePath(locale)}>
          <span className="wordmark-name" dir="ltr">Ghazaleh</span>
          <span className="wordmark-surname" dir="ltr">Abdolahzade Nasoodi</span>
          <span className="wordmark-role" dir="auto">{labels.discipline}</span>
        </Link>
        {navigation()}
        <div className="sidebar-bottom">
          <span>nasoodi.art</span>
          <span>© {new Date().getFullYear()}</span>
        </div>
      </aside>

      <header className="mobile-header">
        <Link className="mobile-wordmark" dir="ltr" href={pagePath(locale)}>
          Nasoodi<span>.</span>
        </Link>
        <button
          ref={trigger}
          className="menu-trigger"
          type="button"
          aria-controls="mobile-navigation"
          aria-expanded={open}
          aria-label={open ? labels.close : labels.menu}
          onClick={() => setOpenPath(pathname)}
        >
          <span />
          <span />
        </button>
      </header>

      <div className="desktop-utility">
        <span>{labels.language}</span>
        <Link href={alternate} hrefLang={otherLocale(locale)}>
          {otherLocale(locale) === "fa" ? "فارسی" : "English"}
        </Link>
      </div>

      {open && (
        <button
          className="menu-backdrop"
          type="button"
          aria-label={labels.close}
          onClick={() => setOpen(false)}
        />
      )}

      <section
        ref={drawer}
        id="mobile-navigation"
        className="mobile-drawer"
        data-open={open}
        aria-hidden={!open}
        inert={!open}
        role="dialog"
        aria-modal={open || undefined}
        aria-label={labels.menu}
      >
        <div className="drawer-heading">
          <Link className="mobile-wordmark" dir="ltr" href={pagePath(locale)}>
            Nasoodi<span>.</span>
          </Link>
          <button
            className="drawer-close"
            type="button"
            aria-label={labels.close}
            onClick={() => setOpen(false)}
            tabIndex={open ? 0 : -1}
          >
            ×
          </button>
        </div>
        {navigation(true)}
        <div className="drawer-settings">
          <span>{labels.language}</span>
          <Link href={alternate} hrefLang={otherLocale(locale)}>
            {otherLocale(locale) === "fa" ? "فارسی" : "English"}
          </Link>
        </div>
      </section>

      <div className="site-main">
        <main id="main-content">{children}</main>
        <footer className="site-footer">
          <span>Ghazaleh Abdolahzade Nasoodi</span>
          <span>© {new Date().getFullYear()} · {labels.rights}</span>
        </footer>
      </div>
    </>
  );
}
