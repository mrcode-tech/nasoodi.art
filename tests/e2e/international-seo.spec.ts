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

test("published artwork, gallery, and Journal detail alternates resolve to the same content identity", async ({ page, request }) => {
  const pairs = [
    ["/en/works/a-quiet-place-between-seasons", "/fa/works/a-quiet-place-between-seasons"],
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
  ]) expect(xml).toContain(url);

  for (const forbidden of ["/en/contact", "/fa/contact"]) {
    expect(xml).not.toContain("https://nasoodi.art" + forbidden);
  }
});

test("Contact remains noindex while canonical About and CV pages are indexable", async ({ page }) => {
  for (const locale of ["en", "fa"] as const) {
    await page.goto("/" + locale + "/contact");
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", "https://nasoodi.art/" + locale + "/contact");
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex/);
    await expect(page.locator('link[rel="alternate"][hreflang]')).toHaveCount(0);
    await expect(page.locator('meta[property^="og:"]')).toHaveCount(0);
    await expect(page.locator('meta[name^="twitter:"]')).toHaveCount(0);

    for (const section of ["about", "cv"]) {
      await page.goto("/" + locale + "/" + section);
      await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /index/);
      await expect(page.locator('link[rel="alternate"][hreflang="' + (locale === "en" ? "fa" : "en") + '"]')).toHaveAttribute("href", "https://nasoodi.art/" + (locale === "en" ? "fa" : "en") + "/" + section);
    }
  }
});

test("unknown localized content slugs return a real 404 instead of indexable soft-404 metadata", async ({ request }) => {
  for (const locale of ["en", "fa"] as const) {
    const response = await request.get("/" + locale + "/works/this-content-does-not-exist");
    expect(response.status()).toBe(404);
  }
});
