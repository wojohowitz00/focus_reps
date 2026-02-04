/**
 * Practice definitions and schedule logic
 * Implements the six-week Peak Mind program structure
 */

import { PracticeType, PracticeSchedule, ProgramMode } from '../types';

export interface PracticeDefinition {
  id: PracticeType;
  name: string;
  description: string;
  defaultDuration: number; // minutes
  icon?: string;
}

const DEFAULT_PROGRAM_MODE: ProgramMode = 'standard_6_week';

function getProgramWeekLimit(programMode: ProgramMode): number | null {
  if (programMode === 'standard_6_week') return 6;
  if (programMode === 'extended_8_week') return 8;
  return null;
}

function getCustomPracticeForDay(
  customPracticeSet: PracticeType[] | undefined,
  day: number,
  fallback: PracticeType = 'anchor-breath'
): PracticeType {
  if (!customPracticeSet || customPracticeSet.length === 0) {
    return fallback;
  }
  const index = (day - 1) % customPracticeSet.length;
  return customPracticeSet[index];
}

export const practiceDefinitions: Record<PracticeType, PracticeDefinition> = {
  'anchor-breath': {
    id: 'anchor-breath',
    name: 'Anchor Breath',
    description: 'Foundational breath focus reps to build sustained attention',
    defaultDuration: 12,
  },
  'body-sweep': {
    id: 'body-sweep',
    name: 'Body Sweep',
    description: 'Guided scan to train controlled shifts of attention',
    defaultDuration: 12,
  },
  'thought-traffic': {
    id: 'thought-traffic',
    name: 'Thought Traffic',
    description: 'Observe thoughts passing without engagement',
    defaultDuration: 12,
  },
  'kindness-circuit': {
    id: 'kindness-circuit',
    name: 'Kindness Circuit',
    description: 'Warmth and connection practice to reset attention',
    defaultDuration: 12,
  },
};

/**
 * Six-week program structure
 * Week 1: Anchor Breath only
 * Week 2: Anchor Breath + Body Sweep (alternating)
 * Week 3: Anchor Breath + Thought Traffic (alternating)
 * Week 4: Anchor Breath + Kindness Circuit (alternating)
 * Weeks 5-6: Customizable
 */
export function getPracticeForWeekAndDay(
  week: number,
  day: number,
  programMode: ProgramMode = DEFAULT_PROGRAM_MODE,
  customPracticeSet?: PracticeType[]
): PracticeType {
  if (programMode === 'open_training') {
    return getCustomPracticeForDay(customPracticeSet, day);
  }

  if (week === 1) {
    return 'anchor-breath';
  }
  
  if (week === 2) {
    // Alternating: Anchor Breath on odd days, Body Sweep on even days
    return day % 2 === 1 ? 'anchor-breath' : 'body-sweep';
  }
  
  if (week === 3) {
    // Alternating: Anchor Breath on odd days, Thought Traffic on even days
    return day % 2 === 1 ? 'anchor-breath' : 'thought-traffic';
  }
  
  if (week === 4) {
    // Alternating: Anchor Breath on odd days, Kindness Circuit on even days
    return day % 2 === 1 ? 'anchor-breath' : 'kindness-circuit';
  }

  if (programMode === 'extended_8_week') {
    return getCustomPracticeForDay(customPracticeSet, day);
  }

  // Weeks 5-6: Default to Anchor Breath for standard program
  return 'anchor-breath';
}

/**
 * Get current week based on start date
 */
export function getCurrentWeek(
  startDate: Date,
  programMode: ProgramMode = DEFAULT_PROGRAM_MODE
): number {
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - startDate.getTime());
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  const week = Math.floor(diffDays / 7) + 1;

  const limit = getProgramWeekLimit(programMode);
  return limit ? Math.min(week, limit) : week;
}

/**
 * Get current day in program (1-7 for current week)
 */
export function getCurrentDay(startDate: Date): number {
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - startDate.getTime());
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  return (diffDays % 7) + 1;
}

/**
 * Get today's recommended practice
 */
export function getTodayPractice(
  startDate: Date,
  programMode: ProgramMode = DEFAULT_PROGRAM_MODE,
  customPracticeSet?: PracticeType[]
): PracticeType {
  const week = getCurrentWeek(startDate, programMode);
  const day = getCurrentDay(startDate);
  return getPracticeForWeekAndDay(week, day, programMode, customPracticeSet);
}

/**
 * Get next practice in schedule
 */
export function getNextPractice(
  startDate: Date,
  programMode: ProgramMode = DEFAULT_PROGRAM_MODE,
  customPracticeSet?: PracticeType[]
): PracticeType {
  const week = getCurrentWeek(startDate, programMode);
  const day = getCurrentDay(startDate);

  const limit = getProgramWeekLimit(programMode);
  if (day === 7) {
    // Next week, day 1
    const nextWeek = limit ? Math.min(week + 1, limit) : week + 1;
    return getPracticeForWeekAndDay(nextWeek, 1, programMode, customPracticeSet);
  }

  return getPracticeForWeekAndDay(week, day + 1, programMode, customPracticeSet);
}

/**
 * Check if a practice is completed for a specific date
 */
export function isPracticeCompleted(
  practiceType: PracticeType,
  date: Date,
  completedSessions: Array<{ practiceType: PracticeType; date: Date }>
): boolean {
  const dateStr = date.toISOString().split('T')[0];
  return completedSessions.some(
    (session) =>
      session.practiceType === practiceType &&
      session.date.toISOString().split('T')[0] === dateStr
  );
}

/**
 * Get practice schedule for a specific week
 */
export function getWeekSchedule(
  week: number,
  programMode: ProgramMode = DEFAULT_PROGRAM_MODE,
  customPracticeSet?: PracticeType[]
): PracticeSchedule[] {
  const schedule: PracticeSchedule[] = [];
  
  for (let day = 1; day <= 7; day++) {
    const practice = getPracticeForWeekAndDay(week, day, programMode, customPracticeSet);
    schedule.push({
      week,
      day,
      practice,
      duration: practiceDefinitions[practice].defaultDuration,
      completed: false,
    });
  }
  
  return schedule;
}
