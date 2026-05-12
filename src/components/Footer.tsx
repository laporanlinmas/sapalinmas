import React, { useState, useRef, useEffect } from 'react';

const Icons = {
  // Footer Social Icons
  facebook: (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-[18px] h-[18px]">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
    </svg>
  ),
  twitter: (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-[18px] h-[18px]">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
    </svg>
  ),
  instagram: (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-[18px] h-[18px]">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
    </svg>
  ),
  whatsapp: (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-[18px] h-[18px]">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
    </svg>
  ),
  mapPin: (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-[18px] h-[18px] shrink-0">
      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
    </svg>
  ),
  phone: (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-[18px] h-[18px] shrink-0">
      <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>
    </svg>
  ),
  caretRight: (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5 shrink-0">
      <path d="M10 6L16 12L10 18" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
    </svg>
  ),
  // Chatbot Icons
  chat: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
    </svg>
  ),
  close: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
      <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
    </svg>
  ),
  send: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
      <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
    </svg>
  ),
  bot: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
      <rect x="3" y="11" width="18" height="10" rx="2"/><circle cx="12" cy="5" r="2"/><path d="M12 7v4"/><line x1="8" y1="16" x2="8" y2="16"/><line x1="16" y1="16" x2="16" y2="16"/>
    </svg>
  ),
  user: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
    </svg>
  )
};

const SOCIAL_LINKS = [
  {
    label: 'Facebook',
    href: 'https://www.facebook.com/people/Satpol-PP-Kabupaten-Ponorogo/100067181276904/#',
    icon: Icons.facebook,
    glowClass: 'hover:text-[#1877F2] hover:border-[#1877F2] hover:shadow-[0_0_15px_rgba(24,119,242,0.4)] dark:hover:shadow-[0_0_15px_rgba(24,119,242,0.6)] hover:bg-blue-50/50 dark:hover:bg-[#1877F2]/10',
  },
  {
    label: 'X / Twitter',
    href: 'https://x.com/SatpolppPonoro1',
    icon: Icons.twitter,
    glowClass: 'hover:text-slate-900 dark:hover:text-white hover:border-slate-900 dark:hover:border-white hover:shadow-[0_0_15px_rgba(0,0,0,0.2)] dark:hover:shadow-[0_0_15px_rgba(255,255,255,0.4)] hover:bg-slate-100 dark:hover:bg-white/10',
  },
  {
    label: 'Instagram',
    href: 'https://instagram.com/satlinmas_ponorogo',
    icon: Icons.instagram,
    glowClass: 'hover:text-[#E4405F] hover:border-[#E4405F] hover:shadow-[0_0_15px_rgba(228,64,95,0.4)] dark:hover:shadow-[0_0_15px_rgba(228,64,95,0.6)] hover:bg-pink-50/50 dark:hover:bg-[#E4405F]/10',
  },
  {
    label: 'WhatsApp',
    href: 'https://wa.me/6282337017307',
    icon: Icons.whatsapp,
    glowClass: 'hover:text-[#25D366] hover:border-[#25D366] hover:shadow-[0_0_15px_rgba(37,211,102,0.4)] dark:hover:shadow-[0_0_15px_rgba(37,211,102,0.6)] hover:bg-green-50/50 dark:hover:bg-[#25D366]/10',
  },
  {
    label: 'TikTok',
    href: 'https://www.tiktok.com/@satpol.pp.ponorogo',
    /* Menggunakan img asli sesuai permintaan, memberikan filter meredup saat tidak di-hover, dan menyala dengan warna asli saat di-hover */
    icon: (
      <img 
        src="https://upload.wikimedia.org/wikipedia/commons/3/34/Tiktok_Logo_Icon.svg" 
        alt="TikTok" 
        className="w-[18px] h-[18px] object-contain transition-all duration-300 filter grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-100 dark:brightness-200 dark:group-hover:brightness-100"
      />
    ),
    glowClass: 'hover:border-[#69C9D0] hover:shadow-[0_0_15px_rgba(105,201,208,0.5)] dark:hover:shadow-[0_0_15px_rgba(105,201,208,0.6)] hover:bg-slate-100 dark:hover:bg-[#69C9D0]/10',
  },
];

const QUICK_LINKS = [
  { href: '#cctv',      label: 'Pantauan CCTV Real-time' },
  { href: '#peta',      label: 'Peta Kerawanan Kawasan' },
  { href: '#pengaduan', label: 'Buat Laporan / Pengaduan' },
  { href: '#informasi', label: 'Informasi Detail Program' },
];

const Footer = () => {
  return (
    <footer className="bg-slate-50 dark:bg-[#0B1120] border-t border-slate-200 dark:border-slate-800/80 mt-20 relative overflow-hidden">
      {/* Accent Top Line - Tipis dan elegan ala enterprise */}
      <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-blue-600 via-indigo-500 to-emerald-500" />

      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 lg:gap-8">

          {/* ── Kolom 1: Brand & Sosial Media ── */}
          <div className="md:col-span-5 flex flex-col">
            <div className="flex items-center gap-3.5 mb-6">
              <div className="w-12 h-12 rounded-xl bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 shadow-sm flex items-center justify-center shrink-0 p-1.5">
                {/* Fallback avatar jika tidak ada asset lokal */}
                <div className="w-full h-full bg-blue-100 dark:bg-blue-900/40 rounded-lg flex items-center justify-center text-blue-600 dark:text-blue-400 font-bold text-xl">
                  S
                </div>
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight leading-tight">
                  SIPEDAS
                </h3>
                <p className="text-xs font-semibold text-blue-600 dark:text-blue-400 tracking-wide uppercase mt-0.5">
                  Sapa Pedestrian · Kab. Ponorogo
                </p>
              </div>
            </div>

            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-8 max-w-sm">
              Sistem informasi digital terpadu untuk pengawasan dan perlindungan kawasan ruang publik. Kami hadir melayani 24 jam demi kenyamanan Anda.
            </p>

            {/* Glowing Social Media Icons */}
            <div className="flex flex-wrap gap-3">
              {SOCIAL_LINKS.map(s => (
                <a
                  key={s.label}
                  href={s.href}
                  aria-label={s.label}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`group w-10 h-10 rounded-full bg-white dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 text-slate-400 dark:text-slate-500 flex items-center justify-center transition-all duration-300 ease-out hover:-translate-y-1 ${s.glowClass}`}
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {/* ── Kolom 2: Tautan Cepat ── */}
          <div className="md:col-span-3">
            <h4 className="text-xs font-bold text-slate-900 dark:text-white mb-6 uppercase tracking-widest">
              Tautan Cepat
            </h4>
            <ul className="space-y-3.5">
              {QUICK_LINKS.map(l => (
                <li key={l.href}>
                  <a
                    href={l.href}
                    className="group flex items-center gap-2.5 text-sm text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                  >
                    <span className="text-slate-300 dark:text-slate-600 group-hover:text-blue-500 transition-colors">
                      {Icons.caretRight}
                    </span>
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* ── Kolom 3: Kontak & Link Instansi ── */}
          <div className="md:col-span-4">
            <h4 className="text-xs font-bold text-slate-900 dark:text-white mb-6 uppercase tracking-widest">
              Hubungi Kami
            </h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                <span className="text-blue-500 mt-1">{Icons.mapPin}</span>
                <span>Jl. Alun-Alun Utara No. 1, Mangkujayan<br/>Ponorogo, Jawa Timur 63413</span>
              </li>
              <li className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-400">
                <span className="text-blue-500">{Icons.phone}</span>
                (0352) 481-XXX
              </li>

              {/* Eksternal Link Card (Satpol PP) - Interaktif & Premium */}
              <li className="pt-4 mt-2">
                <a
                  href="https://satpolpp.ponorogo.go.id"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="relative flex items-center gap-4 p-4 rounded-2xl bg-white dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/60 hover:border-blue-400 dark:hover:border-blue-500/50 hover:shadow-[0_8px_30px_rgb(59,130,246,0.12)] transition-all duration-300 overflow-hidden group cursor-pointer block"
                >
                  {/* Efek Latar Glow Halus saat Hover */}
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-50/0 via-blue-50/50 to-transparent dark:from-blue-900/0 dark:via-blue-900/10 dark:to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                  {/* Wadah Ikon Instansi */}
                  <div className="relative w-12 h-12 bg-slate-50 dark:bg-slate-900/50 rounded-xl flex items-center justify-center shrink-0 border border-slate-100 dark:border-slate-700 group-hover:scale-105 group-hover:shadow-md transition-all duration-300 p-2">
                    <div className="w-full h-full bg-blue-100 dark:bg-blue-900/40 rounded flex items-center justify-center text-blue-600 font-bold">
                       P
                    </div>
                  </div>
                  
                  {/* Teks Kartu */}
                  <div className="relative flex flex-col">
                    <span className="text-[15px] font-bold text-slate-800 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      Satpol PP Ponorogo
                    </span>
                    <span className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-1.5 group-hover:text-blue-500 dark:group-hover:text-blue-400 transition-colors">
                      Kunjungi website resmi
                      {/* Animasi Panah Bergerak */}
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform">
                        <line x1="5" y1="12" x2="19" y2="12"></line>
                        <polyline points="12 5 19 12 12 19"></polyline>
                      </svg>
                    </span>
                  </div>
                </a>
              </li>
            </ul>
          </div>
          
        </div>

        {/* ── Bottom Bar: Rapi & Bersih ── */}
        <div className="mt-16 pt-8 border-t border-slate-200 dark:border-slate-800/80 flex flex-col sm:flex-row justify-center items-center gap-4 text-xs">
          <p className="text-slate-500 dark:text-slate-400 text-center">
            &copy; {new Date().getFullYear()} Pemerintah Kabupaten Ponorogo · <span className="font-medium text-slate-700 dark:text-slate-300">Satlinmas Pedestrian</span>
          </p>
        </div>
      </div>
    </footer>
  );
};

const SYSTEM_INSTRUCTION = `Anda adalah Asisten Virtual cerdas dari "SIPEDAS" (Sapa Pedestrian Ponorogo) yang dikelola oleh Satgas Linmas Pedestrian, Satpol PP Kabupaten Ponorogo.
Tugas Anda adalah memberikan informasi dengan ramah, humanis, informatif, dan profesional. 

Gunakan pengetahuan berikut untuk menjawab pertanyaan pengguna:
1. SIPEDAS adalah ekosistem smart public safety untuk memantau CCTV, absensi petugas, dan pelaporan masyarakat.
2. Aturan PKL: Boleh berjualan pukul 16.00-23.00 di Jl. HOS Cokroaminoto. Dilarang di atas guiding block (jalur tunanetra).
3. Aturan Parkir: Dilarang keras memarkir motor/mobil di atas trotoar. Trotoar murni untuk pejalan kaki.
4. Jam Operasional Satgas: 24 jam dibagi 3 shift (Pagi 07-14, Siang 14-21, Malam 21-07). Patroli intensif dilakukan Jumat & Sabtu malam.
5. Kawasan prioritas: Jl. HOS Cokroaminoto, Jendral Sudirman, Urip Sumoharjo, Alun-Alun Ponorogo.
6. Fitur SIPEDAS: Laporan digital via website (gratis, tanpa pungli), live CCTV untuk umum, pelaporan barang hilang/temuan.
7. Pelayanan: Satgas tidak membawa senjata, bertindak persuasif, siap membantu menyeberangkan jalan untuk lansia/difabel.

Panduan menjawab:
- Sapa dengan ramah.
- Berikan informasi yang ringkas dan padat.
- Jangan gunakan formatting markdown berlebihan, gunakan paragraf yang rapi.
- Jika ada hal di luar wewenang Satpol PP (seperti kriminalitas murni), arahkan untuk menghubungi Kepolisian via Bantuan Merah SIPEDAS.`;

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { id: 1, text: "Halo! Saya Asisten Virtual SIPEDAS. Ada yang bisa saya bantu terkait layanan, aturan, atau pengaduan di kawasan pedestrian Ponorogo?", sender: 'bot' }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // Auto-scroll ke pesan terbaru
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e) => {
    e?.preventDefault();
    if (!inputValue.trim()) return;

    const userText = inputValue.trim();
    const newUserMessage = { id: Date.now(), text: userText, sender: 'user' };
    
    setMessages(prev => [...prev, newUserMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      // API Key dikosongkan agar digenerate otomatis oleh environment Canvas
      const apiKey = ""; 
      const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent?key=${apiKey}`;

      // Memformat history percakapan untuk Gemini
      const formattedHistory = messages.map(msg => ({
        role: msg.sender === 'user' ? 'user' : 'model',
        parts: [{ text: msg.text }]
      }));
      
      // Menambahkan pesan user yang baru
      formattedHistory.push({
        role: 'user',
        parts: [{ text: userText }]
      });

      const payload = {
        contents: formattedHistory,
        systemInstruction: {
          parts: [{ text: SYSTEM_INSTRUCTION }]
        }
      };

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await response.json();
      
      if (data.candidates && data.candidates[0] && data.candidates[0].content) {
        const botText = data.candidates[0].content.parts[0].text;
        setMessages(prev => [...prev, { id: Date.now(), text: botText, sender: 'bot' }]);
      } else {
        throw new Error("Invalid response from Gemini");
      }
    } catch (error) {
      console.error("Chatbot Error:", error);
      setMessages(prev => [...prev, { 
        id: Date.now(), 
        text: "Maaf, server kami sedang sibuk. Silakan coba beberapa saat lagi.", 
        sender: 'bot' 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Floating Action Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`flex items-center justify-center w-14 h-14 rounded-full shadow-2xl transition-transform duration-300 ${isOpen ? 'rotate-90 scale-0 opacity-0' : 'rotate-0 scale-100 opacity-100 bg-blue-600 hover:bg-blue-700 text-white'}`}
          aria-label="Open Chatbot"
        >
          {Icons.chat}
        </button>
      </div>

      {/* Chat Window */}
      <div 
        className={`fixed bottom-6 right-6 z-50 w-[350px] max-w-[calc(100vw-3rem)] h-[500px] max-h-[calc(100vh-3rem)] bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col overflow-hidden transition-all duration-300 origin-bottom-right ${isOpen ? 'scale-100 opacity-100' : 'scale-0 opacity-0 pointer-events-none'}`}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-4 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3 text-white">
            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
              {Icons.bot}
            </div>
            <div>
              <h4 className="font-semibold text-sm">Asisten SIPEDAS</h4>
              <p className="text-[10px] text-blue-100 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Online
              </p>
            </div>
          </div>
          <button 
            onClick={() => setIsOpen(false)}
            className="text-white/80 hover:text-white transition-colors"
          >
            {Icons.close}
          </button>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 bg-slate-50 dark:bg-slate-900 flex flex-col gap-3">
          {messages.map((msg) => (
            <div 
              key={msg.id} 
              className={`max-w-[85%] flex flex-col ${msg.sender === 'user' ? 'self-end items-end' : 'self-start items-start'}`}
            >
              <div 
                className={`p-3 rounded-2xl text-sm leading-relaxed ${
                  msg.sender === 'user' 
                    ? 'bg-blue-600 text-white rounded-tr-none' 
                    : 'bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded-tl-none shadow-sm'
                }`}
                style={{ wordBreak: 'break-word' }}
              >
                {msg.text}
              </div>
            </div>
          ))}
          
          {isLoading && (
            <div className="self-start max-w-[85%]">
              <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-tl-none shadow-sm flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <form onSubmit={handleSendMessage} className="p-3 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex items-center gap-2 shrink-0">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Tanyakan sesuatu..."
            className="flex-1 bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-sm rounded-full px-4 py-2.5 outline-none focus:ring-2 focus:ring-blue-500/50 transition-all border border-transparent focus:border-blue-500"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={!inputValue.trim() || isLoading}
            className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center shrink-0 hover:bg-blue-700 disabled:opacity-50 disabled:hover:bg-blue-600 transition-colors"
          >
            {Icons.send}
          </button>
        </form>
      </div>
    </>
  );
};

export default function App() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#050B14] font-sans flex flex-col text-slate-900 dark:text-slate-100 selection:bg-blue-200 dark:selection:bg-blue-900">
      
      {/* Hero Section (Mockup Konten Halaman) */}
      <main className="flex-1 max-w-7xl mx-auto px-6 py-20 w-full flex flex-col items-center justify-center text-center">
        <div className="w-20 h-20 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-2xl flex items-center justify-center mb-8 shadow-inner border border-blue-200 dark:border-blue-800/50">
          {Icons.mapPin}
        </div>
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-6">
          Selamat Datang di <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-emerald-500">SIPEDAS</span>
        </h1>
        <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 max-w-2xl mb-10 leading-relaxed">
          Sistem Informasi Sapa Pedestrian Ponorogo. Membantu menjaga ketertiban, keamanan, dan kenyamanan kawasan ruang publik untuk seluruh lapisan masyarakat.
        </p>
        
        <div className="flex gap-4">
          <button className="px-6 py-3 rounded-full bg-blue-600 text-white font-medium hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-600/20 transition-all">
            Lapor Gangguan
          </button>
          <button className="px-6 py-3 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-medium hover:border-slate-300 dark:hover:border-slate-600 transition-all">
            Lihat CCTV
          </button>
        </div>
        
        <div className="mt-20 p-6 bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900/30 rounded-2xl max-w-3xl w-full text-left">
           <h3 className="font-semibold text-lg flex items-center gap-2 mb-2">
             <span className="text-blue-600">{Icons.bot}</span> Coba Fitur AI Baru Kami!
           </h3>
           <p className="text-slate-600 dark:text-slate-400 text-sm">
             Klik ikon obrolan di pojok kanan bawah untuk berinteraksi dengan Asisten Virtual SIPEDAS. Bot ini ditenagai oleh <b>Gemini AI</b> dan memahami seluruh aturan kawasan pedestrian Ponorogo.
           </p>
        </div>
      </main>

      {/* Komponen Chatbot Melayang di Pojok Kanan Bawah */}
      <Chatbot />

      {/* Footer Elegan yang Telah Disempurnakan */}
      <Footer />
    </div>
  );
}
