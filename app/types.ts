import type { NavigatorScreenParams } from '@react-navigation/native';

export interface Character {
  id: number;
  name: string;
  status: string;
  species: string;
  type: string;
  gender: string;
  origin: { name: string; url: string };
  location: { name: string; url: string };
  image: string;
  episode: string[];
  url: string;
  created: string;
}

export type InicioStackParamList = {
  Inicio: undefined;
  Detalhes: { id: number };
  FavoritarModal: { id: number; name: string; adicionar: boolean };
};

export type TabParamList = {
  InicioStack: NavigatorScreenParams<InicioStackParamList> | undefined;
  Favoritos: undefined;
};

export type RootDrawerParamList = {
  Catálogo: NavigatorScreenParams<TabParamList> | undefined;
  Sobre: undefined;
};
