/**
 * Journal Screen
 * View and create journal entries
 */

import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { getJournalEntries, deleteJournalEntry, getSessionById } from '../../lib/storage';
import { JournalEntry as JournalEntryType } from '../../types';
import { practiceDefinitions } from '../../lib/practices';

interface JournalEntryWithPractice extends JournalEntryType {
  practiceName?: string;
}

export default function JournalScreen() {
  const navigation = useNavigation();
  const [entries, setEntries] = useState<JournalEntryWithPractice[]>([]);

  useEffect(() => {
    loadEntries();
  }, []);

  const loadEntries = async () => {
    try {
      const journalEntries = await getJournalEntries();
      // Sort by date, newest first
      const sorted = journalEntries.sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
      );

      // Load practice names for entries with session IDs
      const entriesWithPractice = await Promise.all(
        sorted.map(async (entry) => {
          let practiceName = 'Practice Session';
          if (entry.sessionId) {
            try {
              const session = await getSessionById(entry.sessionId);
              if (session) {
                practiceName = practiceDefinitions[session.practiceType]?.name || practiceName;
              }
            } catch (error) {
              // Ignore errors, use default
            }
          }
          return { ...entry, practiceName };
        })
      );

      setEntries(entriesWithPractice);
    } catch (error) {
      console.error('Error loading journal entries:', error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteJournalEntry(id);
      loadEntries();
    } catch (error) {
      console.error('Error deleting entry:', error);
    }
  };

  const formatDate = (date: Date): string => {
    const d = new Date(date);
    return d.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Journal</Text>
        <Text style={styles.subtitle}>Reflect on your practice</Text>
      </View>

      <ScrollView style={styles.content}>
        <Pressable
          style={({ pressed }) => [
            styles.newEntryButton,
            pressed && styles.newEntryButtonPressed
          ]}
          onPress={() => {
            navigation.navigate('JournalEntry' as never);
          }}
        >
          <Text style={styles.newEntryButtonText}>+ New Entry</Text>
        </Pressable>

        {entries.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>No journal entries yet</Text>
            <Text style={styles.emptyStateSubtext}>
              Start a practice session to create your first entry
            </Text>
          </View>
        ) : (
          entries.map((entry) => (
            <View key={entry.id} style={styles.entryCard}>
              <View style={styles.entryHeader}>
                <View>
                  <Text style={styles.entryDate}>{formatDate(entry.date)}</Text>
                  {entry.practiceName && (
                    <Text style={styles.entryPractice}>{entry.practiceName}</Text>
                  )}
                </View>
                <Pressable
                  onPress={() => handleDelete(entry.id)}
                  style={({ pressed }) => [
                    styles.deleteButton,
                    pressed && styles.deleteButtonPressed
                  ]}
                >
                  <Text style={styles.deleteButtonText}>Delete</Text>
                </Pressable>
              </View>
              {entry.mood && (
                <Text style={styles.entryMood}>
                  Mood: {entry.mood.charAt(0).toUpperCase() + entry.mood.slice(1)}
                </Text>
              )}
              <Text style={styles.entryContent}>{entry.content}</Text>
              {entry.tags && entry.tags.length > 0 && (
                <View style={styles.tagsContainer}>
                  {entry.tags.map((tag) => (
                    <View key={tag} style={styles.tag}>
                      <Text style={styles.tagText}>{tag}</Text>
                    </View>
                  ))}
                </View>
              )}
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
  header: {
    paddingTop: 64,        // 8px grid
    paddingHorizontal: 24,  // 8px grid
    paddingBottom: 24,      // 8px grid
    backgroundColor: '#FFFFFF',
    shadowColor: '#1D4ED8',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 8,        // 8px grid
  },
  subtitle: {
    fontSize: 16,
    color: '#475569',       // Better contrast
    fontWeight: '400',
  },
  content: {
    flex: 1,
    padding: 24,            // 8px grid
  },
  newEntryButton: {
    backgroundColor: '#1D4ED8',
    paddingVertical: 16,    // Accessibility
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
    minHeight: 48,
    justifyContent: 'center',
    marginBottom: 24,       // 8px grid
    shadowColor: '#1D4ED8',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  newEntryButtonPressed: {
    backgroundColor: '#1E40AF',
    transform: [{ scale: 0.98 }],
    shadowOpacity: 0.2,
  },
  newEntryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 0.3,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 64,    // 8px grid
  },
  emptyStateText: {
    fontSize: 18,
    color: '#475569',       // Better contrast
    marginBottom: 8,
    fontWeight: '500',
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#64748B',       // Better contrast
    textAlign: 'center',
    lineHeight: 20,
  },
  entryCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,       // 8px grid
    padding: 24,            // 8px grid
    marginBottom: 16,
    shadowColor: '#1D4ED8',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
  },
  entryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  entryDate: {
    fontSize: 14,
    fontWeight: '600',
    color: '#475569',       // Better contrast
    marginBottom: 4,        // 8px grid
  },
  entryPractice: {
    fontSize: 12,
    color: '#1D4ED8',
    fontWeight: '500',
  },
  deleteButton: {
    paddingHorizontal: 8,
    paddingVertical: 8,     // 8px grid
    minHeight: 32,
  },
  deleteButtonPressed: {
    opacity: 0.6,
  },
  deleteButtonText: {
    fontSize: 12,
    color: '#DC2626',       // Slightly brighter red
    fontWeight: '600',
  },
  entryMood: {
    fontSize: 14,
    color: '#1D4ED8',
    marginBottom: 8,
    fontStyle: 'italic',
    fontWeight: '500',
  },
  entryContent: {
    fontSize: 14,
    color: '#0F172A',
    lineHeight: 20,
    marginBottom: 16,       // 8px grid
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,                 // 8px grid
  },
  tag: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 16,       // 8px grid
    backgroundColor: '#E0E7FF',
  },
  tagText: {
    fontSize: 12,
    color: '#1D4ED8',
    fontWeight: '500',
  },
});
