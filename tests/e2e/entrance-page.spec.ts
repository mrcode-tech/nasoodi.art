import { test, expect } from "@playwright/test";
import artworks from "../../src/content/data/artworks.json";
import site from "../../src/content/data/site.json";

const selectedArtwork = artworks.find((artwork) => artwork.id === site.entranceArtworkId);
const selectedImage = selectedArtwork?.images.find((image) => image.role === "primary");

test("root entrance presents its selected published artwork and language links", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveURL("/");
  await expect(page.locator("html")).toHaveAttribute("lang", "en");
  await expect(page.locator("html")).toHaveAttribute("dir", "ltr");
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  const links = page.getByRole("navigation", { name: "Choose language" }).getByRole("link");
  await expect(links).toHaveCount(2);
  await expect(links.nth(0)).toHaveText("Enter");
  await expect(links.nth(0)).toHaveAttribute("href", "/en");
  await expect(links.nth(1)).toHaveText("ورود");
  await expect(links.nth(1)).toHaveAttribute("href", "/fa");
  await expect(links.nth(1)).toHaveAttribute("lang", "fa");
  await expect(links.nth(1)).toHaveAttribute("dir", "rtl");
  expect(selectedImage).toBeDefined();
  const image = page.locator(".entrance-artwork");
  await expect(image).toBeVisible();
  await expect(image).toHaveAttribute("alt", selectedImage!.alt.en);
  expect(decodeURIComponent(await image.getAttribute("src") ?? "")).toContain(selectedImage!.src);
  await expect.poll(() => image.evaluate((node: HTMLImageElement) => node.naturalWidth)).toBeGreaterThan(0);
  await expect(image).toHaveCSS("object-fit", "contain");
});

for (const viewport of [
  { width: 320, height: 568 }, { width: 360, height: 800 }, { width: 390, height: 844 },
  { width: 430, height: 932 }, { width: 768, height: 1024 }, { width: 1024, height: 768 },
  { width: 1280, height: 800 }, { width: 1440, height: 900 }, { width: 1920, height: 1080 },
]) {
  test(`entrance has no horizontal overflow at ${viewport.width}x${viewport.height}`, async ({ page }) => {
    await page.setViewportSize(viewport);
    await page.goto("/");
    const sizes = await page.evaluate(() => ({
      scroll: document.documentElement.scrollWidth,
      client: document.documentElement.clientWidth,
    }));
    expect(sizes.scroll).toBeLessThanOrEqual(sizes.client);
    await expect(page.locator(".entrance-language-links")).toBeVisible();
  });
}

test("artwork is unfiltered in light and dark themes", async ({ page }) => {
  await page.goto("/");
  const image = page.locator(".entrance-artwork");
  await expect(image).toHaveCSS("filter", "none");
  await page.locator("html").evaluate((node) => node.classList.add("dark"));
  await expect(image).toHaveCSS("filter", "none");
  await expect(page.locator(".entrance-page")).toHaveCSS("background-color", "rgb(16, 26, 43)");
});

test("root metadata declares canonical and x-default URLs", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", "https://nasoodi.art");
  await expect(page.locator('link[rel="alternate"][hreflang="x-default"]')).toHaveAttribute("href", "https://nasoodi.art");
});
