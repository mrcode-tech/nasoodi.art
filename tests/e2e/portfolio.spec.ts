import { expect, test, type Locator } from "@playwright/test";

/** Wait for the drawer's real CSS transition; geometry is meaningful only at rest. */
async function waitForDrawerToSettle(drawer: Locator) {
  await drawer.evaluate(async (element) => {
    const transitions = element.getAnimations();
    await Promise.all(transitions.map((transition) => transition.finished.catch(() => undefined)));
  });
}

test("root route redirects to the Persian-first homepage", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveURL(/\/fa$/);
  await expect(page.locator("html")).toHaveAttribute("lang", "fa");
  await expect(page.locator("html")).toHaveAttribute("dir", "rtl");
});

test("Persian homepage renders the artist identity and right-anchored RTL shell", async ({ page }) => {
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
  await page.getByRole("button", { name: "Language" }).click();
  await page.getByRole("menuitem", { name: /فارسی/ }).click();
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

test("mobile Persian shell keeps the navigation drawer on the physical right", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/fa");
  await page.getByRole("button", { name: "باز کردن راهبری" }).click();
  const drawer = page.getByRole("dialog", { name: "باز کردن راهبری" });
  await expect(drawer).toBeVisible();
  await waitForDrawerToSettle(drawer);
  const bounds = await drawer.boundingBox();
  expect(bounds?.x).toBe(390 - (bounds?.width ?? 0));
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
  const sitemapText = await sitemap.text();
  expect(sitemapText).toContain("https://nasoodi.art/fa");
  expect(sitemapText).not.toContain("https://nasoodi.art/fa/about");
  expect(sitemapText).not.toContain("https://nasoodi.art/en/about");
  expect(sitemapText).not.toContain("https://nasoodi.art/fa/contact");
  expect(sitemapText).not.toContain("https://nasoodi.art/en/contact");
});

test("filtered Journal URLs canonicalize to the localized archive and empty archives stay noindex", async ({ page }) => {
  await page.goto("/en/journal?category=event");
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", /\/en\/journal$/);
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex/);
});

for (const locale of ["en", "fa"] as const) {
  test(`desktop ${locale} navigation mirrors sidebar placement and follows locale reading direction`, async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 960 });
    await page.goto(`/${locale}`);
    const html = page.locator("html");
    await expect(html).toHaveAttribute("dir", locale === "fa" ? "rtl" : "ltr");
    const sidebar = page.locator(".desktop-sidebar");
    await expect(sidebar).toBeVisible();
    const bounds = await sidebar.boundingBox();
    expect(bounds?.x).toBe(locale === "fa" ? 1440 - (bounds?.width ?? 0) : 0);
    expect(bounds?.width).toBeGreaterThan(200);
    const firstLink = sidebar.locator(".nav-link").first();
    await expect(firstLink).toHaveAttribute("dir", locale === "fa" ? "rtl" : "ltr");
    const direction = await firstLink.evaluate((node) => getComputedStyle(node).direction);
    expect(direction).toBe(locale === "fa" ? "rtl" : "ltr");
    await expect(sidebar.locator("nav")).toHaveAttribute("dir", locale === "fa" ? "rtl" : "ltr");
    await expect(sidebar.locator(".nav-link").first()).toHaveCSS("text-align", locale === "fa" ? "right" : "start");
    await expect(sidebar.locator(".sidebar-footer")).toHaveCSS("direction", locale === "fa" ? "rtl" : "ltr");
    if (locale === "fa") {
      const navBox = await firstLink.boundingBox();
      const sidebarBox = bounds!;
      expect(navBox!.x + navBox!.width).toBeGreaterThan(sidebarBox.x + sidebarBox.width / 2);
    }
    const main = page.locator(".site-main");
    const mainBounds = await main.boundingBox();
    expect(mainBounds?.x).toBe(locale === "fa" ? 0 : (bounds?.width ?? 0));
    expect(mainBounds?.width).toBeLessThanOrEqual(1440 - (bounds?.width ?? 0) + 1);
    const utilityLocator = page.locator(".desktop-utility");
    const utility = await utilityLocator.boundingBox();
    expect(utility).not.toBeNull();
    await expect(utilityLocator).toHaveCSS("position", "fixed");
    const utilityStyle = await utilityLocator.evaluate((node) => getComputedStyle(node));
    expect(utilityStyle.backgroundColor).not.toBe("rgba(0, 0, 0, 0)");
    expect(utilityStyle.backgroundColor).not.toBe("transparent");
    expect(utility?.y).toBe(0);
    expect(utility?.height).toBeGreaterThanOrEqual(75);
    const contentBounds = await page.locator("main#main-content").boundingBox();
    expect(contentBounds?.y).toBeGreaterThanOrEqual((utility?.y ?? 0) + (utility?.height ?? 0));
    if (locale === "fa") {
      expect((utility?.x ?? 0)).toBe(0);
      await expect(utilityLocator).toHaveCSS("direction", "ltr");
    } else {
      expect((utility?.x ?? 0)).toBeGreaterThan(1440 - (bounds?.width ?? 0) - 220);
    }
    await page.screenshot({ path: test.info().outputPath(`${locale}-desktop-sidebar.png`), fullPage: true });
  });
}
test("Persian mobile navigation drawer enters from physical right and preserves RTL link direction", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/fa");
  await page.getByRole("button", { name: "باز کردن راهبری" }).click();
  const drawer = page.getByRole("dialog", { name: "باز کردن راهبری" });
  await expect(drawer).toBeVisible();
  await waitForDrawerToSettle(drawer);
  const bounds = await drawer.boundingBox();
  expect(bounds?.x).toBe(390 - (bounds?.width ?? 0));
  const firstLink = drawer.locator(".nav-link").first();
  await expect(firstLink).toHaveAttribute("dir", "rtl");
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

test("empty About and Contact routes stay available but are not indexable", async ({ page }) => {
  for (const locale of ["fa", "en"] as const) {
    for (const section of ["about", "contact"]) {
      await page.goto(`/${locale}/${section}`);
      await expect(page.getByRole("main")).toBeVisible();
      await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex/);
    }
  }
});

test("production routes include baseline browser security headers", async ({ request }) => {
  const response = await request.get("/en");
  expect(response.status()).toBe(200);
  const headers = response.headers();
  expect(headers["x-content-type-options"]).toBe("nosniff");
  expect(headers["x-frame-options"]).toBe("DENY");
  expect(headers["referrer-policy"]).toBe("strict-origin-when-cross-origin");
  expect(headers["permissions-policy"]).toContain("camera=()");
  expect(headers["strict-transport-security"]).toContain("max-age=31536000");
});

test("mobile navigation is above the fixed header and closes when crossing into desktop layout", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/fa");
  const header = page.locator(".mobile-header");
  const trigger = header.getByRole("button", { name: "باز کردن راهبری" });
  await expect(header).toBeVisible();
  await trigger.click();
  const drawer = page.getByRole("dialog", { name: "باز کردن راهبری" });
  await expect(drawer).toBeVisible();
  await expect(drawer.getByRole("button", { name: "بستن راهبری" })).toBeVisible();
  await expect(drawer.getByRole("button", { name: "بستن راهبری" })).toBeInViewport();
  const layering = await page.evaluate(() => {
    const headerElement = document.querySelector(".mobile-header")!;
    const drawerElement = document.querySelector("#mobile-navigation")!;
    const closeElement = drawerElement.querySelector(".drawer-close")!;
    return {
      headerZ: Number.parseInt(getComputedStyle(headerElement).zIndex, 10),
      drawerZ: Number.parseInt(getComputedStyle(drawerElement).zIndex, 10),
      closeTop: closeElement.getBoundingClientRect().top,
      drawerTop: drawerElement.getBoundingClientRect().top,
    };
  });
  expect(layering.drawerZ).toBeGreaterThan(layering.headerZ);
  expect(layering.closeTop).toBeGreaterThanOrEqual(layering.drawerTop);

  await page.setViewportSize({ width: 1280, height: 800 });
  await expect(page.locator(".desktop-sidebar")).toBeVisible();
  await expect(page.locator(".mobile-header")).toBeHidden();
  await expect(page.locator("#mobile-navigation")).toBeHidden();

  await page.setViewportSize({ width: 390, height: 844 });
  await expect(page.locator(".mobile-header")).toBeVisible();
  await expect(page.locator(".desktop-sidebar")).toBeHidden();
  await expect(page.locator("#mobile-navigation")).toHaveCount(0);
});

test("mobile drawer closes through its close control and restores focus", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/en");
  const trigger = page.getByRole("button", { name: "Open navigation" });
  await trigger.click();
  const dialog = page.getByRole("dialog", { name: "Open navigation" });
  await expect(dialog).toBeVisible();
  await dialog.getByRole("button", { name: "Close navigation" }).click();
  await expect(dialog).toBeHidden();
  await expect(trigger).toBeFocused();
});

test("mobile drawer closes through backdrop and route selection", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/en");
  const trigger = page.getByRole("button", { name: "Open navigation" });
  await trigger.click();
  const dialog = page.getByRole("dialog", { name: "Open navigation" });
  await expect(dialog).toBeVisible();
  await page.locator(".menu-backdrop").click({ position: { x: 380, y: 10 } });
  await expect(dialog).toBeHidden();
  await trigger.click();
  await dialog.getByRole("link", { name: "Works", exact: true }).click();
  await expect(page).toHaveURL(/\/en\/works$/);
  await expect(dialog).toBeHidden();
});

test("mobile drawer remains usable on a short-height viewport", async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 568 });
  await page.goto("/fa");
  await page.getByRole("button", { name: "باز کردن راهبری" }).click();
  const dialog = page.getByRole("dialog", { name: "باز کردن راهبری" });
  await expect(dialog).toBeVisible();
  await expect(dialog.getByRole("button", { name: "بستن راهبری" })).toBeInViewport();
  await dialog.getByRole("link", { name: "تماس", exact: true }).scrollIntoViewIfNeeded();
  await expect(dialog.getByRole("link", { name: "تماس", exact: true })).toBeVisible();
});

test("mobile drawer Escape dismissal restores focus to its trigger", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/en");
  const trigger = page.getByRole("button", { name: "Open navigation" });
  await trigger.click();
  const dialog = page.getByRole("dialog", { name: "Open navigation" });
  await expect(dialog).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(dialog).toBeHidden();
  await expect(trigger).toBeFocused();
});

test("mobile drawer traps keyboard focus at both ends", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/en");
  await page.getByRole("button", { name: "Open navigation" }).click();
  const dialog = page.getByRole("dialog", { name: "Open navigation" });
  const first = dialog.locator("a[href]").first();
  const last = dialog.locator("a[href]").last();
  await expect(first).toBeFocused();
  await page.keyboard.press("Shift+Tab");
  await expect(last).toBeFocused();
  await page.keyboard.press("Tab");
  await expect(first).toBeFocused();
});

test("empty CV remains unpublished, unlinked, and non-indexable", async ({ page, request }) => {
  for (const locale of ["fa", "en"] as const) {
    const response = await request.get(`/${locale}/cv`);
    expect(response.status()).toBe(404);
    await page.goto(`/${locale}`);
    await expect(page.locator(".desktop-sidebar, .mobile-drawer").getByRole("link", { name: /CV|رزومه/ })).toHaveCount(0);
  }
});


test("mobile drawer closes when switching locale", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/en");
  await page.getByRole("button", { name: "Open navigation" }).click();
  const dialog = page.getByRole("dialog", { name: "Open navigation" });
  await expect(dialog).toBeVisible();
  await dialog.getByRole("link", { name: "فارسی" }).click();
  await expect(page).toHaveURL(/\/fa$/);
  await expect(page.locator("html")).toHaveAttribute("dir", "rtl");
  await expect(dialog).toBeHidden();
});


for (const locale of ["en", "fa"] as const) {
  test(`mobile ${locale} drawer is anchored to the locale-appropriate physical edge`, async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(`/${locale}`);
    const drawer = page.locator("#mobile-navigation");
    await expect(drawer).toHaveCount(0);
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    await page.getByRole("button", { name: locale === "fa" ? "باز کردن راهبری" : "Open navigation" }).click();
    await expect(drawer).toBeVisible();
    await expect(drawer).not.toHaveAttribute("aria-hidden", "true");
    await waitForDrawerToSettle(drawer);
    const geometry = await drawer.evaluate((element) => {
      const rect = element.getBoundingClientRect();
      return { left: rect.left, right: rect.right, width: rect.width, viewport: window.innerWidth };
    });
    expect(geometry.left).toBe(locale === "fa" ? geometry.viewport - geometry.width : 0);
    expect(geometry.right).toBe(locale === "fa" ? geometry.viewport : geometry.width);
    expect(geometry.width).toBeLessThanOrEqual(geometry.viewport);
    await expect(drawer.locator(".nav-link").first()).toHaveCSS("direction", locale === "fa" ? "rtl" : "ltr");
  });
}

for (const locale of ["en", "fa"] as const) {
  test(`mobile ${locale} header stays fixed and places the hamburger on the correct physical edge`, async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(`/${locale}`);
    const header = page.locator(".mobile-header");
    const trigger = page.locator(".mobile-header .menu-trigger");
    await expect(header).toBeVisible();
    await expect(header).toHaveCSS("position", "fixed");
    const before = await header.boundingBox();
    const triggerBefore = await trigger.boundingBox();
    expect(before?.y).toBe(0);
    expect(triggerBefore?.x).toBe(locale === "fa" ? 390 - (triggerBefore?.width ?? 0) - 20 : 20);
    await page.evaluate(() => window.scrollTo(0, 600));
    await expect.poll(async () => (await header.boundingBox())?.y).toBe(0);
    const triggerAfter = await trigger.boundingBox();
    expect(triggerAfter?.x).toBe(locale === "fa" ? 390 - (triggerAfter?.width ?? 0) - 20 : 20);
  });
}

for (const locale of ["en", "fa"] as const) {
  test(`desktop ${locale} navigation chrome remains fixed at the viewport top while scrolling`, async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto(`/${locale}`);
    const sidebar = page.locator(".desktop-sidebar");
    const utility = page.locator(".desktop-utility");
    await expect(sidebar).toHaveCSS("position", "fixed");
    await expect(utility).toHaveCSS("position", "fixed");
    await page.evaluate(() => window.scrollTo(0, 700));
    await expect.poll(async () => (await sidebar.boundingBox())?.y).toBe(0);
    await expect.poll(async () => (await utility.boundingBox())?.y).toBe(32);
  });
}

for (const locale of ["en", "fa"] as const) {
  test(`${locale} homepage artist title uses a restrained responsive display size`, async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(`/${locale}`);
    const title = page.locator("#home-title");
    await expect(title).toBeVisible();
    const metrics = await title.evaluate((element) => {
      const style = getComputedStyle(element);
      const rect = element.getBoundingClientRect();
      const range = document.createRange();
      range.selectNodeContents(element);
      const lineRects = Array.from(range.getClientRects()).filter((item) => item.width > 0 && item.height > 0);
      return { fontSize: parseFloat(style.fontSize), height: rect.height, lineHeight: parseFloat(style.lineHeight), lineCount: lineRects.length };
    });
    expect(metrics.fontSize).toBeLessThanOrEqual(44);
    expect(metrics.height).toBeLessThanOrEqual(metrics.lineHeight * 3.2);
    expect(metrics.lineCount).toBeGreaterThan(0);
  });
}


const homepageViewports = [
  { name: "desktop-large", width: 1440, height: 900 },
  { name: "desktop-standard", width: 1280, height: 800 },
  { name: "tablet-landscape", width: 1024, height: 768 },
  { name: "tablet-portrait", width: 768, height: 1024 },
  { name: "mobile-large", width: 430, height: 932 },
  { name: "mobile-standard", width: 390, height: 844 },
  { name: "mobile-compact", width: 375, height: 667 },
] as const;

for (const locale of ["en", "fa"] as const) {
  for (const viewport of homepageViewports) {
    test(`homepage hero and publication-aware CTAs render without overflow: ${locale} ${viewport.name}`, async ({ page }) => {
      await page.setViewportSize({ width: viewport.width, height: viewport.height });
      await page.goto(`/${locale}`);
      await expect(page.locator("html")).toHaveAttribute("lang", locale);
      await expect(page.locator("html")).toHaveAttribute("dir", locale === "fa" ? "rtl" : "ltr");
      await expect(page.getByRole("heading", { level: 1, name: locale === "fa" ? "غزاله عبداله زاده نسودی" : "Ghazaleh Abdolahzade Nasoodi" })).toBeVisible();
      const heroImage = page.locator(".hero-artwork img");
      await expect(heroImage).toBeVisible();
      await expect(heroImage).toHaveJSProperty("complete", true);
      await expect(heroImage).not.toHaveJSProperty("naturalWidth", 0);
      if ((await heroImage.getAttribute("src"))?.includes("homepage-hero")) {
        await expect(heroImage).toHaveAttribute("alt", locale === "fa" ? "هنرمند در آتلیه، روبه‌روی بوم نقاشی ایستاده است." : "The artist standing before a canvas in her studio.");
      }
      const galleryCta = page.getByRole("link", { name: locale === "fa" ? "گالری‌ها را ببینید" : "Explore galleries" });
      const worksCta = page.getByRole("link", { name: locale === "fa" ? "گزیده آثار را ببینید" : "View selected works" });
      if (await page.locator(".gallery-cards .gallery-card").count() > 0) await expect(galleryCta).toHaveAttribute("href", `/${locale}/galleries`);
      else await expect(galleryCta).toHaveCount(0);
      if (await page.locator(".artwork-grid .artwork-item").count() > 0) await expect(worksCta).toHaveAttribute("href", `/${locale}/works`);
      else await expect(worksCta).toHaveCount(0);
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth);
      expect(overflow, `${locale} ${viewport.name} horizontal overflow`).toBe(false);
      await page.screenshot({ path: test.info().outputPath(`hero-${locale}-${viewport.name}.png`), fullPage: false });
    });
  }
}

for (const locale of ["en", "fa"] as const) {
  test(`language selector exposes both native language names in ${locale}`, async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto(`/${locale}`);
    await page.getByRole("button", { name: locale === "fa" ? "زبان" : "Language" }).click();
    await expect(page.getByRole("menuitem", { name: /English/ })).toBeVisible();
    await expect(page.getByRole("menuitem", { name: /فارسی/ })).toBeVisible();
  });
}


test("main content has no duplicate footer and the mobile drawer ends with copyright", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/en");
  await expect(page.locator(".site-main > .site-footer")).toHaveCount(0);
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/fa");
  await page.getByRole("button", { name: "باز کردن راهبری" }).click();
  const drawer = page.getByRole("dialog", { name: "باز کردن راهبری" });
  await expect(drawer.locator(".drawer-copyright")).toContainText("nasoodi.art");
  await expect(drawer.locator(".drawer-copyright")).toContainText(/©\s*\d{4}/);
  const copyright = await drawer.locator(".drawer-copyright").boundingBox();
  const settings = await drawer.locator(".drawer-settings").boundingBox();
  expect(copyright!.y).toBeGreaterThan(settings!.y);
});

test("navigation underlines fit their labels and the mobile trigger has no outline border", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/en");
  const link = page.locator(".desktop-sidebar .nav-link").first();
  const linkBox = await link.boundingBox();
  const textWidth = await link.evaluate((element) => {
    const range = document.createRange();
    range.selectNodeContents(element);
    return range.getBoundingClientRect().width;
  });
  expect(Math.abs(linkBox!.width - textWidth)).toBeLessThan(3);
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/en");
  const trigger = page.locator(".menu-trigger");
  await expect(trigger).toHaveCSS("border-top-width", "0px");
});
