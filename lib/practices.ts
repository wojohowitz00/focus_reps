/**
 * Practice definitions and schedule logic
 * Implements the six-week Peak Mind program structure
 */

import { PracticeType, PracticeSchedule } from '../types';

export interface PracticeDefinition {
  id: PracticeType;
  name: string;
  description: string;
  defaultDuration: number; // minutes
  icon?: string;
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
export function getPracticeForWeekAndDay(week: number, day: number): PracticeType {
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
  
  // Weeks 5-6: Default to Anchor Breath, but user can customize
  return 'anchor-breath';
}

/**
 * Get current week based on start date
 */
export function getCurrentWeek(startDate: Date): number {
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - startDate.getTime());
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  const week = Math.floor(diffDays / 7) + 1;
  
  // Cap at 6 weeks for the program
  return Math.min(week, 6);
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
export function getTodayPractice(startDate: Date): PracticeType {
  const week = getCurrentWeek(startDate);
  const day = getCurrentDay(startDate);
  return getPracticeForWeekAndDay(week, day);
}

/**
 * Get next practice in schedule
 */
export function getNextPractice(startDate: Date): PracticeType {
  const week = getCurrentWeek(startDate);
  const day = getCurrentDay(startDate);
  
  if (day === 7) {
    // Next week, day 1
    return getPracticeForWeekAndDay(Math.min(week + 1, 6), 1);
  }
  
  return getPracticeForWeekAndDay(week, day + 1);
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
export function getWeekSchedule(week: number): PracticeSchedule[] {
  const schedule: PracticeSchedule[] = [];
  
  for (let day = 1; day <= 7; day++) {
    const practice = getPracticeForWeekAndDay(week, day);
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
