/**
 * Home Screen
 * Main dashboard showing today's practice and quick stats
 */

import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useNavigation } from '@react-navigation/native';
import { useEffect, useState } from 'react';
import { getTodayPractice } from '../../lib/practices';
import { calculateAllProgress } from '../../lib/progress';
import { UserProgress } from '../../types';
import { practiceDefinitions } from '../../lib/practices';
import { getSettings } from '../../lib/storage';

export default function HomeScreen() {
  const navigation = useNavigation();
  const [progress, setProgress] = useState<UserProgress | null>(null);
  const [todayPractice, setTodayPractice] = useState<string>('anchor-breath');

  useEffect(() => {
    loadData();
  }, []);

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

      const practice = getTodayPractice(startDate, programMode, customPracticeSet);
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
          
          <TouchableOpacity
            style={styles.startButton}
            onPress={() => navigation.navigate('PracticeSession' as never, { id: todayPractice } as never)}
          >
            <Text style={styles.startButtonText}>Start Practice</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.stats}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{progress?.currentStreak || 0}</Text>
            <Text style={styles.statLabel}>Day Streak</Text>
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
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
    backgroundColor: '#FFFFFF',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#0F172A',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#64748B',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 14,
    color: '#64748B',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  practiceName: {
    fontSize: 24,
    fontWeight: '600',
    color: '#0F172A',
    marginBottom: 4,
  },
  practiceDuration: {
    fontSize: 16,
    color: '#64748B',
    marginBottom: 20,
  },
  startButton: {
    backgroundColor: '#1D4ED8',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
  },
  startButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  stats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1D4ED8',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#64748B',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
});
