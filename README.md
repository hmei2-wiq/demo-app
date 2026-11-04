# FreshCart

An original grocery shopping app (React Native / Expo) with a small zero-dependency Node API. FreshCart is a fictional brand. It is not affiliated with, and does not use the name, logo or branding of, any real retailer.

**Wedge:** rebuild a weekly shop in under two minutes by reordering a past basket or a saved list, then booking a pickup or delivery slot.

## What is in here

| Path | What |
|---|---|
| `api/` | HTTP API: catalogue, pricing quote, slots, orders. Tests run with `npm test`. |
| `app/` | Expo app: Shop, Lists, Cart, Orders. |
| `openspec/changes/mvp/` | The spec (18 requirements), design and task list. |
| `docs/context/` | Wedge, tech stack, architecture, UX notes, build ledger. |
| `scripts/traceability.mjs` | Checks every requirement has a tagged test. |

See `docs/RUN.md` to run it.

## Status

Preview-tier MVP, built without access to the npm registry. See `docs/context/build-ledger.json` for what was and was not verified. In short: the API and the pure app logic are tested; the Expo UI has never been run.

## Known limits

- No payments, accounts or real stock. Orders live in API memory and vanish on restart.
- Slot times use the API server's local time zone, not a configured store time zone.
- No Figma design; UX is a text spec in `docs/context/ux-design.md`.
