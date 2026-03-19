/**
 * Main Tab Navigator
 */
import React from 'react';
import { Tabs } from 'expo-router';
import { View, StyleSheet } from 'react-native';
import { Heart, MessageCircle, User, Flame } from 'lucide-react-native';
import { Colors, FontSize, Spacing } from '../../constants/theme';

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: Colors.textTertiary,
        tabBarLabelStyle: styles.tabBarLabel,
        tabBarShowLabel: true,
      }}
    >
      <Tabs.Screen
        name="matching"
        options={{
          title: 'Discover',
          tabBarIcon: ({ color, size }) => <Flame size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="likes"
        options={{
          title: 'Matches',
          tabBarIcon: ({ color, size }) => <Heart size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="messages"
        options={{
          title: 'Chat',
          tabBarIcon: ({ color, size }) => <MessageCircle size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, size }) => <User size={size} color={color} />,
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: Colors.surface,
    borderTopColor: Colors.border,
    borderTopWidth: 0.5,
    height: 85,
    paddingTop: Spacing.sm,
    paddingBottom: Spacing.xl,
  },
  tabBarLabel: {
    fontSize: FontSize.xs,
    fontWeight: '600',
    marginTop: 2,
  },
});
