import React, { useState, useCallback, useRef, useEffect } from 'react';
import {
  View,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Text,
  ActivityIndicator,
  Alert,
  Animated,
  useWindowDimensions,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import MarkdownRenderer from './MarkdownRenderer';
import useAIService from '../hooks/useAIService'; // <--- Import our new hook

export interface AIResponse {
  id: string;
  prompt: string;
  response: string;
  timestamp: string;
  type: 'success' | 'error';
}

interface AIToolsSectionProps {
  onClose: () => void;
  noteContent: string;
  noteTitle: string;
}

export const AIToolsSection: React.FC<AIToolsSectionProps> = ({
  onClose,
  noteContent,
  noteTitle,
}) => {
  // 1. Setup State
  const [prompt, setPrompt] = useState('');
  const [responses, setResponses] = useState<AIResponse[]>([]);
  
  // 2. Use our new Hook! (It handles loading/errors for us)
  const { loading, error, processPrompt } = useAIService();

  const { width } = useWindowDimensions();
  const slideAnim = useRef(new Animated.Value(1)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scrollViewRef = useRef<ScrollView>(null);
  const contentPadding = width >= 768 ? 32 : 16;

  // Animation on mount
  useEffect(() => {
    Animated.parallel([
      Animated.timing(slideAnim, { toValue: 0, duration: 300, useNativeDriver: true }),
      Animated.timing(fadeAnim, { toValue: 1, duration: 300, useNativeDriver: true }),
    ]).start();
  }, [slideAnim, fadeAnim]);

  // Auto-scroll to bottom
  useEffect(() => {
    if (responses.length > 0) {
      setTimeout(() => scrollViewRef.current?.scrollToEnd({ animated: true }), 100);
    }
  }, [responses]);

  // 3. The Main Function: Sending the Prompt
  const handleSubmitPrompt = useCallback(async () => {
    if (!prompt.trim()) return;

    const userPrompt = prompt.trim();
    setPrompt(''); // Clear input immediately

    // Call the backend via our hook
    const result = await processPrompt({
      noteTitle,
      noteContent,
      userPrompt,
    });

    if (result) {
      // Success! Add response to list
      const newResponse: AIResponse = {
        id: Date.now().toString(),
        prompt: userPrompt,
        response: result.result,
        timestamp: result.processedAt,
        type: 'success',
      };
      setResponses((prev) => [...prev, newResponse]);
    } else {
      // Failure (The hook sets the 'error' state, but we can also show an alert or log it)
      // We don't add a "success" card, the UI will show the error message below.
    }
  }, [prompt, noteTitle, noteContent, processPrompt]);

  // Helper to clear history
  const handleClearHistory = useCallback(() => {
    Alert.alert('Clear History', 'Delete all AI responses?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Clear', style: 'destructive', onPress: () => setResponses([]) },
    ]);
  }, []);

  const handleCopyResponse = useCallback((text: string) => {
    Alert.alert('Copied', 'Response copied to clipboard');
  }, []);

  return (
    <Animated.View
      style={{ flex: 1, opacity: fadeAnim, transform: [{ translateX: slideAnim }] }}
      className="bg-black"
    >
      {/* Header */}
      <View className="flex-row items-center justify-between py-4 border-b border-gray-800 bg-gray-950" style={{ paddingHorizontal: contentPadding }}>
        <View className="flex-row items-center">
          <Ionicons name="sparkles" size={24} color="#3B82F6" />
          <Text className="text-white text-lg font-semibold ml-2">AI Assistant</Text>
        </View>
        <TouchableOpacity onPress={onClose} className="p-2">
          <Ionicons name="close" size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      <View className="flex-1 flex-col">
        {/* Responses List */}
        <ScrollView
          ref={scrollViewRef}
          className="flex-1 bg-black"
          contentContainerStyle={{ paddingHorizontal: contentPadding, paddingTop: 16, paddingBottom: 16 }}
        >
          {responses.length === 0 && (
            <View className="flex-1 items-center justify-center py-12">
              <Ionicons name="sparkles-outline" size={48} color="#6B7280" />
              <Text className="text-gray-400 text-center mt-4">Ask Gemini about your note</Text>
            </View>
          )}

          {responses.map((response) => (
            <View key={response.id} className="mb-4 bg-gray-900 border border-gray-800 rounded-lg overflow-hidden">
              <View className="px-4 py-3 border-b border-gray-800 flex-row justify-between">
                <Text className="text-gray-400 text-xs">You asked:</Text>
                <TouchableOpacity onPress={() => handleCopyResponse(response.response)}>
                  <Ionicons name="copy-outline" size={16} color="#3B82F6" />
                </TouchableOpacity>
              </View>
              <View className="px-4 py-3 bg-gray-900/50">
                <Text className="text-gray-300 text-sm">{response.prompt}</Text>
              </View>
              <View className="px-4 py-3">
                <Text className="text-xs text-gray-400 mb-2">Gemini:</Text>
                <View className="bg-black rounded px-2 py-2">
                  <MarkdownRenderer content={response.response} />
                </View>
              </View>
            </View>
          ))}

          {/* Loading State */}
          {loading && (
            <View className="mb-4 p-4 flex-row items-center justify-center bg-gray-900 rounded-lg">
              <ActivityIndicator size="small" color="#3B82F6" />
              <Text className="text-blue-400 text-sm ml-2">Gemini is thinking...</Text>
            </View>
          )}

          {/* Error Message (from the hook) */}
          {error && (
            <View className="mb-4 p-3 bg-red-900/20 border border-red-800 rounded flex-row">
              <Ionicons name="alert-circle" size={20} color="#EF4444" />
              <Text className="text-red-300 text-sm flex-1 ml-2">{error}</Text>
            </View>
          )}
        </ScrollView>

        {/* Input Area */}
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} keyboardVerticalOffset={Platform.OS === 'ios' ? 120 : 0} className="border-t border-gray-800 bg-gray-950">
          <View className="p-4" style={{ paddingHorizontal: contentPadding }}>
            {/* Quick Actions */}
            <ScrollView horizontal className="mb-3 -mx-4 px-4" showsHorizontalScrollIndicator={false}>
              {[
                { label: 'Summarize', icon: 'list', text: 'Summarize this note in 3 bullet points' },
                { label: 'Ideas', icon: 'bulb', text: 'Generate 3 actionable ideas from this note' },
                { label: 'Polish', icon: 'checkmark-done', text: 'Improve the grammar and clarity of this note' }
              ].map((action, idx) => (
                <TouchableOpacity
                  key={idx}
                  onPress={() => setPrompt(action.text)}
                  className="bg-gray-800 rounded-full px-3 py-2 mr-2 flex-row items-center"
                >
                  <Ionicons name={action.icon as any} size={16} color="#3B82F6" />
                  <Text className="text-white text-xs ml-1 font-medium">{action.label}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            <View className="bg-gray-900 rounded-lg border border-gray-800 flex-row items-center pr-2">
              <TextInput
                value={prompt}
                onChangeText={setPrompt}
                placeholder="Ask Gemini..."
                placeholderTextColor="#6B7280"
                className="text-white text-base px-4 py-3 flex-1 min-h-12"
                multiline
                maxLength={500}
                editable={!loading}
              />
              <TouchableOpacity onPress={handleSubmitPrompt} disabled={loading || !prompt.trim()}>
                <Ionicons name="send" size={24} color={loading || !prompt.trim() ? "#4B5563" : "#3B82F6"} />
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </View>
    </Animated.View>
  );
};

export default AIToolsSection;