## 1. API
- [x] 1.1 [backend] Answer preflight with an empty 204 and full CORS headers — implements: FR-DSK-05 — verify: @FR-DSK-05 node test passes (it already passed before the change; only made the empty 204 explicit)
## 2. App
- [x] 2.1 [frontend] Layout module: breakpoints, nav position, columns, content width — implements: FR-DSK-01, FR-DSK-02, FR-DSK-03, FR-DSK-04 — verify: @FR-DSK-01..04 tests pass via `npm run test:lib`
- [ ] 2.2 [frontend] Apply layout in navigation, Shop grid and a centred content wrapper — implements: FR-DSK-02, FR-DSK-03, FR-DSK-04 — verify: opens in a desktop browser with side nav and 3 columns (NOT RUN: needs npm install)
- [x] 2.3 [frontend] Web dependencies, `web` script, app.json web config — implements: FR-DSK-06 — verify: @FR-DSK-06 config test passes
## 3. Docs
- [x] 3.1 [docs] Update architecture.md, RUN.md and README for desktop web — implements: none (docs) — verify: commands match package scripts
## Workflow follow-up
- Publish the traceability report into this change, then archive (manual: OpenSpec CLI unavailable).
