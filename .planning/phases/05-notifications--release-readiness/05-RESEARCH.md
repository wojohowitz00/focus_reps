# Phase 05 Research — Notifications & Release Readiness

## Summary

Expo Notifications supports local scheduled notifications on iOS and Android, but requires explicit permissions and proper handling for recurring schedules. For Focus Reps, weekly summary reminders should be opt‑in and respect user‑configured reminder time. Cross‑platform readiness requires verifying notification permissions and navigation flow sanity.

## Key Notes

- Expo Notifications uses `scheduleNotificationAsync` with `trigger` that can repeat weekly using `weekday` and `hour/minute` fields for local scheduling. citeturn1search2
- iOS requires user permission for notifications and will not show notifications without explicit consent. citeturn1search1
- Android requires a notification channel for scheduled notifications; Expo handles this via `setNotificationChannelAsync`. citeturn1search2

## Implications for Phase 05

- Add a weekly reminder schedule that respects user local time and can be toggled off.
- Add settings UI for weekly summary reminders (separate from daily reminders).
- Keep it local‑only (no push tokens).

## Sources

- Expo Notifications scheduling docs: https://docs.expo.dev/versions/latest/sdk/notifications/ citeturn1search2
- Expo permissions notes: https://docs.expo.dev/versions/latest/sdk/notifications/#permissions citeturn1search1
