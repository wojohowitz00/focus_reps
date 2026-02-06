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
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [lapseTimestamps, setLapseTimestamps] = useState<number[]>([]);
  
  const practice = practiceDefinitions[id];
  const instructions = getPracticeInstruction(id);

  const setupSeconds = 90;
  const closingSeconds = 60;
  const totalSeconds = practice?.defaultDuration ? practice.defaultDuration * 60 : 0;
  const practiceSeconds = Math.max(totalSeconds - setupSeconds - closingSeconds, 0);
  const isPracticePhase = elapsedSeconds >= setupSeconds
    && elapsedSeconds < Math.max(totalSeconds - closingSeconds, setupSeconds);

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

  const handleMarkLapse = () => {
    if (!isPracticePhase) {
      return;
    }
    setLapseTimestamps((prev) => {
      const practiceElapsed = Math.max(elapsedSeconds - setupSeconds, 0);
      const last = prev[prev.length - 1];
      if (last === practiceElapsed) {
        return prev;
      }
      return [...prev, practiceElapsed];
    });
  };

  const calculateLongestFocusInterval = () => {
    if (practiceSeconds <= 0) {
      return 0;
    }
    if (lapseTimestamps.length === 0) {
      return practiceSeconds;
    }
    const sorted = [...lapseTimestamps].sort((a, b) => a - b);
    let longest = sorted[0];
    let previous = sorted[0];

    for (let i = 1; i < sorted.length; i++) {
      const interval = sorted[i] - previous;
      if (interval > longest) {
        longest = interval;
      }
      previous = sorted[i];
    }

    const tailInterval = practiceSeconds - previous;
    if (tailInterval > longest) {
      longest = tailInterval;
    }
    return Math.max(0, Math.floor(longest));
  };

  const handleComplete = async () => {
    try {
      const longestFocusIntervalSec = calculateLongestFocusInterval();
      // Save session to storage
      const session: PracticeSession = {
        id: `session-${Date.now()}`,
        practiceType: id,
        date: new Date(),
        duration: practice.defaultDuration,
        scheduledDuration: practice.defaultDuration,
        completed: true,
        lapseCount: lapseTimestamps.length,
        longestFocusIntervalSec,
      };

      await saveSession(session);
      setSessionCompleted(true);
      
      // Navigate to journal entry screen after showing completion
      setTimeout(() => {
        navigation.navigate('SessionCheckIn' as never, {
          sessionId: session.id,
          practiceType: id,
          lapseCount: session.lapseCount,
          longestFocusIntervalSec: session.longestFocusIntervalSec,
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

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Critical Notes</Text>
            <Text style={styles.noteHeading}>This practice is:</Text>
            {instructions.criticalNotes.is.map((note, index) => (
              <Text key={`is-${index}`} style={styles.bulletPoint}>
                • {note}
              </Text>
            ))}
            <Text style={styles.noteHeading}>This practice is not:</Text>
            {instructions.criticalNotes.isNot.map((note, index) => (
              <Text key={`isnot-${index}`} style={styles.bulletPoint}>
                • {note}
              </Text>
            ))}
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Common Pitfalls</Text>
            {instructions.pitfalls.map((pitfall, index) => (
              <View key={pitfall.title + index} style={styles.pitfallCard}>
                <Text style={styles.pitfallTitle}>{pitfall.title}</Text>
                <Text style={styles.pitfallText}>Why: {pitfall.why}</Text>
                <Text style={styles.pitfallText}>Truth: {pitfall.truth}</Text>
                <Text style={styles.pitfallText}>Fix: {pitfall.fix}</Text>
              </View>
            ))}
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Keys to Success</Text>
            {instructions.keysToSuccess.map((key, index) => (
              <Text key={`key-${index}`} style={styles.bulletPoint}>
                • {key}
              </Text>
            ))}
            {instructions.researchNotes ? (
              <Text style={styles.researchText}>Research note: {instructions.researchNotes}</Text>
            ) : null}
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
          onTick={setElapsedSeconds}
          onComplete={handleComplete}
        />
        <View style={styles.lapseRow}>
          <TouchableOpacity
            style={[styles.lapseButton, !isPracticePhase && styles.lapseButtonDisabled]}
            onPress={handleMarkLapse}
            disabled={!isPracticePhase}
          >
            <Text style={styles.lapseButtonText}>Mark Lapse</Text>
          </TouchableOpacity>
          <View style={styles.lapseCount}>
            <Text style={styles.lapseCountLabel}>Lapses</Text>
            <Text style={styles.lapseCountValue}>{lapseTimestamps.length}</Text>
          </View>
        </View>
        {/* Audio player can be added here when audio files are available */}
        {/* <AudioPlayer audioUri={instructions.audioUri} /> */}
      </View>
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
  header: {
    padding: 20,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#0F172A',
    marginBottom: 4,
  },
  duration: {
    fontSize: 16,
    color: '#64748B',
  },
  section: {
    padding: 20,
    backgroundColor: '#FFFFFF',
    marginTop: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#0F172A',
    marginBottom: 12,
  },
  bulletPoint: {
    fontSize: 14,
    color: '#64748B',
    marginBottom: 8,
    lineHeight: 20,
  },
  stepText: {
    fontSize: 14,
    color: '#64748B',
    marginBottom: 12,
    lineHeight: 20,
  },
  noteHeading: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0F172A',
    marginTop: 4,
    marginBottom: 8,
  },
  pitfallCard: {
    backgroundColor: '#F8FAFC',
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
  },
  pitfallTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 6,
  },
  pitfallText: {
    fontSize: 13,
    color: '#64748B',
    lineHeight: 18,
    marginBottom: 4,
  },
  researchText: {
    marginTop: 12,
    fontSize: 13,
    color: '#4b5563',
    lineHeight: 18,
  },
  startButtonContainer: {
    padding: 20,
    marginTop: 20,
    marginBottom: 40,
  },
  startButton: {
    backgroundColor: '#1D4ED8',
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  startButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
  timerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  lapseRow: {
    marginTop: 24,
    alignItems: 'center',
    width: '100%',
  },
  lapseButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#1D4ED8',
    backgroundColor: '#FFFFFF',
    marginBottom: 12,
  },
  lapseButtonDisabled: {
    borderColor: '#ccc',
    opacity: 0.6,
  },
  lapseButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1D4ED8',
  },
  lapseCount: {
    alignItems: 'center',
  },
  lapseCountLabel: {
    fontSize: 12,
    color: '#64748B',
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  lapseCountValue: {
    fontSize: 24,
    fontWeight: '600',
    color: '#0F172A',
  },
  practiceName: {
    fontSize: 24,
    fontWeight: '600',
    color: '#0F172A',
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
    color: '#1D4ED8',
    marginBottom: 20,
    textAlign: 'center',
  },
  completedText: {
    fontSize: 18,
    color: '#64748B',
    textAlign: 'center',
    marginBottom: 12,
    lineHeight: 26,
  },
  errorText: {
    fontSize: 16,
    color: '#B91C1C',
    textAlign: 'center',
    marginTop: 40,
  },
});
