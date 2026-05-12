'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface CCTVData {
  loc: string;
  id: string;
  youtubeId: string;
}

const cctvData: CCTVData[] = [
  { loc: "Simpang Tugu",               id: "01", youtubeId: "1v52cQ1qJBA" },
  { loc: "Margo Utomo - Utara Teteg",  id: "02", youtubeId: "JUI1Wx4E25Q" },
  { loc: "Simpang Borobudur Plaza",    id: "03", youtubeId: "FCuHGm6VMHs" },
  { loc: "Margo Utomo - Selatan Olive",id: "04", youtubeId: "ijG22Q85GRg" },
  { loc: "Margo Utomo - Optic Tugu",   id: "05", youtubeId: "ghJg364QRkQ" },
  { loc: "Simpang Jati Kencana",       id: "06", youtubeId: "SDK-sOjzo1I" },
  { loc: "Margo Utomo - Selatan Tugu", id: "07", youtubeId: "csO7IGlUaYI" },
  { loc: "Titik Nol Kilometer",        id: "08", youtubeId: "p5fsOsGos6Y" },
  { loc: "Alun-Alun Kidul",            id: "09", youtubeId: "4MdiRrgX6fk" },
  { loc: "Stasiun Tugu / Malioboro",   id: "10", youtubeId: "NUpEhkmv-Oo" },
  { loc: "Plaza Malioboro",            id: "11", youtubeId: "q7ZX2tSFEDg" },
  { loc: "Gunung Merapi (Live)",       id: "12", youtubeId: "8X7gHBhD1Tw" },
];

function getCurrentTime() {
  return new Date().toLocaleTimeString('id-ID', { hour12: false });
}

export default function CCTVPage() {
  const [currentTime, setCurrentTime] = useState('');
  const [showAll, setShowAll] = useState(false);
  
  // State Dashboard Biasa
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [isMounted, setIsMounted] = useState(false);
  const [mobileCols, setMobileCols] = useState<1 | 2>(1);
  const [desktopCols, setDesktopCols] = useState<2 | 4>(4);

  // State Dark/Light Mode
  const [isDark, setIsDark] = useState(true);

  // State Fullscreen Mode
  const [isFullscreenMode, setIsFullscreenMode] = useState(false);
  const [fullscreenPage, setFullscreenPage] = useState(0); 
  const [focusedFullscreenId, setFocusedFullscreenId] = useState<string | null>(null);
  
  const itemsPerPage = 4;
  const totalPages = Math.ceil(cctvData.length / itemsPerPage);

  useEffect(() => {
    setIsMounted(true);
    setCurrentTime(getCurrentTime());
    
    // Inisiasi Deteksi Tema Sistem
    if (document.documentElement.classList.contains('dark')) {
      setIsDark(true);
    } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setIsDark(true);
      document.documentElement.classList.add('dark');
    } else {
      setIsDark(false);
      document.documentElement.classList.remove('dark');
    }

    const interval = setInterval(() => setCurrentTime(getCurrentTime()), 1000);
    return () => clearInterval(interval);
  }, []);

  const toggleTheme = () => {
    if (isDark) {
      document.documentElement.classList.remove('dark');
      setIsDark(false);
    } else {
      document.documentElement.classList.add('dark');
      setIsDark(true);
    }
  };

  const displayedCCTVs = showAll ? cctvData : cctvData.slice(0, 4);

  const gridClasses = `grid gap-2 sm:gap-4 grid-flow-row-dense transition-all duration-500
    ${mobileCols === 1 ? 'grid-cols-1' : 'grid-cols-2'} 
    ${desktopCols === 2 ? 'md:grid-cols-2' : 'md:grid-cols-2 lg:grid-cols-4'}
  `;

  // Navigasi Fullscreen
  const nextFullscreenPage = () => {
    setFullscreenPage((prev) => (prev + 1) % totalPages);
    setFocusedFullscreenId(null);
  };
  const prevFullscreenPage = () => {
    setFullscreenPage((prev) => (prev - 1 + totalPages) % totalPages);
    setFocusedFullscreenId(null);
  };

  const handleShowLess = () => {
    setShowAll(false);
    setExpandedId(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // LOGIKA KLIK VIDEO DI DASHBOARD BIASA
  const handleVideoClick = (id: string) => {
    // Jika di HP (lebar < 640px) dan Grid diatur 1, langsung buka mode Fullscreen Focus
    if (window.innerWidth < 640 && mobileCols === 1) {
      setFocusedFullscreenId(id);
      setIsFullscreenMode(true);
    } else {
      // Jika di Desktop atau Mobile Grid 2, jalankan efek pembesaran biasa (in-place)
      setExpandedId(id);
    }
  };

  return (
    <main className={`min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col font-sans relative transition-all duration-500 ease-out transform ${
      isMounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
    }`}>
      
      {/* ── Top Bar Dashboard ── */}
      <header className="sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 px-3 sm:px-6 py-2.5 sm:py-4 shadow-sm">
        <div className="max-w-[1400px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          
          {/* Header Kiri (Identitas & Tombol Kembali) */}
          <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto">
            <Link href="/#cctv" className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-300 transition-all hover:-translate-x-1 shrink-0 group">
              <i className="ph-bold ph-arrow-left text-sm sm:text-lg group-hover:text-blue-500" />
            </Link>
            <div className="flex-1 overflow-hidden">
              <h1 className="text-sm sm:text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-1.5 tracking-tight truncate">
                Dashboard CCTV
                <span className="flex h-1.5 w-1.5 sm:h-2 sm:w-2 relative ml-0.5 shrink-0">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-full w-full bg-red-500"></span>
                </span>
              </h1>
              <p className="text-[9px] sm:text-xs font-semibold text-slate-500 dark:text-slate-400 truncate">
                12 Titik Pantau Kawasan Pedestrian
              </p>
            </div>
            
            {/* Tombol Tema (Mobile) */}
            <button 
              onClick={toggleTheme}
              className="flex sm:hidden w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 items-center justify-center ml-auto shrink-0"
            >
              {isDark ? <i className="ph-fill ph-sun text-sm" /> : <i className="ph-fill ph-moon text-sm" />}
            </button>
          </div>

          {/* Kontrol Kanan (Mode, Grid, Waktu) */}
          <div className="flex items-center gap-1.5 sm:gap-3 w-full sm:w-auto justify-between sm:justify-end">
            
            <button 
              onClick={toggleTheme}
              className="hidden sm:flex w-9 h-9 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 items-center justify-center transition-colors shrink-0"
              title="Ganti Tema"
            >
              {isDark ? <i className="ph-fill ph-sun text-base" /> : <i className="ph-fill ph-moon text-base" />}
            </button>

            {/* GRUP KONTROL: FULL MONITOR + GRID (Disatukan / Mepet Bareng) */}
            <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
              
              <button 
                onClick={() => setIsFullscreenMode(true)}
                className="bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-blue-600 dark:hover:bg-blue-50 px-2.5 py-1.5 sm:px-4 sm:py-2 rounded-md sm:rounded-lg text-[9px] sm:text-xs font-bold transition-colors flex items-center gap-1 shadow-sm sm:shadow-md"
              >
                <i className="ph-bold ph-corners-out text-[10px] sm:text-sm" />
                <span className="hidden sm:inline">Full Monitor</span>
              </button>

              {/* Grid Kontrol Mobile */}
              <div className="flex sm:hidden bg-slate-200/80 dark:bg-slate-800/80 p-0.5 rounded-md shadow-inner">
                <button onClick={() => setMobileCols(1)} className={`px-2 py-1.5 rounded text-[9px] font-bold transition-all ${mobileCols === 1 ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-sm' : 'text-slate-500'}`}>
                  1 Grid
                </button>
                <button onClick={() => setMobileCols(2)} className={`px-2 py-1.5 rounded text-[9px] font-bold transition-all ${mobileCols === 2 ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-sm' : 'text-slate-500'}`}>
                  2 Grid
                </button>
              </div>
              
              {/* Grid Kontrol Desktop */}
              <div className="hidden sm:flex bg-slate-200/80 dark:bg-slate-800/80 p-1 rounded-lg shadow-inner">
                <button onClick={() => setDesktopCols(2)} className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all ${desktopCols === 2 ? 'bg-white dark:bg-slate-700 text-blue-600 shadow-sm' : 'text-slate-500'}`}>
                  Grid 2
                </button>
                <button onClick={() => setDesktopCols(4)} className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all ${desktopCols === 4 ? 'bg-white dark:bg-slate-700 text-blue-600 shadow-sm' : 'text-slate-500'}`}>
                  Grid 4
                </button>
              </div>

            </div>

            <div className="text-[9px] sm:text-xs font-mono font-bold bg-slate-100 dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 px-2 py-1.5 sm:px-3 sm:py-2 rounded-md sm:rounded-lg min-w-[55px] sm:min-w-[70px] text-center border border-slate-200 dark:border-slate-700 shrink-0">
              {currentTime}
            </div>
          </div>
        </div>
      </header>

      {/* ── Grid Content Dashboard ── */}
      <div className="p-2 sm:p-5 flex-1 w-full max-w-[1400px] mx-auto overflow-x-hidden">
        <div className={gridClasses}>
          {displayedCCTVs.map((cctv) => {
            const isExpanded = expandedId === cctv.id;
            const expandedClass = isExpanded ? 'col-span-full md:col-span-2 md:row-span-2 shadow-xl ring-2 sm:ring-4 ring-blue-500/50 z-20' : 'col-span-1 z-10';

            return (
              <div key={cctv.id} className={`bg-white dark:bg-slate-900 rounded-lg sm:rounded-xl overflow-hidden shadow border border-slate-200 dark:border-slate-800 flex flex-col group transition-all duration-500 ${expandedClass}`}>
                
                <div className="px-2 sm:px-3 py-1.5 sm:py-2 bg-slate-50 dark:bg-slate-800/50 flex justify-between items-center border-b border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-1.5 sm:gap-2 overflow-hidden mr-1">
                    <i className="ph-fill ph-video-camera text-blue-500 text-sm sm:text-base shrink-0" />
                    <div className="flex flex-col">
                      <span className="text-[8px] sm:text-[9px] font-bold text-slate-400 uppercase leading-none">KAM {cctv.id}</span>
                      <span className="text-[10px] sm:text-xs font-bold text-slate-800 dark:text-slate-200 truncate leading-tight mt-0.5">{cctv.loc}</span>
                    </div>
                  </div>
                </div>

                <div className={`relative bg-black w-full overflow-hidden transition-all duration-300 ${isExpanded ? 'h-full min-h-[200px] sm:min-h-[300px]' : 'aspect-video'}`}>
                  {/* Efisiensi RAM: Membatasi iframe yang diproses memori */}
                  <iframe 
                    src={`https://www.youtube.com/embed/${cctv.youtubeId}?autoplay=1&mute=1&rel=0&modestbranding=1`} 
                    className="absolute inset-0 w-full h-full border-0" 
                    allow="autoplay; encrypted-media" 
                    allowFullScreen 
                    loading="lazy" 
                  />
                  
                  {!isExpanded ? (
                    <>
                      <div className="absolute inset-0 z-10 cursor-pointer" onClick={() => handleVideoClick(cctv.id)} />
                      <div className="absolute inset-0 z-20 bg-slate-900/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity pointer-events-none">
                        <div className="bg-white text-slate-900 px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-full text-[9px] sm:text-[10px] font-bold flex items-center gap-1 shadow-lg">
                          <i className="ph-bold ph-corners-out" />
                          <span>{mobileCols === 1 ? 'Buka CCTV' : 'Perbesar'}</span>
                        </div>
                      </div>
                    </>
                  ) : (
                    <button onClick={() => setExpandedId(null)} className="absolute top-1.5 right-1.5 sm:top-3 sm:right-3 z-30 bg-red-600/90 text-white p-1.5 sm:p-2 rounded-full hover:scale-110 transition-transform">
                      <i className="ph-bold ph-corners-in text-sm sm:text-base" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-6 sm:mt-10 mb-6 flex justify-center">
          {!showAll ? (
            <button onClick={() => setShowAll(true)} className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-5 sm:px-6 py-2.5 sm:py-3 rounded-full text-[10px] sm:text-xs font-bold shadow-lg hover:scale-105 transition-transform flex items-center gap-2">
              <i className="ph-bold ph-video-camera text-sm" /> Tampilkan Semua (12 Titik)
            </button>
          ) : (
            <button onClick={handleShowLess} className="bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-white px-5 sm:px-6 py-2.5 sm:py-3 rounded-full text-[10px] sm:text-xs font-bold hover:scale-105 transition-transform flex items-center gap-2 border border-slate-300 dark:border-slate-600">
              <i className="ph-bold ph-caret-up text-sm" /> Tutup / Tampilkan 4 Saja
            </button>
          )}
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════ */}
      {/* ── MODE FULLSCREEN MONITOR (STATIS & SANGAT OPTIMAL) ── */}
      {/* ══════════════════════════════════════════════════════════════ */}
      {isFullscreenMode && (
        <div className="fixed inset-0 z-[100] bg-black w-screen h-[100dvh] overflow-hidden flex animate-[fadeIn_0.2s_ease-out]">
          
          <button 
            onClick={() => setIsFullscreenMode(false)}
            className="absolute top-3 right-3 sm:top-5 sm:right-5 z-[120] bg-black/60 hover:bg-red-600 text-white p-2 sm:p-3 rounded-full shadow-2xl transition-colors border border-white/20"
          >
            <i className="ph-bold ph-x text-base sm:text-xl" />
          </button>

          {focusedFullscreenId ? (
            
            /* Tampilan Fokus (Hanya 1 Iframe di DOM - Sangat Ringan) */
            <div className="relative w-full h-full flex items-center justify-center bg-black">
              <button 
                onClick={() => setFocusedFullscreenId(null)}
                className="absolute top-3 left-3 sm:top-5 sm:left-5 z-[120] bg-black/60 hover:bg-slate-800 text-white px-3 py-1.5 sm:px-4 sm:py-2 rounded-full border border-white/20 flex items-center gap-1.5 font-bold text-[10px] sm:text-xs transition-colors"
              >
                <i className="ph-bold ph-arrow-left text-sm sm:text-base" />
                Kembali
              </button>
              
              <iframe
                src={`https://www.youtube.com/embed/${cctvData.find(c => c.id === focusedFullscreenId)?.youtubeId}?autoplay=1&mute=0&rel=0&modestbranding=1`}
                className="w-full h-full border-0"
                allow="autoplay; encrypted-media"
                allowFullScreen
              />
            </div>

          ) : (
            
            /* Tampilan Grid (Hanya 4 Iframe di DOM) */
            <div className="relative w-full h-full flex flex-col">
              
              {/* Navigasi Desktop Kiri/Kanan */}
              <button onClick={prevFullscreenPage} className="hidden sm:flex absolute left-4 top-1/2 -translate-y-1/2 z-[110] bg-black/60 hover:bg-blue-600 text-white p-3 rounded-full border border-white/20 transition-colors backdrop-blur-md">
                <i className="ph-bold ph-caret-left text-xl" />
              </button>
              <button onClick={nextFullscreenPage} className="hidden sm:flex absolute right-4 top-1/2 -translate-y-1/2 z-[110] bg-black/60 hover:bg-blue-600 text-white p-3 rounded-full border border-white/20 transition-colors backdrop-blur-md">
                <i className="ph-bold ph-caret-right text-xl" />
              </button>

              {/* Navigasi Mobile Atas/Bawah */}
              <button onClick={prevFullscreenPage} className="flex sm:hidden absolute top-2 left-1/2 -translate-x-1/2 z-[110] bg-black/80 text-white px-8 py-1.5 rounded-full border border-white/20 backdrop-blur-md">
                <i className="ph-bold ph-caret-up text-lg" />
              </button>
              <button onClick={nextFullscreenPage} className="flex sm:hidden absolute bottom-2 left-1/2 -translate-x-1/2 z-[110] bg-black/80 text-white px-8 py-1.5 rounded-full border border-white/20 backdrop-blur-md">
                <i className="ph-bold ph-caret-down text-lg" />
              </button>

              {/* Grid Layout Tanpa Batas / Gap-0 */}
              <div className="w-full h-full grid grid-cols-1 grid-rows-4 sm:grid-cols-2 sm:grid-rows-2 gap-0">
                {cctvData.slice(fullscreenPage * itemsPerPage, (fullscreenPage + 1) * itemsPerPage).map((cctv) => (
                  <div 
                    key={cctv.id} 
                    className="relative w-full h-full bg-slate-900 overflow-hidden cursor-pointer"
                    onClick={() => setFocusedFullscreenId(cctv.id)}
                  >
                    {/* Overlay Label Kamera Mobile-Friendly (Font Sangat Kecil) */}
                    <div className="absolute top-2 left-2 sm:top-4 sm:left-4 z-[105] pointer-events-none flex flex-col gap-0.5">
                      <div className="bg-black/70 backdrop-blur-sm text-white px-1.5 py-0.5 sm:px-2 sm:py-1 rounded text-[8px] sm:text-[10px] font-mono font-bold border border-white/10 w-fit">
                        CAM-{cctv.id} : {cctv.loc}
                      </div>
                      <div className="flex items-center gap-1 bg-red-600/80 px-1.5 py-0.5 sm:px-2 sm:py-1 rounded w-fit">
                        <span className="w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full bg-white animate-pulse" />
                        <span className="text-[7px] sm:text-[8px] font-mono text-white font-bold tracking-widest">LIVE</span>
                      </div>
                    </div>

                    {/* Iframe Tanpa Efek Hover Zoom (Statis) */}
                    <iframe
                      src={`https://www.youtube.com/embed/${cctv.youtubeId}?autoplay=1&mute=1&rel=0&modestbranding=1`}
                      className="absolute inset-0 w-full h-full border-0 pointer-events-none object-cover"
                      allow="autoplay; encrypted-media"
                    />

                    {/* Div Pengeblok Interaksi agar klik selalu jatuh ke pembungkus utama */}
                    <div className="absolute inset-0 z-[100] bg-transparent hover:bg-white/5 transition-colors duration-200" />
                  </div>
                ))}
              </div>
              
              <div className="absolute bottom-3 left-4 sm:bottom-5 sm:left-5 z-[110] bg-black/70 text-white/90 px-2 py-1 rounded text-[9px] sm:text-[10px] font-mono border border-white/10 backdrop-blur-md hidden sm:block">
                Halaman {fullscreenPage + 1} / {totalPages}
              </div>

            </div>
          )}
        </div>
      )}

    </main>
  );
}
