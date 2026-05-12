import { google } from 'googleapis';

const SCOPES = [
  'https://www.googleapis.com/auth/spreadsheets',
  'https://www.googleapis.com/auth/drive',
];

function buildAuth() {
  const jsonStr = process.env.GOOGLE_SERVICE_ACCOUNT_JSON;
  if (!jsonStr) {
    throw new Error('GOOGLE_SERVICE_ACCOUNT_JSON environment variable tidak ditemukan.');
  }

  let credentials: object;
  try {
    credentials = JSON.parse(jsonStr);
  } catch {
    throw new Error('GOOGLE_SERVICE_ACCOUNT_JSON bukan JSON yang valid.');
  }

  return new google.auth.GoogleAuth({ credentials, scopes: SCOPES });
}

// Singleton — tidak rebuild tiap request
let _auth: ReturnType<typeof buildAuth> | null = null;
function getAuth() {
  if (!_auth) _auth = buildAuth();
  return _auth;
}

export function getSheets() {
  return google.sheets({ version: 'v4', auth: getAuth() });
}

export function getDrive() {
  return google.drive({ version: 'v3', auth: getAuth() });
}
