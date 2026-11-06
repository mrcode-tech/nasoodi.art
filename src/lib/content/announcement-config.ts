import { pagePath, type Locale } from "../../types/locale";

export const announcementTypes = ["artwork", "gallery", "journal", "event"] as const;
export type AnnouncementType = (typeof announcementTypes)[number];

export interface AnnouncementConfig {
  active: boolean;
  type: AnnouncementType;
  contentId: string;
  title: Record<Locale, string>;
  description: Record<Locale, string>;
  metadata?: Partial<Record<Locale, string>>;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function requireLocalizedText(value: unknown, field: string): asserts value is Record<Locale, string> {
  if (!isRecord(value)) throw new Error(`Announcement configuration: ${field} must be an object.`);
  for (const locale of ["en", "fa"] as const) {
    if (typeof value[locale] !== "string" || !value[locale].trim()) {
      throw new Error(`Announcement configuration: ${field}.${locale} must be a non-empty string.`);
    }
  }
}

/** Validate the single editorial announcement configuration without resolving its content reference. */
export function assertAnnouncementConfig(value: unknown): asserts value is AnnouncementConfig {
  if (!isRecord(value)) throw new Error("Announcement configuration must be a JSON object.");
  const allowedKeys = new Set(["active", "type", "contentId", "title", "description", "metadata"]);
  for (const key of Object.keys(value)) {
    if (!allowedKeys.has(key)) throw new Error("Announcement configuration: unsupported field " + key + ".");
  }
  if (typeof value.active !== "boolean") throw new Error("Announcement configuration: active must be a boolean.");
  if (typeof value.type !== "string" || !announcementTypes.includes(value.type as AnnouncementType)) {
    throw new Error("Announcement configuration: type must be artwork, gallery, journal, or event.");
  }
  if (typeof value.contentId !== "string" || !value.contentId.trim()) {
    throw new Error("Announcement configuration: contentId must be a non-empty string.");
  }
  requireLocalizedText(value.title, "title");
  requireLocalizedText(value.description, "description");
  if (value.metadata !== undefined) {
    if (!isRecord(value.metadata)) throw new Error("Announcement configuration: metadata must be an object when provided.");
    for (const locale of ["en", "fa"] as const) {
      if (value.metadata[locale] !== undefined &&
        (typeof value.metadata[locale] !== "string" || !value.metadata[locale].trim())) {
        throw new Error(`Announcement configuration: metadata.${locale} must be a non-empty string when provided.`);
      }
    }
    if (!value.metadata.en && !value.metadata.fa) {
      throw new Error("Announcement configuration: metadata must contain at least one localized value when provided.");
    }
  }
}

/** Build the canonical localized destination from content type and its localized slug. */
export function getAnnouncementHref(type: AnnouncementType, localizedSlug: string, locale: Locale): string {
  const section = type === "artwork" ? "works"
    : type === "gallery" ? "galleries"
    : "journal";
  return pagePath(locale, section + "/" + encodeURIComponent(localizedSlug));
}
