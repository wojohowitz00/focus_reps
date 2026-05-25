# Focus Reps — Design System

> Append any new design values discovered during implementation to this file.
> This is the source of truth. constants/theme.ts must match it exactly.

---

## Positioning

**Emotional register:** Active/Performance + Approachable
**Category:** Cognitive training, not meditation spa
**Audience:** Students (18+) through executives (50+)
**Reference products:** Nike Training Club, Brilliant.org, Duolingo (dark)

---

## Color System (OKLCH)

All colors specified in OKLCH for perceptual uniformity.
React Native implementation uses hex equivalents in constants/theme.ts.

| Token | OKLCH | Hex | Usage |
|-------|-------|-----|-------|
| `background` | oklch(12% 0.027 248) | #0c1220 | Screen backgrounds |
| `surface` | oklch(16% 0.031 248) | #0d1929 | Cards, input backgrounds |
| `primary` | oklch(74% 0.141 211) | #38bdf8 | Primary accent, rings, labels |
| `coral` | oklch(65% 0.187 30) | #ff7043 | Earned outcomes — score deltas, CTAs, SART score |
| `textBody` | oklch(96% 0.007 248) | #f1f5f9 | Body text, timers |
| `textMuted` | primary at 31% opacity | rgba(56,189,248,0.31) | Subdued labels, secondary info |
| `border` | oklch(24% 0.065 248) | #1e3a5a | Card borders, dividers |

### Contrast flows (visual hierarchy)
1. Timer / Score (coral or textBody) — maximum weight
2. Primary labels (primary) — supporting weight
3. Subdued labels (textMuted) — minimal weight, present but not competing

### Coral usage rule
Coral (#ff7043) appears ONLY on:
- Progress deltas ("+4%")
- SART score value
- Primary CTAs
- Level-up moments

It must not appear on decorative elements, backgrounds, or informational text.

---

## Typography

**Font families (React Native):**
- All text: system default (San Francisco/iOS, Roboto/Android)
- BANNED: 'Inter', 'Geist', 'Nunito', any Google Font loaded via expo-font

**Size + weight system:**

| Context | Size | Weight | Transform | Spacing |
|---------|------|--------|-----------|---------|
| Timer / large score | 48px | 200 | none | tabular-nums |
| Score secondary (unit) | 14px | 400 | none | none |
| Section label | 11px | 600 | uppercase | 0.1em |
| Body text | 14px | 400 | none | none |
| Card supporting text | 10px | 400 | none | none |

**Rule: one size family per screen.** Never mix more than 2 type sizes on a single screen.

---

## Component Patterns

### Breath Ring
- 3 concentric SVG circles, center dot
- Outer ring: primary at 12% opacity, no fill
- Middle ring: primary at 25% opacity, no fill
- Inner ring: primary at 100% stroke, background fill, center dot primary fill
- Gentle pulse: inner ring scales 1.0 → 1.08 → 1.0 over 8s loop

### Progress Bar (session)
- Height: 2px
- Color: primary (#38bdf8)
- Position: absolute bottom of screen
- No border radius
- Background: surface (#0d1929)

### Bandwidth Card
- Background: surface (#0d1929)
- Border-radius: 8px
- Delta value: coral, font-weight 600
- Bar: solid primary, height 4px, border-radius 3px

### Sparkline
- Bar chart, 4 bars (4-week history)
- Bars: primary at increasing opacity (25% → 40% → 65% → 100%)
- Final bar (current): coral
- Height: 40px
- No axis labels beyond week indicators

---

## Anti-Patterns (forbidden)

The following must never appear in any screen:

- **Nature imagery**: No photos, videos, or illustrations of water, mountains, sky, forests
- **Illustrated characters**: No mascots, blobs, avatars, emoji used as UI elements
- **Streak counters**: No flame icons, "X day streak" displays, or consecutive-day UI anywhere
- **Social comparison**: No leaderboards, rankings, "others are practicing" nudges
- **Glassmorphic cards**: No `backdrop-filter`, no frosted/blurred card backgrounds
- **Purple/white gradients**: No decorative gradients on backgrounds or hero sections
- **Cream/sand tones**: No warm-neutral backgrounds (#f5f0e8 or similar)
- **Heavy border-radius**: Card radius max 12px; do not use 20px+ "pill" cards
- **Lucide icons**: Use MaterialCommunityIcons only
- **Stats during session**: The session screen shows zero metrics — no bandwidth, no score, no lapse count
