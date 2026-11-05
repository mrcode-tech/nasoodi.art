import assert from "node:assert/strict";
import test from "node:test";
import { createLocalizedMetadata } from "../src/lib/seo/metadata";

test("localized page metadata uses self canonicals and reciprocal language alternates", () => {
  const metadata = createLocalizedMetadata({
    locale: "fa",
    path: "works",
    title: "آثار",
    description: "گزیده آثار نقاشی",
    alternatePath: "/en/works",
    indexable: true,
    images: ["/images/approved-artwork-1.jpg"],
  });

  assert.equal(metadata.alternates?.canonical, "https://nasoodi.art/fa/works");
  assert.deepEqual(metadata.alternates?.languages, {
    fa: "https://nasoodi.art/fa/works",
    en: "https://nasoodi.art/en/works",
  });
  assert.equal(metadata.robots && typeof metadata.robots === "object" && "index" in metadata.robots ? metadata.robots.index : undefined, true);
  assert.deepEqual(metadata.twitter, {
    card: "summary_large_image",
    title: "آثار",
    description: "گزیده آثار نقاشی",
    images: ["https://nasoodi.art/images/approved-artwork-1.jpg"],
  });
});

test("localized metadata omits social cards for noindex demo and incomplete pages", () => {
  const metadata = createLocalizedMetadata({
    locale: "en",
    path: "contact",
    title: "Contact",
    indexable: false,
  });

  assert.equal(metadata.alternates?.canonical, "https://nasoodi.art/en/contact");
  assert.equal(metadata.openGraph, undefined);
  assert.equal(metadata.twitter, undefined);
  assert.equal(metadata.robots && typeof metadata.robots === "object" && "index" in metadata.robots ? metadata.robots.index : undefined, false);
});

test("article metadata uses the localized URL and publication timestamp", () => {
  const metadata = createLocalizedMetadata({
    locale: "en",
    path: "journal/studio-notes",
    title: "Studio Notes",
    description: "Notes from the studio",
    alternatePath: "/fa/journal/ateliye",
    indexable: true,
    openGraphType: "article",
    publishedTime: "2026-10-20T10:00:00Z",
  });

  assert.equal(metadata.alternates?.canonical, "https://nasoodi.art/en/journal/studio-notes");
  assert.deepEqual(metadata.openGraph, {
    type: "article",
    title: "Studio Notes",
    description: "Notes from the studio",
    url: "https://nasoodi.art/en/journal/studio-notes",
    siteName: "Nasoodi.art",
    locale: "en_US",
    alternateLocale: ["fa_IR"],
    publishedTime: "2026-10-20T10:00:00Z",
  });
});
