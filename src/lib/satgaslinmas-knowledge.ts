/**
 * Knowledge base loader — membaca public/satgaslinmas.txt sebagai satu-satunya
 * sumber data chatbot. Edit file .txt untuk memperbarui pengetahuan chatbot.
 *
 * Format .txt:
 *   • Paragraf dipisahkan baris kosong
 *   • Baris diawali # = komentar, diabaikan
 */

let fetchPromise: Promise<string> | null = null;

export function prefetchSatgasLinmasText(): void {
  void getSatgasLinmasText();
}

export function getSatgasLinmasText(): Promise<string> {
  if (!fetchPromise) {
    fetchPromise = fetch('/satgaslinmas.txt')
      .then(r => (r.ok ? r.text() : ''))
      .catch(() => '');
  }
  return fetchPromise;
}

export function clearSatgasLinmasCache(): void {
  fetchPromise = null;
}

// ─── Pre-processing ───────────────────────────────────────────────────────────

/** Hapus baris komentar # */
export function preprocessDoc(raw: string): string {
  return raw
    .split('\n')
    .filter(l => !l.trim().startsWith('#'))
    .join('\n')
    .trim();
}

/** Pecah menjadi paragraf (min 15 karakter) */
export function chunkDoc(text: string): string[] {
  if (!text) return [];
  return text
    .split(/\n\s*\n+/)
    .map(p => p.trim().replace(/\n+/g, ' '))
    .filter(p => p.length >= 15);
}

// ─── Normalise ────────────────────────────────────────────────────────────────

function norm(s: string): string {
  return s.toLowerCase().replace(/[^\w\s]/g, ' ').replace(/\s+/g, ' ').trim();
}

// ─── Synonym / alias map ──────────────────────────────────────────────────────
// Kata pendek → kata kunci yang lebih panjang agar cocok dengan paragraf .txt
const SYNONYMS: Record<string, string[]> = {
  ig:         ['instagram'],
  tt:         ['tiktok'],
  wa:         ['whatsapp'],
  satpol:     ['satpol pp', 'satuan polisi pamong praja'],
  linmas:     ['satlinmas', 'perlindungan masyarakat'],
  cfd:        ['car free day'],
  pkl:        ['pedagang kaki lima'],
  sipedas:    ['sapa pedestrian ponorogo'],
  basith:     ['ahmad abdul basith'],
  erry:       ['erry setiyoso birowo'],
  pedestrian: ['trotoar', 'pejalan kaki'],
  aduan:      ['laporan', 'pengaduan'],
  tiket:      ['nomor tiket', 'id aduan'],
};

function expandQuery(words: string[]): string[] {
  const extra: string[] = [];
  for (const w of words) {
    const syns = SYNONYMS[w];
    if (syns) extra.push(...syns);
  }
  return [...words, ...extra];
}

// ─── Search ───────────────────────────────────────────────────────────────────

export interface KnowledgeHit {
  text: string;
  score: number;
}

const MAX_CHARS = 1800;

/**
 * Cari paragraf paling relevan dari dokumen .txt.
 * Mengembalikan null jika tidak ada yang cukup relevan.
 */
export function searchKnowledge(query: string, documentRaw: string): KnowledgeHit | null {
  const cleaned = preprocessDoc(documentRaw);
  const chunks  = chunkDoc(cleaned);
  if (!chunks.length) return null;

  const q     = norm(query);
  const words = q.split(' ').filter(w => w.length > 1);
  if (!words.length) return null;

  const expanded = expandQuery(words);

  let best: KnowledgeHit | null = null;

  for (const chunk of chunks) {
    const c = norm(chunk);
    let score = 0;

    // Exact full-query match (very high weight)
    if (q.length >= 5 && c.includes(q)) score += 30;

    for (const w of expanded) {
      if (w.length >= 5 && c.includes(w))      score += 9;
      else if (w.length >= 4 && c.includes(w)) score += 6;
      else if (w.length >= 3 && c.includes(w)) score += 3;

      // Partial token overlap
      for (const tok of c.split(' ')) {
        if (tok.length >= 3 && (tok.includes(w) || w.includes(tok))) score += 1;
      }
    }

    if (!best || score > best.score) {
      best = {
        text: chunk.length > MAX_CHARS ? chunk.slice(0, MAX_CHARS).trim() + '…' : chunk,
        score,
      };
    }
  }

  return best && best.score >= 5 ? best : null;
}

/**
 * Ambil beberapa paragraf teratas (untuk jawaban yang lebih kaya).
 */
export function searchKnowledgeTop(
  query: string,
  documentRaw: string,
  topN = 2,
): KnowledgeHit[] {
  const cleaned = preprocessDoc(documentRaw);
  const chunks  = chunkDoc(cleaned);
  if (!chunks.length) return [];

  const q     = norm(query);
  const words = q.split(' ').filter(w => w.length > 1);
  if (!words.length) return [];

  const expanded = expandQuery(words);

  const scored = chunks.map(chunk => {
    const c = norm(chunk);
    let score = 0;
    if (q.length >= 5 && c.includes(q)) score += 30;
    for (const w of expanded) {
      if (w.length >= 5 && c.includes(w))      score += 9;
      else if (w.length >= 4 && c.includes(w)) score += 6;
      else if (w.length >= 3 && c.includes(w)) score += 3;
      for (const tok of c.split(' ')) {
        if (tok.length >= 3 && (tok.includes(w) || w.includes(tok))) score += 1;
      }
    }
    return {
      text: chunk.length > MAX_CHARS ? chunk.slice(0, MAX_CHARS).trim() + '…' : chunk,
      score,
    };
  });

  return scored
    .filter(h => h.score >= 5)
    .sort((a, b) => b.score - a.score)
    .slice(0, topN);
}
