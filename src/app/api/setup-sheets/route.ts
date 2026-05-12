import { NextResponse } from 'next/server';
import { ensureSheetSetup } from '@/lib/google-sheets';

const SPREADSHEET_ID = process.env.SPREADSHEET_ID ?? '';

// GET /api/setup-sheets — panggil sekali untuk inisialisasi sheet
// Dilindungi dengan secret key opsional
export async function GET(req: Request) {
  const secret = process.env.SETUP_SECRET;
  if (secret) {
    const url    = new URL(req.url);
    const token  = url.searchParams.get('token');
    if (token !== secret) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
  }

  try {
    await ensureSheetSetup(SPREADSHEET_ID);
    return NextResponse.json({
      success: true,
      message: 'Sheet Aduan dan NoWA sudah siap dengan header dan format.',
    });
  } catch (err: any) {
    console.error('[setup-sheets]', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
