'use client';

import { useState, useEffect, useRef } from 'react';
import Toast from './Toast';
import { useToast } from '@/lib/useToast';

interface FormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (ticketNumber: string) => void;
}

const MAX_PHOTOS = 5;

export default function FormModal({ isOpen, onClose, onSuccess }: FormModalProps) {
  const { toast, showToast, hideToast } = useToast();
  const [form, setForm]       = useState({ nama: '', kategori: '', lokasi: '', deskripsi: '' });
  const [photos, setPhotos]   = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [previewIdx, setPreviewIdx] = useState<number | null>(null); // lightbox
  const [dragIdx, setDragIdx] = useState<number | null>(null);
  const [busy, setBusy]       = useState(false);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  const galleryRef = useRef<HTMLInputElement>(null);
  const cameraRef  = useRef<HTMLInputElement>(null);

  // Reset saat tutup
  useEffect(() => {
    if (!isOpen) {
      setForm({ nama: '', kategori: '', lokasi: '', deskripsi: '' });
      setPhotos([]);
      setPreviewIdx(null);
    }
  }, [isOpen]);

  // Buat object URLs
  useEffect(() => {
    const urls = photos.map(f => URL.createObjectURL(f));
    setPreviews(urls);
    return () => urls.forEach(u => URL.revokeObjectURL(u));
  }, [photos]);

  // Keyboard navigation for lightbox
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (previewIdx === null) return;
      if (e.key === 'ArrowLeft' && previewIdx > 0) {
        setPreviewIdx(p => (p ?? 1) - 1);
      } else if (e.key === 'ArrowRight' && previewIdx < previews.length - 1) {
        setPreviewIdx(p => (p ?? 0) + 1);
      } else if (e.key === 'Escape') {
        setPreviewIdx(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [previewIdx, previews.length]);

  const addFiles = (files: FileList | null) => {
    if (!files) return;
    const arr = Array.from(files);
    setPhotos(prev => {
      const combined = [...prev, ...arr];
      if (combined.length > MAX_PHOTOS) {
        showToast(`Maksimal ${MAX_PHOTOS} foto.`, 'error');
        return combined.slice(0, MAX_PHOTOS);
      }
      return combined;
    });
  };

  const removePhoto = (idx: number) => {
    setPhotos(prev => prev.filter((_, i) => i !== idx));
    if (previewIdx === idx) setPreviewIdx(null);
  };

  // Drag-to-reorder
  const onDragStart = (idx: number) => setDragIdx(idx);
  const onDragOver  = (e: React.DragEvent, idx: number) => {
    e.preventDefault();
    if (dragIdx === null || dragIdx === idx) return;
    setPhotos(prev => {
      const arr = [...prev];
      const [moved] = arr.splice(dragIdx, 1);
      arr.splice(idx, 0, moved);
      setDragIdx(idx);
      return arr;
    });
  };
  const onDragEnd = () => setDragIdx(null);

  // Swipe handlers for lightbox
  const minSwipeDistance = 50;
  const onTouchStartHandler = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };
  const onTouchMoveHandler = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };
  const onTouchEndHandler = () => {
    if (touchStart === null || touchEnd === null) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;
    
    if (isLeftSwipe && previewIdx !== null && previewIdx < previews.length - 1) {
      setPreviewIdx(p => (p ?? 0) + 1);
    }
    if (isRightSwipe && previewIdx !== null && previewIdx > 0) {
      setPreviewIdx(p => (p ?? 1) - 1);
    }
  };

  const set = (k: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
      setForm(p => ({ ...p, [k]: e.target.value }));

  const submit = async () => {
    if (!form.nama || !form.kategori || !form.lokasi || !form.deskripsi) {
      showToast('Semua field wajib diisi!', 'error');
      return;
    }
    setBusy(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      photos.forEach((f, i) => fd.append(`foto_${i}`, f));

      const res    = await fetch('/api/submit-complaint', { method: 'POST', body: fd });
      const result = await res.json();

      if (res.ok && result.success) {
        onSuccess(result.ticketNumber);
      } else {
        showToast(result.error || 'Gagal mengirim laporan.', 'error');
      }
    } catch {
      showToast('Terjadi kesalahan. Silakan coba lagi.', 'error');
    } finally {
      setBusy(false);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {toast && <Toast message={toast.message} type={toast.type} onClose={hideToast} />}

      {/* Lightbox preview */}
      {previewIdx !== null && (
        <div
          className="fixed inset-0 z-[80] bg-black/90 flex items-center justify-center p-4 touch-none"
          onClick={() => setPreviewIdx(null)}
          onTouchStart={onTouchStartHandler}
          onTouchMove={onTouchMoveHandler}
          onTouchEnd={onTouchEndHandler}
        >
          <button
            className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
            onClick={() => setPreviewIdx(null)}
          >
            <i className="ph-bold ph-x text-lg" />
          </button>
          {/* Navigasi */}
          {previewIdx > 0 && (
            <button
              className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
              onClick={e => { e.stopPropagation(); setPreviewIdx(p => (p ?? 1) - 1); }}
            >
              <i className="ph-bold ph-caret-left text-lg" />
            </button>
          )}
          {previewIdx < previews.length - 1 && (
            <button
              className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
              onClick={e => { e.stopPropagation(); setPreviewIdx(p => (p ?? 0) + 1); }}
            >
              <i className="ph-bold ph-caret-right text-lg" />
            </button>
          )}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={previews[previewIdx]}
            alt={`Foto ${previewIdx + 1}`}
            className="max-w-full max-h-[85vh] rounded-2xl object-contain shadow-2xl"
            onClick={e => e.stopPropagation()}
          />
          <p className="absolute bottom-4 text-white/60 text-sm font-medium">
            {previewIdx + 1} / {previews.length}
          </p>
        </div>
      )}

      <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true">
        <div className="absolute inset-0 bg-slate-900/75 backdrop-blur-sm" onClick={onClose} />

        <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-700 animate-slide-up flex flex-col max-h-[92vh]">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-t-3xl" />

          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800 shrink-0">
            <div>
              <h3 className="text-lg font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                <i className="ph-fill ph-article text-blue-600 dark:text-blue-400" />
                Form Laporan Pengaduan
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">Sistem Informasi Pedestrian Satlinmas</p>
            </div>
            <button onClick={onClose} className="w-9 h-9 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 hover:text-slate-800 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
              <i className="ph-bold ph-x" />
            </button>
          </div>

          {/* Body */}
          <div className="overflow-y-auto custom-scrollbar px-6 py-5 space-y-4 flex-1">

            {/* Nama + Kategori */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1.5 uppercase tracking-wide">
                  Nama Pelapor <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <i className="ph-fill ph-user absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />
                  <input type="text" value={form.nama} onChange={set('nama')} placeholder="Nama lengkap"
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl py-2.5 pl-9 pr-4 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:border-blue-500 focus:ring-0 outline-none transition-colors" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1.5 uppercase tracking-wide">
                  Kategori <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <i className="ph-fill ph-list-dashes absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm z-10" />
                  <select value={form.kategori} onChange={set('kategori')}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl py-2.5 pl-9 pr-8 text-sm text-slate-900 dark:text-white focus:border-blue-500 focus:ring-0 outline-none appearance-none cursor-pointer transition-colors">
                    <option value="" disabled>Pilih kategori...</option>
                    <option value="Fasilitas Rusak">Fasilitas Publik Rusak</option>
                    <option value="Pengamen">Gangguan Pengamen</option>
                    <option value="Pengemis">Gangguan Pengemis</option>
                    <option value="Pelanggaran Ketertiban">Pelanggaran Ketertiban</option>
                    <option value="Tindak Kejahatan">Indikasi Tindak Kejahatan</option>
                    <option value="Lainnya">Lainnya</option>
                  </select>
                  <i className="ph-bold ph-caret-down absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none text-xs" />
                </div>
              </div>
            </div>

            {/* Lokasi */}
            <div>
              <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1.5 uppercase tracking-wide">
                Lokasi Kejadian <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <i className="ph-fill ph-map-pin absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />
                <input type="text" value={form.lokasi} onChange={set('lokasi')} placeholder="Misal: Samping Halte Alun-Alun Utara"
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl py-2.5 pl-9 pr-4 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:border-blue-500 focus:ring-0 outline-none transition-colors" />
              </div>
            </div>

            {/* Deskripsi */}
            <div>
              <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1.5 uppercase tracking-wide">
                Deskripsi <span className="text-red-500">*</span>
              </label>
              <textarea value={form.deskripsi} onChange={set('deskripsi')} rows={3}
                placeholder="Ceritakan detail kronologi kejadian..."
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl py-2.5 px-4 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:border-blue-500 focus:ring-0 outline-none resize-none transition-colors" />
            </div>

            {/* ── Foto Bukti ── */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                  Foto Bukti
                  <span className="ml-1.5 text-slate-400 font-normal normal-case">
                    ({photos.length}/{MAX_PHOTOS})
                  </span>
                </label>
                {photos.length < MAX_PHOTOS && (
                  <div className="flex gap-2">
                    <button type="button" onClick={() => galleryRef.current?.click()}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 text-xs font-bold hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors border border-blue-200 dark:border-blue-800/40">
                      <i className="ph-fill ph-images text-sm" /> Galeri
                    </button>
                    <button type="button" onClick={() => cameraRef.current?.click()}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 text-xs font-bold hover:bg-emerald-100 dark:hover:bg-emerald-900/40 transition-colors border border-emerald-200 dark:border-emerald-800/40">
                      <i className="ph-fill ph-camera text-sm" /> Kamera
                    </button>
                  </div>
                )}
              </div>

              <input ref={galleryRef} type="file" accept="image/*" multiple className="hidden"
                onChange={e => { addFiles(e.target.files); e.target.value = ''; }} />
              <input ref={cameraRef} type="file" accept="image/*" capture="environment" className="hidden"
                onChange={e => { addFiles(e.target.files); e.target.value = ''; }} />

              {photos.length === 0 ? (
                <button type="button" onClick={() => galleryRef.current?.click()}
                  className="w-full border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-2xl py-8 flex flex-col items-center gap-2 hover:border-blue-400 hover:bg-blue-50/40 dark:hover:bg-blue-900/10 transition-colors group">
                  <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                    <i className="ph-fill ph-camera-plus text-2xl text-blue-500" />
                  </div>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    <span className="font-semibold text-blue-600 dark:text-blue-400">Tambah foto</span> dari galeri atau kamera
                  </p>
                  <p className="text-xs text-slate-400">Maks. {MAX_PHOTOS} foto · JPG, PNG hingga 10MB · Drag untuk urutkan</p>
                </button>
              ) : (
                <div className="grid grid-cols-5 gap-2">
                  {previews.map((url, idx) => (
                    <div
                      key={idx}
                      draggable
                      onDragStart={() => onDragStart(idx)}
                      onDragOver={e => onDragOver(e, idx)}
                      onDragEnd={onDragEnd}
                      className={`relative aspect-square rounded-xl overflow-hidden border-2 cursor-grab active:cursor-grabbing transition-all ${
                        dragIdx === idx
                          ? 'border-blue-400 scale-95 opacity-60'
                          : 'border-slate-200 dark:border-slate-700'
                      }`}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={url} alt={`Foto ${idx + 1}`} className="w-full h-full object-cover" />

                      {/* Tombol X hapus — selalu visible di mobile, hover di desktop */}
                      <button
                        type="button"
                        onClick={e => { e.stopPropagation(); removePhoto(idx); }}
                        className="absolute top-1 right-1 w-5 h-5 rounded-full bg-red-500 hover:bg-red-600 text-white flex items-center justify-center shadow-md transition-colors z-10 sm:opacity-0 sm:group-hover:opacity-100"
                        style={{ opacity: 1 }}
                      >
                        <i className="ph-bold ph-x text-[9px]" />
                      </button>

                      {/* Tap untuk preview */}
                      <button
                        type="button"
                        onClick={() => setPreviewIdx(idx)}
                        className="absolute inset-0 bg-black/0 hover:bg-black/30 transition-colors flex items-end justify-center pb-1"
                      >
                        <span className="text-white text-[9px] font-bold bg-black/40 px-1.5 py-0.5 rounded-full opacity-0 hover:opacity-100 transition-opacity">
                          Lihat
                        </span>
                      </button>

                      {/* Nomor urut */}
                      <span className="absolute top-1 left-1 w-4 h-4 bg-black/60 rounded-full text-white text-[9px] font-bold flex items-center justify-center pointer-events-none">
                        {idx + 1}
                      </span>
                    </div>
                  ))}

                  {/* Slot tambah */}
                  {photos.length < MAX_PHOTOS && (
                    <button type="button" onClick={() => galleryRef.current?.click()}
                      className="aspect-square rounded-xl border-2 border-dashed border-slate-300 dark:border-slate-600 flex flex-col items-center justify-center gap-1 hover:border-blue-400 hover:bg-blue-50/40 dark:hover:bg-blue-900/10 transition-colors">
                      <i className="ph-bold ph-plus text-slate-400 text-base" />
                      <span className="text-[9px] text-slate-400 font-semibold">Tambah</span>
                    </button>
                  )}
                </div>
              )}

              {photos.length > 0 && (
                <p className="text-[11px] text-slate-400 mt-2 flex items-center gap-1">
                  <i className="ph-fill ph-arrows-out-cardinal text-slate-400" />
                  Drag foto untuk mengubah urutan · Tap untuk preview · X untuk hapus
                </p>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="px-6 py-4 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-3 shrink-0">
            <button onClick={onClose} className="px-5 py-2.5 rounded-xl text-sm font-semibold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
              Batal
            </button>
            <button onClick={submit} disabled={busy}
              className="px-6 py-2.5 rounded-xl text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 transition-colors shadow-lg shadow-blue-500/25">
              {busy
                ? <><i className="ph-bold ph-spinner animate-spin" /> Mengirim...</>
                : <><i className="ph-bold ph-paper-plane-tilt" /> Kirim Laporan</>
              }
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
