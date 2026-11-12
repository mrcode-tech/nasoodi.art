import "server-only";

import seoMetadata from "../data/seo-cv-metadata.json";
import { getCv } from "./cv.repository";
import type { CvEntry } from "../../types/content";
import type { Locale } from "../../types/locale";

const SUPPORTED_SCHEMA_VERSION = 2;
const ENTITY_TYPES = new Set([
  "person",
  "educational-institution",
  "organization",
  "publisher",
  "professional-association",
  "employer",
  "gallery",
  "exhibition-venue",
  "event-organizer",
  "place",
  "publication",
  "other",
]);
const LOCALES = ["en", "fa"] as const;

type LocalizedValues = Record<Locale, string>;
type LocalizedTerms = Record<Locale, string[]>;
type CvSeoEntity = {
  type: string;
  name: LocalizedValues;
  searchTerms: LocalizedTerms;
};
type CvSeoMapping = {
  entityIds: string[];
  searchTerms: LocalizedTerms;
  descriptionContext?: Partial<LocalizedValues>;
  priority?: number;
};
type CvSeoDocument = {
  schemaVersion: 2;
  entities: Record<string, CvSeoEntity>;
  cvRecords: Record<string, CvSeoMapping>;
};

export class CvSeoMetadataValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "CvSeoMetadataValidationError";
  }
}

function fail(path: string, expected: string, reason: string): never {
  throw new CvSeoMetadataValidationError(`${path}: expected ${expected}; ${reason}`);
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function assertExactKeys(value: Record<string, unknown>, keys: readonly string[], path: string): void {
  const allowed = new Set(keys);
  for (const key of Object.keys(value)) {
    if (!allowed.has(key)) fail(path + "." + key, "a supported field", "unexpected field");
  }
}

function normalize(value: string, locale: Locale): string {
  const normalized = value.normalize("NFC").trim().replace(/\s+/g, " ");
  return locale === "fa"
    ? normalized.replace(/[يى]/g, "ی").replace(/ك/g, "ک")
    : normalized.toLocaleLowerCase("en");
}

function readNonEmptyString(value: unknown, path: string): string {
  if (typeof value !== "string" || !value.trim()) {
    fail(path, "a non-empty string", "value is missing or whitespace-only");
  }
  return value.trim();
}

function readLocalizedValues(value: unknown, path: string): LocalizedValues {
  if (!isRecord(value)) fail(path, "an object with en and fa strings", "invalid localized object");
  assertExactKeys(value, LOCALES, path);
  return {
    en: readNonEmptyString(value.en, path + ".en"),
    fa: readNonEmptyString(value.fa, path + ".fa"),
  };
}

function readTerms(value: unknown, path: string): LocalizedTerms {
  if (!isRecord(value)) fail(path, "an object with en and fa arrays", "invalid localized terms");
  assertExactKeys(value, LOCALES, path);
  const result = {} as LocalizedTerms;
  for (const locale of LOCALES) {
    const terms = value[locale];
    if (!Array.isArray(terms) || terms.length === 0) {
      fail(path + "." + locale, "a non-empty string array", "search terms are required");
    }
    const seen = new Set<string>();
    result[locale] = terms.map((term, index) => {
      const parsed = readNonEmptyString(term, path + "." + locale + "[" + index + "]");
      const key = normalize(parsed, locale);
      if (seen.has(key)) fail(path + "." + locale, "unique normalized terms", "duplicate term: " + parsed);
      seen.add(key);
      return parsed;
    });
  }
  return result;
}

function readIdentifier(value: string, path: string): string {
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value)) {
    fail(path, "a stable lowercase kebab-case identifier", "invalid identifier");
  }
  return value;
}

/** Strictly validates the schema-v2 document and its references to public canonical CV records. */
export function validateCvSeoMetadata(input: unknown, canonicalEntries: readonly CvEntry[]): CvSeoDocument {
  if (!isRecord(input)) fail("root", "an object", "invalid document");
  assertExactKeys(input, ["schemaVersion", "entities", "cvRecords"], "root");
  if (input.schemaVersion !== SUPPORTED_SCHEMA_VERSION) {
    fail("schemaVersion", String(SUPPORTED_SCHEMA_VERSION), "unsupported schema version");
  }
  if (!isRecord(input.entities)) fail("entities", "an entity dictionary", "invalid entity registry");
  if (!isRecord(input.cvRecords)) fail("cvRecords", "a CV record dictionary", "invalid mapping registry");

  const entities: Record<string, CvSeoEntity> = {};
  for (const [id, raw] of Object.entries(input.entities)) {
    readIdentifier(id, "entities key");
    const path = "entities." + id;
    if (!isRecord(raw)) fail(path, "an entity object", "invalid entity");
    assertExactKeys(raw, ["type", "name", "searchTerms"], path);
    if (typeof raw.type !== "string" || !ENTITY_TYPES.has(raw.type)) {
      fail(path + ".type", "a supported entity type", "unsupported entity type");
    }
    entities[id] = {
      type: raw.type,
      name: readLocalizedValues(raw.name, path + ".name"),
      searchTerms: readTerms(raw.searchTerms, path + ".searchTerms"),
    };
  }

  const publicEntries = new Map(
    canonicalEntries
      .filter((entry) => entry.status === "published")
      .map((entry) => [entry.id, entry]),
  );
  const cvRecords: Record<string, CvSeoMapping> = {};
  for (const [id, raw] of Object.entries(input.cvRecords)) {
    readIdentifier(id, "cvRecords key");
    const path = "cvRecords." + id;
    const entry = publicEntries.get(id);
    if (!entry) fail(path, "an existing public canonical CV record ID", "unknown, unpublished, or ineligible CV record");
    if (!isRecord(raw)) fail(path, "a CV mapping object", "invalid mapping");
    assertExactKeys(raw, ["entityIds", "searchTerms", "descriptionContext", "priority"], path);
    if (!Array.isArray(raw.entityIds)) fail(path + ".entityIds", "an array of entity IDs", "invalid references");
    const seenIds = new Set<string>();
    const entityIds = raw.entityIds.map((entityId, index) => {
      if (typeof entityId !== "string") fail(path + ".entityIds[" + index + "]", "an entity ID", "invalid reference");
      if (seenIds.has(entityId)) fail(path + ".entityIds", "unique entity references", "duplicate entity ID: " + entityId);
      seenIds.add(entityId);
      if (!entities[entityId]) fail(path + ".entityIds", "an existing entity ID", "unknown entity: " + entityId);
      const entity = entities[entityId];
      for (const locale of LOCALES) {
        const canonicalText = [entry.title?.[locale], entry.organization?.[locale], entry.location?.[locale], entry.period?.[locale]]
          .filter((part): part is string => Boolean(part?.trim()))
          .map((part) => normalize(part, locale));
        if (!canonicalText.some((part) => part.includes(normalize(entity.name[locale], locale)))) {
          fail(path + ".entityIds", "entities grounded in the canonical CV record", entityId + " name is not supported in locale " + locale);
        }
      }
      return entityId;
    });
    const mapping: CvSeoMapping = {
      entityIds,
      searchTerms: readTerms(raw.searchTerms, path + ".searchTerms"),
    };
    if (raw.descriptionContext !== undefined) {
      if (!isRecord(raw.descriptionContext)) fail(path + ".descriptionContext", "an optional localized object", "invalid context");
      assertExactKeys(raw.descriptionContext, LOCALES, path + ".descriptionContext");
      const context: Partial<LocalizedValues> = {};
      for (const locale of LOCALES) {
        if (raw.descriptionContext[locale] !== undefined) {
          context[locale] = readNonEmptyString(raw.descriptionContext[locale], path + ".descriptionContext." + locale);
        }
      }
      if (Object.keys(context).length === 0) fail(path + ".descriptionContext", "at least one localized context value", "empty context");
      mapping.descriptionContext = context;
    }
    if (raw.priority !== undefined) {
      if (!Number.isInteger(raw.priority) || (raw.priority as number) < 0) {
        fail(path + ".priority", "a non-negative integer", "invalid priority");
      }
      mapping.priority = raw.priority as number;
    }
    cvRecords[id] = mapping;
  }

  return { schemaVersion: 2, entities, cvRecords };
}

function relevanceScore(mapping: CvSeoMapping, entry: CvEntry, locale: Locale): number {
  const canonicalText = [entry.title?.[locale], entry.organization?.[locale], entry.location?.[locale], entry.period?.[locale]]
    .filter((part): part is string => Boolean(part?.trim()))
    .map((part) => normalize(part, locale));
  return mapping.searchTerms[locale].reduce((score, term) => {
    const normalizedTerm = normalize(term, locale);
    return score + (canonicalText.some((part) => part.includes(normalizedTerm)) ? 1 : 0);
  }, 0);
}

/**
 * Returns an enriched CV description or the unchanged canonical baseline.
 * Invalid/unavailable SEO data is deliberately non-fatal for public page rendering.
 */
export function getCvSeoDescription(locale: Locale, baseline: string): string {
  try {
    const entries = getCv(locale).entries;
    const document = validateCvSeoMetadata(seoMetadata, entries);
    const byId = new Map(entries.map((entry) => [entry.id, entry]));
    const candidates = Object.entries(document.cvRecords)
      .map(([id, mapping]) => ({ id, mapping, entry: byId.get(id) }))
      .filter((item): item is typeof item & { entry: CvEntry } =>
        Boolean(item.entry && item.mapping.descriptionContext?.[locale]?.trim()),
      )
      .sort((a, b) =>
        (b.mapping.priority ?? 0) - (a.mapping.priority ?? 0) ||
        relevanceScore(b.mapping, b.entry, locale) - relevanceScore(a.mapping, a.entry, locale) ||
        a.id.localeCompare(b.id, "en"),
      );
    const context = candidates[0]?.mapping.descriptionContext?.[locale];
    if (!context) return baseline;
    return baseline.trim() ? baseline.trim() + " " + context : context;
  } catch (error) {
    if (process.env.NODE_ENV !== "production") {
      console.error("[cv-seo-metadata] Enrichment omitted; canonical metadata retained.", error);
    }
    return baseline;
  }
}
