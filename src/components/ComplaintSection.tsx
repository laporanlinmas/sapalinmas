interface ComplaintSectionProps {
  onOpenChatbot: () => void;
}

export default function ComplaintSection({ onOpenChatbot }: ComplaintSectionProps) {
  return (
    <section id="pengaduan" className="scroll-mt-32 pt-16 border-t border-slate-200 dark:border-slate-800/50 reveal">
      <div className="max-w-4xl mx-auto">

        {/* ── Header ── */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800/40 text-blue-700 dark:text-blue-300 text-xs font-bold px-4 py-1.5 rounded-full mb-4">
            <i className="ph-fill ph-robot text-sm" aria-hidden />
            ASISTEN CERDAS SIPEDAS
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white mb-4">
            Pusat Layanan Interaktif
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
            Satu chatbot untuk semua kebutuhan — tanya jawab, laporan aduan dengan foto, dan cek status tiket secara real-time.
          </p>
        </div>

        {/* ── Main card ── */}
        <div className="glass-panel rounded-3xl overflow-hidden border border-transparent hover:border-blue-400/40 dark:hover:border-blue-600/40 transition-all duration-300 hover:shadow-2xl group bg-white/90 dark:bg-slate-800/90">

          {/* WA-style header preview */}
          <div className="flex items-center gap-3 px-5 py-4" style={{ background: 'linear-gradient(135deg, #075E54 0%, #128C7E 100%)' }}>
            <div className="w-10 h-10 rounded-full bg-white/20 border border-white/30 flex items-center justify-center shrink-0">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
                <path d="M12 2C6.477 2 2 6.477 2 12c0 1.89.525 3.66 1.438 5.168L2.546 20.9a.5.5 0 0 0 .617.617l3.732-.892A9.96 9.96 0 0 0 12 22c5.523 0 10-4.477 10-10S17.523 2 12 2z"/>
              </svg>
            </div>
            <div>
              <p className="text-sm font-bold text-white">Asisten SIPEDAS</p>
              <p className="text-[11px] text-emerald-200 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Online · Satlinmas Pedestrian Ponorogo
              </p>
            </div>
          </div>

          {/* Feature grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-slate-100 dark:divide-slate-700/50">
            {[
              {
                icon: 'ph-chat-circle-text',
                color: 'text-blue-600 dark:text-blue-400',
                bg: 'bg-blue-50 dark:bg-blue-900/20',
                title: 'Tanya Jawab Bebas',
                desc: 'Tanyakan apa saja seputar program pedestrian, jadwal, aturan, dan Satlinmas.',
              },
              {
                icon: 'ph-megaphone',
                color: 'text-orange-600 dark:text-orange-400',
                bg: 'bg-orange-50 dark:bg-orange-900/20',
                title: 'Laporan Aduan + Foto',
                desc: 'Kirim laporan resmi dengan foto bukti dari kamera atau galeri. Dapat nomor tiket otomatis.',
              },
              {
                icon: 'ph-ticket',
                color: 'text-emerald-600 dark:text-emerald-400',
                bg: 'bg-emerald-50 dark:bg-emerald-900/20',
                title: 'Cek Status Tiket',
                desc: 'Ketik nomor tiket (ADU-YYMMDD-XXXX) untuk melihat status dan catatan petugas.',
              },
            ].map(f => (
              <div key={f.title} className="flex flex-col items-center text-center p-6 gap-3">
                <div className={`w-12 h-12 rounded-2xl ${f.bg} flex items-center justify-center`}>
                  <i className={`ph-fill ${f.icon} text-2xl ${f.color}`} aria-hidden />
                </div>
                <div>
                  <p className="font-bold text-slate-800 dark:text-slate-200 text-sm mb-1">{f.title}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="px-6 pb-6 pt-2">
            <button
              type="button"
              onClick={onOpenChatbot}
              className="w-full flex items-center justify-center gap-3 py-4 rounded-2xl text-white font-bold text-base transition-all hover:opacity-95 hover:scale-[1.01] shadow-lg hover:shadow-xl"
              style={{ background: 'linear-gradient(135deg, #075E54 0%, #128C7E 60%, #25D366 100%)' }}
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.477 2 2 6.477 2 12c0 1.89.525 3.66 1.438 5.168L2.546 20.9a.5.5 0 0 0 .617.617l3.732-.892A9.96 9.96 0 0 0 12 22c5.523 0 10-4.477 10-10S17.523 2 12 2zm-1 13H8a1 1 0 1 1 0-2h3a1 1 0 1 1 0 2zm5-4H8a1 1 0 1 1 0-2h8a1 1 0 1 1 0 2z"/>
              </svg>
              Buka Asisten SIPEDAS
              <i className="ph-bold ph-arrow-right group-hover:translate-x-1 transition-transform" aria-hidden />
            </button>
          </div>
        </div>

        {/* ── Info strip ── */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-5 text-xs text-slate-500 dark:text-slate-400">
          <span className="flex items-center gap-1.5">
            <i className="ph-fill ph-shield-check text-green-500 text-sm" aria-hidden />
            Data tersimpan aman ke sistem
          </span>
          <span className="flex items-center gap-1.5">
            <i className="ph-fill ph-clock text-blue-500 text-sm" aria-hidden />
            Respons dalam 1×24 jam
          </span>
          <span className="flex items-center gap-1.5">
            <i className="ph-fill ph-image text-purple-500 text-sm" aria-hidden />
            Foto tersimpan di Google Drive
          </span>
          <span className="flex items-center gap-1.5">
            <i className="ph-fill ph-whatsapp-logo text-[#25D366] text-sm" aria-hidden />
            Diteruskan ke petugas piket
          </span>
        </div>

      </div>
    </section>
  );
}
