# Design

See docs/context/architecture.md; a [docs] task updates it. Not repeated here.

## Decisions
- D1: One codebase through react-native-web (alternative: separate web app). Chosen to reuse all screens and state.
- D2: Layout rules live in one pure module `src/lib/layout.ts` (alternative: inline conditions in screens). Chosen so the rules are testable without a device.
- D3: Navigation position via the tab navigator's `tabBarPosition` option (alternative: custom sidebar). Chosen to avoid new navigation code.

## Risks
- R1: The web build and the `tabBarPosition` option were not run; the npm registry is unreachable in the build session.
- R2: Dependency versions for web (react-native-web ~0.19.13 with Expo SDK 52) are from memory.

## Open Questions
None.
