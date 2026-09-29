import React, { useEffect, useState } from 'react';
import { DarkTheme, NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import AppNavigator from './navigation/AppNavigator';
import { FavoritosContext } from './contexts/FavoritosContext';
import { carregarFavoritos, salvarFavoritos } from './storage/favoritos';
import { colors } from './theme';

export default function App() {
  const [favoritos, setFavoritos] = useState<number[]>([]);
  const [carregandoFavoritos, setCarregandoFavoritos] = useState(true);
  const [erroFavoritos, setErroFavoritos] = useState('');

  async function recarregarFavoritos(): Promise<void> {
    setCarregandoFavoritos(true);
    setErroFavoritos('');
    try {
      setFavoritos(await carregarFavoritos());
    } catch {
      setErroFavoritos('Não foi possível ler os favoritos salvos.');
    } finally {
      setCarregandoFavoritos(false);
    }
  }

  useEffect(() => {
    void recarregarFavoritos();
  }, []);

  async function alternarFavorito(id: number): Promise<void> {
    const novosFavoritos = favoritos.includes(id)
      ? favoritos.filter((favoritoId) => favoritoId !== id)
      : [...favoritos, id];
    await salvarFavoritos(novosFavoritos);
    setFavoritos(novosFavoritos);
    setErroFavoritos('');
  }

  return (
    <FavoritosContext.Provider
      value={{ favoritos, carregandoFavoritos, erroFavoritos, recarregarFavoritos, alternarFavorito }}
    >
      <GestureHandlerRootView style={{ flex: 1 }}>
        <NavigationContainer
          theme={{
            ...DarkTheme,
            colors: { ...DarkTheme.colors, background: colors.background, card: colors.surface },
          }}
        >
          <StatusBar style="light" />
          <AppNavigator />
        </NavigationContainer>
      </GestureHandlerRootView>
    </FavoritosContext.Provider>
  );
}
