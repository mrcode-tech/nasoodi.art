export const GALLERY_PAGE_SIZES = [5, 10, 20] as const;
export type GalleryPageSize = (typeof GALLERY_PAGE_SIZES)[number];

export type GalleryPaginationState = {
  page: number;
  pageSize: GalleryPageSize;
  totalPages: number;
  totalItems: number;
  startIndex: number;
  endIndex: number;
};

function parsePositiveInteger(value: string | undefined): number | undefined {
  if (!value || !/^[1-9]\d*$/.test(value)) return undefined;
  const parsed = Number(value);
  return Number.isSafeInteger(parsed) ? parsed : undefined;
}

export function resolveGalleryPagination(
  totalItems: number,
  rawPage?: string,
  rawPageSize?: string,
): GalleryPaginationState {
  const pageSizeValue = parsePositiveInteger(rawPageSize);
  const pageSize = GALLERY_PAGE_SIZES.includes(pageSizeValue as GalleryPageSize)
    ? pageSizeValue as GalleryPageSize
    : 5;
  const safeTotal = Number.isSafeInteger(totalItems) && totalItems > 0 ? totalItems : 0;
  const totalPages = Math.ceil(safeTotal / pageSize);
  const requestedPage = parsePositiveInteger(rawPage) ?? 1;
  const page = totalPages === 0 ? 1 : Math.min(requestedPage, totalPages);
  const startIndex = (page - 1) * pageSize;
  return {
    page,
    pageSize,
    totalPages,
    totalItems: safeTotal,
    startIndex,
    endIndex: Math.min(startIndex + pageSize, safeTotal),
  };
}

export function paginateItems<T>(items: readonly T[], state: GalleryPaginationState): T[] {
  return items.slice(state.startIndex, state.endIndex);
}

export function galleryPaginationHref(
  pathname: string,
  currentQuery: string,
  page: number,
  pageSize: GalleryPageSize,
): string {
  const query = new URLSearchParams(currentQuery);
  if (page <= 1) query.delete("page");
  else query.set("page", String(page));
  if (pageSize === 5) query.delete("pageSize");
  else query.set("pageSize", String(pageSize));
  const serialized = query.toString();
  return serialized ? `${pathname}?${serialized}` : pathname;
}

export function getCompactPageNumbers(currentPage: number, totalPages: number): Array<number | "ellipsis"> {
  if (totalPages <= 7) return Array.from({ length: totalPages }, (_, index) => index + 1);
  const pages = new Set<number>([1, totalPages, currentPage, currentPage - 1, currentPage + 1]);
  if (currentPage <= 3) [2, 3, 4].forEach((page) => pages.add(page));
  if (currentPage >= totalPages - 2) [totalPages - 3, totalPages - 2, totalPages - 1].forEach((page) => pages.add(page));
  const sorted = [...pages].filter((page) => page >= 1 && page <= totalPages).sort((a, b) => a - b);
  const result: Array<number | "ellipsis"> = [];
  sorted.forEach((page, index) => {
    if (index > 0 && page - sorted[index - 1] > 1) result.push("ellipsis");
    result.push(page);
  });
  return result;
}
