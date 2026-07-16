# Proposal: ITX Front-End Test — Mobile Shopping Mini-App

## Intent

Deliver the Inditex front-end take-home: a mobile-first shopping SPA with two views (PLP, PDP) backed by `https://itx-frontend-test.onrender.com/`. Success = both views work, real-time search filters, cart count persists across views, API responses cached 1h, and all four npm scripts (start/build/test/lint) run clean. Source: `1. ITX - Front End Test 1.pdf`.

## Scope

### In Scope
- **PLP**: `GET /api/product`, responsive grid (max 4/row), real-time search by Marca + Modelo, click → PDP.
- **PDP**: `GET /api/product/:id`, two-column layout (left image; right DESCRIPTION + ACTIONS), storage + color selectors (always shown, pre-selected even with one option), "Añadir" button, back link to PLP.
- **Header** (shared): title/icon → PLP, breadcrumbs with navigation, cart count on the right.
- **Cart**: `POST /api/cart` `{id,colorCode,storageCode}` → `{count}`; count persisted (localStorage) via Context, shown in header across views.
- **API caching**: TanStack Query `staleTime` 1h, revalidate after expiry.
- **Edge — empty search**: zero matches renders a plain text empty state (e.g. "No se encontraron productos"), search input stays active, no broken grid, no throw.
- **Edge — API failure**: PLP fetch, PDP fetch, and cart POST each render a visible error state with a "Reintentar" button that re-triggers the failed query/mutation; no silent failures, no unhandled rejections.

### Out of Scope
- Checkout/payment flow, user auth, a full cart page (brief asks only for the header counter).
- TypeScript, SSR/MPA, product write/edit, i18n beyond existing Spanish labels.

## Capabilities

### New Capabilities
- `product-list`: PLP grid, real-time brand+model search, empty state, navigation to PDP.
- `product-detail`: PDP two-column layout, description fields, storage/color selectors, add-to-cart trigger, back link.
- `cart`: add-to-cart request, count persistence (localStorage + Context), header count display.
- `app-shell`: SPA client routing, shared header with breadcrumbs, error/empty UX shell.
- `api-cache`: 1h TTL caching and post-expiry revalidation for all API reads.

### Modified Capabilities
- None (brand-new project).

## Approach

Vite + React (JS, no TS). React Router for two routes (`/`, `/product/:id`). Tailwind + shadcn/ui for layout/components. TanStack Query for fetching/caching (staleTime 1h). Cart count in a Context hydrated from localStorage, updated from the POST response `count`. Vitest + RTL for tests, ESLint for lint. Screaming Architecture: `product-list/`, `product-detail/`, `cart/`, `shared/`. Commit evolutionarily toward milestones; README present from first commit.

The `openspec/changes/itx-front-end-test/` folder (proposal, specs, design, tasks) is committed to the repo as-is — it is not tooling scratch, it is the deliverable's documentation trail. The README must explicitly reference this SDD (Spec-Driven Development) methodology and link to these artifacts, since the brief asks for evidence of AI-assisted development practice, not just working code.

## Affected Areas

| Area | Impact | Description |
|------|--------|-------------|
| project root | New | Vite scaffold, package.json scripts, ESLint/Tailwind/Vitest config, README |
| `src/product-list/` | New | PLP view, grid, search, empty state |
| `src/product-detail/` | New | PDP view, selectors, add-to-cart |
| `src/cart/` | New | Cart Context, localStorage persistence, count |
| `src/shared/` | New | Router, header/breadcrumbs, API client, TanStack Query cache, error UI |

## Risks

| Risk | Likelihood | Mitigation |
|------|------------|------------|
| Onrender API cold-starts / slow first response | Med | Loading + error states with manual "Reintentar" action; 1h cache reduces calls |
| shadcn/ui + Tailwind setup friction with Vite (no TS) | Low | Use documented JS setup; minimal component subset |
| localStorage cart count drifts from server | Low | Treat POST response `count` as source of truth on each add |

## Rollback Plan

Greenfield repo — rollback = revert to the prior commit or drop the change branch. No production data or migrations. Each milestone commit is independently revertible.

## Dependencies

- Public API `https://itx-frontend-test.onrender.com/` availability.
- npm registry access for Vite/React/Router/Tailwind/shadcn/TanStack Query/Vitest/ESLint.

## Success Criteria

- [ ] PLP lists all products; search filters by brand+model in real time; empty state on zero matches.
- [ ] PDP shows all description fields + selectors (pre-selected); "Añadir" posts and updates header count.
- [ ] Cart count persists across views and reloads via localStorage.
- [ ] API reads cached 1h and revalidate after expiry.
- [ ] PLP fetch, PDP fetch, and cart POST failures show visible error states (no silent failure).
- [ ] `start`, `build`, `test`, `lint` scripts all succeed.
- [ ] README (present from first commit) explains the SDD methodology followed and links to `openspec/changes/itx-front-end-test/` (proposal, specs, design, tasks).
