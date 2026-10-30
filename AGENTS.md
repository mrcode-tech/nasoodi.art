# Repository guidance

## Project baseline

- This repository uses Next.js App Router, React, TypeScript, and Tailwind CSS.
- Application routes and layouts live under `src/app/`.
- Use strict TypeScript and prefer server components unless client-side interactivity is required.
- Keep dependencies minimal and use stable releases.

## Quality checks

Before submitting changes, run:

```bash
npm run lint
npm run typecheck
npm run build
```

## Implementation practices

- Build accessible, responsive interfaces.
- Use semantic HTML, visible focus states, and respect reduced-motion preferences.
- Keep page metadata accurate and update canonical/Open Graph metadata when the public site identity changes.
- Do not commit secrets. Keep environment-specific values in local environment files and document required variables in `.env.example`.
