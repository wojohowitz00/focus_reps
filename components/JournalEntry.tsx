/**
 * Journal Entry Component
 * Form for creating and editing journal entries
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import { JournalEntry as JournalEntryType, PracticeType } from '../types';

interface JournalEntryProps {
  sessionId?: string;
  practiceType?: PracticeType;
  onSave: (entry: Omit<JournalEntryType, 'id' | 'date'>) => void;
  onCancel?: () => void;
  initialContent?: string;
}

const REFLECTION_PROMPTS = [
  'How did this session feel?',
  'What did you notice during practice?',
  'Any challenges or insights?',
  'How is your attention today?',
];

const MOOD_OPTIONS = [
  { label: '😌 Calm', value: 'calm' },
  { label: '😊 Peaceful', value: 'peaceful' },
  { label: '😐 Neutral', value: 'neutral' },
  { label: '😰 Anxious', value: 'anxious' },
  { label: '😤 Frustrated', value: 'frustrated' },
  { label: '😴 Sleepy', value: 'sleepy' },
];

const TAG_OPTIONS = [
  'calm',
  'distracted',
  'focused',
  'restless',
  'insightful',
  'challenging',
  'peaceful',
];

export default function JournalEntry({
  sessionId,
  practiceType,
  onSave,
  onCancel,
  initialContent = '',
}: JournalEntryProps) {
  const [content, setContent] = useState(initialContent);
  const [mood, setMood] = useState<string>('');
  const [tags, setTags] = useState<string[]>([]);

  const handleTagToggle = (tag: string) => {
    if (tags.includes(tag)) {
      setTags(tags.filter((t) => t !== tag));
    } else {
      setTags([...tags, tag]);
    }
  };

  const handleSave = () => {
    if (!content.trim()) {
      return; // Don't save empty entries
    }

    onSave({
      sessionId: sessionId || '',
      date: new Date(),
      content: content.trim(),
      mood: mood || undefined,
      tags: tags.length > 0 ? tags : undefined,
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <Text style={styles.title}>Journal Entry</Text>
          {practiceType && (
            <Text style={styles.subtitle}>
              {practiceType.replace(/-/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase())}
            </Text>
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Reflection</Text>
          <Text style={styles.prompt}>
            {REFLECTION_PROMPTS[Math.floor(Math.random() * REFLECTION_PROMPTS.length)]}
          </Text>
          <TextInput
            style={styles.textInput}
            multiline
            numberOfLines={8}
            placeholder="Write your thoughts here..."
            value={content}
            onChangeText={setContent}
            textAlignVertical="top"
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Mood</Text>
          <View style={styles.moodContainer}>
            {MOOD_OPTIONS.map((option) => (
              <TouchableOpacity
                key={option.value}
                style={[
                  styles.moodOption,
                  mood === option.value && styles.moodOptionSelected,
                ]}
                onPress={() => setMood(option.value)}
              >
                <Text style={styles.moodText}>{option.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Tags</Text>
          <View style={styles.tagsContainer}>
            {TAG_OPTIONS.map((tag) => (
              <TouchableOpacity
                key={tag}
                style={[
                  styles.tag,
                  tags.includes(tag) && styles.tagSelected,
                ]}
                onPress={() => handleTagToggle(tag)}
              >
                <Text
                  style={[
                    styles.tagText,
                    tags.includes(tag) && styles.tagTextSelected,
                  ]}
                >
                  {tag}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.actions}>
          {onCancel && (
            <TouchableOpacity style={styles.cancelButton} onPress={onCancel}>
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity
            style={[styles.saveButton, !content.trim() && styles.saveButtonDisabled]}
            onPress={handleSave}
            disabled={!content.trim()}
          >
            <Text style={styles.saveButtonText}>Save Entry</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    padding: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
  section: {
    padding: 20,
    backgroundColor: '#fff',
    marginTop: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  prompt: {
    fontSize: 14,
    color: '#4CAF50',
    fontStyle: 'italic',
    marginBottom: 12,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#333',
    minHeight: 150,
    backgroundColor: '#fafafa',
  },
  moodContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  moodOption: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#e0e0e0',
    backgroundColor: '#fff',
  },
  moodOptionSelected: {
    borderColor: '#4CAF50',
    backgroundColor: '#f1f8f4',
  },
  moodText: {
    fontSize: 16,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tag: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    backgroundColor: '#fff',
  },
  tagSelected: {
    borderColor: '#4CAF50',
    backgroundColor: '#f1f8f4',
  },
  tagText: {
    fontSize: 14,
    color: '#666',
  },
  tagTextSelected: {
    color: '#4CAF50',
    fontWeight: '600',
  },
  actions: {
    flexDirection: 'row',
    padding: 20,
    gap: 12,
    marginBottom: 40,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#ddd',
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
  },
  saveButton: {
    flex: 2,
    paddingVertical: 14,
    borderRadius: 8,
    backgroundColor: '#4CAF50',
    alignItems: 'center',
  },
  saveButtonDisabled: {
    backgroundColor: '#ccc',
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
});
