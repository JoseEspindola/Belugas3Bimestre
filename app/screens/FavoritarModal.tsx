import React, { useState } from 'react';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFavoritos } from '../contexts/FavoritosContext';
import type { InicioStackParamList } from '../types';
import { colors } from '../theme';

type Props = NativeStackScreenProps<InicioStackParamList, 'FavoritarModal'>;

export default function FavoritarModal({ navigation, route }: Props) {
  const { id, name, adicionar } = route.params;
  const { alternarFavorito, carregandoFavoritos, erroFavoritos, recarregarFavoritos } = useFavoritos();
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState('');

  async function confirmar(): Promise<void> {
    setSalvando(true);
    setErro('');
    try {
      await alternarFavorito(id);
      navigation.goBack();
    } catch {
      setErro('Não foi possível atualizar os favoritos. Tente novamente.');
    } finally {
      setSalvando(false);
    }
  }

  const acao = adicionar ? 'Favoritar' : 'Desfavoritar';
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.panel}>
        <View style={styles.handle} />
        <Text style={styles.star}>{adicionar ? '★' : '☆'}</Text>
        <Text style={styles.title}>{acao} personagem</Text>
        <Text style={styles.message}>{adicionar ? 'Deseja adicionar' : 'Deseja remover'} <Text style={styles.name}>{name}</Text> {adicionar ? 'aos' : 'dos'} favoritos?</Text>
        {erro || erroFavoritos ? <Text style={styles.error}>{erro || erroFavoritos}</Text> : null}
        <Pressable disabled={salvando || carregandoFavoritos} onPress={() => void confirmar()} style={[styles.confirm, (salvando || carregandoFavoritos) && styles.disabled]}>
          {salvando ? <ActivityIndicator color={colors.background} /> : <Text style={styles.confirmText}>Confirmar</Text>}
        </Pressable>
        <Pressable onPress={() => navigation.goBack()} style={styles.cancel}><Text style={styles.cancelText}>Cancelar</Text></Pressable>
        {erroFavoritos ? <Pressable onPress={() => void recarregarFavoritos()}><Text style={styles.retry}>Tentar ler novamente</Text></Pressable> : null}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.55)' },
  panel: { backgroundColor: colors.surface, borderTopLeftRadius: 18, borderTopRightRadius: 18, borderColor: colors.border, borderWidth: 1, paddingHorizontal: 24, paddingTop: 12, paddingBottom: 28, alignItems: 'center' },
  handle: { width: 42, height: 4, borderRadius: 2, backgroundColor: colors.muted, opacity: 0.55, marginBottom: 20 },
  star: { color: colors.primary, fontSize: 32 },
  title: { color: colors.text, fontSize: 21, fontWeight: '900', marginTop: 8 },
  message: { color: colors.muted, fontSize: 15, textAlign: 'center', lineHeight: 23, marginTop: 10, marginBottom: 18 },
  name: { color: colors.text, fontWeight: '800' },
  confirm: { width: '100%', minHeight: 48, justifyContent: 'center', alignItems: 'center', borderRadius: 8, backgroundColor: colors.primary },
  confirmText: { color: colors.background, fontWeight: '900' },
  cancel: { padding: 14 },
  cancelText: { color: colors.muted, fontWeight: '700' },
  error: { color: colors.danger, textAlign: 'center', marginBottom: 12 },
  retry: { color: colors.secondary, padding: 8 },
  disabled: { opacity: 0.5 },
});
