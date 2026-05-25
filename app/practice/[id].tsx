/**
 * Practice Session Screen — "Approachable Science" session UI
 * 4 elements only: label · breath ring · timer · progress bar
 * No stats, no live score during session.
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  View, Text, StyleSheet, SafeAreaView, TouchableOpacity,
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

const RING_SIZE = 120;
const CX = RING_SIZE / 2;
const R_OUTER = CX - 4;
const R_MIDDLE = CX - 18;
const R_INNER = CX - 32;

type RouteParams = { id: PracticeType; repNumber?: number };

function useCountdown(totalSeconds: number, running: boolean) {
  const [remaining, setRemaining] = useState(totalSeconds);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

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
      (async () => {
        try {
          await saveSession(session);
        } catch {
          // Save failed — still navigate, progress will resync on next load
        }
        navigation.replace('PostSession', {
          practiceType: id,
          repNumber,
          sessionId: session.id,
        });
      })();
    }
  }, [remaining, running, done, id, practice, repNumber, navigation]);

  const handleStart = () => {
    startTimeRef.current = Date.now();
    setRunning(true);
  };

  const progress = running ? (totalSeconds - remaining) / totalSeconds : 0;
  const practiceLabel = practice?.name ?? id;
  const sessionLabel = `${practiceLabel} · Rep ${repNumber}`.toUpperCase();

  if (!running && !done) {
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
            <Circle cx={CX} cy={CX} r={R_OUTER} stroke={colors.primaryRing1} strokeWidth={1} fill="none" />
            <Circle cx={CX} cy={CX} r={R_MIDDLE} stroke={colors.primaryRing2} strokeWidth={1} fill="none" />
          </Svg>
          <Animated.View style={[s.innerRingWrapper, animatedRingStyle]}>
            <Svg width={RING_SIZE} height={RING_SIZE} style={StyleSheet.absoluteFill}>
              <Circle cx={CX} cy={CX} r={R_INNER} stroke={colors.primary} strokeWidth={1.5} fill={colors.background} />
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
  progressTrack: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    height: spacing.progressBarHeight,
    backgroundColor: colors.surface,
  },
  progressFill: {
    height: spacing.progressBarHeight,
    backgroundColor: colors.primary,
  },
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
