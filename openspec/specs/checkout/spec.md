# checkout Specification

## Purpose
Delivery or pickup slots, fees, order placement and history.

## Requirements

### Requirement: FR-CHK-01 Available slots
The system SHALL list 2-hour slots between 08:00 and 20:00 for the next 3 days, only those starting at least 2 hours after the current time, for pickup or delivery.

Priority: M · Wedge: critical · Source: US-CHK-01

#### Scenario: Lead time respected
- **WHEN** the current time is 15:00 on a given day
- **THEN** no slot for that day starts before 17:00

#### Scenario: Invalid type
- **WHEN** the client requests slots with a type other than pickup or delivery
- **THEN** the system responds with status 400 and code INVALID_FULFILMENT

### Requirement: FR-CHK-02 Delivery fee
The system SHALL charge 800 cents for delivery when the subtotal is under 10000 cents, nothing at or above 10000 cents, and nothing for pickup.

Priority: M · Wedge: critical · Source: US-CHK-01

#### Scenario: Under threshold
- **WHEN** a delivery basket has subtotal 9900 cents
- **THEN** the delivery fee is 800 cents

#### Scenario: At threshold
- **WHEN** a delivery basket has subtotal 10000 cents
- **THEN** the delivery fee is 0

#### Scenario: Pickup
- **WHEN** a pickup basket has subtotal 500 cents
- **THEN** the delivery fee is 0

### Requirement: FR-CHK-03 Place an order
The system SHALL create an order with a unique id and the priced basket when the basket is non-empty and the chosen slot is currently available, and SHALL otherwise reject it.

Priority: M · Wedge: critical · Source: US-CHK-02

#### Scenario: Successful order
- **WHEN** the client submits a valid basket and an available slot
- **THEN** the system responds with status 201 and an order containing an id, the slot and the total

#### Scenario: Empty basket
- **WHEN** the client submits an empty basket
- **THEN** the system responds with status 400 and code EMPTY_BASKET

#### Scenario: Slot not available
- **WHEN** the client submits a slot id that is not in the available list
- **THEN** the system responds with status 400 and code INVALID_SLOT

### Requirement: FR-CHK-04 Order history
The system SHALL return placed orders newest first.

Priority: M · Wedge: critical · Source: US-CHK-02

#### Scenario: Newest first
- **WHEN** two orders have been placed
- **THEN** the later order appears first in the list
