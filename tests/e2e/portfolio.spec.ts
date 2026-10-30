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

test("English homepage renders LTR and falls back to the translated home when Works is unpublished", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 960 });
  await page.goto("/en/works");
  await expect(page.locator("html")).toHaveAttribute("lang", "en");
  await expect(page.locator("html")).toHaveAttribute("dir", "ltr");
  await expect(page.getByRole("heading", { name: "Works" })).toBeVisible();
  await page.getByRole("link", { name: "فارسی" }).click();
  await expect(page).toHaveURL(/\/fa$/);
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
  const hiddenCv = await request.get("/fa/cv");
  expect(hiddenCv.status()).toBe(404);
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

test("filtered Journal URLs canonicalize to the localized archive and empty archives stay noindex", async ({ page }) => {
  await page.goto("/en/journal?category=event");
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", /\/en\/journal$/);
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex/);
});

for (const locale of ["en", "fa"] as const) {
  test(`desktop ${locale} navigation keeps the sidebar physically left and follows locale reading direction`, async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 960 });
    await page.goto(`/${locale}`);
    const html = page.locator("html");
    await expect(html).toHaveAttribute("dir", locale === "fa" ? "rtl" : "ltr");
    const sidebar = page.locator(".desktop-sidebar");
    await expect(sidebar).toBeVisible();
    const bounds = await sidebar.boundingBox();
    expect(bounds?.x).toBe(0);
    expect(bounds?.width).toBeGreaterThan(200);
    const firstLink = sidebar.locator(".nav-link").first();
    await expect(firstLink).toHaveAttribute("dir", "auto");
    const direction = await firstLink.evaluate((node) => getComputedStyle(node).direction);
    expect(direction).toBe(locale === "fa" ? "rtl" : "ltr");
    const main = page.locator(".site-main");
    const mainBounds = await main.boundingBox();
    expect(mainBounds?.x).toBeGreaterThanOrEqual((bounds?.width ?? 0) - 1);
    await page.screenshot({ path: test.info().outputPath(`${locale}-desktop-sidebar.png`), fullPage: true });
  });
}
test("Persian mobile navigation drawer enters from physical left and preserves RTL link direction", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/fa");
  await page.getByRole("button", { name: "باز کردن راهبری" }).click();
  const drawer = page.getByRole("dialog", { name: "باز کردن راهبری" });
  await expect(drawer).toBeVisible();
  const bounds = await drawer.boundingBox();
  expect(bounds?.x).toBe(0);
  const firstLink = drawer.locator(".nav-link").first();
  await expect(firstLink).toHaveAttribute("dir", "auto");
  await expect(firstLink).toHaveCSS("direction", "rtl");
});


test("localized public routes expose one main landmark and one page heading", async ({ page }) => {
  for (const locale of ["fa", "en"] as const) {
    for (const section of ["", "works", "galleries", "journal", "about", "contact"]) {
      await page.goto(section ? `/${locale}/${section}` : `/${locale}`);
      await expect(page.locator("html")).toHaveAttribute("lang", locale);
      await expect(page.getByRole("main")).toBeVisible();
      await expect(page.locator("main h1")).toHaveCount(1);
    }
  }
});

test("skip link is the first keyboard destination and becomes visible on focus", async ({ page }) => {
  await page.goto("/en");
  await page.keyboard.press("Tab");
  const skip = page.getByRole("link", { name: "Skip to content" });
  await expect(skip).toBeFocused();
  await expect(skip).toBeInViewport();
});

test("homepage has no horizontal overflow at small mobile, tablet, or compact desktop widths", async ({ page }) => {
  for (const locale of ["fa", "en"] as const) {
    for (const width of [320, 360, 390, 768, 1024]) {
      await page.setViewportSize({ width, height: 800 });
      await page.goto(`/${locale}`);
      const dimensions = await page.evaluate(() => ({
        viewport: document.documentElement.clientWidth,
        document: document.documentElement.scrollWidth,
      }));
      expect(dimensions.document, `${locale} at ${width}px`).toBeLessThanOrEqual(dimensions.viewport);
    }
  }
});
