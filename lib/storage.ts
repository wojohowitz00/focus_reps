/**
 * AsyncStorage wrapper for persistent data storage
 * Provides type-safe CRUD operations for app data
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { PracticeSession, JournalEntry, UserProgress, UserSettings } from '../types';

const STORAGE_KEYS = {
  SESSIONS: '@peak_mind:sessions',
  JOURNAL_ENTRIES: '@peak_mind:journal_entries',
  PROGRESS: '@peak_mind:progress',
  SETTINGS: '@peak_mind:settings',
} as const;

const LEGACY_PRACTICE_ID_MAP: Record<string, string> = {
  'find-your-flashlight': 'anchor-breath',
  'body-scan': 'body-sweep',
  'river-of-thought': 'thought-traffic',
  'connection-practice': 'kindness-circuit',
};

function normalizePracticeType(practiceType: string): string {
  return LEGACY_PRACTICE_ID_MAP[practiceType] ?? practiceType;
}

function normalizeSession(session: PracticeSession): PracticeSession {
  return {
    ...session,
    practiceType: normalizePracticeType(session.practiceType as unknown as string) as PracticeSession['practiceType'],
  };
}

// Generic storage operations
export async function getItem<T>(key: string): Promise<T | null> {
  try {
    const item = await AsyncStorage.getItem(key);
    return item ? JSON.parse(item) : null;
  } catch (error) {
    console.error(`Error getting item ${key}:`, error);
    return null;
  }
}

export async function setItem<T>(key: string, value: T): Promise<boolean> {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (error) {
    console.error(`Error setting item ${key}:`, error);
    return false;
  }
}

export async function removeItem(key: string): Promise<boolean> {
  try {
    await AsyncStorage.removeItem(key);
    return true;
  } catch (error) {
    console.error(`Error removing item ${key}:`, error);
    return false;
  }
}

export async function clear(): Promise<boolean> {
  try {
    await AsyncStorage.clear();
    return true;
  } catch (error) {
    console.error('Error clearing storage:', error);
    return false;
  }
}

// Session storage operations
export async function saveSession(session: PracticeSession): Promise<boolean> {
  try {
    const sessions = await getSessions();
    const updatedSessions = [...sessions, normalizeSession(session)];
    return await setItem(STORAGE_KEYS.SESSIONS, updatedSessions);
  } catch (error) {
    console.error('Error saving session:', error);
    return false;
  }
}

export async function getSessions(): Promise<PracticeSession[]> {
  const sessions = await getItem<PracticeSession[]>(STORAGE_KEYS.SESSIONS);
  return sessions ? sessions.map(normalizeSession) : [];
}

export async function getSessionById(id: string): Promise<PracticeSession | null> {
  const sessions = await getSessions();
  return sessions.find((s) => s.id === id) || null;
}

export async function updateSession(
  id: string,
  updates: Partial<PracticeSession>
): Promise<PracticeSession | null> {
  try {
    const sessions = await getSessions();
    const index = sessions.findIndex((s) => s.id === id);
    if (index === -1) {
      return null;
    }
    const updatedSession = normalizeSession({
      ...sessions[index],
      ...updates,
    });
    const updatedSessions = [...sessions];
    updatedSessions[index] = updatedSession;
    await setItem(STORAGE_KEYS.SESSIONS, updatedSessions);
    return updatedSession;
  } catch (error) {
    console.error('Error updating session:', error);
    return null;
  }
}

export async function deleteSession(id: string): Promise<boolean> {
  try {
    const sessions = await getSessions();
    const updatedSessions = sessions.filter((s) => s.id !== id);
    return await setItem(STORAGE_KEYS.SESSIONS, updatedSessions);
  } catch (error) {
    console.error('Error deleting session:', error);
    return false;
  }
}

// Progress storage operations
export async function saveProgress(progress: UserProgress): Promise<boolean> {
  return await setItem(STORAGE_KEYS.PROGRESS, progress);
}

export async function getProgress(): Promise<UserProgress | null> {
  const progress = await getItem<UserProgress>(STORAGE_KEYS.PROGRESS);
  if (!progress) {
    return null;
  }
  if (!progress.practiceHistory?.length) {
    return progress;
  }
  return {
    ...progress,
    practiceHistory: progress.practiceHistory.map(normalizeSession),
  };
}

export async function updateProgress(updates: Partial<UserProgress>): Promise<boolean> {
  try {
    const current = await getProgress();
    if (!current) {
      return false;
    }
    const updated = { ...current, ...updates };
    return await saveProgress(updated);
  } catch (error) {
    console.error('Error updating progress:', error);
    return false;
  }
}

// Journal storage operations
export async function saveJournalEntry(entry: JournalEntry): Promise<boolean> {
  try {
    const entries = await getJournalEntries();
    const updatedEntries = [...entries, entry];
    return await setItem(STORAGE_KEYS.JOURNAL_ENTRIES, updatedEntries);
  } catch (error) {
    console.error('Error saving journal entry:', error);
    return false;
  }
}

export async function getJournalEntries(): Promise<JournalEntry[]> {
  const entries = await getItem<JournalEntry[]>(STORAGE_KEYS.JOURNAL_ENTRIES);
  return entries || [];
}

export async function getJournalEntryById(id: string): Promise<JournalEntry | null> {
  const entries = await getJournalEntries();
  return entries.find((e) => e.id === id) || null;
}

export async function deleteJournalEntry(id: string): Promise<boolean> {
  try {
    const entries = await getJournalEntries();
    const updatedEntries = entries.filter((e) => e.id !== id);
    return await setItem(STORAGE_KEYS.JOURNAL_ENTRIES, updatedEntries);
  } catch (error) {
    console.error('Error deleting journal entry:', error);
    return false;
  }
}

// Settings storage operations
export async function saveSettings(settings: UserSettings): Promise<boolean> {
  return await setItem(STORAGE_KEYS.SETTINGS, settings);
}

export async function getSettings(): Promise<UserSettings | null> {
  const settings = await getItem<UserSettings>(STORAGE_KEYS.SETTINGS);
  // Return default settings if none exist
  const defaults: UserSettings = {
    defaultDuration: 12,
    soundEnabled: true,
    notificationsEnabled: true,
    programMode: 'standard_6_week',
    programStartDate: new Date().toISOString(),
    weeklyReminderEnabled: false,
    weeklyReminderDay: 0,
    weeklyReminderTime: '19:00',
  };

  if (!settings) {
    await saveSettings(defaults);
    return defaults;
  }

  const merged = { ...defaults, ...settings };
  if (
    !settings.programMode ||
    !settings.programStartDate ||
    settings.programMode !== merged.programMode ||
    settings.programStartDate !== merged.programStartDate
  ) {
    await saveSettings(merged);
  }
  return merged;
}

export async function updateSetting<K extends keyof UserSettings>(
  key: K,
  value: UserSettings[K]
): Promise<boolean> {
  try {
    const current = await getSettings();
    if (!current) {
      return false;
    }
    const updated = { ...current, [key]: value };
    return await saveSettings(updated);
  } catch (error) {
    console.error(`Error updating setting ${key}:`, error);
    return false;
  }
}
