import { expect, test, type Locator } from "@playwright/test";

const locales = [
  {
    locale: "en",
    menuLabel: "Open navigation",
    dismissLabel: "Dismiss exhibition announcement",
    title: "Open Studio: Colour and Stillness",
  },
  {
    locale: "fa",
    menuLabel: "باز کردن راهبری",
    dismissLabel: "بستن اطلاعیه نمایشگاه",
    title: "آتلیه باز: رنگ و سکون",
  },
] as const;

async function expectDismissButtonInsideSticker(sticker: Locator) {
  const stickerBox = await sticker.boundingBox();
  const buttonBox = await sticker.getByRole("button").boundingBox();
  const titleBox = await sticker.locator('[data-part="title"]').boundingBox();
  const paper = sticker.locator('[data-part="paper"]');
  const paperBox = await paper.boundingBox();
  const paperBackgroundSize = await paper.evaluate((element) => getComputedStyle(element).backgroundSize);

  expect(stickerBox).not.toBeNull();
  expect(buttonBox).not.toBeNull();
  expect(titleBox).not.toBeNull();
  expect(paperBox).not.toBeNull();
  expect(paperBox!.x).toBe(stickerBox!.x);
  expect(paperBox!.y).toBe(stickerBox!.y);
  expect(paperBox!.width).toBe(stickerBox!.width);
  expect(paperBox!.height).toBe(stickerBox!.height);
  expect(paperBackgroundSize).toBe('100% 100%');
  expect(buttonBox!.width).toBeGreaterThanOrEqual(44);
  expect(buttonBox!.height).toBeGreaterThanOrEqual(44);
  // Keep the 44px control inside the visible paper silhouette, clear of its transparent SVG edge.
  expect(buttonBox!.x).toBeGreaterThanOrEqual(stickerBox!.x + 12);
  expect(buttonBox!.y).toBeGreaterThanOrEqual(stickerBox!.y);
  expect(buttonBox!.x + buttonBox!.width).toBeLessThanOrEqual(stickerBox!.x + stickerBox!.width - 12);
  expect(buttonBox!.y + buttonBox!.height).toBeLessThanOrEqual(stickerBox!.y + stickerBox!.height);
  expect(titleBox!.x).toBeGreaterThanOrEqual(stickerBox!.x);
  expect(titleBox!.y).toBeGreaterThanOrEqual(stickerBox!.y);
  expect(titleBox!.x + titleBox!.width).toBeLessThanOrEqual(stickerBox!.x + stickerBox!.width);
  expect(titleBox!.y + titleBox!.height).toBeLessThanOrEqual(stickerBox!.y + stickerBox!.height);
  const overlaps = buttonBox!.x < titleBox!.x + titleBox!.width &&
    buttonBox!.x + buttonBox!.width > titleBox!.x &&
    buttonBox!.y < titleBox!.y + titleBox!.height &&
    buttonBox!.y + buttonBox!.height > titleBox!.y;
  expect(overlaps).toBe(false);
}

test.describe("Journal announcement responsive placements", () => {
  for (const item of locales) {
    for (const viewport of [
      { width: 1920, height: 1080 },
      { width: 1440, height: 900 },
      { width: 1280, height: 800 },
    ]) {
      test(`desktop viewport announcement is balanced in ${item.locale} at ${viewport.width}px`, async ({ page }) => {
        await page.setViewportSize(viewport);
        await page.goto(`/${item.locale}`);

        const sticker = page.locator('[data-placement="viewport"]');
        await expect(sticker).toBeVisible();
        await expect(sticker.locator('[data-part="eyebrow"]')).toBeVisible();
        await expect(sticker.locator('[data-part="title"]')).toHaveText(item.title);
        await expect(sticker.locator('[data-part="link"]')).toHaveAttribute("href", /journal/);
        await expect(sticker.locator('[data-part="date"]')).toBeVisible();
        await expectDismissButtonInsideSticker(sticker);

        const box = await sticker.boundingBox();
        expect(box).not.toBeNull();
        expect(box!.width).toBeGreaterThanOrEqual(240);
        if (item.locale === "en") expect(box!.x).toBe(0);
        else expect(box!.x + box!.width).toBe(viewport.width);

        await page.screenshot({
          path: test.info().outputPath(`announcement-viewport-${item.locale}-${viewport.width}.png`),
        });
      });
    }

    test(`desktop sidebar announcement fits the navigation column in ${item.locale}`, async ({ page }) => {
      await page.setViewportSize({ width: 1024, height: 768 });
      await page.goto(`/${item.locale}/works`);

      const sidebar = page.locator(".desktop-sidebar");
      const sticker = sidebar.locator('[data-placement="desktop-sidebar"]');
      await expect(sidebar).toBeVisible();
      await expect(sticker).toBeVisible();
      await expect(sticker.locator('[data-part="title"]')).toHaveText(item.title);
      await expect(sticker.locator('[data-part="link"]')).toHaveAttribute("href", /journal/);
      await expectDismissButtonInsideSticker(sticker);

      const sidebarBox = await sidebar.boundingBox();
      const stickerBox = await sticker.boundingBox();
      expect(sidebarBox).not.toBeNull();
      expect(stickerBox).not.toBeNull();
      expect(stickerBox!.width).toBeGreaterThanOrEqual(150);
      expect(stickerBox!.x).toBeGreaterThanOrEqual(sidebarBox!.x);
      expect(stickerBox!.x + stickerBox!.width).toBeLessThanOrEqual(sidebarBox!.x + sidebarBox!.width);

      await page.screenshot({
        path: test.info().outputPath(`announcement-desktop-sidebar-${item.locale}-1024.png`),
      });
    });


    test(`long and short event titles fit all sticker placements in ${item.locale}`, async ({ page }) => {
      const stressTitles = item.locale === "en"
        ? ["An Exhibition of Quiet Colour, Memory, and the Spaces Between Seasons", "Open Studio"]
        : ["نمایشگاهی درباره رنگ، خاطره و فاصله‌های میان فصل‌ها و لحظه‌های آرام", "آتلیه باز"];

      const placements = [
        { kind: "viewport", width: 1920, height: 1080, route: `/${item.locale}` },
        { kind: "desktop-sidebar", width: 1024, height: 768, route: `/${item.locale}/works` },
        { kind: "mobile-sidebar", width: 320, height: 700, route: `/${item.locale}/works` },
      ] as const;

      for (const placement of placements) {
        await page.setViewportSize({ width: placement.width, height: placement.height });
        await page.goto(placement.route);
        if (placement.kind === "mobile-sidebar") {
          await page.getByRole("button", { name: item.menuLabel }).click();
        }

        const sticker = placement.kind === "viewport"
          ? page.locator('[data-placement="viewport"]')
          : placement.kind === "desktop-sidebar"
            ? page.locator(".desktop-sidebar [data-placement=\"desktop-sidebar\"]")
            : page.getByRole("dialog", { name: item.menuLabel }).locator('[data-placement="mobile-sidebar"]');

        await expect(sticker).toBeVisible();
        const title = sticker.locator('[data-part="title"]');
        for (const [index, titleText] of stressTitles.entries()) {
          await title.evaluate((element, value) => {
            element.textContent = value;
          }, titleText);
          await expect(title).toBeVisible();
          await expectDismissButtonInsideSticker(sticker);
          await page.screenshot({
            path: test.info().outputPath(`announcement-title-stress-${placement.kind}-${item.locale}-${index === 0 ? "long" : "short"}.png`),
          });
        }
      }
    });

    for (const viewport of [
      { width: 390, height: 844, name: "standard" },
      { width: 360, height: 800, name: "narrow" },
      { width: 320, height: 700, name: "small" },
      { width: 430, height: 932, name: "tall" },
      { width: 768, height: 1024, name: "tablet-portrait" },
      { width: 390, height: 650, name: "short" },
    ]) {
      test(`mobile drawer sticker stays full-size and contained in ${item.locale} at ${viewport.width}x${viewport.height}`, async ({ page }) => {
        await page.setViewportSize({ width: viewport.width, height: viewport.height });
        await page.goto(`/${item.locale}/works`);
        await page.getByRole("button", { name: item.menuLabel }).click();

        const drawer = page.getByRole("dialog", { name: item.menuLabel });
        await expect(drawer).toBeVisible();
        const sticker = drawer.locator('[data-placement="mobile-sidebar"]');
        await expect(sticker).toBeVisible();
        await expect(sticker.locator('[data-part="title"]')).toHaveText(item.title);
        await expect(sticker.locator('[data-part="link"]')).toHaveAttribute("href", /journal/);
        await sticker.scrollIntoViewIfNeeded();
        await expect(sticker).toBeInViewport();
        await expectDismissButtonInsideSticker(sticker);

        const drawerBox = await drawer.boundingBox();
        const stickerBox = await sticker.boundingBox();
        expect(drawerBox).not.toBeNull();
        expect(stickerBox).not.toBeNull();
        expect(stickerBox!.width).toBeGreaterThanOrEqual(190);
        expect(stickerBox!.height).toBeLessThanOrEqual(155);
        expect(stickerBox!.x).toBeGreaterThanOrEqual(drawerBox!.x);
        expect(stickerBox!.x + stickerBox!.width).toBeLessThanOrEqual(drawerBox!.x + drawerBox!.width);

        const hasHorizontalOverflow = await page.evaluate(
          () => document.documentElement.scrollWidth > document.documentElement.clientWidth,
        );
        expect(hasHorizontalOverflow).toBe(false);

        await page.screenshot({
          path: test.info().outputPath(`announcement-mobile-drawer-${item.locale}-${viewport.name}.png`),
        });

        if (viewport.name === "standard") {
          await sticker.getByRole("button", { name: item.dismissLabel }).click();
          await expect(sticker).toBeHidden();
        }

        if (viewport.name === "narrow") {
          await sticker.locator('[data-part="link"]').click();
          await expect(drawer).toBeHidden();
          await expect(page).toHaveURL(new RegExp("/" + item.locale + "/journal/"));
        }
      });
    }
  }
});
