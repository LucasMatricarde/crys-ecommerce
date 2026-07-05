# storefront-catalog Specification

## Purpose

Defines the storefront catalog experience served from the live gateway: a product list with strain-type filtering and pagination, a product-detail view by slug, and explicit loading, empty, and error states — replacing the legacy hardcoded mock catalog.

## Requirements

### Requirement: Catalog list rendered from the live gateway

The storefront SHALL render the product list from `GET /api/catalog/products` instead of any hardcoded/mock catalog. Each product card SHALL display name, strain type, THC/CBD percentages, weight, and BRL-formatted price (using `priceFormatted` from the DTO), and SHALL reflect the `available` flag.

#### Scenario: List loads from gateway

- **WHEN** a user opens the catalog page
- **THEN** the storefront issues `GET /api/catalog/products` and renders one card per returned product using the live DTO fields

#### Scenario: No hardcoded catalog remains

- **WHEN** the catalog page renders
- **THEN** no product data originates from the legacy `data.js`/`window.CRYS_PRODUCTS` mock

### Requirement: Strain-type filter and pagination

The catalog list SHALL support filtering by `strainType` and paginating via the `page` and `size` query parameters of `GET /api/catalog/products`. Changing the filter or page SHALL re-query the gateway.

#### Scenario: Filter by strain type

- **WHEN** a user selects a strain-type filter
- **THEN** the storefront re-queries `GET /api/catalog/products?strainType=<value>` and shows only matching products

#### Scenario: Navigate pages

- **WHEN** a user advances to the next page
- **THEN** the storefront re-queries with the incremented `page` parameter and renders that page of results

### Requirement: Product detail by slug

The storefront SHALL render a product-detail view from `GET /api/catalog/products/{slug}`, showing the full description and an "add to cart" affordance for available products.

#### Scenario: Open product detail

- **WHEN** a user opens `/product/{slug}`
- **THEN** the storefront issues `GET /api/catalog/products/{slug}` and renders the product's full detail

#### Scenario: Unknown slug

- **WHEN** the gateway returns 404 for an unknown slug
- **THEN** the storefront shows a not-found state rather than crashing

### Requirement: Loading, empty, and error states

The catalog views SHALL show a loading indicator while a request is in flight, an empty state when no products match, and an error state with a retry affordance when a request fails.

#### Scenario: Loading state

- **WHEN** a catalog request is in flight
- **THEN** the view shows a loading indicator until the response resolves

#### Scenario: Empty results

- **WHEN** `GET /api/catalog/products` returns zero products for the active filter
- **THEN** the view shows an empty state

#### Scenario: Error state

- **WHEN** a catalog request fails (network error or 5xx)
- **THEN** the view shows an error message with a retry action
