"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { getLocaleDirection, type Locale } from "@/types/locale";
import styles from "./content-announcement.module.css";

type Placement = "viewport" | "desktop-sidebar" | "mobile-sidebar";

const DISMISS_EVENT = "nasoodi:content-announcement:dismissed";

export function ContentAnnouncement({
  locale,
  id,
  title,
  description,
  metadata,
  dismissLabel,
  href,
  placement = "viewport",
  onNavigate,
}: {
  locale: Locale;
  id: string;
  title: string;
  description: string;
  metadata?: string;
  dismissLabel: string;
  href: string;
  placement?: Placement;
  onNavigate?: () => void;
}) {
  const [visibility, setVisibility] = useState<"pending" | "visible" | "dismissed">("pending");
  const storageKey = `nasoodi:content-announcement:dismissed:${id}`;

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
      // Dismissal still applies to this component when storage is unavailable.
    }
    setVisibility("dismissed");
    window.dispatchEvent(new Event(DISMISS_EVENT));
  };

  if (visibility !== "visible") return null;

  const containerClass = {
    viewport: styles.container,
    "desktop-sidebar": styles.desktopSidebarContainer,
    "mobile-sidebar": styles.mobileSidebarContainer,
  }[placement];

  return (
    <aside
      className={containerClass}
      data-placement={placement}
      aria-label={metadata || title}
      dir={getLocaleDirection(locale)}
    >
      <span
        className={`${styles.paper} ${getLocaleDirection(locale) === "rtl" ? styles.paperRtl : ""}`}
        data-part="paper"
        aria-hidden="true"
      />
      <Link className={styles.link} href={href} data-part="link" onClick={onNavigate}>
        {metadata && <span className={styles.eyebrow} data-part="metadata">{metadata}</span>}
        <span className={`${styles.title} ${locale === "fa" ? styles.persianTitle : ""}`} data-part="title">
          {title}
        </span>
        <span className={styles.description} data-part="description">{description}</span>
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
