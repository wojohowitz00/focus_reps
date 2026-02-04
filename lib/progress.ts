/**
 * Progress calculation utilities
 * Calculates streaks, statistics, and progress metrics
 */

import { PracticeSession, UserProgress, ProgramMode } from '../types';
import { getSessions } from './storage';
import { getCurrentWeek, getCurrentDay } from './practices';

/**
 * Calculate current streak (consecutive days practiced)
 */
export async function calculateStreak(startDate: Date): Promise<number> {
  const sessions = await getSessions();
  if (sessions.length === 0) return 0;

  // Sort sessions by date (newest first)
  const sortedSessions = sessions
    .filter((s) => s.completed)
    .sort((a, b) => b.date.getTime() - a.date.getTime());

  if (sortedSessions.length === 0) return 0;

  let streak = 0;
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Check if there's a session today or yesterday
  const lastSessionDate = new Date(sortedSessions[0].date);
  lastSessionDate.setHours(0, 0, 0, 0);
  
  const daysDiff = Math.floor((today.getTime() - lastSessionDate.getTime()) / (1000 * 60 * 60 * 24));
  
  // If last session was more than 1 day ago, streak is broken
  if (daysDiff > 1) return 0;

  // Start counting from the most recent session
  let currentDate = new Date(lastSessionDate);
  let sessionIndex = 0;

  while (sessionIndex < sortedSessions.length) {
    const sessionDate = new Date(sortedSessions[sessionIndex].date);
    sessionDate.setHours(0, 0, 0, 0);

    if (sessionDate.getTime() === currentDate.getTime()) {
      streak++;
      currentDate.setDate(currentDate.getDate() - 1);
      sessionIndex++;
    } else if (sessionDate.getTime() < currentDate.getTime()) {
      // Gap found, streak broken
      break;
    } else {
      // Skip to next session
      sessionIndex++;
    }
  }

  return streak;
}

/**
 * Get total minutes practiced
 */
export async function getTotalMinutes(): Promise<number> {
  const sessions = await getSessions();
  return sessions
    .filter((s) => s.completed)
    .reduce((total, session) => total + session.duration, 0);
}

/**
 * Get weekly statistics
 */
export async function getWeeklyStats(
  startDate: Date,
  programMode: ProgramMode = 'standard_6_week'
): Promise<{
  currentWeek: number;
  daysCompleted: number;
  goalDays: number;
  totalMinutes: number;
}> {
  const sessions = await getSessions();
  const currentWeek = getCurrentWeek(startDate, programMode);
  const currentDay = getCurrentDay(startDate);

  // Get sessions from current week
  const weekStart = new Date(startDate);
  weekStart.setDate(weekStart.getDate() + (currentWeek - 1) * 7);
  weekStart.setHours(0, 0, 0, 0);

  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekEnd.getDate() + 7);

  const weekSessions = sessions.filter((s) => {
    const sessionDate = new Date(s.date);
    return sessionDate >= weekStart && sessionDate < weekEnd && s.completed;
  });

  // Get unique days with sessions
  const uniqueDays = new Set(
    weekSessions.map((s) => {
      const d = new Date(s.date);
      d.setHours(0, 0, 0, 0);
      return d.getTime();
    })
  );

  const totalMinutes = weekSessions.reduce((sum, s) => sum + s.duration, 0);

  return {
    currentWeek,
    daysCompleted: uniqueDays.size,
    goalDays: 5, // Minimum effective dose: 5 days per week
    totalMinutes,
  };
}

/**
 * Get practice distribution (count by practice type)
 */
export async function getPracticeDistribution(): Promise<Record<string, number>> {
  const sessions = await getSessions();
  const distribution: Record<string, number> = {};

  sessions
    .filter((s) => s.completed)
    .forEach((session) => {
      distribution[session.practiceType] = (distribution[session.practiceType] || 0) + 1;
    });

  return distribution;
}

/**
 * Get longest streak
 */
export async function getLongestStreak(startDate: Date): Promise<number> {
  const sessions = await getSessions();
  if (sessions.length === 0) return 0;

  const sortedSessions = sessions
    .filter((s) => s.completed)
    .sort((a, b) => a.date.getTime() - b.date.getTime());

  let longestStreak = 0;
  let currentStreak = 0;
  let lastDate: Date | null = null;

  for (const session of sortedSessions) {
    const sessionDate = new Date(session.date);
    sessionDate.setHours(0, 0, 0, 0);

    if (lastDate === null) {
      currentStreak = 1;
    } else {
      const daysDiff = Math.floor(
        (sessionDate.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24)
      );

      if (daysDiff === 1) {
        // Consecutive day
        currentStreak++;
      } else if (daysDiff === 0) {
        // Same day, don't increment
        continue;
      } else {
        // Gap found, reset streak
        longestStreak = Math.max(longestStreak, currentStreak);
        currentStreak = 1;
      }
    }

    lastDate = sessionDate;
  }

  return Math.max(longestStreak, currentStreak);
}

/**
 * Calculate all progress metrics
 */
export async function calculateAllProgress(startDate?: Date): Promise<UserProgress> {
  const sessions = await getSessions();
  const totalSessions = sessions.filter((s) => s.completed).length;
  const totalMinutes = await getTotalMinutes();

  // Get default settings
  const { getSettings } = await import('./storage');
  const settings = await getSettings();
  const programMode = settings?.programMode ?? 'standard_6_week';
  const resolvedStartDate = startDate
    ?? (settings?.programStartDate ? new Date(settings.programStartDate) : new Date());

  const currentStreak = await calculateStreak(resolvedStartDate);
  const longestStreak = await getLongestStreak(resolvedStartDate);
  const currentWeek = getCurrentWeek(resolvedStartDate, programMode);
  const currentDay = getCurrentDay(resolvedStartDate);

  return {
    currentWeek,
    currentDay,
    totalSessions,
    totalMinutes,
    currentStreak,
    longestStreak,
    practiceHistory: sessions,
    settings: settings || {
      defaultDuration: 12,
      soundEnabled: true,
      notificationsEnabled: true,
      programMode: 'standard_6_week',
      programStartDate: new Date().toISOString(),
    },
  };
}

/**
 * Check if milestone is achieved
 */
export interface Milestone {
  id: string;
  name: string;
  description: string;
  achieved: boolean;
}

export async function checkMilestones(progress: UserProgress): Promise<Milestone[]> {
  const milestones: Milestone[] = [
    {
      id: 'week-1-complete',
      name: 'Week 1 Complete',
      description: 'Completed your first week of practice',
      achieved: progress.currentWeek >= 2,
    },
    {
      id: 'week-4-complete',
      name: 'Week 4 Complete',
      description: 'Reached the research-backed benefits threshold',
      achieved: progress.currentWeek >= 5,
    },
    {
      id: '30-day-streak',
      name: '30 Day Streak',
      description: 'Practiced for 30 consecutive days',
      achieved: progress.currentStreak >= 30,
    },
    {
      id: '100-sessions',
      name: '100 Sessions',
      description: 'Completed 100 practice sessions',
      achieved: progress.totalSessions >= 100,
    },
  ];

  return milestones;
}
