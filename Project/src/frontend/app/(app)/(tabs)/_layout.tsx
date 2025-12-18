import { Tabs } from "expo-router";
import { useColorScheme } from "react-native";
import { File, UserRound } from 'lucide-react-native';

export default function TabsLayout() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: isDark ? '#000000' : '#FFFFFF',
          borderTopColor: isDark ? '#27272A' : '#E4E4E7',
          borderTopWidth: 1,
        },
        tabBarActiveTintColor: isDark ? '#3B82F6' : '#2563EB',
        tabBarInactiveTintColor: isDark ? '#71717A' : '#A1A1AA',
      }}
    >
      <Tabs.Screen 
        name="notes" 
        options={{ 
          title: "Notes",
          tabBarIcon: ({ color, size }) => (
            <File size={size} color={color} />
          ),
        }} 
      />
      <Tabs.Screen 
        name="profile" 
        options={{ 
          title: "Profile",
          tabBarIcon: ({ color, size }) => (
            <UserRound size={size} color={color} />
          ),
        }} 
      />
    </Tabs>
  );
}
