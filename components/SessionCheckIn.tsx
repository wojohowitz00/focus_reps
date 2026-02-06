/**
 * Session Check-In Component
 * Post-session survey for focus quality, mood, stress, and energy
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import { PracticeType } from '../types';

interface SessionCheckInProps {
  sessionId: string;
  practiceType?: PracticeType;
  initialLapseCount?: number;
  onSave: (data: {
    focusQuality: number;
    mood: number;
    stress: number;
    energy: number;
    lapseCount: number;
  }) => void;
  onSkip?: () => void;
}

const RATING_OPTIONS = [1, 2, 3, 4, 5];

const METRICS = [
  { key: 'focusQuality', label: 'Focus Quality', left: 'Scattered', right: 'Steady' },
  { key: 'mood', label: 'Mood', left: 'Low', right: 'High' },
  { key: 'stress', label: 'Stress', left: 'Calm', right: 'High' },
  { key: 'energy', label: 'Energy', left: 'Low', right: 'High' },
] as const;

type MetricKey = typeof METRICS[number]['key'];

export default function SessionCheckIn({
  sessionId,
  practiceType,
  initialLapseCount,
  onSave,
  onSkip,
}: SessionCheckInProps) {
  const [ratings, setRatings] = useState<Record<MetricKey, number>>({
    focusQuality: 3,
    mood: 3,
    stress: 3,
    energy: 3,
  });
  const [lapseCount, setLapseCount] = useState(
    initialLapseCount !== undefined ? String(initialLapseCount) : '0'
  );

  const handleRatingChange = (key: MetricKey, value: number) => {
    setRatings((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = () => {
    const parsedLapses = Number.parseInt(lapseCount, 10);
    onSave({
      focusQuality: ratings.focusQuality,
      mood: ratings.mood,
      stress: ratings.stress,
      energy: ratings.energy,
      lapseCount: Number.isNaN(parsedLapses) ? 0 : parsedLapses,
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>Session Check-In</Text>
          <Text style={styles.subtitle}>Quick ratings to track your progress</Text>
          {practiceType && (
            <Text style={styles.practiceLabel}>
              {practiceType.replace(/-/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase())}
            </Text>
          )}
        </View>

        {METRICS.map((metric) => (
          <View key={metric.key} style={styles.metricCard}>
            <Text style={styles.metricTitle}>{metric.label}</Text>
            <View style={styles.metricScale}>
              <Text style={styles.metricAnchor}>{metric.left}</Text>
              <Text style={styles.metricAnchor}>{metric.right}</Text>
            </View>
            <View style={styles.ratingRow}>
              {RATING_OPTIONS.map((value) => (
                <TouchableOpacity
                  key={value}
                  style={[
                    styles.ratingButton,
                    ratings[metric.key] === value && styles.ratingButtonSelected,
                  ]}
                  onPress={() => handleRatingChange(metric.key, value)}
                >
                  <Text
                    style={[
                      styles.ratingButtonText,
                      ratings[metric.key] === value && styles.ratingButtonTextSelected,
                    ]}
                  >
                    {value}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        ))}

        <View style={styles.metricCard}>
          <Text style={styles.metricTitle}>Lapse Count</Text>
          <Text style={styles.metricHelper}>Estimated number of times your attention drifted</Text>
          <TextInput
            style={styles.lapseInput}
            keyboardType="numeric"
            value={lapseCount}
            onChangeText={setLapseCount}
            placeholder="0"
          />
        </View>

        <View style={styles.actions}>
          {onSkip && (
            <TouchableOpacity style={styles.skipButton} onPress={onSkip}>
              <Text style={styles.skipButtonText}>Skip</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <Text style={styles.saveButtonText}>Save & Continue</Text>
          </TouchableOpacity>
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
    marginBottom: 6,
  },
  practiceLabel: {
    fontSize: 14,
    color: '#1D4ED8',
    fontWeight: '600',
  },
  metricCard: {
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
  metricTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0F172A',
    marginBottom: 6,
  },
  metricHelper: {
    fontSize: 12,
    color: '#64748B',
    marginBottom: 10,
  },
  metricScale: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  metricAnchor: {
    fontSize: 12,
    color: '#94A3B8',
  },
  ratingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  ratingButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 2,
    borderColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },
  ratingButtonSelected: {
    borderColor: '#1D4ED8',
    backgroundColor: '#E8EEFF',
  },
  ratingButtonText: {
    fontSize: 16,
    color: '#64748B',
    fontWeight: '600',
  },
  ratingButtonTextSelected: {
    color: '#1D4ED8',
  },
  lapseInput: {
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    color: '#0F172A',
    backgroundColor: '#F8FAFC',
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 10,
  },
  skipButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#CBD5E1',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  skipButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#64748B',
  },
  saveButton: {
    flex: 2,
    paddingVertical: 14,
    borderRadius: 8,
    backgroundColor: '#1D4ED8',
    alignItems: 'center',
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});
