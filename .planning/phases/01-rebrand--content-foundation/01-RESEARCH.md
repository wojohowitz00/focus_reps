# Phase Research: Rebrand + Content Foundation

**Phase:** 1 — Rebrand + Content Foundation
**Researched:** 2026-02-04
**Confidence:** HIGH

## What This Phase Must Achieve

- Replace all Peak Mind branding with Focus Reps branding across UI and onboarding.
- Rename practices and provide original scripts (audio + text) to avoid Peak Mind IP reuse.
- Establish deliberate‑practice mentor framing in onboarding copy.

## Constraints & Decisions

- **Content/IP:** No Peak Mind language or scripts; all practices must be original.
- **Branding:** App name is Focus Reps; aesthetic is minimalist, functional, calm.
- **Audience:** Students and professionals.

## Recommended Approach

1. **Brand sweep (UI copy + app metadata):**
   - Replace “Peak Mind” references in all screens (`app/`) and in `app.json`.
   - Keep bundle identifiers unchanged unless explicitly requested.

2. **Practice renaming + original scripts:**
   - Create 4 renamed practices aligned to attention training (avoid “flashlight,” “river,” “connection”).
   - Add original scripts in `lib/practiceInstructions.ts` (audio + text scaffolds).
   - Update `PracticeType` union and `practiceDefinitions` in `types/index.ts` and `lib/practices.ts`.

3. **Onboarding narrative:**
   - Add deliberate‑practice framing: reps, feedback loops, weekly review.
   - Keep onboarding short; focus on “why” + first action.

## Pitfalls to Avoid

- Accidentally retaining Peak Mind phrases in copy.
- Mixing new practice names with old IDs (inconsistent data).
- Writing scripts inside UI files instead of central content module.

## Files Likely Touched

- `app/(tabs)/*.tsx`
- `app/onboarding.tsx`
- `app/practice/[id].tsx`
- `app/practice-history.tsx`
- `app/journal-entry.tsx`
- `app.json`
- `types/index.ts`
- `lib/practices.ts`
- `lib/practiceInstructions.ts`

---
*Research complete for Phase 1*
