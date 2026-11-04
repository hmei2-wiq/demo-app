# Design

See docs/context/architecture.md and docs/context/tech-stack.md. Not repeated here.

## Decisions
- D1: API owns pricing (alternative: client-side totals). Chosen so a future real backend is the single source of truth.
- D2: Zero-dependency API (alternative: Express). Chosen so tests run without a package registry.
- D3: Lists and cart on device (alternative: server accounts). Chosen to keep preview tier small.

## Risks
- R1: App code could not be installed or run in the build session (npm registry unreachable). App tests are unverified.
- R2: Wedge not backed by live market research.
- R3: No Figma UX design produced.

## Stack gaps
- No CI configured. No persistence for orders.

## Open Questions
None blocking a Must requirement.
