import artworkRecords from "./data/artworks.json";
import { approvedArtworkImageDimensions } from "../lib/approved-artwork-image-dimensions";
import type { Artwork } from "../types/content";

// Dimensions are generated from the approved source JPEGs before dev/build.
// Editorial fields and image references remain owner-editable JSON data.
export const approvedArtworkImages = artworkRecords.flatMap((record, index) =>
  record.images.map((image) => ({
    ...image,
    width: approvedArtworkImageDimensions[index].width,
    height: approvedArtworkImageDimensions[index].height,
  })),
);

export const artworks: Artwork[] = artworkRecords.map((record, index) => ({
  ...record,
  images: record.images.map((image) => ({
    ...image,
    width: approvedArtworkImageDimensions[index].width,
    height: approvedArtworkImageDimensions[index].height,
  })),
})) as unknown as Artwork[];
