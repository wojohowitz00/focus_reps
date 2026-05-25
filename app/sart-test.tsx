/**
 * SART-Lite Focus Test (Go/No-Go Reaction-Time Task)
 * 60-second objective measure of attentional lapses
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Dimensions,
  Pressable,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { saveSartTestResult } from '../lib/storage';
import { SartTestResult } from '../types';

const { width } = Dimensions.get('window');

type TestState = 'instructions' | 'countdown' | 'active' | 'results';

export default function SartTestScreen() {
  const navigation = useNavigation();
  const [testState, setTestState] = useState<TestState>('instructions');
  const [countdown, setCountdown] = useState(3);
  
  // Game Loop State
  const [currentDigit, setCurrentDigit] = useState<number | null>(null);
  const [showDigit, setShowDigit] = useState(false);
  const [trialIndex, setTrialIndex] = useState(0);
  const [hasTappedThisTrial, setHasTappedThisTrial] = useState(false);
  
  // Stats
  const [lapses, setLapses] = useState(0); // Commission errors (taps on 3)
  const [misses, setMisses] = useState(0); // Omission errors (no tap on 1-2, 4-9)
  const [reactionTimes, setReactionTimes] = useState<number[]>([]);
  const [finalScore, setFinalScore] = useState<SartTestResult | null>(null);

  // Timers
  const trialIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const displayTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const countdownIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const trialStartTimeRef = useRef<number>(0);
  const isDigit3Ref = useRef<boolean>(false);

  // Constants
  const TOTAL_TRIALS = 45; // 45 trials at 1.2s per trial = ~54 seconds
  const TRIAL_DURATION_MS = 1200; // 1.2 seconds total per trial
  const DIGIT_VISIBLE_MS = 250; // digit visible for 250ms

  useEffect(() => {
    return () => {
      clearAllTimers();
    };
  }, []);

  const clearAllTimers = () => {
    if (trialIntervalRef.current) clearInterval(trialIntervalRef.current);
    if (displayTimeoutRef.current) clearTimeout(displayTimeoutRef.current);
    if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current);
  };

  const startCountdown = () => {
    setTestState('countdown');
    setCountdown(3);
    
    countdownIntervalRef.current = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(countdownIntervalRef.current!);
          startTest();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const startTest = () => {
    setTestState('active');
    setTrialIndex(0);
    setLapses(0);
    setMisses(0);
    setReactionTimes([]);
    
    // Start first trial immediately
    runTrial(0);
  };

  const runTrial = (index: number) => {
    if (index >= TOTAL_TRIALS) {
      endTest();
      return;
    }

    setTrialIndex(index + 1);
    setHasTappedThisTrial(false);

    // Determine target digit (11% probability of being 3)
    const is3 = Math.random() < 0.15;
    let digit = 3;
    if (!is3) {
      const goDigits = [1, 2, 4, 5, 6, 7, 8, 9];
      digit = goDigits[Math.floor(Math.random() * goDigits.length)];
    }

    isDigit3Ref.current = digit === 3;
    setCurrentDigit(digit);
    setShowDigit(true);
    trialStartTimeRef.current = Date.now();

    // Hide digit after 250ms
    displayTimeoutRef.current = setTimeout(() => {
      setShowDigit(false);
    }, DIGIT_VISIBLE_MS);

    // Schedule next trial
    trialIntervalRef.current = setTimeout(() => {
      // Evaluate end of trial
      evaluateTrialEnd();
      runTrial(index + 1);
    }, TRIAL_DURATION_MS);
  };

  const evaluateTrialEnd = () => {
    // If it was a GO target (not 3) and user did not tap, it's a MISS (omission)
    if (!isDigit3Ref.current && !hasTappedThisTrial) {
      setMisses((prev) => prev + 1);
    }
  };

  const handleTap = () => {
    if (testState !== 'active' || hasTappedThisTrial) return;
    
    setHasTappedThisTrial(true);
    const tapTime = Date.now();
    const rt = tapTime - trialStartTimeRef.current;

    if (isDigit3Ref.current) {
      // Tapped on 3 = Commission Error (Lapse)
      setLapses((prev) => prev + 1);
    } else {
      // Correct tap on GO trial
      setReactionTimes((prev) => [...prev, rt]);
    }
  };

  const endTest = async () => {
    clearAllTimers();
    setTestState('results');
    setShowDigit(false);
    setCurrentDigit(null);

    // Calculate metrics
    const avgRt = reactionTimes.length > 0 
      ? Math.round(reactionTimes.reduce((sum, val) => sum + val, 0) / reactionTimes.length)
      : 0;

    // Focus Score calculation: starting at 100, penalize for lapses and misses
    // Lapses (commission) are heavy attentional slips (8% each)
    // Misses (omission) are sluggish focus drops (4% each)
    const baseScore = 100 - (lapses * 8) - (misses * 4);
    const focusScore = Math.max(0, Math.min(100, baseScore));

    const result: SartTestResult = {
      id: `sart-${Date.now()}`,
      date: new Date().toISOString(),
      lapses,
      misses,
      avgReactionTimeMs: avgRt,
      focusScore,
    };

    setFinalScore(result);

    try {
      await saveSartTestResult(result);
    } catch (e) {
      console.error('Failed to save SART test results:', e);
    }
  };

  const getScoreClassification = (score: number) => {
    if (score >= 90) return { title: 'Elite Focus Shield', color: '#16A34A', desc: 'Superior sustained attention and impulse control. Your cognitive defense is highly resilient.' };
    if (score >= 75) return { title: 'Stable Focus', color: '#2563EB', desc: 'Good attention endurance. Minor lapses detected, but well within high-functioning range.' };
    if (score >= 60) return { title: 'Moderate Instability', color: '#D97706', desc: 'Mild cognitive fatigue or digital fog detected. Noticeable lapses in sustained control.' };
    return { title: 'High Vulnerability', color: '#DC2626', desc: 'Significant attentional slips. Your mind is highly prone to digital triggers or exhaustion. Focus reps are highly recommended.' };
  };

  return (
    <SafeAreaView style={styles.container}>
      {testState === 'instructions' && (
        <View style={styles.content}>
          <Text style={styles.badge}>Scientific Assessment</Text>
          <Text style={styles.title}>Attention Focus Test</Text>
          <Text style={styles.description}>
            This is a 60-second Go/No-Go assessment based on the Sustained Attention to Response Task (SART). It objectively measures your "attentional lapses" and speed.
          </Text>

          <View style={styles.instructionsCard}>
            <Text style={styles.instructionHeading}>How to Play:</Text>
            <Text style={styles.instructionText}>
              • Digits <Text style={styles.bold}>1 to 9</Text> will flash rapidly on the screen.
            </Text>
            <Text style={styles.instructionText}>
              • <Text style={styles.bold}>TAP THE SCREEN</Text> as fast as possible for any digit...
            </Text>
            <Text style={styles.instructionText}>
              • <Text style={styles.bold, styles.highlightText}>BUT DO NOT TAP for digit 3</Text> (withhold your reaction!).
            </Text>
          </View>

          <TouchableOpacity style={styles.primaryButton} onPress={startCountdown}>
            <Text style={styles.primaryButtonText}>Start 60s Focus Test</Text>
          </TouchableOpacity>
        </View>
      )}

      {testState === 'countdown' && (
        <View style={styles.centeredContent}>
          <Text style={styles.countdownSub}>Get ready...</Text>
          <Text style={styles.countdownNum}>{countdown}</Text>
        </View>
      )}

      {testState === 'active' && (
        <Pressable style={styles.activeArea} onPress={handleTap}>
          <View style={styles.statusBar}>
            <Text style={styles.statusBarText}>Trial: {trialIndex} / {TOTAL_TRIALS}</Text>
            <Text style={styles.statusBarText}>Lapses (Taps on 3): {lapses}</Text>
          </View>
          
          <View style={styles.digitContainer}>
            {showDigit && currentDigit !== null ? (
              <Text style={[styles.digit, currentDigit === 3 && styles.digitThree]}>{currentDigit}</Text>
            ) : (
              <View style={styles.maskRing} />
            )}
          </View>

          <Text style={styles.tapPrompt}>Tap anywhere on screen for GO targets</Text>
        </Pressable>
      )}

      {testState === 'results' && finalScore && (
        <View style={styles.content}>
          <Text style={styles.badge}>Test Results</Text>
          <Text style={styles.title}>Your Focus Profile</Text>

          <View style={styles.scoreContainer}>
            <Text style={styles.scoreNum}>{finalScore.focusScore}%</Text>
            <Text style={styles.scoreLabel}>Focus Score</Text>
          </View>

          {(() => {
            const classification = getScoreClassification(finalScore.focusScore);
            return (
              <View style={[styles.resultCard, { borderColor: classification.color }]}>
                <Text style={[styles.resultClassTitle, { color: classification.color }]}>
                  {classification.title}
                </Text>
                <Text style={styles.resultClassDesc}>{classification.desc}</Text>
              </View>
            );
          })()}

          <View style={styles.statsGrid}>
            <View style={styles.statBox}>
              <Text style={styles.statNum}>{finalScore.lapses}</Text>
              <Text style={styles.statLabel}>Lapses (Taps on 3)</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statNum}>{finalScore.misses}</Text>
              <Text style={styles.statLabel}>Misses (Omissions)</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statNum}>{finalScore.avgReactionTimeMs}ms</Text>
              <Text style={styles.statLabel}>Avg Speed</Text>
            </View>
          </View>

          <TouchableOpacity
            style={styles.primaryButton}
            onPress={() => navigation.navigate('MainTabs' as never, { screen: 'Progress' } as never)}
          >
            <Text style={styles.primaryButtonText}>Return to Progress</Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  content: {
    flex: 1,
    padding: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  centeredContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0F172A',
  },
  countdownSub: {
    fontSize: 20,
    color: '#94A3B8',
    marginBottom: 20,
    fontWeight: '600',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  countdownNum: {
    fontSize: 96,
    fontWeight: '800',
    color: '#3B82F6',
  },
  badge: {
    fontSize: 12,
    fontWeight: '700',
    color: '#2563EB',
    backgroundColor: '#EFF6FF',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 999,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 16,
    textAlign: 'center',
  },
  description: {
    fontSize: 15,
    color: '#475569',
    lineHeight: 22,
    textAlign: 'center',
    marginBottom: 30,
  },
  instructionsCard: {
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    padding: 20,
    width: '100%',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 40,
  },
  instructionHeading: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 12,
  },
  instructionText: {
    fontSize: 14,
    color: '#475569',
    lineHeight: 22,
    marginBottom: 8,
  },
  bold: {
    fontWeight: '700',
    color: '#0F172A',
  },
  highlightText: {
    color: '#DC2626',
    fontWeight: '700',
  },
  primaryButton: {
    backgroundColor: '#2563EB',
    width: '100%',
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 0.3,
  },
  activeArea: {
    flex: 1,
    backgroundColor: '#0F172A',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  statusBar: {
    position: 'absolute',
    top: 20,
    left: 20,
    right: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statusBarText: {
    color: '#94A3B8',
    fontSize: 13,
    fontWeight: '600',
  },
  digitContainer: {
    width: 200,
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
  },
  digit: {
    fontSize: 120,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  digitThree: {
    color: '#EF4444',
  },
  maskRing: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 4,
    borderColor: '#334155',
    backgroundColor: 'transparent',
  },
  tapPrompt: {
    position: 'absolute',
    bottom: 40,
    fontSize: 14,
    color: '#64748B',
    fontWeight: '500',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  scoreContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  scoreNum: {
    fontSize: 64,
    fontWeight: '800',
    color: '#2563EB',
  },
  scoreLabel: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  resultCard: {
    backgroundColor: '#F8FAFC',
    borderWidth: 2,
    borderRadius: 16,
    padding: 20,
    width: '100%',
    marginBottom: 30,
  },
  resultClassTitle: {
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 6,
    textTransform: 'uppercase',
    letterSpacing: 0.3,
  },
  resultClassDesc: {
    fontSize: 14,
    color: '#475569',
    lineHeight: 20,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 40,
    width: '100%',
  },
  statBox: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  statNum: {
    fontSize: 20,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 10,
    color: '#64748B',
    fontWeight: '600',
    textAlign: 'center',
  },
});
