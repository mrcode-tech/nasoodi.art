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

  test("desktop announcement overlays the sidebar without joining its document flow", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 960 });
    await page.goto("/en");
    const sticker = page.locator('[data-placement="desktop-sidebar"]');
    await expect(sticker).toBeVisible();
    await expect(sticker).toHaveAttribute("aria-label", config.metadata?.en || config.title.en);
    await expect(sticker.getByRole("link")).toHaveAttribute("href", expectedHref("en"));
    await expect(sticker.locator('[data-part="title"]')).toHaveText(config.title.en);
    const overlayPlacement = await sticker.evaluate((node) => {
      const sidebarNode = document.querySelector(".desktop-sidebar");
      const style = getComputedStyle(node);
      return Boolean(sidebarNode && !sidebarNode.contains(node) && style.position === "fixed");
    });
    expect(overlayPlacement).toBe(true);
  });

  test("desktop announcement close control has no circular button treatment", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 960 });
    await page.goto("/en");
    const close = page.locator('[data-placement="desktop-sidebar"]').getByRole("button", { name: "Dismiss announcement" });
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

for (const locale of ["en", "fa"] as const) {
  test("mobile " + locale + " drawer keeps the brand and copyright year on one line", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/" + locale + "/journal");
    await page.getByRole("button", { name: locale === "en" ? "Open navigation" : "باز کردن راهبری" }).click();

    const drawer = page.locator(".mobile-drawer");
    const copyright = drawer.locator(".drawer-copyright");
    const brand = copyright.locator("span").nth(0);
    const year = copyright.locator("span").nth(1);
    await expect(copyright).toBeVisible();
    await expect(brand).toHaveText(/nasoodi\\.art/i);
    await expect(year).toHaveText(/©\s*\d{4}/);

    const layout = await copyright.evaluate((node) => {
      const brandNode = node.children[0] as HTMLElement;
      const yearNode = node.children[1] as HTMLElement;
      const brandRect = brandNode.getBoundingClientRect();
      const yearRect = yearNode.getBoundingClientRect();
      const style = getComputedStyle(node);
      return {
        direction: style.flexDirection,
        wrapping: style.flexWrap,
        sameLine: Math.abs(brandRect.top - yearRect.top) < 1,
        withinDrawer: yearRect.right <= node.getBoundingClientRect().right + 1,
      };
    });

    expect(layout).toEqual({
      direction: "row",
      wrapping: "nowrap",
      sameLine: true,
      withinDrawer: true,
    });
  });
}
