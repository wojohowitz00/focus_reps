/**
 * Onboarding Screen — "Approachable Science" design
 * Flow: science hook → quiz (2 q) → building animation → profile reveal
 * SART baseline is taken after onboarding via navigation to SartTest
 */

import React, { useState, useRef } from 'react';
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

  const buildingProgress = useRef(new Animated.Value(0)).current;

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
    Animated.timing(buildingProgress, {
      toValue: 1,
      duration: 2800,
      easing: Easing.out(Easing.quad),
      useNativeDriver: false,
    }).start(() => setStep('reveal'));
  };

  const handleComplete = async () => {
    const settings = await getSettings();
    await saveSettings({
      ...(settings ?? {}),
      userPath,
      programStartDate: new Date().toISOString(),
    });
    // Permissions / notifications are best-effort — never block progression
    try {
      await requestPermissions();
      await initializeNotifications();
    } catch {
      // Silently continue — notifications are optional, training is not
    }
    navigation.replace('SartTest');
  };

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
  primaryButton: {
    backgroundColor: colors.primary, borderRadius: spacing.cardRadius,
    padding: 16, alignItems: 'center',
  },
  primaryButtonText: {
    fontSize: typography.bodySize, fontWeight: '700', color: colors.background,
  },
});
