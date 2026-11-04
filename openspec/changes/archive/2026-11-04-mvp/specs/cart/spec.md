## ADDED Requirements

### Requirement: FR-CART-01 Edit the basket
The app SHALL let the shopper add a product, change its quantity and remove it, and SHALL remove a line whose quantity reaches zero.

Priority: M · Wedge: critical · Source: US-CART-01

#### Scenario: Add and increase
- **WHEN** the shopper adds the same product twice
- **THEN** the cart holds one line with quantity 2

#### Scenario: Decrease to zero
- **WHEN** the shopper decreases a line with quantity 1
- **THEN** the line is removed

### Requirement: FR-CART-02 Price a basket
The system SHALL price a basket in integer cents and return per-line totals, subtotal, total savings, delivery fee and total.

Priority: M · Wedge: critical · Source: US-CART-02

#### Scenario: Subtotal and savings
- **WHEN** a basket has a special product bought twice
- **THEN** savings equal (wasCents minus priceCents) times 2 and the subtotal uses priceCents

### Requirement: FR-CART-03 Quantity limits
The system SHALL reject a basket line whose quantity is not an integer from 1 to 20 after merging duplicate products.

Priority: M · Wedge: critical · Source: US-CART-02

#### Scenario: Quantity too high
- **WHEN** a basket line has quantity 21
- **THEN** the system responds with status 400 and code INVALID_QUANTITY

#### Scenario: Unknown product
- **WHEN** a basket line names a product that does not exist
- **THEN** the system responds with status 400 and code UNKNOWN_PRODUCT

### Requirement: FR-CART-04 Persist the cart
The app SHALL save the cart on the device after every change and restore it at launch.

Priority: M · Wedge: supporting · Source: US-CART-01

#### Scenario: Restore after restart
- **WHEN** the shopper closes and reopens the app
- **THEN** the cart shows the same lines and quantities
