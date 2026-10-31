"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import {
  getCompactPageNumbers,
  galleryPaginationHref,
  GALLERY_PAGE_SIZES,
  paginateItems,
  resolveGalleryPagination,
  type GalleryPageSize,
} from "@/lib/gallery-pagination";
import { getGalleryCoverArtwork, pagePath, type Artwork, type Gallery, type Locale } from "@/lib/site";

type Props = {
  galleries: Gallery[];
  artworks: Artwork[];
  locale: Locale;
  labels: { itemsPerPage: string; previous: string; next: string; page: string; showing: string };
  rawPage?: string;
  rawPageSize?: string;
};

export function GalleryIndex({ galleries, artworks, locale, labels, rawPage, rawPageSize }: Props) {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryString = searchParams.toString();
  const resolved = useMemo(
    () => resolveGalleryPagination(galleries.length, rawPage, rawPageSize),
    [galleries.length, rawPage, rawPageSize],
  );
  const [page, setPage] = useState(resolved.page);
  const [pageSize, setPageSize] = useState<GalleryPageSize>(resolved.pageSize);

  useEffect(() => {
    const query = new URLSearchParams(queryString);
    const next = resolveGalleryPagination(galleries.length, query.get("page") ?? undefined, query.get("pageSize") ?? undefined);
    setPage(next.page);
    setPageSize(next.pageSize);
    const normalizedHref = galleryPaginationHref(pathname, queryString, next.page, next.pageSize);
    const currentHref = pathname + (queryString ? "?" + queryString : "");
    if (normalizedHref !== currentHref) router.replace(normalizedHref, { scroll: false });
  }, [galleries.length, pathname, queryString, router]);

  const state = resolveGalleryPagination(galleries.length, String(page), String(pageSize));
  const visible = paginateItems(galleries, state);
  const range = state.totalItems === 0 ? "" : labels.showing
    .replace("{start}", String(state.startIndex + 1))
    .replace("{end}", String(state.endIndex))
    .replace("{total}", String(state.totalItems));

  const navigate = (nextPage: number, nextSize: GalleryPageSize = pageSize) => {
    const href = galleryPaginationHref(pathname, queryString, nextPage, nextSize);
    setPage(nextPage);
    setPageSize(nextSize);
    router.push(href, { scroll: false });
  };

  return (
    <>
      {galleries.length === 0 ? null : (
        <div className="gallery-index-grid" role="list" aria-label={locale === "fa" ? "گالری‌ها" : "Galleries"}>
          {visible.map((gallery) => {
            const cover = getGalleryCoverArtwork(gallery, artworks, locale);
            if (!cover) return null;
            return (
              <article className="gallery-index-card" role="listitem" key={gallery.id}>
                <Link className="gallery-index-card-link" href={pagePath(locale, "galleries/" + gallery.slug)}>
                  <span className="gallery-index-image-frame">
                    <Image src={cover.image.src} alt={cover.image.alt[locale] ?? ""} width={cover.image.width} height={cover.image.height}
                      sizes="(max-width: 600px) 100vw, (max-width: 900px) 50vw, 33vw" />
                  </span>
                  <span className="gallery-index-card-copy">
                    <strong>{gallery.title[locale]}</strong>
                    <span>{gallery.description[locale]}</span>
                  </span>
                </Link>
              </article>
            );
          })}
        </div>
      )}
      {state.totalPages > 1 && (
        <section className="gallery-pagination" aria-label={locale === "fa" ? "صفحه‌بندی گالری‌ها" : "Gallery pagination"}>
          <p className="gallery-results-status" role="status" aria-live="polite">{range}</p>
          <div className="gallery-pagination-controls" dir={locale === "fa" ? "rtl" : "ltr"}>
            <label className="gallery-page-size">
              <span>{labels.itemsPerPage}</span>
              <select value={pageSize} onChange={(event) => navigate(1, Number(event.target.value) as GalleryPageSize)}>
                {GALLERY_PAGE_SIZES.map((size) => <option key={size} value={size}>{size}</option>)}
              </select>
            </label>
            <nav className="gallery-page-nav" aria-label={labels.page}>
              <button type="button" onClick={() => navigate(page - 1)} disabled={page <= 1} aria-label={labels.previous}>{locale === "fa" ? "→" : "←"}</button>
              {getCompactPageNumbers(page, state.totalPages).map((item, index) =>
                item === "ellipsis" ? <span className="gallery-page-ellipsis" key={"ellipsis-" + index} aria-hidden="true">…</span> :
                <button type="button" key={item} onClick={() => navigate(item)} aria-label={labels.page + " " + item}
                  aria-current={item === page ? "page" : undefined} className={item === page ? "is-current" : undefined}>{item}</button>,
              )}
              <button type="button" onClick={() => navigate(page + 1)} disabled={page >= state.totalPages} aria-label={labels.next}>{locale === "fa" ? "←" : "→"}</button>
            </nav>
          </div>
        </section>
      )}
    </>
  );
}
