import assert from "node:assert/strict";
import test from "node:test";
import { createLocalizedMetadata } from "../src/lib/seo/metadata";
import { createPortfolioStructuredData } from "../src/content/portfolio-structured-data";
import type { ArtistProfile, CvEntry } from "../src/types/content";
import artistNameAliases from "../src/content/data/artist-name-aliases.json";
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
          { value: "Example Artist", kind: "complete-name", confidence: "core", structuredDataPriority: 1 },
          { value: "Example Painter", kind: "complete-name", confidence: "supported", structuredDataPriority: 2 },
          { value: "Unverified Example", kind: "complete-name", confidence: "exploratory", structuredDataPriority: 0 },
        ],
      },
      fa: {
        given: [], middle: [], family: [], partialSearchQueries: ["Example Partial"],
        completeName: [{ value: "هنرمند نمونه", kind: "complete-name", confidence: "core", structuredDataPriority: 1 }],
      },
    },
  } as unknown as ArtistProfile;

  const cvEntries: CvEntry[] = [
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
  ];

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


test("production alias inventory keeps partial queries separate from complete names", () => {
  const names = artistNameAliases.en.completeName.map((alias) => alias.value);
  assert.ok(names.includes("Ghazale Nasoudi"));
  assert.ok(names.includes("Ghazale Abdolahzade Nasoodi"));
  assert.ok(names.includes("Ghazaleh Abdolahzade Nasoodi"));
  assert.ok(names.includes("Ghazale Abdolahzade Nasoudi"));
  assert.ok(names.includes("Ghazaleh Abdolahzade Nasoudi"));
  assert.ok(artistNameAliases.en.partialSearchQueries.includes("Ghazaleh Nasoodi"));
  assert.ok(!artistNameAliases.en.partialSearchQueries.includes("Ghazale Nasoudi"));
});

test("structured data publishes prioritized aliases deterministically without a fixed limit", () => {
  const aliases = Array.from({ length: 8 }, (_, index) => ({
    value: "Synthetic Alias " + (index + 1),
    kind: "complete-name" as const,
    confidence: "supported" as const,
    structuredDataPriority: index < 7 ? index + 1 : 7
  }));
  const profile = {
    name: { en: "Synthetic Canonical", fa: "نام معیار" },
    discipline: { en: "Painter", fa: "نقاش" },
    biography: { en: "Synthetic biography.", fa: "زندگی‌نامه آزمایشی." },
    statement: { en: "Synthetic statement.", fa: "بیانیه آزمایشی." },
    nameAliases: {
      en: {
        given: [], middle: [], family: [], partialSearchQueries: ["Synthetic Partial Query"],
        completeName: [
          ...aliases,
          { value: "SYNTHETIC CANONICAL", kind: "complete-name" as const, confidence: "core" as const, structuredDataPriority: 0 },
          { value: " synthetic alias 1 ", kind: "complete-name" as const, confidence: "supported" as const, structuredDataPriority: 9 },
          { value: "Unprioritized Alias", kind: "complete-name" as const, confidence: "supported" as const },
          { value: "Exploratory Alias", kind: "complete-name" as const, confidence: "exploratory" as const, structuredDataPriority: 0 }
        ]
      },
      fa: { given: [], middle: [], family: [], partialSearchQueries: [], completeName: [] }
    }
  } as unknown as ArtistProfile;
  const build = (completeName: NonNullable<ArtistProfile["nameAliases"]>["en"]["completeName"]) =>
    createPortfolioStructuredData({
      profile: {
        ...profile,
        nameAliases: {
          ...(profile.nameAliases ?? {}),
          en: { ...(profile.nameAliases?.en ?? { given: [], middle: [], family: [], partialSearchQueries: [], completeName: [] }), completeName }
        }
      } as unknown as ArtistProfile,
      cvEntries: [],
      locale: "en"
    })["@graph"][0].alternateName;

  const expected = ["نام معیار", ...aliases.map((alias) => alias.value)];
  assert.deepEqual(build(profile.nameAliases.en.completeName), expected);
  assert.deepEqual(build([...profile.nameAliases.en.completeName].reverse()), expected);
});

test("Persian and English structured data preserve canonical identity and locale-specific aliases", () => {
  const profile = {
    name: { en: "Synthetic Canonical", fa: "نام معیار" },
    discipline: { en: "Painter", fa: "نقاش" },
    biography: { en: "Synthetic biography.", fa: "زندگی‌نامه آزمایشی." },
    statement: { en: "Synthetic statement.", fa: "بیانیه آزمایشی." },
    nameAliases: {
      en: {
        given: [], middle: [], family: [], partialSearchQueries: [],
        completeName: [{ value: "Synthetic English Alias", kind: "complete-name", confidence: "supported", structuredDataPriority: 1 }]
      },
      fa: {
        given: [], middle: [], family: [], partialSearchQueries: [],
        completeName: [
          { value: "نام جایگزین", kind: "complete-name", confidence: "supported", structuredDataPriority: 1 },
          { value: "نام‌جایگزین", kind: "complete-name", confidence: "supported", structuredDataPriority: 2 }
        ]
      }
    }
  } as unknown as ArtistProfile;
  const build = (locale: "en" | "fa") =>
    createPortfolioStructuredData({ profile, cvEntries: [], locale })["@graph"][0];

  const en = build("en");
  const fa = build("fa");
  assert.equal(en.name, "Synthetic Canonical");
  assert.deepEqual(en.alternateName, ["نام معیار", "Synthetic English Alias"]);
  assert.equal(fa.name, "نام معیار");
  assert.deepEqual(fa.alternateName, ["Synthetic Canonical", "نام جایگزین"]);
  assert.doesNotThrow(() => JSON.parse(JSON.stringify({ en, fa })));
});
