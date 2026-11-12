import { expect, test } from "@playwright/test";
import { archiveItemLinks, archivePagination } from "./helpers/archive";

const locales = ["en", "fa"] as const;
const sections = ["works", "galleries", "journal", "about", "contact", "cv"] as const;

test("root route renders the language-selection entrance without redirecting", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveURL((url) => url.pathname === "/");
  await expect(page.locator("html")).toHaveAttribute("lang", "en");
  await expect(page.locator("html")).toHaveAttribute("dir", "ltr");
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  await expect(page.getByRole("link", { name: "Enter", exact: true })).toHaveAttribute("href", "/en");
  await expect(page.getByRole("link", { name: "ورود", exact: true })).toHaveAttribute("href", "/fa");
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

for (const viewport of [
  { width: 320, height: 568 },
  { width: 360, height: 800 },
  { width: 390, height: 844 },
  { width: 430, height: 932 },
]) {
  for (const locale of locales) {
    test("homepage contact footer is icon-only and fits " + locale + " at " + viewport.width + "px", async ({ page }) => {
      await page.setViewportSize(viewport);
      await page.goto("/" + locale);
      const footer = page.locator(".homepage-contact-footer");
      await expect(footer).toBeVisible();
      await expect(footer.getByRole("heading", {
        name: locale === "fa" ? "ارتباط با من" : "Get in Touch",
      })).toBeVisible();
      const links = footer.locator(".homepage-contact-link");
      await expect(links).toHaveCount(3);
      for (const [index, label] of [
        locale === "fa" ? "ارسال ایمیل" : "Send an email",
        locale === "fa" ? "ارتباط در تلگرام" : "Contact on Telegram",
        locale === "fa" ? "مشاهده صفحه اینستاگرام" : "Visit Instagram profile",
      ].entries()) {
        await expect(links.nth(index)).toHaveAttribute("aria-label", label);
        await expect(links.nth(index).locator("svg")).toBeVisible();
        await expect(links.nth(index).locator(".homepage-contact-identifier")).toBeHidden();
      }
      const layout = await footer.evaluate((element) => {
        const items = Array.from(element.querySelectorAll(".homepage-contact-link"));
        const row = element.querySelector(".homepage-contact-links")?.getBoundingClientRect();
        const boxes = items.map((item) => {
          const rect = item.getBoundingClientRect();
          return {
            left: rect.left,
            right: rect.right,
            top: rect.top,
            width: rect.width,
            height: rect.height,
            center: rect.left + rect.width / 2,
          };
        });
        const heading = element.querySelector("h2")?.getBoundingClientRect();
        const reference = document.querySelector(".editorial-section .section-heading")?.getBoundingClientRect();
        const rtl = getComputedStyle(element).direction === "rtl";
        return {
          viewport: document.documentElement.clientWidth,
          document: document.documentElement.scrollWidth,
          footerHeight: element.getBoundingClientRect().height,
          headingStart: heading ? (rtl ? heading.right : heading.left) : -1,
          referenceStart: reference ? (rtl ? reference.right : reference.left) : -2,
          rowLeft: row?.left ?? -1,
          rowWidth: row?.width ?? 0,
          boxes,
        };
      });
      expect(layout.document).toBeLessThanOrEqual(layout.viewport);
      expect(Math.abs(layout.headingStart - layout.referenceStart)).toBeLessThanOrEqual(1);
      expect(layout.boxes.map((box) => box.top).every((top) => Math.abs(top - layout.boxes[0].top) <= 1)).toBe(true);
      const expectedCenters = [
        layout.rowLeft + layout.rowWidth / 6,
        layout.rowLeft + layout.rowWidth / 2,
        layout.rowLeft + (layout.rowWidth * 5) / 6,
      ];
      for (const [index, box] of layout.boxes.entries()) {
        expect(Math.abs(box.center - expectedCenters[index])).toBeLessThanOrEqual(2);
      }
      for (const box of layout.boxes) {
        expect(box.width).toBeGreaterThanOrEqual(44);
        expect(box.height).toBeGreaterThanOrEqual(44);
        expect(box.left).toBeGreaterThanOrEqual(0);
        expect(box.right).toBeLessThanOrEqual(layout.viewport);
      }
      expect(layout.footerHeight).toBeLessThanOrEqual(160);
    });
  }
}

for (const locale of locales) {
  test("desktop " + locale + " homepage contact footer aligns with the editorial grid and uses consistent icon-first rows", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto("/" + locale);
    const footer = page.locator(".homepage-contact-footer");
    const heading = footer.getByRole("heading", { name: locale === "fa" ? "ارتباط با من" : "Get in Touch" });
    const links = footer.locator(".homepage-contact-link");
    await expect(heading).toBeVisible();
    await expect(links).toHaveCount(3);
    for (const link of await links.all()) {
      await expect(link.locator("svg")).toBeVisible();
      await expect(link.locator(".homepage-contact-identifier")).toBeVisible();
    }
    const layout = await footer.evaluate((element) => {
      const heading = element.querySelector("h2");
      const items = Array.from(element.querySelectorAll(".homepage-contact-link"));
      const rows = items.map((item) => {
        const iconRect = item.querySelector("svg")?.getBoundingClientRect();
        const identifierRect = item.querySelector(".homepage-contact-identifier")?.getBoundingClientRect();
        return {
          top: item.getBoundingClientRect().top,
          direction: getComputedStyle(item).direction,
          textAlign: getComputedStyle(item).textAlign,
          iconLeft: iconRect?.left ?? -1,
          iconRight: iconRect?.right ?? -1,
          identifierLeft: identifierRect?.left ?? -1,
          identifierRight: identifierRect?.right ?? -1,
        };
      });
      const headingRect = heading?.getBoundingClientRect();
      const referenceRect = document.querySelector(".editorial-section .section-heading")?.getBoundingClientRect();
      const rtl = getComputedStyle(element).direction === "rtl";
      return {
        rtl,
        headingAlign: heading ? getComputedStyle(heading).textAlign : "",
        headingStart: headingRect ? (rtl ? headingRect.right : headingRect.left) : -1,
        referenceStart: referenceRect ? (rtl ? referenceRect.right : referenceRect.left) : -2,
        rows,
      };
    });
    expect(layout.headingAlign).toBe("start");
    expect(Math.abs(layout.headingStart - layout.referenceStart)).toBeLessThanOrEqual(1);
    expect(layout.rows[1].top).toBeGreaterThan(layout.rows[0].top);
    expect(layout.rows[2].top).toBeGreaterThan(layout.rows[1].top);
    expect(layout.rtl).toBe(locale === "fa");
    expect(layout.rows.every((row) => row.direction === "ltr" && row.textAlign === "left")).toBe(true);
    expect(layout.rows.every((row) => Math.abs(row.iconLeft - layout.rows[0].iconLeft) <= 1)).toBe(true);
    expect(layout.rows.every((row) => Math.abs(row.identifierLeft - layout.rows[0].identifierLeft) <= 1)).toBe(true);
    expect(layout.rows.every((row) => Math.abs((row.identifierLeft - row.iconRight) - 12) <= 1)).toBe(true);
  });

  test("dedicated " + locale + " Contact page keeps its detailed presentation", async ({ page }) => {
    await page.goto("/" + locale + "/contact");
    const section = page.locator(".contact-experience-page");
    await expect(section).toBeVisible();
    await expect(section.getByRole("heading", {
      name: locale === "fa" ? "بیایید گفت‌وگویی را آغاز کنیم." : "Let's start a conversation.",
    })).toBeVisible();
    await expect(section.locator(".contact-intro")).toBeVisible();
    await expect(section.locator(".contact-methods .contact-method")).toHaveCount(3);
    await expect(section.locator(".homepage-contact-footer")).toHaveCount(0);
  });
}

for (const route of ["/fa/contact"] as const) {
  for (const viewport of [{ width: 1280, height: 800 }, { width: 390, height: 844 }]) {
    test("Persian dedicated Contact values align to the physical left edge at " + viewport.width + "px", async ({ page }) => {
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
        const detailRect = details.getBoundingClientRect();
        const rows = Array.from(details.querySelectorAll(".contact-method"));
        return rows.map((row) => {
          const link = row.querySelector("a");
          const label = row.querySelector(".contact-method-label");
          const linkRect = link?.getBoundingClientRect();
          const labelRect = label?.getBoundingClientRect();
          return {
            valueLeftOffset: linkRect ? Math.abs(linkRect.left - detailRect.left) : Number.POSITIVE_INFINITY,
            labelRightOffset: labelRect ? Math.abs(labelRect.right - detailRect.right) : Number.POSITIVE_INFINITY,
            stackedBelowLabel: Boolean(linkRect && labelRect && linkRect.top >= labelRect.bottom - 1),
            top: linkRect?.top ?? 0,
          };
        });
      });

      expect(alignment.length).toBeGreaterThan(0);
      for (const row of alignment) {
        expect(row.valueLeftOffset).toBeLessThanOrEqual(1);
        expect(row.labelRightOffset).toBeLessThanOrEqual(1);
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
  await navigation.locator('a[href="/en/galleries"]').click();
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


for (const viewportWidth of [320, 360, 390, 430] as const) {
  test("localized mobile layouts have no horizontal page overflow at " + viewportWidth + "px", async ({ page }) => {
    await page.setViewportSize({ width: viewportWidth, height: 844 });

    for (const locale of locales) {
      for (const section of ["", ...sections]) {
        const route = "/" + locale + (section ? "/" + section : "");
        await page.goto(route);
        const diagnoseOverflow = () => page.evaluate(() => {
          const viewport = document.documentElement.clientWidth;
          const hero = document.querySelector(".artist-hero-carousel");
          const ancestorChain = [];
          for (let node = hero; node && ancestorChain.length < 8; node = node.parentElement) {
            const rect = node.getBoundingClientRect();
            const style = getComputedStyle(node);
            ancestorChain.push({
              tag: node.tagName.toLowerCase(),
              className: typeof node.className === "string" ? node.className : "",
              left: Math.round(rect.left * 10) / 10,
              right: Math.round(rect.right * 10) / 10,
              width: Math.round(rect.width * 10) / 10,
              direction: style.direction,
              display: style.display,
              boxSizing: style.boxSizing,
              marginInlineStart: style.marginInlineStart,
              marginInlineEnd: style.marginInlineEnd,
              paddingInlineStart: style.paddingInlineStart,
              paddingInlineEnd: style.paddingInlineEnd,
              gridTemplateColumns: style.gridTemplateColumns,
              overflowX: style.overflowX,
            });
          }
          const offenders = Array.from(document.querySelectorAll("body *"))
            .map((element) => {
              const rect = element.getBoundingClientRect();
              const style = getComputedStyle(element);
              return {
                tag: element.tagName.toLowerCase(),
                className: typeof element.className === "string" ? element.className : "",
                left: Math.round(rect.left * 10) / 10,
                right: Math.round(rect.right * 10) / 10,
                width: Math.round(rect.width * 10) / 10,
                position: style.position,
                transform: style.transform,
                overflowX: style.overflowX,
              };
            })
            .filter((item) => item.width > 0 && (item.left < -1 || item.right > viewport + 1))
            .slice(0, 12);
          return {
            viewport,
            document: document.documentElement.scrollWidth,
            body: document.body.scrollWidth,
            direction: getComputedStyle(document.documentElement).direction,
            activeElement: document.activeElement instanceof HTMLElement
              ? document.activeElement.tagName.toLowerCase() + "." + document.activeElement.className
              : null,
            ancestorChain,
            offenders,
          };
        });

        const closedOverflow = await diagnoseOverflow();
        expect(closedOverflow.document, route + " with navigation closed: " + JSON.stringify(closedOverflow)).toBeLessThanOrEqual(closedOverflow.viewport);

        if (locale === "fa") {
          const contentSpacing = await page.locator(".page-content").first().evaluate((element) => {
            const rect = element.getBoundingClientRect();
            const style = getComputedStyle(element);
            return {
              left: rect.left,
              right: rect.right,
              width: rect.width,
              paddingLeft: parseFloat(style.paddingLeft),
              paddingRight: parseFloat(style.paddingRight),
              boxSizing: style.boxSizing,
            };
          });
          expect(contentSpacing.boxSizing, route + " page content must include its gutters in its width").toBe("border-box");
          expect(contentSpacing.left, route + " page content must stay inside the viewport").toBeGreaterThanOrEqual(-0.5);
          expect(contentSpacing.right, route + " page content must stay inside the viewport").toBeLessThanOrEqual(viewportWidth + 0.5);
          expect(Math.abs(contentSpacing.paddingLeft - contentSpacing.paddingRight), route + " Persian mobile content gutters must be balanced: " + JSON.stringify(contentSpacing)).toBeLessThanOrEqual(0.5);
          expect(contentSpacing.paddingLeft, route + " Persian mobile content needs a deliberate side gutter").toBeGreaterThanOrEqual(16);
        }

        const trigger = page.locator(".menu-trigger");
        await trigger.focus();
        const focusedOverflow = await diagnoseOverflow();
        expect(focusedOverflow.document, route + " with menu trigger focused: " + JSON.stringify(focusedOverflow)).toBeLessThanOrEqual(focusedOverflow.viewport);

        await trigger.click();
        await expect(page.getByRole("dialog")).toBeVisible();
        const openOverflow = await diagnoseOverflow();
        expect(openOverflow.document, route + " with navigation open: " + JSON.stringify(openOverflow)).toBeLessThanOrEqual(openOverflow.viewport);
        await page.keyboard.press("Escape");
        await expect(page.getByRole("dialog")).toBeHidden();
      }
    }
  });
}


for (const locale of locales) {
  test(locale + " artwork detail returns to the originating Works archive page and page size", async ({ page }, testInfo) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto("/" + locale + "/works?page=2&pageSize=10");
    const cards = archiveItemLinks(page, "works");
    if (await page.locator(".artwork-pagination select").count() === 0 ||
        await page.locator(".artwork-pagination select").inputValue() !== "10" ||
        new URL(page.url()).searchParams.get("page") !== "2") {
      test.skip(true, "The current Works archive does not contain enough published records for page 2 at page size 10.");
      return;
    }

    const firstArchiveItem = await cards.first().getAttribute("href");
    await cards.first().click();
    const backLink = page.getByRole("link", { name: locale === "fa" ? "بازگشت به آثار" : "Back to Artworks" });
    await expect(backLink).toBeVisible();
    await page.screenshot({ path: testInfo.outputPath("artwork-detail-return-desktop-light.png"), fullPage: true });
    await expect(backLink).toHaveAttribute("href", "/" + locale + "/works?page=2&pageSize=10");

    await page.reload();
    await expect(backLink).toHaveAttribute("href", "/" + locale + "/works?page=2&pageSize=10");
    const detailPath = new URL(page.url()).pathname;
    await backLink.click();
    const isRestoredArchive = (url: URL) =>
      url.pathname === "/" + locale + "/works" &&
      url.searchParams.get("page") === "2" &&
      url.searchParams.get("pageSize") === "10";
    await expect(page).toHaveURL(isRestoredArchive);
    await expect(page.locator(".artwork-pagination select")).toHaveValue("10");
    await expect(cards.first()).toHaveAttribute("href", firstArchiveItem ?? "");

    await page.goBack();
    await expect(page).toHaveURL((url) => url.pathname === detailPath);
    await expect(backLink).toHaveAttribute("href", "/" + locale + "/works?page=2&pageSize=10");
    await page.goForward();
    await expect(page).toHaveURL(isRestoredArchive);
    await expect(page.locator(".artwork-pagination select")).toHaveValue("10");
  });

  test(locale + " artwork detail uses a safe Works fallback for direct and invalid return context", async ({ page }, testInfo) => {
    await page.goto("/" + locale + "/works");
    const cards = archiveItemLinks(page, "works");
    if (await cards.count() === 0) {
      test.skip(true, "The Works archive currently has no published artwork route to use for this route smoke test.");
      return;
    }

    const detailHref = await cards.first().getAttribute("href");
    if (!detailHref) throw new Error("A published artwork card must expose its detail href.");
    const detailPath = new URL(detailHref, page.url()).pathname;

    await page.goto(detailPath);
    const backLink = page.getByRole("link", { name: locale === "fa" ? "بازگشت به آثار" : "Back to Artworks" });
    await expect(backLink).toHaveAttribute("href", "/" + locale + "/works");

    await page.goto(detailPath + "?returnTo=" + encodeURIComponent("https://example.invalid/"));
    await expect(backLink).toHaveAttribute("href", "/" + locale + "/works");

    await page.setViewportSize({ width: 390, height: 844 });
    const dimensions = await page.evaluate(() => ({
      viewport: document.documentElement.clientWidth,
      document: document.documentElement.scrollWidth,
    }));
    expect(dimensions.document).toBeLessThanOrEqual(dimensions.viewport);
    await page.evaluate(() => document.documentElement.classList.add("dark"));
    await page.screenshot({ path: testInfo.outputPath("artwork-detail-return-mobile-dark.png"), fullPage: true });

    const canonical = page.locator('link[rel="canonical"]');
    await expect(canonical).toHaveAttribute("href", new RegExp("/" + locale + "/works/"));
    await expect(canonical).not.toHaveAttribute("href", /returnTo=/);
  });
}
