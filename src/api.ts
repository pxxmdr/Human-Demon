import type { Character } from "./types";

const CANDIDATES: { base: string; encoded: boolean }[] = [
  { base: "https://demonslayerapi.com/api/v1/characters", encoded: false },
  {
    base: "https://r.jina.ai/http://demonslayerapi.com/api/v1/characters",
    encoded: false,
  },
  {
    base: "https://r.jina.ai/http://demonslayerapi.com/api/v1/characters%3F",
    encoded: true,
  },
  { base: "https://www.demonslayer-api.com/api/v1/characters", encoded: false },
];

const COMMON_HEADERS: Record<string, string> = {
  Accept: "application/json",
  "User-Agent": "ExpoRN-DemonSlayer/1.0 (Android)",
};

async function fetchText(url: string, timeoutMs = 15000): Promise<string> {
  console.log("[API] GET", url);
  const hasAbort = typeof AbortController !== "undefined";
  if (hasAbort) {
    const ctrl = new AbortController();
    const t = setTimeout(() => ctrl.abort(), timeoutMs);
    try {
      const res = await fetch(url, {
        signal: ctrl.signal,
        headers: COMMON_HEADERS,
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return await res.text();
    } finally {
      clearTimeout(t);
    }
  } else {
    const res = await fetch(url, { headers: COMMON_HEADERS });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.text();
  }
}

function parseJSON(text: string): any {
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}

function toList(raw: any): Character[] {
  if (Array.isArray(raw)) return raw as Character[];
  if (raw && Array.isArray(raw.data)) return raw.data as Character[];
  if (raw && Array.isArray(raw.results)) return raw.results as Character[];
  if (raw && Array.isArray(raw.characters))
    return raw.characters as Character[];
  return [];
}

function extractArrayFromText(text: string): Character[] {
  const first = text.indexOf("[");
  const last = text.lastIndexOf("]");
  if (first !== -1 && last > first) {
    try {
      const arr = JSON.parse(text.slice(first, last + 1));
      return Array.isArray(arr) ? (arr as Character[]) : [];
    } catch {}
  }
  return [];
}

async function pickWorkingBase(): Promise<{ base: string; encoded: boolean }> {
  let lastErr: unknown;
  for (const c of CANDIDATES) {
    try {
      const probe = c.encoded ? `${c.base}limit=1` : `${c.base}?limit=1`;
      const txt = await fetchText(probe, 8000);

      const json = parseJSON(txt);
      let list: Character[] = toList(json);

      if (!list.length) list = extractArrayFromText(txt);

      if (list.length > 0) {
        console.log("[API] usando base:", c.base, "encoded?", c.encoded);
        return c;
      }
    } catch (e) {
      lastErr = e;
    }
  }
  throw lastErr ?? new Error("Nenhum endpoint retornou lista válida");
}

export async function fetchCharacters(limit = 45): Promise<Character[]> {
  const { base, encoded } = await pickWorkingBase();
  const url = encoded ? `${base}limit=${limit}` : `${base}?limit=${limit}`;
  const txt = await fetchText(url);

  let json = parseJSON(txt);
  let list: Character[] = toList(json);
  if (!list.length) list = extractArrayFromText(txt);

  if (!list.length) throw new Error("API retornou lista vazia/inesperada");
  return list;
}

export async function fetchCharacterById(
  id: number | string
): Promise<Character> {
  const { base, encoded } = await pickWorkingBase();
  const url = encoded ? `${base}id=${id}` : `${base}?id=${id}`;
  const txt = await fetchText(url);

  let json = parseJSON(txt);

  let item: any =
    (Array.isArray(json) && json[0]) || json?.data || json?.character;

  if (!item) {
    const arr = extractArrayFromText(txt);
    if (arr.length) item = arr[0];
  }

  if (!item) throw new Error("Personagem não encontrado");
  return item as Character;
}
