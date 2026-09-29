import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors } from '../theme';

type StatusBadgeProps = { status: string };

const statusConfig: Record<string, { label: string; color: string }> = {
  Alive: { label: 'Vivo', color: colors.primary },
  Dead: { label: 'Morto', color: colors.danger },
  unknown: { label: 'Desconhecido', color: colors.muted },
};

export default function StatusBadge({ status }: StatusBadgeProps) {
  const config = statusConfig[status] || statusConfig.unknown;
  return (
    <View style={styles.container}>
      <View style={[styles.dot, { backgroundColor: config.color }]} />
      <Text style={styles.label}>{config.label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flexDirection: 'row', alignItems: 'center', gap: 7 },
  dot: { width: 8, height: 8, borderRadius: 4 },
  label: { color: colors.muted, fontSize: 13 },
});
