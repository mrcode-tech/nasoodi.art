import { expect, test } from "@playwright/test";
import { archiveItemLinks } from "./helpers/archive";

const locales = ["en", "fa"] as const;
const archives = ["works", "galleries", "journal", "about", "cv", "contact"] as const;

test("localized routes expose canonical metadata and reciprocal language alternates", async ({ page, request }) => {
  for (const locale of locales) {
    for (const section of archives) {
      const path = "/" + locale + "/" + section;
      expect((await request.get(path)).status(), path).toBe(200);
      await page.goto(path);
      await expect(page.locator("html")).toHaveAttribute("lang", locale);
      await expect(page.locator("html")).toHaveAttribute("dir", locale === "fa" ? "rtl" : "ltr");
      await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", "https://nasoodi.art" + path);
      await expect(page.locator('link[rel="alternate"][hreflang="' + locale + '"]'))
        .toHaveAttribute("href", "https://nasoodi.art" + path);
      const alternateLocale = locale === "en" ? "fa" : "en";
      await expect(page.locator('link[rel="alternate"][hreflang="' + alternateLocale + '"]'))
        .toHaveAttribute("href", "https://nasoodi.art/" + alternateLocale + "/" + section);
      await expect(page.locator('meta[name="description"]')).toHaveAttribute("content", /.+/);
      await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /index/);
      if (section === "cv") {
        const openGraphTitle = await page.locator('meta[property="og:title"]').getAttribute("content");
        const description = await page.locator('meta[name="description"]').getAttribute("content");
        expect(openGraphTitle).toBeTruthy();
        expect(description).toBeTruthy();
        await expect(page.locator('meta[name="twitter:title"]')).toHaveAttribute("content", openGraphTitle!);
        await expect(page.locator('meta[property="og:description"]')).toHaveAttribute("content", description!);
        await expect(page.locator('meta[name="twitter:description"]')).toHaveAttribute("content", description!);
        await expect(page.locator('meta[name="keywords"]')).toHaveCount(0);
        await expect(page.locator('meta[name="description"]')).toHaveCount(1);
        await expect(page.locator('meta[property="og:description"]')).toHaveCount(1);
        await expect(page.locator('meta[name="twitter:description"]')).toHaveCount(1);
        if (locale === "fa") expect(description).toMatch(/[\u0600-\u06FF]/);
        else expect(description).not.toMatch(/[\u0600-\u06FF]/);
      }
    }
  }
});

test("language switcher preserves supported archive query parameters", async ({ page }) => {
  await page.goto("/en/journal?category=story&pageSize=10");
  await page.locator(".language-trigger").click();
  await page.getByRole("menuitem", { name: /فارسی/ }).click();
  await expect(page).toHaveURL((url) =>
    url.pathname === "/fa/journal" &&
    url.searchParams.get("category") === "story" &&
    url.searchParams.get("pageSize") === "10"
  );
});

test("published detail routes expose reciprocal localized alternates", async ({ page, request }) => {
  for (const section of ["works", "galleries", "journal"] as const) {
    await page.goto("/en/" + section);
    const link = archiveItemLinks(page, section).first();
    await expect(link).toBeVisible();
    const englishPath = await link.getAttribute("href");
    expect(englishPath).toMatch(new RegExp("^/en/" + section + "/[^/?]+"));
    expect((await request.get(englishPath!)).status()).toBe(200);

    const englishCanonical = "https://nasoodi.art" + new URL(englishPath!, "https://nasoodi.art").pathname;
    await page.goto(englishPath!);
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", englishCanonical);
    await expect(page.locator('link[rel="canonical"]')).not.toHaveAttribute("href", /returnTo=/);
    const persianAlternate = await page.locator('link[rel="alternate"][hreflang="fa"]').getAttribute("href");
    expect(persianAlternate).toMatch(new RegExp("^https://nasoodi\\.art/fa/" + section + "/"));
    const persianPath = new URL(persianAlternate!).pathname;
    expect((await request.get(persianPath)).status()).toBe(200);

    await page.goto(persianPath);
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", persianAlternate!);
    await expect(page.locator('link[rel="alternate"][hreflang="en"]'))
      .toHaveAttribute("href", englishCanonical);
  }
});

test("unsupported locale prefixes and unknown detail slugs return 404", async ({ request }) => {
  for (const path of ["/de", "/de/about", "/fr/works"]) {
    expect((await request.get(path)).status(), path).toBe(404);
  }
  for (const locale of locales) {
    expect((await request.get("/" + locale + "/works/unknown-test-record")).status()).toBe(404);
  }
});

test("sitemap and robots endpoints are available and internally consistent", async ({ request }) => {
  const robots = await request.get("/robots.txt");
  expect(robots.status()).toBe(200);
  expect(await robots.text()).toMatch(/sitemap\.xml/);

  const sitemap = await request.get("/sitemap.xml");
  expect(sitemap.status()).toBe(200);
  const xml = await sitemap.text();
  expect(xml).toContain("<urlset");
  for (const locale of locales) {
    expect(xml).toContain("https://nasoodi.art/" + locale);
    for (const section of archives) expect(xml).toContain("https://nasoodi.art/" + locale + "/" + section);
  }
});

test("server-rendered routes provide valid metadata and structured data", async ({ page }) => {
  for (const locale of locales) {
    for (const section of ["", ...archives]) {
      const path = section ? "/" + locale + "/" + section : "/" + locale;
      await page.goto(path);
      await expect(page.locator("html")).toHaveAttribute("lang", locale);
      await expect(page.getByRole("main")).toBeVisible();
      await expect(page.getByRole("heading", { level: 1 })).toHaveCount(1);
      await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", "https://nasoodi.art" + path);
      await expect(page.locator('meta[name="description"]')).toHaveAttribute("content", /.+/);
      await expect(page.locator('meta[property="og:title"]')).toHaveAttribute("content", /.+/);
      const structuredData = await page.locator('script[type="application/ld+json"]').allTextContents();
      expect(structuredData.length).toBeGreaterThan(0);
      for (const value of structuredData) expect(() => JSON.parse(value)).not.toThrow();
    }
  }
});
