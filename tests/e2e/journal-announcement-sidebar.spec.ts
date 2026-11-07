import { expect, test } from "@playwright/test";
import announcementConfig from "../../src/content/announcement.json";
import { assertAnnouncementConfig, getAnnouncementHref, type AnnouncementConfig } from "../../src/lib/content/announcement-config";
import { getArtworkById } from "../../src/content/repositories/artwork.repository";
import { getGalleryById } from "../../src/content/repositories/gallery.repository";
import { getJournalEntryById } from "../../src/content/repositories/journal.repository";
import { getEvents } from "../../src/content/repositories/event.repository";
import { getLocalizedSlug } from "../../src/lib/content/paths";

assertAnnouncementConfig(announcementConfig);
const config: AnnouncementConfig = announcementConfig as AnnouncementConfig;

function expectedHref(locale: "en" | "fa"): string {
  let slug: string | undefined;
  switch (config.type) {
    case "artwork": {
      const item = getArtworkById(config.contentId, locale);
      if (item) slug = getLocalizedSlug(item, locale);
      break;
    }
    case "gallery": {
      const item = getGalleryById(config.contentId, locale);
      if (item) slug = getLocalizedSlug(item, locale);
      break;
    }
    case "journal": {
      const item = getJournalEntryById(config.contentId, locale);
      if (item) slug = getLocalizedSlug(item, locale);
      break;
    }
    case "event": {
      const item = getEvents(locale).find((entry) => entry.id === config.contentId);
      if (item) slug = getLocalizedSlug(item, locale);
      break;
    }
  }
  if (!slug) throw new Error("Active announcement does not resolve to published content for " + locale);
  return getAnnouncementHref(config.type, slug, locale);
}

const locales = [
  { locale: "en", menuLabel: "Open navigation", dismissLabel: "Dismiss announcement" },
  { locale: "fa", menuLabel: "باز کردن راهبری", dismissLabel: "بستن اعلان" },
] as const;

test.describe("Configured announcement in navigation", () => {
  test.skip(!config.active, "Announcement is inactive in the current branch configuration.");

  for (const item of locales) {
    test("mobile " + item.locale + " drawer places the announcement before language settings", async ({ page }) => {
      await page.setViewportSize({ width: 390, height: 844 });
      await page.goto("/" + item.locale + "/journal");
      await page.getByRole("button", { name: item.menuLabel }).click();
      const drawer = page.getByRole("dialog", { name: item.menuLabel });
      await expect(drawer).toBeVisible();

      const sticker = drawer.locator('[data-placement="mobile-sidebar"]');
      await expect(sticker).toBeVisible();
      await expect(sticker).toHaveAttribute("aria-label", config.metadata?.[item.locale] || config.title[item.locale]);
      await expect(sticker.getByRole("link")).toHaveAttribute("href", expectedHref(item.locale));
      await expect(sticker.locator('[data-part="title"]')).toHaveText(config.title[item.locale]);
      await expect(sticker.locator('[data-part="description"]')).toHaveText(config.description[item.locale]);

      const order = await drawer.evaluate((node) => {
        const announcement = node.querySelector('[data-placement="mobile-sidebar"]');
        const settings = node.querySelector(".drawer-settings");
        return Boolean(announcement && settings && (announcement.compareDocumentPosition(settings) & Node.DOCUMENT_POSITION_FOLLOWING));
      });
      expect(order).toBe(true);
      await sticker.getByRole("button", { name: item.dismissLabel }).click();
      await expect(sticker).toBeHidden();
    });
  }

  test("desktop sidebar places the announcement after navigation and before the flexible spacer", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 960 });
    await page.goto("/en/journal");
    const sidebar = page.locator(".desktop-sidebar");
    const sticker = sidebar.locator('[data-placement="desktop-sidebar"]');
    await expect(sticker).toBeVisible();
    await expect(sticker).toHaveAttribute("aria-label", config.metadata?.en || config.title.en);
    await expect(sticker.getByRole("link")).toHaveAttribute("href", expectedHref("en"));
    await expect(sticker.locator('[data-part="title"]')).toHaveText(config.title.en);
    const order = await sidebar.evaluate((node) => {
      const navigation = node.querySelector("nav");
      const announcement = node.querySelector('[data-placement="desktop-sidebar"]');
      const spacer = node.querySelector(".sidebar-flex-spacer");
      return Boolean(navigation && announcement && spacer &&
        (navigation.compareDocumentPosition(announcement) & Node.DOCUMENT_POSITION_FOLLOWING) &&
        (announcement.compareDocumentPosition(spacer) & Node.DOCUMENT_POSITION_FOLLOWING));
    });
    expect(order).toBe(true);
  });

  test("desktop announcement close control has no circular button treatment", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 960 });
    await page.goto("/en");
    const close = page.locator('[data-placement="viewport"]').getByRole("button", { name: "Dismiss announcement" });
    await expect(close).toBeVisible();
    await expect(close).toHaveCSS("border-radius", "0px");
    await expect(close).toHaveCSS("background-color", "rgba(0, 0, 0, 0)");
  });
});

test("inactive announcement configuration does not render in the navigation", async ({ page }) => {
  test.skip(config.active, "The branch announcement is active; inactive rendering is covered by configuration unit tests.");
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/en/journal");
  await page.getByRole("button", { name: "Open navigation" }).click();
  await expect(page.locator('[data-placement="mobile-sidebar"]')).toHaveCount(0);
});

for (const locale of ["en", "fa"] as const) {
  test("mobile " + locale + " language and appearance selectors share the same trigger design", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/" + locale + "/journal");
    await page.getByRole("button", { name: locale === "en" ? "Open navigation" : "باز کردن راهبری" }).click();

    const drawer = page.locator(".mobile-drawer");
    const language = drawer.locator(".language-trigger");
    const appearance = drawer.locator(".theme-trigger:not(.language-trigger)");
    await expect(language).toBeVisible();
    await expect(appearance).toBeVisible();
    await expect(language.locator(".language-code-icon")).toHaveText(locale.toUpperCase());
    await expect(language.locator(".selector-chevron")).toHaveCount(1);
    await expect(appearance.locator(".selector-chevron")).toHaveCount(1);
    for (const trigger of [language, appearance]) {
      const chevron = trigger.locator(".selector-chevron");
      await expect(chevron).toBeVisible();
      const fitsInsideTrigger = await trigger.evaluate((node) => {
        const arrow = node.querySelector(".selector-chevron");
        if (!arrow) return false;
        const triggerRect = node.getBoundingClientRect();
        const arrowRect = arrow.getBoundingClientRect();
        const style = getComputedStyle(arrow);
        return style.display !== "none" && style.visibility === "visible" &&
          arrowRect.width > 0 && arrowRect.height > 0 &&
          arrowRect.left >= triggerRect.left && arrowRect.right <= triggerRect.right &&
          arrowRect.top >= triggerRect.top && arrowRect.bottom <= triggerRect.bottom;
      });
      expect(fitsInsideTrigger).toBe(true);
    }

    const languageBox = await language.evaluate((node) => {
      const style = getComputedStyle(node);
      const rect = node.getBoundingClientRect();
      return { width: rect.width, height: rect.height, padding: style.padding, gap: style.gap };
    });
    const appearanceBox = await appearance.evaluate((node) => {
      const style = getComputedStyle(node);
      const rect = node.getBoundingClientRect();
      return { width: rect.width, height: rect.height, padding: style.padding, gap: style.gap };
    });
    expect(languageBox).toEqual(appearanceBox);
  });
}
