"use client";

import { useEffect } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  galleryPaginationHref,
  GALLERY_PAGE_SIZES,
  getCompactPageNumbers,
  resolveGalleryPagination,
  type GalleryPageSize,
} from "@/lib/gallery-pagination";
import type { Locale } from "@/lib/site";

type Props = {
  totalItems: number;
  locale: Locale;
  labels: { itemsPerPage: string; previous: string; next: string; page: string; showing: string };
};

export function JournalPagination({ totalItems, locale, labels }: Props) {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryString = searchParams.toString();
  const state = resolveGalleryPagination(totalItems, searchParams.get("page") ?? undefined, searchParams.get("pageSize") ?? undefined);

  useEffect(() => {
    const normalizedHref = galleryPaginationHref(pathname, queryString, state.page, state.pageSize);
    const currentHref = pathname + (queryString ? "?" + queryString : "");
    if (normalizedHref !== currentHref) router.replace(normalizedHref, { scroll: false });
  }, [pathname, queryString, router, state.page, state.pageSize]);

  if (state.totalPages <= 1) return null;
  const range = labels.showing
    .replace("{start}", String(state.startIndex + 1))
    .replace("{end}", String(state.endIndex))
    .replace("{total}", String(state.totalItems));
  const navigate = (page: number, pageSize: GalleryPageSize = state.pageSize) => {
    router.push(galleryPaginationHref(pathname, queryString, page, pageSize), { scroll: false });
  };

  return (
    <section className="gallery-pagination journal-pagination" aria-label={labels.page}>
      <p className="gallery-results-status" role="status" aria-live="polite">{range}</p>
      <div className="gallery-pagination-controls" dir={locale === "fa" ? "rtl" : "ltr"}>
        <label className="gallery-page-size">
          <span>{labels.itemsPerPage}</span>
          <select value={state.pageSize} onChange={(event) => navigate(1, Number(event.target.value) as GalleryPageSize)}>
            {GALLERY_PAGE_SIZES.map((size) => <option key={size} value={size}>{size}</option>)}
          </select>
        </label>
        <nav className="gallery-page-nav" aria-label={labels.page}>
          <button type="button" onClick={() => navigate(state.page - 1)} disabled={state.page <= 1} aria-label={labels.previous}>{locale === "fa" ? "→" : "←"}</button>
          {getCompactPageNumbers(state.page, state.totalPages).map((item, index) =>
            item === "ellipsis" ? <span className="gallery-page-ellipsis" key={"ellipsis-" + index} aria-hidden="true">…</span> :
            <button type="button" key={item} onClick={() => navigate(item)} aria-label={labels.page + " " + item}
              aria-current={item === state.page ? "page" : undefined} className={item === state.page ? "is-current" : undefined}>{item}</button>,
          )}
          <button type="button" onClick={() => navigate(state.page + 1)} disabled={state.page >= state.totalPages} aria-label={labels.next}>{locale === "fa" ? "←" : "→"}</button>
        </nav>
      </div>
    </section>
  );
}
