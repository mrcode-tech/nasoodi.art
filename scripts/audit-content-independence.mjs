import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const contentFiles = [
  "src/content/data/artist-profile.json",
  "src/content/data/cv.json",
  "src/content/data/contact.json",
  "src/content/data/artworks.json",
  "src/content/data/galleries.json",
  "src/content/data/journal/index.json",
  "src/content/data/homepage-selection.json",
];

const editorialKeys = new Set([
  "name", "title", "slug", "description", "summary", "biography", "statement",
  "body", "text", "heading", "caption", "alt", "altText", "image", "imagePath",
  "primaryImage", "coverArtworkId", "artworkIds", "featuredArtworkIds",
  "featuredGalleryIds", "email", "handle", "url", "value", "filename", "src",
  "publicationDate", "date", "id", "pdf",
]);

const editorialValues = new Set();

function collect(value, key = "") {
  if (typeof value === "string") {
    const normalized = value.trim();
    if (editorialKeys.has(key) && normalized.length >= 4) editorialValues.add(normalized);
    return;
  }
  if (Array.isArray(value)) {
    for (const item of value) collect(item, key);
    return;
  }
  if (value && typeof value === "object") {
    for (const [childKey, childValue] of Object.entries(value)) collect(childValue, childKey);
  }
}

for (const file of contentFiles) {
  const absolute = path.join(root, file);
  if (!fs.existsSync(absolute)) continue;
  collect(JSON.parse(fs.readFileSync(absolute, "utf8")));
}

function walk(directory) {
  if (!fs.existsSync(directory)) return [];
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(directory, entry.name);
    if (entry.isDirectory()) return walk(full);
    return [full];
  });
}

const scanFiles = [
  ...walk(path.join(root, "specification")).filter((file) => file.endsWith(".md")),
  ...walk(path.join(root, "tests")).filter((file) => /\.(?:ts|tsx|js|mjs)$/.test(file)),
];

const failures = [];
const normalizedValues = [...editorialValues]
  .filter((value) => value.length >= 5)
  .map((value) => ({ value, normalized: value.toLocaleLowerCase() }));

for (const file of scanFiles) {
  const source = fs.readFileSync(file, "utf8");
  const normalizedSource = source.toLocaleLowerCase();
  for (const item of normalizedValues) {
    if (normalizedSource.includes(item.normalized)) {
      failures.push(path.relative(root, file) + " contains production editorial value: " + item.value.slice(0, 100));
    }
  }

  if (file.includes(path.sep + "tests" + path.sep)) {
    const lines = source.split(/\r?\n/);
    const contentSelector = /(?:\.artwork-item|\.gallery-index-card|\.journal-card|\.cv-category|\.cv-list\s+li|\.gallery-card|\.carousel-item)/;
    for (let index = 0; index < lines.length; index += 1) {
      if (contentSelector.test(lines[index]) && /\.toHaveCount\(\s*\d+\s*\)/.test(lines[index])) {
        failures.push(path.relative(root, file) + ":" + (index + 1) + " asserts a fixed production content count");
      }
    }

    const aliases = [];
    const declaration = /(?:const|let)\s+([A-Za-z_$][\w$]*)\s*=\s*[^;\n]*\.locator\(["']([^"']+)["']\)/g;
    for (const match of source.matchAll(declaration)) {
      if (contentSelector.test(match[2])) aliases.push(match[1]);
    }
    for (const alias of aliases) {
      const assertion = new RegExp("\\b" + alias + "\\b[^;\\n]{0,100}\\.toHaveCount\\(\\s*\\d+\\s*\\)");
      if (assertion.test(source)) failures.push(path.relative(root, file) + " asserts a fixed count through content locator " + alias);
    }
  }
}

if (failures.length) {
  console.error("Content-independence audit failed:");
  for (const failure of [...new Set(failures)]) console.error("- " + failure);
  process.exitCode = 1;
} else {
  console.log("Content-independence audit passed (" + scanFiles.length + " technical documents and test files scanned).");
}
