# Public image assets

All files in this directory are served directly by Next.js. Keep each image in one canonical location and reference it from content JSON rather than duplicating it for each page or use.

- artworks/: canonical painting images; reuse artwork IDs in galleries, homepage selections, and Journal entries.
- artist/: artist portraits and studio/process photographs.
- exhibitions/: exhibition-specific posters, venue photographs, and installation documentation.
- journal/: Journal-specific imagery and the editable Journal announcement SVG.
- decorative/: non-editorial decorative assets.

After adding, replacing, or removing raster images, run npm run images:generate (npm run dev runs it automatically before starting). Commit the changed image files together with src/content/data/image-metadata.json. CI verifies the committed metadata and all root-relative image references; it does not copy files or regenerate metadata.
