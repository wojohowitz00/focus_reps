# Focus Reps

## What This Is

Focus Reps is a mindfulness-based attention training app for students and professionals who want to increase sustained focus time. It delivers a structured daily practice program (guided audio + text), captures deliberate-practice feedback, and provides weekly reviews that reinforce progress and next steps.

## Core Value

Increase sustained focus time through deliberate, repeatable mindfulness practice.

## Requirements

### Validated

- ✓ User can browse available practices and start a session — existing
- ✓ User can complete a guided practice session with a timer — existing
- ✓ User can track progress metrics (streaks, total sessions/minutes) — existing
- ✓ User can write and review journal entries linked to sessions — existing
- ✓ User can configure practice settings locally — existing

### Active

- [ ] Rebrand UI/UX from Peak Mind to Focus Reps (name, copy, visuals)
- [ ] Rename practices and author new scripts/content (no Peak Mind IP reuse)
- [ ] Daily survey captures focus quality, mood, stress, and energy
- [ ] Post‑session feedback captures number of attention lapses
- [ ] Timed performance tracked per session (longest uninterrupted focus interval)
- [ ] Weekly review shows total focus minutes, longest uninterrupted interval, lapses per session, journal highlights, and recommended next practice
- [ ] Weekly summary notification prompts users to review progress (no daily reminders in v1)
- [ ] Practice library expanded beyond current 4 practices, informed by research

### Out of Scope

- User accounts or cloud sync — local-only MVP
- Paid features or subscriptions — free MVP first
- Social features, communities, or sharing — not required for v1
- External analytics/telemetry — privacy-first local tracking only

## Context

- Existing Expo React Native codebase already implements core screens (home, practice, progress, journal, settings), local storage, and practice scheduling.
- Current practice structure is a 6‑week schedule with 4 practices; content must be renamed and rewritten to avoid Peak Mind IP reuse.
- Feedback loops (daily survey, lapse counts, weekly review insights) are the primary differentiation from existing “Peak Mind” ecosystem apps.
- Target audience: students and professionals seeking evidence‑based focus training.

## Constraints

- **Platforms**: iOS and Android via Expo — reuse existing stack
- **Data**: Local-only storage — no backend in v1
- **Content/IP**: New practice names and scripts required — no Peak Mind content reuse
- **Monetization**: Free MVP — paid tier deferred
- **Schedule**: Use 6‑week progression in v1 while researching alternatives

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Rebrand existing Peak Mind app to Focus Reps | Faster iteration vs. greenfield build | — Pending |
| Rename practices + write original scripts | Avoid IP conflicts; differentiate brand | — Pending |
| Local‑only MVP | Privacy and speed of delivery | — Pending |
| Weekly summary only (no daily reminders) | Reduce notification fatigue | — Pending |
| Track lapses + longest uninterrupted interval | Align with deliberate‑practice feedback | — Pending |

---
*Last updated: 2026-02-04 after initialization*
