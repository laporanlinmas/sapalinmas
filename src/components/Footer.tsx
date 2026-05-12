import Image from 'next/image';

/* ── SVG ikon sosmed inline — tidak bergantung icon library ── */
const SocialIcons = {
  facebook: (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
    </svg>
  ),
  twitter: (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
    </svg>
  ),
  instagram: (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
    </svg>
  ),
  whatsapp: (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
    </svg>
  ),
  tiktok: (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
      <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.95v7.4c-.01 1.96-.81 3.84-2.19 5.23-1.39 1.39-3.27 2.18-5.23 2.19-1.96-.01-3.84-.8-5.23-2.19C2.57 19.31 1.78 17.43 1.77 15.47c.01-1.96.8-3.84 2.19-5.23 1.39-1.39 3.27-2.18 5.23-2.19 1.25-.01 2.49.33 3.56.97.23.14.45.3.65.48V5.07c-1.35.34-2.76.43-4.14.24-1.38-.19-2.71-.74-3.84-1.57V-.03h7.1z"/>
    </svg>
  ),
  globe: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
      <circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/>
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
    </svg>
  ),
  mapPin: (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 shrink-0 mt-0.5">
      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
    </svg>
  ),
  phone: (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 shrink-0">
      <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>
    </svg>
  ),
  caretRight: (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-3 h-3 text-blue-500 shrink-0">
      <path d="M10 6L16 12L10 18" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
    </svg>
  ),
};

const SOCIAL_LINKS = [
  {
    label: 'Facebook',
    href: 'https://www.facebook.com/people/Satpol-PP-Kabupaten-Ponorogo/100067181276904/#',
    icon: <i className="ph-fill ph-facebook-logo text-lg" />,
    hoverBg: 'hover:bg-blue-600',
    hoverText: 'hover:text-white',
  },
  {
    label: 'X / Twitter',
    href: 'https://x.com/SatpolppPonoro1',
    icon: <i className="ph-fill ph-x-logo text-lg" />,
    hoverBg: 'hover:bg-slate-800 dark:hover:bg-black',
    hoverText: 'hover:text-white',
  },
  {
    label: 'Instagram',
    href: 'https://instagram.com/satlinmas_ponorogo',
    icon: <i className="ph-fill ph-instagram-logo text-lg" />,
    hoverBg: 'hover:bg-gradient-to-br hover:from-purple-600 hover:to-pink-500',
    hoverText: 'hover:text-white',
  },
  {
    label: 'WhatsApp',
    href: 'https://wa.me/6282337017307',
    icon: <i className="ph-fill ph-whatsapp-logo text-lg" />,
    hoverBg: 'hover:bg-green-500',
    hoverText: 'hover:text-white',
  },
  {
    label: 'TikTok',
    href: 'https://www.tiktok.com/@satpol.pp.ponorogo',
    icon: <i className="ph-fill ph-tiktok-logo text-lg" />,
    hoverBg: 'hover:bg-black',
    hoverText: 'hover:text-white',
  },
];

const QUICK_LINKS = [
  { href: '#cctv',      label: 'Pantauan CCTV' },
  { href: '#peta',      label: 'Peta Kerawanan' },
  { href: '#pengaduan', label: 'Buat Laporan' },
  { href: '#informasi', label: 'Detail Program' },
];

export default function Footer() {
  return (
    <footer className="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 mt-20 relative overflow-hidden">
      {/* Accent bottom */}
      <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-blue-600 via-purple-500 to-yellow-400" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-14">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10">

          {/* ── Brand ── */}
          <div className="md:col-span-5">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-11 h-11 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center overflow-hidden shrink-0">
                <Image src="/assets/icon-full.png" alt="SIPEDAS" width={36} height={36} className="object-contain" />
              </div>
              <div>
                <p className="text-base font-extrabold text-slate-900 dark:text-white leading-tight">SIPEDAS</p>
                <p className="text-xs font-semibold text-blue-600 dark:text-blue-400">Sapa Pedestrian · Kab. Ponorogo</p>
              </div>
            </div>

            <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed mb-6 max-w-sm">
              Mewujudkan kawasan pejalan kaki yang aman, nyaman, dan tertib. Satlinmas Pedestrian siap melayani 24 jam.
            </p>

            {/* Sosmed */}
            <div className="flex gap-2.5">
              {SOCIAL_LINKS.map(s => (
                <a
                  key={s.label}
                  href={s.href}
                  aria-label={s.label}
                  className={`w-9 h-9 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 dark:text-slate-400 ${s.hoverBg} ${s.hoverText} transition-all duration-200 hover:-translate-y-0.5 border border-slate-200 dark:border-slate-700 hover:border-transparent`}
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {/* ── Tautan Cepat ── */}
          <div className="md:col-span-3">
            <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-4 uppercase tracking-wider">
              Tautan Cepat
            </h4>
            <ul className="space-y-3">
              {QUICK_LINKS.map(l => (
                <li key={l.href}>
                  <a
                    href={l.href}
                    className="text-sm text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors flex items-center gap-2"
                  >
                    {SocialIcons.caretRight}
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* ── Kontak ── */}
          <div className="md:col-span-4">
            <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-4 uppercase tracking-wider">
              Kontak
            </h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-2.5 text-sm text-slate-500 dark:text-slate-400">
                <span className="text-blue-500 mt-0.5">{SocialIcons.mapPin}</span>
                Jl. Alun-Alun Utara No. 1, Mangkujayan, Ponorogo, Jawa Timur 63413
              </li>
              <li className="flex items-center gap-2.5 text-sm text-slate-500 dark:text-slate-400">
                <span className="text-blue-500">{SocialIcons.phone}</span>
                (0352) 481-XXX
              </li>

              {/* Website resmi */}
              <li className="pt-3 border-t border-slate-200 dark:border-slate-800">
                <a
                  href="https://satpolpp.ponorogo.go.id"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-3 rounded-xl bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800/40 hover:border-blue-400 dark:hover:border-blue-600 transition-colors group"
                >
                  <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shrink-0 overflow-hidden shadow-sm border border-slate-200 dark:border-slate-700 p-1">
                    <Image src="/assets/satpolpp.png" alt="Satpol PP" width={28} height={28} className="object-contain" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-blue-800 dark:text-blue-300 group-hover:underline">
                      Satpol PP Ponorogo
                    </p>
                    <p className="text-[11px] text-blue-600/70 dark:text-blue-400/70">
                      satpolpp.ponorogo.go.id
                    </p>
                  </div>
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-6 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row justify-between items-center gap-3 text-xs text-slate-400">
          <span>
            &copy; 2026 Pemerintah Kabupaten Ponorogo ·{' '}
            <span className="font-semibold text-slate-600 dark:text-slate-300">Satlinmas Pedestrian</span>
          </span>
          <div className="flex items-center gap-1.5 font-semibold">
            <span>v3.0</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            <span className="text-emerald-500">Online</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
