# API Cache Specification

## Purpose

Caches read responses from `GET /api/product` and `GET /api/product/:id` on the client for 1 hour, avoiding redundant network calls, and automatically revalidates once the cached data expires.

## Requirements

### Requirement: 1-Hour Cache TTL for Product Reads

The system MUST cache `GET /api/product` and `GET /api/product/:id` responses client-side (via TanStack Query) with a `staleTime` of 1 hour, so repeated requests within that window are served from cache without a network call.

#### Scenario: Repeated request within TTL uses cache

- GIVEN `GET /api/product` was successfully fetched and cached less than 1 hour ago
- WHEN the same query is requested again (e.g. re-mounting the PLP)
- THEN the cached data is returned
- AND no new network request is made

#### Scenario: Same rule applies to product detail

- GIVEN `GET /api/product/X` was successfully fetched and cached less than 1 hour ago
- WHEN the PDP for product `X` is requested again within that window
- THEN the cached data is returned
- AND no new network request is made

### Requirement: Revalidation After Expiry

Once cached data exceeds the 1-hour `staleTime`, the next access MUST trigger a fresh fetch to revalidate the data.

#### Scenario: Request after expiry triggers refetch

- GIVEN cached data for a query is older than 1 hour
- WHEN that query is requested again
- THEN the system issues a new network request
- AND the cache is updated with the fresh response
