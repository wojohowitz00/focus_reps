/**
 * Practice definitions and schedule logic
 * Implements the Focus Reps program structure aligned to the expanded guide
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
    name: 'Find Your Flashlight',
    description: 'Foundational breath awareness reps for sustained attention and return speed',
    defaultDuration: 12,
  },
  'body-sweep': {
    id: 'body-sweep',
    name: 'Body Scan',
    description: 'Systematic body scan that trains deliberate attention movement',
    defaultDuration: 12,
  },
  'thought-traffic': {
    id: 'thought-traffic',
    name: 'River of Thought',
    description: 'Meta-awareness practice for observing thoughts without getting swept in',
    defaultDuration: 12,
  },
  'kindness-circuit': {
    id: 'kindness-circuit',
    name: 'Connection Practice',
    description: 'Loving-kindness practice for attention stability and emotional regulation',
    defaultDuration: 12,
  },
};

/**
 * Program structure from the expanded guide:
 * Week 1: Find Your Flashlight only
 * Week 2: Find Your Flashlight + Body Scan (alternating)
 * Week 3: Find Your Flashlight + River of Thought (alternating)
 * Week 4: Find Your Flashlight + Connection Practice (alternating)
 * Week 5+: Customizable sequence (12+ minutes, 5+ days/week)
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
    // Alternating: Find Your Flashlight on odd days, Body Scan on even days
    return day % 2 === 1 ? 'anchor-breath' : 'body-sweep';
  }
  
  if (week === 3) {
    // Alternating: Find Your Flashlight on odd days, River of Thought on even days
    return day % 2 === 1 ? 'anchor-breath' : 'thought-traffic';
  }
  
  if (week === 4) {
    // Alternating: Find Your Flashlight on odd days, Connection Practice on even days
    return day % 2 === 1 ? 'anchor-breath' : 'kindness-circuit';
  }

  // Week 5+ follows a user-customizable pattern in both standard and extended tracks.
  return getCustomPracticeForDay(customPracticeSet, day);
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
 * Check if a practice is unlocked based on current level
 */
export function isPracticeUnlocked(practiceType: PracticeType, level: 'L1' | 'L2' | 'L3' = 'L1'): boolean {
  if (level === 'L1') {
    return practiceType === 'anchor-breath' || practiceType === 'body-sweep';
  }
  return true; // L2 and L3 unlock all core practices
}

/**
 * Get today's recommended practice
 */
export function getTodayPractice(
  startDate: Date,
  programMode: ProgramMode = DEFAULT_PROGRAM_MODE,
  customPracticeSet?: PracticeType[],
  userPath?: 'deep_work' | 'overwhelm' | 'burnout',
  currentLevel?: 'L1' | 'L2' | 'L3',
  dayOffset = 0
): PracticeType {
  if (userPath && currentLevel) {
    const day = (getCurrentDay(startDate) + dayOffset - 1) % 7 + 1;
    
    // Level 1: Baseline unlocks Breath (Find Your Flashlight) and Body Scan
    if (currentLevel === 'L1') {
      if (userPath === 'burnout') {
        return 'body-sweep'; // Burnout path prioritizes Somatic Grounding
      }
      return 'anchor-breath';
    }

    // Level 2: Expansion unlocks River of Thought (Meta-Awareness) & Connection
    if (currentLevel === 'L2') {
      if (userPath === 'deep_work') {
        return day % 2 === 1 ? 'anchor-breath' : 'body-sweep';
      }
      if (userPath === 'overwhelm') {
        return day % 2 === 1 ? 'anchor-breath' : 'thought-traffic';
      }
      if (userPath === 'burnout') {
        return day % 2 === 1 ? 'body-sweep' : 'kindness-circuit';
      }
    }

    // Level 3: Mastery unlocks Advanced custom rotations
    if (currentLevel === 'L3') {
      if (customPracticeSet && customPracticeSet.length > 0) {
        return getCustomPracticeForDay(customPracticeSet, day);
      }
      if (userPath === 'deep_work') {
        return day % 3 === 0 ? 'thought-traffic' : day % 3 === 1 ? 'anchor-breath' : 'body-sweep';
      }
      if (userPath === 'overwhelm') {
        return day % 3 === 0 ? 'kindness-circuit' : day % 3 === 1 ? 'anchor-breath' : 'thought-traffic';
      }
      if (userPath === 'burnout') {
        return day % 3 === 0 ? 'kindness-circuit' : day % 3 === 1 ? 'body-sweep' : 'thought-traffic';
      }
    }
  }

  // Fallback to legacy linear weekly scheduler
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
  customPracticeSet?: PracticeType[],
  userPath?: 'deep_work' | 'overwhelm' | 'burnout',
  currentLevel?: 'L1' | 'L2' | 'L3'
): PracticeType {
  return getTodayPractice(startDate, programMode, customPracticeSet, userPath, currentLevel, 1);
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
