# Cart Specification

## Purpose

Adds a selected product configuration to the server-side cart, treats the server response count as the source of truth, persists that count across views and reloads, and exposes it app-wide via Context. No cart page or drawer is provided — the header count is the only cart UI.

## Requirements

### Requirement: Add-to-Cart Request

The system MUST send `POST /api/cart` with body `{id, colorCode, storageCode}` when the add-to-cart action is triggered.

#### Scenario: Successful add request

- GIVEN a valid `{id, colorCode, storageCode}` payload
- WHEN the add-to-cart action fires
- THEN the system sends `POST /api/cart` with that exact body

### Requirement: Server Count as Source of Truth

The system MUST replace the stored cart count with the `count` value from the `POST /api/cart` response; it MUST NOT increment the count locally.

#### Scenario: Response count overwrites previous count

- GIVEN the current stored count is `2`
- WHEN `POST /api/cart` resolves with `{count: 5}`
- THEN the stored and displayed count becomes `5`

### Requirement: Cart Count Persistence

The system MUST persist the cart count in `localStorage` so it survives a page reload.

#### Scenario: Count survives reload

- GIVEN the stored count is `3` after a successful add
- WHEN the user reloads the page
- THEN the header still displays `3` before any new add-to-cart request

### Requirement: App-Wide Count Exposure via Context

The system MUST expose the cart count through a React Context so any view (PLP, PDP) can read the current count without prop drilling, and the header MUST reflect updates immediately after a successful add.

#### Scenario: Count updates visible across views

- GIVEN the user adds a product from the PDP
- WHEN the request resolves successfully
- THEN the header count updates immediately on the PDP
- AND remains updated after navigating to the PLP

### Requirement: Add-to-Cart Failure Handling

If `POST /api/cart` fails, the system MUST render a visible error state with a "Reintentar" button that resubmits the same request payload when clicked.

#### Scenario: POST fails

- GIVEN a valid add-to-cart payload
- WHEN `POST /api/cart` rejects or returns an error
- THEN the system shows a visible error state with a "Reintentar" button
- AND the stored count is not changed
- AND no unhandled rejection occurs

#### Scenario: Retry resubmits and succeeds

- GIVEN the add-to-cart error state is shown for payload `P`
- WHEN the user clicks "Reintentar"
- AND `POST /api/cart` with payload `P` subsequently resolves with `{count: N}`
- THEN the error state is cleared and the stored/displayed count becomes `N`

### Requirement: No Dedicated Cart View

The system MUST NOT provide a cart page or cart drawer/panel; the only cart UI is the count displayed in the shared header.

#### Scenario: Header count has no cart-opening behavior

- GIVEN the header displays a cart count
- WHEN the user interacts with the count element
- THEN no cart page, drawer, or panel opens
