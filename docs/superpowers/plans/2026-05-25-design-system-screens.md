# Focus Reps Design System & Screens Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement the "Approachable Science" design system across onboarding, session UI, and progress screens — establishing design.md as the visual source of truth and using design TDD to lock in constraints before any screen is touched.

**Architecture:** `constants/theme.ts` is the single source of truth for all colors and typography values used in React Native. Design tests in `__tests__/design/` statically verify anti-patterns and token correctness before any screen changes. Each screen is a self-contained file; animations live inline rather than in shared components to keep dependencies traceable. The existing data layer (`lib/storage.ts`, `lib/progress.ts`, `lib/practices.ts`) is not modified — this plan is purely a UI layer change.

**Tech Stack:** React Native 0.74 + Expo 51, TypeScript, react-native-reanimated 3.10 (breath ring pulse animation), react-native-svg 15.2 (breath ring SVG circles), @react-navigation/stack + bottom-tabs, AsyncStorage via existing `lib/storage.ts`

---

## File Map

| File | Action | Responsibility |
|------|--------|---------------|
| `design.md` | Create | Visual system source of truth — OKLCH spec, typography rules, anti-patterns |
| `constants/theme.ts` | Create | React Native design tokens (hex equivalents of OKLCH spec) |
| `__tests__/design/tokens.test.ts` | Create | Verify token values match spec; catch regressions |
| `__tests__/design/antipatterns.test.ts` | Create | Static checks — forbidden colors, font families, streak UI |
| `app/onboarding.tsx` | Modify | Science hook → quiz → "building profile" animation → SART → reveal |
| `app/practice/[id].tsx` | Modify | 4-element session UI: label + breath ring + timer + 2px progress bar |
| `app/post-session.tsx` | Create | Post-session: checkmark + bandwidth card + forward prompt |
| `app/(tabs)/progress.tsx` | Modify | SART score + 4-week sparkline + level bar |
| `app/_layout.tsx` | Modify | Add PostSession to stack navigator |

---

## Task 1: Create design.md

**Files:**
- Create: `design.md`

- [ ] **Step 1: Write design.md**

```markdown
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
| `border` | oklch(19% 0.029 248) | #1e3a5a | Card borders, dividers |

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
```

- [ ] **Step 2: Commit**

```bash
git add design.md
git commit -m "docs: add design system source of truth (design.md)"
```

---

## Task 2: Create constants/theme.ts

**Files:**
- Create: `constants/theme.ts`

- [ ] **Step 1: Write the failing test**

```typescript
// __tests__/design/tokens.test.ts
import { colors, typography, spacing } from '../../constants/theme';

describe('design tokens — colors', () => {
  test('background matches OKLCH oklch(12% 0.027 248)', () => {
    expect(colors.background).toBe('#0c1220');
  });
  test('surface matches OKLCH oklch(16% 0.031 248)', () => {
    expect(colors.surface).toBe('#0d1929');
  });
  test('primary matches OKLCH oklch(74% 0.141 211)', () => {
    expect(colors.primary).toBe('#38bdf8');
  });
  test('coral matches OKLCH oklch(65% 0.187 30)', () => {
    expect(colors.coral).toBe('#ff7043');
  });
  test('textBody matches OKLCH oklch(96% 0.007 248)', () => {
    expect(colors.textBody).toBe('#f1f5f9');
  });
  test('textMuted is primary at 31% opacity', () => {
    expect(colors.textMuted).toBe('rgba(56,189,248,0.31)');
  });
  test('border is defined', () => {
    expect(colors.border).toBe('#1e3a5a');
  });
});

describe('design tokens — typography', () => {
  test('timer size is 48', () => {
    expect(typography.timerSize).toBe(48);
  });
  test('timer weight is 200', () => {
    expect(typography.timerWeight).toBe('200');
  });
  test('label size is 11', () => {
    expect(typography.labelSize).toBe(11);
  });
  test('label transform is uppercase', () => {
    expect(typography.labelTransform).toBe('uppercase');
  });
  test('label letter spacing is 1 (React Native uses number, not em)', () => {
    expect(typography.labelSpacing).toBe(1);
  });
});

describe('design tokens — spacing', () => {
  test('card radius is 8', () => {
    expect(spacing.cardRadius).toBe(8);
  });
  test('progress bar height is 2', () => {
    expect(spacing.progressBarHeight).toBe(2);
  });
  test('bandwidth bar height is 4', () => {
    expect(spacing.bandwidthBarHeight).toBe(4);
  });
});
```

- [ ] **Step 2: Run test to confirm it fails**

```bash
npx jest __tests__/design/tokens.test.ts --no-coverage
```

Expected: FAIL — `Cannot find module '../../constants/theme'`

- [ ] **Step 3: Create constants/theme.ts**

```typescript
// constants/theme.ts
// Design tokens for Focus Reps — "Approachable Science" palette
// Source of truth: design.md (OKLCH spec) — this file holds RN hex equivalents

export const colors = {
  // Backgrounds
  background: '#0c1220',  // oklch(12% 0.027 248)
  surface:    '#0d1929',  // oklch(16% 0.031 248)

  // Accents
  primary:    '#38bdf8',  // oklch(74% 0.141 211) — sky blue
  coral:      '#ff7043',  // oklch(65% 0.187 30)  — warm earned-outcome accent

  // Text
  textBody:   '#f1f5f9',  // oklch(96% 0.007 248)
  textMuted:  'rgba(56,189,248,0.31)',  // primary at 31% opacity

  // Structural
  border:     '#1e3a5a',

  // Derived opacity variants (used inline as rgba strings)
  primaryRing1: 'rgba(56,189,248,0.12)',  // outer ring
  primaryRing2: 'rgba(56,189,248,0.25)',  // middle ring
} as const;

export const typography = {
  timerSize:      48,
  timerWeight:    '200' as const,
  scoreUnitSize:  14,
  labelSize:      11,
  labelWeight:    '600' as const,
  labelTransform: 'uppercase' as const,
  labelSpacing:   1,  // React Native letter-spacing is in pixels, not em
  bodySize:       14,
  bodyWeight:     '400' as const,
  cardTextSize:   10,
} as const;

export const spacing = {
  cardRadius:         8,
  cardPadding:        14,
  progressBarHeight:  2,
  bandwidthBarHeight: 4,
  screenPaddingH:     20,
  screenPaddingV:     24,
} as const;
```

- [ ] **Step 4: Run test to confirm it passes**

```bash
npx jest __tests__/design/tokens.test.ts --no-coverage
```

Expected: PASS — 11 tests

- [ ] **Step 5: Commit**

```bash
git add constants/theme.ts __tests__/design/tokens.test.ts
git commit -m "feat: add design tokens and passing token tests"
```

---

## Task 3: Write design anti-pattern tests

**Files:**
- Create: `__tests__/design/antipatterns.test.ts`

These tests statically read source files and fail if forbidden patterns appear. Write them now — before touching any screen — so regressions are caught immediately.

- [ ] **Step 1: Write the anti-pattern tests**

```typescript
// __tests__/design/antipatterns.test.ts
import * as fs from 'fs';
import * as path from 'path';

function readScreenFile(relativePath: string): string {
  return fs.readFileSync(path.join(__dirname, '../../', relativePath), 'utf8');
}

function readAllScreenFiles(): string {
  const targets = [
    'app/onboarding.tsx',
    'app/practice/[id].tsx',
    'app/post-session.tsx',
    'app/(tabs)/progress.tsx',
  ];
  return targets
    .filter(p => fs.existsSync(path.join(__dirname, '../../', p)))
    .map(readScreenFile)
    .join('\n');
}

describe('anti-patterns — banned colors', () => {
  test('no cream/sand background (#f5f0e8 or similar)', () => {
    const source = readAllScreenFiles();
    expect(source).not.toMatch(/#f5f0e8/i);
    expect(source).not.toMatch(/#e8d5b7/i);
  });

  test('no near-black without warmth (#0f0f0f, pure black)', () => {
    const source = readAllScreenFiles();
    expect(source).not.toMatch(/'#0f0f0f'/i);
    expect(source).not.toMatch(/'#000000'/i);
    expect(source).not.toMatch(/'black'/i);
  });

  test('no inline orange that is not coral (#ff7043)', () => {
    const source = readAllScreenFiles();
    // Headspace-orange (#ff8c42) must not appear
    expect(source).not.toMatch(/#ff8c42/i);
  });
});

describe('anti-patterns — banned UI elements', () => {
  test('no streak display in progress or home screens', () => {
    const targets = ['app/(tabs)/progress.tsx', 'app/(tabs)/index.tsx'];
    const source = targets
      .filter(p => fs.existsSync(path.join(__dirname, '../../', p)))
      .map(readScreenFile)
      .join('\n');
    expect(source.toLowerCase()).not.toMatch(/streak/);
  });

  test('no leaderboard or ranking text', () => {
    const source = readAllScreenFiles();
    expect(source.toLowerCase()).not.toMatch(/leaderboard/);
    expect(source.toLowerCase()).not.toMatch(/ranking/);
  });

  test('session screen has no bandwidth or score display', () => {
    const session = readScreenFile('app/practice/[id].tsx');
    expect(session.toLowerCase()).not.toMatch(/bandwidth/);
    expect(session.toLowerCase()).not.toMatch(/focusscore|focus_score|sart/i);
  });
});

describe('anti-patterns — banned fonts', () => {
  test('no Inter font family', () => {
    const source = readAllScreenFiles();
    expect(source).not.toMatch(/fontFamily:\s*['"]Inter['"]/);
  });

  test('no Geist font family', () => {
    const source = readAllScreenFiles();
    expect(source).not.toMatch(/fontFamily:\s*['"]Geist['"]/);
  });
});

describe('design token usage', () => {
  test('screens import from constants/theme, not raw hex strings for primary colors', () => {
    const session = readScreenFile('app/practice/[id].tsx');
    // The session screen must import theme
    expect(session).toMatch(/from ['"].*constants\/theme['"]/);
  });
});
```

- [ ] **Step 2: Run tests — most will pass (screens don't exist yet or lack forbidden patterns)**

```bash
npx jest __tests__/design/antipatterns.test.ts --no-coverage
```

Expected: Most PASS. The `session screen imports theme` test will FAIL (screen not yet updated). Note which fail — they're your acceptance criteria for Tasks 4–7.

- [ ] **Step 3: Commit**

```bash
git add __tests__/design/antipatterns.test.ts
git commit -m "test: add design anti-pattern static tests"
```

---

## Task 4: Redesign onboarding.tsx

**Files:**
- Modify: `app/onboarding.tsx`

The existing onboarding has 4 steps but no science hook, no "building profile" animation, and uses hardcoded colors. Replace it with the 5-step spec flow.

- [ ] **Step 1: Replace app/onboarding.tsx**

```tsx
/**
 * Onboarding Screen — "Approachable Science" design
 * Flow: science hook → quiz (2 q) → building animation → profile reveal
 * SART baseline is taken after onboarding via navigation to sart-test
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, SafeAreaView,
  Animated, Easing,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { saveSettings, getSettings } from '../lib/storage';
import { requestPermissions, initializeNotifications } from '../lib/notifications';
import { colors, typography, spacing } from '../constants/theme';

type Step = 'hook' | 'quiz1' | 'quiz2' | 'building' | 'reveal';
type UserPath = 'deep_work' | 'overwhelm' | 'burnout';

const PATH_LABELS: Record<UserPath, { title: string; subtitle: string }> = {
  deep_work: {
    title: 'Deep Work Path',
    subtitle: 'You'll build endurance for sustained, distraction-free attention.',
  },
  overwhelm: {
    title: 'Digital Reset Path',
    subtitle: 'You'll train the pause between stimulus and reaction.',
  },
  burnout: {
    title: 'Restoration Path',
    subtitle: 'You'll rebuild cognitive bandwidth from the ground up.',
  },
};

export default function OnboardingScreen() {
  const navigation = useNavigation<any>();
  const [step, setStep] = useState<Step>('hook');
  const [q1, setQ1] = useState<string | null>(null);
  const [userPath, setUserPath] = useState<UserPath>('deep_work');

  // Building animation
  const buildingProgress = useRef(new Animated.Value(0)).current;
  const buildingDots = useRef(new Animated.Value(0)).current;

  const derivePath = (answer1: string, answer2: string): UserPath => {
    if (answer1 === 'burnout' || answer2 === 'burnout') return 'burnout';
    if (answer1 === 'overwhelm' || answer2 === 'overwhelm') return 'overwhelm';
    return 'deep_work';
  };

  const handleQ1 = (answer: string) => {
    setQ1(answer);
    setStep('quiz2');
  };

  const handleQ2 = (answer: string) => {
    const path = derivePath(q1 ?? 'deep_work', answer);
    setUserPath(path);
    setStep('building');
    runBuildingAnimation();
  };

  const runBuildingAnimation = () => {
    buildingProgress.setValue(0);
    Animated.sequence([
      Animated.timing(buildingProgress, {
        toValue: 1,
        duration: 2800,
        easing: Easing.out(Easing.quad),
        useNativeDriver: false,
      }),
    ]).start(() => setStep('reveal'));

    Animated.loop(
      Animated.sequence([
        Animated.timing(buildingDots, { toValue: 3, duration: 900, useNativeDriver: false }),
        Animated.timing(buildingDots, { toValue: 0, duration: 0, useNativeDriver: false }),
      ])
    ).start();
  };

  const handleComplete = async () => {
    const settings = await getSettings();
    await saveSettings({
      ...settings!,
      userPath,
      programStartDate: new Date().toISOString(),
    });
    await requestPermissions();
    await initializeNotifications();
    // Navigate to SART baseline — establishes week-1 score before first session
    navigation.replace('SartTest');
  };

  // ── Screens ──────────────────────────────────────────────

  if (step === 'hook') {
    return (
      <SafeAreaView style={s.container}>
        <View style={s.hookBody}>
          <Text style={s.hookHeadline}>Attention is a muscle.{'\n'}You can train it.</Text>
          <Text style={s.hookBodyText}>
            Most people try to focus harder. Research shows that's not how it works — focus is a skill you build through practice, the same way you build any other skill.
          </Text>
          <Text style={s.hookCta}>12 minutes a day. We'll measure the difference.</Text>
        </View>
        <TouchableOpacity style={s.primaryButton} onPress={() => setStep('quiz1')}>
          <Text style={s.primaryButtonText}>Get started</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  if (step === 'quiz1') {
    return (
      <SafeAreaView style={s.container}>
        <Text style={s.quizLabel}>Question 1 of 2</Text>
        <Text style={s.quizQuestion}>Where does your focus break down most?</Text>
        <View style={s.optionList}>
          {[
            { value: 'deep_work', label: 'Getting into deep work', sub: 'Starting hard tasks, staying in flow' },
            { value: 'overwhelm', label: 'Constant interruptions', sub: 'Notifications, context-switching, reactivity' },
            { value: 'burnout', label: 'Mental fog and fatigue', sub: 'Trouble concentrating even when rested' },
          ].map(opt => (
            <TouchableOpacity key={opt.value} style={s.option} onPress={() => handleQ1(opt.value)}>
              <Text style={s.optionLabel}>{opt.label}</Text>
              <Text style={s.optionSub}>{opt.sub}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </SafeAreaView>
    );
  }

  if (step === 'quiz2') {
    return (
      <SafeAreaView style={s.container}>
        <Text style={s.quizLabel}>Question 2 of 2</Text>
        <Text style={s.quizQuestion}>What matters most to you right now?</Text>
        <View style={s.optionList}>
          {[
            { value: 'deep_work', label: 'Sharper focus on hard work', sub: 'Essays, code, analysis, creative projects' },
            { value: 'overwhelm', label: 'Calmer reactions to stress', sub: 'Less reactivity, more intentional responses' },
            { value: 'burnout', label: 'Restoring mental energy', sub: 'Getting back to baseline after depletion' },
          ].map(opt => (
            <TouchableOpacity key={opt.value} style={s.option} onPress={() => handleQ2(opt.value)}>
              <Text style={s.optionLabel}>{opt.label}</Text>
              <Text style={s.optionSub}>{opt.sub}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </SafeAreaView>
    );
  }

  if (step === 'building') {
    const barWidth = buildingProgress.interpolate({
      inputRange: [0, 1],
      outputRange: ['0%', '100%'],
    });
    return (
      <SafeAreaView style={s.container}>
        <View style={s.buildingBody}>
          <Text style={s.buildingHeadline}>Building your{'\n'}attention profile…</Text>
          <View style={s.buildingBarTrack}>
            <Animated.View style={[s.buildingBarFill, { width: barWidth }]} />
          </View>
          <Text style={s.buildingSub}>Calibrating to your training path</Text>
        </View>
      </SafeAreaView>
    );
  }

  // reveal
  const pathInfo = PATH_LABELS[userPath];
  return (
    <SafeAreaView style={s.container}>
      <View style={s.revealBody}>
        <Text style={s.revealLabel}>Your attention profile</Text>
        <Text style={s.revealTitle}>{pathInfo.title}</Text>
        <Text style={s.revealSub}>{pathInfo.subtitle}</Text>
        <View style={s.revealCard}>
          <Text style={s.revealCardText}>Next: a 60-second focus baseline test.</Text>
          <Text style={s.revealCardSub}>This gives you your starting score — the number you'll improve over the coming weeks.</Text>
        </View>
      </View>
      <TouchableOpacity style={s.primaryButton} onPress={handleComplete}>
        <Text style={s.primaryButtonText}>Take my baseline test</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingHorizontal: spacing.screenPaddingH,
    paddingVertical: spacing.screenPaddingV,
    justifyContent: 'space-between',
  },
  // Hook screen
  hookBody: { flex: 1, justifyContent: 'center', gap: 20 },
  hookHeadline: {
    fontSize: 28, fontWeight: '700', color: colors.textBody, lineHeight: 36,
  },
  hookBodyText: {
    fontSize: typography.bodySize, fontWeight: typography.bodyWeight,
    color: colors.textMuted, lineHeight: 22,
  },
  hookCta: {
    fontSize: typography.bodySize, fontWeight: '600',
    color: colors.primary, marginTop: 8,
  },
  // Quiz screens
  quizLabel: {
    fontSize: typography.labelSize, fontWeight: typography.labelWeight,
    color: colors.textMuted, textTransform: typography.labelTransform,
    letterSpacing: typography.labelSpacing, marginBottom: 12,
  },
  quizQuestion: {
    fontSize: 22, fontWeight: '700', color: colors.textBody,
    lineHeight: 30, marginBottom: 28,
  },
  optionList: { gap: 12 },
  option: {
    backgroundColor: colors.surface, borderRadius: spacing.cardRadius,
    borderWidth: 1, borderColor: colors.border,
    padding: spacing.cardPadding,
  },
  optionLabel: {
    fontSize: typography.bodySize, fontWeight: '600', color: colors.textBody,
    marginBottom: 4,
  },
  optionSub: {
    fontSize: typography.cardTextSize, color: colors.textMuted,
  },
  // Building screen
  buildingBody: { flex: 1, justifyContent: 'center', gap: 28 },
  buildingHeadline: {
    fontSize: 26, fontWeight: '700', color: colors.textBody, lineHeight: 34,
  },
  buildingBarTrack: {
    height: 4, backgroundColor: colors.surface,
    borderRadius: 2, overflow: 'hidden',
  },
  buildingBarFill: {
    height: 4, backgroundColor: colors.primary, borderRadius: 2,
  },
  buildingSub: {
    fontSize: typography.cardTextSize, color: colors.textMuted,
  },
  // Reveal screen
  revealBody: { flex: 1, justifyContent: 'center', gap: 12 },
  revealLabel: {
    fontSize: typography.labelSize, fontWeight: typography.labelWeight,
    color: colors.textMuted, textTransform: typography.labelTransform,
    letterSpacing: typography.labelSpacing,
  },
  revealTitle: {
    fontSize: 28, fontWeight: '700', color: colors.textBody,
  },
  revealSub: {
    fontSize: typography.bodySize, color: colors.textMuted, lineHeight: 22,
  },
  revealCard: {
    backgroundColor: colors.surface, borderRadius: spacing.cardRadius,
    borderWidth: 1, borderColor: colors.border,
    padding: spacing.cardPadding, marginTop: 12, gap: 8,
  },
  revealCardText: {
    fontSize: typography.bodySize, fontWeight: '600', color: colors.textBody,
  },
  revealCardSub: {
    fontSize: typography.cardTextSize, color: colors.textMuted, lineHeight: 16,
  },
  // Shared
  primaryButton: {
    backgroundColor: colors.primary, borderRadius: spacing.cardRadius,
    padding: 16, alignItems: 'center',
  },
  primaryButtonText: {
    fontSize: typography.bodySize, fontWeight: '700', color: colors.background,
  },
});
```

- [ ] **Step 2: Run anti-pattern tests to confirm onboarding passes**

```bash
npx jest __tests__/design/antipatterns.test.ts --no-coverage
```

Expected: All anti-pattern tests PASS for onboarding.tsx (no streak, no forbidden fonts, no forbidden colors).

- [ ] **Step 3: Smoke-test in simulator**

```bash
npx expo start --ios
```

Navigate to the onboarding screen. Verify: science hook text appears, both quiz questions work, building animation runs ~3 seconds, reveal screen shows correct path label, "Take my baseline test" navigates to SartTest.

- [ ] **Step 4: Commit**

```bash
git add app/onboarding.tsx
git commit -m "feat(onboarding): implement science hook, quiz, building animation, reveal"
```

---

## Task 5: Redesign practice/[id].tsx — session UI

**Files:**
- Modify: `app/practice/[id].tsx`

Replace the existing multi-element session screen with the 4-element vertical layout: subdued label → breath ring → timer → 2px progress bar at the bottom edge.

- [ ] **Step 1: Replace app/practice/[id].tsx**

```tsx
/**
 * Practice Session Screen — "Approachable Science" session UI
 * 4 elements only: label · breath ring · timer · progress bar
 * No stats, no bandwidth, no score during session.
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  View, Text, StyleSheet, SafeAreaView, TouchableOpacity, Dimensions,
} from 'react-native';
import Animated, {
  useSharedValue, useAnimatedStyle, withRepeat, withSequence,
  withTiming, Easing as REasing,
} from 'react-native-reanimated';
import Svg, { Circle } from 'react-native-svg';
import { useRoute, useNavigation } from '@react-navigation/native';
import { saveSession } from '../../lib/storage';
import { practiceDefinitions } from '../../lib/practices';
import { PracticeType, PracticeSession } from '../../types';
import { colors, typography, spacing } from '../../constants/theme';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const RING_SIZE = 120;
const CX = RING_SIZE / 2;
const R_OUTER = CX - 4;
const R_MIDDLE = CX - 18;
const R_INNER = CX - 32;

type RouteParams = { id: PracticeType; repNumber?: number };

function useCountdown(totalSeconds: number, running: boolean) {
  const [remaining, setRemaining] = useState(totalSeconds);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!running) return;
    intervalRef.current = setInterval(() => {
      setRemaining(prev => {
        if (prev <= 1) {
          clearInterval(intervalRef.current!);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(intervalRef.current!);
  }, [running]);

  const mm = String(Math.floor(remaining / 60)).padStart(2, '0');
  const ss = String(remaining % 60).padStart(2, '0');
  return { remaining, display: `${mm}:${ss}` };
}

export default function PracticeSessionScreen() {
  const route = useRoute();
  const navigation = useNavigation<any>();
  const { id, repNumber = 1 } = (route.params || {}) as RouteParams;

  const practice = practiceDefinitions[id];
  const totalSeconds = (practice?.defaultDuration ?? 12) * 60;

  const [running, setRunning] = useState(false);
  const [done, setDone] = useState(false);
  const startTimeRef = useRef<number>(0);

  const { remaining, display } = useCountdown(totalSeconds, running);

  // Breath ring pulse animation
  const scale = useSharedValue(1);
  useEffect(() => {
    scale.value = withRepeat(
      withSequence(
        withTiming(1.08, { duration: 4000, easing: REasing.inOut(REasing.quad) }),
        withTiming(1.0, { duration: 4000, easing: REasing.inOut(REasing.quad) })
      ),
      -1,
      false
    );
  }, []);

  const animatedRingStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  // Session complete
  useEffect(() => {
    if (running && remaining === 0 && !done) {
      setDone(true);
      setRunning(false);
      const durationMinutes = Math.round((Date.now() - startTimeRef.current) / 60000);
      const session: PracticeSession = {
        id: Date.now().toString(),
        practiceType: id,
        date: new Date(),
        duration: durationMinutes,
        scheduledDuration: practice?.defaultDuration ?? 12,
        completed: true,
      };
      saveSession(session).then(() => {
        navigation.replace('PostSession', {
          practiceType: id,
          repNumber,
          sessionId: session.id,
        });
      });
    }
  }, [remaining, running, done]);

  const handleStart = () => {
    startTimeRef.current = Date.now();
    setRunning(true);
  };

  const progress = running ? (totalSeconds - remaining) / totalSeconds : 0;

  const practiceLabel = practice?.title ?? id;
  const sessionLabel = `${practiceLabel} · Rep ${repNumber}`.toUpperCase();

  if (!running && !done) {
    // Pre-session start screen
    return (
      <SafeAreaView style={s.container}>
        <View style={s.center}>
          <Text style={s.preLabel}>{practiceLabel}</Text>
          <Text style={s.preDuration}>{practice?.defaultDuration ?? 12} min</Text>
          <Text style={s.preSub}>Find a comfortable position. You can close your eyes once you start.</Text>
        </View>
        <TouchableOpacity style={s.startButton} onPress={handleStart}>
          <Text style={s.startButtonText}>Begin Rep {repNumber}</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <View style={s.sessionContainer}>
      <SafeAreaView style={s.sessionInner}>
        {/* Subdued label — top, single line */}
        <Text style={s.sessionLabel}>{sessionLabel}</Text>

        {/* Breath ring — center focal point */}
        <View style={s.ringContainer}>
          <Svg width={RING_SIZE} height={RING_SIZE}>
            {/* Outer ring */}
            <Circle cx={CX} cy={CX} r={R_OUTER} stroke={colors.primaryRing1} strokeWidth={1} fill="none" />
            {/* Middle ring */}
            <Circle cx={CX} cy={CX} r={R_MIDDLE} stroke={colors.primaryRing2} strokeWidth={1} fill="none" />
          </Svg>
          {/* Inner ring — animated */}
          <Animated.View style={[s.innerRingWrapper, animatedRingStyle]}>
            <Svg width={RING_SIZE} height={RING_SIZE} style={StyleSheet.absoluteFill}>
              <Circle cx={CX} cy={CX} r={R_INNER} stroke={colors.primary} strokeWidth={1.5} fill={colors.background} />
              {/* Center dot */}
              <Circle cx={CX} cy={CX} r={5} fill={colors.primary} />
            </Svg>
          </Animated.View>
        </View>

        {/* Timer — large, light weight */}
        <Text style={s.timer}>{display}</Text>
      </SafeAreaView>

      {/* 2px progress bar — absolute bottom edge */}
      <View style={s.progressTrack}>
        <View style={[s.progressFill, { width: `${Math.round(progress * 100)}%` }]} />
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  // Session screen (full-screen, no safe area padding on sides)
  sessionContainer: {
    flex: 1, backgroundColor: colors.background,
  },
  sessionInner: {
    flex: 1, alignItems: 'center', justifyContent: 'space-evenly',
    paddingHorizontal: spacing.screenPaddingH,
  },
  sessionLabel: {
    fontSize: typography.labelSize,
    fontWeight: typography.labelWeight,
    color: colors.textMuted,
    textTransform: typography.labelTransform,
    letterSpacing: typography.labelSpacing,
    textAlign: 'center',
  },
  ringContainer: {
    width: RING_SIZE, height: RING_SIZE,
    alignItems: 'center', justifyContent: 'center',
  },
  innerRingWrapper: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center', justifyContent: 'center',
  },
  timer: {
    fontSize: typography.timerSize,
    fontWeight: typography.timerWeight,
    color: colors.textBody,
    fontVariant: ['tabular-nums'],
  },
  // 2px bar at absolute bottom
  progressTrack: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    height: spacing.progressBarHeight,
    backgroundColor: colors.surface,
  },
  progressFill: {
    height: spacing.progressBarHeight,
    backgroundColor: colors.primary,
  },
  // Pre-session screen
  container: {
    flex: 1, backgroundColor: colors.background,
    paddingHorizontal: spacing.screenPaddingH,
    paddingVertical: spacing.screenPaddingV,
    justifyContent: 'space-between',
  },
  center: { flex: 1, justifyContent: 'center', gap: 12 },
  preLabel: {
    fontSize: 26, fontWeight: '700', color: colors.textBody,
  },
  preDuration: {
    fontSize: typography.labelSize, fontWeight: typography.labelWeight,
    color: colors.textMuted, textTransform: typography.labelTransform,
    letterSpacing: typography.labelSpacing,
  },
  preSub: {
    fontSize: typography.bodySize, color: colors.textMuted,
    lineHeight: 22, marginTop: 8,
  },
  startButton: {
    backgroundColor: colors.primary, borderRadius: spacing.cardRadius,
    padding: 16, alignItems: 'center',
  },
  startButtonText: {
    fontSize: typography.bodySize, fontWeight: '700', color: colors.background,
  },
});
```

- [ ] **Step 2: Run anti-pattern tests**

```bash
npx jest __tests__/design/antipatterns.test.ts --no-coverage
```

Expected: ALL tests PASS — session screen imports theme, has no bandwidth/score/streak.

- [ ] **Step 3: Smoke-test**

```bash
npx expo start --ios
```

Start a practice session. Verify: label shows in muted uppercase, breath ring pulses gently, timer counts down, 2px bar fills along the bottom. Confirm no stats or scores appear during the session.

- [ ] **Step 4: Commit**

```bash
git add app/practice/[id].tsx
git commit -m "feat(session): implement 4-element session UI with breath ring and countdown"
```

---

## Task 6: Create app/post-session.tsx

**Files:**
- Create: `app/post-session.tsx`
- Modify: `app/_layout.tsx` (add PostSession to stack)

The post-session screen shows 3 elements: completion mark, bandwidth card, forward prompt.

- [ ] **Step 1: Create app/post-session.tsx**

```tsx
/**
 * Post-Session Screen
 * 3 elements: completion mark · bandwidth card · forward prompt
 * No interaction required — user taps anywhere to dismiss.
 */

import React, { useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, SafeAreaView, TouchableOpacity,
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { calculateAllProgress } from '../lib/progress';
import { getSartHistory } from '../lib/storage';
import { colors, typography, spacing } from '../constants/theme';
import { PracticeType } from '../types';

type RouteParams = {
  practiceType: PracticeType;
  repNumber: number;
  sessionId: string;
};

const PRACTICE_NAMES: Record<PracticeType, string> = {
  'anchor-breath':   'Focus Booster',
  'body-sweep':      'Stress Reset',
  'thought-traffic': 'Anxiety Grounder',
  'kindness-circuit':'Connection Practice',
};

const LEVEL_SESSION_THRESHOLDS: Record<string, number> = {
  L1: 5,  // 5 unique days in 7-day window to reach L2
  L2: 7,  // daily + JIT use for L3
  L3: 0,
};

export default function PostSessionScreen() {
  const route = useRoute();
  const navigation = useNavigation<any>();
  const { practiceType, repNumber } = (route.params || {}) as RouteParams;

  const [bandwidth, setBandwidth] = useState<number>(0);
  const [bandwidthDelta] = useState<number>(20); // one unique day = +20%
  const [currentLevel, setCurrentLevel] = useState<'L1' | 'L2' | 'L3'>('L1');
  const [sessionsToNext, setSessionsToNext] = useState<number>(0);
  const [nextSartDays, setNextSartDays] = useState<number>(7);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const progress = await calculateAllProgress();
      const shield = progress.resilienceShield ?? 0;
      const level = (progress.settings.currentLevel ?? 'L1') as 'L1' | 'L2' | 'L3';
      setBandwidth(shield);
      setCurrentLevel(level);

      // Sessions to next level: threshold - uniqueRecentDays
      const threshold = LEVEL_SESSION_THRESHOLDS[level] ?? 0;
      const uniqueDays = Math.round(shield / 20); // reverse the 20% per day calc
      setSessionsToNext(Math.max(0, threshold - uniqueDays));

      // Days until next SART test (weekly cadence)
      const sartHistory = await getSartHistory();
      if (sartHistory.length === 0) {
        setNextSartDays(0); // prompt immediately after onboarding
      } else {
        const lastSart = new Date(sartHistory[sartHistory.length - 1].date);
        const daysSince = Math.floor((Date.now() - lastSart.getTime()) / 86400000);
        setNextSartDays(Math.max(0, 7 - daysSince));
      }

      setLoading(false);
    })();
  }, []);

  const handleDismiss = () => {
    navigation.navigate('Home');
  };

  if (loading) {
    return <View style={s.container} />;
  }

  const practiceName = PRACTICE_NAMES[practiceType] ?? practiceType;
  const levelLabel = currentLevel === 'L3' ? 'Mastery' : `Level ${currentLevel.replace('L', '')}`;

  return (
    <SafeAreaView style={s.container}>
      <TouchableOpacity style={s.body} onPress={handleDismiss} activeOpacity={1}>

        {/* Completion mark */}
        <View style={s.completionBlock}>
          <View style={s.checkCircle}>
            <Text style={s.checkMark}>✓</Text>
          </View>
          <Text style={s.repDone}>Rep {repNumber} done</Text>
          <Text style={s.sessionLabel}>{practiceName} · {levelLabel}</Text>
        </View>

        {/* Bandwidth card */}
        <View style={s.card}>
          <View style={s.cardRow}>
            <Text style={s.cardTitle}>Bandwidth</Text>
            <Text style={s.cardDelta}>+{bandwidthDelta}%</Text>
          </View>
          <View style={s.barTrack}>
            <View style={[s.barFill, { width: `${bandwidth}%` }]} />
          </View>
          <Text style={s.cardSub}>
            {bandwidth}%
            {sessionsToNext > 0
              ? ` · ${sessionsToNext} session${sessionsToNext !== 1 ? 's' : ''} to ${currentLevel === 'L1' ? 'Level 2' : 'Level 3'}`
              : ` · ${levelLabel} reached`}
          </Text>
        </View>

        {/* Forward prompt */}
        <Text style={s.forwardPrompt}>
          {nextSartDays === 0
            ? 'Take your weekly focus test'
            : `SART test in ${nextSartDays} day${nextSartDays !== 1 ? 's' : ''}`}
        </Text>

        <Text style={s.tapToDismiss}>Tap anywhere to continue</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  container: {
    flex: 1, backgroundColor: colors.background,
  },
  body: {
    flex: 1, paddingHorizontal: spacing.screenPaddingH,
    paddingVertical: spacing.screenPaddingV,
    justifyContent: 'center', gap: 32,
  },
  // Completion block
  completionBlock: { alignItems: 'center', gap: 10 },
  checkCircle: {
    width: 56, height: 56, borderRadius: 28,
    borderWidth: 1.5, borderColor: colors.primary,
    alignItems: 'center', justifyContent: 'center',
  },
  checkMark: { fontSize: 22, color: colors.primary },
  repDone: { fontSize: 20, fontWeight: '300', color: colors.textBody },
  sessionLabel: {
    fontSize: typography.labelSize, fontWeight: typography.labelWeight,
    color: colors.textMuted, textTransform: typography.labelTransform,
    letterSpacing: typography.labelSpacing,
  },
  // Bandwidth card
  card: {
    backgroundColor: colors.surface, borderRadius: spacing.cardRadius,
    borderWidth: 1, borderColor: colors.border,
    padding: spacing.cardPadding, gap: 10,
  },
  cardRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline' },
  cardTitle: { fontSize: typography.bodySize, color: colors.primary },
  cardDelta: { fontSize: 16, fontWeight: '600', color: colors.coral },
  barTrack: {
    height: spacing.bandwidthBarHeight, backgroundColor: colors.background,
    borderRadius: 3, overflow: 'hidden',
  },
  barFill: {
    height: spacing.bandwidthBarHeight, backgroundColor: colors.primary,
    borderRadius: 3,
  },
  cardSub: { fontSize: typography.cardTextSize, color: colors.textMuted },
  // Forward prompt
  forwardPrompt: {
    textAlign: 'center', fontSize: typography.cardTextSize,
    color: colors.textMuted,
  },
  tapToDismiss: {
    textAlign: 'center', fontSize: typography.cardTextSize,
    color: colors.textMuted, opacity: 0.4, marginTop: 8,
  },
});
```

- [ ] **Step 2: Add PostSession to the stack navigator in app/_layout.tsx**

In `app/_layout.tsx`, find the `Stack.Navigator` block and add:

```tsx
// After the existing SartTest screen entry:
<Stack.Screen
  name="PostSession"
  component={PostSessionScreen}
  options={{ headerShown: false, gestureEnabled: false }}
/>
```

Also add the import at the top:

```tsx
import PostSessionScreen from './post-session';
```

- [ ] **Step 3: Run all design tests**

```bash
npx jest __tests__/design/ --no-coverage
```

Expected: ALL PASS.

- [ ] **Step 4: Smoke-test**

```bash
npx expo start --ios
```

Complete a session. Confirm post-session screen shows: checkmark, bandwidth card with +20% delta and filled bar, forward prompt with days to next SART. Tapping anywhere navigates to Home.

- [ ] **Step 5: Commit**

```bash
git add app/post-session.tsx app/_layout.tsx
git commit -m "feat(post-session): add completion screen with bandwidth card and forward prompt"
```

---

## Task 7: Redesign app/(tabs)/progress.tsx

**Files:**
- Modify: `app/(tabs)/progress.tsx`

Replace current progress tab with: SART score hero + 4-week sparkline + level bar. No streaks, no badges.

- [ ] **Step 1: Replace app/(tabs)/progress.tsx**

```tsx
/**
 * Progress Tab
 * SART score · 4-week sparkline · level bar
 * Output gamification only — no streaks, no leaderboards.
 */

import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import Svg, { Rect } from 'react-native-svg';
import { calculateAllProgress } from '../../lib/progress';
import { getSartHistory } from '../../lib/storage';
import { SartTestResult } from '../../types';
import { colors, typography, spacing } from '../../constants/theme';

const SPARKLINE_WIDTH = 200;
const SPARKLINE_HEIGHT = 40;
const BAR_GAP = 8;
const BAR_COUNT = 4;
const BAR_WIDTH = (SPARKLINE_WIDTH - BAR_GAP * (BAR_COUNT - 1)) / BAR_COUNT;

// Opacity values for bars oldest → newest
const BAR_OPACITIES = ['0.25', '0.40', '0.65', '1.0'];

function Sparkline({ scores }: { scores: SartTestResult[] }) {
  // Use last 4, pad with nulls on the left
  const last4 = scores.slice(-4);
  const padded: (SartTestResult | null)[] = [
    ...Array(Math.max(0, 4 - last4.length)).fill(null),
    ...last4,
  ];

  // Lower reaction time = better. Invert for bar height: shorter ms → taller bar.
  const values = padded.map(s => s ? s.avgReactionTimeMs : null);
  const validValues = values.filter((v): v is number => v !== null);
  const maxMs = validValues.length ? Math.max(...validValues) : 1000;
  const minMs = validValues.length ? Math.min(...validValues) : 500;
  const range = Math.max(maxMs - minMs, 1);

  return (
    <Svg width={SPARKLINE_WIDTH} height={SPARKLINE_HEIGHT}>
      {padded.map((score, i) => {
        const x = i * (BAR_WIDTH + BAR_GAP);
        if (!score) {
          // Empty placeholder bar
          return (
            <Rect
              key={i} x={x} y={SPARKLINE_HEIGHT - 4}
              width={BAR_WIDTH} height={4}
              fill={colors.primary} opacity={0.1} rx={2}
            />
          );
        }
        // Invert: lower ms = taller bar (better performance)
        const ratio = (maxMs - score.avgReactionTimeMs) / range;
        const barH = Math.max(4, Math.round(ratio * SPARKLINE_HEIGHT));
        const y = SPARKLINE_HEIGHT - barH;
        const isLatest = i === 3;
        return (
          <Rect
            key={i} x={x} y={y}
            width={BAR_WIDTH} height={barH}
            fill={isLatest ? colors.coral : colors.primary}
            opacity={BAR_OPACITIES[i]}
            rx={2}
          />
        );
      })}
    </Svg>
  );
}

export default function ProgressScreen() {
  const [sartHistory, setSartHistory] = useState<SartTestResult[]>([]);
  const [bandwidth, setBandwidth] = useState(0);
  const [level, setLevel] = useState<'L1' | 'L2' | 'L3'>('L1');
  const [sessionsToNext, setSessionsToNext] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const [history, progress] = await Promise.all([
        getSartHistory(),
        calculateAllProgress(),
      ]);
      setSartHistory(history);
      setBandwidth(progress.resilienceShield ?? 0);
      const lvl = (progress.settings.currentLevel ?? 'L1') as 'L1' | 'L2' | 'L3';
      setLevel(lvl);
      const thresholds: Record<string, number> = { L1: 5, L2: 7, L3: 0 };
      const uniqueDays = Math.round((progress.resilienceShield ?? 0) / 20);
      setSessionsToNext(Math.max(0, (thresholds[lvl] ?? 0) - uniqueDays));
      setLoading(false);
    })();
  }, []);

  if (loading) return <View style={s.container} />;

  const latest = sartHistory.length ? sartHistory[sartHistory.length - 1] : null;
  const first = sartHistory.length ? sartHistory[0] : null;
  const hasData = sartHistory.length > 0;

  const deltaMs = latest && first && latest !== first
    ? Math.round(first.avgReactionTimeMs - latest.avgReactionTimeMs)
    : null;

  const levelNum = level.replace('L', '');
  const nextLevelLabel = level === 'L1' ? 'Level 2' : level === 'L2' ? 'Level 3' : null;

  return (
    <SafeAreaView style={s.container}>
      <ScrollView contentContainerStyle={s.content} showsVerticalScrollIndicator={false}>

        {/* SART Score hero */}
        <View style={s.section}>
          <Text style={s.sectionLabel}>Focus Score</Text>
          {hasData ? (
            <>
              <Text style={s.scoreValue}>
                {latest!.avgReactionTimeMs}
                <Text style={s.scoreUnit}> ms</Text>
              </Text>
              {deltaMs !== null && deltaMs > 0 && (
                <Text style={s.scoreDelta}>▲ {deltaMs}ms faster than week 1</Text>
              )}
              {deltaMs !== null && deltaMs <= 0 && (
                <Text style={s.scoreDeltaNeutral}>Baseline established — keep training</Text>
              )}
            </>
          ) : (
            <Text style={s.emptyText}>Complete your first SART test to see your score</Text>
          )}
        </View>

        {/* 4-week sparkline */}
        {hasData && (
          <View style={s.card}>
            <Text style={s.cardLabel}>4-Week Trend</Text>
            <View style={s.sparklineRow}>
              <Sparkline scores={sartHistory} />
              <View style={s.sparklineWeeks}>
                {['Wk 1', 'Wk 2', 'Wk 3', 'Now'].map(w => (
                  <Text key={w} style={s.sparklineWeekLabel}>{w}</Text>
                ))}
              </View>
            </View>
            <Text style={s.cardSub}>Lower reaction time = sharper attention</Text>
          </View>
        )}

        {/* Level bar */}
        <View style={s.card}>
          <View style={s.levelRow}>
            <Text style={s.cardLabel}>Level {levelNum}</Text>
            {nextLevelLabel && sessionsToNext > 0 && (
              <Text style={s.cardSub}>
                {sessionsToNext} session{sessionsToNext !== 1 ? 's' : ''} to {nextLevelLabel}
              </Text>
            )}
            {!nextLevelLabel && (
              <Text style={s.cardSub}>Mastery reached</Text>
            )}
          </View>
          <View style={s.levelTrack}>
            <View style={[s.levelFill, { width: `${bandwidth}%` }]} />
          </View>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: {
    paddingHorizontal: spacing.screenPaddingH,
    paddingVertical: spacing.screenPaddingV,
    gap: 24,
  },
  section: { gap: 8 },
  sectionLabel: {
    fontSize: typography.labelSize, fontWeight: typography.labelWeight,
    color: colors.textMuted, textTransform: typography.labelTransform,
    letterSpacing: typography.labelSpacing,
  },
  scoreValue: {
    fontSize: typography.timerSize, fontWeight: typography.timerWeight,
    color: colors.coral, fontVariant: ['tabular-nums'],
  },
  scoreUnit: { fontSize: 14, color: colors.coral, opacity: 0.5 },
  scoreDelta: { fontSize: typography.bodySize, color: colors.primary },
  scoreDeltaNeutral: { fontSize: typography.bodySize, color: colors.textMuted },
  emptyText: { fontSize: typography.bodySize, color: colors.textMuted, lineHeight: 22 },
  // Card
  card: {
    backgroundColor: colors.surface, borderRadius: spacing.cardRadius,
    borderWidth: 1, borderColor: colors.border,
    padding: spacing.cardPadding, gap: 12,
  },
  cardLabel: {
    fontSize: typography.labelSize, fontWeight: typography.labelWeight,
    color: colors.textMuted, textTransform: typography.labelTransform,
    letterSpacing: typography.labelSpacing,
  },
  cardSub: { fontSize: typography.cardTextSize, color: colors.textMuted },
  // Sparkline
  sparklineRow: { gap: 6 },
  sparklineWeeks: {
    flexDirection: 'row', width: SPARKLINE_WIDTH,
    justifyContent: 'space-between',
  },
  sparklineWeekLabel: {
    fontSize: 8, color: colors.textMuted,
    width: BAR_WIDTH, textAlign: 'center',
  },
  // Level bar
  levelRow: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline',
  },
  levelTrack: {
    height: 3, backgroundColor: colors.background,
    borderRadius: 2, overflow: 'hidden',
  },
  levelFill: {
    height: 3, backgroundColor: colors.primary, borderRadius: 2,
  },
});
```

- [ ] **Step 2: Run all design tests**

```bash
npx jest __tests__/design/ --no-coverage
```

Expected: ALL PASS — no streak text, no forbidden colors, theme imported.

- [ ] **Step 3: Smoke-test**

```bash
npx expo start --ios
```

Navigate to the Progress tab. With no SART history: score section shows empty state. After taking a SART test: score appears in coral, sparkline shows bars. Level bar fills proportionally to bandwidth percentage.

- [ ] **Step 4: Commit**

```bash
git add app/(tabs)/progress.tsx
git commit -m "feat(progress): implement SART score hero, sparkline, and level bar"
```

---

## Task 8: Update tab bar theme in _layout.tsx

**Files:**
- Modify: `app/_layout.tsx`

The tab bar currently uses white background and `#1D4ED8` blue — update to use design tokens.

- [ ] **Step 1: Update tab bar colors in _layout.tsx**

Find the `screenOptions` block in `TabNavigator` and replace color values:

```tsx
screenOptions={{
  headerShown: false,
  tabBarActiveTintColor: colors.primary,      // #38bdf8 instead of #1D4ED8
  tabBarInactiveTintColor: colors.textMuted,  // rgba(56,189,248,0.31)
  tabBarStyle: {
    backgroundColor: colors.background,       // #0c1220 instead of #FFFFFF
    borderTopWidth: 1,
    borderTopColor: colors.border,            // #1e3a5a instead of #E2E8F0
    height: 64,
    paddingTop: 8,
    paddingBottom: 8,
  },
  tabBarLabelStyle: {
    fontSize: 12,
    fontWeight: '600',
  },
}}
```

Also add the import at the top of `_layout.tsx`:

```tsx
import { colors } from '../constants/theme';
```

- [ ] **Step 2: Run all tests**

```bash
npx jest --no-coverage
```

Expected: ALL PASS.

- [ ] **Step 3: Smoke-test**

```bash
npx expo start --ios
```

Verify tab bar shows dark navy background, sky blue active icon, muted inactive icons.

- [ ] **Step 4: Commit**

```bash
git add app/_layout.tsx
git commit -m "feat(nav): apply Approachable Science theme to tab bar"
```

---

## Final Verification

- [ ] **Run full test suite**

```bash
npx jest --no-coverage
```

Expected: ALL PASS.

- [ ] **Full smoke-test flow**

```bash
npx expo start --ios
```

Walk the complete user journey:
1. Fresh install → onboarding science hook screen
2. Answer both quiz questions → building animation (~3s) → reveal screen
3. "Take my baseline test" → SART test completes → navigates Home
4. Navigate to Practice → start a session → breath ring pulses, timer counts down, 2px bar fills
5. Session ends → post-session screen: checkmark, bandwidth card, forward prompt
6. Tap to dismiss → Home
7. Navigate to Progress tab → SART score (coral), sparkline, level bar

- [ ] **Push to remote**

```bash
git push
```
