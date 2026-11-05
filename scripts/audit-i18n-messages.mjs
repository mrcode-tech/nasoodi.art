import { readdirSync, readFileSync } from "node:fs";
import { resolve, extname } from "node:path";

const messageRoot = resolve("src/i18n/messages");
const sourceRoots = [resolve("src/app"), resolve("src/components")];

function flatten(value, prefix = "", output = {}) {
  if (typeof value === "string") {
    output[prefix] = value;
    return output;
  }
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    throw new Error("Message values must be strings or nested objects at " + (prefix || "<root>"));
  }
  for (const [key, child] of Object.entries(value)) {
    flatten(child, prefix ? prefix + "." + key : key, output);
  }
  return output;
}

function load(locale) {
  const directory = resolve(messageRoot, locale);
  const files = readdirSync(directory).filter((file) => file.endsWith(".json")).sort();
  const messages = {};
  const errors = [];
  if (files.length === 0) errors.push(locale + " has no JSON message namespaces.");
  for (const file of files) {
    let parsed;
    try {
      parsed = JSON.parse(readFileSync(resolve(directory, file), "utf8"));
    } catch (error) {
      errors.push(locale + "/" + file + ": invalid JSON (" + error.message + ")");
      continue;
    }
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
      errors.push(locale + "/" + file + ": namespace root must be an object.");
      continue;
    }
    const flattened = flatten(parsed);
    for (const [key, value] of Object.entries(flattened)) {
      if (Object.prototype.hasOwnProperty.call(messages, key)) {
        errors.push(locale + ": duplicate message key '" + key + "' across namespace files.");
        continue;
      }
      if (!value.trim()) errors.push(locale + ": empty message value for '" + key + "'.");
      messages[key] = value;
    }
  }
  return { files, messages, errors };
}

function walk(directory) {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = resolve(directory, entry.name);
    return entry.isDirectory() ? walk(path) : extname(entry.name) === ".tsx" ? [path] : [];
  });
}

const english = load("en");
const persian = load("fa");
const errors = [...english.errors, ...persian.errors];
const englishKeys = Object.keys(english.messages).sort();
const persianKeys = Object.keys(persian.messages).sort();
const missingInPersian = englishKeys.filter((key) => !(key in persian.messages));
const missingInEnglish = persianKeys.filter((key) => !(key in english.messages));
const namespaceMismatch = english.files.filter((file) => !persian.files.includes(file))
  .concat(persian.files.filter((file) => !english.files.includes(file)));
const placeholders = (value) => [...value.matchAll(/\{\s*([A-Za-z0-9_]+)\s*(?:,[^}]*)?\}/g)]
  .map((match) => match[1]).sort();
const placeholderMismatches = englishKeys
  .filter((key) => key in persian.messages)
  .filter((key) => JSON.stringify(placeholders(english.messages[key])) !== JSON.stringify(placeholders(persian.messages[key])));
if (missingInPersian.length) errors.push("Missing in fa: " + missingInPersian.join(", "));
if (missingInEnglish.length) errors.push("Missing in en: " + missingInEnglish.join(", "));
if (namespaceMismatch.length) errors.push("Namespace file mismatch: " + [...new Set(namespaceMismatch)].join(", "));
if (placeholderMismatches.length) errors.push("Placeholder mismatches: " + placeholderMismatches.join(", "));

const hardcodedPersian = [];
for (const root of sourceRoots) {
  for (const file of walk(root)) {
    const source = readFileSync(file, "utf8")
      .replace(/\/\*[\s\S]*?\*\//g, "")
      .replace(/(^|\s)\/\/.*$/gm, "$1");
    if (/[\u0600-\u06FF]/u.test(source)) hardcodedPersian.push(file.replace(process.cwd() + "/", ""));
  }
}
if (hardcodedPersian.length) {
  errors.push("Persian UI literals must live in locale message resources: " + hardcodedPersian.join(", "));
}

if (errors.length) {
  console.error("Bilingual message governance validation failed:");
  for (const error of errors) console.error(" - " + error);
  process.exitCode = 1;
} else {
  console.log(
    "Validated " + englishKeys.length +
    " bilingual message keys across " + english.files.length +
    " matching namespaces; placeholders, non-empty values, and component translation boundaries are consistent."
  );
}
