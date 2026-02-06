/**
 * Weekly Review Component
 * Presents weekly summary metrics and recommendation
 */

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import { WeeklySummary, WeeklyRecommendation, PracticeType } from '../types';
import { practiceDefinitions } from '../lib/practices';

interface WeeklyReviewProps {
  summary: WeeklySummary;
  recommendation: WeeklyRecommendation;
  onStartPractice?: (practiceType: PracticeType) => void;
}

export default function WeeklyReview({
  summary,
  recommendation,
  onStartPractice,
}: WeeklyReviewProps) {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>Weekly Review</Text>
          <Text style={styles.subtitle}>Your progress this week</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Focus Metrics</Text>
          <View style={styles.metricRow}>
            <View style={styles.metricBox}>
              <Text style={styles.metricValue}>{summary.totalMinutes}</Text>
              <Text style={styles.metricLabel}>Minutes</Text>
            </View>
            <View style={styles.metricBox}>
              <Text style={styles.metricValue}>
                {Math.round(summary.longestIntervalSec / 60)}m
              </Text>
              <Text style={styles.metricLabel}>Longest Interval</Text>
            </View>
          </View>
          <View style={styles.metricRow}>
            <View style={styles.metricBox}>
              <Text style={styles.metricValue}>{summary.sessionsCount}</Text>
              <Text style={styles.metricLabel}>Sessions</Text>
            </View>
            <View style={styles.metricBox}>
              <Text style={styles.metricValue}>{summary.avgLapses.toFixed(1)}</Text>
              <Text style={styles.metricLabel}>Avg Lapses</Text>
            </View>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Journal Highlights</Text>
          {summary.journalHighlights.length === 0 ? (
            <Text style={styles.placeholder}>No journal entries this week yet.</Text>
          ) : (
            summary.journalHighlights.map((entry) => (
              <View key={entry.id} style={styles.highlightItem}>
                <Text style={styles.highlightDate}>
                  {new Date(entry.date).toLocaleDateString()}
                </Text>
                <Text style={styles.highlightText} numberOfLines={3}>
                  {entry.content}
                </Text>
              </View>
            ))
          )}
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Recommended Next Practice</Text>
          <Text style={styles.recommendationTitle}>
            {practiceDefinitions[recommendation.practiceType].name}
          </Text>
          <Text style={styles.recommendationText}>{recommendation.rationale}</Text>
          {onStartPractice && (
            <TouchableOpacity
              style={styles.primaryButton}
              onPress={() => onStartPractice(recommendation.practiceType)}
            >
              <Text style={styles.primaryButtonText}>Start Practice</Text>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#0F172A',
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 14,
    color: '#64748B',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0F172A',
    marginBottom: 12,
  },
  metricRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  metricBox: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12,
    marginHorizontal: 4,
    backgroundColor: '#F8FAFC',
    borderRadius: 8,
  },
  metricValue: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1D4ED8',
  },
  metricLabel: {
    fontSize: 12,
    color: '#64748B',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  placeholder: {
    fontSize: 14,
    color: '#94A3B8',
    fontStyle: 'italic',
  },
  highlightItem: {
    marginBottom: 12,
  },
  highlightDate: {
    fontSize: 12,
    color: '#94A3B8',
    marginBottom: 4,
  },
  highlightText: {
    fontSize: 14,
    color: '#0F172A',
  },
  recommendationTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#0F172A',
    marginBottom: 6,
  },
  recommendationText: {
    fontSize: 14,
    color: '#64748B',
    marginBottom: 12,
  },
  primaryButton: {
    backgroundColor: '#1D4ED8',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  primaryButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});
