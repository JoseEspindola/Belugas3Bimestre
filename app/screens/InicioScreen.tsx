import React, { useEffect, useState } from 'react';
import { DrawerActions } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { ActivityIndicator, FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import PersonagemCard from '../components/PersonagemCard';
import { buscarPersonagens } from '../services/api';
import type { Character, InicioStackParamList } from '../types';
import { colors } from '../theme';

type Props = NativeStackScreenProps<InicioStackParamList, 'Inicio'>;

export default function InicioScreen({ navigation }: Props) {
  const [personagens, setPersonagens] = useState<Character[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');
  const [tentativa, setTentativa] = useState(0);

  useEffect(() => {
    let ativo = true;
    async function carregar() {
      setCarregando(true);
      setErro('');
      try {
        const resultados = await buscarPersonagens();
        if (ativo) setPersonagens(resultados);
      } catch {
        if (ativo) setErro('Não foi possível carregar os personagens.');
      } finally {
        if (ativo) setCarregando(false);
      }
    }
    void carregar();
    return () => { ativo = false; };
  }, [tentativa]);

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View style={styles.header}>
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
          <View>
            <Text style={styles.eyebrow}>CATÁLOGO INTERDIMENSIONAL</Text>
            <Text style={styles.title}>Personagens</Text>
          </View>
        </View>
        <View style={styles.portal}><View style={styles.portalCore} /></View>
      </View>
      {carregando ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.message}>Carregando personagens...</Text>
        </View>
      ) : erro ? (
        <View style={styles.center}>
          <Text style={styles.errorIcon}>!</Text>
          <Text style={styles.error}>{erro}</Text>
          <Pressable style={styles.retryButton} onPress={() => setTentativa((valor) => valor + 1)}>
            <Text style={styles.retryText}>Tentar novamente</Text>
          </Pressable>
        </View>
      ) : (
        <FlatList
          data={personagens}
          keyExtractor={(item) => String(item.id)}
          renderItem={({ item }) => (
            <PersonagemCard personagem={item} onPress={() => navigation.navigate('Detalhes', { id: item.id })} />
          )}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={<Text style={styles.count}>{personagens.length} personagens encontrados</Text>}
          ListEmptyComponent={<Text style={styles.message}>Nenhum personagem encontrado.</Text>}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.background },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingTop: 12, paddingBottom: 18 },
  heading: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  menuButton: { width: 34, height: 42, alignItems: 'center', justifyContent: 'center' },
  eyebrow: { color: colors.secondary, fontSize: 10, fontWeight: '800', letterSpacing: 1.2 },
  title: { color: colors.text, fontSize: 28, fontWeight: '900', marginTop: 5 },
  portal: { width: 42, height: 42, borderRadius: 21, borderWidth: 2, borderColor: colors.primary, alignItems: 'center', justifyContent: 'center', transform: [{ rotate: '-18deg' }] },
  portalCore: { width: 26, height: 26, borderRadius: 13, backgroundColor: colors.secondary, opacity: 0.8 },
  list: { paddingHorizontal: 16, paddingBottom: 20 },
  count: { color: colors.muted, fontSize: 12, marginBottom: 12 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 28 },
  message: { color: colors.muted, fontSize: 15, marginTop: 14, textAlign: 'center' },
  errorIcon: { color: colors.danger, fontSize: 34, fontWeight: '900' },
  error: { color: colors.text, fontSize: 16, textAlign: 'center', marginTop: 8 },
  retryButton: { marginTop: 18, backgroundColor: colors.primary, borderRadius: 8, paddingVertical: 12, paddingHorizontal: 18 },
  retryText: { color: colors.background, fontWeight: '800' },
});
