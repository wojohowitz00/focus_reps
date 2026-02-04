# Technology Stack

**Analysis Date:** 2026-02-04

## Languages

**Primary:**
- TypeScript 5.3.x - All application and test code (`app/`, `components/`, `lib/`, `types/`, `__tests__/`)

**Secondary:**
- JavaScript - Tooling/config (`babel.config.js`, `jest.config.js`)

## Runtime

**Environment:**
- Node.js (Expo CLI / Metro bundler runtime)
- React Native runtime on iOS/Android (Expo SDK 51)

**Package Manager:**
- npm
- Lockfile: `package-lock.json` present

## Frameworks

**Core:**
- Expo SDK ~51 (`expo`) - app runtime + tooling
- React Native 0.74.5 (`react-native`) - native UI runtime
- React 18.2 (`react`) - component model
- React Navigation 7.x (`@react-navigation/*`) - stack + tabs navigation

**Testing:**
- Jest ^30.2 (`jest`) - unit test runner
- React Native Testing Library ^13.3 (`@testing-library/react-native`)
- Jest Native matchers (`@testing-library/jest-native`)

**Build/Dev:**
- TypeScript ^5.3 (`typescript`) - type checking
- Babel (`@babel/core`, `babel.config.js`) - transpilation (via Expo/Metro)

## Key Dependencies

**Critical:**
- `expo-router` ~4.0.0 - dependency installed (not actively used in routing)
- `@react-native-async-storage/async-storage` ^2.2.0 - local persistence
- `expo-notifications` ^0.32.16 - local notification scheduling
- `expo-av` ^16.0.8 - audio playback
- `zustand` ^5.0.10 - state management (present, limited usage)

**Infrastructure:**
- `react-native-gesture-handler`, `react-native-reanimated`, `react-native-screens`, `react-native-safe-area-context` - navigation + UI primitives
- `@expo/vector-icons` - icon set

## Configuration

**Environment:**
- No .env usage detected
- App config in `app.json`

**Build:**
- `babel.config.js` - Babel config
- `tsconfig.json` - TypeScript config
- `jest.config.js` - Jest config

## Platform Requirements

**Development:**
- macOS/Windows/Linux with Node + npm
- Expo CLI (`npm run start`) with iOS/Android simulators or Expo Go

**Production:**
- Expo build pipeline (not configured in repo)
- iOS/Android bundles via Expo/EAS (implicit)

---

*Stack analysis: 2026-02-04*
*Update after major dependency changes*
