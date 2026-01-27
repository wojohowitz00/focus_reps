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
  'find-your-flashlight': {
    id: 'find-your-flashlight',
    name: 'Find Your Flashlight',
    description: 'Breath awareness meditation - the foundational practice',
    defaultDuration: 12,
  },
  'body-scan': {
    id: 'body-scan',
    name: 'Body Scan',
    description: 'Systematic body awareness practice',
    defaultDuration: 12,
  },
  'river-of-thought': {
    id: 'river-of-thought',
    name: 'River of Thought',
    description: 'Meta-awareness meditation observing thoughts',
    defaultDuration: 12,
  },
  'connection-practice': {
    id: 'connection-practice',
    name: 'Connection Practice',
    description: 'Loving-kindness meditation',
    defaultDuration: 12,
  },
};

/**
 * Six-week program structure
 * Week 1: Find Your Flashlight only
 * Week 2: Find Your Flashlight + Body Scan (alternating)
 * Week 3: Find Your Flashlight + River of Thought (alternating)
 * Week 4: Find Your Flashlight + Connection Practice (alternating)
 * Weeks 5-6: Customizable
 */
export function getPracticeForWeekAndDay(week: number, day: number): PracticeType {
  if (week === 1) {
    return 'find-your-flashlight';
  }
  
  if (week === 2) {
    // Alternating: Flashlight on odd days, Body Scan on even days
    return day % 2 === 1 ? 'find-your-flashlight' : 'body-scan';
  }
  
  if (week === 3) {
    // Alternating: Flashlight on odd days, River of Thought on even days
    return day % 2 === 1 ? 'find-your-flashlight' : 'river-of-thought';
  }
  
  if (week === 4) {
    // Alternating: Flashlight on odd days, Connection Practice on even days
    return day % 2 === 1 ? 'find-your-flashlight' : 'connection-practice';
  }
  
  // Weeks 5-6: Default to Flashlight, but user can customize
  return 'find-your-flashlight';
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
