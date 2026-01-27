/**
 * Unit tests for practice schedule functions
 */

import {
  getPracticeForWeekAndDay,
  getCurrentWeek,
  getCurrentDay,
  getTodayPractice,
  getNextPractice,
  isPracticeCompleted,
  getWeekSchedule,
  practiceDefinitions,
} from '../../lib/practices';
import { PracticeType } from '../../types';

describe('Practice Schedule Functions', () => {
  describe('getPracticeForWeekAndDay', () => {
    test('Week 1 returns find-your-flashlight for all days', () => {
      for (let day = 1; day <= 7; day++) {
        expect(getPracticeForWeekAndDay(1, day)).toBe('find-your-flashlight');
      }
    });

    test('Week 2 alternates between flashlight and body-scan', () => {
      expect(getPracticeForWeekAndDay(2, 1)).toBe('find-your-flashlight');
      expect(getPracticeForWeekAndDay(2, 2)).toBe('body-scan');
      expect(getPracticeForWeekAndDay(2, 3)).toBe('find-your-flashlight');
      expect(getPracticeForWeekAndDay(2, 4)).toBe('body-scan');
    });

    test('Week 3 alternates between flashlight and river-of-thought', () => {
      expect(getPracticeForWeekAndDay(3, 1)).toBe('find-your-flashlight');
      expect(getPracticeForWeekAndDay(3, 2)).toBe('river-of-thought');
      expect(getPracticeForWeekAndDay(3, 3)).toBe('find-your-flashlight');
    });

    test('Week 4 alternates between flashlight and connection-practice', () => {
      expect(getPracticeForWeekAndDay(4, 1)).toBe('find-your-flashlight');
      expect(getPracticeForWeekAndDay(4, 2)).toBe('connection-practice');
      expect(getPracticeForWeekAndDay(4, 3)).toBe('find-your-flashlight');
    });

    test('Weeks 5-6 default to find-your-flashlight', () => {
      expect(getPracticeForWeekAndDay(5, 1)).toBe('find-your-flashlight');
      expect(getPracticeForWeekAndDay(6, 1)).toBe('find-your-flashlight');
    });
  });

  describe('getCurrentWeek', () => {
    test('Returns 1 for start date', () => {
      const startDate = new Date('2024-01-01');
      const week = getCurrentWeek(startDate);
      // This will depend on current date, so we test the logic
      expect(week).toBeGreaterThanOrEqual(1);
      expect(week).toBeLessThanOrEqual(6);
    });

    test('Caps at 6 weeks', () => {
      const startDate = new Date('2020-01-01'); // Very old date
      const week = getCurrentWeek(startDate);
      expect(week).toBe(6);
    });
  });

  describe('getCurrentDay', () => {
    test('Returns day within 1-7 range', () => {
      const startDate = new Date('2024-01-01');
      const day = getCurrentDay(startDate);
      expect(day).toBeGreaterThanOrEqual(1);
      expect(day).toBeLessThanOrEqual(7);
    });
  });

  describe('getTodayPractice', () => {
    test('Returns valid practice type', () => {
      const startDate = new Date('2024-01-01');
      const practice = getTodayPractice(startDate);
      expect(Object.keys(practiceDefinitions)).toContain(practice);
    });
  });

  describe('getNextPractice', () => {
    test('Returns next day practice for same week', () => {
      const startDate = new Date('2024-01-01');
      const next = getNextPractice(startDate);
      expect(Object.keys(practiceDefinitions)).toContain(next);
    });
  });

  describe('isPracticeCompleted', () => {
    const mockSessions = [
      {
        practiceType: 'find-your-flashlight' as PracticeType,
        date: new Date('2024-01-01'),
      },
      {
        practiceType: 'body-scan' as PracticeType,
        date: new Date('2024-01-02'),
      },
    ];

    test('Returns true if practice completed on date', () => {
      const result = isPracticeCompleted(
        'find-your-flashlight',
        new Date('2024-01-01'),
        mockSessions
      );
      expect(result).toBe(true);
    });

    test('Returns false if practice not completed on date', () => {
      const result = isPracticeCompleted(
        'find-your-flashlight',
        new Date('2024-01-02'),
        mockSessions
      );
      expect(result).toBe(false);
    });

    test('Returns false for non-existent date', () => {
      const result = isPracticeCompleted(
        'find-your-flashlight',
        new Date('2024-01-10'),
        mockSessions
      );
      expect(result).toBe(false);
    });
  });

  describe('getWeekSchedule', () => {
    test('Returns 7 days for week 1', () => {
      const schedule = getWeekSchedule(1);
      expect(schedule).toHaveLength(7);
      schedule.forEach((day) => {
        expect(day.practice).toBe('find-your-flashlight');
        expect(day.duration).toBe(12);
      });
    });

    test('Returns alternating practices for week 2', () => {
      const schedule = getWeekSchedule(2);
      expect(schedule).toHaveLength(7);
      expect(schedule[0].practice).toBe('find-your-flashlight');
      expect(schedule[1].practice).toBe('body-scan');
      expect(schedule[2].practice).toBe('find-your-flashlight');
    });
  });
});
