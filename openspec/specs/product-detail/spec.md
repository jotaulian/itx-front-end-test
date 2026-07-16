# Product Detail Specification

## Purpose

The PDP (Product Detail Page) fetches a single product by id and renders a two-column layout: image on the left, description and purchase actions on the right, with selectors for storage/color and a trigger to add the product to the cart.

## Requirements

### Requirement: Fetch Product Detail by ID

The system MUST fetch product detail via `GET /api/product/:id`, using the `id` route param from `/product/:id`.

#### Scenario: Successful detail load

- GIVEN the user navigates to `/product/X`
- WHEN `GET /api/product/X` resolves successfully
- THEN the PDP renders using the returned product data

### Requirement: Two-Column Layout

The system MUST render the PDP in two columns: the first column contains the product image; the second column contains the description block followed by the actions block.

#### Scenario: Layout renders image left, description+actions right

- GIVEN a product has loaded successfully
- WHEN the PDP renders
- THEN the image occupies the left column
- AND description and actions occupy the right column, description above actions

### Requirement: Product Description Fields

The system MUST display all of the following attributes for the loaded product: Marca, Modelo, Precio, CPU, RAM, Sistema Operativo, Resolución de pantalla, Batería, Cámaras, Dimensiones, Peso.

#### Scenario: All description fields rendered

- GIVEN a product has loaded successfully
- WHEN the description block renders
- THEN all 11 fields (Marca, Modelo, Precio, CPU, RAM, Sistema Operativo, Resolución de pantalla, Batería, Cámaras, Dimensiones, Peso) are visible with their values from the API response

### Requirement: Storage and Color Selectors

The system MUST always render a storage selector and a color selector, regardless of how many options each has, and MUST pre-select a default option in each — including when a selector has only one option.

#### Scenario: Multiple options available

- GIVEN the product has more than one storage option and more than one color option
- WHEN the PDP renders
- THEN both selectors are shown with one option pre-selected in each
- AND the user can change the selection in either selector

#### Scenario: Single option available

- GIVEN the product has exactly one storage option
- WHEN the PDP renders
- THEN the storage selector is still rendered, showing that single option, pre-selected by default

### Requirement: Add-to-Cart Trigger

The "Añadir" button MUST trigger an add-to-cart action using the product id and the currently selected storage and color options.

#### Scenario: Click Añadir with selections

- GIVEN storage option `S` and color option `C` are selected for product `X`
- WHEN the user clicks "Añadir"
- THEN the system triggers the add-to-cart request with `{id: X, colorCode: C, storageCode: S}`

### Requirement: Back Navigation to PLP

The system MUST show a link that navigates the user back to the product list.

#### Scenario: Click back link

- GIVEN the user is viewing the PDP
- WHEN the user clicks the back-to-list link
- THEN the application navigates to `/` without a full page reload

### Requirement: API Failure Handling

If `GET /api/product/:id` fails, the system MUST render a visible error state with a "Reintentar" button that re-triggers the fetch when clicked.

#### Scenario: Fetch fails on load

- GIVEN the user navigates to `/product/X`
- WHEN `GET /api/product/X` rejects or returns an error
- THEN the system shows a visible error state with a "Reintentar" button
- AND no unhandled rejection occurs

#### Scenario: Retry recovers from failure

- GIVEN the PDP is showing the error state
- WHEN the user clicks "Reintentar"
- AND `GET /api/product/X` subsequently succeeds
- THEN the error state is replaced by the rendered product detail
