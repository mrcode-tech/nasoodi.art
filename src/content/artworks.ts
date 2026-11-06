import artworkRecords from "./data/artworks.json";
import { getImageMetadata } from "../lib/image-metadata";
import type { Artwork } from "../types/content";

function withImageMetadata<T extends { src: string }>(image: T) {
  const { width, height } = getImageMetadata(image.src);
  return { ...image, width, height };
}

// Artwork records own semantic image references; generated metadata supplies
// intrinsic file dimensions shared by every context that reuses each image.
export const approvedArtworkImages = artworkRecords.flatMap((record) =>
  record.images.map(withImageMetadata),
);

export const artworks: Artwork[] = artworkRecords.map((record) => ({
  ...record,
  images: record.images.map(withImageMetadata),
})) as unknown as Artwork[];
