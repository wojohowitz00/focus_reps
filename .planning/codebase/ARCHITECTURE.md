# Architecture

**Analysis Date:** 2026-02-04

## Pattern Overview

**Overall:** Client-only React Native app (monolithic UI + local storage)

**Key Characteristics:**
- No backend or network layer
- Local persistence via AsyncStorage
- Screen-driven navigation using React Navigation (stack + tabs)

## Layers

**Presentation (Screens):**
- Purpose: User-facing flows and UI
- Contains: React Native screens under `app/`
- Depends on: `lib/*`, `components/*`, `types/*`
- Used by: Navigation container in `app/_layout.tsx`

**UI Components:**
- Purpose: Reusable view logic (audio, timers, journal entry)
- Contains: `components/*.tsx`
- Depends on: React Native, Expo modules
- Used by: Screens in `app/`

**Domain Logic:**
- Purpose: Practice scheduling, progress calculations, notification logic
- Contains: `lib/practices.ts`, `lib/progress.ts`, `lib/notifications.ts`
- Depends on: storage layer + Expo modules
- Used by: Screens and components

**Persistence:**
- Purpose: Local data storage
- Contains: `lib/storage.ts`
- Depends on: `@react-native-async-storage/async-storage`
- Used by: Domain logic + screens

**Types:**
- Purpose: Shared data models
- Contains: `types/index.ts`
- Used by: `lib/`, `app/`, `components/`, tests

## Data Flow

**App Startup / Navigation Flow:**
1. `App.tsx` renders `app/_layout.tsx`
2. `RootLayout` loads progress via `getProgress()` (`lib/storage.ts`)
3. Chooses Onboarding vs main tab navigation
4. Screens read/write data via `lib/*` functions

**Practice Session Flow:**
1. User starts a practice from `app/(tabs)/index.tsx` or `app/(tabs)/practice.tsx`
2. Navigation to `app/practice/[id].tsx` with practice id
3. Session data saved via `lib/storage.ts` (sessions + progress)
4. Progress screen (`app/(tabs)/progress.tsx`) computes aggregates via `lib/progress.ts`

**State Management:**
- Local component state (`useState`, `useEffect`)
- Persistent state stored in AsyncStorage via `lib/storage.ts`
- No global state store in active use (Zustand installed but minimal usage)

## Key Abstractions

**Practice Definitions & Schedule:**
- Purpose: Define practice types and 6-week schedule
- Examples: `lib/practices.ts`, `PracticeType` in `types/index.ts`
- Pattern: Pure functions + constant maps

**Progress Calculations:**
- Purpose: Streaks, totals, weekly stats
- Examples: `lib/progress.ts`
- Pattern: Pure functions + storage reads

**Storage Wrapper:**
- Purpose: Typed CRUD on AsyncStorage
- Examples: `lib/storage.ts`
- Pattern: thin async wrapper w/ try/catch

## Entry Points

**App Entry:**
- Location: `App.tsx`
- Triggers: Expo app start
- Responsibilities: Render root layout

**Navigation Root:**
- Location: `app/_layout.tsx`
- Triggers: React Navigation container
- Responsibilities: Tab + stack navigation, onboarding gate

## Error Handling

**Strategy:**
- Local try/catch with `console.error` in async functions

**Patterns:**
- Guarded async operations in `lib/storage.ts`, `lib/notifications.ts`
- UI screens log errors and continue with fallback UI

## Cross-Cutting Concerns

**Logging:**
- Console logging only

**Validation:**
- Minimal runtime validation; relies on TypeScript types

**Authentication:**
- None

---

*Architecture analysis: 2026-02-04*
*Update when major patterns change*
