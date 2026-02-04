# Phase 02 Research — Practice Progression & Schedule Control

## Summary

Evidence supports short, structured mindfulness programs that prioritize consistent practice over long duration. The Jha Lab’s MBAT protocol is an 8-hour course delivered across 4 weeks with brief daily practice (15 minutes, 3–4 days/week), and Mind & Life’s research notes that compressing to 2 weeks becomes ineffective. Standard MBSR remains the canonical 8‑week program but requires far more time (weekly 2.5‑hour classes plus ~45 minutes/day home practice). For Focus Reps, a 6‑week schedule with an optional extended track can align to these findings: short daily reps for consistency, with a longer 8‑week “pro” option that adds duration or practice variety rather than heavy time commitments.

## Findings

### 1) MBAT evidence supports 4‑week minimum with brief daily reps
- Jha Lab describes MBAT as an 8‑hour, 4‑week training with 15 minutes/day, 3–4 days per week, designed to strengthen attention and working memory. This supports shorter daily practice with consistency rather than long sessions. citeturn0search0

### 2) Condensing to 2 weeks appears ineffective
- Mind & Life Institute summarizes lab findings: 8 hours of content can be delivered in 4 weeks with promising results, but compressing to 2 weeks proved ineffective. This suggests a minimum multi‑week cadence is important even if daily practice is short. citeturn0search1

### 3) Standard MBSR is an 8‑week, high‑commitment model
- MBSR courses typically run 8 weeks with 2.5‑hour weekly classes plus daily 45‑minute home practice and a full‑day retreat. This is a much heavier commitment than Focus Reps’ 12‑minute reps, but offers a reference point for a longer “advanced” track. citeturn0search2turn0search5

## Implications for Phase 02

- **Keep the 6‑week default**: It aligns with the “multi‑week minimum” insight and offers a clear progression through practices.
- **Add a longer track option (8‑week)**: Use the MBSR 8‑week cadence as a conceptual extension without adding heavy time requirements. Instead of increasing session length, extend weeks or add optional “bonus” sessions.
- **Prioritize consistency over duration**: Short daily practice (12–15 min) plus 3–5 days/week aligns with MBAT’s evidence base.
- **Post‑week‑4 flexibility**: Allow “continue training” mode with user‑selected practices, while still surfacing a recommended practice.

## Design Recommendations

1. **Program modes**
   - `standard_6_week` (default)
   - `extended_8_week` (optional)
   - `open_training` (post‑week‑4 continuation)

2. **Schedule logic**
   - Keep alternating practices by week for guided progression.
   - After week 4, allow a user‑selected schedule (e.g., pick 1–2 practices for the week).

3. **UX constraints**
   - Simple switch in Settings or a “Continue Training” prompt at Week 5.
   - Keep “Today’s practice” flow unchanged unless user has explicitly selected a custom track.

## Sources

- Jha Lab MBAT overview (4‑week, 15 min/day, 3–4 days/week): https://lab.amishi.com/projects/mindfulness-based-attention-training/ citeturn0search0
- Mind & Life Institute on minimum effective dose (4 weeks effective, 2 weeks ineffective): https://www.mindandlife.org/insight/strengthening-attention/ citeturn0search1
- Standard MBSR structure (8 weeks, 2.5‑hour classes + daily home practice): https://globalmbsrcollaborative.com/program/ and https://www.ummhealth.org/services-treatments/center-mindfulness/mindfulness-programs/mbsr/mbsr-outline citeturn0search2turn0search5
