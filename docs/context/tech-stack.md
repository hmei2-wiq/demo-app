# Tech stack

Status: DRAFT

```yaml
mobile: Expo SDK 52 (React Native, TypeScript), Expo Router not used; React Navigation
state: React context + useReducer; AsyncStorage persistence for cart, lists
api: Node 22, zero dependencies (node:http), ESM
tests_api: node:test (runs without npm install)
tests_app: Jest + @testing-library/react-native (not run in this session)
data: in-memory seed (api/data/products.json); orders in memory
auth: none in preview (single anonymous device user)
package_manager: npm
ci_provider: null
cloud: null
ai_heavy: false
```

## Choices and why
- Zero-dependency API so it runs anywhere Node runs and can be tested without a registry.
- In-memory orders: preview tier. Persistence is a v2 task.
- No payments: orders are placed "pay at pickup / on delivery". Real payments are out of scope.
