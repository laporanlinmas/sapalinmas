'use client';

import { useState } from 'react';

interface SuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  ticketNumber: string;
}

export default function SuccessModal({ isOpen, onClose, ticketNumber }: SuccessModalProps) {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const copyTicket = async () => {
    try {
      await navigator.clipboard.writeText(ticketNumber);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback untuk browser yang tidak support clipboard API
      const el = document.createElement('textarea');
      el.value = ticketNumber;
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4" role="dialog" aria-modal="true">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-slate-900/75 backdrop-blur-sm" onClick={onClose} />

      {/* Panel */}
      <div className="relative w-full max-w-sm bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 animate-slide-up overflow-hidden">
        {/* Accent top */}
        <div className="h-1.5 w-full bg-gradient-to-r from-emerald-400 to-teal-500" />

        <div className="px-7 pt-8 pb-6 text-center">
          {/* Icon dengan ping */}
          <div className="relative w-20 h-20 mx-auto mb-5">
            <div className="absolute inset-0 bg-emerald-400/20 rounded-full animate-ping" />
            <div className="relative w-20 h-20 bg-gradient-to-br from-emerald-100 to-emerald-200 dark:from-emerald-900/50 dark:to-emerald-800/50 rounded-full flex items-center justify-center shadow-inner">
              <i className="ph-bold ph-check text-emerald-600 dark:text-emerald-400 text-4xl" />
            </div>
          </div>

          <h3 className="text-xl font-extrabold text-slate-900 dark:text-white mb-2">
            Laporan Terkirim!
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-5 leading-relaxed">
            Terima kasih atas partisipasi Anda. Laporan masuk ke sistem dengan nomor tiket:
          </p>

          {/* Ticket number */}
          <div className="bg-slate-100 dark:bg-slate-800 rounded-2xl px-4 py-3 flex items-center justify-between border border-slate-200 dark:border-slate-700 mb-6">
            <span className="font-mono text-base font-bold text-slate-800 dark:text-slate-200 tracking-wider">
              {ticketNumber}
            </span>
            <button
              onClick={copyTicket}
              className={`flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-lg transition-all ${
                copied
                  ? 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400'
                  : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-blue-100 dark:hover:bg-blue-900/30 hover:text-blue-600 dark:hover:text-blue-400'
              }`}
            >
              <i className={`ph-bold ${copied ? 'ph-check' : 'ph-copy'} text-sm`} />
              {copied ? 'Tersalin!' : 'Salin'}
            </button>
          </div>

          <button
            onClick={onClose}
            className="w-full py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold transition-colors shadow-lg shadow-blue-500/25"
          >
            Selesai & Tutup
          </button>
        </div>
      </div>
    </div>
  );
}
