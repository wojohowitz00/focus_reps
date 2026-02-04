/**
 * Type definitions for Focus Reps App
 */

export type ProgramMode =
  | 'standard_6_week'
  | 'extended_8_week'
  | 'open_training';

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
  focusQuality?: number; // 1-5
  mood?: number; // 1-5
  stress?: number; // 1-5
  energy?: number; // 1-5
  lapseCount?: number;
  longestFocusIntervalSec?: number;
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
  programMode: ProgramMode;
  programStartDate: string; // ISO string
  customPracticeSet?: PracticeType[];
  weeklyReminderEnabled: boolean;
  weeklyReminderDay: number; // 0-6 (Sun-Sat)
  weeklyReminderTime: string; // "19:00"
}

export interface PracticeSchedule {
  week: number;
  day: number;
  practice: PracticeType;
  duration: number; // 12 minutes default
  completed: boolean;
  date?: Date;
}

export interface WeeklySummary {
  weekStart: Date;
  weekEnd: Date;
  sessionsCount: number;
  totalMinutes: number;
  longestIntervalSec: number;
  avgLapses: number;
  journalHighlights: JournalEntry[];
}

export interface WeeklyRecommendation {
  practiceType: PracticeType;
  rationale: string;
}
