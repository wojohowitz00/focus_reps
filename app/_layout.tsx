import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import HomeScreen from './(tabs)/index';
import PracticeScreen from './(tabs)/practice';
import ProgressScreen from './(tabs)/progress';
import JournalScreen from './(tabs)/journal';
import PracticeSessionScreen from './practice/[id]';
import OnboardingScreen from './onboarding';
import JournalEntryScreen from './journal-entry';
import SessionCheckInScreen from './session-checkin';
import WeeklyReviewScreen from './weekly-review';
import SettingsScreen from './(tabs)/settings';
import PracticeHistoryScreen from './practice-history';
import { getProgress } from '../lib/storage';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#4CAF50',
        tabBarInactiveTintColor: '#999',
        tabBarStyle: {
          backgroundColor: '#fff',
          borderTopWidth: 1,
          borderTopColor: '#e0e0e0',
        },
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="home" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Practice"
        component={PracticeScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="meditation" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Progress"
        component={ProgressScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="chart-line" size={size} color={color} />
          ),
        }}
      />
        <Tab.Screen
          name="Journal"
          component={JournalScreen}
          options={{
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons name="book-open" size={size} color={color} />
            ),
          }}
        />
        <Tab.Screen
          name="Settings"
          component={SettingsScreen}
          options={{
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons name="cog" size={size} color={color} />
            ),
          }}
        />
    </Tab.Navigator>
  );
}

export default function RootLayout() {
  const [showOnboarding, setShowOnboarding] = useState<boolean | null>(null);

  useEffect(() => {
    checkOnboardingStatus();
  }, []);

  const checkOnboardingStatus = async () => {
    try {
      const progress = await getProgress();
      // Show onboarding if no progress exists (first-time user)
      setShowOnboarding(!progress || progress.totalSessions === 0);
    } catch (error) {
      console.error('Error checking onboarding status:', error);
      setShowOnboarding(true); // Default to showing onboarding on error
    }
  };

  if (showOnboarding === null) {
    // Loading state
    return null;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {showOnboarding ? (
          <Stack.Screen name="Onboarding" component={OnboardingScreen} />
        ) : null}
        <Stack.Screen name="MainTabs" component={TabNavigator} />
        <Stack.Screen
          name="PracticeSession"
          component={PracticeSessionScreen}
          options={{ headerShown: true, title: 'Practice Session' }}
        />
        <Stack.Screen
          name="JournalEntry"
          component={JournalEntryScreen}
          options={{ headerShown: true, title: 'Journal Entry' }}
        />
        <Stack.Screen
          name="SessionCheckIn"
          component={SessionCheckInScreen}
          options={{ headerShown: true, title: 'Session Check-In' }}
        />
        <Stack.Screen
          name="PracticeHistory"
          component={PracticeHistoryScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="WeeklyReview"
          component={WeeklyReviewScreen}
          options={{ headerShown: true, title: 'Weekly Review' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
