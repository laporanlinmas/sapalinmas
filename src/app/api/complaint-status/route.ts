import { NextRequest, NextResponse } from 'next/server';
import { ensureSheetSetup, getSheetValues, SHEET_ADUAN } from '@/lib/google-sheets';

const SPREADSHEET_ID = process.env.SPREADSHEET_ID ?? '';

function normalizeTicket(raw: string): string {
  return (raw ?? '').trim().toUpperCase();
}

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const ticket = normalizeTicket(url.searchParams.get('ticket') ?? '');

  if (!ticket) {
    return NextResponse.json({ error: 'ticket wajib diisi' }, { status: 400 });
  }
  if (!SPREADSHEET_ID) {
    return NextResponse.json({ error: 'SPREADSHEET_ID belum dikonfigurasi' }, { status: 500 });
  }

  try {
    await ensureSheetSetup(SPREADSHEET_ID);
    const rows = await getSheetValues(SPREADSHEET_ID, SHEET_ADUAN);

    // Header: [Timestamp, ID Aduan, Nama, Kategori, Lokasi, Deskripsi, Foto1..5, Jumlah, Status, Catatan, Updated, Sumber]
    // Index:    0          1        2     3        4      5         ...        11      12      13      14      15
    const data = rows.slice(1);
    const row = data.find(r => normalizeTicket(r?.[1] ?? '') === ticket);

    if (!row) {
      return NextResponse.json({ found: false, ticket, message: 'Tiket tidak ditemukan.' }, { status: 404 });
    }

    return NextResponse.json({
      found: true,
      ticket: normalizeTicket(row[1] ?? ticket),
      timestamp: row[0] ?? '',
      nama: row[2] ?? '',
      kategori: row[3] ?? '',
      lokasi: row[4] ?? '',
      deskripsi: row[5] ?? '',
      status: row[12] ?? '',
      catatan: row[13] ?? '',
      updatedAt: row[14] ?? '',
      source: row[15] ?? '',
    });
  } catch (err) {
    console.error('[complaint-status]', err);
    return NextResponse.json({ error: 'Gagal mengambil status tiket.' }, { status: 500 });
  }
}

