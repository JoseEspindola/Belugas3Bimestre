import { createContext, useContext } from 'react';

export interface FavoritosContextValue {
  favoritos: number[];
  carregandoFavoritos: boolean;
  erroFavoritos: string;
  recarregarFavoritos: () => Promise<void>;
  alternarFavorito: (id: number) => Promise<void>;
}

export const FavoritosContext = createContext<FavoritosContextValue | null>(null);

export function useFavoritos(): FavoritosContextValue {
  const context = useContext(FavoritosContext);
  if (!context) {
    throw new Error('useFavoritos deve ser usado dentro de FavoritosContext.Provider.');
  }
  return context;
}
