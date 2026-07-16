# Product List Specification

## Purpose

The PLP (Product List Page) fetches the product catalog and renders it as a searchable, responsive grid, letting the user filter by brand/model and navigate to a product's detail page.

## Requirements

### Requirement: Product Grid Rendering

The system MUST fetch the product catalog via `GET /api/product` and render each item in a grid with a maximum of 4 items per row. The grid MUST be responsive, reducing items per row on narrower viewports. Each item MUST display: image, Marca, Modelo, Precio.

#### Scenario: Successful catalog load

- GIVEN the PLP is mounted
- WHEN `GET /api/product` resolves successfully
- THEN the grid renders one item per product, showing image, Marca, Modelo, and Precio
- AND no row contains more than 4 items on wide viewports

#### Scenario: Responsive reflow on narrow viewport

- GIVEN the PLP is rendered with products loaded
- WHEN the viewport width is reduced
- THEN the number of items per row decreases accordingly, never exceeding 4

### Requirement: Real-Time Search Filter

The system MUST filter the rendered products in real time as the user types, comparing the search text against both Marca and Modelo, with no submit action required.

#### Scenario: Filter narrows results while typing

- GIVEN the PLP shows the full product list
- WHEN the user types a string matching some products' Marca or Modelo
- THEN the grid updates on each keystroke to show only matching products

#### Scenario: Empty search result

- GIVEN the user has typed a search string
- WHEN no product's Marca or Modelo matches the string
- THEN the system renders a plain text message (e.g. "No se encontraron productos") instead of the grid
- AND the search input remains active and editable
- AND no error is thrown

### Requirement: Navigation to Product Detail

Selecting a product item MUST navigate the user to that product's detail route.

#### Scenario: Click item navigates to PDP

- GIVEN the PLP grid shows a product with id `X`
- WHEN the user selects that item
- THEN the application navigates to `/product/X` without a full page reload

### Requirement: API Failure Handling

If `GET /api/product` fails, the system MUST render a visible error state with a "Reintentar" button that re-triggers the fetch when clicked.

#### Scenario: Fetch fails on load

- GIVEN the PLP is mounted
- WHEN `GET /api/product` rejects or returns an error
- THEN the system shows a visible error state with a "Reintentar" button
- AND no unhandled rejection occurs

#### Scenario: Retry recovers from failure

- GIVEN the PLP is showing the error state
- WHEN the user clicks "Reintentar"
- AND `GET /api/product` subsequently succeeds
- THEN the error state is replaced by the product grid
