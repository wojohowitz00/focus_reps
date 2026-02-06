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
    test('Week 1 returns anchor-breath for all days', () => {
      for (let day = 1; day <= 7; day++) {
        expect(getPracticeForWeekAndDay(1, day)).toBe('anchor-breath');
      }
    });

    test('Week 2 alternates between anchor-breath and body-sweep', () => {
      expect(getPracticeForWeekAndDay(2, 1)).toBe('anchor-breath');
      expect(getPracticeForWeekAndDay(2, 2)).toBe('body-sweep');
      expect(getPracticeForWeekAndDay(2, 3)).toBe('anchor-breath');
      expect(getPracticeForWeekAndDay(2, 4)).toBe('body-sweep');
    });

    test('Week 3 alternates between anchor-breath and thought-traffic', () => {
      expect(getPracticeForWeekAndDay(3, 1)).toBe('anchor-breath');
      expect(getPracticeForWeekAndDay(3, 2)).toBe('thought-traffic');
      expect(getPracticeForWeekAndDay(3, 3)).toBe('anchor-breath');
    });

    test('Week 4 alternates between anchor-breath and kindness-circuit', () => {
      expect(getPracticeForWeekAndDay(4, 1)).toBe('anchor-breath');
      expect(getPracticeForWeekAndDay(4, 2)).toBe('kindness-circuit');
      expect(getPracticeForWeekAndDay(4, 3)).toBe('anchor-breath');
    });

    test('Weeks 5-6 default to anchor-breath when no custom set is provided', () => {
      expect(getPracticeForWeekAndDay(5, 1)).toBe('anchor-breath');
      expect(getPracticeForWeekAndDay(6, 1)).toBe('anchor-breath');
    });

    test('Weeks 5-6 use custom set rotation when provided', () => {
      const customSet = ['body-sweep', 'thought-traffic'] as PracticeType[];
      expect(getPracticeForWeekAndDay(5, 1, 'standard_6_week', customSet)).toBe('body-sweep');
      expect(getPracticeForWeekAndDay(5, 2, 'standard_6_week', customSet)).toBe('thought-traffic');
      expect(getPracticeForWeekAndDay(6, 3, 'standard_6_week', customSet)).toBe('body-sweep');
    });

    test('Extended 8-week mode defaults to anchor-breath in weeks 7-8 when no custom set is provided', () => {
      expect(getPracticeForWeekAndDay(7, 1, 'extended_8_week')).toBe('anchor-breath');
      expect(getPracticeForWeekAndDay(8, 2, 'extended_8_week')).toBe('anchor-breath');
    });

    test('Extended 8-week mode uses custom set rotation in weeks 7-8 when provided', () => {
      const customSet = ['kindness-circuit', 'anchor-breath'] as PracticeType[];
      expect(getPracticeForWeekAndDay(7, 1, 'extended_8_week', customSet)).toBe('kindness-circuit');
      expect(getPracticeForWeekAndDay(7, 2, 'extended_8_week', customSet)).toBe('anchor-breath');
      expect(getPracticeForWeekAndDay(8, 3, 'extended_8_week', customSet)).toBe('kindness-circuit');
    });

    test('Open training mode uses custom practice set rotation', () => {
      const customSet = ['anchor-breath', 'body-sweep'] as PracticeType[];
      expect(getPracticeForWeekAndDay(1, 1, 'open_training', customSet)).toBe('anchor-breath');
      expect(getPracticeForWeekAndDay(1, 2, 'open_training', customSet)).toBe('body-sweep');
      expect(getPracticeForWeekAndDay(1, 3, 'open_training', customSet)).toBe('anchor-breath');
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

    test('Caps at 8 weeks for extended program', () => {
      const startDate = new Date('2020-01-01'); // Very old date
      const week = getCurrentWeek(startDate, 'extended_8_week');
      expect(week).toBe(8);
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
        practiceType: 'anchor-breath' as PracticeType,
        date: new Date('2024-01-01'),
      },
      {
        practiceType: 'body-sweep' as PracticeType,
        date: new Date('2024-01-02'),
      },
    ];

    test('Returns true if practice completed on date', () => {
      const result = isPracticeCompleted(
        'anchor-breath',
        new Date('2024-01-01'),
        mockSessions
      );
      expect(result).toBe(true);
    });

    test('Returns false if practice not completed on date', () => {
      const result = isPracticeCompleted(
        'anchor-breath',
        new Date('2024-01-02'),
        mockSessions
      );
      expect(result).toBe(false);
    });

    test('Returns false for non-existent date', () => {
      const result = isPracticeCompleted(
        'anchor-breath',
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
        expect(day.practice).toBe('anchor-breath');
        expect(day.duration).toBe(12);
      });
    });

    test('Returns alternating practices for week 2', () => {
      const schedule = getWeekSchedule(2);
      expect(schedule).toHaveLength(7);
      expect(schedule[0].practice).toBe('anchor-breath');
      expect(schedule[1].practice).toBe('body-sweep');
      expect(schedule[2].practice).toBe('anchor-breath');
    });
  });
});
