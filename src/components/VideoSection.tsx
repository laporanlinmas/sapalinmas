'use client';

import { useState } from 'react';

const YOUTUBE_ID = 'idrySoqUxXw';

const FEATURES = [
  { icon: 'ph-path',         label: 'Jalur pemandu (guiding block) khusus disabilitas' },
  { icon: 'ph-park',         label: 'Bangku taman estetik & penerangan modern'          },
  { icon: 'ph-shield-check', label: 'Pengawasan keamanan 24 jam oleh Satlinmas'         },
] as const;

export default function VideoSection() {
  const [loaded, setLoaded] = useState(false);

  return (
    <section id="video" className="scroll-mt-32 pt-16 reveal">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">

          {/* ── Kolom Kiri: Penjelasan ── */}
          <div className="order-2 lg:order-1 text-center lg:text-left">

            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-sm font-bold mb-6 border border-blue-100 dark:border-blue-800/60 animate-pulse-glow">
              <i className="ph-fill ph-video-camera text-base" />
              <span>Video Profil</span>
            </div>

            <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-white leading-tight mb-5">
              Sapa{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-500">
                Pedestrian
              </span>{' '}
              Ponorogo
            </h2>

            <p className="text-slate-600 dark:text-slate-400 text-base lg:text-lg leading-relaxed mb-8 max-w-lg mx-auto lg:mx-0">
              Kawasan pejalan kaki yang aman, nyaman, dan inklusif — wujud komitmen Pemerintah
              Kabupaten Ponorogo untuk masyarakat. Simak video profil singkat kawasan pedestrian
              yang humanis dan tertata rapi.
            </p>

            <ul className="space-y-3.5 text-left max-w-md mx-auto lg:mx-0">
              {FEATURES.map(({ icon, label }) => (
                <li key={icon} className="flex items-center gap-3 group">
                  <div className="w-9 h-9 rounded-full bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center shrink-0 group-hover:bg-blue-200 dark:group-hover:bg-blue-800/60 transition-colors duration-300">
                    <i className={`ph-bold ${icon} text-blue-600 dark:text-blue-400 text-sm`} />
                  </div>
                  <p className="text-slate-700 dark:text-slate-300 text-sm font-medium group-hover:text-blue-700 dark:group-hover:text-blue-300 transition-colors duration-300">{label}</p>
                </li>
              ))}
            </ul>
          </div>

          {/* ── Kolom Kanan: Video Player ── */}
          <div className="order-1 lg:order-2 flex justify-center">
            <div className="relative w-full max-w-[300px] sm:max-w-[340px] lg:max-w-[320px] xl:max-w-[360px]">

              {/* Glow ambient */}
              <div className="absolute -inset-6 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-[3rem] blur-3xl opacity-15 dark:opacity-25 pointer-events-none animate-pulse" />
              {/* Floating ring */}
              <div className="absolute -inset-3 border-2 border-dashed border-blue-300/30 dark:border-blue-700/30 rounded-[2.5rem] pointer-events-none animate-spin-slow" />

              {/* Card player */}
              <div className="relative rounded-[2rem] overflow-hidden shadow-2xl border-2 border-slate-200/80 dark:border-slate-700/60 bg-slate-950 flex flex-col">

                {/* ── Titlebar ── */}
                <div className="flex items-center gap-2 px-4 py-2.5 bg-slate-900 border-b border-white/5 shrink-0">
                  {/* Traffic lights */}
                  <div className="flex gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-red-500/90" />
                    <span className="w-2.5 h-2.5 rounded-full bg-yellow-400/90" />
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/90" />
                  </div>
                  {/* Filename */}
                  <span className="flex-1 min-w-0 text-slate-400 text-[11px] font-medium flex items-center gap-1.5 ml-1.5">
                    <i className="ph-fill ph-youtube-logo text-slate-300 shrink-0" />
                    <span className="truncate">Profil Satgas Linmas Pedestrian</span>
                  </span>
                  {/* Quality badge */}
                  <span className="shrink-0 flex items-center gap-1 bg-white/10 px-1.5 py-0.5 rounded text-emerald-400 text-[10px] font-bold tracking-wide">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    HD
                  </span>
                </div>

                {/*
                  ── Portrait Player 9:16 ──
                  paddingBottom = (16/9) * 100% = 177.78%
                */}
                <div className="relative w-full bg-slate-950" style={{ paddingBottom: '177.78%' }}>
                  {/* Loading shimmer */}
                  {!loaded && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-slate-900 z-20">
                      <div className="w-12 h-12 rounded-full border-4 border-red-600/30 border-t-red-600 animate-spin" />
                      <span className="text-slate-400 text-xs font-medium">Memuat YouTube...</span>
                    </div>
                  )}

                  <iframe
                    src={`https://www.youtube.com/embed/${YOUTUBE_ID}?autoplay=0&rel=0&modestbranding=1`}
                    className="absolute inset-0 w-full h-full border-0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    loading="lazy"
                    title="Profil Kawasan Pedestrian Ponorogo (YouTube)"
                    onLoad={() => setLoaded(true)}
                  />
                </div>

                {/* ── Footer bar ── */}
                <div className="flex items-center justify-between px-4 py-2 bg-slate-900 border-t border-white/5 shrink-0">
                  <span className="text-[11px] text-slate-400 flex items-center gap-1.5">
                    <i className="ph-fill ph-map-pin text-blue-400 text-xs" />
                    Kawasan Pedestrian, Kab. Ponorogo
                  </span>
                  <span className="text-[10px] text-slate-600 font-semibold">&copy; 2026</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
