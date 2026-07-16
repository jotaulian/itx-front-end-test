# ITX Front-End Test — Mobile Shopping Mini-App

Front-end technical test for Inditex: a mobile-first shopping single-page app with a
product list (PLP) and product detail (PDP) view, backed by the public API
`https://itx-frontend-test.onrender.com/`. Built with Vite + React (JavaScript, no
TypeScript). Source brief: `1. ITX - Front End Test 1.pdf`.

## Prerequisites

- Node.js 20 or newer (LTS recommended)
- npm 10 or newer (ships with recent Node)

## Install

```bash
npm install
```

## Scripts

| Command | What it does |
|---|---|
| `npm start` | Runs the app in development mode (Vite dev server with HMR). |
| `npm run build` | Builds an optimized production bundle into `dist/`. |
| `npm test` | Runs the test suite once with Vitest (`vitest run`). |
| `npm run lint` | Lints the codebase with ESLint. |

`npm run dev` and `npm run preview` are also available (standard Vite scripts) for local
development and previewing a production build, respectively.

## Tech Stack

| Tool | Why |
|---|---|
| **Vite** | Fast dev server and build tooling for a JS-only React SPA — no bundler config overhead. |
| **React (JS, no TS)** | Brief scope excludes TypeScript; functional components + hooks are enough for two views. |
| **React Router** | Client-side routing between `/` (PLP) and `/product/:id` (PDP) without full page reloads. |
| **Tailwind CSS + shadcn/ui** | Utility-first styling plus accessible, composable primitives (Card, ToggleGroup, Badge, Alert, Skeleton, etc.) instead of hand-rolled UI. |
| **TanStack Query** | Server-state fetching/caching with a 1-hour `staleTime`/`gcTime` to satisfy the brief's cache requirement, plus built-in loading/error flags for retry UX. |
| **Vitest + React Testing Library** | Fast, Vite-native unit/integration testing with a jsdom environment, driven by Strict TDD (RED → GREEN → REFACTOR). |
| **ESLint** | Static analysis to keep the codebase consistent and catch common React mistakes. |

## Project Structure

Organized by **Screaming Architecture** (feature-first, not layer-first):

```
src/
├── product-list/     # PLP: grid, search, empty/error states
├── product-detail/   # PDP: layout, selectors, add-to-cart, back link
├── cart/              # Cart Context, localStorage persistence, mutation
└── shared/            # Router, header/breadcrumbs, API client, query cache, shared UI
```

## API Notes

- Base URL: `https://itx-frontend-test.onrender.com/`
- This is a **free-tier Render service**, so the first request after a period of
  inactivity can be slow (cold start) — sometimes tens of seconds. The app's
  loading/error UI is designed to handle this gracefully: a visible loading state
  while waiting, and on failure a clear error message with a "Reintentar" (Retry)
  button rather than a silent failure.

## Development Methodology: Spec-Driven Development (SDD)

This project was built following a **Spec-Driven Development** workflow rather than
writing code directly from the brief. Every phase produced a reviewable artifact before
implementation started:

- [`openspec/changes/itx-front-end-test/proposal.md`](openspec/changes/itx-front-end-test/proposal.md) — scope, capabilities, risks, rollback plan.
- [`openspec/changes/itx-front-end-test/specs/`](openspec/changes/itx-front-end-test/specs/) — per-capability requirements (`product-list`, `product-detail`, `cart`, `app-shell`, `api-cache`) written as Given/When/Then scenarios with RFC 2119 keywords.
- [`openspec/changes/itx-front-end-test/design.md`](openspec/changes/itx-front-end-test/design.md) — architecture decisions, component breakdown, data flow, and sequence diagrams.
- [`openspec/changes/itx-front-end-test/tasks.md`](openspec/changes/itx-front-end-test/tasks.md) — phased, numbered implementation plan (this scaffold is Phase 1 / PR1 of 6).
- [`openspec/changes/itx-front-end-test/review-ledger.md`](openspec/changes/itx-front-end-test/review-ledger.md) — adversarial review record.

Before implementation began, the design went through a **Judgment Day** adversarial
review round: two independent reviewers ("blind judges") audited `design.md` against
the specs and proposal. That round caught **2 CRITICAL design issues** — a missing
component for a spec-mandated PDP "back to list" link, and an unguarded `ToggleGroup`
deselect behavior that could have sent an `undefined` `colorCode`/`storageCode` to the
cart API — both fixed and re-verified by both judges before any application code was
written (see `review-ledger.md` for the full findings table). This is included as
evidence of a verified AI-assisted development process, not just a working app.

## Delivery Strategy: Chained PRs

Given the estimated size of the full implementation (~2000-2800 changed lines across
five capabilities), the work is delivered as a **stacked chain of PRs**, one per
milestone, each independently reviewable and revertible:

1. **PR1 — Scaffold & Tooling** (this commit): Vite, Tailwind, shadcn/ui, TanStack
   Query, React Router, Vitest + RTL, ESLint, folder skeleton, this README.
2. **PR2 — app-shell**: routing, header, breadcrumbs, shared error/empty UI.
3. **PR3 — product-list**: PLP grid, search, empty/error states, navigation.
4. **PR4 — product-detail**: PDP layout, selectors, add-to-cart trigger, back link.
5. **PR5 — cart**: Context, mutation, persistence, header wiring.
6. **PR6 — api-cache & routing coverage**: TTL/revalidation tests, navigation test
   coverage, README finalization.

This mirrors the brief's request for evolutionary commits that reach concrete
milestones, and keeps each reviewable diff within a reasonable size budget.
