import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { colors } from '../theme';
import type { InicioStackParamList } from '../types';
import DetalhesScreen from '../screens/DetalhesScreen';
import FavoritarModal from '../screens/FavoritarModal';
import InicioScreen from '../screens/InicioScreen';

const Stack = createNativeStackNavigator<InicioStackParamList>();

export default function InicioStack() {
  return (
    <Stack.Navigator
      screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.background } }}
    >
      <Stack.Screen name="Inicio" component={InicioScreen} />
      <Stack.Screen name="Detalhes" component={DetalhesScreen} />
      <Stack.Screen
        name="FavoritarModal"
        component={FavoritarModal}
        options={{ presentation: 'modal', headerShown: false }}
      />
    </Stack.Navigator>
  );
}
