/**
 * Post-Session Screen
 * 3 elements: completion mark · bandwidth card · forward prompt
 * No interaction required — user taps anywhere to dismiss to Home.
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
  'anchor-breath':    'Focus Booster',
  'body-sweep':       'Stress Reset',
  'thought-traffic':  'Anxiety Grounder',
  'kindness-circuit': 'Connection Practice',
};

const LEVEL_THRESHOLDS: Record<string, number> = {
  L1: 5,
  L2: 7,
  L3: 0,
};

export default function PostSessionScreen() {
  const route = useRoute();
  const navigation = useNavigation<any>();
  const { practiceType, repNumber } = (route.params || {}) as RouteParams;

  const [bandwidth, setBandwidth] = useState(0);
  const [bandwidthDelta] = useState(20);
  const [currentLevel, setCurrentLevel] = useState<'L1' | 'L2' | 'L3'>('L1');
  const [sessionsToNext, setSessionsToNext] = useState(0);
  const [nextSartDays, setNextSartDays] = useState(7);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const [progress, sartHistory] = await Promise.all([
          calculateAllProgress(),
          getSartHistory(),
        ]);

        const shield = progress.resilienceShield ?? 0;
        const level = (progress.settings?.currentLevel ?? 'L1') as 'L1' | 'L2' | 'L3';
        setBandwidth(shield);
        setCurrentLevel(level);

        const threshold = LEVEL_THRESHOLDS[level] ?? 0;
        const uniqueDays = Math.round(shield / 20);
        setSessionsToNext(Math.max(0, threshold - uniqueDays));

        if (sartHistory.length === 0) {
          setNextSartDays(0);
        } else {
          const lastSart = new Date(sartHistory[sartHistory.length - 1].date);
          const daysSince = Math.floor((Date.now() - lastSart.getTime()) / 86400000);
          setNextSartDays(Math.max(0, 7 - daysSince));
        }
      } catch {
        // Non-fatal — show defaults
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) {
    return <View style={s.container} />;
  }

  const practiceName = PRACTICE_NAMES[practiceType] ?? String(practiceType);
  const levelNum = currentLevel.replace('L', '');
  const nextLevelLabel = currentLevel === 'L3' ? null : `Level ${Number(levelNum) + 1}`;

  return (
    <SafeAreaView style={s.container}>
      <TouchableOpacity style={s.body} onPress={() => navigation.navigate('MainTabs')} activeOpacity={1}>

        {/* Completion mark */}
        <View style={s.completionBlock}>
          <View style={s.checkCircle}>
            <Text style={s.checkMark}>✓</Text>
          </View>
          <Text style={s.repDone}>Rep {repNumber} done</Text>
          <Text style={s.sessionMeta}>{practiceName} · Level {levelNum}</Text>
        </View>

        {/* Bandwidth card */}
        <View style={s.card}>
          <View style={s.cardRow}>
            <Text style={s.cardTitle}>Bandwidth</Text>
            <Text style={s.cardDelta}>+{bandwidthDelta}%</Text>
          </View>
          <View style={s.barTrack}>
            <View style={[s.barFill, { width: `${Math.min(bandwidth, 100)}%` }]} />
          </View>
          <Text style={s.cardSub}>
            {bandwidth}%
            {nextLevelLabel && sessionsToNext > 0
              ? ` · ${sessionsToNext} session${sessionsToNext !== 1 ? 's' : ''} to ${nextLevelLabel}`
              : nextLevelLabel === null ? ' · Mastery reached' : ''}
          </Text>
        </View>

        {/* Forward prompt */}
        <Text style={s.forwardPrompt}>
          {nextSartDays === 0
            ? 'Take your weekly focus test'
            : `SART test in ${nextSartDays} day${nextSartDays !== 1 ? 's' : ''}`}
        </Text>

        <Text style={s.tapHint}>Tap anywhere to continue</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  body: {
    flex: 1,
    paddingHorizontal: spacing.screenPaddingH,
    paddingVertical: spacing.screenPaddingV,
    justifyContent: 'center',
    gap: 32,
  },
  completionBlock: { alignItems: 'center', gap: 10 },
  checkCircle: {
    width: 56, height: 56, borderRadius: 28,
    borderWidth: 1.5, borderColor: colors.primary,
    alignItems: 'center', justifyContent: 'center',
  },
  checkMark: { fontSize: 22, color: colors.primary },
  repDone: { fontSize: 20, fontWeight: '300', color: colors.textBody },
  sessionMeta: {
    fontSize: typography.labelSize, fontWeight: typography.labelWeight,
    color: colors.textMuted, textTransform: typography.labelTransform,
    letterSpacing: typography.labelSpacing,
  },
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
  forwardPrompt: {
    textAlign: 'center', fontSize: typography.cardTextSize, color: colors.textMuted,
  },
  tapHint: {
    textAlign: 'center', fontSize: typography.cardTextSize,
    color: colors.textMuted, opacity: 0.4,
  },
});
