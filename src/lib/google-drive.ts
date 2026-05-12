import { getDrive } from './google-auth';
import { Readable } from 'stream';

export interface UploadResult {
  id: string;
  webViewLink: string;
}

// Cache folder ID agar tidak query Drive berulang kali
const _folderCache = new Map<string, string>();

/**
 * Cari atau buat subfolder di dalam parentFolderId.
 * Cache hasilnya agar tidak query Drive berulang.
 */
export async function getOrCreateFolder(parentId: string, name: string): Promise<string> {
  const cacheKey = `${parentId}::${name}`;
  if (_folderCache.has(cacheKey)) return _folderCache.get(cacheKey)!;

  const drive = getDrive();
  const safeName = name.replace(/[/\\?%*:|"<>]/g, '_').trim() || 'Tanpa_Nama';

  // Cari folder yang sudah ada
  const q = `'${parentId}' in parents and name = '${safeName.replace(/'/g, "\\'")}' and mimeType = 'application/vnd.google-apps.folder' and trashed = false`;
  const list = await drive.files.list({
    q,
    fields: 'files(id)',
    spaces: 'drive',
    supportsAllDrives: true,
    includeItemsFromAllDrives: true,
  } as any);

  if (list.data.files && list.data.files.length > 0) {
    const id = list.data.files[0].id!;
    _folderCache.set(cacheKey, id);
    return id;
  }

  // Buat folder baru
  const created = await drive.files.create({
    supportsAllDrives: true,
    requestBody: {
      name: safeName,
      mimeType: 'application/vnd.google-apps.folder',
      parents: [parentId],
    },
    fields: 'id',
  } as any);

  const newId = created.data.id!;

  // Set publik agar bisa diakses
  await drive.permissions.create({
    fileId: newId,
    supportsAllDrives: true,
    requestBody: { role: 'reader', type: 'anyone' },
  } as any).catch(() => {});

  _folderCache.set(cacheKey, newId);
  return newId;
}

/**
 * Upload file ke folder Drive.
 * Struktur: FOLDER_UTAMA_ID / Aduan / [nama_pelapor] / file
 */
export async function uploadFileToDrive(
  buffer: Buffer,
  fileName: string,
  mimeType: string,
  folderId: string,
): Promise<UploadResult> {
  const drive = getDrive();

  const res = await drive.files.create({
    supportsAllDrives: true,
    requestBody: { name: fileName, parents: [folderId] },
    media: { mimeType: mimeType || 'image/jpeg', body: Readable.from(buffer) },
    fields: 'id,webViewLink',
  } as any);

  const fileId = res.data.id ?? '';

  if (fileId) {
    await drive.permissions.create({
      fileId,
      supportsAllDrives: true,
      requestBody: { role: 'reader', type: 'anyone' },
    } as any).catch(() => {});
  }

  return {
    id: fileId,
    webViewLink: res.data.webViewLink ?? `https://drive.google.com/file/d/${fileId}/view`,
  };
}
