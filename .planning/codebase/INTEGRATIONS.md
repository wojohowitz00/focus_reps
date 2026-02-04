# External Integrations

**Analysis Date:** 2026-02-04

## APIs & External Services

**External APIs:**
- None detected (no backend/API calls in codebase)

## Data Storage

**Databases:**
- Local device storage only via AsyncStorage
  - Client: `@react-native-async-storage/async-storage`
  - Storage wrapper: `lib/storage.ts`
  - Keys: `@peak_mind:sessions`, `@peak_mind:journal_entries`, `@peak_mind:progress`, `@peak_mind:settings`

**File Storage:**
- None detected

**Caching:**
- None (local storage used directly)

## Authentication & Identity

**Auth Provider:**
- None (no user auth or backend identity)

## Monitoring & Observability

**Error Tracking:**
- None (uses `console.error`)

**Analytics:**
- None

**Logs:**
- Console only

## Device/OS Integrations

**Notifications:**
- `expo-notifications` in `lib/notifications.ts`
  - Requests permissions and schedules local notifications

**Audio:**
- `expo-av` in `components/AudioPlayer.tsx`
  - Plays guided meditation audio via `Audio.Sound`

## CI/CD & Deployment

**Hosting:**
- Not configured in repo (no EAS config, no CI workflows)

**CI Pipeline:**
- None detected

## Environment Configuration

**Development:**
- No required env vars detected

**Staging/Production:**
- Not configured

## Webhooks & Callbacks

**Incoming:**
- None

**Outgoing:**
- None

---

*Integrations analysis: 2026-02-04*
*Update if external services are added*
