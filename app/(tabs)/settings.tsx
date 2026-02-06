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
import { ProgramMode, PracticeType, UserSettings } from '../../types';
import { rescheduleReminder, scheduleWeeklyReminder, cancelWeeklyReminder } from '../../lib/notifications';
import { practiceDefinitions } from '../../lib/practices';

export default function SettingsScreen() {
  const [settings, setSettings] = useState<UserSettings | null>(null);
  const [reminderTime, setReminderTime] = useState('08:00');
  const [weeklyReminderDay, setWeeklyReminderDay] = useState(0);
  const [weeklyReminderTime, setWeeklyReminderTime] = useState('19:00');

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
      if (userSettings?.weeklyReminderDay !== undefined) {
        setWeeklyReminderDay(userSettings.weeklyReminderDay);
      }
      if (userSettings?.weeklyReminderTime) {
        setWeeklyReminderTime(userSettings.weeklyReminderTime);
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

  const handleWeeklyReminderToggle = async (value: boolean) => {
    if (!settings) return;
    try {
      const updated = {
        ...settings,
        weeklyReminderEnabled: value,
        weeklyReminderDay,
        weeklyReminderTime,
      };
      await saveSettings(updated);
      setSettings(updated);
      if (value) {
        await scheduleWeeklyReminder(weeklyReminderDay, weeklyReminderTime);
      } else {
        await cancelWeeklyReminder();
      }
    } catch (error) {
      console.error('Error updating weekly reminder:', error);
    }
  };

  const handleWeeklyReminderDayChange = async (day: number) => {
    setWeeklyReminderDay(day);
    if (!settings) return;
    try {
      const updated = {
        ...settings,
        weeklyReminderDay: day,
      };
      await saveSettings(updated);
      setSettings(updated);
      if (updated.weeklyReminderEnabled) {
        await scheduleWeeklyReminder(day, weeklyReminderTime);
      }
    } catch (error) {
      console.error('Error updating weekly reminder day:', error);
    }
  };

  const handleWeeklyReminderTimeChange = async (time: string) => {
    setWeeklyReminderTime(time);
    if (!settings) return;
    try {
      const updated = {
        ...settings,
        weeklyReminderTime: time,
      };
      await saveSettings(updated);
      setSettings(updated);
      if (updated.weeklyReminderEnabled) {
        await scheduleWeeklyReminder(weeklyReminderDay, time);
      }
    } catch (error) {
      console.error('Error updating weekly reminder time:', error);
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

  const handleProgramModeChange = async (mode: ProgramMode) => {
    if (!settings) return;
    try {
      const nextSettings: UserSettings = {
        ...settings,
        programMode: mode,
        customPracticeSet:
          mode === 'open_training'
            ? settings.customPracticeSet?.length
              ? settings.customPracticeSet
              : ['anchor-breath']
            : undefined,
      };
      await saveSettings(nextSettings);
      setSettings(nextSettings);
    } catch (error) {
      console.error('Error updating program mode:', error);
    }
  };

  const handlePracticeToggle = async (practiceId: PracticeType) => {
    if (!settings) return;
    const current = settings.customPracticeSet ?? [];
    let next: PracticeType[];

    if (current.includes(practiceId)) {
      next = current.filter((id) => id !== practiceId);
    } else {
      if (current.length >= 2) {
        return;
      }
      next = [...current, practiceId];
    }

    if (next.length === 0) {
      next = ['anchor-breath'];
    }

    try {
      const nextSettings: UserSettings = {
        ...settings,
        customPracticeSet: next,
      };
      await saveSettings(nextSettings);
      setSettings(nextSettings);
    } catch (error) {
      console.error('Error updating custom practice set:', error);
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

          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingLabel}>Training Track</Text>
              <Text style={styles.settingDescription}>
                Choose your progression path
              </Text>
            </View>
            <View style={styles.trackOptions}>
              {[
                { id: 'standard_6_week', label: '6-Week Standard' },
                { id: 'extended_8_week', label: '8-Week Extended' },
                { id: 'open_training', label: 'Open Training' },
              ].map((option) => (
                <TouchableOpacity
                  key={option.id}
                  style={[
                    styles.trackOption,
                    settings.programMode === option.id && styles.trackOptionSelected,
                  ]}
                  onPress={() => handleProgramModeChange(option.id as ProgramMode)}
                >
                  <Text
                    style={[
                      styles.trackOptionText,
                      settings.programMode === option.id && styles.trackOptionTextSelected,
                    ]}
                  >
                    {option.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {settings.programMode === 'open_training' && (
            <View style={styles.settingRow}>
              <View style={styles.settingInfo}>
                <Text style={styles.settingLabel}>Custom Rotation</Text>
                <Text style={styles.settingDescription}>
                  Pick 1–2 practices for your rotation
                </Text>
              </View>
              <View style={styles.practiceChips}>
                {Object.values(practiceDefinitions).map((practice) => {
                  const selected = settings.customPracticeSet?.includes(practice.id);
                  return (
                    <TouchableOpacity
                      key={practice.id}
                      style={[
                        styles.practiceChip,
                        selected && styles.practiceChipSelected,
                      ]}
                      onPress={() => handlePracticeToggle(practice.id)}
                    >
                      <Text
                        style={[
                          styles.practiceChipText,
                          selected && styles.practiceChipTextSelected,
                        ]}
                      >
                        {practice.name}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          )}
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
              trackColor={{ false: '#E2E8F0', true: '#1D4ED8' }}
              thumbColor="#FFFFFF"
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

          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingLabel}>Weekly Summary</Text>
              <Text style={styles.settingDescription}>
                Reminder to review your weekly progress
              </Text>
            </View>
            <Switch
              value={settings.weeklyReminderEnabled}
              onValueChange={handleWeeklyReminderToggle}
              trackColor={{ false: '#E2E8F0', true: '#1D4ED8' }}
              thumbColor="#FFFFFF"
            />
          </View>

          {settings.weeklyReminderEnabled && (
            <View style={styles.settingRow}>
              <View style={styles.settingInfo}>
                <Text style={styles.settingLabel}>Weekly Reminder</Text>
                <Text style={styles.settingDescription}>
                  Choose a day and time
                </Text>
              </View>
              <View style={styles.weeklyOptions}>
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((label, index) => (
                  <TouchableOpacity
                    key={label}
                    style={[
                      styles.weekdayOption,
                      weeklyReminderDay === index && styles.weekdayOptionSelected,
                    ]}
                    onPress={() => handleWeeklyReminderDayChange(index)}
                  >
                    <Text
                      style={[
                        styles.weekdayOptionText,
                        weeklyReminderDay === index && styles.weekdayOptionTextSelected,
                      ]}
                    >
                      {label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
              <View style={styles.timeOptions}>
                {['07:00', '12:00', '18:00', '19:00', '20:00'].map((time) => (
                  <TouchableOpacity
                    key={time}
                    style={[
                      styles.timeOption,
                      weeklyReminderTime === time && styles.timeOptionSelected,
                    ]}
                    onPress={() => handleWeeklyReminderTimeChange(time)}
                  >
                    <Text
                      style={[
                        styles.timeOptionText,
                        weeklyReminderTime === time && styles.timeOptionTextSelected,
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
              trackColor={{ false: '#E2E8F0', true: '#1D4ED8' }}
              thumbColor="#FFFFFF"
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About</Text>
          <Text style={styles.aboutText}>
            Focus Reps is grounded in attention research and mindfulness practice.
            The program follows a six-week structure designed to build sustained focus.
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
    backgroundColor: '#F5F7FA',
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
    backgroundColor: '#FFFFFF',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#0F172A',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#64748B',
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
    color: '#64748B',
  },
  section: {
    backgroundColor: '#FFFFFF',
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
    color: '#0F172A',
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
    color: '#0F172A',
    marginBottom: 4,
  },
  settingDescription: {
    fontSize: 14,
    color: '#64748B',
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
    borderColor: '#E2E8F0',
    backgroundColor: '#FFFFFF',
  },
  durationOptionSelected: {
    borderColor: '#1D4ED8',
    backgroundColor: '#E8EEFF',
  },
  durationOptionText: {
    fontSize: 16,
    color: '#64748B',
  },
  durationOptionTextSelected: {
    color: '#1D4ED8',
    fontWeight: '600',
  },
  timeOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  weeklyOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 12,
  },
  weekdayOption: {
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    backgroundColor: '#FFFFFF',
  },
  weekdayOptionSelected: {
    borderColor: '#1D4ED8',
    backgroundColor: '#E8EEFF',
  },
  weekdayOptionText: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '600',
  },
  weekdayOptionTextSelected: {
    color: '#1D4ED8',
  },
  trackOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  trackOption: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 18,
    borderWidth: 2,
    borderColor: '#E2E8F0',
    backgroundColor: '#FFFFFF',
  },
  trackOptionSelected: {
    borderColor: '#1D4ED8',
    backgroundColor: '#E8EEFF',
  },
  trackOptionText: {
    fontSize: 14,
    color: '#64748B',
    fontWeight: '500',
  },
  trackOptionTextSelected: {
    color: '#1D4ED8',
    fontWeight: '600',
  },
  practiceChips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  practiceChip: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    backgroundColor: '#FFFFFF',
  },
  practiceChipSelected: {
    borderColor: '#1D4ED8',
    backgroundColor: '#E8EEFF',
  },
  practiceChipText: {
    fontSize: 13,
    color: '#64748B',
  },
  practiceChipTextSelected: {
    color: '#1D4ED8',
    fontWeight: '600',
  },
  timeOption: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#E2E8F0',
    backgroundColor: '#FFFFFF',
  },
  timeOptionSelected: {
    borderColor: '#1D4ED8',
    backgroundColor: '#E8EEFF',
  },
  timeOptionText: {
    fontSize: 14,
    color: '#64748B',
  },
  timeOptionTextSelected: {
    color: '#1D4ED8',
    fontWeight: '600',
  },
  aboutText: {
    fontSize: 14,
    color: '#64748B',
    lineHeight: 20,
    marginBottom: 12,
  },
});
