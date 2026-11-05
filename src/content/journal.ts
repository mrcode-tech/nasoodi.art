import journalRecords from "./data/journal/index.json";
import { artworks } from "./artworks";
import type { JournalEntry, LocalizedRichText } from "../types/content";

type JournalJsonRecord = Omit<JournalEntry, "body" | "coverImage"> & {
  coverArtworkId: string;
  coverAlt: JournalEntry["coverImage"] extends infer T
    ? T extends { alt: infer A } ? A : never
    : never;
  body: LocalizedRichText;
};

export const journalEntries: JournalEntry[] = (journalRecords as unknown as JournalJsonRecord[]).map((record) => {
  const artwork = artworks.find((item) => item.id === record.coverArtworkId);
  const image = artwork?.images.find((item) => item.role === "primary");
  if (!artwork || !image || !artwork.rightsConfirmed) {
    throw new Error(`Journal entry ${record.id} references an unavailable approved cover artwork`);
  }

  return {
    ...record,
    coverImage: {
      src: image.src,
      alt: record.coverAlt,
      width: image.width,
      height: image.height,
      rightsConfirmed: artwork.rightsConfirmed,
    },
  };
});
