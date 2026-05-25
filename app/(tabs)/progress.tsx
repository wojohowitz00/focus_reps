/**
 * Progress Tracking Screen
 * Shows user's practice statistics and progress
 */

import { View, Text, StyleSheet, ScrollView, Pressable, Dimensions } from 'react-native';
import { useEffect, useState } from 'react';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import Svg, { Circle } from 'react-native-svg';
import { calculateAllProgress, getWeeklyStats, checkMilestones, getWeeklySummary } from '../../lib/progress';
import { UserProgress, Milestone } from '../../types';
import { getSettings } from '../../lib/storage';

export default function ProgressScreen() {
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const [progress, setProgress] = useState<UserProgress | null>(null);
  const [weeklyStats, setWeeklyStats] = useState<any>(null);
  const [milestones, setMilestones] = useState<Milestone[]>([]);

  useEffect(() => {
    if (isFocused) {
      loadProgress();
    }
  }, [isFocused]);

  const loadProgress = async () => {
    try {
      const settings = await getSettings();
      const startDate = settings?.programStartDate
        ? new Date(settings.programStartDate)
        : new Date();
      const programMode = settings?.programMode ?? 'standard_6_week';

      const progressData = await calculateAllProgress(startDate);
      setProgress(progressData);

      const weekly = await getWeeklyStats(startDate, programMode);
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

      <ScrollView style={styles.content} contentContainerStyle={{ paddingBottom: 40 }}>
        {/* Resilience Shield Card (Bandwidth Meter) */}
        <View style={styles.shieldCard}>
          <Text style={styles.shieldCardTitle}>Resilience Shield</Text>
          <View style={styles.shieldRow}>
            <View style={styles.shieldSvgContainer}>
              <Svg width={96} height={96}>
                <Circle
                  cx={48}
                  cy={48}
                  r={42}
                  stroke="#E2E8F0"
                  strokeWidth={6}
                  fill="transparent"
                />
                <Circle
                  cx={48}
                  cy={48}
                  r={42}
                  stroke={progress.resilienceShield && progress.resilienceShield >= 80 ? '#10B981' : progress.resilienceShield && progress.resilienceShield >= 50 ? '#2563EB' : '#EF4444'}
                  strokeWidth={6}
                  fill="transparent"
                  strokeDasharray={2 * Math.PI * 42}
                  strokeDashoffset={2 * Math.PI * 42 * (1 - (progress.resilienceShield || 0) / 100)}
                  strokeLinecap="round"
                  transform="rotate(-90 48 48)"
                />
              </Svg>
              <View style={styles.shieldTextContainer}>
                <Text style={[styles.shieldPercent, { color: progress.resilienceShield && progress.resilienceShield >= 80 ? '#10B981' : progress.resilienceShield && progress.resilienceShield >= 50 ? '#2563EB' : '#EF4444' }]}>
                  {progress.resilienceShield || 0}%
                </Text>
              </View>
            </View>
            <View style={styles.shieldInfo}>
              <Text style={styles.shieldStatusTitle}>
                {progress.resilienceShield && progress.resilienceShield >= 80 ? 'Shield Fully Active' : progress.resilienceShield && progress.resilienceShield >= 50 ? 'Shield Charging' : 'Shield Vulnerable'}
              </Text>
              <Text style={styles.shieldStatusDesc}>
                Each unique training day in the last 7 days charges your shield by 20%. Keep it above 80% to protect working memory.
              </Text>
            </View>
          </View>
        </View>

        {/* Cognitive Gym Status Card (Path & Levels) */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Cognitive Gym Status</Text>
          <View style={styles.statusGrid}>
            <View style={styles.statusBox}>
              <Text style={styles.statusBoxLabel}>Attention Path</Text>
              <Text style={styles.statusBoxValue}>
                {progress.settings.userPath === 'deep_work' ? 'Deep Work' : progress.settings.userPath === 'overwhelm' ? 'Digital Overwhelm' : progress.settings.userPath === 'burnout' ? 'Burnout / Fog' : 'Standard'}
              </Text>
            </View>
            <View style={styles.statusBox}>
              <Text style={styles.statusBoxLabel}>Active Level</Text>
              <Text style={[styles.statusBoxValue, styles.activeLevelText]}>
                {progress.settings.currentLevel || 'L1'}
              </Text>
            </View>
          </View>
          <Text style={styles.levelUnlockDesc}>
            {progress.settings.currentLevel === 'L3' ? '🎉 Level 3 Mastery: Custom rotations and all core/advanced practices fully unlocked!' : progress.settings.currentLevel === 'L2' ? '⭐ Level 2 Expansion: River of Thought & Connection Practices are unlocked. Complete >= 6 days in a rolling week for Level 3.' : '🔒 Level 1 Baseline: Find Your Flashlight & Body Scan unlocked. Complete >= 5 days in a rolling week to unlock Level 2.'}
          </Text>
        </View>

        {/* SART-Lite Focus Test Card */}
        <View style={styles.card}>
          <View style={styles.sartHeader}>
            <Text style={styles.cardTitle}>Focus Test (SART-Lite)</Text>
            <Pressable
              style={({ pressed }) => [
                styles.sartBtn,
                pressed && styles.sartBtnPressed
              ]}
              onPress={() => navigation.navigate('SartTest' as never)}
            >
              <Text style={styles.sartBtnText}>Take Test</Text>
            </Pressable>
          </View>

          {progress.sartHistory && progress.sartHistory.length > 0 ? (
            <View style={styles.sartResult}>
              <View style={styles.sartMainScore}>
                <Text style={styles.sartScoreVal}>
                  {progress.sartHistory[progress.sartHistory.length - 1].focusScore}%
                </Text>
                <Text style={styles.sartScoreLbl}>Latest Focus Score</Text>
              </View>
              <View style={styles.sartDetailsRow}>
                <View style={styles.sartDetailItem}>
                  <Text style={styles.sartDetailNum}>{progress.sartHistory[progress.sartHistory.length - 1].lapses}</Text>
                  <Text style={styles.sartDetailLbl}>Lapses</Text>
                </View>
                <View style={styles.sartDetailItem}>
                  <Text style={styles.sartDetailNum}>{progress.sartHistory[progress.sartHistory.length - 1].misses}</Text>
                  <Text style={styles.sartDetailLbl}>Misses</Text>
                </View>
                <View style={styles.sartDetailItem}>
                  <Text style={styles.sartDetailNum}>{progress.sartHistory[progress.sartHistory.length - 1].avgReactionTimeMs}ms</Text>
                  <Text style={styles.sartDetailLbl}>Speed</Text>
                </View>
              </View>
              <Text style={styles.sartDate}>
                Tested on {new Date(progress.sartHistory[progress.sartHistory.length - 1].date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
              </Text>
            </View>
          ) : (
            <View style={styles.sartPlaceholder}>
              <Text style={styles.sartPlaceholderText}>No focus score recorded yet.</Text>
              <Text style={styles.sartPlaceholderSub}>Take a 60-second reaction-time test to measure your attentional lapses objectively.</Text>
            </View>
          )}
        </View>

        {/* Overview Card */}
        <View style={styles.statsCard}>
          <Text style={styles.cardTitle}>Cumulative Overview</Text>
          
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

        <Pressable
          style={({ pressed }) => [
            styles.historyButton,
            pressed && styles.historyButtonPressed
          ]}
          onPress={() => navigation.navigate('PracticeHistory' as never)}
        >
          <Text style={styles.historyButtonText}>View Practice History</Text>
        </Pressable>

        <Pressable
          style={({ pressed }) => [
            styles.reviewButton,
            pressed && styles.reviewButtonPressed
          ]}
          onPress={() => navigation.navigate('WeeklyReview' as never)}
        >
          <Text style={styles.reviewButtonText}>View Weekly Review</Text>
        </Pressable>
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
    paddingTop: 64,        // 8px grid
    paddingHorizontal: 24,  // 8px grid
    paddingBottom: 24,      // 8px grid
    backgroundColor: '#FFFFFF',
    shadowColor: '#1D4ED8',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 8,        // 8px grid
  },
  subtitle: {
    fontSize: 16,
    color: '#475569',       // Better contrast
    fontWeight: '400',
  },
  content: {
    flex: 1,
    padding: 24,            // 8px grid
  },
  statsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,       // 8px grid
    padding: 24,            // 8px grid
    marginBottom: 24,       // 8px grid
    shadowColor: '#1D4ED8',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,       // 8px grid
    padding: 24,            // 8px grid
    marginBottom: 24,       // 8px grid
    shadowColor: '#1D4ED8',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',      // Bolder
    color: '#0F172A',
    marginBottom: 16,
    letterSpacing: 0.3,
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
    backgroundColor: '#F8FAFC',
    borderRadius: 8,
    marginHorizontal: 8,    // 8px grid: was 4
  },
  statValue: {
    fontSize: 32,
    fontWeight: '800',      // Extra bold
    color: '#1D4ED8',
    marginBottom: 8,        // 8px grid
  },
  statLabel: {
    fontSize: 12,
    color: '#475569',       // Better contrast
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    fontWeight: '500',
  },
  placeholder: {
    color: '#64748B',       // Better contrast
    fontStyle: 'italic',
    fontSize: 14,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  loadingText: {
    fontSize: 16,
    color: '#475569',       // Better contrast
  },
  weeklyStats: {
    marginTop: 8,
  },
  weeklyText: {
    fontSize: 14,
    color: '#475569',       // Better contrast
    marginBottom: 8,
    fontWeight: '400',
  },
  progressBar: {
    height: 8,
    backgroundColor: '#E2E8F0',
    borderRadius: 8,        // 8px grid
    marginTop: 8,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#1D4ED8',
    borderRadius: 8,        // 8px grid
  },
  milestoneItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
    padding: 16,            // 8px grid
    backgroundColor: '#F8FAFC',
    borderRadius: 8,
  },
  milestoneIcon: {
    fontSize: 24,
    color: '#1D4ED8',
    marginRight: 16,        // 8px grid
  },
  milestoneContent: {
    flex: 1,
  },
  milestoneName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0F172A',
    marginBottom: 8,        // 8px grid
  },
  milestoneDescription: {
    fontSize: 14,
    color: '#475569',       // Better contrast
    lineHeight: 20,
  },
  streakValue: {
    fontSize: 40,           // Larger for impact
    fontWeight: '800',      // Extra bold
    color: '#1D4ED8',
    marginTop: 8,
  },
  historyButton: {
    backgroundColor: '#1D4ED8',
    paddingVertical: 16,    // Accessibility
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
    minHeight: 48,
    justifyContent: 'center',
    marginTop: 16,          // 8px grid
    marginBottom: 16,       // 8px grid
    shadowColor: '#1D4ED8',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  historyButtonPressed: {
    backgroundColor: '#1E40AF',
    transform: [{ scale: 0.98 }],
    shadowOpacity: 0.2,
  },
  historyButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 0.3,
  },
  reviewButton: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 16,    // Accessibility
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
    minHeight: 48,
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#1D4ED8',
    marginBottom: 40,
  },
  reviewButtonPressed: {
    backgroundColor: '#F8FAFC',
    transform: [{ scale: 0.98 }],
  },
  reviewButtonText: {
    color: '#1D4ED8',
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 0.3,
  },
  shieldCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    marginBottom: 24,
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#EFF6FF',
  },
  shieldCardTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 16,
    letterSpacing: 0.3,
  },
  shieldRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
  },
  shieldSvgContainer: {
    position: 'relative',
    width: 96,
    height: 96,
    justifyContent: 'center',
    alignItems: 'center',
  },
  shieldTextContainer: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
  shieldPercent: {
    fontSize: 24,
    fontWeight: '800',
  },
  shieldInfo: {
    flex: 1,
  },
  shieldStatusTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 4,
  },
  shieldStatusDesc: {
    fontSize: 13,
    color: '#64748B',
    lineHeight: 18,
  },
  statusGrid: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 14,
  },
  statusBoxLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#64748B',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  statusBoxValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
  },
  activeLevelText: {
    color: '#2563EB',
  },
  levelUnlockDesc: {
    fontSize: 13,
    color: '#475569',
    lineHeight: 18,
    backgroundColor: '#F8FAFC',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  sartHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sartBtn: {
    backgroundColor: '#2563EB',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  sartBtnPressed: {
    backgroundColor: '#1D4ED8',
    opacity: 0.9,
  },
  sartBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '600',
  },
  sartResult: {
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  sartMainScore: {
    alignItems: 'center',
    marginBottom: 12,
  },
  sartScoreVal: {
    fontSize: 36,
    fontWeight: '800',
    color: '#2563EB',
  },
  sartScoreLbl: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  sartDetailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#E2E8F0',
    paddingVertical: 10,
    marginBottom: 10,
  },
  sartDetailItem: {
    alignItems: 'center',
  },
  sartDetailNum: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
  },
  sartDetailLbl: {
    fontSize: 10,
    color: '#64748B',
    textTransform: 'uppercase',
  },
  sartDate: {
    fontSize: 11,
    color: '#94A3B8',
  },
  sartPlaceholder: {
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  sartPlaceholderText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#475569',
    marginBottom: 4,
  },
  sartPlaceholderSub: {
    fontSize: 12,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 16,
  },
  bold: {
    fontWeight: '700',
    color: '#0F172A',
  },
});
