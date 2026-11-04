## 1. Data and API
- [x] 1.1 [db] Seed catalog (products.json, 27 products, 8 categories, 6 specials) — implements: FR-CAT-01, FR-CAT-03 — verify: seed loads; specials have wasCents > priceCents
- [x] 1.2 [backend] Catalog endpoints — implements: FR-CAT-01, FR-CAT-02, FR-CAT-03, FR-CAT-04 — verify: @FR-CAT-* node tests pass
- [x] 1.3 [backend] Quote and quantity validation — implements: FR-CART-02, FR-CART-03 — verify: @FR-CART-02, @FR-CART-03 node tests pass
- [x] 1.4 [backend] Slots, fees, orders and history — implements: FR-CHK-01, FR-CHK-02, FR-CHK-03, FR-CHK-04 — verify: @FR-CHK-* node tests pass
- [x] 1.5 [backend] Body limit and JSON errors, search latency — implements: NFR-SEC-01, NFR-PERF-01 — verify: @NFR-SEC-01, @NFR-PERF-01 node tests pass
## 2. Mobile app
- [x] 2.1 [frontend] Cart logic and persistence — implements: FR-CART-01, FR-CART-04 — verify: @FR-CART-01, @FR-CART-04 tests pass via `npm run test:lib`
- [x] 2.2 [frontend] Lists and reorder logic — implements: FR-LST-01, FR-LST-02, FR-LST-03 — verify: @FR-LST-* tests pass via `npm run test:lib`
- [ ] 2.3 [frontend] Screens: Shop, Detail, Lists, Cart, Orders — implements: FR-CAT-01, FR-CAT-02, FR-CAT-03, FR-CAT-04, FR-CHK-01 — verify: app starts in Expo and flows work (NOT RUN: code written, never executed)
- [ ] 2.4 [frontend] Shared Button and Stepper with 44pt targets and labels — implements: NFR-A11Y-01 — verify: @NFR-A11Y-01 jest test passes (NOT RUN)
## 3. Docs
- [x] 3.1 [docs] README and docs/RUN.md quickstart — implements: none (docs) — verify: commands in file match package scripts
## Workflow follow-up
- Publish the traceability report into this change, then archive (blocked: OpenSpec CLI unavailable).
