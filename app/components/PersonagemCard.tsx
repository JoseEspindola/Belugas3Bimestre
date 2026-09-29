import React from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import type { Character } from '../types';
import StatusBadge from './StatusBadge';
import { colors } from '../theme';

type PersonagemCardProps = {
  personagem: Character;
  favorito?: boolean;
  onPress: () => void;
};

export default function PersonagemCard({ personagem, favorito = false, onPress }: PersonagemCardProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`Ver detalhes de ${personagem.name}`}
      onPress={onPress}
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}
    >
      <Image source={{ uri: personagem.image }} style={styles.image} />
      <View style={styles.content}>
        <View style={styles.titleRow}>
          <Text style={styles.name} numberOfLines={1}>{personagem.name}</Text>
          {favorito ? <Text style={styles.star}>★</Text> : null}
        </View>
        <View style={styles.meta}>
          <StatusBadge status={personagem.status} />
          <Text style={styles.species} numberOfLines={1}>{personagem.species}</Text>
        </View>
        <Text style={styles.link}>Ver detalhes <Text style={styles.arrow}>›</Text></Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    overflow: 'hidden',
    minHeight: 116,
    marginBottom: 12,
    borderRadius: 12,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  pressed: { opacity: 0.82 },
  image: { width: 116, height: 116, backgroundColor: colors.surfaceRaised },
  content: { flex: 1, justifyContent: 'center', paddingHorizontal: 14, paddingVertical: 12 },
  titleRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  name: { flex: 1, color: colors.text, fontSize: 17, fontWeight: '800' },
  star: { color: colors.primary, fontSize: 18 },
  meta: { flexDirection: 'row', alignItems: 'center', gap: 12, marginTop: 8 },
  species: { flexShrink: 1, color: colors.muted, fontSize: 13 },
  link: { marginTop: 10, color: colors.secondary, fontSize: 12, fontWeight: '700' },
  arrow: { fontSize: 16 },
});
