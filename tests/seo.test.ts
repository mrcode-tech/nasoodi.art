import assert from "node:assert/strict";
import test from "node:test";
import { createLocalizedMetadata } from "../src/lib/seo/metadata";
import { createPortfolioStructuredData } from "../src/content/portfolio-structured-data";
import type { ArtistProfile, CvEntry } from "../src/types/content";
import { defaultLocale, locales, localeDirections, localeNames, localeOpenGraphTags, pagePath } from "../src/types/locale";

test("locale metadata is complete in one authoritative registry", () => {
  const expected = [...locales].sort();
  assert.deepEqual(Object.keys(localeNames).sort(), expected);
  assert.deepEqual(Object.keys(localeDirections).sort(), expected);
  assert.deepEqual(Object.keys(localeOpenGraphTags).sort(), expected);
  assert.equal(defaultLocale, "fa");
  assert.equal(pagePath(defaultLocale), "/fa");
  assert.equal(localeDirections.fa, "rtl");
  assert.equal(localeDirections.en, "ltr");
});

test("localized page metadata uses self canonicals and reciprocal language alternates", () => {
  const metadata = createLocalizedMetadata({
    locale: "fa",
    path: "works",
    title: "آثار",
    description: "گزیده آثار نقاشی",
    alternatePaths: { en: "/en/works" },
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

test("localized metadata omits social cards for noindex and incomplete pages", () => {
  const metadata = createLocalizedMetadata({
    locale: "en",
    path: "contact",
    title: "Contact",
    indexable: false,
  });

  assert.equal(metadata.alternates?.canonical, "https://nasoodi.art/en/contact");
  assert.equal(metadata.openGraph, null);
  assert.equal(metadata.twitter, null);
  assert.equal(metadata.robots && typeof metadata.robots === "object" && "index" in metadata.robots ? metadata.robots.index : undefined, false);
});

test("article metadata uses the localized URL and publication timestamp", () => {
  const metadata = createLocalizedMetadata({
    locale: "en",
    path: "journal/studio-notes",
    title: "Studio Notes",
    description: "Notes from the studio",
    alternatePaths: { fa: "/fa/journal/ateliye" },
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

test("Person and WebSite structured data use only canonical and curated public facts", () => {
  const profile = {
    name: { en: "Example Artist", fa: "هنرمند نمونه" },
    discipline: { en: "Painter", fa: "نقاش" },
    biography: { en: "A synthetic test biography.", fa: "زندگی‌نامه آزمایشی." },
    statement: { en: "Synthetic statement.", fa: "بیانیه آزمایشی." },
    interests: { en: ["Colour and atmosphere"], fa: ["رنگ و فضا"] },
    nameAliases: {
      en: {
        given: [], middle: [], family: [], partialSearchQueries: [],
        completeName: [
          { value: "Example Artist", kind: "complete-name", confidence: "core" },
          { value: "Example Painter", kind: "complete-name", confidence: "supported" },
          { value: "Unverified Example", kind: "complete-name", confidence: "exploratory" },
        ],
      },
      fa: {
        given: [], middle: [], family: [], partialSearchQueries: [],
        completeName: [{ value: "هنرمند نمونه", kind: "complete-name", confidence: "core" }],
      },
    },
  } as unknown as ArtistProfile;

  const cvEntries = [
    {
      id: "education-test", category: "education", title: { en: "M.A. in Painting", fa: "کارشناسی ارشد نقاشی" },
      organization: { en: "Example University", fa: "دانشگاه نمونه" }, status: "published",
    },
    {
      id: "membership-test", category: "membership", title: { en: "Member", fa: "عضو" },
      organization: { en: "Example Association", fa: "انجمن نمونه" }, status: "published",
    },
    {
      id: "teaching-test", category: "teaching", title: { en: "Painting Instructor", fa: "مدرس نقاشی" },
      organization: { en: "Example Studio", fa: "آتلیه نمونه" }, status: "published",
    },
  ] as CvEntry[];

  const data = createPortfolioStructuredData({
    profile,
    cvEntries,
    locale: "en",
    officialProfiles: ["https://example.com/artist"],
    artworkMedia: ["Oil on canvas"],
  });
  const [person, website] = data["@graph"];

  assert.equal(person["@type"], "Person");
  assert.equal(person.name, "Example Artist");
  assert.deepEqual(person.alternateName, ["هنرمند نمونه", "Example Painter"]);
  assert.deepEqual(person.jobTitle, ["Painter", "Painting Instructor"]);
  assert.deepEqual(person.knowsAbout, ["Colour and atmosphere", "Oil on canvas"]);
  assert.deepEqual(person.alumniOf, [{ "@type": "EducationalOrganization", name: "Example University" }]);
  assert.deepEqual(person.memberOf, [{ "@type": "Organization", name: "Example Association" }]);
  assert.deepEqual(person.sameAs, ["https://example.com/artist"]);
  assert.equal(person.url, "https://nasoodi.art/en/about");
  assert.equal(website["@type"], "WebSite");
  assert.deepEqual(website.inLanguage, ["fa", "en"]);
  assert.doesNotThrow(() => JSON.parse(JSON.stringify(data)));
});

test("Person structured data omits unsupported optional relationships", () => {
  const profile = {
    name: { en: "Another Artist", fa: "هنرمند دیگر" },
    discipline: { en: "Painter", fa: "نقاش" },
    biography: { en: "Biography.", fa: "زندگی‌نامه." },
    statement: { en: "Statement.", fa: "بیانیه." },
  } as ArtistProfile;

  const [person] = createPortfolioStructuredData({
    profile,
    cvEntries: [],
    locale: "en",
  })["@graph"];

  assert.equal("alumniOf" in person, false);
  assert.equal("memberOf" in person, false);
  assert.equal("sameAs" in person, false);
  assert.equal("knowsAbout" in person, false);
});
