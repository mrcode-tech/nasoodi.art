import { expect, test } from "@playwright/test";

const indexableArchives = [
  { locale: "en", path: "/en/works", alternate: "/fa/works" },
  { locale: "fa", path: "/fa/works", alternate: "/en/works" },
  { locale: "en", path: "/en/galleries", alternate: "/fa/galleries" },
  { locale: "fa", path: "/fa/galleries", alternate: "/en/galleries" },
  { locale: "en", path: "/en/journal", alternate: "/fa/journal" },
  { locale: "fa", path: "/fa/journal", alternate: "/en/journal" },
  { locale: "en", path: "/en/about", alternate: "/fa/about" },
  { locale: "fa", path: "/fa/about", alternate: "/en/about" },
  { locale: "en", path: "/en/cv", alternate: "/fa/cv" },
  { locale: "fa", path: "/fa/cv", alternate: "/en/cv" },
  { locale: "en", path: "/en/contact", alternate: "/fa/contact" },
  { locale: "fa", path: "/fa/contact", alternate: "/en/contact" },
];

test("indexable archive routes render localized document metadata and reciprocal alternates", async ({ page, request }) => {
  for (const route of indexableArchives) {
    const response = await request.get(route.path);
    expect(response.status(), route.path).toBe(200);

    await page.goto(route.path);
    await expect(page.locator("html")).toHaveAttribute("lang", route.locale);
    await expect(page.locator("html")).toHaveAttribute("dir", route.locale === "fa" ? "rtl" : "ltr");
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", "https://nasoodi.art" + route.path);
    await expect(page.locator('link[rel="alternate"][hreflang="' + route.locale + '"]'))
      .toHaveAttribute("href", "https://nasoodi.art" + route.path);
    await expect(page.locator('link[rel="alternate"][hreflang="' + (route.locale === "en" ? "fa" : "en") + '"]'))
      .toHaveAttribute("href", "https://nasoodi.art" + route.alternate);
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /index/);
    await expect(page.locator('meta[name="description"]')).toHaveAttribute("content", /.+/);
  }
});

test("unsupported locale prefixes return 404 instead of rendering the default language", async ({ request }) => {
  for (const path of ["/de", "/de/about", "/fr/works"]) {
    expect((await request.get(path)).status(), path).toBe(404);
  }
});

test("language switcher preserves Journal category and page-size state", async ({ page }) => {
  await page.goto("/en/journal?category=story&pageSize=10");
  await page.locator(".language-trigger").click();
  await page.getByRole("menuitem", { name: /فارسی/ }).click();
  await expect(page).toHaveURL(/\/fa\/journal\?category=story&pageSize=10$/);
});

test("published artwork, gallery, and Journal detail alternates resolve to the same content identity", async ({ page, request }) => {
  const pairs = [
    ["/en/works/a-first-light", "/fa/works/" + encodeURIComponent("نخستین-روشنایی")],
    ["/en/galleries/quiet-intervals", "/fa/galleries/quiet-intervals"],
    ["/en/journal/between-layers-studio-notes", "/fa/journal/between-layers-studio-notes"],
  ];

  for (const [englishPath, persianPath] of pairs) {
    expect((await request.get(englishPath)).status(), englishPath).toBe(200);
    expect((await request.get(persianPath)).status(), persianPath).toBe(200);

    await page.goto(englishPath);
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", "https://nasoodi.art" + englishPath);
    await expect(page.locator('link[rel="alternate"][hreflang="fa"]')).toHaveAttribute("href", "https://nasoodi.art" + persianPath);

    await page.goto(persianPath);
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", "https://nasoodi.art" + persianPath);
    await expect(page.locator('link[rel="alternate"][hreflang="en"]')).toHaveAttribute("href", "https://nasoodi.art" + englishPath);
  }
});

test("sitemap lists canonical localized archives and excludes demo or unpublished routes", async ({ request }) => {
  const response = await request.get("/sitemap.xml");
  expect(response.status()).toBe(200);
  const xml = await response.text();

  for (const url of [
    "https://nasoodi.art/en",
    "https://nasoodi.art/fa",
    "https://nasoodi.art/en/works",
    "https://nasoodi.art/fa/works",
    "https://nasoodi.art/en/galleries",
    "https://nasoodi.art/fa/galleries",
    "https://nasoodi.art/en/journal",
    "https://nasoodi.art/fa/journal",
    "https://nasoodi.art/en/about",
    "https://nasoodi.art/fa/about",
    "https://nasoodi.art/en/cv",
    "https://nasoodi.art/fa/cv",
    "https://nasoodi.art/en/contact",
    "https://nasoodi.art/fa/contact",
  ]) expect(xml).toContain(url);

});

test("canonical Contact, About, and CV pages are indexable with localized alternates", async ({ page }) => {
  for (const locale of ["en", "fa"] as const) {
    for (const section of ["contact", "about", "cv"]) {
      await page.goto("/" + locale + "/" + section);
      await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", "https://nasoodi.art/" + locale + "/" + section);
      await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /index/);
      await expect(page.locator('link[rel="alternate"][hreflang="' + (locale === "en" ? "fa" : "en") + '"]')).toHaveAttribute("href", "https://nasoodi.art/" + (locale === "en" ? "fa" : "en") + "/" + section);
      await expect(page.locator('meta[name="description"]')).toHaveAttribute("content", /.+/);
      await expect(page.locator('meta[property="og:title"]')).toHaveAttribute("content", /.+/);
    }
  }
});

test("unknown localized content slugs return a real 404 instead of indexable soft-404 metadata", async ({ request }) => {
  for (const locale of ["en", "fa"] as const) {
    const response = await request.get("/" + locale + "/works/this-content-does-not-exist");
    expect(response.status()).toBe(404);
  }
});


test("rendered HTML serves localized editorial content and metadata for every canonical page type", async ({ page, request }) => {
  const routes = [
    { path: "/en", locale: "en", structuredType: "Person" },
    { path: "/fa", locale: "fa", structuredType: "Person" },
    { path: "/en/about", locale: "en", structuredType: "Person" },
    { path: "/fa/about", locale: "fa", structuredType: "Person" },
    { path: "/en/contact", locale: "en", structuredType: "Person" },
    { path: "/fa/contact", locale: "fa", structuredType: "Person" },
    { path: "/en/galleries", locale: "en", structuredType: "Person" },
    { path: "/fa/galleries", locale: "fa", structuredType: "Person" },
    { path: "/en/works", locale: "en", structuredType: "Person" },
    { path: "/fa/works", locale: "fa", structuredType: "Person" },
    { path: "/en/works/a-first-light", locale: "en", structuredType: "VisualArtwork" },
    { path: "/fa/works/" + encodeURIComponent("نخستین-روشنایی"), locale: "fa", structuredType: "VisualArtwork" },
    { path: "/en/journal", locale: "en", structuredType: "Person" },
    { path: "/fa/journal", locale: "fa", structuredType: "Person" },
    { path: "/en/journal/between-layers-studio-notes", locale: "en", structuredType: "Article" },
    { path: "/fa/journal/between-layers-studio-notes", locale: "fa", structuredType: "Article" },
    { path: "/en/journal/open-studio-colour-and-stillness", locale: "en", structuredType: "Event" },
    { path: "/fa/journal/open-studio-colour-and-stillness", locale: "fa", structuredType: "Event" },
    { path: "/en/galleries/quiet-intervals", locale: "en", structuredType: "CollectionPage" },
    { path: "/fa/galleries/quiet-intervals", locale: "fa", structuredType: "CollectionPage" },
  ];

  for (const route of routes) {
    const response = await request.get(route.path);
    expect(response.status(), route.path).toBe(200);

    await page.goto(route.path);
    await expect(page.locator("html")).toHaveAttribute("lang", route.locale);
    await expect(page.locator("html")).toHaveAttribute("dir", route.locale === "fa" ? "rtl" : "ltr");
    await expect(page.locator("h1").first()).toBeVisible();
    await expect(page.locator('meta[name="description"]')).toHaveAttribute("content", /.+/);
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", "https://nasoodi.art" + route.path);
    await expect(page.locator('meta[property="og:title"]')).toHaveAttribute("content", /.+/);
    await expect(page.locator('meta[name="twitter:card"]')).toHaveAttribute("content", /summary/);

    const renderedText = await page.locator("main").innerText();
    expect(renderedText.trim().length, route.path + " must contain server-rendered editorial text").toBeGreaterThan(30);

    const jsonLd = await page.locator('script[type="application/ld+json"]').allTextContents();
    expect(jsonLd.length, route.path + " must emit structured data").toBeGreaterThan(0);
    const serialized = JSON.stringify(jsonLd.map((value) => JSON.parse(value)));
    expect(serialized).toContain('"@type":"Person"');
    expect(serialized).toContain('"@type":"' + route.structuredType + '"');
  }
});
