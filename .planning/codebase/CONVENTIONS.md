# Coding Conventions

**Analysis Date:** 2026-02-04

## Naming Patterns

**Files:**
- Screens: `kebab-case.tsx` in `app/` (e.g., `practice-history.tsx`)
- Components: `PascalCase.tsx` in `components/` (e.g., `AudioPlayer.tsx`)
- Tests: `*.test.ts` in `__tests__/`

**Functions:**
- camelCase for functions and handlers (`loadData`, `handlePracticeSelect`)
- Async functions use `async` without naming prefixes

**Variables:**
- camelCase for local vars and state (`todayPractice`, `weeklyStats`)
- Constants in UPPER_SNAKE_CASE when global (`STORAGE_KEYS`)

**Types:**
- PascalCase for interfaces/types (`PracticeSession`, `UserSettings`)
- Union string types for enums (`PracticeType`)

## Code Style

**Formatting:**
- Semicolons used
- Single quotes for strings
- Inline styles via `StyleSheet.create`

**Linting:**
- No ESLint config detected

## Import Organization

**Order (observed):**
1. React/React Native
2. Third-party packages
3. Local modules (`lib/`, `types/`, sibling screens/components)

**Grouping:**
- Blank lines between groups in most files

**Path Aliases:**
- None (relative imports only)

## Error Handling

**Patterns:**
- `try/catch` in async functions
- Errors logged via `console.error` and fallback to safe return values

**Error Types:**
- No custom error classes

## Logging

**Framework:**
- `console.log` / `console.error` only

## Comments

**When to Comment:**
- File-level headers describe intent and screen purpose
- Functions are self-descriptive; minimal inline comments

**JSDoc/TSDoc:**
- Not used consistently; file-level block comments are common

## Function Design

**Size:**
- Screen components are medium-sized; logic often extracted to `lib/`

**Parameters:**
- Functions take explicit params; no heavy use of config objects

**Return Values:**
- Async helpers return booleans or typed objects

## Module Design

**Exports:**
- Default exports for React components
- Named exports for utilities and types

---

*Conventions analysis: 2026-02-04*
*Update when style changes*
