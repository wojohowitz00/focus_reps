/**
 * Home Screen
 * Main dashboard showing today's practice and quick stats
 */

import { View, Text, StyleSheet, Pressable } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import { useEffect, useState } from 'react';
import { getTodayPractice } from '../../lib/practices';
import { calculateAllProgress } from '../../lib/progress';
import { UserProgress } from '../../types';
import { practiceDefinitions } from '../../lib/practices';
import { getSettings } from '../../lib/storage';

export default function HomeScreen() {
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const [progress, setProgress] = useState<UserProgress | null>(null);
  const [todayPractice, setTodayPractice] = useState<string>('anchor-breath');

  useEffect(() => {
    if (isFocused) {
      loadData();
    }
  }, [isFocused]);

  const loadData = async () => {
    try {
      const settings = await getSettings();
      const startDate = settings?.programStartDate
        ? new Date(settings.programStartDate)
        : new Date();
      const programMode = settings?.programMode ?? 'standard_6_week';
      const customPracticeSet = settings?.customPracticeSet;

      const progressData = await calculateAllProgress(startDate);
      setProgress(progressData);

      const practice = getTodayPractice(
        startDate,
        programMode,
        customPracticeSet,
        settings?.userPath,
        settings?.currentLevel
      );
      setTodayPractice(practice);
    } catch (error) {
      console.error('Error loading home data:', error);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      
      <View style={styles.header}>
        <Text style={styles.title}>Focus Reps</Text>
        <Text style={styles.subtitle}>Train your focus</Text>
      </View>

      <View style={styles.content}>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Today's Practice</Text>
          <Text style={styles.practiceName}>
            {practiceDefinitions[todayPractice as keyof typeof practiceDefinitions]?.name || 'Anchor Breath'}
          </Text>
          <Text style={styles.practiceDuration}>
            {practiceDefinitions[todayPractice as keyof typeof practiceDefinitions]?.defaultDuration || 12} minutes
          </Text>
          
          <Pressable
            style={({ pressed }) => [
              styles.startButton,
              pressed && styles.startButtonPressed
            ]}
            onPress={() => navigation.navigate('PracticeSession' as never, { id: todayPractice } as never)}
          >
            <Text style={styles.startButtonText}>Start Practice</Text>
          </Pressable>
        </View>

        <View style={styles.stats}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{progress?.totalMinutes || 0}</Text>
            <Text style={styles.statLabel}>Minutes</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{progress?.totalSessions || 0}</Text>
            <Text style={styles.statLabel}>Sessions</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>Week {progress?.currentWeek || 1}</Text>
            <Text style={styles.statLabel}>Current Week</Text>
          </View>
        </View>
      </View>
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
    // Multi-layered shadow (iOS)
    shadowColor: '#1D4ED8',  // Use primary color instead of black
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    // Android elevation
    elevation: 2,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',      // Heavier weight for more impact
    color: '#0F172A',
    marginBottom: 8,        // 8px grid: was 4
  },
  subtitle: {
    fontSize: 16,
    color: '#475569',       // Darker for better contrast (was #64748B)
    fontWeight: '400',
  },
  content: {
    flex: 1,
    padding: 24,            // 8px grid: was 20
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,       // 8px grid: was 12
    padding: 24,            // 8px grid: was 20
    marginBottom: 24,       // 8px grid: was 20
    // Multi-layered shadow for depth (iOS)
    shadowColor: '#1D4ED8',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    // Android elevation
    elevation: 4,
  },
  cardTitle: {
    fontSize: 14,
    color: '#475569',       // Better contrast
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    fontWeight: '500',      // Added weight for hierarchy
  },
  practiceName: {
    fontSize: 24,
    fontWeight: '600',
    color: '#0F172A',
    marginBottom: 8,        // 8px grid: was 4
  },
  practiceDuration: {
    fontSize: 16,
    color: '#475569',       // Better contrast
    marginBottom: 24,       // 8px grid: was 20
    fontWeight: '400',
  },
  startButton: {
    backgroundColor: '#1D4ED8',
    paddingVertical: 16,    // Ensures 48px+ height (accessibility)
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
    minHeight: 48,          // Explicit minimum for touch targets
    justifyContent: 'center',
    // Button shadow for depth
    shadowColor: '#1D4ED8',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  startButtonPressed: {
    backgroundColor: '#1E40AF',  // Darker on press
    transform: [{ scale: 0.98 }],  // Subtle scale feedback
    shadowOpacity: 0.2,      // Reduce shadow when pressed
  },
  startButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 0.3,
  },
  stats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,       // 8px grid: was 12
    padding: 24,            // 8px grid: was 20
    // Multi-layered shadow
    shadowColor: '#1D4ED8',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 32,           // Larger for more impact (was 28)
    fontWeight: '800',      // Extra bold for numbers (was 'bold')
    color: '#1D4ED8',
    marginBottom: 8,        // 8px grid: was 4
  },
  statLabel: {
    fontSize: 12,
    color: '#475569',       // Better contrast
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    fontWeight: '500',      // Added weight
  },
});
