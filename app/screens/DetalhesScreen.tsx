import React, { useEffect, useState } from 'react';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ActivityIndicator, Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFavoritos } from '../contexts/FavoritosContext';
import StatusBadge from '../components/StatusBadge';
import { buscarPersonagem, buscarPersonagens } from '../services/api';
import type { Character, InicioStackParamList } from '../types';
import { colors } from '../theme';

type Props = NativeStackScreenProps<InicioStackParamList, 'Detalhes'>;
type MetodoNavegacao = 'navigate' | 'push';

export default function DetalhesScreen({ navigation, route }: Props) {
  const { id } = route.params;
  const { favoritos, carregandoFavoritos } = useFavoritos();
  const [personagem, setPersonagem] = useState<Character | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');
  const [erroNavegacao, setErroNavegacao] = useState('');
  const [abrindoOutro, setAbrindoOutro] = useState(false);
  const ehFavorito = favoritos.includes(id);

  useEffect(() => {
    let ativo = true;
    async function carregar() {
      setCarregando(true);
      setErro('');
      try {
        const resultado = await buscarPersonagem(id);
        if (ativo) setPersonagem(resultado);
      } catch {
        if (ativo) setErro('Não foi possível carregar este personagem. Verifique a conexão ou o endereço.');
      } finally {
        if (ativo) setCarregando(false);
      }
    }
    void carregar();
    return () => { ativo = false; };
  }, [id]);

  async function abrirOutroPersonagem(metodo: MetodoNavegacao): Promise<void> {
    setAbrindoOutro(true);
    setErroNavegacao('');
    try {
      const personagens = await buscarPersonagens();
      const outro = personagens.find((item) => item.id !== id);
      if (!outro) throw new Error('Nenhum outro personagem foi encontrado.');
      if (metodo === 'navigate') {
        navigation.navigate('Detalhes', { id: outro.id });
      } else {
        navigation.push('Detalhes', { id: outro.id });
      }
    } catch {
      setErroNavegacao('Não foi possível buscar outro personagem na API.');
    } finally {
      setAbrindoOutro(false);
    }
  }

  if (carregando) {
    return <CenterState><ActivityIndicator size="large" color={colors.primary} /><Text style={styles.stateText}>Carregando detalhes...</Text></CenterState>;
  }
  if (erro || !personagem) {
    return <CenterState><Text style={styles.error}>{erro || 'Personagem não encontrado.'}</Text><ActionButton label="Voltar" onPress={() => navigation.goBack()} /></CenterState>;
  }

  const campos: [string, string][] = [
    ['Gênero', personagem.gender],
    ['Tipo', personagem.type || 'Não informado'],
    ['Origem', personagem.origin?.name || 'Não informado'],
    ['Localização', personagem.location?.name || 'Não informado'],
  ];

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Pressable style={styles.backButton} onPress={() => navigation.goBack()}><Text style={styles.backText}>‹  Voltar</Text></Pressable>
        <Image source={{ uri: personagem.image }} style={styles.image} />
        <Text style={styles.eyebrow}>ARQUIVO #{personagem.id}</Text>
        <Text style={styles.title}>{personagem.name}</Text>
        <View style={styles.summary}><StatusBadge status={personagem.status} /><Text style={styles.species}>{personagem.species}</Text></View>
        <View style={styles.details}>
          {campos.map(([label, value]) => <View key={label} style={styles.detailRow}><Text style={styles.detailLabel}>{label}</Text><Text style={styles.detailValue}>{value}</Text></View>)}
        </View>
        <ActionButton
          label={carregandoFavoritos ? 'Carregando favoritos...' : ehFavorito ? '★ Desfavoritar' : '☆ Favoritar'}
          disabled={carregandoFavoritos}
          onPress={() => navigation.navigate('FavoritarModal', { id: personagem.id, name: personagem.name, adicionar: !ehFavorito })}
          primary
        />
        <Text style={styles.sectionTitle}>Pilha de navegação</Text>
        <Text style={styles.explanation}><Text style={styles.method}>navigate()</Text> tenta reutilizar uma tela existente na pilha.</Text>
        <Text style={styles.explanation}><Text style={styles.method}>push()</Text> sempre adiciona uma nova tela à pilha.</Text>
        <ActionButton label="Abrir com navigate()" disabled={abrindoOutro} onPress={() => void abrirOutroPersonagem('navigate')} />
        <ActionButton label="Abrir com push()" disabled={abrindoOutro} onPress={() => void abrirOutroPersonagem('push')} />
        {erroNavegacao ? <Text style={styles.inlineError}>{erroNavegacao}</Text> : null}
      </ScrollView>
    </SafeAreaView>
  );
}

function CenterState({ children }: React.PropsWithChildren) {
  return <SafeAreaView style={[styles.safeArea, styles.center]}>{children}</SafeAreaView>;
}

function ActionButton({ label, onPress, primary = false, disabled = false }: {
  label: string;
  onPress: () => void;
  primary?: boolean;
  disabled?: boolean;
}) {
  return <Pressable disabled={disabled} onPress={onPress} style={({ pressed }) => [styles.button, primary && styles.primaryButton, disabled && styles.disabled, pressed && styles.pressed]}><Text style={[styles.buttonText, primary && styles.primaryText]}>{label}</Text></Pressable>;
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.background },
  content: { padding: 20, paddingBottom: 32 },
  center: { alignItems: 'center', justifyContent: 'center', padding: 24 },
  backButton: { alignSelf: 'flex-start', paddingVertical: 8, marginBottom: 14 },
  backText: { color: colors.secondary, fontSize: 16, fontWeight: '700' },
  image: { width: '100%', aspectRatio: 1.2, maxHeight: 310, borderRadius: 12, backgroundColor: colors.surface, marginBottom: 20 },
  eyebrow: { color: colors.secondary, fontSize: 11, fontWeight: '800', letterSpacing: 1 },
  title: { color: colors.text, fontSize: 30, fontWeight: '900', marginTop: 5 },
  summary: { flexDirection: 'row', alignItems: 'center', gap: 14, marginTop: 12 },
  species: { color: colors.muted, fontSize: 14 },
  details: { backgroundColor: colors.surface, borderRadius: 10, paddingHorizontal: 14, marginTop: 20, marginBottom: 16 },
  detailRow: { paddingVertical: 13, borderBottomColor: colors.border, borderBottomWidth: StyleSheet.hairlineWidth },
  detailLabel: { color: colors.muted, fontSize: 12, marginBottom: 4 },
  detailValue: { color: colors.text, fontSize: 15, fontWeight: '600' },
  button: { minHeight: 46, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: colors.border, borderRadius: 8, marginTop: 10, paddingHorizontal: 14, backgroundColor: colors.surface },
  primaryButton: { backgroundColor: colors.primary, borderColor: colors.primary },
  buttonText: { color: colors.text, fontSize: 14, fontWeight: '800' },
  primaryText: { color: colors.background },
  disabled: { opacity: 0.5 },
  pressed: { opacity: 0.8 },
  sectionTitle: { color: colors.text, fontSize: 17, fontWeight: '800', marginTop: 25, marginBottom: 8 },
  explanation: { color: colors.muted, fontSize: 13, lineHeight: 19, marginTop: 3 },
  method: { color: colors.primary, fontWeight: '800' },
  inlineError: { color: colors.danger, textAlign: 'center', marginTop: 10 },
  error: { color: colors.text, textAlign: 'center', fontSize: 16, marginBottom: 16 },
  stateText: { color: colors.muted, marginTop: 12 },
});
