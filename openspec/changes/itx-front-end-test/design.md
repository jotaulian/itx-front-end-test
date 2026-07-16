# Design: ITX Front-End Test — Mobile Shopping Mini-App

## Technical Approach

Greenfield Vite + React (JS, no TS) SPA with two routes (`/`, `/product/:id`) via React Router.
UI is built from shadcn/ui primitives on Tailwind; server state and the 1h cache come from
TanStack Query; cart count is app-wide via a Context hydrated from `localStorage` and updated
from the `POST /api/cart` response. Code is organized by **Screaming Architecture** feature
folders (`product-list/`, `product-detail/`, `cart/`, `shared/`). This maps directly to the five
specs: `app-shell` → routing + header + shared error/empty UI, `product-list` → PLP, `product-detail`
→ PDP, `cart` → Context + mutation, `api-cache` → QueryClient defaults.

## Architecture Decisions

### Decision: Single QueryClient with 1h `gcTime` AND `staleTime`

**Choice**: Configure `defaultOptions.queries = { staleTime: 3_600_000, gcTime: 3_600_000, retry: 1 }`
once in `shared/lib/queryClient.js`.
**Alternatives considered**: Set only `staleTime` per-hook; leave `gcTime` at its 5-min default.
**Rationale**: Default `gcTime` (5 min) < required `staleTime` (1h). When a query loses all observers
(PLP→PDP→PLP), the cache is garbage-collected before the 1h TTL, forcing a refetch and violating
`api-cache`. Both must be 1h, set centrally so hooks don't repeat it. Mutations get `retry: 0`
separately (see Cart).

### Decision: Client-side search via `useMemo`, not a query

**Choice**: Filter the already-fetched `['products']` array with `useMemo` over Marca+Modelo.
**Alternatives considered**: New query key per keystroke; TanStack `select` transform.
**Rationale**: The API has no server-side search param; search text is not a server dependency.
Per-keystroke keys would spam the network and fragment the cache; `select` re-runs on every render
and couples filtering to fetching. `useMemo` keeps it pure, local, and instant.

### Decision: Cart count in Context, POST response is source of truth, no optimistic update

**Choice**: `CartProvider` holds `count`, lazy-inits from `localStorage`, and a `useAddToCart`
mutation `setCount(data.count)` + persists on success. No local increment, no optimistic rollback.
**Alternatives considered**: Optimistic `count+1` with rollback; increment locally.
**Rationale**: `cart` spec mandates the server `count` overwrite the stored value and forbids local
increment. Optimistic UI adds rollback complexity unjustified for a single counter with the server
as truth.

### Decision: `isError`/`isPending` state, no Error Boundaries; mutation `retry: 0`

**Choice**: Drive error/loading UI from `useQuery`/`useMutation` flags; "Reintentar" re-invokes
`refetch()` (queries) or `mutate(samePayload)` (cart). Mutations do not auto-retry.
**Alternatives considered**: React Error Boundaries; auto-retrying mutations.
**Rationale**: Only two views — flags are sufficient and keep retry wiring explicit. Auto-retry on
the cart POST risks double-adding on transient failure; manual "Reintentar" matches the spec.

### Decision: shadcn primitives per UI slot (init before `add`)

**Choice**: Run `npx shadcn@latest init` after the Vite+Tailwind scaffold, before any `add`.
Map each spec UI element to a specific primitive (see table). Use semantic tokens only.
**Alternatives considered**: Hand-rolled markup; raw Tailwind color classes.
**Rationale**: Consistent, accessible primitives; `init` needs Tailwind present for correct
project detection (see Risks).

## Component / Module Breakdown

| Feature slot (spec) | shadcn primitive | Location |
|---|---|---|
| PLP search input (`product-list`) | `Field` + `InputGroup` + `InputGroupInput` (never raw `Input` in `InputGroup`) | `product-list/components/SearchBar.jsx` |
| PLP product card | full `Card` (`CardHeader`/`CardTitle`/`CardDescription`/`CardContent`) | `product-list/components/ProductCard.jsx` |
| PLP empty search state | `Empty` | `product-list/components/EmptyResults.jsx` |
| PLP grid loading | `Skeleton` (not `animate-pulse`) | `product-list/components/ProductGridSkeleton.jsx` |
| PDP storage + color selectors | `ToggleGroup` + `ToggleGroupItem` (2–7 options, always visible, pre-selected) | `product-detail/components/OptionSelector.jsx` |
| PDP back-to-list link (`product-detail` — distinct from header breadcrumbs) | router `Link` (or `Button` `variant="link"`) to `/` | `product-detail/components/BackToListLink.jsx` |
| PDP detail loading | `Skeleton` | `product-detail/components/DetailSkeleton.jsx` |
| Header cart count (`app-shell`) | `Badge` | `shared/components/Header.jsx` |
| Header breadcrumbs | `Breadcrumb` | `shared/components/Breadcrumbs.jsx` |
| Shared API-failure state + "Reintentar" | `Alert` + `Button` | `shared/components/ErrorState.jsx` |

Icons via `lucide-react` (`data-icon`, no manual size classes). Global rules: semantic tokens
(`bg-primary`, `text-muted-foreground`), `gap-*` not `space-y-*`, `size-*` not `w-*/h-*`, `cn()` for
conditional classes.

**Required implementation detail — `ToggleGroup` deselect guard**: Radix `ToggleGroup type="single"`
clears its value to an empty string when the currently-pressed item is clicked again. Because
`OptionSelector` must keep storage/color "always pre-selected" per spec, `onValueChange` MUST ignore
falsy values instead of writing them to state: `onValueChange={(v) => { if (v) setSelection(v); }}`.
This keeps the previously selected option active on a repeat click and prevents `undefined`
`colorCode`/`storageCode` from ever reaching the `mutate()` call below.

## Data Flow

```
GET /api/product ──► useProducts() ─┐
   (['products'], 1h)               ├─► PLP ──useMemo(search)──► Card grid / Empty / ErrorState
GET /api/product/:id ─► useProduct(id)─► PDP ──ToggleGroup(storage,color)──► "Añadir"
   (['products',id], 1h)                                                        │
                                                                                ▼
                                              useAddToCart().mutate({id,colorCode,storageCode})
                                                                                │  POST /api/cart
                                                                                ▼
                                              CartContext.setCount(res.count) ──► localStorage
                                                                                │
                                                                                ▼
                                                          Header <Badge>{count}</Badge> (all views)
```

### Cart update sequence (POST /api/cart)

```
PDP        useAddToCart      API           CartContext     localStorage    Header
 │  click     │               │                │               │             │
 │──Añadir───►│ mutate(P)     │                │               │             │
 │  (isPending disables btn)  │                │               │             │
 │            │──POST /cart──►│                │               │             │
 │            │◄──{count:N}───│                │               │             │
 │            │──onSuccess───►│ setCount(N)────┼──persist(N)──►│             │
 │            │               │                │───────────────┼───rerender─►│ Badge=N
 │  (failure) │◄──error───────│                │  (count unchanged)          │
 │◄─ErrorState + "Reintentar"─┤  click ⇒ mutate(P) again                     │
```

## File / Folder Layout

```
src/
├── main.jsx                      # QueryClientProvider + CartProvider + RouterProvider
├── App.jsx                       # <Header/> + <Outlet/> layout route
├── shared/
│   ├── lib/queryClient.js        # 1h staleTime + gcTime, retry defaults
│   ├── lib/apiClient.js          # fetch wrapper, BASE_URL
│   ├── router.jsx                # createBrowserRouter: '/', '/product/:id'
│   └── components/               # Header, Breadcrumbs, ErrorState, ui/ (shadcn)
├── product-list/
│   ├── ProductListPage.jsx
│   ├── api/useProducts.js        # useQuery(['products'])
│   └── components/               # SearchBar, ProductCard, ProductGrid, EmptyResults, *Skeleton
├── product-detail/
│   ├── ProductDetailPage.jsx
│   ├── api/useProduct.js         # useQuery(['products', id])
│   └── components/               # OptionSelector, BackToListLink, DescriptionList, AddToCartButton, *Skeleton
└── cart/
    ├── CartContext.jsx           # provider, count state, localStorage hydration
    ├── useCart.js                # context consumer hook
    └── api/useAddToCart.js       # useMutation POST /api/cart, retry:0
```

## Interfaces / Contracts

```js
// api/useProducts.js       → useQuery({ queryKey: ['products'], queryFn })  => Product[]
// api/useProduct.js        → useQuery({ queryKey: ['products', id], queryFn })
// api/useAddToCart.js      → useMutation({ mutationFn, retry: 0, onSuccess: d => setCount(d.count) })
// CartContext value        → { count: number, setCount(n) }
// POST /api/cart request    { id, colorCode, storageCode }  → response { count }
// OptionSelector selection  colorCode/storageCode set only via onValueChange guard `if (v) setSelection(v)`
//                            (ToggleGroup deselect-to-empty is ignored; mutate() never receives undefined)
```

## Testing Strategy

| Layer | What to test | Approach |
|---|---|---|
| Unit | search `useMemo` filter (match, no-match, case), localStorage hydration/persist | Vitest, pure fns / hooks |
| Integration | PLP grid + empty + error/retry, PDP fields + selectors pre-select + Añadir, cart count updates & persists | RTL, mocked fetch |
| Cache | repeat query within TTL = no refetch; expiry = refetch | RTL + fake timers, mock fetch call count |

Strict TDD (RED-GREEN-REFACTOR) per config. `npx vitest` runner.

## Migration / Rollout

No migration required — greenfield repo. Each milestone commit is independently revertible.

## Open Questions

- [ ] Confirm `lucide-react` is the intended icon set (project default assumed; not yet installed).
- [ ] Verify the `/api/product` payload field names for storage/color option arrays before wiring `ToggleGroup`.
