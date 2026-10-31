import { createHash } from "node:crypto";
import { readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const candidates = [
  "specification/assets/artwork.JPG",
  ...Array.from({ length: 5 }, (_, index) => `specification/assets/gallery/${index + 1}.jpg`),
  "specification/assets/canvase.png",
  "specification/assets/artist.png",
  "specification/assets/easel.png",
  "specification/assets/oil-paint-brush.png",
];

function pngInfo(buffer) {
  if (buffer.length < 26 || buffer.toString("hex", 0, 8) !== "89504e470d0a1a0a") return null;
  return {
    format: "png",
    width: buffer.readUInt32BE(16),
    height: buffer.readUInt32BE(20),
    alphaChannel: buffer[25] === 4 || buffer[25] === 6,
  };
}

function jpegInfo(buffer) {
  if (buffer.length < 4 || buffer[0] !== 0xff || buffer[1] !== 0xd8) return null;
  let offset = 2;
  while (offset + 4 < buffer.length) {
    if (buffer[offset] !== 0xff) { offset++; continue; }
    while (buffer[offset] === 0xff) offset++;
    const marker = buffer[offset++];
    if (marker === 0xd9 || marker === 0xda) break;
    if (marker >= 0xd0 && marker <= 0xd7) continue;
    if (offset + 2 > buffer.length) break;
    const length = buffer.readUInt16BE(offset);
    if (length < 2 || offset + length > buffer.length) break;
    const isFrame = [0xc0,0xc1,0xc2,0xc3,0xc5,0xc6,0xc7,0xc9,0xca,0xcb,0xcd,0xce,0xcf].includes(marker);
    if (isFrame && length >= 7) {
      return { format: "jpeg", width: buffer.readUInt16BE(offset + 5), height: buffer.readUInt16BE(offset + 3), alphaChannel: false };
    }
    offset += length;
  }
  return null;
}

const records = [];
let missing = 0;
let invalid = 0;
for (const relativePath of candidates) {
  try {
    const bytes = await readFile(resolve(root, relativePath));
    const info = pngInfo(bytes) ?? jpegInfo(bytes);
    if (!info) invalid++;
    records.push({
      path: relativePath,
      bytes: bytes.length,
      sha256: createHash("sha256").update(bytes).digest("hex"),
      ...(info ?? { format: "unknown", width: null, height: null, alphaChannel: null }),
      aspectRatio: info && info.height ? Number((info.width / info.height).toFixed(5)) : null,
      reviewStatus: "approval-required",
      publicationAllowed: false,
    });
  } catch (error) {
    if (error?.code !== "ENOENT") throw error;
    missing++;
    records.push({ path: relativePath, missing: true, reviewStatus: "missing", publicationAllowed: false });
  }
}

const manifest = {
  schemaVersion: 1,
  generatedAt: new Date().toISOString(),
  note: "Technical inventory only. Hashes and dimensions do not establish provenance, rights, artwork identity, artist approval, or publication permission.",
  assets: records,
};
const output = JSON.stringify(manifest, null, 2) + "\n";
const outputArg = process.argv.find((arg) => arg.startsWith("--output="));
if (outputArg) {
  const target = resolve(root, outputArg.slice("--output=".length));
  await writeFile(target, output, "utf8");
} else {
  process.stdout.write(output);
}
if (missing || invalid) {
  console.error(`Asset audit found ${missing} missing and ${invalid} invalid or unsupported candidate file(s).`);
  process.exitCode = 1;
}
