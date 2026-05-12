interface JadwalModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const JADWAL = [
  {
    icon: 'ph-bicycle',
    color: 'bg-blue-500',
    border: 'border-blue-100 dark:border-blue-900/30',
    bg: 'bg-blue-50/50 dark:bg-blue-900/10',
    title: 'Car Free Day (CFD)',
    desc: 'Setiap Hari Minggu (05.00–09.00 WIB) di ruas Jalan Suromenggolo dan Alun-Alun Ponorogo. Kendaraan bermotor dilarang melintas.',
  },
  {
    icon: 'ph-storefront',
    color: 'bg-amber-500',
    border: 'border-amber-100 dark:border-amber-900/30',
    bg: 'bg-amber-50/50 dark:bg-amber-900/10',
    title: 'Jam Operasional PKL',
    desc: 'Sesuai Perda, PKL di kawasan HOS Cokroaminoto hanya boleh beroperasi pukul 16.00–23.00 WIB dengan tetap menjaga kebersihan.',
  },
  {
    icon: 'ph-parking',
    color: 'bg-emerald-500',
    border: 'border-emerald-100 dark:border-emerald-900/30',
    bg: 'bg-emerald-50/50 dark:bg-emerald-900/10',
    title: 'Zona Parkir Terpadu',
    desc: 'Parkir di atas trotoar dilarang keras. Gunakan kantong parkir resmi di sirip-sirip jalan (persimpangan kecil).',
  },
];

export default function JadwalModal({ isOpen, onClose }: JadwalModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true">
      <div className="absolute inset-0 bg-slate-900/75 backdrop-blur-sm" onClick={onClose} />

      <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-700 animate-slide-up overflow-hidden max-h-[90vh] flex flex-col">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 dark:border-slate-800 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
              <i className="ph-fill ph-calendar-check text-blue-600 dark:text-blue-400 text-xl" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-slate-900 dark:text-white">Jadwal & Aturan Kawasan</h3>
              <p className="text-xs text-slate-400">Pedestrian Kabupaten Ponorogo</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 hover:text-slate-800 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
          >
            <i className="ph-bold ph-x text-sm" />
          </button>
        </div>

        {/* Body */}
        <div className="overflow-y-auto custom-scrollbar px-6 py-5 space-y-3 flex-1">
          {JADWAL.map(j => (
            <div key={j.title} className={`flex items-start gap-4 p-4 rounded-2xl border-2 ${j.border} ${j.bg}`}>
              <div className={`w-11 h-11 ${j.color} text-white rounded-xl flex items-center justify-center shrink-0 shadow-sm`}>
                <i className={`ph-fill ${j.icon} text-xl`} />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200 mb-1">{j.title}</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{j.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-100 dark:border-slate-800 shrink-0">
          <button
            onClick={onClose}
            className="w-full py-2.5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold transition-colors shadow-lg shadow-blue-500/20"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
}
