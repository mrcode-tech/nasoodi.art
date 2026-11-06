import imageMetadata from "@/content/data/image-metadata.json";

export type ImageMetadataRecord = {
  format: "jpeg" | "png" | "webp";
  width: number;
  height: number;
  aspectRatio: number;
};

const images = imageMetadata.images as Record<string, ImageMetadataRecord>;

export function getImageMetadata(src: string): ImageMetadataRecord {
  const metadata = images[src];
  if (!metadata) {
    throw new Error("Missing generated image metadata for " + src + ". Run npm run images:generate.");
  }
  return metadata;
}
