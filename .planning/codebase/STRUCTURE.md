# Codebase Structure

**Analysis Date:** 2026-02-04

## Directory Layout

```
peak-mind-app/
├── app/                  # Screens + navigation (React Navigation)
│   ├── (tabs)/           # Tab screens (Home, Practice, Progress, Journal, Settings)
│   ├── practice/         # Dynamic practice session route
│   ├── _layout.tsx       # Root navigation container
│   └── index.tsx         # Entry screen (unused by router, kept for RN)
├── components/           # Reusable UI components
├── lib/                  # Domain logic + storage
├── types/                # Shared TS types
├── __tests__/            # Jest unit tests
├── docs/                 # Project documentation
├── App.tsx               # Expo entrypoint
├── app.json              # Expo config
├── babel.config.js       # Babel config
├── jest.config.js        # Jest config
├── tsconfig.json         # TypeScript config
└── package.json          # Dependencies + scripts
```

## Directory Purposes

**app/:**
- Purpose: Screen components and navigation
- Contains: React Native screen components (`.tsx`)
- Key files: `app/_layout.tsx`, `app/(tabs)/index.tsx`, `app/practice/[id].tsx`
- Subdirectories: `(tabs)/` for tab screens, `practice/` for session screen

**components/:**
- Purpose: Reusable UI components
- Contains: `AudioPlayer.tsx`, `Timer.tsx`, `JournalEntry.tsx`

**lib/:**
- Purpose: Domain logic + persistence
- Contains: `practices.ts`, `progress.ts`, `storage.ts`, `notifications.ts`

**types/:**
- Purpose: Shared type definitions
- Contains: `types/index.ts`

**__tests__/:**
- Purpose: Jest unit tests
- Contains: `__tests__/lib/*.test.ts`, `__tests__/setup.ts`

**docs/:**
- Purpose: Project docs and status notes

## Key File Locations

**Entry Points:**
- `App.tsx` - Expo app entrypoint
- `app/_layout.tsx` - Navigation root (stack + tabs)

**Configuration:**
- `app.json` - Expo app config
- `babel.config.js` - Babel/Metro config
- `jest.config.js` - Jest config
- `tsconfig.json` - TypeScript config

**Core Logic:**
- `lib/storage.ts` - AsyncStorage wrapper + CRUD
- `lib/practices.ts` - practice definitions + schedule
- `lib/progress.ts` - streaks + stats calculations
- `lib/notifications.ts` - local notification scheduling

**Testing:**
- `__tests__/setup.ts` - Jest setup + mocks
- `__tests__/lib/*.test.ts` - unit tests for `lib/`

**Documentation:**
- `docs/` - user/project documentation

## Naming Conventions

**Files:**
- Screens: `kebab-case.tsx` under `app/` (e.g., `practice-history.tsx`)
- Components: `PascalCase.tsx` under `components/` (e.g., `AudioPlayer.tsx`)
- Tests: `*.test.ts` under `__tests__/`

**Directories:**
- Feature groupings in `app/` using expo-style group folder `(tabs)/`

**Special Patterns:**
- Dynamic routes: `app/practice/[id].tsx`
- Setup: `__tests__/setup.ts`

## Where to Add New Code

**New Feature:**
- Primary code: `app/` (screen) + `lib/` (logic) + `components/` (UI)
- Tests: `__tests__/lib/*` for logic, add UI tests if introduced

**New Component/Module:**
- Implementation: `components/` (UI) or `lib/` (logic)
- Types: `types/index.ts`

**New Route/Screen:**
- Definition: `app/` (add new screen file)
- Navigation: update `app/_layout.tsx`

**Utilities:**
- Shared helpers: `lib/`
- Type definitions: `types/index.ts`

## Special Directories

**node_modules/:**
- Purpose: npm dependencies
- Committed: No (`.gitignore`)

---

*Structure analysis: 2026-02-04*
*Update when directory structure changes*
