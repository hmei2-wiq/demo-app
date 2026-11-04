## ADDED Requirements

### Requirement: FR-DSK-01 Layout breakpoints
The app SHALL classify the window width as compact below 768, regular from 768 to 1099, and wide from 1100 upwards.

Priority: M · Wedge: critical · Source: US-DSK-02

#### Scenario: Boundaries
- **WHEN** the width is 767, 768, 1099 and 1100
- **THEN** the classes are compact, regular, regular and wide

### Requirement: FR-DSK-02 Side navigation on larger screens
The app SHALL place the main navigation on the left for regular and wide widths, and at the bottom for compact widths.

Priority: M · Wedge: critical · Source: US-DSK-02

#### Scenario: Navigation position
- **WHEN** the width is 390, 900 and 1400
- **THEN** the navigation position is bottom, left and left

### Requirement: FR-DSK-03 Product grid columns
The app SHALL show 1 product column at compact width, 2 at regular and 3 at wide.

Priority: S · Wedge: supporting · Source: US-DSK-02

#### Scenario: Columns per class
- **WHEN** the width is 390, 900 and 1400
- **THEN** the column counts are 1, 2 and 3

### Requirement: FR-DSK-04 Readable content width
The app SHALL limit the content column to 1200 points and centre it when the window is wider.

Priority: S · Wedge: supporting · Source: US-DSK-02

#### Scenario: Width cap
- **WHEN** the window width is 1920
- **THEN** the content width is 1200

#### Scenario: Narrow window unchanged
- **WHEN** the window width is 900
- **THEN** the content width is 900

### Requirement: FR-DSK-05 Cross-origin API access
The system SHALL answer a browser preflight request to any API route with status 204, no body, and headers allowing content-type and the GET, POST and OPTIONS methods.

Priority: M · Wedge: supporting · Source: US-DSK-03

#### Scenario: Preflight
- **WHEN** a browser sends OPTIONS /api/orders with an Origin header
- **THEN** the response status is 204, the body is empty, and access-control-allow-methods lists GET, POST and OPTIONS

### Requirement: FR-DSK-06 Browser build configuration
The app SHALL declare a web script and the web dependencies react-dom, react-native-web and @expo/metro-runtime so that it starts in a desktop browser.

Priority: M · Wedge: critical · Source: US-DSK-01

#### Scenario: Web script present
- **WHEN** app/package.json is read
- **THEN** scripts.web exists and the three web dependencies are listed
