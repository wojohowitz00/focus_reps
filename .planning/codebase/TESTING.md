# Testing Patterns

**Analysis Date:** 2026-02-04

## Test Framework

**Runner:**
- Jest ^30.2
- Config: `jest.config.js`

**Assertion Library:**
- Jest `expect`
- `@testing-library/jest-native/extend-expect`

**Run Commands:**
```bash
npm run test           # Run all tests
npm run test:watch     # Watch mode
npm run test:coverage  # Coverage report
```

## Test File Organization

**Location:**
- Tests live under `__tests__/` (not colocated with source)

**Naming:**
- Unit tests: `*.test.ts` (e.g., `__tests__/lib/practices.test.ts`)

**Structure:**
```
__tests__/
  setup.ts
  lib/
    practices.test.ts
    storage.test.ts
```

## Test Structure

**Suite Organization:**
```ts
describe('ModuleName', () => {
  describe('functionName', () => {
    test('does something', () => {
      expect(...).toBe(...);
    });
  });
});
```

**Patterns:**
- `beforeEach` for resetting shared state (`AsyncStorage.clear()`)
- Simple arrange/act/assert style

## Mocking

**Framework:**
- Jest mocking (`jest.mock`)

**Patterns:**
```ts
jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);
```

**What to Mock:**
- AsyncStorage
- Expo modules in `__tests__/setup.ts` (`expo-av`, `expo-notifications`)

**What NOT to Mock:**
- Pure functions in `lib/practices.ts`

## Fixtures and Factories

**Test Data:**
- Inline object literals for sessions/entries (see `__tests__/lib/storage.test.ts`)

## Coverage Expectations

**Focus:**
- Unit tests for `lib/` logic
- No UI/interaction tests detected

---

*Testing analysis: 2026-02-04*
*Update when test strategy changes*
