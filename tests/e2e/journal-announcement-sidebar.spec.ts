import { expect, test } from "@playwright/test";

for (const locale of ["en", "fa"] as const) {
  test(`mobile ${locale} navigation includes the localized event sticker above language settings`, async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(`/${locale}/journal`);
    await page.getByRole("button", { name: locale === "en" ? "Open navigation" : "باز کردن راهبری" }).click();
    const drawer = page.getByRole("dialog", { name: locale === "en" ? "Open navigation" : "باز کردن راهبری" });
    await expect(drawer).toBeVisible();
    const sticker = drawer.getByRole("complementary", { name: locale === "en" ? "UPCOMING EXHIBITION" : "نمایشگاه پیشِ رو" });
    await expect(sticker).toBeVisible();
    await expect(sticker.getByRole("link")).toBeVisible();
    const order = await drawer.evaluate((node) => {
      const announcement = node.querySelector("aside[aria-label]");
      const settings = node.querySelector(".drawer-settings");
      return Boolean(announcement && settings && announcement.compareDocumentPosition(settings) & Node.DOCUMENT_POSITION_FOLLOWING);
    });
    expect(order).toBe(true);
    await sticker.getByRole("button", { name: locale === "en" ? "Dismiss exhibition announcement" : "بستن اطلاعیه نمایشگاه" }).click();
    await expect(sticker).toBeHidden();
  });
}

test("desktop announcement close control has no circular button treatment", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 960 });
  await page.goto("/en");
  const close = page.getByRole("button", { name: "Dismiss exhibition announcement" });
  await expect(close).toBeVisible();
  await expect(close).toHaveCSS("border-radius", "0px");
  await expect(close).toHaveCSS("background-color", "rgba(0, 0, 0, 0)");
});
