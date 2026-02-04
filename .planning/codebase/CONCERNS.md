# Codebase Concerns

**Analysis Date:** 2026-02-04

## Tech Debt

**Navigation Setup:**
- Issue: Uses React Navigation directly while `expo-router` is installed but unused
- Why: Likely started with Expo template, then shifted to manual navigation
- Impact: Extra dependency + potential confusion for routing decisions
- Fix approach: Remove `expo-router` or migrate fully to file-based routing

**Settings / Start Date:**
- Issue: Start date for progress is hardcoded in screens (`startDate` set to 2 weeks ago)
- Why: Placeholder logic; settings not persisted yet
- Impact: Progress metrics are inconsistent across installs
- Fix approach: Store start date in settings or onboarding

## Known Bugs

**Slider Import in AudioPlayer:**
- Symptoms: Audio player UI may crash or render incorrectly on RN 0.74+
- Trigger: `Slider` import from `react-native` in `components/AudioPlayer.tsx`
- Workaround: None in repo
- Root cause: Slider moved to `@react-native-community/slider` in newer RN versions

## Security Considerations

**Local Storage Only:**
- Risk: No encryption or user separation; data stored locally via AsyncStorage
- Current mitigation: None
- Recommendations: If sensitive data added, consider secure storage or encryption

## Performance Bottlenecks

**Progress Calculations:**
- Problem: Multiple reads and full-session scans for progress (`lib/progress.ts`)
- Measurement: Not measured
- Cause: Recomputes metrics from all sessions each time
- Improvement path: Cache computed aggregates in storage

## Fragile Areas

**Serialization of Dates:**
- Why fragile: Dates are stored via JSON stringify and returned as strings
- Common failures: Date math can be incorrect if not rehydrated properly
- Safe modification: Normalize dates on read (`new Date(...)`) in `lib/storage.ts`
- Test coverage: Partial (unit tests treat dates but do not verify serialization)

## Scaling Limits

**Local Storage Growth:**
- Current capacity: Device-local storage via AsyncStorage
- Limit: Large histories may slow reads
- Symptoms at limit: Slow app startup and stats calculation
- Scaling path: Pagination, summaries, or external backend

## Dependencies at Risk

**expo-router (unused):**
- Risk: Dead dependency, potential version drift
- Impact: Extra maintenance and confusion
- Migration plan: Remove or adopt for routing

## Missing Critical Features

**No Backend / Sync:**
- Problem: User data does not sync across devices
- Current workaround: None
- Blocks: Multi-device usage, user accounts
- Implementation complexity: Medium (auth + backend + data model)

## Test Coverage Gaps

**UI + Navigation:**
- What's not tested: Screens, navigation flows, AudioPlayer/Timer components
- Risk: Regressions in UI behavior or navigation state
- Priority: Medium
- Difficulty to test: Medium (requires React Native testing setup)

---

*Concerns audit: 2026-02-04*
*Update as issues are fixed or new ones discovered*
