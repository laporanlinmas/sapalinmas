'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  getSatgasLinmasText,
  prefetchSatgasLinmasText,
  searchKnowledgeTop,
} from '@/lib/satgaslinmas-knowledge';

// ─── Types ───────────────────────────────────────────────────────────────────

type MsgRole = 'user' | 'bot';

interface ChatPhoto {
  file: File;
  preview: string;
}

interface ChatMsg {
  role: MsgRole;
  text: string;
  photos?: ChatPhoto[];
  waUrl?: string;
  waLabel?: string;
  ticketCard?: TicketInfo;
}

interface TicketInfo {
  ticket: string;
  nama: string;
  kategori: string;
  lokasi: string;
  deskripsi: string;
  status: string;
  catatan: string;
  updatedAt: string;
  timestamp: string;
}

type ComplaintStep = 'nama' | 'kategori' | 'lokasi' | 'deskripsi' | 'foto';

interface ComplaintDraft {
  step: ComplaintStep;
  nama?: string;
  kategori?: string;
  lokasi?: string;
  deskripsi?: string;
  photos: ChatPhoto[];
}

// ─── Constants ───────────────────────────────────────────────────────────────

const KATEGORI_LIST = [
  { value: 'Fasilitas Publik Rusak',      emoji: '🔧' },
  { value: 'Gangguan Pengamen',           emoji: '🎸' },
  { value: 'Gangguan Pengemis',           emoji: '🙏' },
  { value: 'Pelanggaran Ketertiban',      emoji: '⚠️' },
  { value: 'Indikasi Tindak Kejahatan',   emoji: '🚨' },
] as const;

const LOKASI_LIST = [
  'Jl. Soekarno-Hatta',
  'Jl. HOS Cokroaminoto',
  'Jl. Jenderal Sudirman',
  'Jl. Urip Sumoharjo',
  'Jl. Diponegoro',
  'Alun-alun Ponorogo',
  'Lokasi Lainnya',
] as const;

const STATUS_CONFIG: Record<string, { color: string; bg: string; icon: string; label: string }> = {
  'Baru':      { color: 'text-blue-700',   bg: 'bg-blue-50 border-blue-200',   icon: '🆕', label: 'Baru Diterima' },
  'Diproses':  { color: 'text-amber-700',  bg: 'bg-amber-50 border-amber-200', icon: '⚙️', label: 'Sedang Diproses' },
  'Selesai':   { color: 'text-green-700',  bg: 'bg-green-50 border-green-200', icon: '✅', label: 'Selesai' },
  'Ditolak':   { color: 'text-red-700',    bg: 'bg-red-50 border-red-200',     icon: '❌', label: 'Ditolak' },
};

const WELCOME = `Halo! 👋 Saya asisten SIPEDAS.\n\nSaya bisa membantu Anda:\n• Tanya jawab seputar program pedestrian Ponorogo\n• Buat laporan aduan (ketik **lapor**)\n• Cek status laporan (ketik nomor tiket, contoh: ADU-260512-1234)\n• Hubungi petugas piket (ketik **hubungi petugas**)\n\nSilakan ketik pertanyaan Anda!`;

const MAX_PHOTOS = 3;
const MAX_FILE_MB = 5;
// ─── Helpers ─────────────────────────────────────────────────────────────────

function wantsHuman(s: string): boolean {
  return /(hubungi\s*petugas|chat\s*manusia|bicara\s*(dengan\s*)?(orang|manusia|petugas)|wa\s*piket|nomor\s*piket|whatsapp\s*petugas|operator|call\s*center)/i.test(s);
}

function wantsComplaint(s: string): boolean {
  if (wantsHuman(s)) return false;
  return /(^\s*lapor\s*$|buat\s*(aduan|laporan)|mau\s*lapor|ingin\s*melapor|kirim\s*aduan|pengaduan\s*baru)/i.test(s);
}

function extractTicket(s: string): string | null {
  const m = s.match(/\b(ADU-\d{6}-\d{4})\b/i);
  return m ? m[1].toUpperCase() : null;
}

function pickFromList(input: string, list: readonly string[]): string | null {
  const t = input.trim().toLowerCase();
  for (const item of list) {
    if (t.includes(item.toLowerCase()) || item.toLowerCase().includes(t)) return item;
  }
  return null;
}

function pickKategori(input: string): string | null {
  const t = input.trim().toLowerCase();
  for (const k of KATEGORI_LIST) {
    if (t.includes(k.value.toLowerCase()) || k.value.toLowerCase().includes(t)) return k.value;
  }
  // Fuzzy: match by first word
  const first = t.split(/\s+/)[0];
  for (const k of KATEGORI_LIST) {
    if (k.value.toLowerCase().startsWith(first)) return k.value;
  }
  return null;
}

async function fetchWa(): Promise<{ number: string; name: string } | null> {
  try {
    const d = await fetch('/api/wa-number').then(r => r.json());
    const n = (d?.number ?? '').toString();
    return n ? { number: n, name: (d?.name ?? 'Petugas piket').toString() } : null;
  } catch { return null; }
}

async function fetchTicketStatus(ticket: string): Promise<TicketInfo | null> {
  try {
    const r = await fetch(`/api/complaint-status?ticket=${encodeURIComponent(ticket)}`);
    if (!r.ok) return null;
    const d = await r.json();
    if (!d.found) return null;
    return d as TicketInfo;
  } catch { return null; }
}

function revokePhotos(photos: ChatPhoto[]) {
  photos.forEach(p => URL.revokeObjectURL(p.preview));
}


// ─── Sub-components ───────────────────────────────────────────────────────────

function BoldText({ text }: { text: string }) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return (
    <>
      {parts.map((p, i) => {
        const m = p.match(/^\*\*([^*]+)\*\*$/);
        return m ? <strong key={i} className="font-semibold">{m[1]}</strong> : <span key={i}>{p}</span>;
      })}
    </>
  );
}

function TicketCard({ info }: { info: TicketInfo }) {
  const cfg = STATUS_CONFIG[info.status] ?? { color: 'text-slate-700', bg: 'bg-slate-50 border-slate-200', icon: '📋', label: info.status };
  return (
    <div className={`mt-2 rounded-xl border p-3 text-xs ${cfg.bg}`}>
      <div className="flex items-center justify-between mb-2">
        <span className="font-mono font-bold text-slate-800 text-[11px]">{info.ticket}</span>
        <span className={`flex items-center gap-1 font-bold ${cfg.color}`}>
          <span>{cfg.icon}</span> {cfg.label}
        </span>
      </div>
      <div className="space-y-1 text-slate-600">
        <p><span className="font-semibold">Pelapor:</span> {info.nama}</p>
        <p><span className="font-semibold">Kategori:</span> {info.kategori}</p>
        <p><span className="font-semibold">Lokasi:</span> {info.lokasi}</p>
        <p><span className="font-semibold">Deskripsi:</span> {info.deskripsi}</p>
        {info.catatan && <p><span className="font-semibold">Catatan petugas:</span> {info.catatan}</p>}
        {info.updatedAt && <p className="text-slate-400 text-[10px]">Diperbarui: {info.updatedAt}</p>}
      </div>
    </div>
  );
}

function PhotoGrid({ photos }: { photos: ChatPhoto[] }) {
  if (!photos.length) return null;
  return (
    <div className={`mt-2 grid gap-1 ${photos.length === 1 ? 'grid-cols-1' : 'grid-cols-2'}`}>
      {photos.map((p, i) => (
        <img
          key={i}
          src={p.preview}
          alt={`foto ${i + 1}`}
          className="w-full rounded-lg object-cover max-h-40"
        />
      ))}
    </div>
  );
}

function KategoriButtons({ onPick }: { onPick: (v: string) => void }) {
  return (
    <div className="mt-2 flex flex-wrap gap-1.5">
      {KATEGORI_LIST.map(k => (
        <button
          key={k.value}
          type="button"
          onClick={() => onPick(k.value)}
          className="flex items-center gap-1 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:border-blue-400 hover:bg-blue-50 hover:text-blue-700 transition-colors shadow-sm"
        >
          <span>{k.emoji}</span> {k.value}
        </button>
      ))}
    </div>
  );
}

function LokasiButtons({ onPick }: { onPick: (v: string) => void }) {
  return (
    <div className="mt-2 flex flex-wrap gap-1.5">
      {LOKASI_LIST.map(l => (
        <button
          key={l}
          type="button"
          onClick={() => onPick(l)}
          className="flex items-center gap-1 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:border-indigo-400 hover:bg-indigo-50 hover:text-indigo-700 transition-colors shadow-sm"
        >
          📍 {l}
        </button>
      ))}
    </div>
  );
}


// ─── Message bubble ───────────────────────────────────────────────────────────

function MessageBubble({ msg }: { msg: ChatMsg }) {
  const isUser = msg.role === 'user';
  return (
    <div className={`flex items-end gap-2 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
      {/* Avatar */}
      {!isUser && (
        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center shrink-0 mb-1 shadow-sm">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="white">
            <path d="M12 2C6.477 2 2 6.477 2 12c0 1.89.525 3.66 1.438 5.168L2.546 20.9a.5.5 0 0 0 .617.617l3.732-.892A9.96 9.96 0 0 0 12 22c5.523 0 10-4.477 10-10S17.523 2 12 2z"/>
          </svg>
        </div>
      )}

      <div className={`max-w-[82%] ${isUser ? 'items-end' : 'items-start'} flex flex-col`}>
        {/* Bubble */}
        <div className={`rounded-2xl px-3 py-2 text-sm leading-relaxed shadow-sm ${
          isUser
            ? 'rounded-br-sm bg-[#DCF8C6] text-slate-900'
            : 'rounded-bl-sm bg-white text-slate-900 border border-slate-100'
        }`}>
          {/* Photos (user) */}
          {msg.photos && msg.photos.length > 0 && <PhotoGrid photos={msg.photos} />}

          {/* Text */}
          {msg.text && (
            <div className="whitespace-pre-wrap">
              {isUser ? msg.text : <BoldText text={msg.text} />}
            </div>
          )}

          {/* Ticket card */}
          {msg.ticketCard && <TicketCard info={msg.ticketCard} />}

          {/* WA button */}
          {msg.waUrl && (
            <a
              href={msg.waUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 flex items-center justify-center gap-2 rounded-xl bg-[#25D366] px-3 py-2 text-xs font-bold text-white hover:bg-[#1ebe5d] transition-colors"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              {msg.waLabel ?? 'Buka WhatsApp'}
            </a>
          )}
        </div>

        {/* Timestamp */}
        <span className="mt-0.5 px-1 text-[10px] text-slate-400">
          {new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
        </span>
      </div>
    </div>
  );
}


// ─── Typing indicator ─────────────────────────────────────────────────────────

function TypingIndicator() {
  return (
    <div className="flex items-end gap-2">
      <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center shrink-0 shadow-sm">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="white">
          <path d="M12 2C6.477 2 2 6.477 2 12c0 1.89.525 3.66 1.438 5.168L2.546 20.9a.5.5 0 0 0 .617.617l3.732-.892A9.96 9.96 0 0 0 12 22c5.523 0 10-4.477 10-10S17.523 2 12 2z"/>
        </svg>
      </div>
      <div className="rounded-2xl rounded-bl-sm bg-white border border-slate-100 px-4 py-3 shadow-sm">
        <div className="flex gap-1 items-center h-4">
          {[0, 1, 2].map(i => (
            <span
              key={i}
              className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce"
              style={{ animationDelay: `${i * 150}ms`, animationDuration: '0.9s' }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}


// ─── Main component ───────────────────────────────────────────────────────────

export default function ChatbotUnified({
  opened,
  onToggle,
}: {
  opened?: boolean;
  onToggle?: (v: boolean) => void;
}) {
  const [messages, setMessages]   = useState<ChatMsg[]>([]);
  const [input, setInput]         = useState('');
  const [busy, setBusy]           = useState(false);
  const [pendingPhotos, setPendingPhotos] = useState<ChatPhoto[]>([]);
  const [showKategori, setShowKategori]   = useState(false);
  const [showLokasi, setShowLokasi]       = useState(false);
  const [showFotoStep, setShowFotoStep]   = useState(false);

  const draftRef    = useRef<ComplaintDraft | null>(null);
  const listRef     = useRef<HTMLDivElement>(null);
  const inputRef    = useRef<HTMLTextAreaElement>(null);
  const galleryRef  = useRef<HTMLInputElement>(null);
  const cameraRef   = useRef<HTMLInputElement>(null);
  const prevOpened  = useRef(false);

  const isOpen = opened === true;

  // ── Init / reset on open ──────────────────────────────────────────────────
  useEffect(() => {
    if (isOpen && !prevOpened.current) {
      draftRef.current = null;
      setPendingPhotos([]);
      setShowKategori(false);
      setShowLokasi(false);
      setShowFotoStep(false);
      setMessages([{ role: 'bot', text: WELCOME }]);
      prefetchSatgasLinmasText();
    }
    if (!isOpen) {
      draftRef.current = null;
      setMessages([]);
      setInput('');
      setPendingPhotos(p => { revokePhotos(p); return []; });
      setShowKategori(false);
      setShowLokasi(false);
      setShowFotoStep(false);
    }
    prevOpened.current = isOpen;
  }, [isOpen]);

  // ── Auto-scroll ───────────────────────────────────────────────────────────
  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  }, [messages, busy]);

  // ── Append helpers ────────────────────────────────────────────────────────
  const addMsg = useCallback((msg: ChatMsg) => {
    setMessages(p => [...p, msg]);
  }, []);

  const addBot = useCallback((text: string, extra?: Partial<ChatMsg>) => {
    setMessages(p => [...p, { role: 'bot', text, ...extra }]);
  }, []);

  // ── Photo handling ────────────────────────────────────────────────────────
  const addFiles = useCallback((files: FileList | null) => {
    if (!files) return;
    const arr = Array.from(files).slice(0, MAX_PHOTOS);
    const newPhotos: ChatPhoto[] = arr
      .filter(f => f.size <= MAX_FILE_MB * 1024 * 1024)
      .map(f => ({ file: f, preview: URL.createObjectURL(f) }));
    setPendingPhotos(prev => {
      const combined = [...prev, ...newPhotos].slice(0, MAX_PHOTOS);
      return combined;
    });
  }, []);

  const removePhoto = useCallback((idx: number) => {
    setPendingPhotos(prev => {
      URL.revokeObjectURL(prev[idx].preview);
      return prev.filter((_, i) => i !== idx);
    });
  }, []);

  // ── Complaint flow ────────────────────────────────────────────────────────
  const handleComplaintInput = useCallback(async (text: string, photos: ChatPhoto[]) => {
    const draft = draftRef.current;
    if (!draft) return false;

    if (draft.step === 'nama') {
      const nama = text.trim();
      if (nama.length < 2) {
        addBot('Nama minimal 2 karakter. Silakan ketik ulang nama lengkap Anda.');
        return true;
      }
      draft.nama = nama;
      draft.step = 'kategori';
      setShowKategori(true);
      addBot(`Terima kasih, **${nama}**! 😊\n\nPilih **kategori** laporan Anda:`);
      return true;
    }

    if (draft.step === 'kategori') {
      const k = pickKategori(text);
      if (!k) {
        addBot('Mohon pilih salah satu kategori di bawah ini:');
        setShowKategori(true);
        return true;
      }
      draft.kategori = k;
      draft.step = 'lokasi';
      setShowKategori(false);
      setShowLokasi(true);
      addBot(`Kategori: **${k}** ✓\n\nDi mana **lokasi** kejadian?`);
      return true;
    }

    if (draft.step === 'lokasi') {
      let loc = pickFromList(text, LOKASI_LIST);
      if (!loc && text.trim().length >= 3) loc = text.trim();
      if (!loc) {
        addBot('Mohon sebutkan lokasi kejadian:');
        setShowLokasi(true);
        return true;
      }
      draft.lokasi = loc;
      draft.step = 'deskripsi';
      setShowLokasi(false);
      addBot(`Lokasi: **${loc}** ✓\n\nCeritakan **detail kejadian** (minimal 10 karakter):`);
      return true;
    }

    if (draft.step === 'deskripsi') {
      const desk = text.trim();
      if (desk.length < 10) {
        addBot('Deskripsi terlalu singkat. Mohon jelaskan lebih detail (minimal 10 karakter).');
        return true;
      }
      draft.deskripsi = desk;
      draft.step = 'foto';
      setShowFotoStep(true);
      addBot('Deskripsi tercatat ✓\n\nApakah ada **foto bukti** yang ingin dilampirkan? (opsional, maks 3 foto)\n\nGunakan tombol 📷 di bawah untuk ambil foto atau pilih dari galeri, lalu tekan **Kirim Laporan**.\nAtau ketik **skip** untuk langsung kirim tanpa foto.');
      return true;
    }

    if (draft.step === 'foto') {
      const skip = /^(skip|lewati|tidak|no|tanpa foto)$/i.test(text.trim());
      const sendNow = /^(kirim|kirim laporan|send|submit)$/i.test(text.trim());

      if (!skip && !sendNow && photos.length === 0 && text.trim()) {
        // User typed something else — treat as skip
      }

      // Submit
      const { nama, kategori, lokasi, deskripsi } = draft;
      const allPhotos = [...draft.photos, ...photos];
      draftRef.current = null;
      setShowFotoStep(false);

      addMsg({ role: 'user', text: allPhotos.length > 0 ? `📎 ${allPhotos.length} foto dilampirkan` : 'Kirim tanpa foto', photos: allPhotos });
      setBusy(true);

      try {
        const fd = new FormData();
        fd.append('nama', nama!);
        fd.append('kategori', kategori!);
        fd.append('lokasi', lokasi!);
        fd.append('deskripsi', deskripsi!);
        fd.append('source', 'Chatbot');
        allPhotos.forEach((p, i) => fd.append(`foto_${i}`, p.file));

        const [res, wa] = await Promise.all([
          fetch('/api/submit-complaint', { method: 'POST', body: fd }).then(r => r.json()),
          fetchWa(),
        ]);

        if (!res.ticketNumber) {
          addBot('Laporan gagal tersimpan. Silakan coba lagi atau ketik **hubungi petugas**.');
          return true;
        }

        const ticket = res.ticketNumber as string;
        const waMsg  = encodeURIComponent(
          `*LAPORAN ADUAN SIPEDAS*\nNo. Tiket : ${ticket}\nNama      : ${nama}\nKategori  : ${kategori}\nLokasi    : ${lokasi}\nDeskripsi : ${deskripsi}\n\n_Dikirim via SIPEDAS_`
        );
        const waUrl = wa ? `https://wa.me/${wa.number}?text=${waMsg}` : undefined;

        addBot(
          `✅ **Laporan berhasil dikirim!**\n\nNo. Tiket: **${ticket}**\nSimpan nomor ini untuk mengecek status kapan saja.\n\n${allPhotos.length > 0 ? `📎 ${allPhotos.length} foto tersimpan di sistem.\n\n` : ''}${waUrl ? 'Teruskan ke petugas piket via WhatsApp:' : 'Ketik **hubungi petugas** untuk terhubung langsung.'}`,
          waUrl ? { waUrl, waLabel: wa ? `WhatsApp ${wa.name}` : 'WhatsApp Petugas Piket' } : {}
        );
      } catch {
        addBot('Terjadi gangguan. Ketik **hubungi petugas** atau coba lagi.');
      } finally {
        setBusy(false);
        revokePhotos(allPhotos);
      }
      return true;
    }

    return false;
  }, [addBot, addMsg]);

  // ── Main send ─────────────────────────────────────────────────────────────
  const onSend = useCallback(async (overrideText?: string, overridePhotos?: ChatPhoto[]) => {
    const text   = (overrideText ?? input).trim();
    const photos = overridePhotos ?? pendingPhotos;

    if ((!text && photos.length === 0) || busy || !isOpen) return;

    setInput('');
    setPendingPhotos(p => { if (!overridePhotos) revokePhotos(p); return []; });

    // Show user message (skip if already added by complaint flow)
    if (!overrideText) {
      addMsg({ role: 'user', text, photos: photos.length > 0 ? photos : undefined });
    }

    setBusy(true);

    try {
      // Cancel complaint
      if (draftRef.current && /^(batal|batalkan)$/i.test(text)) {
        draftRef.current = null;
        setShowKategori(false);
        setShowLokasi(false);
        setShowFotoStep(false);
        addBot('Laporan dibatalkan. Ketik **lapor** untuk mulai lagi atau tanyakan apa saja.');
        return;
      }

      // In complaint flow
      if (draftRef.current) {
        const handled = await handleComplaintInput(text, photos);
        if (handled) return;
      }

      // Human handoff
      if (wantsHuman(text)) {
        const wa = await fetchWa();
        if (!wa) {
          addBot('Nomor piket belum tersedia. Coba lagi nanti atau datang ke pos Satlinmas.');
          return;
        }
        addBot(
          `Silakan lanjutkan dengan **${wa.name}** via WhatsApp:`,
          { waUrl: `https://wa.me/${wa.number}?text=${encodeURIComponent('Halo, saya dari SIPEDAS. Mohon bantuannya.')}`, waLabel: `Chat WhatsApp — ${wa.name}` }
        );
        return;
      }

      // Ticket check
      const ticket = extractTicket(text);
      if (ticket) {
        const info = await fetchTicketStatus(ticket);
        if (!info) {
          addBot(`Tiket **${ticket}** tidak ditemukan. Periksa penulisan atau ketik **hubungi petugas**.`);
        } else {
          const cfg = STATUS_CONFIG[info.status] ?? { icon: '📋', label: info.status };
          addBot(
            `Berikut status laporan Anda:`,
            { ticketCard: info }
          );
        }
        return;
      }

      // Start complaint
      if (wantsComplaint(text)) {
        draftRef.current = { step: 'nama', photos: [] };
        addBot('Untuk mencatat laporan resmi, tuliskan **nama lengkap** Anda:');
        return;
      }

      // Knowledge base answer
      const doc    = await getSatgasLinmasText();
      const hits   = searchKnowledgeTop(text, doc, 2);

      if (hits.length > 0) {
        const answer = hits.map(h => h.text).join('\n\n');
        addBot(answer);
      } else {
        addBot(
          'Maaf, saya belum punya jawaban untuk itu. 🤔\n\nCoba tanyakan dengan kata kunci seperti:\n• "program pedestrian"\n• "jadwal CFD"\n• "cara lapor"\n• "satlinmas"\n• "instagram"\n\nAtau ketik **hubungi petugas** untuk terhubung langsung.'
        );
      }
    } finally {
      setBusy(false);
    }
  }, [addBot, addMsg, busy, handleComplaintInput, input, isOpen, pendingPhotos]);

  // ── Quick-pick handlers ───────────────────────────────────────────────────
  const pickKategoriHandler = useCallback((v: string) => {
    setShowKategori(false);
    addMsg({ role: 'user', text: v });
    setBusy(true);
    handleComplaintInput(v, []).finally(() => setBusy(false));
  }, [addMsg, handleComplaintInput]);

  const pickLokasiHandler = useCallback((v: string) => {
    setShowLokasi(false);
    addMsg({ role: 'user', text: v });
    setBusy(true);
    handleComplaintInput(v, []).finally(() => setBusy(false));
  }, [addMsg, handleComplaintInput]);

  const toggle = (v: boolean) => onToggle?.(v);

  // ─────────────────────────────────────────────────────────────────────────
  // RENDER
  // ─────────────────────────────────────────────────────────────────────────
  return (
    <>
      {/* ── Floating button ── */}
      <button
        type="button"
        aria-label="Buka asisten SIPEDAS"
        aria-expanded={isOpen}
        aria-haspopup="dialog"
        onClick={() => toggle(true)}
        className={`fixed bottom-6 right-6 z-[1000] flex h-14 w-14 items-center justify-center rounded-full shadow-xl transition-all duration-300 focus:outline-none focus-visible:ring-4 focus-visible:ring-blue-400/50 ${
          isOpen ? 'pointer-events-none scale-0 opacity-0' : 'scale-100 opacity-100 hover:scale-110'
        }`}
        style={{ background: 'linear-gradient(135deg, #1e3a8a 0%, #2563eb 50%, #4f46e5 100%)' }}
      >
        <svg width="26" height="26" viewBox="0 0 24 24" fill="white" aria-hidden>
          <path d="M12 2C6.477 2 2 6.477 2 12c0 1.89.525 3.66 1.438 5.168L2.546 20.9a.5.5 0 0 0 .617.617l3.732-.892A9.96 9.96 0 0 0 12 22c5.523 0 10-4.477 10-10S17.523 2 12 2zm-1 13H8a1 1 0 1 1 0-2h3a1 1 0 1 1 0 2zm5-4H8a1 1 0 1 1 0-2h8a1 1 0 1 1 0 2z"/>
        </svg>
        {/* Pulse ring */}
        <span className="absolute inset-0 rounded-full animate-ping opacity-20 bg-blue-500" />
      </button>

      {/* ── Chat panel ── */}
      <div
        id="sipedas-chat-panel"
        role="dialog"
        aria-modal="true"
        aria-labelledby="sipedas-chat-title"
        aria-hidden={!isOpen}
        className={`fixed z-[1000] flex flex-col overflow-hidden shadow-2xl transition-all duration-300
          bottom-0 right-0 w-full max-w-[420px] max-h-[100dvh]
          sm:bottom-6 sm:right-6 sm:max-h-[min(620px,92vh)] sm:rounded-2xl
          rounded-t-2xl
          ${isOpen ? 'translate-y-0 scale-100 opacity-100' : 'pointer-events-none translate-y-6 scale-95 opacity-0'}`}
        style={{ transformOrigin: 'bottom right' }}
      >

        {/* ── Header (WA-style dark green) ── */}
        <header
          className="flex shrink-0 items-center gap-3 px-4 py-3 text-white"
          style={{ background: 'linear-gradient(135deg, #075E54 0%, #128C7E 100%)' }}
        >
          <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center shrink-0 border border-white/30">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
              <path d="M12 2C6.477 2 2 6.477 2 12c0 1.89.525 3.66 1.438 5.168L2.546 20.9a.5.5 0 0 0 .617.617l3.732-.892A9.96 9.96 0 0 0 12 22c5.523 0 10-4.477 10-10S17.523 2 12 2z"/>
            </svg>
          </div>
          <div className="flex-1 min-w-0">
            <h2 id="sipedas-chat-title" className="text-sm font-bold leading-tight">Asisten SIPEDAS</h2>
            <p className="text-[11px] text-emerald-200 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Online · Satlinmas Pedestrian Ponorogo
            </p>
          </div>
          <button
            type="button"
            onClick={() => toggle(false)}
            aria-label="Tutup chat"
            className="rounded-full p-1.5 hover:bg-white/15 transition-colors"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
              <path d="M18.3 5.71a1 1 0 0 0-1.41 0L12 10.59 7.11 5.7A1 1 0 0 0 5.7 7.11L10.59 12 5.7 16.89a1 1 0 1 0 1.41 1.41L12 13.41l4.89 4.89a1 1 0 0 0 1.41-1.41L13.41 12l4.89-4.89a1 1 0 0 0-.01-1.4z"/>
            </svg>
          </button>
        </header>

        {/* ── Messages area (WA background) ── */}
        <div
          ref={listRef}
          className="custom-scrollbar flex-1 overflow-y-auto px-3 py-4 space-y-3 min-h-0 wa-bg dark:bg-[#0B141A]"
        >
          {messages.map((m, i) => <MessageBubble key={i} msg={m} />)}

          {/* Quick-pick buttons */}
          {showKategori && !busy && (
            <div className="flex justify-start">
              <div className="max-w-[90%]">
                <KategoriButtons onPick={pickKategoriHandler} />
              </div>
            </div>
          )}
          {showLokasi && !busy && (
            <div className="flex justify-start">
              <div className="max-w-[90%]">
                <LokasiButtons onPick={pickLokasiHandler} />
              </div>
            </div>
          )}

          {busy && <TypingIndicator />}
        </div>

        {/* ── Pending photos preview ── */}
        {pendingPhotos.length > 0 && (
          <div className="shrink-0 border-t border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2">
            <div className="flex gap-2 overflow-x-auto">
              {pendingPhotos.map((p, i) => (
                <div key={i} className="relative shrink-0">
                  <img src={p.preview} alt="" className="w-16 h-16 rounded-lg object-cover border border-slate-200" />
                  <button
                    type="button"
                    onClick={() => removePhoto(i)}
                    className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-red-500 text-white flex items-center justify-center text-xs font-bold shadow"
                  >×</button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── Footer / input area ── */}
        <footer className="shrink-0 border-t border-slate-200 dark:border-slate-700 bg-[#f0f2f5] dark:bg-[#1E2428] px-2 py-2">
          <div className="flex items-end gap-2">

            {/* Photo buttons */}
            <div className="flex gap-1 shrink-0 pb-1">
              {/* Gallery */}
              <button
                type="button"
                title="Pilih dari galeri"
                onClick={() => galleryRef.current?.click()}
                disabled={pendingPhotos.length >= MAX_PHOTOS || !isOpen}
                className="w-9 h-9 rounded-full bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 flex items-center justify-center text-slate-500 hover:text-blue-600 hover:border-blue-400 transition-colors disabled:opacity-40 shadow-sm"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/>
                </svg>
              </button>
              {/* Camera */}
              <button
                type="button"
                title="Ambil foto"
                onClick={() => cameraRef.current?.click()}
                disabled={pendingPhotos.length >= MAX_PHOTOS || !isOpen}
                className="w-9 h-9 rounded-full bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 flex items-center justify-center text-slate-500 hover:text-emerald-600 hover:border-emerald-400 transition-colors disabled:opacity-40 shadow-sm"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 15.2A3.2 3.2 0 1 0 12 8.8a3.2 3.2 0 0 0 0 6.4zm7-12H17l-1.83-2H8.83L7 3.2H5C3.9 3.2 3 4.1 3 5.2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2v-14c0-1.1-.9-2-2-2zm-7 15c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5z"/>
                </svg>
              </button>
            </div>

            {/* Text input */}
            <textarea
              ref={inputRef}
              rows={1}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  void onSend();
                }
              }}
              placeholder={showFotoStep ? 'Ketik "skip" atau "kirim laporan"…' : 'Tulis pesan… (Enter kirim)'}
              disabled={!isOpen || busy}
              className="flex-1 min-h-[40px] max-h-28 resize-none rounded-2xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 px-4 py-2.5 text-sm text-slate-900 dark:text-slate-100 outline-none placeholder:text-slate-400 focus:border-blue-400 focus:ring-1 focus:ring-blue-400 transition-colors shadow-sm"
              style={{ overflowY: 'auto' }}
            />

            {/* Send button */}
            <button
              type="button"
              onClick={() => void onSend()}
              disabled={busy || (!input.trim() && pendingPhotos.length === 0) || !isOpen}
              className="w-10 h-10 shrink-0 rounded-full flex items-center justify-center text-white transition-all disabled:opacity-40 shadow-md hover:scale-105"
              style={{ background: 'linear-gradient(135deg, #075E54, #128C7E)' }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
              </svg>
            </button>
          </div>

          {/* Hint */}
          <p className="mt-1.5 text-center text-[10px] text-slate-400 dark:text-slate-500">
            Tanya bebas · ketik nomor tiket untuk cek status · &quot;lapor&quot; untuk aduan · &quot;batal&quot; untuk membatalkan
          </p>
        </footer>

        {/* Hidden file inputs */}
        <input
          ref={galleryRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={e => addFiles(e.target.files)}
        />
        <input
          ref={cameraRef}
          type="file"
          accept="image/*"
          capture="environment"
          className="hidden"
          onChange={e => addFiles(e.target.files)}
        />
      </div>
    </>
  );
}
