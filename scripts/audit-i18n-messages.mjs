import { readdirSync, readFileSync } from "node:fs";
import { resolve, extname, relative } from "node:path";
import ts from "typescript";

const messageRoot = resolve("src/i18n/messages");
const sourceRoots = [resolve("src/app"), resolve("src/components")];
const sourceExtensions = new Set([".tsx", ".ts", ".jsx", ".js"]);
const visibleAttributes = new Set([
  "alt", "aria-label", "aria-description", "aria-roledescription",
  "placeholder", "title", "label", "value", "emptytext", "description",
]);
const technicalAttributes = new Set([
  "className", "class", "id", "key", "name", "type", "role", "href",
  "src", "target", "rel", "method", "action", "slot", "part",
  "data-testid", "suppressHydrationWarning",
]);
const knownBrandAndProperNames = new Set([
  "Nasoodi.art", "Instagram", "GitHub", "Next.js", "React", "TypeScript",
  "Vercel", "Radix", "Embla", "shadcn/ui",
]);
const uiMessagePropertyNames = new Set([
  "label", "title", "description", "placeholder", "emptyMessage",
  "helperText", "errorMessage", "successMessage", "ariaLabel",
]);

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
    return entry.isDirectory() ? walk(path) : sourceExtensions.has(extname(entry.name)) ? [path] : [];
  });
}

function hasUserFacingText(value, jsxText = false) {
  const text = value.trim();
  if (!text || knownBrandAndProperNames.has(text)) return false;
  if (!/[A-Za-z\u0600-\u06FF]/u.test(text)) return false;
  if (/[\u0600-\u06FF]/u.test(text)) return true;
  return jsxText || /\s|[!?.,:;()[\]{}]/u.test(text);
}

function hasExceptionComment(sourceText, node) {
  const leading = sourceText.slice(node.getFullStart(), node.getStart());
  return /i18n-literal-ok/u.test(leading);
}

function auditSource(file) {
  const sourceText = readFileSync(file, "utf8");
  const scriptKind = file.endsWith(".tsx") ? ts.ScriptKind.TSX
    : file.endsWith(".jsx") ? ts.ScriptKind.JSX
    : ts.ScriptKind.TS;
  const source = ts.createSourceFile(file, sourceText, ts.ScriptTarget.Latest, true, scriptKind);
  const violations = [];
  const report = (node, value) => {
    if (!hasUserFacingText(value) || hasExceptionComment(sourceText, node)) return;
    const position = source.getLineAndCharacterOfPosition(node.getStart(source));
    violations.push({
      line: position.line + 1,
      text: value.trim().replace(/\s+/gu, " ").slice(0, 100),
    });
  };

  function visit(node) {
    if (ts.isJsxText(node)) {
      if (hasUserFacingText(node.getText(source), true) && !hasExceptionComment(sourceText, node)) {
        const position = source.getLineAndCharacterOfPosition(node.getStart(source));
        violations.push({
          line: position.line + 1,
          text: node.getText(source).trim().replace(/\s+/gu, " ").slice(0, 100),
        });
      }
    }

    if (ts.isJsxAttribute(node) && node.initializer) {
      const name = node.name.getText(source);
      if (!technicalAttributes.has(name) && visibleAttributes.has(name.toLowerCase())) {
        if (ts.isStringLiteral(node.initializer)) report(node.initializer, node.initializer.text);
        if (ts.isJsxExpression(node.initializer) && node.initializer.expression &&
            (ts.isStringLiteral(node.initializer.expression) || ts.isNoSubstitutionTemplateLiteral(node.initializer.expression))) {
          report(node.initializer.expression, node.initializer.expression.text);
        }
      }
    }

    if (ts.isPropertyAssignment(node) && ts.isIdentifier(node.name) &&
        uiMessagePropertyNames.has(node.name.text) &&
        (ts.isStringLiteral(node.initializer) || ts.isNoSubstitutionTemplateLiteral(node.initializer))) {
      report(node.initializer, node.initializer.text);
    }

    if (ts.isCallExpression(node) && ts.isIdentifier(node.expression) &&
        ["alert", "confirm", "prompt"].includes(node.expression.text)) {
      for (const argument of node.arguments) {
        if (ts.isStringLiteral(argument) || ts.isNoSubstitutionTemplateLiteral(argument)) report(argument, argument.text);
      }
    }

    ts.forEachChild(node, visit);
  }

  visit(source);
  return violations.map((violation) => ({
    file: relative(process.cwd(), file).replaceAll("\\", "/"),
    ...violation,
  }));
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

const hardcodedUiLiterals = sourceRoots.flatMap((root) => walk(root)).flatMap(auditSource);
if (hardcodedUiLiterals.length) {
  errors.push("Hardcoded user-facing UI literals must live in locale message resources:");
  for (const item of hardcodedUiLiterals) errors.push("  " + item.file + ":" + item.line + " — " + item.text);
}

if (errors.length) {
  console.error("Bilingual message governance validation failed:");
  for (const error of errors) console.error(" - " + error);
  process.exitCode = 1;
} else {
  console.log(
    "Validated " + englishKeys.length +
    " bilingual message keys across " + english.files.length +
    " matching namespaces; placeholders, non-empty values, and AST-based UI literal boundaries are consistent."
  );
}
