'use client';

import { useEffect, useRef, useState, useCallback } from 'react';

interface LiveStats {
  cctv:  number;
  today: number;
  month: number;
  aduan: number;
}

const STAT_META = [
  {
    key:    'cctv',
    label:  'CCTV Online',
    icon:   'ph-video-camera',
    color:  'text-blue-600 dark:text-blue-400',
    bg:     'bg-blue-50 dark:bg-blue-900/20',
    border: 'border-blue-200 dark:border-blue-800/40',
    dot:    'bg-blue-500',
    glow:   'hover:shadow-blue-500/20',
  },
  {
    key:    'today',
    label:  'Pengunjung Hari Ini',
    icon:   'ph-users',
    color:  'text-emerald-600 dark:text-emerald-400',
    bg:     'bg-emerald-50 dark:bg-emerald-900/20',
    border: 'border-emerald-200 dark:border-emerald-800/40',
    dot:    'bg-emerald-500',
    glow:   'hover:shadow-emerald-500/20',
  },
  {
    key:    'month',
    label:  'Pengunjung Bulan Ini',
    icon:   'ph-calendar-check',
    color:  'text-purple-600 dark:text-purple-400',
    bg:     'bg-purple-50 dark:bg-purple-900/20',
    border: 'border-purple-200 dark:border-purple-800/40',
    dot:    'bg-purple-500',
    glow:   'hover:shadow-purple-500/20',
  },
  {
    key:    'aduan',
    label:  'Total Aduan',
    icon:   'ph-megaphone',
    color:  'text-orange-600 dark:text-orange-400',
    bg:     'bg-orange-50 dark:bg-orange-900/20',
    border: 'border-orange-200 dark:border-orange-800/40',
    dot:    'bg-orange-500',
    glow:   'hover:shadow-orange-500/20',
  },
] as const;

/** Animasi angka dari nilai sebelumnya ke target */
function useCountUp(target: number, duration = 1200) {
  const [val, setVal]  = useState(0);
  const prevRef        = useRef(0);
  const rafRef         = useRef<number>(0);

  useEffect(() => {
    if (target === prevRef.current) return;
    const from = prevRef.current;
    prevRef.current = target;
    const t0 = performance.now();

    const tick = (now: number) => {
      const p    = Math.min((now - t0) / duration, 1);
      const ease = 1 - Math.pow(1 - p, 3);
      setVal(Math.round(from + ease * (target - from)));
      if (p < 1) rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [target, duration]);

  return val;
}

function StatCard({ meta, value }: { meta: typeof STAT_META[number]; value: number }) {
  const display = useCountUp(value);

  return (
    <div className={`flex items-center gap-3 px-4 py-3.5 rounded-2xl border-2 ${meta.bg} ${meta.border} transition-all duration-300 hover:scale-[1.03] hover:shadow-lg ${meta.glow} cursor-default`}>
      {/* Icon */}
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 bg-white dark:bg-slate-800 shadow-sm border ${meta.border}`}>
        <i className={`ph-fill ${meta.icon} ${meta.color} text-xl`} />
      </div>

      {/* Angka + label */}
      <div className="min-w-0 flex-1">
        <p className={`text-2xl font-extrabold tabular-nums leading-none ${meta.color}`}>
          {display.toLocaleString('id-ID')}
        </p>
        <p className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 mt-0.5 leading-tight truncate">
          {meta.label}
        </p>
      </div>

      {/* Live dot */}
      <span className={`w-2.5 h-2.5 rounded-full ${meta.dot} shrink-0 animate-pulse`} />
    </div>
  );
}

export default function StatsSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [stats, setStats]   = useState<LiveStats>({ cctv: 12, today: 0, month: 0, aduan: 0 });
  const [loaded, setLoaded] = useState(false);

  const fetchStats = useCallback(async () => {
    try {
      const [visitRes, aduanRes] = await Promise.all([
        fetch('/api/track-visit', { method: 'POST' }),
        fetch('/api/stats'),
      ]);
      const visit = await visitRes.json();
      const aduan = await aduanRes.json();
      setStats({
        cctv:  12,
        today: visit.today  ?? 0,
        month: visit.month  ?? 0,
        aduan: aduan.total  ?? 0,
      });
    } catch {
      // Tetap tampilkan 0 jika gagal
    }
  }, []);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !loaded) {
          setLoaded(true);
          fetchStats();
          obs.disconnect();
        }
      },
      { threshold: 0.1 },
    );
    if (sectionRef.current) obs.observe(sectionRef.current);
    return () => obs.disconnect();
  }, [loaded, fetchStats]);

  return (
    <section id="statistik" ref={sectionRef} className="scroll-mt-28 reveal">

      {/* Header */}
      <div className="mb-6 relative pl-4">
        <div className="absolute left-0 top-0 w-1 h-full bg-gradient-to-b from-emerald-500 to-blue-500 rounded-full" />
        <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white">
          Statistik Real-time
        </h2>
        <p className="text-slate-500 dark:text-slate-400 mt-1 text-sm">
          Data pemantauan kawasan diperbarui secara langsung.
        </p>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {STAT_META.map(m => (
          <StatCard key={m.key} meta={m} value={stats[m.key as keyof LiveStats]} />
        ))}
      </div>
    </section>
  );
}
