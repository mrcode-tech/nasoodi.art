# Testing, Visual QA, and Release Acceptance

## 1. Verification principles

CI verifies application behavior and code quality. It does not decide whether editorial data is true, artist-approved, verified, or ready for publication. Content supplied in the canonical JSON files is rendered as stored.

## 2. Test layers

- Static: ESLint, TypeScript, translation-key parity, and source audits.
- Unit: pure formatting, route, URL/path safety, pagination, and repository behavior.
- Integration: localized routes, page rendering, metadata, and JSON-LD.
- Browser: English/Persian, LTR/RTL, responsive layouts, contact links, CV entries, PDF download, Journal and gallery navigation.
- Build/smoke: production build and server response.

Tests must reflect the actual canonical JSON data. Do not assert that CV, Contact, exhibitions, awards, publications, or Journal content is hidden until an approval or verification flag is set. Do not add editorial validation rules to tests.

## 3. Visual QA

Review both locales and common desktop, tablet, mobile, and short-height viewports. Check Persian shaping, RTL composition, artwork display, responsive reflow, focus behavior, and absence of horizontal overflow. Capture screenshots for materially changed surfaces.

## 4. Technical safety

Keep checks for valid application behavior, safe links and asset paths, stable route resolution, and graceful optional fields. These are technical safeguards, not editorial data-validation gates.

## 5. CI evidence

Record the exact commit SHA, workflow URL, conclusion, and failed step details. Distinguish automated CI results from visual review. Do not claim a check passed unless the corresponding run completed successfully.

## 6. Release workflow

Work only on the authorized branch and follow the repository's branch/deployment permissions. CI completion does not itself authorize merging or deployment.

## Image metadata verification

- Local `npm run dev` generates `src/content/data/image-metadata.json` from raster images in `public/images/`.
- Commit generated JSON with the corresponding image files.
- The `prebuild` lifecycle runs the generator with `--check`; CI must fail if an image is missing, unsupported/corrupt, metadata is stale, or a content JSON image reference points to a missing public file.
- Check mode is read-only. CI must not copy images, regenerate metadata, or alter the working tree.
- The generator validates technical file properties and references only. It does not determine ownership, rights, image identity, or editorial approval.
