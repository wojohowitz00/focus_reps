/**
 * Type definitions for Peak Mind App
 */

export type PracticeType = 
  | 'anchor-breath'
  | 'body-sweep'
  | 'thought-traffic'
  | 'kindness-circuit';

export interface PracticeSession {
  id: string;
  practiceType: PracticeType;
  date: Date;
  duration: number; // actual minutes practiced
  scheduledDuration: number; // intended duration (usually 12)
  completed: boolean;
  journalEntryId?: string;
}

export interface JournalEntry {
  id: string;
  sessionId: string;
  date: Date;
  content: string;
  tags?: string[];
  mood?: string;
}

export interface UserProgress {
  currentWeek: number;
  currentDay: number;
  totalSessions: number;
  totalMinutes: number;
  currentStreak: number;
  longestStreak: number;
  practiceHistory: PracticeSession[];
  settings: UserSettings;
}

export interface UserSettings {
  reminderTime?: string; // "08:00"
  defaultDuration: number; // 12 minutes
  soundEnabled: boolean;
  notificationsEnabled: boolean;
}

export interface PracticeSchedule {
  week: number;
  day: number;
  practice: PracticeType;
  duration: number; // 12 minutes default
  completed: boolean;
  date?: Date;
}
