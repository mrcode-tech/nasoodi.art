"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  galleryPaginationHref,
  GALLERY_PAGE_SIZES,
  getCompactPageNumbers,
  paginateItems,
  resolveGalleryPagination,
  type GalleryPageSize,
} from "@/lib/gallery-pagination";
import { formatLocaleNumber } from "@/lib/locale-number";
import { getLocaleDirection, pagePath, type Locale } from "@/types/locale";
import type { Artwork } from "@/types/content";

type Props = {
  artworks: Artwork[];
  locale: Locale;
  labels: { itemsPerPage: string; previous: string; next: string; page: string };
};

export function ArtworkIndex({ artworks, locale, labels }: Props) {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryString = searchParams.toString();
  const state = resolveGalleryPagination(
    artworks.length,
    searchParams.get("page") ?? undefined,
    searchParams.get("pageSize") ?? undefined,
  );

  useEffect(() => {
    const normalizedHref = galleryPaginationHref(pathname, queryString, state.page, state.pageSize);
    const currentHref = pathname + (queryString ? "?" + queryString : "");
    if (normalizedHref !== currentHref) router.replace(normalizedHref, { scroll: false });
  }, [pathname, queryString, router, state.page, state.pageSize]);

  const visible = paginateItems(artworks, state);
  const showing = locale === "fa"
    ? "نمایش {start} تا {end} از {total} اثر"
    : "Showing {start}–{end} of {total} artworks";
  const range = state.totalItems === 0 ? "" : showing
    .replace("{start}", formatLocaleNumber(state.startIndex + 1, locale))
    .replace("{end}", formatLocaleNumber(state.endIndex, locale))
    .replace("{total}", formatLocaleNumber(state.totalItems, locale));

  const navigate = (page: number, pageSize: GalleryPageSize = state.pageSize) => {
    router.push(galleryPaginationHref(pathname, queryString, page, pageSize), { scroll: false });
  };

  return (
    <>
      <div className="artwork-grid" role="list" aria-label={locale === "fa" ? "فهرست آثار" : "Works"}>
        {visible.map((artwork) => {
          const image = artwork.images.find((candidate) =>
            candidate.role === "primary" &&
            candidate.src.startsWith("/") &&
            !candidate.src.startsWith("//") &&
            !candidate.src.includes(String.fromCharCode(92)) &&
            !candidate.src.includes("?") &&
            !candidate.src.includes("#") &&
            !candidate.src.toLowerCase().includes("%2e") &&
            !candidate.src.toLowerCase().includes("%2f") &&
            !candidate.src.toLowerCase().includes("%5c") &&
            candidate.src.split("/").every((segment) => segment !== "." && segment !== "..") &&
            candidate.width > 0 &&
            candidate.height > 0,
          );
          if (!image) return null;
          return (
            <Link className="artwork-item" role="listitem" key={artwork.id} href={pagePath(locale, `works/${artwork.slug}`)}>
              <Image sizes="(max-width: 600px) 100vw, (max-width: 900px) 90vw, 50vw"
                src={image.src} alt={image.alt[locale] ?? ""} width={image.width} height={image.height} />
              <span>{artwork.title[locale]}</span>
            </Link>
          );
        })}
      </div>
      {state.totalPages > 1 && (
        <section className="gallery-pagination artwork-pagination" aria-label={labels.page}>
          <p className="gallery-results-status" role="status" aria-live="polite">{range}</p>
          <div className="gallery-pagination-controls" dir={getLocaleDirection(locale)}>
            <label className="gallery-page-size">
              <span>{labels.itemsPerPage}</span>
              <select value={state.pageSize} onChange={(event) => navigate(1, Number(event.target.value) as GalleryPageSize)}>
                {GALLERY_PAGE_SIZES.map((size) => <option key={size} value={size}>{formatLocaleNumber(size, locale)}</option>)}
              </select>
            </label>
            <nav className="gallery-page-nav" aria-label={labels.page}>
              <button type="button" onClick={() => navigate(state.page - 1)} disabled={state.page <= 1} aria-label={labels.previous}>
                {getLocaleDirection(locale) === "rtl" ? "→" : "←"}
              </button>
              {getCompactPageNumbers(state.page, state.totalPages).map((item, index) =>
                item === "ellipsis"
                  ? <span className="gallery-page-ellipsis" key={"ellipsis-" + index} aria-hidden="true">…</span>
                  : <button type="button" key={item} onClick={() => navigate(item)}
                      aria-label={labels.page + " " + formatLocaleNumber(item, locale)}
                      aria-current={item === state.page ? "page" : undefined}
                      className={item === state.page ? "is-current" : undefined}>
                      {formatLocaleNumber(item, locale)}
                    </button>,
              )}
              <button type="button" onClick={() => navigate(state.page + 1)} disabled={state.page >= state.totalPages} aria-label={labels.next}>
                {getLocaleDirection(locale) === "rtl" ? "←" : "→"}
              </button>
            </nav>
          </div>
        </section>
      )}
    </>
  );
}
