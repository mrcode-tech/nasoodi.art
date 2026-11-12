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

  const belowImage = await page.evaluate(() => {
    const image = document.querySelector(".entrance-artwork")!.getBoundingClientRect();
    const copy = document.querySelector(".entrance-copy")!.getBoundingClientRect();
    const buttons = document.querySelector(".entrance-language-links")!.getBoundingClientRect();
    const link = document.querySelector(".entrance-language-links a")!;
    const style = getComputedStyle(link);
    return {
      copyBelowImage: copy.top > image.bottom,
      buttonsBelowImage: buttons.top > image.bottom,
      buttonsBelowWelcome: buttons.top > document.querySelector(".entrance-welcome")!.getBoundingClientRect().bottom,
      backdropFilter: style.backdropFilter,
    };
  });
  expect(belowImage.copyBelowImage).toBe(true);
  expect(belowImage.buttonsBelowImage).toBe(true);
  expect(belowImage.buttonsBelowWelcome).toBe(true);
  expect(belowImage.backdropFilter).toBe("none");
});

test("desktop entrance displays the complete artwork inside an even page margin", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/");
  const geometry = await page.evaluate(() => {
    const pageBox = document.querySelector(".entrance-page")!.getBoundingClientRect();
    const frame = document.querySelector(".entrance-artwork-frame")!.getBoundingClientRect();
    const image = document.querySelector(".entrance-artwork") as HTMLImageElement;
    const imageBox = image.getBoundingClientRect();
    const style = getComputedStyle(image);
    return {
      naturalRatio: image.naturalWidth / image.naturalHeight,
      renderedRatio: imageBox.width / imageBox.height,
      imageInsideFrame:
        imageBox.left >= frame.left - 1 &&
        imageBox.right <= frame.right + 1 &&
        imageBox.top >= frame.top - 1 &&
        imageBox.bottom <= frame.bottom + 1,
      frameInsidePage:
        frame.left >= pageBox.left &&
        frame.right <= pageBox.right &&
        frame.top >= pageBox.top &&
        frame.bottom <= pageBox.bottom,
      objectFit: style.objectFit,
      frameOverflow: getComputedStyle(document.querySelector(".entrance-artwork-frame")!).overflow,
    };
  });
  expect(geometry.objectFit).toBe("contain");
  expect(geometry.renderedRatio).toBeCloseTo(geometry.naturalRatio, 2);
  expect(geometry.imageInsideFrame).toBe(true);
  expect(geometry.frameInsidePage).toBe(true);
  expect(geometry.frameOverflow).toBe("visible");
});

test("entrance switches layouts only at the viewport width breakpoint", async ({ page }) => {
  await page.setViewportSize({ width: 480, height: 900 });
  await page.goto("/");
  const mobileGeometry = await page.evaluate(() => {
    const image = document.querySelector(".entrance-artwork")!.getBoundingClientRect();
    const copy = document.querySelector(".entrance-copy")!.getBoundingClientRect();
    return {
      copyBelowImage: copy.top >= image.bottom,
      copyPosition: getComputedStyle(document.querySelector(".entrance-copy")!).position,
    };
  });
  expect(mobileGeometry.copyBelowImage).toBe(true);
  expect(mobileGeometry.copyPosition).toBe("static");

  await page.setViewportSize({ width: 481, height: 900 });
  const desktopGeometry = await page.evaluate(() => {
    const image = document.querySelector(".entrance-artwork")!.getBoundingClientRect();
    const copy = document.querySelector(".entrance-copy")!.getBoundingClientRect();
    const frame = document.querySelector(".entrance-artwork-frame")!.getBoundingClientRect();
    return {
      copyOverlaysImage: copy.top >= image.top && copy.bottom <= image.bottom,
      copyPosition: getComputedStyle(document.querySelector(".entrance-copy")!).position,
      frameWidth: frame.width,
      pageWidth: document.querySelector(".entrance-page")!.clientWidth,
      imageInsideFrame: image.left >= frame.left && image.right <= frame.right &&
        image.top >= frame.top && image.bottom <= frame.bottom,
    };
  });
  expect(desktopGeometry.copyOverlaysImage).toBe(true);
  expect(desktopGeometry.copyPosition).toBe("absolute");
  expect(desktopGeometry.frameWidth).toBeGreaterThan(desktopGeometry.pageWidth * .75);
  expect(desktopGeometry.imageInsideFrame).toBe(true);
});

test("artwork is unfiltered in light and dark themes", async ({ page }) => {
  await page.goto("/");
  const image = page.locator(".entrance-artwork");
  await expect(image).toHaveCSS("filter", "none");
  await page.locator("html").evaluate((node) => node.classList.add("dark"));
  await expect(image).toHaveCSS("filter", "none");
  await expect(page.locator(".entrance-page")).toHaveCSS("background-color", "rgb(16, 26, 43)");
});


test("desktop entrance keeps the complete artwork contained at responsive viewport sizes", async ({ page }) => {
  for (const viewport of [{ width: 481, height: 900 }, { width: 1024, height: 768 }, { width: 1440, height: 700 }, { width: 1920, height: 1080 }]) {
    await page.setViewportSize(viewport);
    await page.goto("/");
    const geometry = await page.evaluate(() => {
      const frame = document.querySelector(".entrance-artwork-frame")!.getBoundingClientRect();
      const image = document.querySelector(".entrance-artwork") as HTMLImageElement;
      const style = getComputedStyle(image);
      const title = document.querySelector(".entrance-copy h1")!.getBoundingClientRect();
      const buttons = document.querySelector(".entrance-language-links")!.getBoundingClientRect();
      const imageBox = image.getBoundingClientRect();
      return {
        objectFit: style.objectFit,
        loaded: image.complete && image.naturalWidth > 0 && image.naturalHeight > 0,
        imageInsideFrame: imageBox.left >= frame.left && imageBox.right <= frame.right &&
          imageBox.top >= frame.top && imageBox.bottom <= frame.bottom,
        titleInsideFrame: title.top >= frame.top && title.bottom <= frame.bottom,
        buttonsInsideFrame: buttons.top >= frame.top && buttons.bottom <= frame.bottom,
      };
    });
    expect(geometry.objectFit).toBe("contain");
    expect(geometry.loaded).toBe(true);
    expect(geometry.imageInsideFrame).toBe(true);
    expect(geometry.titleInsideFrame).toBe(true);
    expect(geometry.buttonsInsideFrame).toBe(true);
  }
});

test("root metadata declares canonical and x-default URLs", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", "https://nasoodi.art");
  await expect(page.locator('link[rel="alternate"][hreflang="x-default"]')).toHaveAttribute("href", "https://nasoodi.art");
});
test("desktop entrance typography overlays the artwork with fixed light colors in both themes", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/");
  const heading = page.locator(".entrance-copy h1");
  const welcome = page.locator(".entrance-welcome");
  const image = page.locator(".entrance-artwork");
  const links = page.locator(".entrance-language-links");
  const lightButtonStyles = await links.evaluate((node) => {
    const first = getComputedStyle(node.querySelector("a")!);
    return { color: first.color, backgroundColor: first.backgroundColor, borderColor: first.borderColor };
  });
  const lightTextStyles = await page.evaluate(() => ({
    heading: getComputedStyle(document.querySelector(".entrance-copy h1")!).color,
    welcome: getComputedStyle(document.querySelector(".entrance-welcome")!).color,
  }));
  const geometry = await page.evaluate(() => {
    const frame = document.querySelector(".entrance-artwork-frame")!.getBoundingClientRect();
    const title = document.querySelector(".entrance-copy h1")!.getBoundingClientRect();
    const intro = document.querySelector(".entrance-welcome")!.getBoundingClientRect();
    return {
      titleWithinImageHeight: title.top >= frame.top && title.bottom <= frame.bottom,
      welcomeWithinImageHeight: intro.top >= frame.top && intro.bottom <= frame.bottom,
      titleCenter: title.left + title.width / 2,
      frameCenter: frame.left + frame.width / 2,
      welcomeBelowTitle: intro.top >= title.bottom,
    };
  });
  expect(geometry.titleWithinImageHeight).toBe(true);
  expect(geometry.welcomeWithinImageHeight).toBe(true);
  expect(geometry.welcomeBelowTitle).toBe(true);
  expect(Math.abs(geometry.titleCenter - geometry.frameCenter)).toBeLessThanOrEqual(1);
  await page.locator("html").evaluate((node) => node.classList.add("dark"));
  await expect(heading).toHaveCSS("color", lightTextStyles.heading);
  await expect(welcome).toHaveCSS("color", lightTextStyles.welcome);
  const darkButtonStyles = await links.evaluate((node) => {
    const first = getComputedStyle(node.querySelector("a")!);
    return { color: first.color, backgroundColor: first.backgroundColor, borderColor: first.borderColor };
  });
  expect(darkButtonStyles).not.toEqual(lightButtonStyles);
  await expect(image).toBeVisible();
});

test("desktop entrance overlay remains anchored to the artwork frame at different zoom levels", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/");
  for (const zoom of ["80%", "100%", "125%", "150%"]) {
    await page.evaluate((value) => { document.documentElement.style.zoom = value; }, zoom);
    const bounds = await page.evaluate(() => {
      const frame = document.querySelector(".entrance-artwork-frame")!.getBoundingClientRect();
      const title = document.querySelector(".entrance-copy h1")!.getBoundingClientRect();
      const welcome = document.querySelector(".entrance-welcome")!.getBoundingClientRect();
      const buttons = document.querySelector(".entrance-language-links")!.getBoundingClientRect();
      return {
        titleInside: title.top >= frame.top && title.bottom <= frame.bottom,
        welcomeInside: welcome.top >= frame.top && welcome.bottom <= frame.bottom,
        buttonsInside: buttons.top >= frame.top && buttons.bottom <= frame.bottom,
        ordered: title.top < welcome.top && welcome.bottom < buttons.top,
      };
    });
    expect(bounds.titleInside, `heading at zoom ${zoom}`).toBe(true);
    expect(bounds.welcomeInside, `welcome at zoom ${zoom}`).toBe(true);
    expect(bounds.buttonsInside, `buttons at zoom ${zoom}`).toBe(true);
    expect(bounds.ordered, `vertical order at zoom ${zoom}`).toBe(true);
  }
  await page.evaluate(() => { document.documentElement.style.zoom = ""; });
});

test("mobile entrance uses overlay colors only while copy and controls overlap the artwork", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");

  const styles = () => page.evaluate(() => {
    const heading = getComputedStyle(document.querySelector(".entrance-copy h1")!);
    const welcome = getComputedStyle(document.querySelector(".entrance-welcome")!);
    const button = getComputedStyle(document.querySelector(".entrance-language-links a")!);
    return {
      overlay: document.querySelector(".entrance-page")!.hasAttribute("data-entrance-overlay"),
      heading: heading.color,
      welcome: welcome.color,
      buttonColor: button.color,
      buttonBackground: button.backgroundColor,
      buttonBackdrop: button.backdropFilter,
    };
  });

  const themeStyles = await styles();
  expect(themeStyles.overlay).toBe(false);
  expect(themeStyles.heading).not.toBe("rgb(234, 228, 217)");
  expect(themeStyles.welcome).not.toBe("rgb(185, 181, 174)");
  expect(themeStyles.buttonBackdrop).toBe("none");

  await page.locator(".entrance-copy").evaluate((node) => {
    (node as HTMLElement).style.transform = "translateY(-180px)";
  });
  await page.evaluate(() => window.dispatchEvent(new Event("resize")));
  await expect.poll(async () => (await styles()).overlay).toBe(true);

  const overlayStyles = await styles();
  expect(overlayStyles.heading).toBe("rgb(234, 228, 217)");
  expect(overlayStyles.welcome).toBe("rgb(185, 181, 174)");
  expect(overlayStyles.buttonBackdrop).not.toBe("none");
  expect(overlayStyles.buttonBackground).not.toBe("rgba(0, 0, 0, 0)");

  await page.locator(".entrance-copy").evaluate((node) => {
    (node as HTMLElement).style.transform = "";
  });
  await page.evaluate(() => window.dispatchEvent(new Event("resize")));
  await expect.poll(async () => (await styles()).overlay).toBe(false);
  expect((await styles()).heading).toBe(themeStyles.heading);
});
