/**
 * Unit tests for storage functions
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  getItem,
  setItem,
  removeItem,
  clear,
  saveSession,
  getSessions,
  getSessionById,
  updateSession,
  deleteSession,
  saveProgress,
  getProgress,
  updateProgress,
  saveJournalEntry,
  getJournalEntries,
  getJournalEntryById,
  deleteJournalEntry,
  saveSettings,
  getSettings,
  updateSetting,
} from '../../lib/storage';
import { PracticeSession, JournalEntry, UserProgress, UserSettings } from '../../types';

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);

describe('Storage Functions', () => {
  beforeEach(() => {
    AsyncStorage.clear();
  });

  describe('Generic Storage Operations', () => {
    test('getItem returns null for non-existent key', async () => {
      const result = await getItem('non-existent');
      expect(result).toBeNull();
    });

    test('setItem and getItem work correctly', async () => {
      const testData = { test: 'data' };
      await setItem('test-key', testData);
      const result = await getItem('test-key');
      expect(result).toEqual(testData);
    });

    test('removeItem deletes item', async () => {
      await setItem('test-key', { test: 'data' });
      await removeItem('test-key');
      const result = await getItem('test-key');
      expect(result).toBeNull();
    });

    test('clear removes all items', async () => {
      await setItem('key1', { data: 1 });
      await setItem('key2', { data: 2 });
      await clear();
      const result1 = await getItem('key1');
      const result2 = await getItem('key2');
      expect(result1).toBeNull();
      expect(result2).toBeNull();
    });
  });

  describe('Session Storage', () => {
    const mockSession: PracticeSession = {
      id: 'session-1',
      practiceType: 'anchor-breath',
      date: new Date('2024-01-01'),
      duration: 12,
      scheduledDuration: 12,
      completed: true,
    };

    test('saveSession adds session to storage', async () => {
      const success = await saveSession(mockSession);
      expect(success).toBe(true);
      
      const sessions = await getSessions();
      expect(sessions).toHaveLength(1);
      expect(sessions[0].id).toBe('session-1');
    });

    test('getSessions returns all sessions', async () => {
      await saveSession(mockSession);
      const session2 = { ...mockSession, id: 'session-2' };
      await saveSession(session2);
      
      const sessions = await getSessions();
      expect(sessions).toHaveLength(2);
    });

    test('getSessions normalizes legacy practice IDs', async () => {
      const legacySession = { ...mockSession, practiceType: 'find-your-flashlight' as PracticeSession['practiceType'] };
      await setItem('@peak_mind:sessions', [legacySession]);

      const sessions = await getSessions();
      expect(sessions).toHaveLength(1);
      expect(sessions[0].practiceType).toBe('anchor-breath');
    });

    test('getSessionById returns correct session', async () => {
      await saveSession(mockSession);
      const session = await getSessionById('session-1');
      expect(session).not.toBeNull();
      expect(session?.id).toBe('session-1');
    });

    test('updateSession merges metrics updates', async () => {
      await saveSession(mockSession);
      const updated = await updateSession('session-1', {
        focusQuality: 4,
        mood: 3,
        stress: 2,
        energy: 5,
        lapseCount: 2,
        longestFocusIntervalSec: 180,
      });
      expect(updated).not.toBeNull();
      expect(updated?.focusQuality).toBe(4);
      expect(updated?.lapseCount).toBe(2);
    });

    test('deleteSession removes session', async () => {
      await saveSession(mockSession);
      await deleteSession('session-1');
      const sessions = await getSessions();
      expect(sessions).toHaveLength(0);
    });
  });

  describe('Progress Storage', () => {
    const mockProgress: UserProgress = {
      currentWeek: 1,
      currentDay: 1,
      totalSessions: 5,
      totalMinutes: 60,
      currentStreak: 5,
      longestStreak: 5,
      practiceHistory: [],
      settings: {
        defaultDuration: 12,
        soundEnabled: true,
        notificationsEnabled: true,
      },
    };

    test('saveProgress stores progress', async () => {
      const success = await saveProgress(mockProgress);
      expect(success).toBe(true);
      
      const progress = await getProgress();
      expect(progress).not.toBeNull();
      expect(progress?.currentWeek).toBe(1);
    });

    test('updateProgress updates existing progress', async () => {
      await saveProgress(mockProgress);
      await updateProgress({ currentWeek: 2 });
      
      const progress = await getProgress();
      expect(progress?.currentWeek).toBe(2);
      expect(progress?.totalSessions).toBe(5); // Other fields unchanged
    });

    test('getProgress normalizes legacy practice history', async () => {
      const legacyProgress: UserProgress = {
        ...mockProgress,
        practiceHistory: [
          {
            id: 'legacy-session',
            practiceType: 'body-scan' as PracticeSession['practiceType'],
            date: new Date('2024-01-03'),
            duration: 12,
            scheduledDuration: 12,
            completed: true,
          },
        ],
      };

      await saveProgress(legacyProgress);
      const progress = await getProgress();
      expect(progress?.practiceHistory[0].practiceType).toBe('body-sweep');
    });
  });

  describe('Journal Storage', () => {
    const mockEntry: JournalEntry = {
      id: 'entry-1',
      sessionId: 'session-1',
      date: new Date('2024-01-01'),
      content: 'Test journal entry',
      tags: ['calm'],
      mood: 'peaceful',
    };

    test('saveJournalEntry adds entry', async () => {
      const success = await saveJournalEntry(mockEntry);
      expect(success).toBe(true);
      
      const entries = await getJournalEntries();
      expect(entries).toHaveLength(1);
    });

    test('getJournalEntryById returns correct entry', async () => {
      await saveJournalEntry(mockEntry);
      const entry = await getJournalEntryById('entry-1');
      expect(entry).not.toBeNull();
      expect(entry?.content).toBe('Test journal entry');
    });

    test('deleteJournalEntry removes entry', async () => {
      await saveJournalEntry(mockEntry);
      await deleteJournalEntry('entry-1');
      const entries = await getJournalEntries();
      expect(entries).toHaveLength(0);
    });
  });

  describe('Settings Storage', () => {
    test('getSettings returns default settings if none exist', async () => {
      const settings = await getSettings();
      expect(settings).not.toBeNull();
      expect(settings?.defaultDuration).toBe(12);
      expect(settings?.soundEnabled).toBe(true);
      expect(settings?.programMode).toBe('standard_6_week');
      expect(settings?.programStartDate).toBeTruthy();
    });

    test('saveSettings stores settings', async () => {
      const customSettings: UserSettings = {
        defaultDuration: 15,
        soundEnabled: false,
        notificationsEnabled: true,
        reminderTime: '08:00',
        programMode: 'extended_8_week',
        programStartDate: new Date('2024-01-01').toISOString(),
      };
      
      await saveSettings(customSettings);
      const settings = await getSettings();
      expect(settings?.defaultDuration).toBe(15);
      expect(settings?.soundEnabled).toBe(false);
    });

    test('updateSetting updates single setting', async () => {
      await saveSettings({
        defaultDuration: 12,
        soundEnabled: true,
        notificationsEnabled: true,
        programMode: 'standard_6_week',
        programStartDate: new Date('2024-01-01').toISOString(),
      });
      
      await updateSetting('soundEnabled', false);
      const settings = await getSettings();
      expect(settings?.soundEnabled).toBe(false);
    });
  });
});
