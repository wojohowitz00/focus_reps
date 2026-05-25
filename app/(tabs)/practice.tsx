/**
 * Practice Selection Screen
 * Shows available practices and schedule
 */

import { View, Text, StyleSheet, ScrollView, Pressable, Alert } from 'react-native';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import { useEffect, useState } from 'react';
import { getTodayPractice, practiceDefinitions, isPracticeUnlocked } from '../../lib/practices';
import { PracticeType } from '../../types';
import { getSettings } from '../../lib/storage';

export default function PracticeScreen() {
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const [recommendedPractice, setRecommendedPractice] = useState<PracticeType>('anchor-breath');
  const [programLabel, setProgramLabel] = useState('6-Week Standard');
  const [userLevel, setUserLevel] = useState<'L1' | 'L2' | 'L3'>('L1');

  useEffect(() => {
    if (isFocused) {
      loadRecommendation();
    }
  }, [isFocused]);

  const loadRecommendation = async () => {
    try {
      const settings = await getSettings();
      const startDate = settings?.programStartDate
        ? new Date(settings.programStartDate)
        : new Date();
      const programMode = settings?.programMode ?? 'standard_6_week';
      const customPracticeSet = settings?.customPracticeSet;
      const level = settings?.currentLevel ?? 'L1';
      setUserLevel(level);

      const recommended = getTodayPractice(
        startDate,
        programMode,
        customPracticeSet,
        settings?.userPath,
        level
      );
      setRecommendedPractice(recommended);
      setProgramLabel(getProgramLabel(programMode));
    } catch (error) {
      console.error('Error loading recommended practice:', error);
    }
  };

  const getProgramLabel = (mode: string) => {
    if (mode === 'extended_8_week') return '8-Week Extended';
    if (mode === 'open_training') return 'Open Training';
    return '6-Week Standard';
  };

  const handlePracticeSelect = (practiceType: PracticeType) => {
    const unlocked = isPracticeUnlocked(practiceType, userLevel);
    if (!unlocked) {
      Alert.alert(
        '🔒 Practice Locked',
        'This practice requires Level 2: Expansion.\n\nEarn Level 2 by completing at least 5 unique training days in a rolling 7-day window!'
      );
      return;
    }
    // Navigate to practice session screen
    navigation.navigate('PracticeSession' as never, { id: practiceType } as never);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Practices</Text>
        <Text style={styles.subtitle}>Choose your practice</Text>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.recommendedCard}>
          <Text style={styles.recommendedLabel}>Recommended Today</Text>
          <Text style={styles.recommendedTitle}>
            {practiceDefinitions[recommendedPractice].name}
          </Text>
          <Text style={styles.recommendedDescription}>
            {practiceDefinitions[recommendedPractice].description}
          </Text>
          <Text style={styles.recommendedMeta}>Track: {programLabel}</Text>
          <Pressable
            style={({ pressed }) => [
              styles.recommendedButton,
              pressed && styles.recommendedButtonPressed
            ]}
            onPress={() => handlePracticeSelect(recommendedPractice)}
          >
            <Text style={styles.recommendedButtonText}>Start Recommended</Text>
          </Pressable>
        </View>

        <Text style={styles.sectionLabel}>All Practices</Text>
        {Object.values(practiceDefinitions).map((practice) => {
          const unlocked = isPracticeUnlocked(practice.id, userLevel);
          return (
            <Pressable
              key={practice.id}
              style={({ pressed }) => [
                styles.practiceCard,
                !unlocked && styles.practiceCardLocked,
                pressed && styles.practiceCardPressed
              ]}
              onPress={() => handlePracticeSelect(practice.id)}
            >
              <View style={styles.practiceInfo}>
                <Text style={[styles.practiceName, !unlocked && styles.practiceNameLocked]}>
                  {!unlocked ? '🔒 ' : ''}{practice.name}
                </Text>
                <Text style={styles.practiceDescription}>{practice.description}</Text>
                <Text style={styles.practiceDuration}>
                  {unlocked ? `${practice.defaultDuration} minutes` : 'Requires Level 2'}
                </Text>
              </View>
              {unlocked ? (
                <Text style={styles.arrow}>→</Text>
              ) : (
                <Text style={styles.lockArrow}>🔒</Text>
              )}
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
  header: {
    paddingTop: 64,        // 8px grid: was 60
    paddingHorizontal: 24,  // 8px grid: was 20
    paddingBottom: 24,      // 8px grid: was 20
    backgroundColor: '#FFFFFF',
    // Multi-layered shadow
    shadowColor: '#1D4ED8',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',      // Heavier weight
    color: '#0F172A',
    marginBottom: 8,        // 8px grid: was 4
  },
  subtitle: {
    fontSize: 16,
    color: '#475569',       // Better contrast
    fontWeight: '400',
  },
  content: {
    flex: 1,
    padding: 24,            // 8px grid: was 20
  },
  recommendedCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,       // 8px grid: was 12
    padding: 24,            // 8px grid: was 20
    marginBottom: 24,       // 8px grid: was 20
    // Multi-layered shadow with accent color
    shadowColor: '#1D4ED8',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 6,
  },
  recommendedLabel: {
    fontSize: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
    color: '#475569',       // Better contrast
    marginBottom: 8,
    fontWeight: '500',
  },
  recommendedTitle: {
    fontSize: 24,           // Larger: was 22
    fontWeight: '700',      // Bolder: was '600'
    color: '#0F172A',
    marginBottom: 8,        // 8px grid: was 6
  },
  recommendedDescription: {
    fontSize: 14,
    color: '#475569',       // Better contrast
    marginBottom: 16,       // 8px grid: was 10
    lineHeight: 20,
  },
  recommendedMeta: {
    fontSize: 12,
    color: '#64748B',       // Better contrast than #94A3B8
    marginBottom: 16,
    fontWeight: '500',
  },
  recommendedButton: {
    backgroundColor: '#1D4ED8',
    paddingVertical: 16,    // Accessibility: was 12
    borderRadius: 8,
    alignItems: 'center',
    minHeight: 48,          // Explicit minimum
    justifyContent: 'center',
    // Button shadow
    shadowColor: '#1D4ED8',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  recommendedButtonPressed: {
    backgroundColor: '#1E40AF',
    transform: [{ scale: 0.98 }],
    shadowOpacity: 0.2,
  },
  recommendedButtonText: {
    color: '#FFFFFF',
    fontSize: 16,           // Larger: was 14
    fontWeight: '600',
    letterSpacing: 0.3,
  },
  sectionLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0F172A',
    marginBottom: 16,       // 8px grid: was 12
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  practiceCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,       // 8px grid: was 12
    padding: 24,            // 8px grid: was 20
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: 48,          // Accessibility
    // Multi-layered shadow
    shadowColor: '#1D4ED8',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
  },
  practiceCardPressed: {
    backgroundColor: '#F8FAFC',
    transform: [{ scale: 0.99 }],
    shadowOpacity: 0.05,
  },
  practiceInfo: {
    flex: 1,
  },
  practiceName: {
    fontSize: 20,
    fontWeight: '600',
    color: '#0F172A',
    marginBottom: 8,        // 8px grid: was 4
  },
  practiceDescription: {
    fontSize: 14,
    color: '#475569',       // Better contrast
    marginBottom: 8,
    lineHeight: 20,
  },
  practiceDuration: {
    fontSize: 12,
    color: '#64748B',       // Better contrast
    fontWeight: '500',
  },
  arrow: {
    fontSize: 24,
    color: '#1D4ED8',
    marginLeft: 16,
    fontWeight: '600',
  },
  practiceCardLocked: {
    backgroundColor: '#F1F5F9',
    borderColor: '#E2E8F0',
    borderWidth: 1,
    shadowOpacity: 0.02,
    elevation: 1,
    opacity: 0.75,
  },
  practiceNameLocked: {
    color: '#64748B',
  },
  lockArrow: {
    fontSize: 18,
    color: '#94A3B8',
    marginLeft: 16,
  },
});
