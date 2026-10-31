"use client";

import Image from "next/image";
import { useCallback, useEffect, useMemo, useState, useSyncExternalStore } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { pagePath, primaryImageFor, type Artwork, type Locale } from "@/lib/site";

type Props = {
  artworks: Artwork[];
  locale: Locale;
  context: "home" | `gallery:${string}`;
};

const subscribeToLocation = (onChange: () => void) => {
  window.addEventListener("popstate", onChange);
  window.addEventListener("nasoodi:locationchange", onChange);
  return () => {
    window.removeEventListener("popstate", onChange);
    window.removeEventListener("nasoodi:locationchange", onChange);
  };
};
const getLocationSearch = () => window.location.search;
const getServerLocationSearch = () => "";

export function ArtworkExperience({ artworks, locale, context }: Props) {
  const locationSearch = useSyncExternalStore(subscribeToLocation, getLocationSearch, getServerLocationSearch);
  const activeSlug = useMemo(() => new URLSearchParams(locationSearch).get("artwork"), [locationSearch]);
  const [failedImages, setFailedImages] = useState<string[]>([]);
  const labels = locale === "fa"
    ? { close: "بستن نمایشگر", previous: "اثر قبلی", next: "اثر بعدی", unavailable: "نمایش تصویر ممکن نیست", position: "از", detail: "مشاهده صفحه اثر" }
    : { close: "Close artwork viewer", previous: "Previous artwork", next: "Next artwork", unavailable: "The artwork image is unavailable", position: "of", detail: "View artwork page" };

  const sequence = useMemo(
    () => artworks.filter((work) => primaryImageFor(work) && work.title[locale]?.trim()),
    [artworks, locale],
  );
  const activeIndex = sequence.findIndex((work) => work.slug === activeSlug);
  const activeArtwork = activeIndex >= 0 ? sequence[activeIndex] : undefined;
  const activeImage = activeArtwork ? primaryImageFor(activeArtwork) : undefined;

  const writeViewerUrl = useCallback((slug: string, mode: "push" | "replace") => {
    const url = new URL(window.location.href);
    url.searchParams.set("artwork", slug);
    url.searchParams.set("viewerContext", context);
    if (mode === "push") {
      window.history.pushState({ ...window.history.state, nasoodiArtworkViewer: true }, "", url);
    } else {
      window.history.replaceState({ ...window.history.state, nasoodiArtworkViewer: true }, "", url);
    }
    window.dispatchEvent(new Event("nasoodi:locationchange"));
  }, [context]);

  const openArtwork = (slug: string) => {
    writeViewerUrl(slug, "push");
  };

  const closeViewer = useCallback(() => {
    if (window.history.state?.nasoodiArtworkViewer) {
      window.history.back();
      return;
    }
    const url = new URL(window.location.href);
    url.searchParams.delete("artwork");
    url.searchParams.delete("viewerContext");
    window.history.replaceState(window.history.state, "", url);
    window.dispatchEvent(new Event("nasoodi:locationchange"));
  }, []);

  const move = useCallback((offset: number) => {
    const next = sequence[activeIndex + offset];
    if (!next) return;
    writeViewerUrl(next.slug, "replace");
  }, [activeIndex, sequence, writeViewerUrl]);

  useEffect(() => {
    if (!activeArtwork) return;
    const onKeyDown = (event: KeyboardEvent) => {
      const target = event.target;
      if (target instanceof HTMLElement && target.closest("input, textarea, select, [contenteditable='true']")) return;
      if (event.key === "ArrowRight") {
        event.preventDefault();
        move(locale === "fa" ? -1 : 1);
      } else if (event.key === "ArrowLeft") {
        event.preventDefault();
        move(locale === "fa" ? 1 : -1);
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [activeArtwork, locale, move]);

  const setImageFailed = (slug: string) => {
    setFailedImages((current) => current.includes(slug) ? current : [...current, slug]);
  };

  return (
    <>
      <div className="artwork-experience-grid">
        {sequence.map((work) => {
          const image = primaryImageFor(work);
          if (!image) return null;
          return (
            <button
              className="artwork-item artwork-experience-card"
              key={work.id}
              type="button"
              aria-haspopup="dialog"
              aria-label={work.title[locale]}
              onClick={() => openArtwork(work.slug)}
            >
              {failedImages.includes(work.slug)
                ? <span className="artwork-image-fallback" role="img" aria-label={labels.unavailable}>{labels.unavailable}</span>
                : <Image
                    sizes="(max-width: 600px) 100vw, (max-width: 900px) 90vw, 50vw"
                    src={image.src}
                    alt={image.alt[locale] ?? ""}
                    width={image.width}
                    height={image.height}
                    onError={() => setImageFailed(work.slug)}
                  />}
              <span>{work.title[locale]}</span>
            </button>
          );
        })}
      </div>

      <Dialog open={Boolean(activeArtwork)} onOpenChange={(open) => { if (!open && activeArtwork) closeViewer(); }}>
        {activeArtwork && activeImage && (
          <DialogContent className="artwork-viewer-content" {...(activeArtwork.description?.[locale]?.trim() ? {} : { "aria-describedby": undefined })}>
            <div className="artwork-viewer-topbar">
              <span className="artwork-viewer-status" aria-live="polite">
                {activeIndex + 1} {labels.position} {sequence.length}
              </span>
              <DialogClose asChild>
                <Button className="artwork-viewer-close" variant="ghost" aria-label={labels.close}>×</Button>
              </DialogClose>
            </div>
            <div className="artwork-viewer-layout">
              <figure className="artwork-viewer-figure">
                {failedImages.includes(activeArtwork.slug)
                  ? <span className="artwork-image-fallback" role="img" aria-label={labels.unavailable}>{labels.unavailable}</span>
                  : <Image
                      src={activeImage.src}
                      alt={activeImage.alt[locale] ?? ""}
                      width={activeImage.width}
                      height={activeImage.height}
                      sizes="(max-width: 800px) 100vw, 68vw"
                      priority
                      onError={() => setImageFailed(activeArtwork.slug)}
                    />}
              </figure>
              <section className="artwork-viewer-info" aria-label={activeArtwork.title[locale]}>
                <DialogTitle aria-live="polite" aria-atomic="true">{activeArtwork.title[locale]}</DialogTitle>
                {activeArtwork.description?.[locale]?.trim() && (
                  <DialogDescription className="artwork-viewer-description">
                    {activeArtwork.description[locale]}
                  </DialogDescription>
                )}
                {(activeArtwork.year || activeArtwork.medium?.[locale]?.trim()) && (
                  <p className="artwork-viewer-metadata">
                    {activeArtwork.year && <span>{activeArtwork.year}</span>}
                    {activeArtwork.medium?.[locale]?.trim() && <span>{activeArtwork.medium[locale]}</span>}
                  </p>
                )}
                <div className="artwork-viewer-controls">
                  <Button variant="outline" size="sm" onClick={() => move(-1)} disabled={activeIndex <= 0} aria-label={labels.previous}>{locale === "fa" ? "→" : "←"}</Button>
                  <Button variant="outline" size="sm" onClick={() => move(1)} disabled={activeIndex >= sequence.length - 1} aria-label={labels.next}>{locale === "fa" ? "←" : "→"}</Button>
                  <Button asChild variant="ghost" size="sm">
                    <a href={pagePath(locale, `works/${activeArtwork.slug}`)}>{labels.detail}</a>
                  </Button>
                </div>
              </section>
            </div>
          </DialogContent>
        )}
      </Dialog>
    </>
  );
}
