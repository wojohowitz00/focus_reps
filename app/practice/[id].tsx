/**
 * Practice Session Screen
 * Full practice session flow with timer and instructions
 */

import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView, TouchableOpacity } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import Timer from '../../components/Timer';
import AudioPlayer from '../../components/AudioPlayer';
import { getPracticeInstruction } from '../../lib/practiceInstructions';
import { PracticeType, PracticeSession } from '../../types';
import { practiceDefinitions } from '../../lib/practices';
import { saveSession } from '../../lib/storage';

type RouteParams = {
  id: PracticeType;
};

export default function PracticeSessionScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const { id } = (route.params || {}) as RouteParams;
  
  const [sessionStarted, setSessionStarted] = useState(false);
  const [sessionCompleted, setSessionCompleted] = useState(false);
  
  const practice = practiceDefinitions[id];
  const instructions = getPracticeInstruction(id);

  if (!practice || !instructions) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.errorText}>Practice not found</Text>
      </SafeAreaView>
    );
  }

  const handleStart = () => {
    setSessionStarted(true);
  };

  const handleComplete = async () => {
    try {
      // Save session to storage
      const session: PracticeSession = {
        id: `session-${Date.now()}`,
        practiceType: id,
        date: new Date(),
        duration: practice.defaultDuration,
        scheduledDuration: practice.defaultDuration,
        completed: true,
      };

      await saveSession(session);
      setSessionCompleted(true);
      
      // Navigate to journal entry screen after showing completion
      setTimeout(() => {
        navigation.navigate('JournalEntry' as never, {
          sessionId: session.id,
          practiceType: id,
        } as never);
      }, 2000);
    } catch (error) {
      console.error('Error saving session:', error);
      // Still show completion even if save fails
      setSessionCompleted(true);
    }
  };

  if (sessionCompleted) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.completedContainer}>
          <Text style={styles.completedTitle}>Practice Complete! 🎉</Text>
          <Text style={styles.completedText}>
            Great job completing your {practice.name} practice.
          </Text>
          <Text style={styles.completedText}>
            Take a moment to reflect on your experience.
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!sessionStarted) {
    return (
      <SafeAreaView style={styles.container}>
        <ScrollView style={styles.scrollView}>
          <View style={styles.header}>
            <Text style={styles.title}>{practice.name}</Text>
            <Text style={styles.duration}>{practice.defaultDuration} minutes</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>What You're Training</Text>
            {instructions.whatYoureTraining.map((item, index) => (
              <Text key={index} style={styles.bulletPoint}>
                • {item}
              </Text>
            ))}
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Setup</Text>
            {instructions.setup.map((step, index) => (
              <Text key={index} style={styles.stepText}>
                {index + 1}. {step}
              </Text>
            ))}
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Practice Steps</Text>
            {instructions.practiceSteps.map((step, index) => (
              <Text key={index} style={styles.stepText}>
                {index + 1}. {step}
              </Text>
            ))}
          </View>

          <View style={styles.startButtonContainer}>
            <TouchableOpacity
              style={styles.startButton}
              onPress={handleStart}
            >
              <Text style={styles.startButtonText}>Start Practice</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.timerContainer}>
        <Text style={styles.practiceName}>{practice.name}</Text>
        <Timer
          duration={practice.defaultDuration}
          onComplete={handleComplete}
        />
        {/* Audio player can be added here when audio files are available */}
        {/* <AudioPlayer audioUri={instructions.audioUri} /> */}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    padding: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  duration: {
    fontSize: 16,
    color: '#666',
  },
  section: {
    padding: 20,
    backgroundColor: '#fff',
    marginTop: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  bulletPoint: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
    lineHeight: 20,
  },
  stepText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
    lineHeight: 20,
  },
  startButtonContainer: {
    padding: 20,
    marginTop: 20,
    marginBottom: 40,
  },
  startButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  startButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  timerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  practiceName: {
    fontSize: 24,
    fontWeight: '600',
    color: '#333',
    marginBottom: 40,
  },
  completedContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  completedTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginBottom: 20,
    textAlign: 'center',
  },
  completedText: {
    fontSize: 18,
    color: '#666',
    textAlign: 'center',
    marginBottom: 12,
    lineHeight: 26,
  },
  errorText: {
    fontSize: 16,
    color: '#f44336',
    textAlign: 'center',
    marginTop: 40,
  },
});
