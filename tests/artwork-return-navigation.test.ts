import assert from "node:assert/strict";
import test from "node:test";
import { buildArtworkReturnHref, resolveArtworkReturnHref } from "../src/lib/artwork-return-navigation";

for (const locale of ["en", "fa"] as const) {
  test(locale + " builds a return destination with the current page and page size", () => {
    assert.equal(buildArtworkReturnHref(locale, 3, 10), "/" + locale + "/works?page=3&pageSize=10");
    assert.equal(buildArtworkReturnHref(locale, 1, 6), "/" + locale + "/works");
    assert.equal(buildArtworkReturnHref(locale, 2, 20), "/" + locale + "/works?page=2&pageSize=20");
  });

  test(locale + " accepts only the same-locale Works archive and supported pagination state", () => {
    assert.equal(resolveArtworkReturnHref(locale, "/" + locale + "/works?page=3&pageSize=10"),
      "/" + locale + "/works?page=3&pageSize=10");
    assert.equal(resolveArtworkReturnHref(locale, "/" + locale + "/works?pageSize=20"),
      "/" + locale + "/works?pageSize=20");
    assert.equal(resolveArtworkReturnHref(locale, "/" + locale + "/works?page=1&pageSize=6"),
      "/" + locale + "/works");
  });

  test(locale + " falls back for missing, malformed, duplicated, unsupported, and unsafe values", () => {
    const fallback = "/" + locale + "/works";
    for (const candidate of [
      undefined,
      "",
      "https://example.invalid/" + locale + "/works",
      "//example.invalid/" + locale + "/works",
      "/other/works",
      "/" + (locale === "en" ? "fa" : "en") + "/works",
      "/" + locale + "/galleries",
      "/" + locale + "/works/../contact",
      "/" + locale + "/%2e%2e/works",
      "/" + locale + "/works?page=2&page=3",
      "/" + locale + "/works?pageSize=10&pageSize=20",
      "/" + locale + "/works?page=0",
      "/" + locale + "/works?page=1.5",
      "/" + locale + "/works?page=9007199254740992",
      "/" + locale + "/works?pageSize=15",
      "/" + locale + "/works?filter=anything",
      "/" + locale + "/works?%ZZ=1",
      "/" + locale + "/works#artwork",
      "/" + locale + "/works\\\\@example.invalid",
    ]) {
      assert.equal(resolveArtworkReturnHref(locale, candidate), fallback, String(candidate));
    }
  });
}
