import assert from "node:assert/strict";
import test from "node:test";
import {
  getCompactPageNumbers,
  galleryPaginationHref,
  paginateItems,
  resolveGalleryPagination,
} from "../src/lib/gallery-pagination";

test("default pagination handles empty, boundary, and multi-page gallery counts", () => {
  for (const [count, pages] of [[0, 0], [1, 1], [5, 1], [6, 2], [10, 2], [11, 3], [20, 4], [21, 5]] as const) {
    assert.equal(resolveGalleryPagination(count).totalPages, pages, `count ${count}`);
  }
  assert.equal(resolveGalleryPagination(6).pageSize, 5);
});

test("all supported page sizes calculate their page counts and slices", () => {
  const items = Array.from({ length: 21 }, (_, index) => `gallery-${index + 1}`);
  for (const size of [5, 10, 20] as const) {
    const state = resolveGalleryPagination(items.length, "1", String(size));
    assert.equal(state.pageSize, size);
    assert.equal(paginateItems(items, state).length, size);
  }
  const last = resolveGalleryPagination(21, "5", "5");
  assert.deepEqual(paginateItems(items, last), ["gallery-21"]);
});

test("invalid page values fall back to page one and oversized pages clamp to the last page", () => {
  for (const value of [undefined, "", "0", "-1", "1.5", "abc", "1e2", "999999999999999999999"]) {
    assert.equal(resolveGalleryPagination(21, value).page, 1, String(value));
  }
  assert.equal(resolveGalleryPagination(21, "99").page, 5);
});

test("unsupported page sizes fall back to five", () => {
  for (const value of [undefined, "", "0", "3", "15", "5.0", "abc"]) {
    assert.equal(resolveGalleryPagination(21, "2", value).pageSize, 5, String(value));
  }
});

test("pagination preserves editorial order without duplicate or missing items", () => {
  const items = ["first", "second", "third", "fourth", "fifth", "sixth", "seventh"];
  const first = paginateItems(items, resolveGalleryPagination(items.length));
  const second = paginateItems(items, resolveGalleryPagination(items.length, "2"));
  assert.deepEqual([...first, ...second], items);
  assert.equal(new Set([...first, ...second]).size, items.length);
});

test("changing page size is represented by a page-one URL and unrelated parameters survive", () => {
  assert.equal(galleryPaginationHref("/fa/galleries", "campaign=spring&page=3", 1, 10), "/fa/galleries?campaign=spring&pageSize=10");
  assert.equal(galleryPaginationHref("/en/galleries", "pageSize=20", 2, 5), "/en/galleries?page=2");
});

test("compact page numbers remain bounded and include first, current, and last pages", () => {
  assert.deepEqual(getCompactPageNumbers(1, 5), [1, 2, 3, 4, 5]);
  assert.deepEqual(getCompactPageNumbers(8, 20), [1, "ellipsis", 7, 8, 9, "ellipsis", 20]);
});
