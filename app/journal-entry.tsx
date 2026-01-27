/**
 * Journal Entry Screen
 * Create or edit journal entries linked to practice sessions
 */

import React, { useState, useEffect } from 'react';
import { useRoute, useNavigation } from '@react-navigation/native';
import JournalEntry from '../components/JournalEntry';
import { saveJournalEntry } from '../lib/storage';
import { JournalEntry as JournalEntryType, PracticeType } from '../types';

type RouteParams = {
  sessionId?: string;
  practiceType?: PracticeType;
  entryId?: string; // For editing
};

export default function JournalEntryScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const { sessionId, practiceType, entryId } = (route.params || {}) as RouteParams;

  const handleSave = async (entry: Omit<JournalEntryType, 'id' | 'date'>) => {
    try {
      const newEntry: JournalEntryType = {
        id: entryId || `entry-${Date.now()}`,
        sessionId: entry.sessionId || sessionId || '',
        date: new Date(),
        content: entry.content,
        mood: entry.mood,
        tags: entry.tags,
      };

      await saveJournalEntry(newEntry);
      navigation.goBack();
    } catch (error) {
      console.error('Error saving journal entry:', error);
    }
  };

  const handleCancel = () => {
    navigation.goBack();
  };

  return (
    <JournalEntry
      sessionId={sessionId}
      practiceType={practiceType}
      onSave={handleSave}
      onCancel={handleCancel}
    />
  );
}
