# Stack Research

**Domain:** Mobile mindfulness + attention training app (offline‑first, guided audio + feedback loops)
**Researched:** 2026-02-04
**Confidence:** MEDIUM

## Recommended Stack

### Core Technologies

| Technology | Version | Purpose | Why Recommended |
|------------|---------|---------|-----------------|
| Expo SDK | 51.x | Mobile runtime + tooling | Existing codebase uses Expo; stable RN 0.74 support and proven DX for audio/notifications |
| React Native | 0.74.x | Native UI runtime | Supported by Expo SDK 51; mature ecosystem for cross‑platform UI |
| React | 18.2 | UI model | Stable in RN/Expo 51 |
| React Navigation | 7.x | Navigation | Standard for tabs + stacks in RN apps |

### Supporting Libraries

| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| expo-av | 16.x | Audio playback | Guided practice audio sessions |
| expo-notifications | 0.32.x | Local notifications | Weekly review reminders |
| @react-native-async-storage/async-storage | 2.x | Local persistence | Local‑only MVP (sessions, survey, journal) |
| react-native-reanimated | 4.x | Animations | Timers, progress animations (optional) |
| react-native-svg | 15.x | Charts/visuals | Weekly review charts (optional) |

### Development Tools

| Tool | Purpose | Notes |
|------|---------|-------|
| TypeScript | Type safety | Already configured via `tsconfig.json` |
| Jest | Unit testing | Existing tests for `lib/` modules |

## Installation

```bash
# Core
npm install expo react react-native @react-navigation/native @react-navigation/bottom-tabs @react-navigation/stack

# Supporting
npm install expo-av expo-notifications @react-native-async-storage/async-storage react-native-svg react-native-reanimated
```

## Alternatives Considered

| Recommended | Alternative | When to Use Alternative |
|-------------|-------------|-------------------------|
| Expo SDK | React Native CLI | If native modules or custom build pipeline required beyond Expo |
| AsyncStorage | SQLite (expo-sqlite) | If local data volume grows or query needs become complex |
| React Navigation | expo-router | If switching to file‑based routing for consistency across screens |

## What NOT to Use

| Avoid | Why | Use Instead |
|-------|-----|-------------|
| Heavy analytics SDKs in MVP | Conflicts with privacy‑first local‑only requirement | Local metrics stored in AsyncStorage |
| Over‑customized navigation wrappers | Adds maintenance burden | Standard React Navigation patterns |

## Stack Patterns by Variant

**If local‑only MVP:**
- Use AsyncStorage + derived aggregates in memory
- Because quick iteration and privacy‑first positioning

**If future sync/account:**
- Add backend + secure auth + encrypted local cache
- Because cross‑device continuity and paid tiers

## Version Compatibility

| Package A | Compatible With | Notes |
|-----------|-----------------|-------|
| Expo SDK 51 | React Native 0.74 | Supported per Expo SDK 51 release notes |
| Expo SDK 52 | React Native 0.75 | Next‑gen upgrade path (future) |

## Sources

- https://expo.dev/changelog/2024/05-07-sdk-51
- https://expo.dev/changelog/2024/10-22-sdk-52
- https://reactnative.dev/blog/2024/05/14/0.74-release

---
*Stack research for: Focus Reps*
*Researched: 2026-02-04*
