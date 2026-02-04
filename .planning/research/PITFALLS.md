# Pitfalls Research

**Domain:** Mindfulness‑based attention training apps
**Researched:** 2026-02-04
**Confidence:** MEDIUM

## Critical Pitfalls

### Pitfall 1: IP/Trademark bleed from Peak Mind content

**What goes wrong:** Reusing practice names/scripts or “Peak Mind” branding creates legal and reputational risk.

**Why it happens:** Teams reuse known content to move fast.

**How to avoid:** Rename practices, write original scripts, avoid “Peak Mind” branding, document sources.

**Warning signs:** Copy/paste from book, app copy references Peak Mind.

**Phase to address:** Phase 1 (rebrand + content rewrite).

---

### Pitfall 2: Over‑reliance on self‑report metrics

**What goes wrong:** Users lose trust if metrics feel arbitrary or inconsistent.

**Why it happens:** Self‑report is easiest to implement.

**How to avoid:** Keep metrics simple (lapses count + uninterrupted interval), explain how they’re used, triangulate with session duration.

**Warning signs:** Users report confusion about “focus score.”

**Phase to address:** Phase 2 (feedback loop design).

---

### Pitfall 3: Notification fatigue

**What goes wrong:** Users disable notifications, reducing habit formation.

**Why it happens:** Over‑notification in early MVPs.

**How to avoid:** Weekly summary only by default; allow opt‑in reminders.

**Warning signs:** Users turn off notifications within first week.

**Phase to address:** Phase 2 (engagement loop).

---

### Pitfall 4: Metrics not aligned with training goal

**What goes wrong:** Tracking “minutes practiced” alone doesn’t reflect sustained focus time.

**Why it happens:** Existing mindfulness apps focus on duration metrics.

**How to avoid:** Track uninterrupted focus interval and lapses per session in addition to minutes.

**Warning signs:** Weekly review shows only time spent.

**Phase to address:** Phase 2 (feedback loop design).

---

### Pitfall 5: Schedule rigidity hurts adherence

**What goes wrong:** Users drop out if schedule feels too strict.

**Why it happens:** Rigid multi‑week programs without customization.

**How to avoid:** Keep 6‑week progression but allow flexible pacing after week 4; research alternate schedules (4‑week MBAT variants).

**Warning signs:** Drop‑off after week 2 or 3.

**Phase to address:** Phase 3 (schedule refinement).

## Technical Debt Patterns

| Shortcut | Immediate Benefit | Long‑term Cost | When Acceptable |
|----------|-------------------|----------------|-----------------|
| Store dates as JSON strings without rehydration | Fast implementation | Incorrect date math, broken streaks | Never (fix early) |
| Recompute all metrics on every screen load | Simplifies code | Slow progress screen over time | Acceptable only at very small data sizes |
| Hard‑coding practice scripts in UI | Fast to build | Content updates require code changes | Only for prototypes |

## Integration Gotchas

| Integration | Common Mistake | Correct Approach |
|-------------|----------------|------------------|
| Audio (expo‑av) | Not handling background/interruptions | Configure audio mode, handle unloads |
| Notifications | Scheduling without permission checks | Request permissions + graceful fallback |

## Performance Traps

| Trap | Symptoms | Prevention | When It Breaks |
|------|----------|------------|----------------|
| Full‑history scans for weekly review | Slow review load | Cache aggregates | > hundreds of sessions |
| Heavy UI re-renders during timer | Stutter | Isolate timer state | Older devices |

## Security Mistakes

| Mistake | Risk | Prevention |
|---------|------|------------|
| Storing sensitive data unencrypted | Exposure if device compromised | Keep data minimal; consider secure storage if expanded |
| Adding analytics without consent | Privacy breach | Explicit opt‑in, local‑first MVP |

## UX Pitfalls

| Pitfall | User Impact | Better Approach |
|---------|-------------|-----------------|
| Too many input steps after session | Drop‑off | Single lapse count + short survey |
| Ambiguous terms (“attention score”) | Confusion | Plain language + examples |
| Long onboarding | Abandonment | 60‑second onboarding + first practice |

## "Looks Done But Isn't" Checklist

- [ ] **Weekly review:** Must include lapses + uninterrupted interval — not just minutes.
- [ ] **Practice tracking:** Must link journal entries to sessions.
- [ ] **Schedule logic:** Must handle week transitions and customization.
- [ ] **Content rewrite:** Must avoid Peak Mind language or scripts.

## Recovery Strategies

| Pitfall | Recovery Cost | Recovery Steps |
|---------|---------------|----------------|
| IP overlap discovered | HIGH | Rewrite content, update branding, audit copy |
| Metrics don’t resonate | MEDIUM | Simplify survey + adjust review visuals |
| Notification fatigue | LOW | Reduce frequency, add opt‑in choices |

## Pitfall-to-Phase Mapping

| Pitfall | Prevention Phase | Verification |
|---------|------------------|--------------|
| IP overlap | Phase 1 | Content audit + naming review |
| Misaligned metrics | Phase 2 | Weekly review includes lapses + interval |
| Schedule rigidity | Phase 3 | A/B schedule variants or user choice |

## Sources

- https://pubmed.ncbi.nlm.nih.gov/30987298/
- https://www.pnas.org/doi/10.1073/pnas.1018441108
- https://pubmed.ncbi.nlm.nih.gov/32096401/

