import React, { memo, useEffect, useRef } from 'react';
import { View, Text, Pressable, ScrollView, Animated } from 'react-native';
import { Note } from '../types/note';
import { formatRelativeTime } from '../utils/noteUtils';

interface NoteCardProps {
  note: Note;
  onPress: (noteId: string) => void;
}

function NoteCard({ note, onPress }: NoteCardProps) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.95)).current;

  useEffect(() => {
    // Fade in and scale animation when card mounts
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 8,
        tension: 40,
        useNativeDriver: true,
      }),
    ]).start();
  }, [fadeAnim, scaleAnim]);

  // Strip markdown formatting for preview
  const getContentPreview = (content: string): string => {
    return content
      .replace(/[#*_`~\[\]]/g, '') // Remove markdown symbols
      .replace(/\n+/g, ' ') // Replace newlines with spaces
      .trim();
  };

  const contentPreview = getContentPreview(note.content);
  const formattedDate = formatRelativeTime(note.updated_at);

  return (
    <Animated.View style={{ opacity: fadeAnim, transform: [{ scale: scaleAnim }] }}>
      <Pressable
        className="bg-base-200 rounded-2xl p-5 border border-base-300"
        style={{ minHeight: 160 }}
        onPress={() => onPress(note.id)}
        android_ripple={{ color: 'rgba(59, 130, 246, 0.1)' }} // Blue 500 ripple
        accessibilityLabel={`Note: ${note.title || 'Untitled Note'}`}
        accessibilityRole="button"
        accessibilityHint={`Opens note. Last updated ${formattedDate}.`}
      >
        {({ pressed }) => (
          <View style={{ opacity: pressed ? 0.9 : 1 }}>
            {/* Title - truncated to 2 lines */}
            <Text
              className="text-base-content font-inter font-semibold text-lg mb-2 leading-tight"
              numberOfLines={2}
              ellipsizeMode="tail"
              accessibilityRole="header"
            >
              {note.title || 'Untitled Note'}
            </Text>

            {/* Content preview - truncated to 3 lines */}
            <Text
              className="text-base-content/70 font-inter text-sm mb-4 leading-relaxed"
              numberOfLines={3}
              ellipsizeMode="tail"
            >
              {contentPreview || 'No content description available.'}
            </Text>

            {/* Date */}
            <Text className="text-primary font-inter font-medium text-xs">
              {formattedDate}
            </Text>

          </View>
        )}
      </Pressable>
    </Animated.View>
  );
}

// Memoize component to prevent unnecessary re-renders
export default memo(NoteCard, (prevProps, nextProps) => {
  // Only re-render if note data or onPress function changes
  return (
    prevProps.note.id === nextProps.note.id &&
    prevProps.note.title === nextProps.note.title &&
    prevProps.note.content === nextProps.note.content &&
    prevProps.note.updated_at === nextProps.note.updated_at &&
    prevProps.onPress === nextProps.onPress
  );
});
