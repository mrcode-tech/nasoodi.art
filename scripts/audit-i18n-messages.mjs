import { readdirSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

const load = (locale) => {
  const directory = resolve("src/i18n/messages", locale);
  const resources = readdirSync(directory).filter((file) => file.endsWith(".json"));
  return Object.assign({}, ...resources.map((file) => JSON.parse(readFileSync(resolve(directory, file), "utf8"))));
};

const english = load("en");
const persian = load("fa");
const englishKeys = Object.keys(english).sort();
const persianKeys = Object.keys(persian).sort();
const missingInPersian = englishKeys.filter((key) => !(key in persian));
const missingInEnglish = persianKeys.filter((key) => !(key in english));
const placeholders = (value) => [...value.matchAll(/\{([A-Za-z0-9_]+)\}/g)].map((match) => match[1]).sort();
const placeholderMismatches = englishKeys
  .filter((key) => key in persian)
  .filter((key) => JSON.stringify(placeholders(english[key])) !== JSON.stringify(placeholders(persian[key])));

if (missingInPersian.length || missingInEnglish.length || placeholderMismatches.length) {
  console.error("Bilingual message catalog validation failed.");
  if (missingInPersian.length) console.error("Missing in fa:", missingInPersian.join(", "));
  if (missingInEnglish.length) console.error("Missing in en:", missingInEnglish.join(", "));
  if (placeholderMismatches.length) console.error("Placeholder mismatches:", placeholderMismatches.join(", "));
  process.exitCode = 1;
} else {
  const domains = readdirSync(resolve("src/i18n/messages/en")).filter((file) => file.endsWith(".json")).length;
  console.log("Validated " + englishKeys.length + " bilingual message keys across " + domains + " domains with matching placeholders.");
}
