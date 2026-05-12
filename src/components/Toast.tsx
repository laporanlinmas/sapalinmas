'use client';

import { useEffect } from 'react';

export type ToastType = 'error' | 'success' | 'info';

interface ToastProps {
  message: string;
  type?: ToastType;
  onClose: () => void;
}

const ICONS: Record<ToastType, string> = {
  error:   'ph-x-circle',
  success: 'ph-check-circle',
  info:    'ph-info',
};
const COLORS: Record<ToastType, string> = {
  error:   'bg-red-600',
  success: 'bg-emerald-600',
  info:    'bg-blue-600',
};

export default function Toast({ message, type = 'info', onClose }: ToastProps) {
  useEffect(() => {
    const t = setTimeout(onClose, 4000);
    return () => clearTimeout(t);
  }, [onClose]);

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[200] animate-slide-up">
      <div className={`flex items-center gap-3 px-5 py-3.5 rounded-2xl text-white shadow-2xl ${COLORS[type]} min-w-[260px] max-w-sm`}>
        <i className={`ph-fill ${ICONS[type]} text-xl shrink-0`} />
        <span className="text-sm font-semibold flex-1">{message}</span>
        <button onClick={onClose} className="shrink-0 opacity-70 hover:opacity-100 transition-opacity">
          <i className="ph-bold ph-x text-base" />
        </button>
      </div>
    </div>
  );
}
