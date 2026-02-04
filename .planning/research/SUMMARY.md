# Project Research Summary

**Project:** Focus Reps
**Domain:** Mindfulness‑based attention training app (offline‑first, deliberate‑practice feedback loops)
**Researched:** 2026-02-04
**Confidence:** MEDIUM

## Executive Summary

Focus Reps fits the established pattern of structured mindfulness training apps, but with a deliberate‑practice emphasis: concrete feedback loops (lapse count, uninterrupted focus interval) and a weekly review that drives behavior change. Research on mindfulness‑based attention training (MBAT) supports structured multi‑week programs, and related literature suggests attention can be improved with consistent practice. A 6‑week schedule is acceptable for v1, but research suggests shorter variants (e.g., 4‑week MBAT programs) are plausible and should be explored for adherence.

Given the existing Expo/React Native codebase, the recommended approach is to keep the current stack, prioritize rebrand + original content, then implement the feedback loop and weekly review. The main risks are IP overlap with Peak Mind content, over‑reliance on vague self‑report metrics, and notification fatigue. These are avoidable with original scripts, simple metrics, and weekly‑only reminders.

## Key Findings

### Recommended Stack

Stay on Expo SDK 51 + React Native 0.74 for v1; it aligns with the current codebase and supports audio and notifications. Keep AsyncStorage for local‑only persistence and add lightweight metrics aggregation modules.

**Core technologies:**
- Expo SDK 51: runtime + tooling — already in codebase
- React Native 0.74: mobile UI runtime — supported by Expo 51
- React Navigation 7: stack + tabs

### Expected Features

**Must have (table stakes):**
- Guided sessions (audio + timer)
- Progress tracking (streaks, minutes)
- Structured schedule (6‑week baseline)
- Journaling or reflection

**Should have (competitive):**
- Daily survey + post‑session lapse count
- Longest uninterrupted focus interval
- Weekly review with recommendations

**Defer (v2+):**
- Accounts/sync
- Paid tiers
- Team/organization mode

### Architecture Approach

Offline‑first architecture with screens → domain services → local storage. Add a session engine (timer + lapse capture), a feedback engine (survey + metrics), and a weekly review aggregator. Keep content decoupled from UI to support future library expansion.

**Major components:**
1. Practice engine — schedule + recommendations
2. Session engine — timer + lapse capture
3. Review engine — weekly aggregation + insights

### Critical Pitfalls

1. **IP overlap** — avoid Peak Mind scripts/names; use original content.
2. **Misaligned metrics** — minutes alone aren’t enough; track lapses + uninterrupted interval.
3. **Notification fatigue** — weekly summary only by default.
4. **Schedule rigidity** — allow flexible pacing after core weeks.

## Implications for Roadmap

### Phase 1: Rebrand + Content Foundation
**Rationale:** Must remove Peak Mind IP risk and establish Focus Reps identity.
**Delivers:** New name/copy, renamed practices, original scripts.
**Addresses:** Table stakes + IP pitfalls.

### Phase 2: Deliberate‑Practice Feedback Loop
**Rationale:** Differentiator requires new data capture + metrics.
**Delivers:** Daily survey, lapse tracking, uninterrupted interval, weekly review.
**Uses:** Local storage + review aggregator.

### Phase 3: Practice Library Expansion + Schedule Variants
**Rationale:** Increase personalization and retention after core loop works.
**Delivers:** New practices + research‑informed schedules (4‑week/8‑week).
**Avoids:** Drop‑off from rigidity.

### Phase Ordering Rationale

- Rebrand/content must precede any feature expansion to avoid IP risk.
- Feedback loop depends on session tracking and storage.
- Expanded library should follow proof that feedback loops increase adherence.

### Research Flags

Phases likely needing deeper research during planning:
- **Phase 3:** practice library expansion + schedule efficacy studies.

Phases with standard patterns (skip extra research):
- **Phase 1–2:** rebrand + feedback loops (well‑understood in existing codebase).

## Confidence Assessment

| Area | Confidence | Notes |
|------|------------|-------|
| Stack | HIGH | Existing Expo stack aligns with domain needs |
| Features | MEDIUM | Market expectations clear; differentiation needs validation |
| Architecture | HIGH | Local‑only offline apps are standard |
| Pitfalls | MEDIUM | Requires ongoing validation with user behavior |

**Overall confidence:** MEDIUM

### Gaps to Address

- Validate which schedule length (4‑week vs 6‑week) yields best adherence.
- Validate whether lapse count + uninterrupted interval feel meaningful to users.

## Sources

### Primary (HIGH confidence)
- https://expo.dev/changelog/2024/05-07-sdk-51 — Expo SDK 51 + RN 0.74
- https://expo.dev/changelog/2024/10-22-sdk-52 — Expo SDK 52 + RN 0.75
- https://reactnative.dev/blog/2024/05/14/0.74-release — RN 0.74 baseline

### Secondary (MEDIUM confidence)
- https://pubmed.ncbi.nlm.nih.gov/30987298/ — MBAT field studies (attention protection)
- https://pubmed.ncbi.nlm.nih.gov/32096401/ — MBAT 4‑week program + SART outcomes
- https://www.pnas.org/doi/10.1073/pnas.1018441108 — mindfulness training improves attention/working memory

---
*Research completed: 2026-02-04*
*Ready for roadmap: yes*
