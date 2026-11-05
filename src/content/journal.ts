import { readFileSync } from "node:fs";
import { join } from "node:path";
import journalRecords from "./data/journal/index.json";
import { artworks } from "./artworks";
import type { JournalEntry, JournalTextBlock } from "../types/content";
import type { Locale } from "../types/locale";

type JournalJsonRecord = Omit<JournalEntry, "body" | "coverImage"> & {
  coverArtworkId: string;
  coverAlt: Partial<Record<Locale, string>>;
};

function parseMarkdownBlocks(markdown: string): JournalTextBlock[] {
  return markdown.trim().split(/\n\s*\n/).filter(Boolean).map((chunk): JournalTextBlock => {
    const lines = chunk.split("\n");
    const heading = /^(#{2,3})\s+(.+)$/.exec(lines[0]);
    if (heading) return { type: "heading", level: heading[1].length as 2 | 3, text: heading[2] };
    if (lines.every((line) => /^>\s?/.test(line))) {
      return { type: "quote", text: lines.map((line) => line.replace(/^>\s?/, "")).join("\n") };
    }
    if (lines.every((line) => /^(?:[-*]\s+|\d+\.\s+)/.test(line))) {
      const ordered = /^\d+\.\s+/.test(lines[0]);
      return {
        type: "list",
        ordered,
        items: lines.map((line) => line.replace(/^(?:[-*]\s+|\d+\.\s+)/, "")),
      };
    }
    const link = /^\[([^\]]+)\]\((https?:\/\/[^)]+|\/[^)]+)\)$/.exec(chunk);
    if (link) return { type: "link", text: link[1], href: link[2] };
    return { type: "paragraph", text: lines.join("\n") };
  });
}

function markdownForEntry(source: string, id: string): string {
  const marker = `<!-- entry:${id} -->`;
  const start = source.indexOf(marker);
  if (start < 0) throw new Error(`Missing Journal Markdown section for ${id}`);
  const bodyStart = start + marker.length;
  const next = source.indexOf("<!-- entry:", bodyStart);
  return source.slice(bodyStart, next < 0 ? undefined : next).trim();
}

const journalBody = Object.fromEntries(
  (["en", "fa"] as const).map((locale) => [
    locale,
    readFileSync(join(process.cwd(), "src/content/data/journal", `body.${locale}.md`), "utf8"),
  ]),
) as Record<Locale, string>;

export const journalEntries: JournalEntry[] = (journalRecords as unknown as JournalJsonRecord[]).map((record) => {
  const artwork = artworks.find((item) => item.id === record.coverArtworkId);
  const image = artwork?.images.find((item) => item.role === "primary");
  if (!artwork || !image || !artwork.rightsConfirmed) {
    throw new Error(`Journal entry ${record.id} references an unavailable approved cover artwork`);
  }
  return {
    id: record.id,
    slug: record.slug,
    localizedSlugs: record.localizedSlugs,
    type: record.type,
    title: record.title,
    summary: record.summary,
    status: record.status,
    publishedAt: record.publishedAt,
    approvedLocales: record.approvedLocales,
    artistApproved: record.artistApproved,
    event: record.event,
    coverImage: {
      src: image.src,
      alt: record.coverAlt,
      width: image.width,
      height: image.height,
      rightsConfirmed: artwork.rightsConfirmed,
    },
    body: {
      en: parseMarkdownBlocks(markdownForEntry(journalBody.en, record.id)),
      fa: parseMarkdownBlocks(markdownForEntry(journalBody.fa, record.id)),
    },
  };
});
