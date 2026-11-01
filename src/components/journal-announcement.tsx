"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import type { Locale } from "@/lib/site";
import styles from "./journal-announcement.module.css";

export type AnnouncementEvent = {
  id: string;
  slug: string;
  title: string;
  startsAt: string;
  timeZone: string;
};

type Placement = "viewport" | "desktop-sidebar" | "mobile-sidebar";

const DISMISS_EVENT = "nasoodi:journal-announcement:dismissed";

export function JournalAnnouncement({
  locale,
  event,
  eyebrow,
  dismissLabel,
  href,
  placement = "viewport",
  onNavigate,
}: {
  locale: Locale;
  event: AnnouncementEvent;
  eyebrow: string;
  dismissLabel: string;
  href: string;
  placement?: Placement;
  onNavigate?: () => void;
}) {
  const [visibility, setVisibility] = useState<"pending" | "visible" | "dismissed">("pending");
  const storageKey = `nasoodi:journal-announcement:dismissed:${event.id}`;

  useEffect(() => {
    const syncVisibility = () => {
      try {
        setVisibility(window.sessionStorage.getItem(storageKey) === "1" ? "dismissed" : "visible");
      } catch {
        setVisibility("visible");
      }
    };

    const frame = window.requestAnimationFrame(syncVisibility);
    window.addEventListener(DISMISS_EVENT, syncVisibility);
    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener(DISMISS_EVENT, syncVisibility);
    };
  }, [storageKey]);

  const dismiss = () => {
    try {
      window.sessionStorage.setItem(storageKey, "1");
    } catch {
      // Dismissal still applies to the current component when storage is unavailable.
    }
    setVisibility("dismissed");
    window.dispatchEvent(new Event(DISMISS_EVENT));
  };

  if (visibility !== "visible") return null;

  const date = new Intl.DateTimeFormat(locale, {
    dateStyle: "medium",
    timeZone: event.timeZone,
  }).format(new Date(event.startsAt));

  const containerClass = {
    viewport: styles.container,
    "desktop-sidebar": styles.desktopSidebarContainer,
    "mobile-sidebar": styles.mobileSidebarContainer,
  }[placement];

  return (
    <aside
      className={containerClass}
      data-placement={placement}
      aria-label={eyebrow}
      dir={locale === "fa" ? "rtl" : "ltr"}
    >
      <span
        className={`${styles.paper} ${locale === "fa" ? styles.paperRtl : ""}`}
        aria-hidden="true"
      />
      <Link className={styles.link} href={href} data-part="link" onClick={onNavigate}>
        <span className={styles.eyebrow} data-part="eyebrow">{eyebrow}</span>
        <span className={`${styles.title} ${locale === "fa" ? styles.persianTitle : ""}`} data-part="title">
          {event.title}
        </span>
        <time className={styles.date} dateTime={event.startsAt} data-part="date">
          {date}
        </time>
      </Link>
      <Button
        className={styles.dismiss}
        data-part="dismiss"
        variant="ghost"
        size="sm"
        onClick={dismiss}
        aria-label={dismissLabel}
      >
        <span aria-hidden="true">×</span>
      </Button>
    </aside>
  );
}
