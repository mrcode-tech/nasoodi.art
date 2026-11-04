# AI-Assisted Development and Code Quality Contract

**Status:** Project engineering guidance; approved external references, not runtime dependencies  
**Repository:** `mrcode-tech/nasoodi.art`  
**Scope:** Next.js, React, TypeScript, refactoring, internationalization, content/data boundaries, and AI-assisted code review  
**Working branch:** `feature` for current project work

## 1. Purpose

Give Claude Code and other AI coding agents a consistent, maintainable engineering workflow for this repository. The goal is not merely to make generated code compile. Changes must remain understandable to a human developer, preserve existing behavior, respect the product specifications, and avoid unnecessary abstractions.

This document records selected third-party Agent Skills as external references. It does not vendor their source code, install tools, change dependencies, or grant permission to implement application changes.

## 2. Selected skills and intended use

### 2.1 Vercel React Best Practices — required for React/Next.js work

- Repository: https://github.com/vercel-labs/agent-skills
- Skill directory: `skills/react-best-practices`
- Skill name: `vercel-react-best-practices`
- Entry point: https://github.com/vercel-labs/agent-skills/blob/main/skills/react-best-practices/SKILL.md
- License declared by the skill: MIT
- Use when creating, reviewing, debugging, or refactoring React components, Next.js routes, data fetching, rendering, or bundles.

The skill organizes performance guidance by impact, including async waterfalls, bundle size, server-side performance, client fetching, rerenders, rendering, JavaScript, and advanced patterns. Apply only relevant rules; do not optimize code without evidence or make performance changes that obscure intent.

Suggested Claude Code installation (review the source and current CLI behavior before running):
```bash
npx skills add vercel-labs/agent-skills --skill react-best-practices --agent claude-code
```

### 2.2 Frontend Convention Skills — required when architecture or code organization is in scope

- Repository: https://github.com/JoostKiens/frontend-convention-skills
- Relevant skill: `frontend-conventions:react-architecture`
- Other useful skills: `frontend-conventions:react`, `frontend-conventions:general`, and `frontend-conventions:accessibility`
- Repository and usage guide: https://github.com/JoostKiens/frontend-convention-skills
- License declared by the repository: MIT

Use `react-architecture` for folder structure, component layers, module boundaries, and separation of domain responsibilities. Use the narrower React/general/accessibility skills only when their scope is relevant.

The repository describes its conventions as defaults, not dogma. Existing repository rules, established code patterns, framework constraints, and this specification take precedence when there is a conflict. Read the project's ESLint and formatting configuration before proposing style changes.

The repository documents a Claude skills-directory installation:
```bash
git clone https://github.com/JoostKiens/frontend-convention-skills ~/.claude/skills/frontend-conventions
```
Review the repository's current structure and installation instructions before installing or updating it.

### 2.3 Patterns and Refactoring — required for non-trivial refactoring

- Repository: https://github.com/christianpasinrey/refactoring.guru-skill
- Skill directory: `skills/patterns-and-refactoring`
- Skill entry point: https://github.com/christianpasinrey/refactoring.guru-skill/tree/main/skills/patterns-and-refactoring
- License declared by the repository: MIT

Use this skill before significant restructuring or introducing a design pattern. Its intended workflow requires an explicit design decision, test-backed restructuring, and an audit of the resulting implementation. Its most valuable outcome may be deciding that no pattern or abstraction is needed.

The repository documents a Claude Code plugin and a plain skill-directory installation. For a plain installation, use the `skills/patterns-and-refactoring` directory under the user's Claude skills directory, following the repository's current README. Do not run an installer or plugin command without reviewing what it changes.

### 2.4 i18n for Next.js — advisory reference for localization work

- Repository: https://github.com/javainthinking/i18n-nextjs
- Skill name: `i18n-nextjs`
- Entry point: https://github.com/javainthinking/i18n-nextjs/blob/main/SKILL.md
- License declared by the repository: MIT

Use it as a checklist/reference for translation resource organization, locale-aware metadata, hreflang, structured data, and multilingual sitemap design. It is not an authoritative routing template for this repository.

**Known incompatibilities that must be checked rather than copied:**
- Its examples assume a clean, unprefixed URL for the default locale, while this project currently has explicit `/en` and `/fa` locale-prefixed routes. Preserve the existing URL contract unless a separate approved specification explicitly changes it.
- Its routing examples use `middleware.ts`. Check the installed Next.js version and official version-matched docs; do not copy legacy routing entry-point conventions blindly (including whether the current version requires `proxy.ts`).
- Its example directory layout and dictionary hooks are illustrative, not requirements. Follow the approved `internationalization-and-ui-translation-architecture.md` and the actual project structure.
- It contains fallback examples. Do not silently hide missing translations with English fallback prose where project localization governance requires translation parity or an explicit missing-content state.

## 3. Official framework documentation is authoritative

Before changing Next.js or React behavior:
1. Read the installed versions from `package.json` and the lockfile.
2. When the installed Next.js package provides bundled documentation, read the relevant version-matched docs under `node_modules/next/dist/docs/`.
3. Use official React and Next.js documentation for current API behavior.
4. Treat third-party skills as advisory guidance. Resolve conflicts in favor of the installed framework version, repository architecture, approved specifications, accessibility, and tested behavior.

Reference: https://nextjs.org/docs/app/guides/ai-agents

The official Next.js AI-agent guide describes version-matched docs bundled with the installed `next` package and recommends directing agents to those docs through repository instructions. Confirm the actual installed version and available docs before relying on a particular path or setup requirement.

## 4. Mandatory agent behavior

For all non-trivial React/Next.js/TypeScript work:

1. Read `AGENTS.md`, this document, `specification/README.md`, and the relevant domain specifications.
2. Inspect the actual source, route hierarchy, package versions, scripts, lint configuration, tests, and current branch/worktree before proposing edits.
3. Invoke/read the selected skill relevant to the task if it is installed and available. If unavailable, read its public `SKILL.md` and apply relevant guidance manually. Never claim a skill was invoked or installed unless verified.
4. State which guidance is relevant and identify any conflict with project specifications before editing.
5. Prefer the smallest change that solves the demonstrated problem. Do not introduce an abstraction, generic framework, dependency, layer, or design pattern solely for hypothetical future flexibility.
6. Preserve public routes, locale prefixes, content, metadata, accessibility, RTL/LTR behavior, and existing interactions unless the task explicitly authorizes changing them.
7. Keep refactoring and behavior changes separate where practical. A structural refactor should preserve observable behavior.
8. Add or update focused tests before/alongside risky refactors. Use characterization/regression tests when existing behavior is insufficiently documented.
9. Run the relevant lint, type-check, unit/component/E2E tests, and production build using the repository's actual scripts. Inspect failures and CI logs; do not report success from a partial or still-running check.
10. Review the final diff for duplicated logic, accidental scope expansion, dead code, unnecessary dependencies, weak names, complex components, accessibility regressions, and localization regressions.
11. Report files changed, decisions, tests actually run, CI result, remaining risks, and any work intentionally deferred.

## 5. Refactoring protocol

Use a behavior-preserving, incremental process:

### Inspect
- Identify the code smell or maintenance problem with concrete examples.
- Trace callers, data flow, side effects, route dependencies, and tests.
- Determine whether the issue is local or indicates a genuine cross-module boundary problem.
- Record current behavior that must remain unchanged.

### Plan
- Propose small steps with explicit boundaries and expected outcomes.
- Choose the simplest applicable refactoring technique.
- Explain whether a new abstraction is justified by repeated use or a stable domain concept.
- Identify tests that protect the existing behavior.

### Refactor
- Make one coherent structural change at a time.
- Avoid mixing formatting-only churn, unrelated cleanup, feature work, and dependency upgrades.
- Preserve names/contracts where external references depend on them; update all references safely when a rename is intended.
- Do not replace readable code with dense abstractions or clever generic utilities.

### Verify
- Run focused tests after each meaningful step.
- Run broader checks after the sequence.
- Compare behavior and inspect the diff.
- Stop and report if the existing behavior cannot be established or safely protected.

## 6. Internationalization and content boundaries

The following concerns must remain separate:

- **UI translations:** navigation labels, buttons, validation messages, settings labels, and other interface copy belong in the approved locale message resources.
- **Editorial content:** artist profile, statement, biography, CV, artwork descriptions, gallery copy, Journal entries, events, and contact content belong in the approved content architecture.
- **Domain types and validation:** schemas, types, IDs, relationships, and validation rules are not UI translations or editorial prose.
- **Application logic:** routing, content resolution, formatting, rendering, and generic utilities remain in application modules.

For i18n refactors:
- Preserve `/en` and `/fa` routes and locale-switching semantics.
- Keep Persian RTL and English LTR behavior correct, including keyboard order and directional UI.
- Do not put locale-specific copy in component conditionals.
- Keep locale messages semantically organized and parity-checked.
- Keep SEO metadata, canonical URLs, hreflang, sitemap, and structured data consistent with the same resolved localized page/content identity.
- Do not invent translations of artist-authored editorial content. Missing or unapproved editorial translations must follow the content governance specification.
- Do not move editorial content into UI message bundles merely because it is localized.

The detailed implementation authorities remain:
- `specification/internationalization-and-ui-translation-architecture.md`
- `specification/content-architecture-and-data-separation.md`
- `specification/international-seo-and-search-discovery-architecture.md`
- `specification/localization-and-editorial-governance.md`
- `specification/content-model.md`

## 7. Skill security, maintenance, and portability

- Skills are instructions, not trusted executable code. Inspect their source, scripts, install hooks, permissions, network behavior, and license before installation or execution.
- Prefer the minimum required skills; overlapping instructions can create inconsistent recommendations and consume context.
- Do not automatically install, update, or execute a third-party skill as part of an application task.
- Pin or record a reviewed commit/tag when adopting a skill in a reproducible team workflow. Re-review before updating to a new upstream revision.
- Do not copy third-party skill source into this repository unless explicitly approved. This specification records references and usage policy only.
- Claude Code-specific invocation syntax is not portable to every agent. For OpenCode or another agent, use its supported skill discovery mechanism or read the skill's `SKILL.md` directly; do not pretend Claude-specific commands are universal.
- A skill never overrides repository instructions, user authorization, security policy, tests, or approved product specifications.

## 8. Not selected as mandatory

Other candidates were discovered, but are not part of the mandatory baseline at this time:
- `bastndev/skills` `end`: its broad audit/refactor workflow overlaps with the selected refactoring skill; reconsider only if a specific need emerges.
- Generic TypeScript clean-code collections: the selected frontend convention skill already covers TypeScript/React conventions; avoid duplicating rules.
- `openclaudia/openclaudia-skills` i18n: another plausible next-intl-oriented candidate, but not selected without a separate source and compatibility review.

This is a deliberately small baseline, not an exhaustive list of available skills.

## 9. Adoption and review checklist

- [ ] Confirm installed Next.js, React, and TypeScript versions.
- [ ] Review the current upstream skill source and license before installation.
- [ ] Record the exact reviewed commit/tag for reproducible team use.
- [ ] Ensure the skill is available to the coding agent that will perform the task.
- [ ] Read project instructions and the relevant specifications first.
- [ ] Invoke/read only the skill relevant to the current task.
- [ ] Resolve any conflict with current routes, app structure, or project standards before coding.
- [ ] Keep changes incremental and behavior-preserving.
- [ ] Verify with tests, type checks, lint, build, and CI as applicable.

**Last reviewed:** 2026-11-04. Recheck upstream sources before installation or future use; this document is a reviewed snapshot of recommendations, not a guarantee that upstream skills remain unchanged.
