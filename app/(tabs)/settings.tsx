/**
 * Settings Screen
 * User preferences and app configuration
 */

import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  TextInput,
} from 'react-native';
import { getSettings, updateSetting, saveSettings } from '../../lib/storage';
import { UserSettings } from '../../types';
import { rescheduleReminder } from '../../lib/notifications';

export default function SettingsScreen() {
  const [settings, setSettings] = useState<UserSettings | null>(null);
  const [reminderTime, setReminderTime] = useState('08:00');

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const userSettings = await getSettings();
      setSettings(userSettings);
      if (userSettings?.reminderTime) {
        setReminderTime(userSettings.reminderTime);
      }
    } catch (error) {
      console.error('Error loading settings:', error);
    }
  };

  const handleToggle = async (key: keyof UserSettings, value: boolean) => {
    try {
      await updateSetting(key, value);
      const updated = await getSettings();
      setSettings(updated);

      // If notifications were enabled/disabled, update reminders
      if (key === 'notificationsEnabled') {
        if (value) {
          await rescheduleReminder(reminderTime);
        } else {
          const { cancelAllReminders } = await import('../../lib/notifications');
          await cancelAllReminders();
        }
      }
    } catch (error) {
      console.error('Error updating setting:', error);
    }
  };

  const handleReminderTimeChange = async (time: string) => {
    setReminderTime(time);
    try {
      await updateSetting('reminderTime', time);
      if (settings?.notificationsEnabled) {
        await rescheduleReminder(time);
      }
    } catch (error) {
      console.error('Error updating reminder time:', error);
    }
  };

  const handleDurationChange = async (duration: number) => {
    try {
      await updateSetting('defaultDuration', duration);
      const updated = await getSettings();
      setSettings(updated);
    } catch (error) {
      console.error('Error updating duration:', error);
    }
  };

  if (!settings) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Settings</Text>
        </View>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading settings...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Settings</Text>
        <Text style={styles.subtitle}>Customize your practice</Text>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Practice</Text>

          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingLabel}>Default Duration</Text>
              <Text style={styles.settingDescription}>
                Default practice duration in minutes
              </Text>
            </View>
            <View style={styles.durationOptions}>
              {[10, 12, 15, 20, 30].map((duration) => (
                <TouchableOpacity
                  key={duration}
                  style={[
                    styles.durationOption,
                    settings.defaultDuration === duration && styles.durationOptionSelected,
                  ]}
                  onPress={() => handleDurationChange(duration)}
                >
                  <Text
                    style={[
                      styles.durationOptionText,
                      settings.defaultDuration === duration && styles.durationOptionTextSelected,
                    ]}
                  >
                    {duration}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Notifications</Text>

          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingLabel}>Enable Notifications</Text>
              <Text style={styles.settingDescription}>
                Receive daily practice reminders
              </Text>
            </View>
            <Switch
              value={settings.notificationsEnabled}
              onValueChange={(value) => handleToggle('notificationsEnabled', value)}
              trackColor={{ false: '#e0e0e0', true: '#4CAF50' }}
              thumbColor="#fff"
            />
          </View>

          {settings.notificationsEnabled && (
            <View style={styles.settingRow}>
              <View style={styles.settingInfo}>
                <Text style={styles.settingLabel}>Reminder Time</Text>
                <Text style={styles.settingDescription}>
                  Daily practice reminder time
                </Text>
              </View>
              <View style={styles.timeOptions}>
                {['06:00', '08:00', '12:00', '18:00', '20:00'].map((time) => (
                  <TouchableOpacity
                    key={time}
                    style={[
                      styles.timeOption,
                      reminderTime === time && styles.timeOptionSelected,
                    ]}
                    onPress={() => handleReminderTimeChange(time)}
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
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Audio</Text>

          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingLabel}>Sound Effects</Text>
              <Text style={styles.settingDescription}>
                Play sounds during practice (bells, etc.)
              </Text>
            </View>
            <Switch
              value={settings.soundEnabled}
              onValueChange={(value) => handleToggle('soundEnabled', value)}
              trackColor={{ false: '#e0e0e0', true: '#4CAF50' }}
              thumbColor="#fff"
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About</Text>
          <Text style={styles.aboutText}>
            Peak Mind is based on Dr. Amishi Jha's research on attention and mindfulness.
            The program follows a six-week structure designed to strengthen your attention system.
          </Text>
          <Text style={styles.aboutText}>
            Minimum effective dose: 12 minutes, 5 days per week for 4 weeks.
          </Text>
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
  section: {
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
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 16,
  },
  settingRow: {
    marginBottom: 20,
  },
  settingInfo: {
    marginBottom: 12,
  },
  settingLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  settingDescription: {
    fontSize: 14,
    color: '#666',
  },
  durationOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  durationOption: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#e0e0e0',
    backgroundColor: '#fff',
  },
  durationOptionSelected: {
    borderColor: '#4CAF50',
    backgroundColor: '#f1f8f4',
  },
  durationOptionText: {
    fontSize: 16,
    color: '#666',
  },
  durationOptionTextSelected: {
    color: '#4CAF50',
    fontWeight: '600',
  },
  timeOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  timeOption: {
    paddingVertical: 8,
    paddingHorizontal: 16,
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
    fontSize: 14,
    color: '#666',
  },
  timeOptionTextSelected: {
    color: '#4CAF50',
    fontWeight: '600',
  },
  aboutText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 12,
  },
});
