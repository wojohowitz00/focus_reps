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
