# Focus Reps

## What This Is

Focus Reps is a mindfulness-based attention training app for students and professionals who want to increase sustained focus time. It delivers a structured daily practice program (guided audio + text), captures deliberate-practice feedback after sessions, and provides weekly reviews that reinforce progress and next steps.

## Core Value

Increase sustained focus time through deliberate, repeatable mindfulness practice.

## Current State

- **v1.0 shipped (2026-02-04).**
- Focus Reps branding + original practice scripts (4 practices).
- Program modes: standard 6‑week, extended 8‑week, open training.
- Post‑session survey, lapse tracking, longest uninterrupted focus interval.
- Weekly review with metrics, journal highlights, and recommended next practice.
- Weekly and optional daily reminders (opt‑in) with local‑only storage.

## Next Milestone Goals

- Resolve v1.0 tech debt (weekly reminder reschedule duplication, device QA, documentation drift).
- Expand practice library and validate alternate schedule variants.
- Evaluate additional measurement options (objective attention tasks if warranted).

## Requirements

### Validated

- ✓ User can browse available practices and start a session — preexisting
- ✓ User can complete a guided practice session with a timer — preexisting
- ✓ User can track progress metrics (streaks, total sessions/minutes) — preexisting
- ✓ User can write and review journal entries linked to sessions — preexisting
- ✓ User can configure practice settings locally — preexisting
- ✓ Focus Reps branding and copy across all screens — v1.0
- ✓ Practices renamed with original scripts — v1.0
- ✓ Onboarding frames deliberate‑practice mentor model — v1.0
- ✓ Default 6‑week training schedule — v1.0
- ✓ Flexible pacing after week 4 — v1.0
- ✓ Manual practice selection outside schedule — v1.0
- ✓ Extended 8‑week training option — v1.0
- ✓ Daily survey captures focus, mood, stress, energy — v1.0
- ✓ Post‑session lapse count recorded — v1.0
- ✓ Longest uninterrupted focus interval tracked — v1.0
- ✓ Session minutes + reps summary tracked — v1.0
- ✓ Weekly review shows minutes, interval, lapses, highlights, recommendation — v1.0
- ✓ Weekly summary reminder notification — v1.0
- ✓ Optional daily reminder (opt‑in) — v1.0
- ✓ iOS + Android supported (device QA pending) — v1.0
- ✓ Local‑only storage; offline‑first — v1.0

### Active

- [ ] Resolve v1.0 tech debt (weekly reminder reschedule fix, device QA, doc cleanup)
- [ ] Expand practice library beyond the initial set
- [ ] Alternate schedule variants (evidence‑based 4‑week / other tracks)
- [ ] Optional objective attention task (SART‑style) if validated by research

### Out of Scope

- User accounts or cloud sync — local-only MVP
- Paid features or subscriptions — free MVP first
- Social features, communities, or sharing — not required for v1
- External analytics/telemetry — privacy-first local tracking only

## Context

- Expo React Native codebase with core screens (home, practice, progress, journal, settings).
- Focus Reps uses a 6‑week schedule with 4 practices and program-aware scheduling modes.
- Feedback loop is the main differentiator: check‑in survey, lapse tracking, weekly review.
- Notifications are opt‑in and local; no backend services.
- Target audience remains students and professionals seeking evidence‑based focus training.

## Constraints

- **Platforms**: iOS and Android via Expo — reuse existing stack
- **Data**: Local-only storage — no backend in v1
- **Content/IP**: Original practice names and scripts required — no Peak Mind reuse
- **Monetization**: Free MVP — paid tier deferred
- **Schedule**: Maintain 6‑week progression while researching alternatives

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Rebrand existing Peak Mind app to Focus Reps | Faster iteration vs. greenfield build | ✓ Shipped v1.0 |
| Rename practices + write original scripts | Avoid IP conflicts; differentiate brand | ✓ Shipped v1.0 |
| Local‑only MVP | Privacy and speed of delivery | ✓ Shipped v1.0 |
| Weekly summary only (no daily reminders) | Reduce notification fatigue | ⚠ Revisit (daily reminders implemented) |
| Track lapses + longest uninterrupted interval | Align with deliberate‑practice feedback | ✓ Shipped v1.0 |
| Add program modes (6‑week, 8‑week, open) | Support different training paths | ✓ Shipped v1.0 |
| Normalize legacy practice IDs on read | Preserve existing session history | ✓ Shipped v1.0 |
| Weekly reminders default off (Sunday 19:00) | Opt‑in to reduce fatigue | ✓ Shipped v1.0 |
| Weekly review uses current program week | Keep summaries aligned to schedule | ✓ Shipped v1.0 |

---
*Last updated: 2026-02-04 after v1.0 milestone*
