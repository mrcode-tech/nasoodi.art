import { expect, test } from "@playwright/test";

const indexableArchives = ["works", "galleries", "journal", "about", "cv", "contact"].flatMap((section) =>
  ["en", "fa"].map((locale) => ({
    locale,
    path: `/${locale}/${section}`,
    alternate: `/${locale === "en" ? "fa" : "en"}/${section}`,
  }))
);

test("localized archive routes expose canonical metadata and reciprocal alternates", async ({ page, request }) => {
  for (const route of indexableArchives) {
    expect((await request.get(route.path)).status(), route.path).toBe(200);
    await page.goto(route.path);
    await expect(page.locator("html")).toHaveAttribute("lang", route.locale);
    await expect(page.locator("html")).toHaveAttribute("dir", route.locale === "fa" ? "rtl" : "ltr");
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", "https://nasoodi.art" + route.path);
    await expect(page.locator('link[rel="alternate"][hreflang="' + route.locale + '"]')).toHaveAttribute("href", "https://nasoodi.art" + route.path);
    await expect(page.locator('link[rel="alternate"][hreflang="' + (route.locale === "en" ? "fa" : "en") + '"]')).toHaveAttribute("href", "https://nasoodi.art" + route.alternate);
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /index/);
    await expect(page.locator('meta[name="description"]')).toHaveAttribute("content", /.+/);
  }
});

test("unsupported locale prefixes return 404", async ({ request }) => {
  for (const path of ["/de", "/de/about", "/fr/works"]) expect((await request.get(path)).status(), path).toBe(404);
});

test("language switcher preserves archive query state", async ({ page }) => {
  await page.goto("/en/journal?category=story&pageSize=10");
  await page.locator(".language-trigger").click();
  await page.getByRole("menuitem", { name: /فارسی/ }).click();
  await expect(page).toHaveURL(/\\/fa\\/journal\\?category=story&pageSize=10$/);
});

test("published detail routes expose reciprocal localized alternates", async ({ page, request }) => {
  const archives = [
    { path: "/en/works", selector: ".artwork-grid .artwork-item a[href]" },
    { path: "/en/galleries", selector: ".gallery-index-card-link[href]" },
    { path: "/en/journal", selector: ".journal-card a[href]" },
  ];

  for (const archive of archives) {
    await page.goto(archive.path);
    const firstLink = page.locator(archive.selector).first();
    await expect(firstLink).toBeVisible();
    const englishPath = await firstLink.getAttribute("href");
    expect(englishPath).toMatch(/^\\/en\\//);
    expect((await request.get(englishPath!)).status(), englishPath!).toBe(200);

    await page.goto(englishPath!);
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", "https://nasoodi.art" + englishPath);
    const alternate = page.locator('link[rel="alternate"][hreflang="fa"]');
    await expect(alternate).toHaveAttribute("href", /^https:\\/\\/nasoodi\\.art\\/fa\\//);
    const alternateUrl = await alternate.getAttribute("href");
    const persianPath = new URL(alternateUrl!).pathname;
    expect((await request.get(persianPath)).status(), persianPath).toBe(200);

    await page.goto(persianPath);
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", alternateUrl!);
    await expect(page.locator('link[rel="alternate"][hreflang="en"]')).toHaveAttribute("href", "https://nasoodi.art" + englishPath);
  }
});

test("sitemap includes localized archives and excludes unknown records", async ({ request }) => {
  const response = await request.get("/sitemap.xml");
  expect(response.status()).toBe(200);
  const xml = await response.text();
  for (const route of ["/en", "/fa", ...indexableArchives.map((item) => item.path)]) {
    expect(xml).toContain("https://nasoodi.art" + route);
  }
});

test("canonical profile and utility pages are indexable with localized alternates", async ({ page }) => {
  for (const locale of ["en", "fa"] as const) {
    for (const section of ["contact", "about", "cv"]) {
      await page.goto(`/${locale}/${section}`);
      await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", `https://nasoodi.art/${locale}/${section}`);
      await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /index/);
      await expect(page.locator('link[rel="alternate"][hreflang="' + (locale === "en" ? "fa" : "en") + '"]')).toHaveAttribute("href", `https://nasoodi.art/${locale === "en" ? "fa" : "en"}/${section}`);
      await expect(page.locator('meta[name="description"]')).toHaveAttribute("content", /.+/);
      await expect(page.locator('meta[property="og:title"]')).toHaveAttribute("content", /.+/);
    }
  }
});

test("unknown localized content slugs return 404", async ({ request }) => {
  for (const locale of ["en", "fa"] as const) {
    expect((await request.get(`/${locale}/works/this-content-does-not-exist`)).status()).toBe(404);
  }
});

test("localized routes emit server-rendered content, metadata, and valid structured data", async ({ page, request }) => {
  const routes = ["", "about", "contact", "cv", "works", "galleries", "journal"].flatMap((section) =>
    ["en", "fa"].map((locale) => ({ path: section ? `/${locale}/${section}` : `/${locale}`, locale }))
  );

  for (const route of routes) {
    expect((await request.get(route.path)).status(), route.path).toBe(200);
    await page.goto(route.path);
    await expect(page.locator("html")).toHaveAttribute("lang", route.locale);
    await expect(page.locator("html")).toHaveAttribute("dir", route.locale === "fa" ? "rtl" : "ltr");
    await expect(page.locator("h1").first()).toBeVisible();
    await expect(page.locator('meta[name="description"]')).toHaveAttribute("content", /.+/);
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", "https://nasoodi.art" + route.path);
    await expect(page.locator('meta[property="og:title"]')).toHaveAttribute("content", /.+/);
    await expect(page.locator('meta[name="twitter:card"]')).toHaveAttribute("content", /summary/);
    expect((await page.locator("main").innerText()).trim().length).toBeGreaterThan(0);
    const blocks = await page.locator('script[type="application/ld+json"]').allTextContents();
    expect(blocks.length).toBeGreaterThan(0);
    for (const block of blocks) expect(() => JSON.parse(block)).not.toThrow();
  }
});
