/**
 * Weekly Review Screen
 */

import React, { useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import WeeklyReview from '../components/WeeklyReview';
import { getWeeklySummary, getWeeklyRecommendation } from '../lib/progress';
import { getCurrentWeek } from '../lib/practices';
import { getSettings } from '../lib/storage';
import { WeeklySummary } from '../types';

export default function WeeklyReviewScreen() {
  const navigation = useNavigation();
  const [summary, setSummary] = useState<WeeklySummary | null>(null);

  useEffect(() => {
    loadSummary();
  }, []);

  const loadSummary = async () => {
    const settings = await getSettings();
    const startDate = settings?.programStartDate
      ? new Date(settings.programStartDate)
      : new Date();
    const programMode = settings?.programMode ?? 'standard_6_week';
    const currentWeek = getCurrentWeek(startDate, programMode);
    const summaryData = await getWeeklySummary(startDate, Math.max(currentWeek - 1, 0));
    setSummary(summaryData);
  };

  if (!summary) {
    return null;
  }

  const recommendation = getWeeklyRecommendation(summary);

  return (
    <WeeklyReview
      summary={summary}
      recommendation={recommendation}
      onStartPractice={(practiceType) =>
        navigation.navigate('PracticeSession' as never, { id: practiceType } as never)
      }
    />
  );
}
