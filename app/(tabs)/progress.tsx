/**
 * Progress Tab
 * SART score · 4-week sparkline · level bar
 * Output gamification only — no vanity metrics, no social comparison.
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
const BAR_OPACITIES = ['0.25', '0.40', '0.65', '1.0'];

function Sparkline({ scores }: { scores: SartTestResult[] }) {
  const last4 = scores.slice(-4);
  const padded: (SartTestResult | null)[] = [
    ...Array(Math.max(0, 4 - last4.length)).fill(null),
    ...last4,
  ];

  const values = padded.map(s => (s ? s.avgReactionTimeMs : null));
  const validValues = values.filter((v): v is number => v !== null);
  const maxMs = validValues.length ? Math.max(...validValues) : 1000;
  const minMs = validValues.length ? Math.min(...validValues) : 500;
  const range = Math.max(maxMs - minMs, 1);

  return (
    <Svg width={SPARKLINE_WIDTH} height={SPARKLINE_HEIGHT}>
      {padded.map((score, i) => {
        const x = i * (BAR_WIDTH + BAR_GAP);
        if (!score) {
          return (
            <Rect key={i} x={x} y={SPARKLINE_HEIGHT - 4} width={BAR_WIDTH} height={4}
              fill={colors.primary} opacity={0.1} rx={2} />
          );
        }
        const ratio = (maxMs - score.avgReactionTimeMs) / range;
        const barH = Math.max(4, Math.round(ratio * SPARKLINE_HEIGHT));
        const y = SPARKLINE_HEIGHT - barH;
        const isLatest = i === BAR_COUNT - 1;
        return (
          <Rect key={i} x={x} y={y} width={BAR_WIDTH} height={barH}
            fill={isLatest ? colors.coral : colors.primary}
            opacity={isLatest ? 1 : BAR_OPACITIES[i]}
            rx={2} />
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
      try {
        const [history, progress] = await Promise.all([
          getSartHistory(),
          calculateAllProgress(),
        ]);
        setSartHistory(history);
        setBandwidth(progress.resilienceShield ?? 0);
        const lvl = (progress.settings?.currentLevel ?? 'L1') as 'L1' | 'L2' | 'L3';
        setLevel(lvl);
        const thresholds: Record<string, number> = { L1: 5, L2: 7, L3: 0 };
        const uniqueDays = Math.round((progress.resilienceShield ?? 0) / 20);
        setSessionsToNext(Math.max(0, (thresholds[lvl] ?? 0) - uniqueDays));
      } catch {
        // Non-fatal — show empty state
      } finally {
        setLoading(false);
      }
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
            <Sparkline scores={sartHistory} />
            <View style={s.weekRow}>
              {['Wk 1', 'Wk 2', 'Wk 3', 'Now'].map(w => (
                <Text key={w} style={s.weekLabel}>{w}</Text>
              ))}
            </View>
            <Text style={s.cardSub}>Lower reaction time = sharper attention</Text>
          </View>
        )}

        {/* Level bar */}
        <View style={s.card}>
          <View style={s.levelRow}>
            <Text style={s.cardLabel}>Level {levelNum}</Text>
            {nextLevelLabel && sessionsToNext > 0 ? (
              <Text style={s.cardSub}>
                {sessionsToNext} session{sessionsToNext !== 1 ? 's' : ''} to {nextLevelLabel}
              </Text>
            ) : !nextLevelLabel ? (
              <Text style={s.cardSub}>Mastery reached</Text>
            ) : null}
          </View>
          <View style={s.levelTrack}>
            <View style={[s.levelFill, { width: `${Math.min(bandwidth, 100)}%` }]} />
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
  weekRow: {
    flexDirection: 'row', width: SPARKLINE_WIDTH,
    justifyContent: 'space-between',
  },
  weekLabel: {
    fontSize: 8, color: colors.textMuted,
    width: BAR_WIDTH, textAlign: 'center',
  },
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
