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

test.describe("Configured content announcement responsive behavior", () => {
  test.skip(!config.active, "Announcement is inactive in the current branch configuration.");

  for (const item of locales) {
    for (const viewport of [
      { width: 1920, height: 1080 },
      { width: 1440, height: 900 },
      { width: 1280, height: 800 },
    ]) {
      test("homepage sticker displays configured localized content in " + item.locale + " at " + viewport.width + "px", async ({ page }) => {
        await page.setViewportSize(viewport);
        await page.goto("/" + item.locale);

        const sticker = page.locator('[data-placement="viewport"]');
        await expect(sticker).toBeVisible();
        await expect(sticker.locator('[data-part="title"]')).toHaveText(config.title[item.locale]);
        await expect(sticker.locator('[data-part="description"]')).toHaveText(config.description[item.locale]);
        if (config.metadata?.[item.locale]) {
          await expect(sticker.locator('[data-part="metadata"]')).toHaveText(config.metadata[item.locale]!);
        } else {
          await expect(sticker.locator('[data-part="metadata"]')).toHaveCount(0);
        }
        await expect(sticker.locator('[data-part="link"]')).toHaveAttribute("href", expectedHref(item.locale));
        await expect(sticker.getByRole("button", { name: item.dismissLabel })).toBeVisible();

        const box = await sticker.boundingBox();
        expect(box).not.toBeNull();
        expect(box!.width).toBeGreaterThanOrEqual(200);
        if (item.locale === "en") expect(box!.x).toBe(0);
        else expect(box!.x + box!.width).toBe(viewport.width);
      });
    }

    for (const viewport of [
      { width: 1920, height: 1080 },
      { width: 1440, height: 900 },
      { width: 1280, height: 800 },
    ]) {
      for (const section of ["about", "contact", "works", "galleries", "journal"] as const) {
        test("desktop sticker keeps homepage geometry on " + section + " in " + item.locale + " at " + viewport.width + "px", async ({ page }) => {
          await page.setViewportSize(viewport);
          await page.goto("/" + item.locale);

          const homeSticker = page.locator('[data-placement="viewport"]');
          await expect(homeSticker).toBeVisible();
          const homeBox = await homeSticker.boundingBox();
          expect(homeBox).not.toBeNull();

          await page.goto("/" + item.locale + "/" + section);
          const sectionSticker = page.locator('[data-placement="viewport"]');
          await expect(sectionSticker).toBeVisible();
          const sectionBox = await sectionSticker.boundingBox();
          expect(sectionBox).not.toBeNull();

          expect(sectionBox!.x).toBeCloseTo(homeBox!.x, 1);
          expect(sectionBox!.y).toBeCloseTo(homeBox!.y, 1);
          expect(sectionBox!.width).toBeCloseTo(homeBox!.width, 1);
          expect(sectionBox!.height).toBeCloseTo(homeBox!.height, 1);
        });
      }
    }

    test("mobile drawer sticker is visible, localized, dismissible, and navigates in " + item.locale, async ({ page }) => {
      await page.setViewportSize({ width: 390, height: 844 });
      await page.goto("/" + item.locale + "/journal");
      await page.getByRole("button", { name: item.menuLabel }).click();

      const drawer = page.getByRole("dialog", { name: item.menuLabel });
      const sticker = drawer.locator('[data-placement="mobile-sidebar"]');
      await expect(drawer).toBeVisible();
      await expect(sticker).toBeVisible();
      await expect(sticker.locator('[data-part="title"]')).toHaveText(config.title[item.locale]);
      await expect(sticker.locator('[data-part="description"]')).toHaveText(config.description[item.locale]);
      await expect(sticker.locator('[data-part="link"]')).toHaveAttribute("href", expectedHref(item.locale));

      const close = sticker.getByRole("button", { name: item.dismissLabel });
      await close.click();
      await expect(sticker).toBeHidden();
    });

    test("sticker link navigates to the configured destination in " + item.locale, async ({ page }) => {
      await page.setViewportSize({ width: 1280, height: 900 });
      await page.goto("/" + item.locale);
      await page.locator('[data-placement="viewport"] [data-part="link"]').click();
      await expect(page).toHaveURL("http://127.0.0.1:3000" + expectedHref(item.locale));
    });
  }
});

test("inactive branch configuration does not render an announcement", async ({ page }) => {
  test.skip(config.active, "The branch announcement is active; inactive rendering is covered by configuration unit tests.");
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto("/en");
  await expect(page.locator("[data-placement]")).toHaveCount(0);
});
