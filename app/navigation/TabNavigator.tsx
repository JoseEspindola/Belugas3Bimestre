import React from 'react';
import { Ionicons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import type { TabParamList } from '../types';
import { colors } from '../theme';
import FavoritosScreen from '../screens/FavoritosScreen';
import InicioStack from './InicioStack';

const Tab = createBottomTabNavigator<TabParamList>();
const icons = {
  InicioStack: { inactive: 'home-outline', active: 'home' },
  Favoritos: { inactive: 'star-outline', active: 'star' },
} as const;

export default function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.border,
          height: 64,
          paddingTop: 7,
          paddingBottom: 8,
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.muted,
        tabBarLabelStyle: { fontSize: 11, fontWeight: '700' },
        tabBarIcon: ({ focused, color, size }) => (
          <Ionicons name={icons[route.name][focused ? 'active' : 'inactive']} size={size} color={color} />
        ),
      })}
    >
      <Tab.Screen name="InicioStack" component={InicioStack} options={{ title: 'Início' }} />
      <Tab.Screen name="Favoritos" component={FavoritosScreen} options={{ title: 'Favoritos' }} />
    </Tab.Navigator>
  );
}
