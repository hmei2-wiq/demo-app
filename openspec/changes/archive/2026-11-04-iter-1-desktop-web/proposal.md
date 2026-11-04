# Proposal

## Why
FreshCart lets a busy household rebuild its weekly grocery shop in under two minutes by reordering a past basket or a saved list, then booking a pickup or delivery slot.

Households plan the weekly shop at a desk as often as on a phone. The same reorder-and-book flow must work in a desktop browser, with a layout that uses the space instead of stretching a phone screen.

## What Changes
### desktop
- US-DSK-01 (M · critical) As a shopper at a computer, I want FreshCart to run in my desktop browser so that I can plan my shop at a desk.
- US-DSK-02 (M · critical) As a shopper on a wide screen, I want side navigation and a multi-column product grid so that I can scan products quickly.
- US-DSK-03 (M · supporting) As a shopper, I want the browser app to talk to the API without errors so that cart, slots and orders work.

## Non-goals
- Installable desktop app (Electron or Tauri): deferred to a later iteration (Wedge: v2).
- Keyboard shortcuts and drag and drop (Wedge: v2).
- Tablet-specific layouts beyond the regular breakpoint.

## Capabilities
### New Capabilities
- `desktop`: responsive layout rules, side navigation, browser build configuration, cross-origin API access

## Success Metric
Not applicable: no analytics in preview.

## Impact
`app/` gains web dependencies and a layout module; `api/` handles CORS preflight correctly. No data changes.
