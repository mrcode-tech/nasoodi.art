import { copyFile, mkdir, stat } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const sourceDirectory = resolve(root, "specification/assets/gallery");
const destinationDirectory = resolve(root, "public/images");
const assets = Array.from({ length: 5 }, (_, index) => ({
  source: resolve(sourceDirectory, `${index + 1}.jpg`),
  destination: resolve(destinationDirectory, `approved-artwork-${index + 1}.jpg`),
}));

await mkdir(destinationDirectory, { recursive: true });
for (const asset of assets) {
  const source = await stat(asset.source);
  if (!source.isFile() || source.size === 0) {
    throw new Error(`Approved artwork source is missing or empty: ${asset.source}`);
  }
  await copyFile(asset.source, asset.destination);
  const copied = await stat(asset.destination);
  if (copied.size !== source.size) {
    throw new Error(`Artwork copy size mismatch: ${asset.destination}`);
  }
  process.stdout.write(`Copied ${asset.source.replace(root + "/", "")} -> ${asset.destination.replace(root + "/", "")} (${copied.size} bytes)\n`);
}
