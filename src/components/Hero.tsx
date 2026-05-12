import Image from 'next/image';

export default function Hero() {
  return (
    <header className="pt-28 pb-6 md:pt-36 md:pb-10 relative overflow-hidden">

      {/* Decorative orbs */}
      <div className="absolute top-10 left-[10%] w-32 h-32 md:w-48 md:h-48 rounded-full bg-blue-500/10 dark:bg-blue-400/10 blur-3xl pointer-events-none animate-blob" />
      <div className="absolute top-20 right-[8%] w-40 h-40 md:w-56 md:h-56 rounded-full bg-purple-500/10 dark:bg-purple-400/10 blur-3xl pointer-events-none animate-blob animation-delay-2000" />
      <div className="absolute bottom-4 left-[30%] w-32 h-32 md:w-48 md:h-48 rounded-full bg-amber-400/10 blur-3xl pointer-events-none animate-blob animation-delay-4000" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center relative z-10">

        {/* Logo */}
        <div className="flex justify-center mb-5">
          <div className="relative group">
            <div className="absolute -inset-2 rounded-3xl bg-gradient-to-br from-blue-500/20 to-orange-500/20 blur-lg pointer-events-none animate-pulse" />
            <div className="relative w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-white dark:bg-slate-800 shadow-lg border border-slate-200 dark:border-slate-700 flex items-center justify-center overflow-hidden group-hover:scale-105 transition-transform duration-300">
              <Image src="/assets/icon-full.png" alt="SIPEDAS" width={64} height={64} className="object-contain" priority />
            </div>
          </div>
        </div>

        {/* Badge */}
        <div className="flex justify-center mb-4">
          <span className="inline-flex items-center gap-2 bg-blue-600/10 dark:bg-blue-400/10 border border-blue-300/40 dark:border-blue-500/30 text-blue-700 dark:text-blue-300 text-xs font-bold px-4 py-1.5 rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
            Sistem Informasi Pedestrian Satlinmas · Kab. Ponorogo
          </span>
        </div>

        {/* Title */}
        <h1 className="mb-5">
          <span className="block text-[11px] md:text-xs font-black tracking-[0.35em] text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-orange-500 to-yellow-500 uppercase mb-2">
            SI-PEDAS
          </span>
          <span className="block text-4xl sm:text-5xl md:text-6xl lg:text-[5.5rem] font-extrabold text-transparent bg-clip-text bg-gradient-to-br from-blue-600 to-blue-400 dark:from-blue-400 dark:to-blue-300 tracking-tight leading-none pb-1">
            Sapa Pedestrian
          </span>
          <span className="block text-lg sm:text-xl md:text-2xl font-bold text-slate-600 dark:text-slate-400 mt-2 tracking-wide">
            Ponorogo
          </span>
        </h1>

        {/* Description */}
        <p className="text-sm md:text-base text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed mb-8 px-2">
          Platform terpadu untuk <strong className="text-blue-600 dark:text-blue-400">pemantauan CCTV real-time</strong>,{' '}
          pemetaan <strong className="text-orange-500 dark:text-orange-400">zona kerawanan</strong>, dan layanan{' '}
          <strong className="text-emerald-600 dark:text-emerald-400">pengaduan masyarakat</strong> kawasan pedestrian Ponorogo.
        </p>

        {/* CTA buttons */}
        <div className="flex flex-wrap justify-center gap-3 mb-10">
          <a
            href="#pengaduan"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-bold text-white shadow-lg hover:shadow-xl transition-all hover:scale-105"
            style={{ background: 'linear-gradient(135deg, #075E54, #128C7E)' }}
          >
            <i className="ph-fill ph-chat-circle-dots text-base" aria-hidden />
            Buat Laporan
          </a>
          <a
            href="#cctv"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-bold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow hover:shadow-md transition-all hover:scale-105"
          >
            <i className="ph-fill ph-video-camera text-blue-500 text-base" aria-hidden />
            Pantau CCTV
          </a>
        </div>

        {/* Quick-stat pills */}
        <div className="grid grid-cols-2 md:flex md:flex-wrap md:justify-center gap-2 md:gap-3 max-w-3xl mx-auto">
          {[
            { icon: 'ph-video-camera',   title: 'CCTV Real-time',    desc: 'Pemantauan Aktif',   color: 'text-blue-600 dark:text-blue-400',   bg: 'bg-blue-50 dark:bg-blue-900/30',   border: 'border-blue-200 dark:border-blue-800/40' },
            { icon: 'ph-map-trifold',    title: 'Peta Kerawanan',    desc: 'Monitoring Spasial', color: 'text-indigo-600 dark:text-indigo-400', bg: 'bg-indigo-50 dark:bg-indigo-900/30', border: 'border-indigo-200 dark:border-indigo-800/40' },
            { icon: 'ph-shield-warning', title: 'Zona Rawan',        desc: 'Deteksi Dini',       color: 'text-rose-600 dark:text-rose-400',   bg: 'bg-rose-50 dark:bg-rose-900/30',   border: 'border-rose-200 dark:border-rose-800/40' },
            { icon: 'ph-lightning',      title: 'Respons Cepat',     desc: 'Pengaduan Warga',    color: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-50 dark:bg-amber-900/30', border: 'border-amber-200 dark:border-amber-800/40' },
          ].map(({ icon, title, desc, color, bg, border }) => (
            <div
              key={title}
              className={`flex items-center gap-2 px-3 py-2 md:px-4 md:py-2.5 rounded-xl md:rounded-full border ${bg} ${border} hover:scale-105 transition-transform duration-200 cursor-default select-none shadow-sm`}
            >
              <i className={`ph-fill ${icon} text-base md:text-lg shrink-0 ${color}`} />
              <div className="text-left">
                <span className={`block text-[10px] md:text-xs font-bold ${color} leading-tight`}>{title}</span>
                <span className="block text-[8px] md:text-[10px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{desc}</span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </header>
  );
}
