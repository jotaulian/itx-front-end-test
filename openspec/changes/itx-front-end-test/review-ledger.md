# Review Ledger — itx-front-end-test

## Judgment Day — Round 1 — Target: `design.md`

Two blind judges (A, B) reviewed `design.md` against `proposal.md` and the 5 specs (`product-list`, `product-detail`, `cart`, `app-shell`, `api-cache`), with `shadcn`, `tanstack-query-best-practices`, and `vercel-react-best-practices` skills loaded.

| id | lens | location | severity | status | evidence |
|---|---|---|---|---|---|
| JD-001 | judgment-day | `design.md` Component/Module Breakdown + `product-detail/` file layout | CRITICAL | verified | `product-detail/spec.md` has a standalone MUST **Requirement: Back Navigation to PLP** with its own scenario; `proposal.md` lists it as a distinct PDP scope item separate from the header breadcrumbs. Design has no component, table row, or file-layout entry for it (`JD-A-002`, `JD-B-001`). Fixed via `BackToListLink` component (design.md:67,134); re-review confirmed by both judges (`JD-A2-001`, `JD-B2-001`). |
| JD-002 | judgment-day | `design.md:66` (ToggleGroup selectors) | CRITICAL | verified | Radix `ToggleGroup type="single"` clears to empty when the currently-pressed item is clicked again. Design's `mutate({id,colorCode,storageCode})` contract never guards against an undefined selection before "Añadir" is enabled, risking a malformed POST and violating the spec's "always pre-selected" invariant (`JD-B-003` only; Judge A did not flag this specific mechanism). User explicitly elevated this to confirmed despite single-judge detection because the Radix behavior is well-documented and the failure mode is concrete. Fixed via explicit `onValueChange` guard note (design.md:77-82,149-150); re-review confirmed by both judges (`JD-A2-002`, `JD-B2-002`).
| JD-003 | judgment-day | `design.md:66` | WARNING | info | ToggleGroup "(2–7 options)" annotation contradicts the spec's unbounded/1-option requirement ("Single option available" scenario); no fallback addressed for 1 or 8+ options (`JD-A-001` + `JD-B-002`, merged — same finding). |
| JD-004 | judgment-day | `design.md:93-106` (cart retry sequence) | WARNING | info | Retry payload capture not explicit — spec requires resubmitting the exact failed payload `P`, design doesn't state whether `P` is captured at failure time or re-derived from live selector state (`JD-A-003`). |
| JD-005 | judgment-day | `design.md` AddToCartButton pending state | WARNING | info | `isPending` handling doesn't reference shadcn's required composition (`Spinner` + `data-icon` + `disabled`) for button loading states (`JD-A-004`). |
| JD-006 | judgment-day | `design.md:64,118-122` (Empty component location) | WARNING | info | `Empty` placed under `product-list/components/` despite design's own claim that error/empty UI is shared (`app-shell` owns it per spec); inconsistent with `ErrorState` which correctly lives in `shared/` (`JD-B-004`). |
| JD-007 | judgment-day | `design.md` Testing Strategy table | SUGGESTION | info | No test rows for `app-shell` routing/navigation scenarios (PLP→PDP click, back-link, header title-link) (`JD-A-005`). |

**Confirmed CRITICAL**: 1 (JD-001)
**Suspect CRITICAL**: 1 (JD-002 — one judge only, requires triage)
**Contradictions**: 0
**INFO (WARNING/SUGGESTION, never blocking)**: 5 (JD-003, JD-004, JD-005, JD-006, JD-007)

Skill Resolution — Judge A: fallback-path. Judge B: paths-injected. (Both read the exact paths supplied in the delegate prompt; no registry lookup needed either way.)

## Judgment Day — Round 1 — Target: PR2 code diff (commit `57fdd57`, app-shell)

Two blind judges (A, B) reviewed the real implemented diff (router, Header, Breadcrumbs, ErrorState, Empty, queryClient, apiClient) against `specs/app-shell/spec.md` and `design.md`, with `shadcn`, `tanstack-query-best-practices`, and `vercel-react-best-practices` skills loaded. Both empirically ran `vitest`, `eslint`, `vite build` rather than trusting the diff alone.

| id | lens | location | severity | status | evidence |
|---|---|---|---|---|---|
| JD-B-001 | judgment-day | `src/shared/components/Header.test.jsx:31-34` | WARNING | info | Test name claims it verifies badge "position" on PDP route but only asserts text content, not DOM order — position is incidentally correct (same JSX both routes) but not actually asserted. |
| JD-B-002 | judgment-day | `src/shared/components/Breadcrumbs.test.jsx:33-41` | SUGGESTION | info | PDP breadcrumb test doesn't assert `aria-current="page"` on the current segment, unlike the PLP test which does — minor test-coverage asymmetry. |

**Confirmed CRITICAL/BLOCKER**: 0
**Suspect**: 0
**INFO (WARNING/SUGGESTION, never blocking)**: 2 (JD-B-001, JD-B-002)

Judge A: `VERDICT: CLEAN — No issues found`, including explicit empirical verification that `staleTime`/`gcTime` are both 3_600_000 in the real exported `QueryClient` used by `main.jsx` (not just asserted in tests).

**JUDGMENT: APPROVED ✅** — no fix round needed.

Skill Resolution — Judge A: fallback-path. Judge B: fallback-path.

## Judgment Day — Round 1 — Target: PR3 code diff (commit `dd6f9e5`, product-list)

Two blind judges (A, B) reviewed the real implemented diff (useProducts, ProductCard/Grid/Skeleton, SearchBar, filterProducts, ProductListPage) against `specs/product-list/spec.md` and `design.md`, with `shadcn`, `tanstack-query-best-practices`, and `vercel-react-best-practices` skills loaded. Both independently verified against the live API (`GET /api/product`) and ran the full test/lint suite.

| id | lens | location | severity | status | evidence |
|---|---|---|---|---|---|
| JD-A-001 | judgment-day | `src/product-list/lib/filterProducts.js:12-13` | WARNING | info | No null/undefined guard on `brand`/`model` before `.toLowerCase()` — would throw if the API ever omitted these fields. Live API data confirms this never happens today (100/100 catalog items have both fields); latent fragility, not an observed defect. |
| JD-A-002 | judgment-day | `src/product-list/api/useProducts.test.js:32-44` | SUGGESTION | info | Test title claims it asserts the `['products']` query key but only checks `isError`/`error.message`. |
| JD-B-001 | judgment-day | `src/product-list/components/ProductCard.jsx:6` | SUGGESTION | info | `formatPrice` named-export alongside default component triggers `react-refresh/only-export-components` — dev-experience only, not production-impacting. |
| JD-B-002 | judgment-day | `src/shared/router.test.jsx:6-24` | SUGGESTION | info | Two tests share the real app `queryClient` singleton with no reset between them — second test rides the first's cache instead of an independent fetch. Passes today, weakens future test isolation. |

**Confirmed CRITICAL/BLOCKER**: 0
**Suspect**: 0
**INFO (WARNING/SUGGESTION, never blocking)**: 4 (JD-A-001, JD-A-002, JD-B-001, JD-B-002)

Both judges independently confirmed: correct `['products']` query key, no `staleTime`/`gcTime` override (relies on centralized 1h config), genuine client-side `useMemo` filter (no per-keystroke query/`select`), shared `Empty`/`ErrorState` reused (no duplicates), `Reintentar` wired to real `refetch`, navigation via router `Link`, grid Tailwind classes correct for "max 4/row responsive," full shadcn `Card` composition, `Field`+`InputGroup`+`InputGroupInput` for search, `Skeleton` for loading, `formatPrice()` handles `null`/`undefined`/`""`/`0`.

**JUDGMENT: APPROVED ✅** — no fix round needed.

Skill Resolution — Judge A: paths-injected. Judge B: fallback-path.

## Judgment Day — Round 1 — Target: PR4 code diff (commit `34aad50`, product-detail)

Two blind judges (A, B) reviewed the real implemented diff against `specs/product-detail/spec.md` and `design.md`, with `shadcn`, `tanstack-query-best-practices`, and `vercel-react-best-practices` skills loaded. Both independently wrote and ran a throwaway repro test mounting the real `ProductDetailPage` with a real `QueryClient` and a delayed-resolving mocked `apiClient`, to exercise the pending→success transition that PR4's own tests never cover.

| id | lens | location | severity | status | evidence |
|---|---|---|---|---|---|
| JD-008 | judgment-day | `src/product-detail/ProductDetailPage.jsx:21-22` | CRITICAL | verified | `useState(colors[0]?.code)` / `useState(storages[0]?.code)` only apply their initializer on first mount. Real `useProduct()` mounts with `isPending:true` (`colors`/`storages` = `[]`), so `colorCode`/`storageCode` lock to `undefined` and never sync once data resolves on the same instance (no `useEffect`). Both judges empirically reproduced: after real async resolution, no color/storage toggle shows `data-pressed`. Violates the spec's MUST "pre-select a default option" (including the single-option case) and reopens `JD-002`'s invariant one level up — `AddToCartButton` would send literal `{colorCode:"undefined", storageCode:"undefined"}` if the user clicks "Añadir" without manually re-selecting. Invisible to PR4's tests because every `useProduct` mock returns already-resolved data on first render (`JD-A-002`/`JD-B-002`, merged as one root cause). (`JD-A-001`, `JD-B-001`, merged — identical finding, independently confirmed.) Fixed via `useMemo`-keyed render-time state sync (`ProductDetailPage.jsx:21-25,39-56`) + regression test simulating the real pending→success transition; re-review confirmed by both judges, zero blocking findings (`JD-A2-001`, `JD-B2-001` — both info-only). |
| JD-009 | judgment-day | `src/product-detail/OptionSelector.test.jsx` / `ProductDetailPage.test.jsx` | WARNING | info | Pre-selection tests only pass pre-resolved data/props at mount — none simulate a real pending→success transition on a stateful parent, which is exactly what let JD-008 through. Regression test added as part of the JD-008 fix closes this gap. |

**Confirmed CRITICAL**: 1 (JD-008, verified)
**Suspect**: 0
**INFO**: 3 (JD-009, JD-A2-001 fetch-stub cleanup, JD-B2-001 cross-product stale-selection edge case)

**JUDGMENT: APPROVED ✅**

Skill Resolution — Judge A: fallback-path. Judge B: paths-injected.
