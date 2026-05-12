import { getSheets } from './google-auth';

// ─── Nama sheet ───────────────────────────────────────────
export const SHEET_ADUAN = process.env.COMPLAINT_SHEET_NAME ?? 'Aduan';
export const SHEET_NOWA  = process.env.WA_SHEET_NAME        ?? 'NoWA';

// ─── Header definisi ─────────────────────────────────────
// Aduan: 16 kolom (A–P)
export const HEADER_ADUAN = [
  'Timestamp', 'ID Aduan', 'Nama Pelapor', 'Kategori', 'Lokasi', 'Deskripsi',
  'Foto 1', 'Foto 2', 'Foto 3', 'Foto 4', 'Foto 5',
  'Jumlah Foto', 'Status', 'Catatan Petugas', 'Terakhir Diperbarui', 'Sumber',
];

// NoWA: 4 kolom (A–D)
export const HEADER_NOWA = ['Nama Petugas', 'No WA', 'Jadwal Hari', 'Keterangan'];

// ─── Warna header (biru) ──────────────────────────────────
const HEADER_BG    = { red: 0.13, green: 0.40, blue: 0.78 }; // #2166C7
const HEADER_FG    = { red: 1,    green: 1,    blue: 1    };

// ─── Append rows ─────────────────────────────────────────
export async function appendRows(
  spreadsheetId: string,
  sheetName: string,
  rows: unknown[][],
) {
  const sheets = getSheets();
  await sheets.spreadsheets.values.append({
    spreadsheetId,
    range: `${sheetName}!A1`,
    valueInputOption: 'RAW',
    requestBody: { values: rows },
  });
}

// ─── Get values ──────────────────────────────────────────
export async function getSheetValues(
  spreadsheetId: string,
  sheetName: string,
): Promise<string[][]> {
  const sheets = getSheets();
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range: `${sheetName}!A:Z`,
  });
  return (res.data.values as string[][]) ?? [];
}

// ─── Setup sheet: buat jika belum ada, pasang header + format ─
export async function ensureSheetSetup(spreadsheetId: string) {
  const sheets = getSheets();

  // Ambil daftar sheet yang sudah ada
  const meta = await sheets.spreadsheets.get({ spreadsheetId });
  const existing = (meta.data.sheets ?? []).map(s => s.properties?.title ?? '');

  const requests: any[] = [];

  // ── Buat sheet jika belum ada ──
  for (const name of [SHEET_ADUAN, SHEET_NOWA]) {
    if (!existing.includes(name)) {
      requests.push({ addSheet: { properties: { title: name } } });
    }
  }

  if (requests.length > 0) {
    await sheets.spreadsheets.batchUpdate({
      spreadsheetId,
      requestBody: { requests },
    });
  }

  // Ambil ulang meta setelah kemungkinan penambahan sheet
  const meta2  = await sheets.spreadsheets.get({ spreadsheetId });
  const sheets2 = meta2.data.sheets ?? [];

  const getSheetId = (name: string) =>
    sheets2.find(s => s.properties?.title === name)?.properties?.sheetId ?? 0;

  const formatRequests: any[] = [];

  // ── Helper: format header row ──
  const headerFormat = (sheetId: number, colCount: number) => [
    // Background biru + teks putih bold
    {
      repeatCell: {
        range: { sheetId, startRowIndex: 0, endRowIndex: 1, startColumnIndex: 0, endColumnIndex: colCount },
        cell: {
          userEnteredFormat: {
            backgroundColor: HEADER_BG,
            textFormat: { foregroundColor: HEADER_FG, bold: true, fontSize: 10 },
            horizontalAlignment: 'CENTER',
            verticalAlignment: 'MIDDLE',
          },
        },
        fields: 'userEnteredFormat(backgroundColor,textFormat,horizontalAlignment,verticalAlignment)',
      },
    },
    // Freeze baris pertama
    {
      updateSheetProperties: {
        properties: { sheetId, gridProperties: { frozenRowCount: 1 } },
        fields: 'gridProperties.frozenRowCount',
      },
    },
    // Auto-resize kolom
    {
      autoResizeDimensions: {
        dimensions: { sheetId, dimension: 'COLUMNS', startIndex: 0, endIndex: colCount },
      },
    },
  ];

  // ── Aduan ──
  const aduanId = getSheetId(SHEET_ADUAN);
  const aduanVals = await getSheetValues(spreadsheetId, SHEET_ADUAN);
  if (aduanVals.length === 0 || aduanVals[0][0] !== 'Timestamp') {
    // Tulis header
    await sheets.spreadsheets.values.update({
      spreadsheetId,
      range: `${SHEET_ADUAN}!A1`,
      valueInputOption: 'RAW',
      requestBody: { values: [HEADER_ADUAN] },
    });
    formatRequests.push(...headerFormat(aduanId, HEADER_ADUAN.length));
  }

  // ── NoWA ──
  const nowaId = getSheetId(SHEET_NOWA);
  const nowaVals = await getSheetValues(spreadsheetId, SHEET_NOWA);
  if (nowaVals.length === 0 || nowaVals[0][0] !== 'Nama Petugas') {
    await sheets.spreadsheets.values.update({
      spreadsheetId,
      range: `${SHEET_NOWA}!A1`,
      valueInputOption: 'RAW',
      requestBody: { values: [HEADER_NOWA] },
    });
    formatRequests.push(...headerFormat(nowaId, HEADER_NOWA.length));
  }

  if (formatRequests.length > 0) {
    await sheets.spreadsheets.batchUpdate({
      spreadsheetId,
      requestBody: { requests: formatRequests },
    });
  }
}
