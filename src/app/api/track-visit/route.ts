import { NextResponse } from 'next/server';
import { todayWIB, monthWIB } from '@/lib/wib';

/**
 * In-memory counter kunjungan.
 * Reset otomatis setiap hari/bulan baru (WIB).
 * Catatan: reset saat Vercel cold start — cukup untuk landing page publik.
 */
const store = {
  today:          0,
  month:          0,
  lastDay:        '',   // YYYY-MM-DD WIB
  lastMonth:      '',   // YYYY-MM WIB
};

function checkReset() {
  const d = todayWIB();
  const m = monthWIB();

  if (store.lastDay !== d) {
    store.today   = 0;
    store.lastDay = d;
  }
  if (store.lastMonth !== m) {
    store.month      = 0;
    store.lastMonth  = m;
  }
}

/** POST — catat satu kunjungan */
export async function POST() {
  checkReset();
  store.today++;
  store.month++;
  return NextResponse.json({ today: store.today, month: store.month });
}

/** GET — baca counter tanpa increment */
export async function GET() {
  checkReset();
  return NextResponse.json({ today: store.today, month: store.month });
}
