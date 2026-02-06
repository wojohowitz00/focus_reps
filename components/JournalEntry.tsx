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
    backgroundColor: '#F5F7FA',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    padding: 20,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#0F172A',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#64748B',
  },
  section: {
    padding: 20,
    backgroundColor: '#FFFFFF',
    marginTop: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#0F172A',
    marginBottom: 12,
  },
  prompt: {
    fontSize: 14,
    color: '#1D4ED8',
    fontStyle: 'italic',
    marginBottom: 12,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#0F172A',
    minHeight: 150,
    backgroundColor: '#F8FAFC',
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
    borderColor: '#E2E8F0',
    backgroundColor: '#FFFFFF',
  },
  moodOptionSelected: {
    borderColor: '#1D4ED8',
    backgroundColor: '#E8EEFF',
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
    borderColor: '#E2E8F0',
    backgroundColor: '#FFFFFF',
  },
  tagSelected: {
    borderColor: '#1D4ED8',
    backgroundColor: '#E8EEFF',
  },
  tagText: {
    fontSize: 14,
    color: '#64748B',
  },
  tagTextSelected: {
    color: '#1D4ED8',
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
    borderColor: '#CBD5E1',
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#64748B',
  },
  saveButton: {
    flex: 2,
    paddingVertical: 14,
    borderRadius: 8,
    backgroundColor: '#1D4ED8',
    alignItems: 'center',
  },
  saveButtonDisabled: {
    backgroundColor: '#ccc',
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});
