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
  await expect(page.locator(".entrance-welcome")).toHaveText("Welcome to my world of painting.");
  await expect(page.locator(".entrance-copy h1").locator("..").locator(".entrance-welcome")).toBeVisible();
  await expect(page.getByText("Discover paintings, stories, and artistic expressions.", { exact: false })).toHaveCount(0);
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
  test(`entrance has no overflow at ${viewport.width}x${viewport.height}`, async ({ page }) => {
    await page.setViewportSize(viewport);
    await page.goto("/");
    const sizes = await page.evaluate(() => ({
      scrollWidth: document.documentElement.scrollWidth,
      clientWidth: document.documentElement.clientWidth,
      scrollHeight: document.documentElement.scrollHeight,
      clientHeight: document.documentElement.clientHeight,
      bodyScrollHeight: document.body.scrollHeight,
      viewportHeight: window.innerHeight,
      entranceBottom: document.querySelector(".entrance-page")?.getBoundingClientRect().bottom ?? 0,
    }));
    expect(sizes.scrollWidth).toBeLessThanOrEqual(sizes.clientWidth);
    if (viewport.width <= 430) {
      expect(sizes.scrollHeight).toBeLessThanOrEqual(sizes.clientHeight);
      expect(sizes.bodyScrollHeight).toBeLessThanOrEqual(sizes.viewportHeight);
      expect(sizes.entranceBottom).toBeLessThanOrEqual(sizes.viewportHeight);
    }
    await expect(page.locator(".entrance-language-links")).toBeVisible();
  });
}

test("mobile entrance separates the artwork from a centered two-line artist name", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  const firstLine = page.locator(".entrance-name-first");
  const secondLine = page.locator(".entrance-name-rest");
  await expect(firstLine).toBeVisible();
  await expect(secondLine).toBeVisible();
  const layout = await page.evaluate(() => {
    const image = document.querySelector(".entrance-artwork")!.getBoundingClientRect();
    const first = document.querySelector(".entrance-name-first")!.getBoundingClientRect();
    const second = document.querySelector(".entrance-name-rest")!.getBoundingClientRect();
    const heading = document.querySelector(".entrance-copy h1")!.getBoundingClientRect();
    return {
      imageToNameGap: first.top - image.bottom,
      firstLineCenter: first.left + first.width / 2,
      secondLineCenter: second.left + second.width / 2,
      headingCenter: heading.left + heading.width / 2,
      firstLineTop: first.top,
      secondLineTop: second.top,
    };
  });
  expect(layout.imageToNameGap).toBeGreaterThanOrEqual(16);
  expect(layout.secondLineTop).toBeGreaterThan(layout.firstLineTop);
  expect(Math.abs(layout.firstLineCenter - layout.headingCenter)).toBeLessThanOrEqual(1);
  expect(Math.abs(layout.secondLineCenter - layout.headingCenter)).toBeLessThanOrEqual(1);
});

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
