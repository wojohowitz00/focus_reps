# Architecture Research

**Domain:** Offline‑first mindfulness + attention training app
**Researched:** 2026-02-04
**Confidence:** MEDIUM

## Standard Architecture

### System Overview

```
┌─────────────────────────────────────────────────────────────┐
│                        UI / Screens                          │
├─────────────────────────────────────────────────────────────┤
│  Home  Practice  Session  Journal  Progress  Weekly Review  │
└──────────────┬───────────────┬───────────────┬───────────────┘
               │               │               │
┌──────────────┴───────────────┴───────────────┴───────────────┐
│                     Domain / Services                        │
│  Practice Engine  Session Engine  Feedback Engine  Scheduler │
└──────────────┬───────────────┬───────────────┬───────────────┘
               │               │               │
┌──────────────┴───────────────┴───────────────┴───────────────┐
│                       Local Storage                           │
│           Sessions  Surveys  Journal  Settings  Metrics      │
└─────────────────────────────────────────────────────────────┘
```

### Component Responsibilities

| Component | Responsibility | Typical Implementation |
|-----------|----------------|------------------------|
| Practice Engine | Schedule, practice selection, progression | Pure functions + config (`lib/practices.ts`) |
| Session Engine | Start/stop timer, capture lapses, compute uninterrupted interval | Service module + timer hooks |
| Feedback Engine | Daily survey + post‑session metrics | Local forms + storage wrapper |
| Weekly Review | Aggregate metrics + recommendations | Derived statistics + summary builder |
| Storage | Persist sessions/surveys/journal/settings | AsyncStorage wrapper (`lib/storage.ts`) |
| Notifications | Weekly summary reminder | `expo-notifications` |

## Recommended Project Structure

```
app/
  (tabs)/            # Primary screens
  practice/          # Session screen(s)
  weekly-review.tsx  # Weekly summary (new)
components/
  PracticeTimer.tsx
  LapseCounter.tsx
  SurveyForm.tsx
lib/
  practices.ts       # schedule logic
  sessions.ts        # session start/stop + metrics (new)
  feedback.ts        # survey + lapse tracking (new)
  review.ts          # weekly aggregation (new)
  storage.ts         # persistence
  notifications.ts   # reminders
```

### Structure Rationale

- **app/** keeps routing + screen composition centralized.
- **lib/** isolates domain logic and analytics from UI.

## Architectural Patterns

### Pattern 1: Event‑sourced session logging

**What:** Store raw session events (start, lapse count, end) and derive aggregates.
**When to use:** Metrics require re‑computation as algorithms evolve.
**Trade-offs:** More data, but future‑proof analytics.

### Pattern 2: Derived weekly aggregates

**What:** Compute weekly summary from sessions + surveys on demand (or cache).
**When to use:** Weekly review screen, notification previews.
**Trade-offs:** Slightly slower load unless cached.

### Pattern 3: Content decoupling

**What:** Store practice scripts/content separate from UI components.
**When to use:** Multiple practice types, updates, localization.
**Trade-offs:** Requires content pipeline discipline.

## Data Flow

### Request Flow

```
User starts session
    ↓
Session Engine → Timer + Lapse input → Storage (session record)
    ↓
Feedback Engine → Daily survey → Storage (survey record)
    ↓
Weekly Review → Aggregate metrics → UI summary + recommendation
```

### State Management

- Local state inside screens/components
- Persistent state via AsyncStorage
- Optional future: store aggregates to reduce recomputation

### Key Data Flows

1. **Session completion:** Practice session → lapse count → session record
2. **Daily survey:** Post‑practice survey → daily metrics
3. **Weekly review:** Aggregation across sessions + surveys + journal

## Scaling Considerations

| Scale | Architecture Adjustments |
|-------|--------------------------|
| 0-1k users | Local‑only storage is fine |
| 1k-100k users | If adding sync, introduce backend + auth + encryption |
| 100k+ users | Dedicated analytics + content delivery infrastructure |

### Scaling Priorities

1. **First bottleneck:** Local storage growth → add caching/archiving
2. **Second bottleneck:** Cross‑device expectations → backend sync

## Anti-Patterns

### Anti-Pattern 1: Mixing content and UI

**What people do:** Hard‑code scripts in screen components.
**Why it's wrong:** Makes content updates expensive and error‑prone.
**Do this instead:** Keep scripts in content modules or JSON and render dynamically.

### Anti-Pattern 2: Recomputing metrics on every render

**What people do:** Run heavy aggregations in render cycle.
**Why it's wrong:** Leads to jank on older devices.
**Do this instead:** Precompute aggregates in `lib/review.ts` or cache.

## Integration Points

### External Services

| Service | Integration Pattern | Notes |
|---------|---------------------|-------|
| None in MVP | N/A | Local‑only MVP |

### Internal Boundaries

| Boundary | Communication | Notes |
|---------|---------------|------|
| UI → Domain | Function calls | Keep calculations in `lib/` |
| Domain → Storage | AsyncStorage wrapper | Ensure date rehydration |

---

*Architecture research for: Focus Reps*
*Researched: 2026-02-04*
