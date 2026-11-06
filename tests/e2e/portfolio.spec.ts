import { expect, test } from "@playwright/test";
import { archiveItemLinks, archivePagination } from "./helpers/archive";

const locales = ["en", "fa"] as const;
const sections = ["works", "galleries", "journal", "about", "contact", "cv"] as const;

test("root route redirects to the default locale", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveURL((url) => url.pathname === "/fa");
  await expect(page.locator("html")).toHaveAttribute("lang", "fa");
  await expect(page.locator("html")).toHaveAttribute("dir", "rtl");
});

test("localized routes expose the correct document language and main landmark", async ({ page, request }) => {
  for (const locale of locales) {
    for (const section of sections) {
      const path = "/" + locale + "/" + section;
      expect((await request.get(path)).status(), path).toBe(200);
      await page.goto(path);
      await expect(page.locator("html")).toHaveAttribute("lang", locale);
      await expect(page.locator("html")).toHaveAttribute("dir", locale === "fa" ? "rtl" : "ltr");
      await expect(page.getByRole("main")).toBeVisible();
      await expect(page.getByRole("heading", { level: 1 })).toHaveCount(1);
    }
  }
});

for (const route of ["/fa", "/fa/contact"] as const) {
  for (const viewport of [{ width: 1280, height: 800 }, { width: 390, height: 844 }]) {
    test("Persian contact values align to the physical left edge on " + route + " at " + viewport.width + "px", async ({ page }) => {
      await page.setViewportSize(viewport);
      await page.goto(route);
      const section = page.locator(".contact-experience");
      const methods = section.locator(".contact-methods");
      const links = methods.locator(".contact-method a");
      if (await links.count() === 0) {
        test.skip(true, "No public contact methods are configured.");
        return;
      }

      const alignment = await section.locator(".contact-details").evaluate((details) => {
        const detailLeft = details.getBoundingClientRect().left;
        const rows = Array.from(details.querySelectorAll(".contact-method"));
        return rows.map((row) => {
          const link = row.querySelector("a");
          const label = row.querySelector(".contact-method-label");
          const linkRect = link?.getBoundingClientRect();
          const labelRect = label?.getBoundingClientRect();
          return {
            leftOffset: linkRect ? Math.abs(linkRect.left - detailLeft) : Number.POSITIVE_INFINITY,
            stackedBelowLabel: Boolean(linkRect && labelRect && linkRect.top >= labelRect.bottom - 1),
            top: linkRect?.top ?? 0,
          };
        });
      });

      expect(alignment.length).toBeGreaterThan(0);
      for (const row of alignment) {
        expect(row.leftOffset).toBeLessThanOrEqual(1);
        expect(row.stackedBelowLabel).toBe(true);
      }
      expect(alignment.map((row) => row.top)).toEqual(
        [...alignment.map((row) => row.top)].sort((a, b) => a - b)
      );
    });
  }
}

test("desktop navigation exposes the current route and navigates between sections", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto("/en/works");
  const navigation = page.getByRole("navigation").first();
  await expect(navigation).toBeVisible();
  await expect(navigation.locator('a[aria-current="page"]')).toHaveAttribute("href", "/en/works");
  await navigation.getByRole("link", { name: "Galleries" }).click();
  await expect(page).toHaveURL((url) => url.pathname === "/en/galleries");
});

test("mobile navigation opens, closes with Escape, and restores focus", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/en");
  const trigger = page.locator(".menu-trigger");
  await expect(trigger).toHaveAttribute("aria-expanded", "false");
  await trigger.focus();
  await page.keyboard.press("Enter");
  const drawer = page.getByRole("dialog");
  await expect(drawer).toBeVisible();
  await expect(trigger).toHaveAttribute("aria-expanded", "true");
  await page.keyboard.press("Escape");
  await expect(drawer).toBeHidden();
  await expect(trigger).toBeFocused();
  await expect(trigger).toHaveAttribute("aria-expanded", "false");
});

test("mobile language switching navigates to the alternate locale", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/en");
  await page.locator(".menu-trigger").click();
  const drawer = page.getByRole("dialog");
  await drawer.locator(".language-trigger").click();
  await page.getByRole("menuitem", { name: /فارسی/ }).click();
  await expect(page).toHaveURL((url) => url.pathname === "/fa");
  await expect(page.locator("html")).toHaveAttribute("dir", "rtl");
});

test("archive links navigate to valid published detail routes", async ({ page, request }) => {
  for (const locale of locales) {
    for (const section of ["works", "galleries", "journal"] as const) {
      await page.goto("/" + locale + "/" + section);
      const links = archiveItemLinks(page, section);
      if (await links.count() === 0) {
        await expect(page.locator(".empty-note")).toBeVisible();
        continue;
      }
      const href = await links.first().getAttribute("href");
      expect(href).toMatch(new RegExp("^/" + locale + "/" + section + "/[^/?]+"));
      expect((await request.get(href!)).status()).toBe(200);
    }
  }
});

for (const section of ["works", "galleries", "journal"] as const) {
  test(section + " pagination updates the URL and visible records", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto("/en/" + section);
    const items = archiveItemLinks(page, section);
    const pagination = archivePagination(page, section);

    // Synthetic unit tests cover pagination independently of editorial record counts.
    const next = pagination.locator(".gallery-page-nav button").last();
    if (await next.count() === 0) {
      test.skip(true, "This archive currently has fewer than two pages.");
      return;
    }

    await expect(pagination.locator("select")).toHaveValue("6");
    const firstHref = await items.first().getAttribute("href");
    await expect(next).toBeEnabled();
    await next.click();
    await expect(page).toHaveURL((url) => url.searchParams.get("page") === "2");
    await expect(items.first()).not.toHaveAttribute("href", firstHref ?? "");

    for (const size of [10, 20] as const) {
      await page.goto("/en/" + section + "?pageSize=" + size);
      await expect(page).toHaveURL((url) => url.searchParams.get("pageSize") === String(size));
      expect(await items.count()).toBeLessThanOrEqual(size);
    }
  });
}

test("language switching preserves supported archive query state", async ({ page }) => {
  await page.goto("/en/journal?category=story&pageSize=10");
  await page.locator(".language-trigger").click();
  await page.getByRole("menuitem", { name: /فارسی/ }).click();
  await expect(page).toHaveURL((url) =>
    url.pathname === "/fa/journal" &&
    url.searchParams.get("category") === "story" &&
    url.searchParams.get("pageSize") === "10"
  );
  await expect(page.locator("html")).toHaveAttribute("dir", "rtl");
});

test("Journal category filters update the archive query", async ({ page }) => {
  await page.goto("/en/journal");
  const filters = page.locator(".journal-filters a");
  if (await filters.count() < 2) {
    test.skip(true, "No non-default Journal category is currently available.");
    return;
  }
  const filter = filters.nth(1);
  const href = await filter.getAttribute("href");
  if (!href || !href.includes("category=")) {
    test.skip(true, "No non-default Journal category is currently available.");
    return;
  }
  await filter.click();
  await expect(page).toHaveURL((url) => Boolean(url.searchParams.get("category")));
  await expect(page.getByRole("main")).toBeVisible();
});

test("artwork viewer supports opening, moving, browser history, and dismissal", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto("/en");
  const cards = page.locator(".artwork-experience-card");
  if (await cards.count() < 2) {
    test.skip(true, "Two published artworks are required to test next-item navigation.");
    return;
  }

  await cards.first().click();
  const viewer = page.getByRole("dialog");
  await expect(viewer).toBeVisible();
  const title = viewer.getByRole("heading");
  await expect(title).toBeVisible();
  const initialTitle = await title.textContent();
  await expect(page).toHaveURL((url) =>
    Boolean(url.searchParams.get("artwork")) && url.searchParams.get("viewerContext") === "home"
  );

  const next = viewer.locator(".artwork-viewer-controls button").nth(1);
  await expect(next).toBeEnabled();
  await next.click();
  await expect(title).not.toHaveText(initialTitle ?? "");
  await page.goBack();
  await expect(viewer).toBeHidden();
  await page.goForward();
  await expect(viewer).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(viewer).toBeHidden();
});

for (const locale of locales) {
  test("mobile " + locale + " artwork viewer stays within the viewport", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/" + locale);
    const card = page.locator(".artwork-experience-card").first();
    await expect(card).toBeVisible();
    await card.click();

    const viewer = page.getByRole("dialog");
    await expect(viewer).toBeVisible();
    const frame = await viewer.evaluate((node) => {
      const rect = node.getBoundingClientRect();
      const image = node.querySelector(".artwork-viewer-figure img");
      const imageRect = image?.getBoundingClientRect();
      return {
        left: rect.left,
        top: rect.top,
        right: rect.right,
        bottom: rect.bottom,
        width: rect.width,
        height: rect.height,
        viewportWidth: window.innerWidth,
        viewportHeight: window.innerHeight,
        imageInsideFrame: Boolean(imageRect && imageRect.width > 0 && imageRect.height > 0 &&
          imageRect.left >= rect.left && imageRect.top >= rect.top &&
          imageRect.right <= rect.right && imageRect.bottom <= rect.bottom),
      };
    });
    expect(frame.left).toBeGreaterThanOrEqual(0);
    expect(frame.top).toBeGreaterThanOrEqual(0);
    expect(frame.right).toBeLessThanOrEqual(frame.viewportWidth);
    expect(frame.bottom).toBeLessThanOrEqual(frame.viewportHeight);
    expect(frame.width).toBe(frame.viewportWidth);
    expect(frame.height).toBe(frame.viewportHeight);
    expect(frame.imageInsideFrame).toBe(true);
    await page.keyboard.press("Escape");
    await expect(viewer).toBeHidden();
  });
}

test("artwork viewer detail action opens the canonical detail route", async ({ page }) => {
  await page.goto("/en");
  const card = page.locator(".artwork-experience-card").first();
  await expect(card).toBeVisible();
  await card.click();
  const viewer = page.getByRole("dialog");
  await expect(viewer).toBeVisible();
  await viewer.getByRole("link").click();
  await expect(page).toHaveURL((url) => /^\/en\/works\/[^/]+$/.test(url.pathname));
  await expect(page.getByRole("main")).toBeVisible();
});

test("collection cards navigate to their detail routes", async ({ page }) => {
  for (const locale of locales) {
    await page.goto("/" + locale + "/galleries");
    const cards = page.locator(".gallery-index-card-link");
    if (await cards.count() === 0) continue;
    await cards.first().click();
    await expect(page).toHaveURL((url) => url.pathname.startsWith("/" + locale + "/galleries/"));
    await expect(page.getByRole("main")).toBeVisible();
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  }
});

test("public utility endpoints respond successfully", async ({ request }) => {
  const robots = await request.get("/robots.txt");
  expect(robots.status()).toBe(200);
  expect(await robots.text()).toMatch(/sitemap\.xml/);
  const sitemap = await request.get("/sitemap.xml");
  expect(sitemap.status()).toBe(200);
  expect(await sitemap.text()).toContain("<urlset");
});
