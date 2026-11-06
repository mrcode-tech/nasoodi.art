import { readdir, readFile, stat, writeFile } from "node:fs/promises";
import { extname, relative, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(fileURLToPath(new URL("..", import.meta.url)));
const imageRoot = resolve(root, "public/images");
const contentRoot = resolve(root, "src/content/data");
const outputPath = resolve(contentRoot, "image-metadata.json");
const checkOnly = process.argv.includes("--check");
const supported = new Set([".jpg", ".jpeg", ".png", ".webp"]);

function jpegDimensions(bytes) {
  if (bytes.length < 4 || bytes[0] !== 0xff || bytes[1] !== 0xd8) return null;
  let offset = 2;
  while (offset + 4 < bytes.length) {
    if (bytes[offset] !== 0xff) { offset += 1; continue; }
    while (bytes[offset] === 0xff) offset += 1;
    const marker = bytes[offset++];
    if (marker === 0xd9 || marker === 0xda) break;
    if (marker >= 0xd0 && marker <= 0xd7) continue;
    if (offset + 2 > bytes.length) break;
    const length = bytes.readUInt16BE(offset);
    if (length < 2 || offset + length > bytes.length) break;
    const isFrame = [0xc0, 0xc1, 0xc2, 0xc3, 0xc5, 0xc6, 0xc7, 0xc9, 0xca, 0xcb, 0xcd, 0xce, 0xcf].includes(marker);
    if (isFrame && length >= 7) {
      return { width: bytes.readUInt16BE(offset + 5), height: bytes.readUInt16BE(offset + 3), format: "jpeg" };
    }
    offset += length;
  }
  return null;
}

function pngDimensions(bytes) {
  if (bytes.length < 24 || bytes.toString("hex", 0, 8) !== "89504e470d0a1a0a" || bytes.toString("ascii", 12, 16) !== "IHDR") return null;
  return { width: bytes.readUInt32BE(16), height: bytes.readUInt32BE(20), format: "png" };
}

function webpDimensions(bytes) {
  if (bytes.length < 30 || bytes.toString("ascii", 0, 4) !== "RIFF" || bytes.toString("ascii", 8, 12) !== "WEBP") return null;
  const chunk = bytes.toString("ascii", 12, 16);
  if (chunk === "VP8X") {
    return {
      width: 1 + bytes.readUIntLE(24, 3),
      height: 1 + bytes.readUIntLE(27, 3),
      format: "webp",
    };
  }
  if (chunk === "VP8L" && bytes[20] === 0x2f) {
    const b1 = bytes[21], b2 = bytes[22], b3 = bytes[23], b4 = bytes[24];
    return {
      width: 1 + b1 + ((b2 & 0x3f) << 8),
      height: 1 + (b2 >> 6) + (b3 << 2) + ((b4 & 0x0f) << 10),
      format: "webp",
    };
  }
  if (chunk === "VP8 " && bytes[23] === 0x9d && bytes[24] === 0x01 && bytes[25] === 0x2a) {
    return {
      width: bytes.readUInt16LE(26) & 0x3fff,
      height: bytes.readUInt16LE(28) & 0x3fff,
      format: "webp",
    };
  }
  return null;
}

async function walk(directory) {
  const result = [];
  const entries = await readdir(directory, { withFileTypes: true });
  for (const entry of entries.sort((a, b) => (a.name < b.name ? -1 : a.name > b.name ? 1 : 0))) {
    const absolute = resolve(directory, entry.name);
    if (entry.isSymbolicLink()) throw new Error("Image directories must not contain symbolic links: " + absolute);
    if (entry.isDirectory()) result.push(...await walk(absolute));
    else if (entry.isFile() && supported.has(extname(entry.name).toLowerCase())) result.push(absolute);
  }
  return result;
}

function collectImageReferences(value, references = new Set()) {
  if (Array.isArray(value)) {
    for (const item of value) collectImageReferences(item, references);
  } else if (value && typeof value === "object") {
    for (const item of Object.values(value)) collectImageReferences(item, references);
  } else if (typeof value === "string" && value.startsWith("/images/")) {
    references.add(value);
  }
  return references;
}

async function walkJson(directory) {
  const result = [];
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const absolute = resolve(directory, entry.name);
    if (entry.isDirectory()) result.push(...await walkJson(absolute));
    else if (entry.isFile() && entry.name.endsWith(".json") && absolute !== outputPath) result.push(absolute);
  }
  return result;
}

const imageFiles = await walk(imageRoot);
const images = {};
for (const absolute of imageFiles) {
  const bytes = await readFile(absolute);
  const info = jpegDimensions(bytes) ?? pngDimensions(bytes) ?? webpDimensions(bytes);
  if (!info || !Number.isSafeInteger(info.width) || !Number.isSafeInteger(info.height) || info.width < 1 || info.height < 1) {
    throw new Error("Unsupported, corrupt, or unreadable image: " + relative(root, absolute));
  }
  const publicPath = "/" + relative(resolve(root, "public"), absolute).split(sep).join("/");
  images[publicPath] = {
    format: info.format,
    width: info.width,
    height: info.height,
    aspectRatio: Number((info.width / info.height).toFixed(6)),
  };
}

const references = new Set();
for (const jsonPath of await walkJson(contentRoot)) {
  const parsed = JSON.parse(await readFile(jsonPath, "utf8"));
  for (const reference of collectImageReferences(parsed)) references.add(reference);
}

for (const reference of references) {
  if (reference.includes("?") || reference.includes("#") || reference.includes("\\") || reference.includes("%")) {
    throw new Error("Image references must be plain root-relative paths: " + reference);
  }
  const target = resolve(imageRoot, reference.slice("/images/".length));
  const imageRootPrefix = imageRoot + sep;
  if (!target.startsWith(imageRootPrefix)) throw new Error("Image reference escapes public/images/: " + reference);
  const normalizedReference = "/" + relative(resolve(root, "public"), target).split(sep).join("/");
  if (normalizedReference !== reference) throw new Error("Image reference is not normalized: " + reference);
  const file = await stat(target).catch(() => null);
  if (!file?.isFile()) throw new Error("Content references a missing public image: " + reference);
  if (supported.has(extname(target).toLowerCase()) && !Object.hasOwn(images, reference)) {
    throw new Error("Content image is missing generated metadata: " + reference);
  }
}

const output = JSON.stringify({ schemaVersion: 1, images }, null, 2) + "\n";
if (checkOnly) {
  const existingText = await readFile(outputPath, "utf8").catch(() => "");
  let committed;
  try {
    committed = JSON.parse(existingText);
  } catch {
    throw new Error("Committed image metadata is missing or invalid JSON. Run npm run images:generate and commit src/content/data/image-metadata.json.");
  }
  const expectedPaths = Object.keys(images).sort();
  const committedImages = committed && typeof committed.images === "object" && committed.images ? committed.images : {};
  const committedPaths = Object.keys(committedImages).sort();
  const missing = expectedPaths.filter((path) => !Object.hasOwn(committedImages, path));
  const unexpected = committedPaths.filter((path) => !Object.hasOwn(images, path));
  const changed = expectedPaths.filter((path) => Object.hasOwn(committedImages, path) && JSON.stringify(committedImages[path]) !== JSON.stringify(images[path]));
  if (committed.schemaVersion !== 1 || missing.length || unexpected.length || changed.length) {
    const details = changed.map((path) => path + " committed=" + JSON.stringify(committedImages[path]) + " actual=" + JSON.stringify(images[path]));
    throw new Error("Image metadata is stale. Missing: [" + missing.join(", ") + "]; unexpected: [" + unexpected.join(", ") + "]; changed: [" + details.join("; ") + "]. Run npm run images:generate and commit the result.");
  }
  process.stdout.write("Validated " + Object.keys(images).length + " raster images and " + references.size + " content image references.\n");
} else {
  await writeFile(outputPath, output, "utf8");
  process.stdout.write("Generated metadata for " + Object.keys(images).length + " raster images at src/content/data/image-metadata.json.\n");
}
