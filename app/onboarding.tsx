/**
 * Onboarding Screen
 * First-time user setup and introduction
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { saveSettings, getSettings } from '../lib/storage';
import { requestPermissions } from '../lib/notifications';
import { initializeNotifications } from '../lib/notifications';

export default function OnboardingScreen() {
  const navigation = useNavigation();
  const [step, setStep] = useState(1);
  const [quizStep, setQuizStep] = useState(1);
  const [q1Answer, setQ1Answer] = useState<string | null>(null);
  const [q2Answer, setQ2Answer] = useState<string | null>(null);
  const [userPath, setUserPath] = useState<'deep_work' | 'overwhelm' | 'burnout'>('deep_work');
  const [reminderTime, setReminderTime] = useState('08:00');
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  const handleQ1Select = (ans: string) => {
    setQ1Answer(ans);
    setQuizStep(2);
  };

  const handleQ2Select = (ans: string) => {
    setQ2Answer(ans);
    const calculated = (q1Answer === 'burnout' || ans === 'burnout')
      ? 'burnout'
      : (q1Answer === 'overwhelm' || ans === 'overwhelm')
      ? 'overwhelm'
      : 'deep_work';
    setUserPath(calculated);
    setStep(3);
  };

  const handleNext = async () => {
    if (step === 1) {
      setStep(2);
      setQuizStep(1);
    } else if (step === 2) {
      if (quizStep === 1) {
        setQuizStep(2);
      } else {
        // Calculate path
        const calculated = (q1Answer === 'burnout' || q2Answer === 'burnout')
          ? 'burnout'
          : (q1Answer === 'overwhelm' || q2Answer === 'overwhelm')
          ? 'overwhelm'
          : 'deep_work';
        setUserPath(calculated);
        setStep(3);
      }
    } else if (step === 3) {
      setStep(4);
    } else {
      await handleComplete();
    }
  };

  const handleBack = () => {
    if (step === 2) {
      if (quizStep === 2) {
        setQuizStep(1);
      } else {
        setStep(1);
      }
    } else if (step === 3) {
      setStep(2);
      setQuizStep(2);
    } else if (step === 4) {
      setStep(3);
    }
  };

  const handleComplete = async () => {
    try {
      // Save settings
      const settings = await getSettings();
      await saveSettings({
        ...settings,
        reminderTime,
        notificationsEnabled,
        userPath,
        currentLevel: 'L1', // Starts at L1 Baseline
      });

      // Initialize notifications if enabled
      if (notificationsEnabled) {
        await requestPermissions();
        await initializeNotifications();
      }

      // Navigate to main app
      navigation.navigate('MainTabs' as never);
    } catch (error) {
      console.error('Error completing onboarding:', error);
      // Still navigate even if there's an error
      navigation.navigate('MainTabs' as never);
    }
  };

  const handleSkip = () => {
    navigation.navigate('MainTabs' as never);
  };

  const getPathTitle = () => {
    if (userPath === 'burnout') return 'Burnout & Brain Fog Path';
    if (userPath === 'overwhelm') return 'Digital Overwhelm Path';
    return 'Deep Work Path';
  };

  const getPathDescription = () => {
    if (userPath === 'burnout') {
      return 'Prioritizes body scans and connection practices to lower high physiological arousal, combat cognitive fatigue, and restore working memory.';
    }
    if (userPath === 'overwhelm') {
      return 'Combines breath reps with meta-awareness training (River of Thought) to build the critical "pause" between digital stimulus and reactive multitasking.';
    }
    return 'Optimized for knowledge workers and students seeking flow. Heavy focus on sustained attention training (Find Your Flashlight) to eliminate attention residue.';
  };

  const getPathResearch = () => {
    if (userPath === 'burnout') {
      return 'Trauma-informed somatic grounding has been shown to reduce baseline anxiety and restore mental stamina without overwhelming the nervous system.';
    }
    if (userPath === 'overwhelm') {
      return 'Differentiating between a thought/alert and the action to pursue it is a research-proven method to lower context-switching stress.';
    }
    return 'Sustained attention training acts as an "attention muscle" workout, protecting working memory capacity against daily fragmentation.';
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
        {step === 1 && (
          <View style={styles.step}>
            <View style={styles.stepPill}>
              <Text style={styles.stepPillText}>Step 1 of 4</Text>
            </View>
            <Text style={styles.title}>Welcome to Focus Reps</Text>
            <Text style={styles.description}>
              Focus Reps is a deliberate-practice "Cognitive Gym" designed to rebuild your attention span using elite, research-backed training methods.
            </Text>
            <Text style={styles.description}>
              Expect 12 minutes of training a day. We train sustained focus, meta-awareness, and rapid distraction recovery.
            </Text>
          </View>
        )}

        {step === 2 && (
          <View style={styles.step}>
            <View style={styles.stepPill}>
              <Text style={styles.stepPillText}>Step 2 of 4 • Attention Profile</Text>
            </View>
            
            {quizStep === 1 ? (
              <View style={styles.quizContainer}>
                <Text style={styles.title}>What is your primary focus challenge?</Text>
                <TouchableOpacity
                  style={[styles.optionCard, q1Answer === 'deep_work' && styles.optionCardSelected]}
                  onPress={() => handleQ1Select('deep_work')}
                >
                  <Text style={[styles.optionCardText, q1Answer === 'deep_work' && styles.optionCardTextSelected]}>
                    Struggling to stay in deep flow, experiencing "attention residue" when switching tasks.
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.optionCard, q1Answer === 'overwhelm' && styles.optionCardSelected]}
                  onPress={() => handleQ1Select('overwhelm')}
                >
                  <Text style={[styles.optionCardText, q1Answer === 'overwhelm' && styles.optionCardTextSelected]}>
                    Constantly distracted by notifications, pings, and the urge to multitask.
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.optionCard, q1Answer === 'burnout' && styles.optionCardSelected]}
                  onPress={() => handleQ1Select('burnout')}
                >
                  <Text style={[styles.optionCardText, q1Answer === 'burnout' && styles.optionCardTextSelected]}>
                    Feeling mentally exhausted, brain-fogged, or close to burnout.
                  </Text>
                </TouchableOpacity>
              </View>
            ) : (
              <View style={styles.quizContainer}>
                <Text style={styles.title}>What is your main training goal?</Text>
                <TouchableOpacity
                  style={[styles.optionCard, q2Answer === 'deep_work' && styles.optionCardSelected]}
                  onPress={() => handleQ2Select('deep_work')}
                >
                  <Text style={[styles.optionCardText, q2Answer === 'deep_work' && styles.optionCardTextSelected]}>
                    Build endurance for long stretches of uninterrupted intellectual work.
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.optionCard, q2Answer === 'overwhelm' && styles.optionCardSelected]}
                  onPress={() => handleQ2Select('overwhelm')}
                >
                  <Text style={[styles.optionCardText, q2Answer === 'overwhelm' && styles.optionCardTextSelected]}>
                    Reclaim the "pause" between an incoming alert and my reaction.
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.optionCard, q2Answer === 'burnout' && styles.optionCardSelected]}
                  onPress={() => handleQ2Select('burnout')}
                >
                  <Text style={[styles.optionCardText, q2Answer === 'burnout' && styles.optionCardTextSelected]}>
                    Lower mental stress, ease anxiety, and restore baseline bandwidth.
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        )}

        {step === 3 && (
          <View style={styles.step}>
            <View style={styles.stepPill}>
              <Text style={styles.stepPillText}>Step 3 of 4 • Your Path</Text>
            </View>
            <Text style={styles.subtitle}>Attention Profile Complete</Text>
            <Text style={styles.pathTitle}>{getPathTitle()}</Text>
            
            <View style={styles.pathCard}>
              <Text style={styles.pathLabel}>Core Training Strategy:</Text>
              <Text style={styles.pathDescText}>{getPathDescription()}</Text>
              
              <Text style={styles.pathLabel}>Research Rationale:</Text>
              <Text style={styles.pathDescText}>{getPathResearch()}</Text>

              <Text style={styles.pathLabel}>Level 1 Starts With:</Text>
              <Text style={styles.boldText}>• Find Your Flashlight (12 min)</Text>
            </View>
          </View>
        )}

        {step === 4 && (
          <View style={styles.step}>
            <View style={styles.stepPill}>
              <Text style={styles.stepPillText}>Step 4 of 4</Text>
            </View>
            <Text style={styles.title}>Set Up Reminders</Text>
            <Text style={styles.description}>
              Sustained attention requires a critical weekly dose. We will help you build this habit with short daily reminders.
            </Text>

            <View style={styles.settingRow}>
              <Text style={styles.settingLabel}>Daily Reminder Time</Text>
              <View style={styles.timeOptions}>
                {['06:00', '08:00', '12:00', '18:00', '20:00'].map((time) => (
                  <TouchableOpacity
                    key={time}
                    style={[
                      styles.timeOption,
                      reminderTime === time && styles.timeOptionSelected,
                    ]}
                    onPress={() => setReminderTime(time)}
                  >
                    <Text
                      style={[
                        styles.timeOptionText,
                        reminderTime === time && styles.timeOptionTextSelected,
                      ]}
                    >
                      {time}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <TouchableOpacity
              style={styles.toggleRow}
              onPress={() => setNotificationsEnabled(!notificationsEnabled)}
            >
              <Text style={styles.settingLabel}>Enable Notifications</Text>
              <View
                style={[
                  styles.toggle,
                  notificationsEnabled && styles.toggleActive,
                ]}
              >
                <View
                  style={[
                    styles.toggleThumb,
                    notificationsEnabled && styles.toggleThumbActive,
                  ]}
                />
              </View>
            </TouchableOpacity>
          </View>
        )}

        <View style={styles.actions}>
          {step > 1 && (
            <TouchableOpacity
              style={styles.backButton}
              onPress={handleBack}
            >
              <Text style={styles.backButtonText}>Back</Text>
            </TouchableOpacity>
          )}
          {step !== 2 && (
            <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
              <Text style={styles.nextButtonText}>
                {step === 4 ? 'Get Started' : 'Next'}
              </Text>
            </TouchableOpacity>
          )}
        </View>

        <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
          <Text style={styles.skipButtonText}>Skip Setup</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 30,
    alignItems: 'center',
    paddingBottom: 60,
  },
  step: {
    alignItems: 'center',
    marginBottom: 20,
    width: '100%',
  },
  stepPill: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    backgroundColor: '#FFFFFF',
    marginBottom: 20,
  },
  stepPillText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#64748B',
    letterSpacing: 0.6,
    textTransform: 'uppercase',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#0F172A',
    marginBottom: 20,
    textAlign: 'center',
    lineHeight: 32,
  },
  subtitle: {
    fontSize: 16,
    color: '#64748B',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  pathTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#1D4ED8',
    marginBottom: 24,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    color: '#475569',
    lineHeight: 24,
    marginBottom: 16,
    textAlign: 'center',
  },
  bold: {
    fontWeight: '600',
    color: '#0F172A',
  },
  quizContainer: {
    width: '100%',
    alignItems: 'center',
  },
  optionCard: {
    width: '100%',
    padding: 18,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#E2E8F0',
    backgroundColor: '#FFFFFF',
    marginBottom: 14,
    shadowColor: '#1D4ED8',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  optionCardSelected: {
    borderColor: '#1D4ED8',
    backgroundColor: '#EFF6FF',
  },
  optionCardText: {
    fontSize: 15,
    color: '#475569',
    lineHeight: 22,
    fontWeight: '500',
  },
  optionCardTextSelected: {
    color: '#1D4ED8',
    fontWeight: '600',
  },
  pathCard: {
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    padding: 20,
    width: '100%',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  pathLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#475569',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginTop: 14,
    marginBottom: 4,
  },
  pathDescText: {
    fontSize: 15,
    color: '#0F172A',
    lineHeight: 22,
  },
  boldText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1D4ED8',
    marginTop: 4,
  },
  settingRow: {
    width: '100%',
    marginTop: 15,
    marginBottom: 20,
  },
  settingLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0F172A',
    marginBottom: 12,
  },
  timeOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  timeOption: {
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#E2E8F0',
    backgroundColor: '#FFFFFF',
  },
  timeOptionSelected: {
    borderColor: '#1D4ED8',
    backgroundColor: '#EFF6FF',
  },
  timeOptionText: {
    fontSize: 15,
    color: '#64748B',
  },
  timeOptionTextSelected: {
    color: '#1D4ED8',
    fontWeight: '600',
  },
  toggleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20,
    width: '100%',
  },
  toggle: {
    width: 50,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#E2E8F0',
    justifyContent: 'center',
    paddingHorizontal: 2,
  },
  toggleActive: {
    backgroundColor: '#1D4ED8',
  },
  toggleThumb: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: '#FFFFFF',
    alignSelf: 'flex-start',
  },
  toggleThumbActive: {
    alignSelf: 'flex-end',
  },
  actions: {
    flexDirection: 'row',
    width: '100%',
    gap: 12,
    marginTop: 20,
  },
  backButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#CBD5E1',
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#64748B',
  },
  nextButton: {
    flex: 2,
    paddingVertical: 14,
    borderRadius: 8,
    backgroundColor: '#1D4ED8',
    alignItems: 'center',
    justifyContent: 'center',
  },
  nextButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  skipButton: {
    marginTop: 30,
    paddingVertical: 10,
  },
  skipButtonText: {
    fontSize: 14,
    color: '#94A3B8',
  },
});

