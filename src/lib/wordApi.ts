// Lightweight client for public word APIs (no keys required)
// - Suggestions: Datamuse (https://api.datamuse.com)
// - Validation/Details: Free Dictionary API (https://dictionaryapi.dev)

export type Difficulty = 'easy' | 'medium' | 'hard' | 'expert';

export interface WordDefinitionResult {
  word: string;
  definition: string;
  synonyms: string[];
  antonyms: string[];
  example: string;
  pronunciation?: string;
}

export async function validateWordWithDictionaryAPI(word: string): Promise<boolean> {
  if (!word || !word.trim()) return false;
  try {
    const res = await fetch(
      `https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(word.toLowerCase())}`
    );
    if (!res.ok) return false;
    const data = await res.json();
    return Array.isArray(data) && data.length > 0 && !!data[0]?.meanings?.length;
  } catch {
    return false;
  }
}

export async function fetchWordDetails(word: string): Promise<WordDefinitionResult | null> {
  try {
    const res = await fetch(
      `https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(word.toLowerCase())}`
    );
    if (!res.ok) return null;
    const data = await res.json();
    if (!Array.isArray(data) || !data[0]) return null;

    const entry = data[0];
    const phonetic = entry.phonetics?.find((p: any) => p.text)?.text || entry.phonetic || undefined;

    // Pick first available definition/example; collect synonyms/antonyms from first meaning
    const firstMeaning = entry.meanings?.[0];
    const firstDef = firstMeaning?.definitions?.[0];

    const definition = firstDef?.definition || 'Definition not available.';
    const example = firstDef?.example || 'No example provided.';

    const synonymsArr = (entry.meanings || []).flatMap((m: any) => (m?.synonyms || []) as string[]);
    const synonymsSet = new Set<string>(synonymsArr.filter((s: any): s is string => typeof s === 'string'));
    const synonyms: string[] = Array.from(synonymsSet).slice(0, 12);

    const antonymsArr = (entry.meanings || []).flatMap((m: any) => (m?.antonyms || []) as string[]);
    const antonymsSet = new Set<string>(antonymsArr.filter((a: any): a is string => typeof a === 'string'));
    const antonyms: string[] = Array.from(antonymsSet).slice(0, 12);

    return {
      word: entry.word?.toUpperCase?.() || word.toUpperCase(),
      definition,
      example,
      synonyms,
      antonyms,
      pronunciation: phonetic,
    };
  } catch {
    return null;
  }
}

// Datamuse helper to pull words by approximate difficulty using length + frequency
export async function suggestWordsByDifficulty(
  difficulty: Difficulty,
  count: number = 10
): Promise<string[]> {
  // Length ranges per difficulty
  const ranges: Record<Difficulty, [number, number]> = {
    easy: [3, 5],
    medium: [5, 7],
    hard: [7, 10],
    expert: [10, 15],
  };

  const [minLen, maxLen] = ranges[difficulty];

  // Frequency thresholds (Datamuse md=f returns tags like 'f:4.56')
  const freqFilter = (f: number) => {
    if (difficulty === 'easy') return f >= 5;
    if (difficulty === 'medium') return f >= 3 && f < 5;
    if (difficulty === 'hard') return f >= 2 && f < 3;
    return f < 2; // expert
  };

  try {
    // Fetch multiple length buckets to build a pool
    const lengths = Array.from({ length: maxLen - minLen + 1 }, (_, i) => i + minLen);
    const requests = lengths.map((len) =>
      fetch(`https://api.datamuse.com/words?sp=${'?'.repeat(len)}&md=f&max=200`)
    );
    const responses = await Promise.all(requests);
    const jsons = await Promise.all(responses.map((r) => r.json()));
    const pool = jsons.flat();

    const parsed = pool
      .filter((w: any) => typeof w?.word === 'string')
      .map((w: any) => {
        const ftag = (w.tags || []).find((t: string) => t.startsWith('f:'));
        const f = ftag ? parseFloat(ftag.split(':')[1]) : 0;
        return { word: w.word, f };
      })
      .filter((w: any) => freqFilter(w.f));

    // Deduplicate, randomize, limit
    const unique = Array.from(new Map(parsed.map((w: any) => [w.word, w])).values());
    shuffleInPlace(unique);

    const selected = unique
      .slice(0, Math.max(count, 10))
      .map((w: any) => w.word.toUpperCase())
      .filter((w: string) => /^[A-Z]+$/.test(w));

    // Fallback if the bucket is too small
    if (selected.length < count) {
      const fallback = await fetch(`https://api.datamuse.com/words?sp=${'?'.repeat(minLen)}&md=f&max=200`).then((r) => r.json());
      const more = fallback
        .map((w: any) => w.word?.toUpperCase?.())
        .filter((w: string) => w && /^[A-Z]+$/.test(w));
      shuffleInPlace(more);
      for (const m of more) if (!selected.includes(m) && selected.length < count) selected.push(m);
    }

    return selected.slice(0, count);
  } catch {
    return [];
  }
}

function shuffleInPlace<T>(arr: T[]) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
}
