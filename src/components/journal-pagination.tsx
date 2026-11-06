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
import { getLocaleDirection, type Locale } from "@/types/locale";
import { formatLocaleNumber } from "@/lib/locale-number";

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

  const range = labels.showing
    .replace("{start}", formatLocaleNumber(state.startIndex + 1, locale))
    .replace("{end}", formatLocaleNumber(state.endIndex, locale))
    .replace("{total}", formatLocaleNumber(state.totalItems, locale));
  const navigate = (page: number, pageSize: GalleryPageSize = state.pageSize) => {
    router.push(galleryPaginationHref(pathname, queryString, page, pageSize), { scroll: false });
  };

  return (
    <section className="gallery-pagination journal-pagination" aria-label={labels.page}>
      <p className="gallery-results-status" role="status" aria-live="polite">{range}</p>
      <div className="gallery-pagination-controls" dir={getLocaleDirection(locale)}>
        <label className="gallery-page-size">
          <span>{labels.itemsPerPage}</span>
          <select value={state.pageSize} onChange={(event) => navigate(1, Number(event.target.value) as GalleryPageSize)}>
            {GALLERY_PAGE_SIZES.map((size) => <option key={size} value={size}>{formatLocaleNumber(size, locale)}</option>)}
          </select>
        </label>
        {state.totalPages > 1 && <nav className="gallery-page-nav" aria-label={labels.page}>
          <button type="button" onClick={() => navigate(state.page - 1)} disabled={state.page <= 1} aria-label={labels.previous}>{getLocaleDirection(locale) === "rtl" ? "→" : "←"}</button>
          {getCompactPageNumbers(state.page, state.totalPages).map((item, index) =>
            item === "ellipsis" ? <span className="gallery-page-ellipsis" key={"ellipsis-" + index} aria-hidden="true">…</span> :
            <button type="button" key={item} onClick={() => navigate(item)} aria-label={labels.page + " " + formatLocaleNumber(item, locale)}
              aria-current={item === state.page ? "page" : undefined} className={item === state.page ? "is-current" : undefined}>{formatLocaleNumber(item, locale)}</button>,
          )}
          <button type="button" onClick={() => navigate(state.page + 1)} disabled={state.page >= state.totalPages} aria-label={labels.next}>{getLocaleDirection(locale) === "rtl" ? "←" : "→"}</button>
        </nav>}
      </div>
    </section>
  );
}
