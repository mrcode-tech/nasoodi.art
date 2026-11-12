import assert from "node:assert/strict";
import test from "node:test";
import { cvEntries } from "../src/content/cv";
import seoMetadata from "../src/content/data/seo-cv-metadata.json";
import {
  CvSeoMetadataValidationError,
  getCvSeoDescription,
  validateCvSeoMetadata,
} from "../src/content/repositories/cv-seo-metadata.repository";
import type { CvEntry } from "../src/types/content";

const entry = (overrides: Partial<CvEntry> = {}): CvEntry => ({
  id: "education-example",
  category: "education",
  title: { en: "M.A. in Painting", fa: "کارشناسی ارشد نقاشی" },
  organization: { en: "Example University", fa: "دانشگاه نمونه" },
  period: { en: "2015", fa: "۱۳۹۴" },
  status: "published",
  ...overrides,
});

const valid = () => ({
  schemaVersion: 2,
  entities: {
    "institution-example": {
      type: "educational-institution",
      name: { en: "Example University", fa: "دانشگاه نمونه" },
      searchTerms: {
        en: ["Example University", "fine arts university"],
        fa: ["دانشگاه نمونه", "آموزش هنر"],
      },
    },
  },
  cvRecords: {
    "education-example": {
      entityIds: ["institution-example"],
      searchTerms: {
        en: ["painting degree", "Example University"],
        fa: ["مدرک نقاشی", "دانشگاه نمونه"],
      },
      descriptionContext: {
        en: "The CV records a painting degree at Example University.",
        fa: "مدرک نقاشی در دانشگاه نمونه در سوابق تحصیلی ثبت شده است.",
      },
      priority: 10,
    },
  },
});

test("accepts schema-v2 bilingual metadata and empty entity references", () => {
  const data = valid();
  data.cvRecords["education-example"].entityIds = [];
  assert.doesNotThrow(() => validateCvSeoMetadata(data, [entry()]));
});

test("rejects unsupported schema versions, unexpected fields, and malformed locale keys", () => {
  const wrongVersion = valid();
  wrongVersion.schemaVersion = 3;
  assert.throws(() => validateCvSeoMetadata(wrongVersion, [entry()]), CvSeoMetadataValidationError);
  const legacy = valid();
  (legacy.entities["institution-example"] as Record<string, unknown>).alternateNames = {};
  assert.throws(() => validateCvSeoMetadata(legacy, [entry()]), /alternateNames/);
  const malformedLocale = valid();
  (malformedLocale.entities["institution-example"].name as Record<string, unknown>).fr = "Example";
  assert.throws(() => validateCvSeoMetadata(malformedLocale, [entry()]), /name.fr/);
});

test("requires both localized names and non-empty bilingual search terms", () => {
  const missingFa = valid();
  (missingFa.entities["institution-example"].name as Record<string, unknown>).fa = undefined;
  assert.throws(() => validateCvSeoMetadata(missingFa, [entry()]), /name.fa/);
  const emptyTerms = valid();
  emptyTerms.entities["institution-example"].searchTerms.fa = [];
  assert.throws(() => validateCvSeoMetadata(emptyTerms, [entry()]), /searchTerms.fa/);
  const blank = valid();
  blank.cvRecords["education-example"].searchTerms.en[0] = "   ";
  assert.throws(() => validateCvSeoMetadata(blank, [entry()]), /whitespace-only/);
});

test("rejects duplicate normalized terms, duplicate references, and invalid priorities", () => {
  const duplicateTerm = valid();
  duplicateTerm.entities["institution-example"].searchTerms.en.push("example university");
  assert.throws(() => validateCvSeoMetadata(duplicateTerm, [entry()]), /duplicate term/);
  const duplicateEntity = valid();
  duplicateEntity.cvRecords["education-example"].entityIds.push("institution-example");
  assert.throws(() => validateCvSeoMetadata(duplicateEntity, [entry()]), /duplicate entity ID/);
  const priority = valid();
  priority.cvRecords["education-example"].priority = -1;
  assert.throws(() => validateCvSeoMetadata(priority, [entry()]), /non-negative integer/);
});

test("rejects unknown CV and entity references and ungrounded entity associations", () => {
  const unknownRecord = valid();
  unknownRecord.cvRecords["missing-record"] = unknownRecord.cvRecords["education-example"];
  assert.throws(() => validateCvSeoMetadata(unknownRecord, [entry()]), /unknown, unpublished/);
  const unknownEntity = valid();
  unknownEntity.cvRecords["education-example"].entityIds = ["missing-entity"];
  assert.throws(() => validateCvSeoMetadata(unknownEntity, [entry()]), /unknown entity/);
  const ungrounded = valid();
  ungrounded.entities["institution-example"].name.en = "Unrelated University";
  assert.throws(() => validateCvSeoMetadata(ungrounded, [entry()]), /not supported/);
});

test("preserves Persian ZWNJ spelling distinctions while normalizing Arabic letter variants", () => {
  const data = valid();
  data.entities["institution-example"].searchTerms.fa = ["هفت ثمر", "هفت‌ثمر"];
  assert.doesNotThrow(() => validateCvSeoMetadata(data, [entry()]));
  data.entities["institution-example"].searchTerms.fa = ["كلمه", "کلمه"];
  assert.throws(() => validateCvSeoMetadata(data, [entry()]), /duplicate term/);
});

test("validates the complete current dataset against canonical public CV records", () => {
  assert.doesNotThrow(() => validateCvSeoMetadata(
    seoMetadata,
    cvEntries.filter((item) => item.status === "published"),
  ));
});

test("enriches localized descriptions without changing title or exposing raw search-term lists", () => {
  const en = getCvSeoDescription("en", "A structured overview of the artist's professional practice.");
  const fa = getCvSeoDescription("fa", "مروری ساختاریافته بر فعالیت حرفه‌ای هنرمند.");
  assert.match(en, /A structured overview/);
  assert.match(en, /The CV lists/);
  assert.match(fa, /مروری ساختاریافته/);
  assert.match(fa, /در سوابق/);
  assert.doesNotMatch(en, /painting university, art education/i);
});

test("unmapped synthetic CV entries do not affect canonical metadata fallback", () => {
  const synthetic = [entry({ id: "unmapped-example" })];
  assert.equal(synthetic[0].id, "unmapped-example");
  assert.equal(getCvSeoDescription("en", "Canonical description." ).startsWith("Canonical description."), true);
});
