/**
 * Progress Tracking Screen
 * Shows user's practice statistics and progress
 */

import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useEffect, useState } from 'react';
import { calculateAllProgress, getWeeklyStats, checkMilestones } from '../../lib/progress';
import { UserProgress, Milestone } from '../../types';

export default function ProgressScreen() {
  const [progress, setProgress] = useState<UserProgress | null>(null);
  const [weeklyStats, setWeeklyStats] = useState<any>(null);
  const [milestones, setMilestones] = useState<Milestone[]>([]);

  useEffect(() => {
    loadProgress();
  }, []);

  const loadProgress = async () => {
    try {
      // Use a default start date (could be stored in settings)
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - 14); // 2 weeks ago

      const progressData = await calculateAllProgress(startDate);
      setProgress(progressData);

      const weekly = await getWeeklyStats(startDate);
      setWeeklyStats(weekly);

      const milestoneData = await checkMilestones(progressData);
      setMilestones(milestoneData);
    } catch (error) {
      console.error('Error loading progress:', error);
    }
  };

  if (!progress) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Progress</Text>
          <Text style={styles.subtitle}>Your practice journey</Text>
        </View>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading progress...</Text>
        </View>
      </View>
    );
  }

  const achievedMilestones = milestones.filter((m) => m.achieved);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Progress</Text>
        <Text style={styles.subtitle}>Your practice journey</Text>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.statsCard}>
          <Text style={styles.cardTitle}>Overview</Text>
          
          <View style={styles.statRow}>
            <View style={styles.statBox}>
              <Text style={styles.statValue}>{progress.currentStreak}</Text>
              <Text style={styles.statLabel}>Day Streak</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statValue}>{progress.totalSessions}</Text>
              <Text style={styles.statLabel}>Total Sessions</Text>
            </View>
          </View>

          <View style={styles.statRow}>
            <View style={styles.statBox}>
              <Text style={styles.statValue}>{progress.totalMinutes}</Text>
              <Text style={styles.statLabel}>Minutes</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statValue}>Week {progress.currentWeek}</Text>
              <Text style={styles.statLabel}>Current Week</Text>
            </View>
          </View>
        </View>

        {weeklyStats && (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>This Week</Text>
            <View style={styles.weeklyStats}>
              <Text style={styles.weeklyText}>
                Days Completed: {weeklyStats.daysCompleted} / {weeklyStats.goalDays}
              </Text>
              <Text style={styles.weeklyText}>
                Minutes This Week: {weeklyStats.totalMinutes}
              </Text>
              <View style={styles.progressBar}>
                <View
                  style={[
                    styles.progressFill,
                    { width: `${(weeklyStats.daysCompleted / weeklyStats.goalDays) * 100}%` },
                  ]}
                />
              </View>
            </View>
          </View>
        )}

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Milestones</Text>
          {achievedMilestones.length > 0 ? (
            achievedMilestones.map((milestone) => (
              <View key={milestone.id} style={styles.milestoneItem}>
                <Text style={styles.milestoneIcon}>✓</Text>
                <View style={styles.milestoneContent}>
                  <Text style={styles.milestoneName}>{milestone.name}</Text>
                  <Text style={styles.milestoneDescription}>{milestone.description}</Text>
                </View>
              </View>
            ))
          ) : (
            <Text style={styles.placeholder}>Keep practicing to unlock milestones!</Text>
          )}
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Longest Streak</Text>
          <Text style={styles.streakValue}>{progress.longestStreak} days</Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  statsCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  card: {
    backgroundColor: '#fff',
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
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 16,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  statBox: {
    flex: 1,
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    marginHorizontal: 4,
  },
  statValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  placeholder: {
    color: '#999',
    fontStyle: 'italic',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  loadingText: {
    fontSize: 16,
    color: '#666',
  },
  weeklyStats: {
    marginTop: 8,
  },
  weeklyText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  progressBar: {
    height: 8,
    backgroundColor: '#e0e0e0',
    borderRadius: 4,
    marginTop: 8,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#4CAF50',
    borderRadius: 4,
  },
  milestoneItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
    padding: 12,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
  },
  milestoneIcon: {
    fontSize: 24,
    color: '#4CAF50',
    marginRight: 12,
  },
  milestoneContent: {
    flex: 1,
  },
  milestoneName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  milestoneDescription: {
    fontSize: 14,
    color: '#666',
  },
  streakValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginTop: 8,
  },
});
