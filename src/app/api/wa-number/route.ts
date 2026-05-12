import { NextResponse } from 'next/server';
import { getSheetValues, ensureSheetSetup, SHEET_NOWA } from '@/lib/google-sheets';
import { dayOfWeekWIB, hariIniWIB, HARI_MAP, HARI_LABEL } from '@/lib/wib';

const SPREADSHEET_ID = process.env.SPREADSHEET_ID ?? '';

const DEFAULT = { number: '6285123456789', name: 'Piket Satlinmas', day: '', jadwal: '' };

/**
 * Cek apakah string jadwal mencakup hari dengan indeks todayIdx.
 *
 * Format yang didukung (case-insensitive):
 *   - Tunggal  : "Senin"
 *   - List     : "Senin,Rabu,Jumat"
 *   - Range    : "Senin-Jumat"  (inklusif, wrap-around jika start > end)
 *   - Semua    : "Senin-Minggu" atau "Semua" atau "*"
 */
function jadwalCocok(jadwalRaw: string, todayIdx: number): boolean {
  const j = jadwalRaw.toLowerCase().trim();
  if (!j) return false;
  if (j === 'semua' || j === '*' || j === 'senin-minggu' || j === 'minggu-sabtu') return true;

  // Range: "senin-jumat"
  if (j.includes('-')) {
    const [rawStart, rawEnd] = j.split('-').map(s => s.trim());
    const s = HARI_MAP[rawStart];
    const e = HARI_MAP[rawEnd];
    if (s === undefined || e === undefined) return false;
    if (s <= e) return todayIdx >= s && todayIdx <= e;
    // Wrap-around: misal Sabtu(6)-Senin(1) → 6,0,1
    return todayIdx >= s || todayIdx <= e;
  }

  // List: "senin,rabu,jumat"
  if (j.includes(',')) {
    return j.split(',').map(s => s.trim()).some(h => HARI_MAP[h] === todayIdx);
  }

  // Tunggal
  return HARI_MAP[j] === todayIdx;
}

/** Bersihkan nomor WA: hapus "WA:" prefix, ambil digit, format 62xxx */
function cleanWANumber(raw: string): string {
  let num = raw.replace(/^wa:\s*/i, '').replace(/\D/g, '');
  if (!num) return '';
  if (num.startsWith('0'))        return '62' + num.slice(1);
  if (!num.startsWith('62'))      return '62' + num;
  return num;
}

export async function GET() {
  const todayIdx   = dayOfWeekWIB();   // 0=Minggu … 6=Sabtu (WIB)
  const todayLabel = hariIniWIB();     // "Senin", "Selasa", dst.

  try {
    await ensureSheetSetup(SPREADSHEET_ID);

    // Sheet NoWA: A=Nama Petugas | B=No WA | C=Jadwal Hari | D=Keterangan
    const rows = await getSheetValues(SPREADSHEET_ID, SHEET_NOWA);

    // Skip baris header (baris 0), filter baris yang punya nomor WA
    const data = rows.slice(1).filter(r => (r[1] ?? '').trim());

    if (data.length === 0) {
      return NextResponse.json({ ...DEFAULT, day: todayLabel });
    }

    // Cari baris yang jadwalnya cocok dengan hari ini (WIB)
    const matched = data.find(row => jadwalCocok(row[2] ?? '', todayIdx));

    // Fallback ke baris pertama jika tidak ada yang cocok
    const row = matched ?? data[0];

    const num = cleanWANumber(row[1] ?? '');

    return NextResponse.json({
      number: num || DEFAULT.number,
      name:   (row[0] ?? '').trim() || DEFAULT.name,
      day:    todayLabel,
      jadwal: (row[2] ?? '').trim(),
    });

  } catch (err) {
    console.error('[wa-number]', err);
    return NextResponse.json({ ...DEFAULT, day: todayLabel });
  }
}
