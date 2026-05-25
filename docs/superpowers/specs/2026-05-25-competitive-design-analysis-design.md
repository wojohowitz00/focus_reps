# Focus Reps — Competitive Design Analysis & Design Decisions

**Date:** 2026-05-25
**Scope:** Visual language, onboarding, session UI, progress & gamification
**Competitive set:** Calm, Headspace, Waking Up, Balance, Healthy Minds, Insight Timer, Ten Percent Happier, BetterSleep, Aura, Smiling Mind, Meditopia

---

## 1. Competitive Positioning

### The market gap

Apps cluster into two zones that Focus Reps should not occupy:

- **Passive + Warm** (Calm, Headspace, BetterSleep): escape, relaxation, ambient — designed to help users disengage
- **Active + Cool/Clinical** (Waking Up, Healthy Minds): serious, rigorous, but cold — can read as intimidating for younger audiences

The open territory is **Active/Performance + Approachable**: a training environment that takes attention seriously without feeling like a lab or a lecture. No competitor occupies this space.

### Where Focus Reps sits

- **X axis:** Significantly toward "Active / Performance" — not passive retreat
- **Y axis:** Warm enough for students (18+), credible enough for executives — not cold/clinical, not spa-like

Closest references outside the meditation category: Nike Training Club, Duolingo (dark mode), Brilliant.org.

---

## 2. Visual Language

### Palette — "Approachable Science"

| Role | Color | Hex |
|------|-------|-----|
| Background | Dark navy | `#0c1220` |
| Surface | Deep blue-grey | `#0d1929` |
| Primary accent | Sky blue | `#38bdf8` |
| Warm accent | Coral | `#ff7043` |
| Body text | Near-white | `#f1f5f9` |
| Subdued text | Muted blue | `#38bdf850` |

The coral accent (`#ff7043`) does specific emotional work: it adds warmth and a sense of urgency/achievement without softening the scientific credibility of the primary blue. It should appear on progress deltas, CTAs, and the SART score — moments of earned outcome.

### Typography

- **One font size family per screen.** No mixing of decorative and body sizes.
- Timer and score displays: `font-weight: 200`, large, tabular nums — precision without heaviness
- Labels: `font-size: 11px`, `letter-spacing: .1em`, `text-transform: uppercase`, muted opacity — present but not competing

### What to avoid

- Nature imagery (Calm's escape register)
- Illustrated characters (Headspace's playful register)
- Near-total black with no warmth (Waking Up's austerity)
- Cream/sand tones (Balance's productivity-tool register)

---

## 3. Onboarding

### Marketing vs. in-app split

These are two different jobs and must not be conflated:

| Surface | Copy | Purpose |
|---------|------|---------|
| Ads / social / landing page | *"Your attention didn't shrink. It got hijacked."* | Provocation — triggers self-recognition, earns the click |
| Onboarding screen 1 | *"Attention is a muscle. You can train it."* | Construction — reframes the user as capable, sets training tone |

### Onboarding flow

```
Science hook (1–2 screens)
    ↓
Attention Profile quiz (5–7 questions)
    ↓
"Building your profile…" animation
    ↓
SART-Lite baseline test
    ↓
Attention Profile reveal
```

**Science hook copy (Screen 1):**

> **Attention is a muscle. You can train it.**
>
> Most people try to focus harder. Research shows that's not how it works — focus is a skill you build through practice, the same way you build any other skill.
>
> *12 minutes a day. We'll measure the difference.*

**Design rules:**
- Civilian language throughout — no military cohorts, no clinical trial references
- "At any age" is implicit in tone, not stated (avoids condescension)
- The "building your profile..." loading animation (stolen from Balance) makes the quiz feel like a real diagnostic, not a branching survey
- The SART-Lite baseline is the unique move: it gives the user their first real number before their first session — a concrete "before" to measure against

### What to steal from competitors

| Competitor | What to borrow |
|-----------|---------------|
| Balance | "Building your plan…" animation post-quiz |
| Waking Up | Brief science-framing screens before any questions — earns credibility with skeptics |
| Healthy Minds | Frame onboarding as *enrollment in a training program*, not app setup |
| Headspace | Keep total friction low — don't over-quiz before the first session |

---

## 4. Session UI

### Layout (Option B — confirmed)

Single-column, four elements in strict vertical hierarchy:

```
[subdued label]          "Focus Booster · Rep 3"   — 11px, uppercase, muted opacity
[breath ring]            3 concentric rings + center dot
[timer]                  48px, font-weight: 200, tabular nums
[progress bar]           2px, single line at bottom edge
```

**Design rules:**
- No stats during a session. No bandwidth meter, no rep count beyond the label, no score.
- The breath ring is the visual anchor — geometric, purposeful, no personality (not a character, not a nature scene)
- "Rep 3" language (not "Day 12 of 30") reinforces the muscle/training metaphor
- All stats live on the post-session screen, where the user has headspace to process them

### Competitive rationale

| Competitor | Session approach | Verdict for Focus Reps |
|-----------|-----------------|------------------------|
| Calm | Ambient nature imagery, breathing animation | ✗ Too passive — encourages disengagement |
| Waking Up | Near-blank, audio only | ✓ Minimal is right, but too barren — no training signal |
| Headspace | Animated orange blob | ✗ Too playful — undermines training seriousness |
| Focus Reps | Breath ring + timer + thin progress bar | ✓ Active but uncluttered |

---

## 5. Progress & Gamification

### Core principle

Every competitor measures **inputs** (days meditated, hours logged, streak length). Focus Reps owns **output** gamification: your SART score is a real cognitive performance number. The only comparison is you vs. your week-1 self. No leaderboards, no social comparison, no streak anxiety.

### Two-screen split

**Screen 1 — Post-session (appears after every session):**

```
[checkmark in circle]
Rep 3 done
Focus Booster · L1

[bandwidth card]
  Bandwidth        +4%
  ████████░░        72%
  3 sessions to Level 2

SART test in 4 days
```

- Maximum 3 elements
- Bandwidth delta (`+4%`) in coral — the earned outcome
- Single forward prompt at bottom (next milestone or SART date)
- No interaction required; user taps to dismiss

**Screen 2 — Progress tab (accessed intentionally):**

```
Focus Score
847 ms
▲ 12ms faster than week 1

[4-week sparkline]
Wk1  Wk2  Wk3  Now

Level 1
████████░░  3 sessions to L2
```

- Unlocks after the SART baseline taken during onboarding (the user already has a "week 1" score from day one)
- SART score in coral (the output metric)
- Sparkline shows trend, not raw numbers — the direction matters more than the value
- Level bar is a single thin element, not a dominant visual

### What to steal from competitors

| Competitor | What to borrow |
|-----------|---------------|
| Balance | Personal analytics — reflective, not competitive |
| Waking Up | No streak mechanics, no pressure |
| Headspace | Clear level unlock moments (but not course-completion framing) |

### What to explicitly avoid

- Leaderboards (Insight Timer)
- Cumulative hours / badge collections (Insight Timer)
- Streak counters that create anxiety on reset (Headspace)
- Social comparison of any kind

---

## 6. Design System Summary

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Palette | Approachable Science (navy + sky blue + coral) | Warm enough for students, precise enough for adults |
| Positioning | Active/Performance + Approachable | White space no competitor occupies |
| Marketing hook | "Your attention didn't shrink. It got hijacked." | Provocative, scroll-stopping, universal |
| Onboarding hook | "Attention is a muscle. You can train it." | Constructive, age-neutral, sets training tone |
| Onboarding language | Civilian (no military/clinical references) | Accessible to all age groups |
| Session screen | 4 elements, B layout | Minimal, purposeful, not passive |
| Progress gamification | Output-first, two-screen split | Unique position; no competitor measures cognitive output |
| Social features | None | Intrinsic motivation over social comparison |
