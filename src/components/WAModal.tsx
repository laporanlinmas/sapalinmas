'use client';

import { useState, useEffect, useRef } from 'react';
import Toast from './Toast';
import { useToast } from '@/lib/useToast';

interface WAModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface WAContact { number: string; name: string; day: string; jadwal?: string; }



export default function WAModal({ isOpen, onClose }: WAModalProps) {
  const { toast, showToast, hideToast } = useToast();
  const [step, setStep]         = useState<'form' | 'preview'>('form');
  const [form, setForm]         = useState({ nama: '', lokasi: '', pesan: '' });
  const [contact, setContact]   = useState<WAContact | null>(null);
  const [loading, setLoading]   = useState(true);
  const pesanRef                = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (isOpen) { fetchWA(); setStep('form'); }
    else { setForm({ nama: '', lokasi: '', pesan: '' }); setStep('form'); }
  }, [isOpen]);

  const fetchWA = async () => {
    setLoading(true);
    try {
      const res  = await fetch('/api/wa-number');
      const data = await res.json();
      setContact(data);
    } catch {
      setContact({ number: '6285123456789', name: 'Piket Satlinmas', day: '' });
    } finally {
      setLoading(false);
    }
  };

  const buildMessage = () =>
    `*LAPORAN PENGADUAN PEDESTRIAN*\n\n` +
    `👤 Nama: ${form.nama}\n` +
    `📍 Lokasi: ${form.lokasi}\n` +
    `📝 Laporan:\n${form.pesan}\n\n` +
    `_Dikirim via SIPEDAS Ponorogo_`;

  const goPreview = () => {
    if (!form.nama || !form.lokasi || !form.pesan) {
      showToast('Mohon lengkapi semua field!', 'error');
      return;
    }
    setStep('preview');
  };

  const send = () => {
    if (!contact) { showToast('Nomor WA belum tersedia.', 'error'); return; }
    window.open(`https://wa.me/${contact.number}?text=${encodeURIComponent(buildMessage())}`, '_blank');
    onClose();
  };

  if (!isOpen) return null;

  const currentDate = new Date().toLocaleDateString('id-ID', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  });

  return (
    <>
      {toast && <Toast message={toast.message} type={toast.type} onClose={hideToast} />}

      <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true">
        <div className="absolute inset-0 bg-slate-900/75 backdrop-blur-sm" onClick={onClose} />

        <div className="relative w-full max-w-md rounded-3xl shadow-2xl border border-slate-300 dark:border-slate-800 flex flex-col max-h-[90vh] animate-slide-up overflow-hidden"
          style={{ background: 'var(--wa-bg, #E5DDD5)' }}>

          {/* ── WA Header ── */}
          <div className="bg-gradient-to-r from-[#128C7E] to-[#075E54] px-4 py-3 flex items-center gap-3 shrink-0">
            <button onClick={step === 'preview' ? () => setStep('form') : onClose}
              className="text-white/80 hover:text-white p-1.5 rounded-full hover:bg-white/10 transition-colors">
              <i className="ph-bold ph-arrow-left text-lg" />
            </button>
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center shrink-0 border border-white/20">
              <i className="ph-fill ph-shield-check text-2xl text-white/90" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-bold text-white text-sm leading-tight truncate">
                {loading ? 'Memuat...' : contact?.name ?? 'Piket Satlinmas'}
              </p>
              <p className="text-[11px] text-emerald-200 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Online
                {!loading && contact?.day && (
                  <span className="opacity-75">· Piket {contact.day}</span>
                )}
                {!loading && contact?.jadwal && (
                  <span className="opacity-60">({contact.jadwal})</span>
                )}
              </p>
            </div>
            {/* Ikon WA */}
            <div className="shrink-0">
              <i className="ph-fill ph-whatsapp-logo text-white/60 text-xl" />
            </div>
          </div>

          {/* ── Chat body ── */}
          <div className="flex-1 overflow-y-auto custom-scrollbar p-4 wa-bg dark:bg-[#0B141A] flex flex-col gap-3">

            {/* Tanggal */}
            <div className="flex justify-center">
              <span className="bg-black/10 dark:bg-white/10 text-slate-700 dark:text-slate-300 text-[11px] font-semibold px-3 py-1 rounded-lg">
                {currentDate}
              </span>
            </div>

            {/* Bubble sambutan */}
            <div className="flex justify-start">
              <div className="bg-white dark:bg-[#202C33] text-slate-800 dark:text-slate-200 p-3 rounded-b-2xl rounded-tr-2xl shadow-sm max-w-[88%] text-sm relative">
                <p className="font-semibold text-[#128C7E] dark:text-emerald-400 text-xs mb-1">Satlinmas Pedestrian</p>
                Selamat datang! 👋 Kami siap membantu. Silakan isi laporan singkat di bawah ini.
                <span className="block text-[10px] text-slate-400 text-right mt-1.5 flex items-center justify-end gap-1">
                  Sekarang <i className="ph-fill ph-checks text-blue-400 text-xs" />
                </span>
                <div className="absolute top-0 -left-2 w-0 h-0 border-t-[8px] border-t-white dark:border-t-[#202C33] border-l-[8px] border-l-transparent" />
              </div>
            </div>

            {step === 'form' ? (
              <>


                {/* Form bubble */}
                <div className="flex justify-end">
                  <div className="w-[92%] bg-white/95 dark:bg-slate-800/95 p-4 rounded-2xl shadow-lg border border-white/60 dark:border-slate-700/50">
                    <div className="flex items-center gap-2 mb-3 pb-2 border-b border-slate-200 dark:border-slate-700">
                      <i className="ph-fill ph-pencil-simple text-[#128C7E] text-sm" />
                      <p className="text-xs font-bold text-slate-600 dark:text-slate-300">Isi Laporan</p>
                    </div>
                    <div className="space-y-2.5">
                      <div className="relative">
                        <i className="ph-fill ph-user absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs" />
                        <input type="text" value={form.nama}
                          onChange={e => setForm(p => ({ ...p, nama: e.target.value }))}
                          placeholder="Nama Anda"
                          className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl py-2 pl-8 pr-3 text-sm placeholder-slate-400 focus:ring-2 focus:ring-[#128C7E] outline-none transition-all" />
                      </div>
                      <div className="relative">
                        <i className="ph-fill ph-map-pin absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs" />
                        <input type="text" value={form.lokasi}
                          onChange={e => setForm(p => ({ ...p, lokasi: e.target.value }))}
                          placeholder="Lokasi Kejadian"
                          className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl py-2 pl-8 pr-3 text-sm placeholder-slate-400 focus:ring-2 focus:ring-[#128C7E] outline-none transition-all" />
                      </div>
                      <div className="relative">
                        <textarea ref={pesanRef} value={form.pesan}
                          onChange={e => setForm(p => ({ ...p, pesan: e.target.value }))}
                          rows={3} placeholder="Tuliskan laporan Anda..."
                          className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl py-2 px-3 text-sm placeholder-slate-400 focus:ring-2 focus:ring-[#128C7E] outline-none resize-none transition-all" />
                        <span className="absolute bottom-2 right-2 text-[10px] text-slate-400">
                          {form.pesan.length}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              /* Preview pesan */
              <div className="flex justify-end">
                <div className="bg-[#DCF8C6] dark:bg-[#005C4B] p-3 rounded-b-2xl rounded-tl-2xl shadow-sm max-w-[88%] text-sm relative">
                  <p className="text-slate-800 dark:text-slate-100 whitespace-pre-wrap text-xs leading-relaxed">
                    {buildMessage()}
                  </p>
                  <span className="block text-[10px] text-slate-500 dark:text-slate-400 text-right mt-1.5 flex items-center justify-end gap-1">
                    Sekarang <i className="ph-fill ph-clock text-xs" />
                  </span>
                  <div className="absolute top-0 -right-2 w-0 h-0 border-t-[8px] border-t-[#DCF8C6] dark:border-t-[#005C4B] border-r-[8px] border-r-transparent" />
                </div>
              </div>
            )}
          </div>

          {/* ── Footer ── */}
          <div className="bg-[#f0f2f5] dark:bg-[#1E2428] px-3 py-2.5 flex items-center gap-2.5 shrink-0">
            {step === 'form' ? (
              <>
                <div className="flex-1 bg-white dark:bg-[#2A3942] rounded-full py-2.5 px-4 text-xs text-slate-400 dark:text-slate-500 flex items-center gap-2">
                  <i className="ph-fill ph-smiley text-base" />
                  <span>Isi form di atas lalu kirim</span>
                </div>
                <button onClick={goPreview}
                  className="w-11 h-11 rounded-full bg-[#128C7E] hover:bg-[#0F7569] text-white flex items-center justify-center shrink-0 shadow-md hover:scale-105 transition-all">
                  <i className="ph-fill ph-paper-plane-right text-lg ml-0.5" />
                </button>
              </>
            ) : (
              <>
                <button onClick={() => setStep('form')}
                  className="flex-1 bg-white dark:bg-[#2A3942] rounded-full py-2.5 px-4 text-xs font-semibold text-slate-600 dark:text-slate-300 flex items-center justify-center gap-2 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
                  <i className="ph-bold ph-pencil text-sm" /> Edit
                </button>
                <button onClick={send} disabled={loading}
                  className="flex-1 bg-[#128C7E] hover:bg-[#0F7569] text-white rounded-full py-2.5 px-4 text-xs font-bold flex items-center justify-center gap-2 shadow-md transition-all disabled:opacity-50">
                  <i className="ph-fill ph-whatsapp-logo text-base" /> Kirim ke WA
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
