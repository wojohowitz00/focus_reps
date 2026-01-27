/**
 * Journal Screen
 * View and create journal entries
 */

import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
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
        <TouchableOpacity
          style={styles.newEntryButton}
          onPress={() => {
            navigation.navigate('JournalEntry' as never);
          }}
        >
          <Text style={styles.newEntryButtonText}>+ New Entry</Text>
        </TouchableOpacity>

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
                <TouchableOpacity
                  onPress={() => handleDelete(entry.id)}
                  style={styles.deleteButton}
                >
                  <Text style={styles.deleteButtonText}>Delete</Text>
                </TouchableOpacity>
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
    backgroundColor: '#f5f5f5',
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  newEntryButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 20,
  },
  newEntryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyStateText: {
    fontSize: 18,
    color: '#666',
    marginBottom: 8,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
  },
  entryCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
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
    color: '#666',
    marginBottom: 2,
  },
  entryPractice: {
    fontSize: 12,
    color: '#4CAF50',
    fontWeight: '500',
  },
  deleteButton: {
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  deleteButtonText: {
    fontSize: 12,
    color: '#f44336',
  },
  entryMood: {
    fontSize: 14,
    color: '#4CAF50',
    marginBottom: 8,
    fontStyle: 'italic',
  },
  entryContent: {
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
    marginBottom: 12,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  tag: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 12,
    backgroundColor: '#f1f8f4',
  },
  tagText: {
    fontSize: 12,
    color: '#4CAF50',
  },
});
