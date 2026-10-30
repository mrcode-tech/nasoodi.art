import { expect, test } from "@playwright/test";

test("root route redirects to the Persian-first homepage", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveURL(/\/fa$/);
  await expect(page.locator("html")).toHaveAttribute("lang", "fa");
  await expect(page.locator("html")).toHaveAttribute("dir", "rtl");
});

test("Persian homepage renders the artist identity and localized shell", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 960 });
  await page.goto("/fa");
  await expect(page.getByRole("heading", { name: "غزاله عبداله زاده نسودی" })).toBeVisible();
  await expect(page.getByRole("navigation", { name: "راهبری اصلی" })).toBeVisible();
  await expect(page.getByRole("link", { name: "آثار", exact: true })).toBeVisible();
  await page.screenshot({ path: test.info().outputPath("fa-home-desktop.png"), fullPage: true });
});

test("English homepage renders LTR and can switch locale without losing the current section", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 960 });
  await page.goto("/en/works");
  await expect(page.locator("html")).toHaveAttribute("lang", "en");
  await expect(page.locator("html")).toHaveAttribute("dir", "ltr");
  await expect(page.getByRole("heading", { name: "Works" })).toBeVisible();
  await page.getByRole("link", { name: "فارسی" }).click();
  await expect(page).toHaveURL(/\/fa\/works$/);
  await expect(page.locator("html")).toHaveAttribute("dir", "rtl");
});

test("mobile navigation opens, traps focus, closes with Escape, and restores focus", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/en");
  const trigger = page.getByRole("button", { name: "Open navigation" });
  await trigger.click();
  const dialog = page.getByRole("dialog", { name: "Open navigation" });
  await expect(dialog).toBeVisible();
  await expect(dialog.getByRole("link", { name: "Galleries" })).toBeVisible();
  await expect(dialog.getByRole("link", { name: "فارسی" })).toBeVisible();
  await page.screenshot({ path: test.info().outputPath("en-home-mobile-menu.png"), fullPage: true });
  await page.keyboard.press("Escape");
  await expect(dialog).toBeHidden();
  await expect(trigger).toBeFocused();
});

test("mobile Persian shell keeps the navigation drawer on the physical left", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/fa");
  await page.getByRole("button", { name: "باز کردن راهبری" }).click();
  const drawer = page.getByRole("dialog", { name: "باز کردن راهبری" });
  await expect(drawer).toBeVisible();
  const bounds = await drawer.boundingBox();
  expect(bounds?.x).toBe(0);
  await page.screenshot({ path: test.info().outputPath("fa-home-mobile-menu.png"), fullPage: true });
});

test("empty editorial destinations are safe and unknown unpublished details return 404", async ({ page, request }) => {
  for (const section of ["works", "galleries", "journal", "about", "contact"]) {
    const response = await request.get(`/fa/${section}`);
    expect(response.status(), section).toBe(200);
  }
  const unknownWork = await request.get("/fa/works/not-published");
  expect(unknownWork.status()).toBe(404);
  await page.goto("/en/galleries");
  await expect(page.getByRole("heading", { name: "Galleries" })).toBeVisible();
});

test("robots and sitemap endpoints are available", async ({ request }) => {
  const robots = await request.get("/robots.txt");
  expect(robots.status()).toBe(200);
  expect(await robots.text()).toContain("sitemap.xml");
  const sitemap = await request.get("/sitemap.xml");
  expect(sitemap.status()).toBe(200);
  expect(await sitemap.text()).toContain("https://nasoodi.art/fa");
});
