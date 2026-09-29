import React from 'react';
import { DrawerActions } from '@react-navigation/native';
import type { DrawerScreenProps } from '@react-navigation/drawer';
import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { RootDrawerParamList } from '../types';
import { colors } from '../theme';

type Props = DrawerScreenProps<RootDrawerParamList, 'Sobre'>;

export default function SobreScreen({ navigation }: Props) {
  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View style={styles.content}>
        <View style={styles.heading}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Abrir menu de navegação"
            hitSlop={10}
            onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
            style={styles.menuButton}
          >
            <Ionicons name="menu" size={25} color={colors.primary} />
          </Pressable>
          <View><Text style={styles.eyebrow}>INFORMAÇÕES</Text><Text style={styles.title}>Sobre</Text></View>
        </View>
        <View style={styles.rule} />
        <Text style={styles.appName}>Rick and Morty</Text>
        <Text style={styles.description}>Aplicativo desenvolvido para o trabalho de Arquitetura de Aplicativos Móveis — IFSP.</Text>
        <Text style={styles.sectionTitle}>Tecnologias utilizadas</Text>
        {['React Native', 'Expo', 'React Navigation', 'Rick and Morty API', 'AsyncStorage'].map((item) => (
          <View key={item} style={styles.technology}><View style={styles.dot} /><Text style={styles.technologyText}>{item}</Text></View>
        ))}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.background },
  content: { padding: 22, paddingTop: 28 },
  heading: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  menuButton: { width: 34, height: 42, alignItems: 'center', justifyContent: 'center' },
  eyebrow: { color: colors.secondary, fontSize: 10, fontWeight: '800', letterSpacing: 1.2 },
  title: { color: colors.text, fontSize: 28, fontWeight: '900', marginTop: 5 },
  rule: { height: 2, width: 42, backgroundColor: colors.primary, marginTop: 20, marginBottom: 22 },
  appName: { color: colors.text, fontSize: 20, fontWeight: '800' },
  description: { color: colors.muted, fontSize: 15, lineHeight: 23, marginTop: 10 },
  sectionTitle: { color: colors.text, fontSize: 16, fontWeight: '800', marginTop: 30, marginBottom: 8 },
  technology: { flexDirection: 'row', alignItems: 'center', paddingVertical: 11, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: colors.border },
  dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: colors.primary, marginRight: 12 },
  technologyText: { color: colors.muted, fontSize: 14 },
});
