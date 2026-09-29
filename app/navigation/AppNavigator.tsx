import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import SobreScreen from '../screens/SobreScreen';
import { RootDrawerParamList } from '../types';
import { colors } from '../theme';
import TabNavigator from './TabNavigator';

const Drawer = createDrawerNavigator<RootDrawerParamList>();

export default function AppNavigator() {
  return (
    <Drawer.Navigator
      id="RootDrawer"
      screenOptions={{
        headerShown: false,
        drawerType: 'front',
        drawerStyle: { backgroundColor: colors.surface, width: 280 },
        drawerActiveTintColor: colors.primary,
        drawerActiveBackgroundColor: colors.surfaceRaised,
        drawerInactiveTintColor: colors.muted,
        drawerLabelStyle: { fontSize: 15, fontWeight: '700' },
      }}
    >
      <Drawer.Screen name="Catálogo" component={TabNavigator} />
      <Drawer.Screen name="Sobre" component={SobreScreen} />
    </Drawer.Navigator>
  );
}
