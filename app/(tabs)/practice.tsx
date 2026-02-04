/**
 * Practice Selection Screen
 * Shows available practices and schedule
 */

import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useEffect, useState } from 'react';
import { getTodayPractice, practiceDefinitions } from '../../lib/practices';
import { PracticeType } from '../../types';
import { getSettings } from '../../lib/storage';

export default function PracticeScreen() {
  const navigation = useNavigation();
  const [recommendedPractice, setRecommendedPractice] = useState<PracticeType>('anchor-breath');
  const [programLabel, setProgramLabel] = useState('6-Week Standard');

  useEffect(() => {
    loadRecommendation();
  }, []);

  const loadRecommendation = async () => {
    try {
      const settings = await getSettings();
      const startDate = settings?.programStartDate
        ? new Date(settings.programStartDate)
        : new Date();
      const programMode = settings?.programMode ?? 'standard_6_week';
      const customPracticeSet = settings?.customPracticeSet;
      const recommended = getTodayPractice(startDate, programMode, customPracticeSet);
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
          <TouchableOpacity
            style={styles.recommendedButton}
            onPress={() => handlePracticeSelect(recommendedPractice)}
          >
            <Text style={styles.recommendedButtonText}>Start Recommended</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.sectionLabel}>All Practices</Text>
        {Object.values(practiceDefinitions).map((practice) => (
          <TouchableOpacity
            key={practice.id}
            style={styles.practiceCard}
            onPress={() => handlePracticeSelect(practice.id)}
          >
            <View style={styles.practiceInfo}>
              <Text style={styles.practiceName}>{practice.name}</Text>
              <Text style={styles.practiceDescription}>{practice.description}</Text>
              <Text style={styles.practiceDuration}>{practice.defaultDuration} minutes</Text>
            </View>
            <Text style={styles.arrow}>→</Text>
          </TouchableOpacity>
        ))}
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
  recommendedCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
  },
  recommendedLabel: {
    fontSize: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
    color: '#666',
    marginBottom: 8,
  },
  recommendedTitle: {
    fontSize: 22,
    fontWeight: '600',
    color: '#333',
    marginBottom: 6,
  },
  recommendedDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 10,
  },
  recommendedMeta: {
    fontSize: 12,
    color: '#999',
    marginBottom: 16,
  },
  recommendedButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  recommendedButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  sectionLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  practiceCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  practiceInfo: {
    flex: 1,
  },
  practiceName: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  practiceDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  practiceDuration: {
    fontSize: 12,
    color: '#999',
  },
  arrow: {
    fontSize: 24,
    color: '#4CAF50',
    marginLeft: 16,
  },
});
