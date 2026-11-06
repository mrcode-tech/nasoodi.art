import type { Locator, Page } from "@playwright/test";

export type ArchiveSection = "works" | "galleries" | "journal";

export function archiveItemLinks(page: Page, section: ArchiveSection): Locator {
  switch (section) {
    case "works":
      return page.locator(".artwork-grid > a.artwork-item[role='listitem']");
    case "galleries":
      return page.locator(".gallery-index-card-link");
    case "journal":
      return page.locator(".journal-card h2 a");
  }
}

export function archivePagination(page: Page, section: ArchiveSection): Locator {
  const selector = section === "works"
    ? ".artwork-pagination"
    : section === "galleries"
      ? ".gallery-pagination"
      : ".journal-pagination";
  return page.locator(selector);
}
