# Feature Research

**Domain:** Mindfulness‑based attention training (mobile, deliberate‑practice focus)
**Researched:** 2026-02-04
**Confidence:** MEDIUM

## Feature Landscape

### Table Stakes (Users Expect These)

| Feature | Why Expected | Complexity | Notes |
|---------|--------------|------------|-------|
| Guided practice sessions (audio + timer) | Core to mindfulness apps | MEDIUM | Needed for daily reps |
| Progress tracking (streaks, minutes) | Users want evidence of progress | MEDIUM | Already in codebase |
| Practice scheduling (multi‑week program) | Structure drives adherence | MEDIUM | 6‑week baseline; research 4‑week variants |
| Journaling or reflection prompts | Reflection is common in mindfulness apps | MEDIUM | Present in existing app |
| Offline‑first usage | Users expect private, portable practice | LOW | Aligns with local‑only MVP |

### Differentiators (Competitive Advantage)

| Feature | Value Proposition | Complexity | Notes |
|---------|-------------------|------------|-------|
| Deliberate‑practice feedback loop | Converts practice into measurable focus gains | MEDIUM | Daily survey + post‑session lapse count |
| Longest uninterrupted focus interval | Concrete metric for “sustained focus” | MEDIUM | Requires in‑session timer + user input |
| Weekly review with recommendations | Positions app as mentor/coach | MEDIUM | Must summarize progress + suggest next practice |
| Practice library beyond 4 basics | Expands appeal + targeted focus goals | MEDIUM/HIGH | Requires new scripts and research |
| Research‑grounded assessments | Credible measurement (e.g., SART‑style tasks) | HIGH | Optional, consider later phase |

### Anti-Features (Commonly Requested, Often Problematic)

| Feature | Why Requested | Why Problematic | Alternative |
|---------|---------------|-----------------|-------------|
| Social feeds/leaderboards | “Motivation” via comparison | Increases anxiety, undermines mindfulness | Private progress + self‑comparison over time |
| Frequent push notifications | “Habit building” | Notification fatigue; users disable | Weekly summary + optional reminders |
| Generic meditation library | “More content” | Dilutes focus‑training positioning | Curated focus‑training library |

## Feature Dependencies

```
Daily survey + lapse tracking
    └──requires──> Session completion events
                       └──requires──> Practice session timer

Weekly review
    └──requires──> Stored session metrics + surveys + journal entries

Recommended next practice
    └──requires──> Practice schedule engine + progress history
```

### Dependency Notes

- **Weekly review requires session events:** Without consistent capture, review becomes anecdotal.
- **Recommendations require schedule logic:** Must know what’s next in the progression.

## MVP Definition

### Launch With (v1)

- [ ] Rebrand UI + copy to Focus Reps — essential for positioning
- [ ] Renamed practices + original scripts — avoid Peak Mind IP reuse
- [ ] Daily survey (focus quality, mood, stress, energy) — core feedback loop
- [ ] Post‑session lapse count — core “reps” signal
- [ ] Weekly review metrics + recommended next practice — mentor experience

### Add After Validation (v1.x)

- [ ] Expanded practice library — after initial retention signals
- [ ] New schedule variants (4‑week, 8‑week) — after efficacy research
- [ ] Optional attention task (SART‑style) — if users want objective metric

### Future Consideration (v2+)

- [ ] Accounts + sync — requires backend + privacy design
- [ ] Paid tier content — after MVP adoption
- [ ] Team/organization mode — only after individual PMF

## Feature Prioritization Matrix

| Feature | User Value | Implementation Cost | Priority |
|---------|------------|---------------------|----------|
| Rebrand + copy update | HIGH | LOW | P1 |
| Renamed practices + scripts | HIGH | MEDIUM | P1 |
| Daily survey + lapse count | HIGH | MEDIUM | P1 |
| Weekly review summary | HIGH | MEDIUM | P1 |
| Expanded practice library | MEDIUM | HIGH | P2 |
| Schedule variants | MEDIUM | MEDIUM | P2 |
| Objective attention task | MEDIUM | HIGH | P2 |

## Competitor Feature Analysis

| Feature | Pushups for the Mind (PMI) | General mindfulness apps | Our Approach |
|---------|----------------------------|--------------------------|--------------|
| Structured training | Yes (program‑based) | Sometimes | Keep 6‑week core + research variants |
| Feedback loops | Limited | Often light | Deliberate‑practice metrics + weekly review |
| Focus metrics | Minimal | Rare | Lapses + uninterrupted interval |

## Sources

- https://amishi.com/pushups-for-the-mind-app-is-now-available-to-users-with-a-mil-email-address-and-select-u-s-military-academies-and-war-colleges-public-release-coming-soon-stay-tuned
- https://pubmed.ncbi.nlm.nih.gov/30987298/
- https://www.pnas.org/doi/10.1073/pnas.1018441108

---
*Feature research for: Focus Reps*
*Researched: 2026-02-04*
