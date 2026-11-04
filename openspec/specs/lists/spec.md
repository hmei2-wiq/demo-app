# lists Specification

## Purpose
Saved lists and reordering past orders.

## Requirements

### Requirement: FR-LST-01 Saved lists
The app SHALL let the shopper create a named list, add and remove products with quantities, and keep lists on the device across restarts.

Priority: M · Wedge: critical · Source: US-LST-01

#### Scenario: Create and add
- **WHEN** the shopper creates the list "Weekly" and adds milk
- **THEN** the list "Weekly" shows milk with quantity 1

### Requirement: FR-LST-02 Add a list to the cart
The app SHALL add every item of a list to the cart in one action, increasing quantities of products already in the cart.

Priority: M · Wedge: critical · Source: US-LST-01

#### Scenario: Merge into cart
- **WHEN** the cart holds milk x1 and the shopper adds a list containing milk x2 and bread x1
- **THEN** the cart holds milk x3 and bread x1

### Requirement: FR-LST-03 Reorder a past order
The app SHALL add every line of a past order to the cart in one action, skipping products that no longer exist and telling the shopper how many were skipped.

Priority: M · Wedge: critical · Source: US-LST-02

#### Scenario: Reorder with a discontinued product
- **WHEN** the shopper reorders an order containing one product that is no longer sold
- **THEN** the other lines are added and a message says 1 item was skipped
