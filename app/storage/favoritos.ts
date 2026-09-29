import AsyncStorage from '@react-native-async-storage/async-storage';

const CHAVE_FAVORITOS = '@rickandmorty_favoritos';

export async function carregarFavoritos(): Promise<number[]> {
  const dados = await AsyncStorage.getItem(CHAVE_FAVORITOS);
  if (dados === null) return [];

  const ids: unknown = JSON.parse(dados);
  if (!Array.isArray(ids) || !ids.every((id): id is number => Number.isInteger(id))) {
    throw new Error('Os favoritos armazenados possuem formato inválido.');
  }
  return ids;
}

export async function salvarFavoritos(ids: number[]): Promise<void> {
  await AsyncStorage.setItem(CHAVE_FAVORITOS, JSON.stringify(ids));
}
