# catalog Specification

## Purpose
Browse, search and view products.

## Requirements

### Requirement: FR-CAT-01 Browse by category
The system SHALL list products filtered by category when a category is given, and all products otherwise.

Priority: M · Wedge: critical · Source: US-CAT-01

#### Scenario: Filter by category
- **WHEN** the client requests products with category "dairy"
- **THEN** only products whose category is "dairy" are returned

#### Scenario: Unknown category
- **WHEN** the client requests products with a category that does not exist
- **THEN** an empty list is returned with status 200

### Requirement: FR-CAT-02 Search by name
The system SHALL return products whose name contains the search text, ignoring case, when the text has at least 2 characters.

Priority: M · Wedge: critical · Source: US-CAT-01

#### Scenario: Case-insensitive match
- **WHEN** the client searches for "MILK"
- **THEN** products with "milk" in their name are returned

#### Scenario: Too-short query
- **WHEN** the client searches for a single character
- **THEN** the system responds with status 400 and code QUERY_TOO_SHORT

### Requirement: FR-CAT-03 Specials with was and now price
The system SHALL return only products that have a was-price when the special filter is set, and SHALL include both prices.

Priority: S · Wedge: supporting · Source: US-CAT-02

#### Scenario: Specials filter
- **WHEN** the client requests products with special=1
- **THEN** every returned product has a wasCents greater than its priceCents

### Requirement: FR-CAT-04 Product detail
The system SHALL return one product by id, or status 404 with code PRODUCT_NOT_FOUND when the id is unknown.

Priority: M · Wedge: critical · Source: US-CAT-01

#### Scenario: Known id
- **WHEN** the client requests a product that exists
- **THEN** the product is returned with id, name, size, category and priceCents

#### Scenario: Unknown id
- **WHEN** the client requests a product id that does not exist
- **THEN** the system responds with status 404 and code PRODUCT_NOT_FOUND
