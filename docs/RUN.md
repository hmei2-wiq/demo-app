# Run FreshCart locally

## API (verified)

```bash
cd api && npm start          # http://localhost:3000, no install needed (Node 20+)
cd api && npm test           # 23 tests
```

## Mobile app (NOT run in the build session)

```bash
cd app && npm install && EXPO_PUBLIC_API_URL=http://localhost:3000 npm run start
```

- iOS simulator: `http://localhost:3000` works.
- Android emulator: use `EXPO_PUBLIC_API_URL=http://10.0.2.2:3000`.
- Physical phone: use your computer's LAN IP, for example `http://192.168.1.20:3000`.

## Checks

```bash
cd app && npm run test:lib   # 11 pure-logic tests (Node 22.6+)
cd app && npm test           # Jest UI tests (needs npm install)
cd app && npm run typecheck  # needs npm install
node scripts/traceability.mjs  # stand-in for the OpenSpec traceability gate
```

Quickstart line: `(cd api && npm start &) && cd app && npm install && npm run start`
