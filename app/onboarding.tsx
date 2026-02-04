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
  const [reminderTime, setReminderTime] = useState('08:00');
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  const handleNext = async () => {
    if (step < 3) {
      setStep(step + 1);
    } else {
      await handleComplete();
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

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
        {step === 1 && (
          <View style={styles.step}>
            <Text style={styles.emoji}>🧘</Text>
            <Text style={styles.title}>Welcome to Focus Reps</Text>
            <Text style={styles.description}>
              Focus Reps is deliberate-practice training for attention. You will do
              short daily reps, track focus quality, and review progress each week.
            </Text>
            <Text style={styles.description}>
              Expect 12 minutes a day, five days a week. Each return to focus is a rep
              that builds stability and recovery speed.
            </Text>
          </View>
        )}

        {step === 2 && (
          <View style={styles.step}>
            <Text style={styles.emoji}>📅</Text>
            <Text style={styles.title}>Your Training Loop</Text>
            <Text style={styles.description}>
              <Text style={styles.bold}>Week 1:</Text> Anchor Breath
            </Text>
            <Text style={styles.description}>
              <Text style={styles.bold}>Week 2:</Text> Add Body Sweep
            </Text>
            <Text style={styles.description}>
              <Text style={styles.bold}>Week 3:</Text> Add Thought Traffic
            </Text>
            <Text style={styles.description}>
              <Text style={styles.bold}>Week 4:</Text> Add Kindness Circuit
            </Text>
            <Text style={styles.description}>
              <Text style={styles.bold}>Weeks 5-6:</Text> Customize and continue
            </Text>
            <Text style={styles.description}>
              Daily practice → quick check-in → weekly review. The goal is steady
              improvement, not perfection.
            </Text>
          </View>
        )}

        {step === 3 && (
          <View style={styles.step}>
            <Text style={styles.emoji}>⚙️</Text>
            <Text style={styles.title}>Set Up Reminders</Text>
            <Text style={styles.description}>
              We will remind you to practice daily. You can change this later in settings.
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
              onPress={() => setStep(step - 1)}
            >
              <Text style={styles.backButtonText}>Back</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
            <Text style={styles.nextButtonText}>
              {step === 3 ? 'Get Started' : 'Next'}
            </Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
          <Text style={styles.skipButtonText}>Skip</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 30,
    alignItems: 'center',
  },
  step: {
    alignItems: 'center',
    marginBottom: 40,
  },
  emoji: {
    fontSize: 64,
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    color: '#666',
    lineHeight: 24,
    marginBottom: 12,
    textAlign: 'center',
  },
  bold: {
    fontWeight: '600',
    color: '#333',
  },
  settingRow: {
    width: '100%',
    marginTop: 30,
    marginBottom: 20,
  },
  settingLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  timeOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  timeOption: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#e0e0e0',
    backgroundColor: '#fff',
  },
  timeOptionSelected: {
    borderColor: '#4CAF50',
    backgroundColor: '#f1f8f4',
  },
  timeOptionText: {
    fontSize: 16,
    color: '#666',
  },
  timeOptionTextSelected: {
    color: '#4CAF50',
    fontWeight: '600',
  },
  toggleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20,
  },
  toggle: {
    width: 50,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#e0e0e0',
    justifyContent: 'center',
    paddingHorizontal: 2,
  },
  toggleActive: {
    backgroundColor: '#4CAF50',
  },
  toggleThumb: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: '#fff',
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
    borderColor: '#ddd',
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
  },
  nextButton: {
    flex: 2,
    paddingVertical: 14,
    borderRadius: 8,
    backgroundColor: '#4CAF50',
    alignItems: 'center',
  },
  nextButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  skipButton: {
    marginTop: 20,
    paddingVertical: 10,
  },
  skipButtonText: {
    fontSize: 14,
    color: '#999',
  },
});
