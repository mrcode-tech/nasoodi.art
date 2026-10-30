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

## Design specification authority

For any user-facing visual, responsive, or interaction change, read and follow:
- specification/design-engineering-skills.md
- specification/design-direction-and-system-refinement.md
- The relevant page-specific specification under specification/

Do not implement generic visual patterns or motion without a clear purpose. Inspect existing tokens/components and actual assets first. Record rendered visual evidence for desktop, tablet, mobile, short-height, Persian RTL, English LTR, and reduced-motion states where applicable. Do not claim visual verification without inspecting rendered output.
