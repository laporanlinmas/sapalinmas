interface ProgramModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ProgramModal({ isOpen, onClose }: ProgramModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true">
      <div className="absolute inset-0 bg-slate-900/75 backdrop-blur-sm" onClick={onClose} />

      <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-700 animate-slide-up overflow-hidden max-h-[90vh] flex flex-col">

        {/* Hero foto dari lokal */}
        <div className="relative h-44 shrink-0 overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/assets/pedestrian.png"
            alt="Kawasan Pedestrian Ponorogo"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/30 to-transparent" />
          {/* Overlay gradient warna */}
          <div className="absolute inset-0 bg-gradient-to-r from-pink-600/40 to-purple-600/30 mix-blend-multiply" />
          <button
            onClick={onClose}
            className="absolute top-3 right-3 w-9 h-9 rounded-full bg-black/30 hover:bg-black/50 text-white backdrop-blur-sm flex items-center justify-center transition-colors"
          >
            <i className="ph-bold ph-x text-base" />
          </button>
          {/* Floating icon */}
          <div className="absolute bottom-0 left-6 translate-y-1/2 w-16 h-16 bg-white dark:bg-slate-900 rounded-2xl shadow-xl border-4 border-white dark:border-slate-900 flex items-center justify-center">
            <i className="ph-fill ph-map-trifold text-3xl text-pink-500" />
          </div>
        </div>

        {/* Body */}
        <div className="overflow-y-auto custom-scrollbar px-6 pt-12 pb-6 flex-1">
          <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white mb-1">
            Program Face-off Pedestrian
          </h3>
          <p className="text-xs font-semibold text-pink-500 uppercase tracking-wider mb-4">
            Kabupaten Ponorogo
          </p>

          <div className="space-y-4 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            <p>
              Program Face-off bertujuan mengembalikan fungsi trotoar sebagai ruang publik yang humanis, estetik, dan inklusif. Pemerintah Kabupaten Ponorogo telah menyulap beberapa ruas jalan utama menjadi jalur pejalan kaki yang lebar dan tertata.
            </p>

            <div className="bg-pink-50 dark:bg-pink-900/10 border border-pink-200 dark:border-pink-800/30 rounded-2xl p-4">
              <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200 mb-3 flex items-center gap-2">
                <i className="ph-fill ph-map-pin text-pink-500" />
                Fokus Titik Pembangunan
              </h4>
              <ul className="space-y-3">
                <li className="flex gap-3">
                  <i className="ph-fill ph-check-circle text-pink-500 text-lg shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-slate-800 dark:text-slate-200">HOS Cokroaminoto</strong>
                    <p className="text-slate-500 dark:text-slate-400 mt-0.5">Kawasan ikonik layaknya Malioboro, dilengkapi bangku taman, lampu klasik, dan pepohonan rindang.</p>
                  </div>
                </li>
                <li className="flex gap-3">
                  <i className="ph-fill ph-check-circle text-pink-500 text-lg shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-slate-800 dark:text-slate-200">Jendral Sudirman & Gajah Mada</strong>
                    <p className="text-slate-500 dark:text-slate-400 mt-0.5">Perluasan bahu pejalan kaki, penataan drainase tertutup, dan jalur khusus tunanetra (guiding block).</p>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-100 dark:border-slate-800 shrink-0">
          <button
            onClick={onClose}
            className="w-full py-2.5 rounded-2xl bg-slate-900 dark:bg-slate-700 hover:bg-slate-800 dark:hover:bg-slate-600 text-white text-sm font-bold transition-colors"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
}
