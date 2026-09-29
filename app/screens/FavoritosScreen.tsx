import React, { useEffect, useState } from 'react';
import { DrawerActions } from '@react-navigation/native';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { ActivityIndicator, FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFavoritos } from '../contexts/FavoritosContext';
import PersonagemCard from '../components/PersonagemCard';
import { buscarPersonagensPorIds } from '../services/api';
import type { Character, TabParamList } from '../types';
import { colors } from '../theme';

type Props = BottomTabScreenProps<TabParamList, 'Favoritos'>;

export default function FavoritosScreen({ navigation }: Props) {
  const { favoritos, carregandoFavoritos, erroFavoritos, recarregarFavoritos } = useFavoritos();
  const [personagens, setPersonagens] = useState<Character[]>([]);
  const [carregandoApi, setCarregandoApi] = useState(false);
  const [erroApi, setErroApi] = useState('');
  const [tentativa, setTentativa] = useState(0);

  useEffect(() => {
    let ativo = true;
    async function carregar() {
      if (carregandoFavoritos || erroFavoritos) return;
      if (favoritos.length === 0) {
        setPersonagens([]);
        setErroApi('');
        return;
      }
      setCarregandoApi(true);
      setErroApi('');
      try {
        const resultados = await buscarPersonagensPorIds(favoritos);
        if (ativo) setPersonagens(resultados);
      } catch {
        if (ativo) setErroApi('Não foi possível carregar os personagens favoritos.');
      } finally {
        if (ativo) setCarregandoApi(false);
      }
    }
    void carregar();
    return () => { ativo = false; };
  }, [favoritos, carregandoFavoritos, erroFavoritos, tentativa]);

  function abrirDetalhes(personagem: Character) {
    navigation.navigate('InicioStack', { screen: 'Detalhes', params: { id: personagem.id } });
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View style={styles.header}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Abrir menu de navegação"
          hitSlop={10}
          onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
          style={styles.menuButton}
        >
          <Ionicons name="menu" size={25} color={colors.primary} />
        </Pressable>
        <View><Text style={styles.eyebrow}>SUA COLEÇÃO</Text><Text style={styles.title}>Favoritos <Text style={styles.star}>★</Text></Text></View>
      </View>
      {carregandoFavoritos || carregandoApi ? (
        <View style={styles.center}><ActivityIndicator size="large" color={colors.primary} /><Text style={styles.message}>Carregando favoritos...</Text></View>
      ) : erroFavoritos ? (
        <View style={styles.center}><Text style={styles.error}>{erroFavoritos}</Text><ActionButton label="Tentar novamente" onPress={() => void recarregarFavoritos()} /></View>
      ) : erroApi ? (
        <View style={styles.center}><Text style={styles.error}>{erroApi}</Text><ActionButton label="Tentar novamente" onPress={() => setTentativa((valor) => valor + 1)} /></View>
      ) : favoritos.length === 0 ? (
        <View style={styles.center}><Text style={styles.emptyStar}>☆</Text><Text style={styles.emptyTitle}>Nenhum personagem favoritado ainda.</Text><Text style={styles.message}>Escolha um personagem na aba Início e toque em “Favoritar”.</Text></View>
      ) : (
        <FlatList
          data={personagens}
          keyExtractor={(item) => String(item.id)}
          renderItem={({ item }) => <PersonagemCard personagem={item} favorito onPress={() => abrirDetalhes(item)} />}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={<Text style={styles.message}>Nenhum personagem favorito disponível.</Text>}
        />
      )}
    </SafeAreaView>
  );
}

function ActionButton({ label, onPress }: { label: string; onPress: () => void }) {
  return <Pressable onPress={onPress} style={styles.button}><Text style={styles.buttonText}>{label}</Text></Pressable>;
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.background },
  header: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 20, paddingTop: 12, paddingBottom: 18 },
  menuButton: { width: 34, height: 42, alignItems: 'center', justifyContent: 'center' },
  eyebrow: { color: colors.secondary, fontSize: 10, fontWeight: '800', letterSpacing: 1.2 },
  title: { color: colors.text, fontSize: 28, fontWeight: '900', marginTop: 5 },
  star: { color: colors.primary },
  list: { paddingHorizontal: 16, paddingBottom: 20 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 28 },
  emptyStar: { color: colors.primary, fontSize: 42 },
  emptyTitle: { color: colors.text, fontSize: 16, fontWeight: '800', textAlign: 'center', marginTop: 12 },
  message: { color: colors.muted, fontSize: 14, lineHeight: 21, textAlign: 'center', marginTop: 10 },
  error: { color: colors.danger, textAlign: 'center', fontSize: 15, marginBottom: 16 },
  button: { minHeight: 46, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.primary, borderRadius: 8, paddingHorizontal: 18 },
  buttonText: { color: colors.background, fontWeight: '800' },
});
