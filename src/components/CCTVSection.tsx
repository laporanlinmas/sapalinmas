'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation'; // Tambahkan ini untuk navigasi manual

interface CCTVData {
  loc: string;
  status: 'online' | 'offline';
  id: string;
  youtubeId: string;
}

const previewCCTVData: CCTVData[] = [
  { loc: "Simpang Tugu Jogja", id: "01", youtubeId: "1v52cQ1qJBA", status: "online" },
  { loc: "Titik Nol Kilometer", id: "08", youtubeId: "p5fsOsGos6Y", status: "online" },
];

const totalCCTV = 12;
const onlineCount = totalCCTV;
const offlineCount = 0;

function getCurrentTime() {
  return new Date().toLocaleTimeString('id-ID', { hour12: false });
}

export default function CCTVSection() {
  const router = useRouter();
  const [currentTime, setCurrentTime] = useState('');
  const [selectedCCTV, setSelectedCCTV] = useState<CCTVData | null>(null);
  
  // STATE UNTUK ANIMASI KELUAR (EXIT ANIMATION)
  const [isNavigating, setIsNavigating] = useState(false);

  useEffect(() => {
    setCurrentTime(getCurrentTime());
    const interval = setInterval(() => setCurrentTime(getCurrentTime()), 1000);
    return () => clearInterval(interval);
  }, []);

  // FUNGSI NAVIGASI DENGAN ANIMASI
  const handleNavigation = (e: React.MouseEvent) => {
    e.preventDefault(); // Mencegah pindah halaman langsung
    setIsNavigating(true); // Memicu animasi CSS (fade out & scale down)
    
    // Tunggu 500ms agar animasi selesai, lalu pindah halaman
    setTimeout(() => {
      router.push('/cctv');
    }, 500); 
  };

  return (
    <section id="cctv" className="py-20 relative overflow-hidden scroll-mt-20">
      {/* Background Decor */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-screen-xl h-full pointer-events-none -z-10 opacity-40 dark:opacity-20">
        <div className="absolute top-20 right-10 w-72 h-72 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob" />
        <div className="absolute top-40 left-10 w-72 h-72 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000" />
      </div>

      {/* WRAPPER ANIMASI KELUAR: Jika isNavigating true, maka memudar dan mengecil */}
      <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 transition-all duration-500 ease-in-out transform ${
        isNavigating ? 'opacity-0 scale-95 translate-y-4' : 'opacity-100 scale-100 translate-y-0'
      }`}>
        
        {/* ── Section Header ── */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-10 sm:mb-12 gap-5 sm:gap-6">
          <div className="relative max-w-2xl">
            <div className="absolute -left-4 sm:-left-6 top-0 w-1.5 h-full bg-gradient-to-b from-blue-500 to-indigo-600 rounded-full" />
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 dark:text-white flex items-center gap-3 tracking-tight">
              Pantauan Live CCTV
            </h2>
            <p className="text-slate-600 dark:text-slate-400 mt-2 sm:mt-3 text-sm sm:text-lg font-medium">
              Akses visual real-time langsung dari kawasan pedestrian utama. Hindari kemacetan dan pantau kondisi terkini sebelum Anda berkunjung.
            </p>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
            <div className="flex flex-col items-end mr-2 hidden sm:flex">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Waktu Server</span>
              <span className="text-sm font-mono font-bold text-slate-700 dark:text-slate-300">
                {currentTime || '00:00:00'} WIB
              </span>
            </div>
            
            <div className="glass-panel inline-flex items-center gap-2 sm:gap-2.5 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full border border-emerald-200 dark:border-emerald-500/30 bg-emerald-50/50 dark:bg-slate-800/60 shadow-sm backdrop-blur-md">
              <div className="relative flex h-2 w-2 sm:h-2.5 sm:w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 sm:h-2.5 sm:w-2.5 bg-emerald-500" />
              </div>
              <span className="text-xs sm:text-sm font-bold text-emerald-700 dark:text-emerald-400">
                {onlineCount} Aktif
              </span>
            </div>
          </div>
        </div>

        {/* ── Grid Preview CCTV ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6 lg:gap-8 relative">
          {previewCCTVData.map((cctv) => (
            <div key={cctv.id} className="bg-white dark:bg-slate-900 rounded-2xl sm:rounded-3xl overflow-hidden shadow-lg hover:shadow-xl border border-slate-200 dark:border-slate-800 flex flex-col group relative transform transition-all duration-300 hover:-translate-y-1">
              
              <div className="flex items-center justify-between px-3 sm:px-5 py-3 sm:py-4 bg-slate-50 dark:bg-slate-800/80 border-b border-slate-100 dark:border-slate-800/50">
                <div className="flex items-center gap-2 sm:gap-3 overflow-hidden mr-2">
                  <div className="p-1.5 sm:p-2 bg-blue-100 dark:bg-blue-900/50 rounded-lg shrink-0">
                    <i className="ph-fill ph-video-camera text-blue-600 dark:text-blue-400 text-base sm:text-lg" />
                  </div>
                  <div className="flex flex-col overflow-hidden">
                    <span className="text-[9px] sm:text-[10px] font-bold text-slate-500 dark:text-slate-400 tracking-widest uppercase truncate">Kamera Utama</span>
                    <span className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-slate-100 truncate">{cctv.loc}</span>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 bg-red-100 dark:bg-red-900/40 px-2 sm:px-2.5 py-1 sm:py-1.5 rounded-md border border-red-200 dark:border-red-500/30 shrink-0">
                  <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-red-500 animate-pulse shadow-[0_0_5px_#ef4444]" />
                  <span className="text-[9px] sm:text-[10px] font-mono text-red-700 dark:text-red-300 font-bold tracking-widest">LIVE</span>
                </div>
              </div>

              <div 
                className="relative aspect-video bg-slate-900 w-full cursor-pointer overflow-hidden"
                onClick={() => setSelectedCCTV(cctv)}
                title="Klik untuk memperbesar"
              >
                <iframe
                  src={`https://www.youtube.com/embed/${cctv.youtubeId}?autoplay=1&mute=1&rel=0&modestbranding=1`}
                  className="absolute inset-0 w-full h-full border-0 group-hover:scale-105 transition-transform duration-700"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  title={`CCTV ${cctv.loc}`}
                  loading="lazy"
                  tabIndex={-1}
                />
                <div className="absolute inset-0 z-10 bg-transparent" />
                <div className="absolute inset-0 z-20 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-sm">
                  <div className="bg-white/95 dark:bg-slate-800/95 text-slate-900 dark:text-white px-4 sm:px-5 py-2 sm:py-2.5 rounded-full text-xs sm:text-sm font-bold flex items-center gap-2 shadow-xl transform translate-y-4 group-hover:translate-y-0 transition-all duration-300">
                    <i className="ph-bold ph-corners-out text-base sm:text-lg text-blue-600 dark:text-blue-400" />
                    Perbesar Video
                  </div>
                </div>
              </div>
            </div>
          ))}
          <div className="absolute -bottom-1 left-0 w-full h-24 bg-gradient-to-t from-slate-50 dark:from-[#020617] to-transparent pointer-events-none z-10" />
        </div>

        {/* ── Call to Action (Buka Dashboard) ── */}
        <div className="mt-8 sm:mt-12 flex flex-col items-center justify-center relative z-20">
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium mb-4 text-center px-4">
            Ada {totalCCTV - previewCCTVData.length} titik kamera lain yang tersebar di sepanjang kawasan.
          </p>
          
          <button 
            onClick={handleNavigation}
            disabled={isNavigating}
            className={`inline-flex items-center gap-2 sm:gap-3 px-6 sm:px-8 py-3 sm:py-4 rounded-full font-bold shadow-xl transition-all duration-300 group text-sm sm:text-base ${
              isNavigating 
                ? 'bg-blue-600 text-white cursor-wait scale-95 opacity-80' 
                : 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-slate-900/20 dark:shadow-white/10 hover:scale-105 hover:bg-blue-600 dark:hover:bg-blue-50 hover:shadow-blue-500/30'
            }`}
          >
            {isNavigating ? (
              // Animasi Loading saat diklik
              <>
                <i className="ph-bold ph-spinner animate-spin text-xl sm:text-2xl" />
                <span>Membuka Dashboard...</span>
              </>
            ) : (
              // Tampilan Tombol Normal
              <>
                <i className="ph-fill ph-monitor-play text-xl sm:text-2xl text-blue-400 dark:text-blue-600 group-hover:text-white dark:group-hover:text-blue-700 transition-colors" />
                <span>Buka Dashboard CCTV</span>
                <i className="ph-bold ph-arrow-right text-base sm:text-lg ml-1 group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>
        </div>
      </div>

      {/* ── Modal Popup Video ── */}
      {selectedCCTV && (
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-6 bg-slate-900/95 backdrop-blur-md animate-fade-in"
          onClick={() => setSelectedCCTV(null)}
        >
          <div 
            className="relative w-full max-w-5xl bg-black rounded-xl sm:rounded-2xl overflow-hidden shadow-2xl border border-slate-700 flex flex-col transform transition-all scale-100 animate-[fadeIn_0.2s_ease-out]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-3 sm:px-4 py-3 sm:py-4 bg-slate-900 border-b border-slate-800">
              <div className="flex items-center gap-2 sm:gap-3 overflow-hidden">
                <div className="flex items-center gap-1.5 sm:gap-2 bg-red-900/40 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded border border-red-500/50 shadow-sm shrink-0">
                  <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-red-500 animate-pulse" />
                  <span className="text-[8px] sm:text-[10px] font-mono text-red-200 font-bold tracking-widest">LIVE</span>
                </div>
                <h3 className="text-white font-bold text-xs sm:text-base flex items-center gap-2 truncate">
                  <span className="text-slate-400 font-normal hidden sm:inline">Kamera {selectedCCTV.id} :</span>
                  <span className="truncate">{selectedCCTV.loc}</span>
                </h3>
              </div>
              <button 
                onClick={() => setSelectedCCTV(null)} 
                className="text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 p-1.5 sm:p-2 rounded-lg transition-colors ml-2 sm:ml-4 shrink-0"
              >
                <i className="ph-bold ph-x text-base sm:text-lg" />
              </button>
            </div>
            <div className="relative aspect-video w-full bg-black">
              <iframe
                src={`https://www.youtube.com/embed/${selectedCCTV.youtubeId}?autoplay=1&mute=0&rel=0&modestbranding=1`}
                className="absolute inset-0 w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                title={`CCTV ${selectedCCTV.loc}`}
              />
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
