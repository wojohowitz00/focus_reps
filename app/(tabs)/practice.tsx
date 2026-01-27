/**
 * Practice Selection Screen
 * Shows available practices and schedule
 */

import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { practiceDefinitions } from '../../lib/practices';
import { PracticeType } from '../../types';

export default function PracticeScreen() {
  const router = useRouter();

  const handlePracticeSelect = (practiceType: PracticeType) => {
    router.push(`/practice/${practiceType}`);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Practices</Text>
        <Text style={styles.subtitle}>Choose your practice</Text>
      </View>

      <ScrollView style={styles.content}>
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
