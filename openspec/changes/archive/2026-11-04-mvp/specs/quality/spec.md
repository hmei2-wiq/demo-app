## ADDED Requirements

### Requirement: NFR-PERF-01 Search latency
The system SHALL answer a product search within 200 ms at p95 over 200 sequential local requests against the seed catalog.

Priority: S · Wedge: supporting

#### Scenario: Local latency
- **WHEN** 200 sequential search requests run against a local server
- **THEN** the 95th percentile response time is under 200 ms

### Requirement: NFR-A11Y-01 Touch targets and labels
The app SHALL give every interactive control a touch target of at least 44 by 44 points and a non-empty accessibility label.

Priority: S · Wedge: supporting

#### Scenario: Control audit
- **WHEN** the shared Button and Stepper components are rendered
- **THEN** each has a minimum height and width of 44 and an accessibilityLabel

### Requirement: NFR-SEC-01 Input limits
The system SHALL reject request bodies larger than 100 KB with status 413 and invalid JSON with status 400.

Priority: M · Wedge: supporting

#### Scenario: Oversized body
- **WHEN** a client posts a body of 150 KB to /api/quote
- **THEN** the system responds with status 413 and code BODY_TOO_LARGE

#### Scenario: Malformed JSON
- **WHEN** a client posts invalid JSON to /api/quote
- **THEN** the system responds with status 400 and code INVALID_JSON
