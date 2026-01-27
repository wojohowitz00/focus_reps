/**
 * Journal Screen
 * View and create journal entries
 */

import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';

export default function JournalScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Journal</Text>
        <Text style={styles.subtitle}>Reflect on your practice</Text>
      </View>

      <ScrollView style={styles.content}>
        <TouchableOpacity style={styles.newEntryButton}>
          <Text style={styles.newEntryButtonText}>+ New Entry</Text>
        </TouchableOpacity>

        <View style={styles.emptyState}>
          <Text style={styles.emptyStateText}>No journal entries yet</Text>
          <Text style={styles.emptyStateSubtext}>
            Start a practice session to create your first entry
          </Text>
        </View>
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
});
