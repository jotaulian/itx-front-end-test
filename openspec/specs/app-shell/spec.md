# App Shell Specification

## Purpose

Provides the SPA's client-side routing between the two views, a shared header (title/icon link, breadcrumbs, cart count) rendered on every view, and the reusable error/empty UX conventions used by product-list, product-detail, and cart.

## Requirements

### Requirement: Client-Side Routing

The system MUST be a single-page application with client-side routing between `/` (PLP) and `/product/:id` (PDP), with no full page reload and no server-rendered routing (no MPA, no SSR).

#### Scenario: Navigate between routes without reload

- GIVEN the user is on `/`
- WHEN the user navigates to `/product/X` via in-app navigation
- THEN the URL updates to `/product/X`
- AND no full page reload occurs

### Requirement: Shared Header with Home Link

The system MUST render a shared header on every view containing the application title/icon, which MUST link back to `/`.

#### Scenario: Title link navigates to PLP

- GIVEN the user is on `/product/X`
- WHEN the user clicks the header title/icon
- THEN the application navigates to `/` without a full reload

### Requirement: Breadcrumbs

The header MUST render breadcrumbs showing the user's current location, with a maximum of two levels: root (PLP) and, when on the PDP, the current product. Each non-current breadcrumb segment MUST be a navigable link.

#### Scenario: PDP breadcrumb shows two levels

- GIVEN the user is on `/product/X`
- WHEN the header renders
- THEN the breadcrumb shows a link to the root/PLP level followed by the current product as the second, non-linked level

#### Scenario: PLP breadcrumb shows one level

- GIVEN the user is on `/`
- WHEN the header renders
- THEN the breadcrumb shows only the root level, with no second segment

### Requirement: Cart Count Display

The header MUST display the current cart count on its right side, visible and consistent on both PLP and PDP.

#### Scenario: Count visible on every view

- GIVEN the cart count is `N`
- WHEN the user is on either `/` or `/product/:id`
- THEN the header shows `N` in the same position

### Requirement: Shared Error and Empty UX Shell

The system MUST provide a reusable error component (message plus a "Reintentar" button that re-triggers the failed operation) and a reusable empty-state component (plain text message, no broken layout), used consistently by product-list, product-detail, and cart wherever an error or empty-result state is required.

#### Scenario: Consistent error UI across features

- GIVEN an API failure occurs in the PLP fetch, PDP fetch, or cart POST
- WHEN the respective error state renders
- THEN it uses the same error component pattern (message + "Reintentar" button) in each case
