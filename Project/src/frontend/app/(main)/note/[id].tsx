import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  View,
  TextInput,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableOpacity,
  Text,
  Alert,
  useWindowDimensions,
  Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Note } from '../../../types/note';
import { SAMPLE_NOTES } from '../../../data/sampleNotes';

export default function NoteDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { width } = useWindowDimensions();

  // Calculate responsive padding and max width
  const contentPadding = width >= 768 ? 48 : 24;
  const maxContentWidth = width >= 1024 ? 800 : width;

  // State management for note detail
  const [note, setNote] = useState<Note | null>(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isDirty, setIsDirty] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  // Refs for debouncing and animations
  const saveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  // Load note data based on route parameter
  useEffect(() => {
    if (id === 'new') {
      // Handle new note creation
      const newNote: Note = {
        id: Date.now().toString(),
        title: '',
        content: '',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        tags: [],
      };
      setNote(newNote);
      setTitle('');
      setContent('');
    } else {
      // Load existing note
      const existingNote = SAMPLE_NOTES.find(n => n.id === id);
      if (existingNote) {
        setNote(existingNote);
        setTitle(existingNote.title);
        setContent(existingNote.content);
      } else {
        // Note not found - show error and navigate back
        Alert.alert(
          'Note Not Found',
          'The note you are looking for could not be found. It may have been deleted.',
          [
            {
              text: 'OK',
              onPress: () => router.back(),
            },
          ]
        );
      }
    }

    // Fade in animation
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [id, fadeAnim, router]);

  // Debounced save function (2 second delay)
  const debouncedSave = useCallback(() => {
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    saveTimeoutRef.current = setTimeout(() => {
      saveNote();
    }, 2000);
  }, [title, content]);

  // Save note function with retry logic
  const saveNote = useCallback(async (retryCount = 0) => {
    if (!note) return;

    setIsSaving(true);

    try {
      // Simulate save operation
      await new Promise(resolve => setTimeout(resolve, 500));

      // Update note with new data
      const updatedNote: Note = {
        ...note,
        title,
        content,
        updated_at: new Date().toISOString(),
      };

      // In a real app, this would save to backend/database
      console.log('Note saved:', updatedNote);

      setLastSaved(new Date());
      setIsDirty(false);
      setIsSaving(false);
    } catch (error) {
      console.error('Failed to save note:', error);
      setIsSaving(false);

      // Retry logic with exponential backoff
      if (retryCount < 3) {
        const delay = Math.pow(2, retryCount) * 1000; // 1s, 2s, 4s
        setTimeout(() => {
          saveNote(retryCount + 1);
        }, delay);
        Alert.alert(
          'Save Failed',
          `Unable to save changes. Retrying in ${delay / 1000} seconds...`,
          [{ text: 'OK' }]
        );
      } else {
        // After 3 retries, give user options
        Alert.alert(
          'Save Failed',
          'Unable to save changes after multiple attempts. Your changes are kept in memory.',
          [
            {
              text: 'Copy Content',
              onPress: () => {
                // In a real app, copy to clipboard
                console.log('Content copied to clipboard');
              },
            },
            {
              text: 'Try Again',
              onPress: () => saveNote(0),
            },
            {
              text: 'Cancel',
              style: 'cancel',
            },
          ]
        );
      }
    }
  }, [note, title, content]);

  // Handle title change
  const handleTitleChange = useCallback((text: string) => {
    setTitle(text);
    setIsDirty(true);
    debouncedSave();
  }, [debouncedSave]);

  // Handle content change
  const handleContentChange = useCallback((text: string) => {
    setContent(text);
    setIsDirty(true);
    debouncedSave();
  }, [debouncedSave]);

  // Handle back navigation
  const handleBack = useCallback(() => {
    if (isDirty) {
      // Save before navigating away
      saveNote();
    }
    router.back();
  }, [isDirty, saveNote, router]);

  // Handle delete with error handling
  const handleDelete = useCallback(async () => {
    Alert.alert(
      'Delete Note',
      'Are you sure you want to delete this note? This action cannot be undone.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              // In a real app, this would delete from backend/database
              await new Promise(resolve => setTimeout(resolve, 500));
              console.log('Note deleted:', note?.id);
              Alert.alert('Success', 'Note deleted successfully', [
                {
                  text: 'OK',
                  onPress: () => router.back(),
                },
              ]);
            } catch (error) {
              console.error('Failed to delete note:', error);
              Alert.alert(
                'Delete Failed',
                'Unable to delete note. Please check your connection and try again.',
                [
                  {
                    text: 'Try Again',
                    onPress: () => handleDelete(),
                  },
                  {
                    text: 'Cancel',
                    style: 'cancel',
                  },
                ]
              );
            }
          },
        },
      ]
    );
  }, [note, router]);

  // Save on unmount if dirty
  useEffect(() => {
    return () => {
      if (isDirty && saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
        // Force immediate save on unmount
        saveNote();
      }
    };
  }, [isDirty, saveNote]);

  if (!note) {
    return (
      <SafeAreaView className="flex-1 bg-black" edges={['top', 'left', 'right']}>
        <StatusBar barStyle="light-content" backgroundColor="#000000" />
        <View 
          className="flex-1 items-center justify-center"
          accessibilityLabel="Loading note"
          accessibilityRole="progressbar"
        >
          <Text className="text-gray-400">Loading...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-black" edges={['top', 'left', 'right']}>
      <StatusBar barStyle="light-content" backgroundColor="#000000" />
      
      <Animated.View style={{ flex: 1, opacity: fadeAnim }}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          className="flex-1"
        >
          {/* Header with back button and actions */}
          <View 
          className="flex-row items-center justify-between py-4 border-b border-gray-800"
          style={{ paddingHorizontal: contentPadding }}
        >
          <TouchableOpacity
            onPress={handleBack}
            className="p-2"
            style={{ minWidth: 44, minHeight: 44 }}
            accessibilityLabel="Go back"
            accessibilityRole="button"
          >
            <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
          </TouchableOpacity>

          <View className="flex-row items-center">
            {/* Save indicator */}
            {isSaving && (
              <View 
                className="flex-row items-center mr-4"
                accessibilityLabel="Saving note"
                accessibilityLiveRegion="polite"
              >
                <Text className="text-gray-400 text-sm mr-2">Saving...</Text>
                <View className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
              </View>
            )}
            {!isSaving && lastSaved && (
              <Text 
                className="text-gray-500 text-sm mr-4"
                accessibilityLabel="Note saved"
                accessibilityLiveRegion="polite"
              >
                Saved
              </Text>
            )}

            {/* Delete button */}
            {id !== 'new' && (
              <TouchableOpacity
                onPress={handleDelete}
                className="p-2"
                style={{ minWidth: 44, minHeight: 44 }}
                accessibilityLabel="Delete note"
                accessibilityRole="button"
              >
                <Ionicons name="trash-outline" size={24} color="#EF4444" />
              </TouchableOpacity>
            )}
          </View>
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{
            paddingHorizontal: contentPadding,
            maxWidth: maxContentWidth,
            width: '100%',
            alignSelf: 'center',
          }}
        >
          {/* Title input */}
          <TextInput
            value={title}
            onChangeText={handleTitleChange}
            placeholder="Note title"
            placeholderTextColor="#6B7280"
            className="text-white text-3xl font-bold py-4 border-b border-gray-800"
            multiline
            accessibilityLabel="Note title"
            accessibilityHint="Enter the title for your note"
          />

          {/* Content editor */}
          <TextInput
            value={content}
            onChangeText={handleContentChange}
            placeholder="Start writing..."
            placeholderTextColor="#6B7280"
            className="text-white text-base leading-relaxed py-6"
            multiline
            textAlignVertical="top"
            style={{ minHeight: 400 }}
            accessibilityLabel="Note content"
            accessibilityHint="Enter the content for your note. Supports markdown formatting."
          />
        </ScrollView>
      </KeyboardAvoidingView>
      </Animated.View>
    </SafeAreaView>
  );
}
