/**
 * Session Check-In Screen
 * Captures post-session feedback metrics
 */

import React from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import SessionCheckIn from '../components/SessionCheckIn';
import { updateSession } from '../lib/storage';
import { PracticeType } from '../types';

type RouteParams = {
  sessionId: string;
  practiceType?: PracticeType;
  lapseCount?: number;
  longestFocusIntervalSec?: number;
};

export default function SessionCheckInScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { sessionId, practiceType, lapseCount, longestFocusIntervalSec } =
    (route.params || {}) as RouteParams;

  const handleSave = async (data: {
    focusQuality: number;
    mood: number;
    stress: number;
    energy: number;
    lapseCount: number;
  }) => {
    try {
      await updateSession(sessionId, {
        focusQuality: data.focusQuality,
        mood: data.mood,
        stress: data.stress,
        energy: data.energy,
        lapseCount: data.lapseCount,
        longestFocusIntervalSec,
      });
      navigation.navigate('JournalEntry' as never, {
        sessionId,
        practiceType,
      } as never);
    } catch (error) {
      console.error('Error saving session check-in:', error);
      navigation.navigate('JournalEntry' as never, {
        sessionId,
        practiceType,
      } as never);
    }
  };

  const handleSkip = () => {
    navigation.navigate('JournalEntry' as never, {
      sessionId,
      practiceType,
    } as never);
  };

  return (
    <SessionCheckIn
      sessionId={sessionId}
      practiceType={practiceType}
      initialLapseCount={lapseCount}
      onSave={handleSave}
      onSkip={handleSkip}
    />
  );
}
