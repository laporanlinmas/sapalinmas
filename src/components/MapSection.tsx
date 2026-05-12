'use client';

import { useState } from 'react';

export default function MapSection() {
  const [mapLoaded, setMapLoaded] = useState(false);

  return (
    <section id="peta" className="scroll-mt-32 reveal">

      {/* ── Header ── */}
      <div className="mb-8 relative pl-3">
        <div className="absolute -left-4 top-0 w-1.5 h-full bg-gradient-to-b from-amber-400 to-orange-500 rounded-full" />
        <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white">
          Peta Kerawanan Kawasan
        </h2>
        <p className="text-slate-600 dark:text-slate-400 mt-3 text-lg font-medium">
          Sebaran titik rawan dan kejadian di jalur pedestrian Ponorogo secara real-time.
        </p>
      </div>

      {/* ── Card peta ── */}
      <div className="glass-panel rounded-3xl overflow-hidden border border-transparent hover:border-orange-400/40 dark:hover:border-orange-600/40 transition-all duration-300 hover:shadow-2xl group bg-white/80 dark:bg-slate-800/80 relative">

        {/* Shimmer hover */}
        <div className="absolute inset-0 bg-gradient-to-r from-orange-500/0 via-orange-500/[0.04] to-orange-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-3xl z-10" />

        {/* ── Top bar ── */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 dark:border-slate-700/50 relative z-20">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white shadow-md shadow-orange-500/30 group-hover:scale-105 transition-transform duration-300">
              <i className="ph-fill ph-warning text-xl" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-800 dark:text-white leading-tight">Peta Kerawanan Pedestrian</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse" />
                Titik rawan &amp; kejadian terpetakan
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Legend */}
            <div className="hidden sm:flex items-center gap-3 mr-2">
              <span className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500 shadow-sm shadow-red-500/50" />
                Rawan Tinggi
              </span>
              <span className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400 shadow-sm shadow-amber-400/50" />
                Rawan Sedang
              </span>
              <span className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
                <span className="w-2.5 h-2.5 rounded-full bg-green-500 shadow-sm shadow-green-500/50" />
                Aman
              </span>
            </div>

            <a
              href="https://www.google.com/maps/d/viewer?mid=1TuYzI9pWcS39u6wSyfhySLT6jyO_BNE"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm font-bold bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 hover:border-orange-500 hover:text-orange-600 dark:hover:text-orange-400 text-slate-700 dark:text-slate-200 py-2 px-3.5 rounded-xl transition-all shadow-sm hover:shadow-md hover:-translate-y-0.5"
            >
              <i className="ph-bold ph-arrows-out text-sm" />
              <span className="hidden sm:inline">Layar Penuh</span>
            </a>
          </div>
        </div>

        {/* ── Iframe peta ── */}
        <div className="relative w-full bg-slate-100 dark:bg-slate-900" style={{ height: '520px' }}>
          {/* Corner accents */}
          <div className="absolute top-0 left-0 w-6 h-6 border-t-4 border-l-4 border-orange-500 z-20 rounded-tl-lg m-3 opacity-70 pointer-events-none" />
          <div className="absolute top-0 right-0 w-6 h-6 border-t-4 border-r-4 border-orange-500 z-20 rounded-tr-lg m-3 opacity-70 pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-6 h-6 border-b-4 border-l-4 border-orange-500 z-20 rounded-bl-lg m-3 opacity-70 pointer-events-none" />
          <div className="absolute bottom-0 right-0 w-6 h-6 border-b-4 border-r-4 border-orange-500 z-20 rounded-br-lg m-3 opacity-70 pointer-events-none" />

          {/* Loading skeleton */}
          {!mapLoaded && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-slate-100 dark:bg-slate-900 z-10">
              <div className="relative">
                <div className="w-14 h-14 rounded-full border-4 border-orange-500/20 border-t-orange-500 animate-spin" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <i className="ph-fill ph-map-pin text-orange-500 text-lg" />
                </div>
              </div>
              <div className="text-center">
                <p className="text-slate-600 dark:text-slate-400 text-sm font-medium">Memuat peta kerawanan…</p>
                <p className="text-slate-400 dark:text-slate-500 text-xs mt-1">Google Maps Custom Layer</p>
              </div>
            </div>
          )}

          <iframe
            src="https://www.google.com/maps/d/embed?mid=1TuYzI9pWcS39u6wSyfhySLT6jyO_BNE&z=15"
            className="absolute top-[-55px] left-0 w-full border-0"
            style={{ height: 'calc(100% + 55px)' }}
            title="Peta Kerawanan Pedestrian Ponorogo"
            allowFullScreen
            loading="lazy"
            onLoad={() => setMapLoaded(true)}
          />
        </div>

        {/* ── Bottom bar ── */}
        <div className="px-5 py-3.5 border-t border-slate-100 dark:border-slate-700/50 flex flex-wrap items-center justify-between gap-3 relative z-20">
          <div className="flex flex-wrap items-center gap-4">
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800/40 px-3 py-1 rounded-full">
              <i className="ph-fill ph-map-pin text-xs" />
              Google Maps — Peta Kustom
            </span>
            <span className="inline-flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
              <i className="ph-fill ph-info text-slate-400 text-xs" />
              Klik marker untuk detail titik rawan
            </span>
          </div>
          <span className="text-xs text-slate-400 dark:text-slate-500 flex items-center gap-1">
            <i className="ph-fill ph-clock text-xs" />
            Diperbarui berkala oleh petugas
          </span>
        </div>
      </div>

    </section>
  );
}
