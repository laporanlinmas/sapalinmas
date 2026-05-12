import { NextResponse } from 'next/server';
import { getSheetValues, SHEET_ADUAN } from '@/lib/google-sheets';

const SPREADSHEET_ID = process.env.SPREADSHEET_ID ?? '';

export async function GET() {
  try {
    const rows = await getSheetValues(SPREADSHEET_ID, SHEET_ADUAN);
    // Baris pertama = header, sisanya = data
    const total = Math.max(0, rows.length - 1);
    return NextResponse.json({ total });
  } catch {
    return NextResponse.json({ total: 0 });
  }
}
