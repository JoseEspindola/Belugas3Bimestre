import type { Character } from '../types';

const API_URL = 'https://rickandmortyapi.com/api/character';

// Helper genérico para requisições com tratamento de erro
async function requisitar<T>(url: string): Promise<T> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Erro HTTP: ${response.status}`);
  }
  return response.json() as Promise<T>;
}

// 1. Busca todos os personagens
export async function buscarPersonagens(): Promise<Character[]> {
  const data = await requisitar<{ results: Character[] }>(API_URL);
  return data.results;
}

// 2. Busca um único personagem por ID
export async function buscarPersonagem(id: number): Promise<Character> {
  return requisitar<Character>(`${API_URL}/${id}`);
}

// 3. Busca múltiplos personagens por IDs
export async function buscarPersonagensPorIds(ids: number[]): Promise<Character[]> {
  if (ids.length === 0) return [];
  const data = await requisitar<Character[] | Character>(`${API_URL}/${ids.join(',')}`);
  return Array.isArray(data) ? data : [data];
}