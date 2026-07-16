# Tasks: ITX Front-End Test — Mobile Shopping Mini-App

## Review Workload Forecast

| Field | Value |
|-------|-------|
| Estimated changed lines | ~2000-2800 (scaffold configs + 5 capabilities + tests + README) |
| 400-line budget risk | High |
| Chained PRs recommended | Yes |
| Suggested split | PR1 → PR2 → PR3 → PR4 → PR5 → PR6 (see Work Units) |
| Delivery strategy | ask-on-risk |
| Chain strategy | confirmed by user — `stacked-to-main` (each milestone commit is independently revertible) |

Decision needed before apply: No — resolved (delivery_strategy: ask-on-risk, chain_strategy: stacked-to-main, both confirmed by the user)
Chained PRs recommended: Yes
Chain strategy: stacked-to-main
400-line budget risk: High

### Suggested Work Units

| Unit | Goal | Likely PR | Notes |
|------|------|-----------|-------|
| 1 | Vite+Tailwind+shadcn+TanStack Query+Router+Vitest+ESLint scaffold, folder skeleton, README stub | PR 1 | Base: main. No feature code. |
| 2 | app-shell: routing, Header, Breadcrumbs, shared `ErrorState`/`Empty` | PR 2 | Depends on PR 1 |
| 3 | product-list: PLP grid, search, empty/error states, nav to PDP | PR 3 | Depends on PR 2 |
| 4 | product-detail: PDP layout, selectors, add-to-cart trigger, back link | PR 4 | Depends on PR 2 |
| 5 | cart: Context, mutation, localStorage persistence, header wiring | PR 5 | Depends on PR 2, PR 4 |
| 6 | api-cache TTL tests, app-shell nav coverage (JD-007), README finalize, script verification | PR 6 | Depends on all prior |

## Phase 1: Scaffold & Tooling (PR1)

- [x] 1.1 `git init`; add `.gitignore` (node_modules, dist)
- [x] 1.2 `npm create vite@latest . -- --template react` (JS, no TS)
- [x] 1.3 Install/configure Tailwind CSS (`tailwind.config.js`, `postcss.config.js`, CSS directives)
- [x] 1.4 `npx shadcn@latest init` (after Tailwind present, per design.md init-before-add decision)
- [x] 1.5 Install `@tanstack/react-query`, `react-router-dom`, `lucide-react`
- [x] 1.6 Install/configure Vitest + RTL (jsdom env, `setupTests.js`)
- [x] 1.7 Install/configure ESLint (`eslint.config.js`)
- [x] 1.8 Add `start`, `build`, `test`, `lint` scripts to `package.json`
- [x] 1.9 Create dirs: `src/product-list/`, `src/product-detail/`, `src/cart/`, `src/shared/`
- [x] 1.10 `README.md` stub: run instructions + SDD methodology section linking `openspec/changes/itx-front-end-test/{proposal,specs,design,tasks,review-ledger}`
- [x] 1.11 Commit: `chore: scaffold Vite+Tailwind+shadcn+TanStack Query+Router+Vitest+ESLint`

## Phase 2: app-shell (PR2)

- [x] 2.1 TDD `shared/lib/queryClient.{test,}.js`: staleTime/gcTime=3_600_000, retry:1 (api-cache TTL)
- [x] 2.2 `shared/lib/apiClient.js` — fetch wrapper, `BASE_URL`
- [x] 2.3 TDD `shared/router.{test.jsx,jsx}`: `/` ↔ `/product/:id` via `createBrowserRouter`, URL updates, no full reload (Client-Side Routing)
- [x] 2.4 TDD `shared/components/Header.{test,}.jsx`: title/icon links `/`, `Badge` cart count same position both routes (Shared Header, Cart Count Display)
- [x] 2.5 TDD `shared/components/Breadcrumbs.{test,}.jsx`: 1 level on `/`, 2 levels (link+current) on `/product/:id` (Breadcrumbs)
- [x] 2.6 TDD `shared/components/ErrorState.{test,}.jsx`: message + "Reintentar", click invokes retry callback (`Alert`+`Button`)
- [x] 2.7 TDD `shared/components/Empty.{test,}.jsx`: plain-text message, no throw — lives in `shared/components/` per JD-006 (matches `ErrorState`, not under `product-list/`)
- [x] 2.8 `App.jsx` (`<Header/>`+`<Outlet/>`), `main.jsx` (QueryClientProvider+CartProvider+RouterProvider)
- [x] 2.9 REFACTOR: extract shared shadcn `ui/` primitives used by 2.4-2.7
- [x] 2.10 Commit: `feat(app-shell): routing, header, breadcrumbs, shared error/empty UI`

## Phase 3: product-list (PR3)

- [x] 3.1 TDD `product-list/api/useProducts.{test,}.js`: `useQuery(['products'])` → `GET /api/product`
- [x] 3.2 TDD `ProductCard`/`ProductGrid.{test,}.jsx`: image/Marca/Modelo/Precio, ≤4/row wide, fewer per row narrow (Product Grid Rendering)
- [x] 3.3 `product-list/components/ProductGridSkeleton.jsx` (loading, `Skeleton`)
- [x] 3.4 TDD `SearchBar.{test,}.jsx` + `useMemo` filter in `ProductListPage.jsx`: filters Marca+Modelo per keystroke, no submit (Real-Time Search Filter)
- [x] 3.5 TDD empty-search case: zero matches renders shared `Empty`, input stays editable, no throw (Empty Search Result)
- [x] 3.6 TDD click card → `/product/X` router `Link`, no reload (Navigation to Product Detail)
- [x] 3.7 TDD fetch failure → `ErrorState`, "Reintentar" → `refetch()` recovers, no unhandled rejection (API Failure Handling)
- [x] 3.8 Commit: `feat(product-list): PLP grid, search, empty/error states, navigation`

## Phase 4: product-detail (PR4)

- [x] 4.1 TDD `product-detail/api/useProduct.{test,}.js`: `useQuery(['products', id])` → `GET /api/product/:id`
- [x] 4.2 TDD `ProductDetailPage.jsx` layout: image left; description above actions, right column (Two-Column Layout)
- [x] 4.3 TDD `DescriptionList.{test,}.jsx`: all 11 fields (Marca, Modelo, Precio, CPU, RAM, Sistema Operativo, Resolución de pantalla, Batería, Cámaras, Dimensiones, Peso) from API data
- [x] 4.4 TDD `OptionSelector.{test,}.jsx`: 1-option case pre-selected+shown; 2-7 options pre-selected+changeable; >7 options still all-rendered+pre-selected (JD-003 — explicit 1-option and >7-option coverage, not just 2-7)
- [x] 4.5 GREEN `OptionSelector.jsx`: `ToggleGroup`, `onValueChange={(v)=>{if(v) setSelection(v);}}` deselect guard; test repeat-click on pressed item keeps prior selection, never `undefined` colorCode/storageCode
- [x] 4.6 TDD `BackToListLink.{test,}.jsx`: click navigates PDP→`/`, no reload (Back Navigation to PLP)
- [x] 4.7 TDD `AddToCartButton.{test,}.jsx`: click sends `{id,colorCode,storageCode}`; pending state = shadcn `Spinner`+`data-icon`+`disabled` composition, not ad hoc `isPending`/`isLoading` props (JD-005) (Add-to-Cart Trigger)
- [x] 4.8 `product-detail/components/DetailSkeleton.jsx` (loading)
- [x] 4.9 TDD fetch failure → `ErrorState`, "Reintentar" recovers, no unhandled rejection (API Failure Handling)
- [x] 4.10 Commit: `feat(product-detail): PDP layout, selectors, add-to-cart, back link`

## Phase 5: cart (PR5)

- [x] 5.1 TDD `cart/CartContext.{test.jsx,jsx}` + `useCart.js`: lazy-inits `count` from `localStorage`
- [x] 5.2 TDD `cart/api/useAddToCart.{test,}.js`: POSTs exact `{id,colorCode,storageCode}`, `retry:0`, `onSuccess` overwrites count from response, no local increment (Add-to-Cart Request, Server Count as Source of Truth)
- [x] 5.3 TDD persistence: count written to `localStorage` on success, survives reload before next add (Cart Count Persistence)
- [x] 5.4 TDD cross-view: add on PDP updates Header immediately, stays updated after nav to PLP (App-Wide Count Exposure)
- [x] 5.5 TDD POST failure: `ErrorState` shown, count unchanged, no unhandled rejection; capture failed payload `P` at `mutate()` call time (mutation variables), NOT re-derived from live selector state; "Reintentar" resubmits exact `P` (JD-004), resolves `{count:N}` clears error (Add-to-Cart Failure Handling)
- [x] 5.6 Confirm no cart page/drawer; header count click has no cart-opening behavior (No Dedicated Cart View)
- [x] 5.7 Commit: `feat(cart): context, add-to-cart mutation, persistence, header wiring`

## Phase 6: api-cache tests, routing coverage, finalize (PR6)

- [x] 6.1 Fake-timer test: repeat `['products']` query <1h uses cache, no network call
- [x] 6.2 Fake-timer test: same rule for `['products', id]`
- [x] 6.3 Fake-timer test: query >1h old triggers refetch on next access, cache updated (Revalidation After Expiry)
- [x] 6.4 RTL test (JD-007): PLP card click navigates to PDP
- [x] 6.5 RTL test (JD-007): `BackToListLink` click navigates PDP→`/`
- [x] 6.6 RTL test (JD-007): header title/icon click navigates PDP→`/`
- [x] 6.7 RTL test (JD-007): breadcrumb root link navigates PDP→`/`
- [ ] 6.8 Finalize `README.md`: confirm start/build/test/lint instructions accurate, SDD methodology section links all 5 artifacts
- [ ] 6.9 Run `npx vitest run`, `npx vite build`, `npx eslint .` — all pass clean
- [ ] 6.10 Commit: `test(api-cache,app-shell): TTL + revalidation + routing coverage`; `docs: finalize README`
