import type { Character } from './types';

const ENDPOINTS = [
  'https://www.demonslayer-api.com/api/v1/characters',
  'https://demonslayerapi.com/api/v1/characters',
];

async function fetchJSON(url: string, timeoutMs = 10000) {
  const ctrl = new AbortController();
  const id = setTimeout(() => ctrl.abort(), timeoutMs);
  try {
    const res = await fetch(url, { signal: ctrl.signal });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } finally {
    clearTimeout(id);
  }
}

export async function fetchCharacters(limit = 45): Promise<Character[]> {
  let lastErr: any;
  for (const base of ENDPOINTS) {
    try {
      const data = await fetchJSON(`${base}?limit=${limit}`);
      return data as Character[];
    } catch (e) {
      lastErr = e;
    }
  }
  throw new Error(`Falha ao carregar personagens: ${lastErr?.message ?? 'erro de rede'}`);
}

export async function fetchCharacterById(id: number | string): Promise<Character> {
  let lastErr: any;
  for (const base of ENDPOINTS) {
    try {
      const data = await fetchJSON(`${base}?id=${id}`);
      const item = Array.isArray(data) ? data[0] : data;
      if (!item) throw new Error('Personagem não encontrado');
      return item as Character;
    } catch (e) {
      lastErr = e;
    }
  }
  throw new Error(`Falha ao carregar detalhes: ${lastErr?.message ?? 'erro de rede'}`);
}
