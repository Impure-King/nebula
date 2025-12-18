import React from 'react';
import { View, TextInput, Pressable } from 'react-native';
import { Search, Sparkles, XCircle } from 'lucide-react-native';

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  onSearch?: () => void;
  placeholder?: string;
  isSemantic?: boolean;
  onToggleSemantic?: (value: boolean) => void;
}

export default function SearchBar({
  value,
  onChangeText,
  onSearch,
  placeholder = 'Search notes...',
  isSemantic = false,
  onToggleSemantic
}: SearchBarProps) {
  const handleClear = () => {
    onChangeText('');
  };

  return (
    <View className="bg-base-200 rounded-xl border border-base-300 flex-row items-center px-4" style={{ minHeight: 48 }}>
      <Pressable onPress={onSearch} hitSlop={8}>
        <Search size={20} color="#94a3b8" />
      </Pressable>
      <TextInput
        className="flex-1 text-base-content font-inter ml-3 text-base"
        value={value}
        onChangeText={onChangeText}
        onSubmitEditing={onSearch}
        returnKeyType="search"
        placeholder={placeholder}
        placeholderTextColor="#94a3b8"
        accessibilityLabel="Search notes"
        accessibilityHint="Type to search notes by title"
      />
      {onToggleSemantic && (
        <Pressable
          onPress={() => onToggleSemantic(!isSemantic)}
          hitSlop={8}
          className="ml-2"
          accessibilityRole="switch"
          accessibilityLabel={`Switch to ${isSemantic ? 'keyword' : 'semantic'} search`}
          accessibilityState={{ checked: isSemantic }}
        >
          <Sparkles
            size={20}
            color={isSemantic ? "#60a5fa" : "#94a3b8"}
            fill={isSemantic ? "#60a5fa" : "transparent"} // Fill effect for active state
          />
        </Pressable>
      )}
      {value.length > 0 && (
        <Pressable
          onPress={handleClear}
          hitSlop={12}
          style={{ minWidth: 44, minHeight: 44, justifyContent: 'center', alignItems: 'center' }}
          accessibilityLabel="Clear search"
          accessibilityRole="button"
        >
          <XCircle size={20} color="#94a3b8" />
        </Pressable>
      )}
    </View>
  );
}
