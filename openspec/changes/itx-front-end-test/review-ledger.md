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
