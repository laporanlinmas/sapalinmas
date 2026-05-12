'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [dark, setDark]         = useState(false);

  useEffect(() => {
    setDark(document.documentElement.classList.contains('dark'));
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const toggleTheme = useCallback(() => {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle('dark', next);
    localStorage.setItem('theme', next ? 'dark' : 'light');
  }, [dark]);

  const goto = useCallback((id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    setMenuOpen(false);
  }, []);

  const navItems = [
    { id: 'cctv',      label: 'Live CCTV',  icon: 'ph-monitor-play',  color: 'text-blue-500' },
    { id: 'peta',      label: 'Pemetaan',     icon: 'ph-map-trifold',   color: 'text-indigo-500' },
    { id: 'pengaduan', label: 'Pengaduan',    icon: 'ph-megaphone',     color: 'text-orange-500' },
    { id: 'informasi', label: 'Info Program', icon: 'ph-info',          color: 'text-purple-500' },
  ];

  return (
    <>
      {/* Nav bar */}
      <nav aria-label="Navigasi utama" className={`fixed w-full top-0 z-40 transition-[padding] duration-300 ${scrolled ? 'pt-2' : 'pt-4'} px-4 sm:px-6`}>
        <div className="max-w-7xl mx-auto">

          {/* Pill */}
          <div className={`
            flex items-center justify-between h-14 px-4 sm:px-5 rounded-full
            bg-gradient-to-r from-blue-600/95 via-indigo-600/95 to-purple-600/95
            dark:from-slate-800/95 dark:to-slate-900/95
            border border-white/20 dark:border-slate-700/40
            backdrop-blur-md
            ${scrolled ? 'shadow-xl' : 'shadow-[0_8px_24px_rgba(59,130,246,.25)]'}
            transition-shadow duration-300
          `}>

            {/* Logo & Judul */}
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="flex items-center gap-2.5 sm:gap-3 group"
              aria-label="Ke atas"
            >
              <div className="w-8 h-8 md:w-9 md:h-9 rounded-full bg-white/10 border border-white/25 flex items-center justify-center overflow-hidden group-hover:bg-white/20 transition-colors shrink-0">
                <Image src="/assets/icon-full.png" alt="Icon" width={28} height={28} className="object-contain" priority />
              </div>
              
              <div className="flex items-center gap-2 sm:gap-2.5">
                {/* SI-PEDAS (Putih di Light, Gradien Kuning di Dark) */}
                <span className="text-[11px] sm:text-xs md:text-sm font-black text-white dark:text-transparent dark:bg-clip-text dark:bg-gradient-to-r dark:from-yellow-300 dark:via-yellow-400 dark:to-orange-400 tracking-[0.15em] sm:tracking-[0.2em] uppercase whitespace-nowrap transition-colors duration-300">
                  SI-PEDAS
                </span>
                
                {/* Garis Pemisah */}
                <span className="w-px h-3 sm:h-4 bg-white/70 dark:bg-slate-600 rounded-full transition-colors duration-300" />
                
                {/* SAPA PEDESTRIAN (Putih di Light, Biru di Dark) */}
                <span className="text-[11px] sm:text-xs md:text-sm font-extrabold text-white dark:text-blue-400 tracking-wide uppercase whitespace-nowrap transition-colors duration-300 drop-shadow-sm dark:drop-shadow-none">
                  SAPA PEDESTRIAN
                </span>
              </div>
            </button>

            {/* Desktop nav */}
            <div className="hidden lg:flex items-center gap-1">
              {navItems.map(item => (
                <button key={item.id} onClick={() => goto(item.id)}
                  className="px-3.5 py-1.5 rounded-full text-[13px] font-semibold text-white/85 hover:text-white hover:bg-white/15 transition-colors">
                  {item.label}
                </button>
              ))}
              <div className="w-px h-5 bg-white/20 mx-1" />
              <button onClick={toggleTheme}
                className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors text-white"
                aria-label="Toggle dark mode">
                {dark
                  ? <i className="ph-fill ph-sun text-base" />
                  : <i className="ph-fill ph-moon text-base" />
                }
              </button>
            </div>

            {/* Mobile controls */}
            <div className="lg:hidden flex items-center gap-1.5">
              <button onClick={toggleTheme}
                className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors text-white"
                aria-label="Toggle dark mode">
                {dark
                  ? <i className="ph-fill ph-sun text-base" />
                  : <i className="ph-fill ph-moon text-base" />
                }
              </button>
              <button onClick={() => setMenuOpen(v => !v)}
                className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors text-white"
                aria-label="Menu">
                {menuOpen
                  ? <i className="ph-bold ph-x text-lg" />
                  : <i className="ph-bold ph-list text-lg" />
                }
              </button>
            </div>
          </div>

          {/* Mobile dropdown — z-30 agar tidak menutupi konten video/iframe */}
          <div
            className={`
              lg:hidden absolute left-4 right-4 z-30
              transition-all duration-300 ease-out origin-top
              ${menuOpen
                ? 'opacity-100 scale-y-100 translate-y-0 pointer-events-auto'
                : 'opacity-0 scale-y-95 -translate-y-2 pointer-events-none'
              }
            `}
            style={{ top: scrolled ? '60px' : '68px' }}
          >
            <div className="bg-white dark:bg-slate-900 backdrop-blur-xl rounded-2xl px-3 py-3 shadow-2xl border border-slate-200 dark:border-slate-700 space-y-1">
              {navItems.map((item, i) => (
                <button
                  key={item.id}
                  onClick={() => goto(item.id)}
                  className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-left"
                  style={{ transitionDelay: menuOpen ? `${i * 35}ms` : '0ms' }}
                >
                  <i className={`ph-fill ${item.icon} ${item.color} text-lg`} />
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </nav>

      {/* Backdrop klik-luar untuk tutup menu mobile */}
      {menuOpen && (
        <div
          className="fixed inset-0 z-20 lg:hidden"
          onClick={() => setMenuOpen(false)}
          aria-hidden
        />
      )}
    </>
  );
}
