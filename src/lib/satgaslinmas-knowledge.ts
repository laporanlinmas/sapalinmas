/**
 * ==============================================================================
 * 🧠 SUPERBRAIN CHATBOT CORE (Enterprise NLP Edition)
 * ==============================================================================
 * Mesin pemroses bahasa alami cerdas (NLP) yang dirancang untuk membaca database
 * teks statis (.txt), melakukan pencarian algoritmik berbasis BM25, mengekstrak
 * kalimat yang spesifik, lalu merangkai/memparafrase jawaban menjadi natural.
 * ==============================================================================
 */

let fetchPromise: Promise<string> | null = null;

// ─── 1. KONFIGURASI SISTEM ────────────────────────────────────────────────────
const CONFIG = {
  MIN_CHUNK: 15, // Minimal karakter untuk dianggap sebagai blok informasi
  MAX_CHARS: 2000, // Maksimal karakter hasil baca
  THRESHOLD_CHUNK: 2.8, // Batas toleransi relevansi paragraf (Makin tinggi makin ketat)
  THRESHOLD_SENTENCE: 1.2, // Batas toleransi relevansi ekstraksi kalimat spesifik
  MAX_SENTENCES_IN_ANSWER: 3, // Maksimal kalimat yang dirangkai agar tidak bertele-tele
  FALLBACK: "Mohon maaf, pertanyaan Anda berada di luar cakupan informasi yang saya miliki. Bisakah Anda memberikan konteks yang lebih spesifik atau mencari melalui saluran resmi kami?",
  GREETING_REPLY: "Halo! Saya adalah Asisten Virtual cerdas Anda. Ada yang bisa saya bantu terkait layanan, informasi, aturan, atau pelaporan hari ini?",
};

// ─── 2. KAMUS NLP & LINGUISTIK ────────────────────────────────────────────────

const STOPWORDS = new Set([
  'ada','adalah','adanya','adapun','agak','agar','akan','akankah','akhir','akhiri','akhirnya','aku','akulah','amat','amatlah','anda','andalah','antar','antara','antaranya','apa','apaan','apabila','apakah','apalagi','apatah','artinya','asal','asalkan','atas','atau','ataukah','ataupun','awal','awalnya','bagai','bagaikan','bagaimana','bagaimanakah','bagaimanapun','bagi','bagian','bahkan','bahwa','bahwasanya','baik','bakal','bakalan','balik','banyak','bapak','baru','bawah','beberapa','begini','beginian','beginikah','beginilah','begitu','begitukah','begitulah','begitupun','bekerja','belakang','belakangan','belum','belumlah','benar','benarkah','benarlah','berada','berakhir','berakhirlah','berakhirnya','berapa','berapakah','berapalah','berapapun','berarti','berawal','berbagai','berdatangan','beri','berikan','berikut','berikutnya','berjumlah','berkali','berkata','bermaksud','bermula','bersama','bersiap','bertanya','berturut','betul','betulkah','biasa','biasanya','bila','bilakah','bisa','bisakah','boleh','bolehkah','bolehlah','buat','bukan','bukankah','bukanlah','bukannya','bulan','bung','cara','caranya','cukup','cukupkah','cukuplah','cuma','dahulu','dalam','dan','dapat','dari','daripada','datang','dekat','demi','demikian','demikianlah','dengan','depan','di','dia','diakhiri','diakhirinya','dialah','diantara','diantaranya','diberi','diberikan','diberikannya','dibuat','dibuatnya','didapat','didatangkan','digunakan','diibaratkan','diibaratkannya','diingat','diingatkan','diinginkan','dijawab','dijelaskan','dijelaskannya','dikarenakan','dikatakan','dikatakannya','dikerjakan','diketahui','diketahuinya','dikira','dilakukan','dilalui','dilihat','dimaksud','dimaksudkan','dimaksudkannya','dimaksudnya','diminta','dimintai','dimisalkan','dimulai','dimulailah','dimulainya','dimungkinkan','dini','dipastikan','diperbuat','diperbuatnya','dipergunakan','diperkirakan','diperlihatkan','diperlukan','diperlukannya','dipersoalkan','dipertanyakan','dipunyai','diri','dirinya','disampaikan','disebut','disebutkan','disebutkannya','disini','disinilah','ditambahkan','ditandaskan','ditanya','ditanyai','ditanyakan','ditegaskan','ditujukan','ditunjuk','ditunjuki','ditunjukkan','ditunjukkannya','ditunjuknya','dituturkan','dituturkannya','diucapkan','diucapkannya','diungkapkan','dong','dua','dulu','empat','enggak','enggaknya','entah','entahlah','guna','gunakan','hal','hampir','hanya','hanyalah','hari','harus','haruslah','harusnya','hendak','hendaklah','hendaknya','hingga','ia','ialah','ibarat','ibaratkan','ibaratnya','ibu','ikut','ingat','ingin','inginkah','inginkan','ini','inikah','inilah','itu','itukah','itulah','jadi','jadilah','jadinya','jangan','jangankan','janganlah','jauh','jawab','jawaban','jawabnya','jelas','jelaslah','jelasnya','jika','jikalau','juga','jumlah','jumlahnya','justru','kala','kalau','kalaulah','kalaupun','kalian','kami','kamilah','kamu','kamulah','kan','kapan','kapankah','kapanpun','karena','karenanya','kasus','kata','katakan','katakanlah','katanya','ke','keadaan','kebetulan','kecil','kedua','keduanya','keinginan','kelak','kelima','kemudian','kemungkinan','kemungkinannya','kenapa','kepada','kepadanya','kesampaian','keseluruhan','keseluruhannya','keterlaluan','ketika','khususnya','kini','kinilah','kira','kiranya','kita','kitalah','kok','kondisi','ku','kurang','lagi','lagian','lah','lain','lainnya','lalu','lama','lamanya','lanjut','lanjutnya','lebih','lewat','lima','luar','macam','maka','makanya','makin','malah','malahan','mampu','mampukah','mana','manakala','manalagi','masa','masalah','masalahnya','masih','masihkah','masing','mata','mau','maupun','melainkan','melakukan','melalui','melihat','melihatnya','memang','memastikan','memberi','memberikan','membuat','memerlukan','memihak','meminta','memintakan','memisalkan','memperbuat','mempergunakan','memperkirakan','memperlihatkan','mempersiapkan','mempersoalkan','mempertanyakan','mempunyai','memulai','menambah','menambahkan','menandaskan','menanya','menanyai','menanyakan','mendapat','mendapatkan','mendatang','mendatangi','mendatangkan','menegaskan','mengakhiri','mengapa','mengatakan','mengatakannya','mengenai','mengerjakan','mengetahui','menggunakan','menghendaki','mengibaratkan','mengibaratkannya','mengingat','mengingatkan','menginginkan','mengira','mengucapkan','mengucapkannya','mengungkapkan','menjadi','menjawab','menjelaskan','menuju','menunjuk','menunjuki','menunjukkan','menunjuknya','menurut','menuturkan','menyampaikan','menyangkut','menyatakan','menyebutkan','menyeluruh','menyiapkan','merasa','mereka','merekalah','merupakan','meski','meskipun','meyakini','meyakinkan','minta','mirip','misal','misalkan','misalnya','mula','mulai','mulailah','mulanya','mungkin','mungkinkah','nah','namun','nanti','nantinya','nyaris','nya','oleh','olehnya','pada','padahal','padanya','pak','paling','panjang','pantas','para','pasti','pastilah','penting','pentingnya','per','percuma','perlu','perlukah','perlunya','pernah','persoalan','pertama','pertanyaan','pertanyakan','pihak','pihaknya','pukul','pula','pun','punya','rasa','rasanya','rupa','rupanya','saat','saatnya','saja','sajalah','saling','sama','samabarang','sambil','sampai','sampaikan','sana','sangat','sangatlah','satu','saya','sayalah','se','sebab','sebabnya','sebagai','sebagaimana','sebagainya','sebagian','sebaik','sebaiknya','sebaliknya','sebanyak','sebegini','sebegitu','sebelum','sebelumnya','sebenarnya','seberapa','sebesar','sebetulnya','sebisanya','sebuah','sebut','sebutlah','sebutnya','secara','secukupnya','sedang','sedangkan','sedemikian','sedikit','sedikitnya','seenaknya','segala','segalanya','segera','seharusnya','sehingga','seingat','sejak','sejauh','sejenak','sejumlah','sekadar','sekalipun','sekarang','sekecil','seketika','sekiranya','sekitar','sekitarnya','sekurang','sekurangnya','sela','selagi','selain','selaku','selalu','selama','selamanya','seluruh','seluruhnya','semacam','semakin','semampu','sempat','semua','semuanya','semula','sendiri','sendirian','sendirinya','seolah','seorang','sepanjang','sepantasnya','sepantasnyalah','seperlunya','seperti','sepertinya','sepihak','sering','seringnya','serta','serupa','sesaat','sesama','sesampai','sesegera','sesudah','sesudahnya','sesuatu','sesuatunya','sesungguhnya','setelah','setempat','setengah','seterusnya','setiap','setiba','setibanya','setidak','setidaknya','setinggi','seusai','sewaktu','siap','siapa','siapakah','siapapun','sini','sinilah','soal','soalnya','suatu','sudah','sudahkah','sudahlah','supaya','tadi','tadinya','tahu','tahun','tak','tambah','tambahnya','tampak','tampaknya','tandas','tandasnya','tanpa','tanya','tanyakan','tanyanya','tapi','tegas','tegasnya','telah','tempat','tengah','tentang','tentu','tentukah','tentulah','tentunya','tepat','terakhir','terasa','terbanyak','terdahulu','terdapat','terdiri','terhadap','terhadapnya','teringat','terjadi','terjadilah','terjadinya','terkira','terlalu','terlebih','terlihat','termasuk','ternyata','tersampaikan','tersebut','tersebutlah','tertertentu','tertuju','terus','terutama','tetap','tetapi','tiap','tiba','tidak','tidakkah','tidaklah','tiga','tinggi','toh','tunjuk','turut','tutur','tuturnya','ucap','ucapnya','umpama','umpamanya','ungkap','ungkapnya','untuk','usah','usai','waduh','wah','wahai','waktu','waktunya','walau','walaupun','wong','yaitu','yakin','yakni','yang'
]);

// Kamus Singkatan Lengkap & Mapping Domain Umum
const SYNONYMS: Record<string, string[]> = {
  // Singkatan umum internet/chat
  yg: ['yang'], dgn: ['dengan'], dlm: ['dalam'], pd: ['pada'], dr: ['dari'],
  utk: ['untuk', 'buat', 'bagi'], krn: ['karena', 'sebab', 'karna'],
  kalo: ['kalau', 'jika', 'bila', 'apabila'], kl: ['kalau', 'jika'],
  gmn: ['bagaimana', 'gimana', 'cara', 'caranya', 'prosedur', 'langkah'],
  bgmn: ['bagaimana', 'cara'], kpn: ['kapan', 'waktu', 'jadwal', 'tanggal', 'hari'],
  dmn: ['dimana', 'lokasi', 'tempat', 'alamat', 'kemana'],
  brp: ['berapa', 'jumlah', 'harga', 'biaya'],
  tdk: ['tidak', 'enggak', 'bukan', 'ga', 'gak'],
  blm: ['belum'], bsk: ['besok', 'esok'],
  skrg: ['sekarang', 'saat ini', 'kini'],
  bgt: ['banget', 'sangat', 'sekali'],
  aja: ['saja'], sm: ['sama', 'dengan'],
  sy: ['saya', 'aku', 'kami'], aq: ['aku', 'saya'],
  km: ['kamu', 'anda'], org: ['orang', 'warga', 'masyarakat'],
  
  // Kata kunci layanan / pengaduan umum
  info: ['informasi', 'berita', 'kabar', 'pengumuman', 'detail'],
  aduan: ['laporan', 'pengaduan', 'melapor', 'lapor', 'komplain', 'keluhan'],
  masalah: ['kasus', 'kendala', 'gangguan', 'problem'],
  tiket: ['nomor tiket', 'id aduan', 'resi', 'kode', 'pelacakan', 'tracking'],
  bayar: ['biaya', 'tarif', 'harga', 'ongkos', 'pembayaran'],
  gratis: ['cuma cuma', 'tanpa biaya', 'free'],
  bantuan: ['tolong', 'panduan', 'bantu', 'dukungan'],
  aturan: ['peraturan', 'syarat', 'ketentuan', 'kebijakan', 'sop'],

  // Spesifik Institusi Pemerintahan (Bisa disesuaikan lebih lanjut)
  satpol: ['satpol pp', 'satuan polisi pamong praja', 'polisi pamong praja', 'pamong', 'praja'],
  linmas: ['satlinmas', 'perlindungan masyarakat', 'hansip', 'keamanan', 'ketertiban', 'trantibum'],
  cfd: ['car free day', 'hari bebas kendaraan'],
  pkl: ['pedagang kaki lima', 'pedagang', 'jualan', 'lapak', 'pasar', 'jual', 'tenda'],
  pedestrian: ['trotoar', 'pejalan kaki', 'bahu jalan'],
  pemda: ['pemerintah daerah', 'pemkab', 'pemerintah kabupaten'],

  // Media sosial
  ig: ['instagram'], tt: ['tiktok'], wa: ['whatsapp'], fb: ['facebook'], yt: ['youtube']
};

const GREETINGS = new Set(['hai', 'halo', 'hallo', 'hello', 'hey', 'hi', 'p', 'ping', 'assalamualaikum', 'pagi', 'siang', 'sore', 'malam', 'test', 'tes']);

// ─── 3. INTENT & ENTITY RECOGNITION ───────────────────────────────────────────

enum Intent { HOW, WHERE, WHEN, WHO, WHAT, WHY, COST, GENERAL }

function detectIntent(query: string): Intent {
  const q = query.toLowerCase();
  if (/\b(bagaimana|gimana|gmn|cara|langkah|prosedur|panduan|tutorial|syarat)\b/.test(q)) return Intent.HOW;
  if (/\b(dimana|dmn|lokasi|tempat|alamat|kemana)\b/.test(q)) return Intent.WHERE;
  if (/\b(kapan|kpn|waktu|jam|hari|tanggal|jadwal|tgl)\b/.test(q)) return Intent.WHEN;
  if (/\b(siapa|dengan siapa|nama|hubungi|kontak)\b/.test(q)) return Intent.WHO;
  if (/\b(kenapa|mengapa|alasan|penyebab)\b/.test(q)) return Intent.WHY;
  if (/\b(biaya|harga|bayar|tarif|gratis|brp)\b/.test(q)) return Intent.COST;
  if (/\b(apa|apakah|definisi|pengertian|maksud|info)\b/.test(q)) return Intent.WHAT;
  return Intent.GENERAL;
}

// Ekstraksi subjek pertanyaan untuk dipantulkan kembali ke user (Echoing)
function extractSubject(query: string): string {
  let cleaned = query.toLowerCase()
    .replace(/\b(bagaimana|cara|apa|dimana|kapan|siapa|kenapa|mengapa|tolong|jelaskan|info|informasi|tanya)\b/g, '')
    .replace(/[^\w\s]/g, '')
    .trim();
  
  if (cleaned.length > 30) cleaned = cleaned.substring(0, 30) + '...';
  return cleaned.length > 2 ? cleaned : 'hal tersebut';
}

// ─── 4. TEXT PROCESSING & NLP ─────────────────────────────────────────────────

export function prefetchSatgasLinmasText(): void { void getSatgasLinmasText(); }

export function getSatgasLinmasText(): Promise<string> {
  if (!fetchPromise) {
    fetchPromise = fetch('/satgaslinmas.txt').then(r => (r.ok ? r.text() : '')).catch(() => '');
  }
  return fetchPromise;
}

export function clearSatgasLinmasCache(): void { fetchPromise = null; }

function preprocessDoc(raw: string): string {
  return raw.split('\n').filter(l => !l.trim().startsWith('#')).join('\n').trim();
}

function chunkDoc(text: string): string[] {
  if (!text) return [];
  // Pemecahan blok berbasis baris kosong ganda (paragraf)
  return text.split(/\n\s*\n+/).map(p => p.trim().replace(/\n+/g, ' ')).filter(p => p.length >= CONFIG.MIN_CHUNK);
}

function splitSentences(text: string): string[] {
  // Regex tingkat lanjut untuk memecah kalimat. Mengabaikan singkatan umum seperti "No.", "Rp.", "dll."
  const sentenceRegex = /(?<!\b(?:[Nn]o|[Rr]p|[Dd]ll|[Yy]th|[Dd]r|[Mm]r|[Mm]rs|[Vv]s))\s*[.!?]+(?:\s|$)/g;
  const parts = text.split(sentenceRegex).map(s => s.trim()).filter(s => s.length > 10);
  return parts.length > 0 ? parts : [text];
}

function cleanText(s: string): string {
  return s.toLowerCase().replace(/[^\w\s]/g, ' ').replace(/\s+/g, ' ').trim();
}

// Stemmer Bahasa Indonesia Lanjutan
function stemId(word: string): string {
  let w = word;
  if (w.length <= 4) return w;
  
  // Suffixes
  if (w.endsWith('kah') || w.endsWith('lah') || w.endsWith('pun')) w = w.slice(0, -3);
  if (w.endsWith('nya')) w = w.slice(0, -3);
  if (w.endsWith('kan')) w = w.slice(0, -3);
  else if (w.endsWith('i') && !w.endsWith('ai') && !w.endsWith('ri')) w = w.slice(0, -1);
  
  // Prefixes
  if (w.startsWith('meng') || w.startsWith('meny') || w.startsWith('peng') || w.startsWith('peny')) w = w.slice(4);
  else if (w.startsWith('mem') || w.startsWith('men') || w.startsWith('pem') || w.startsWith('pen') || w.startsWith('ber') || w.startsWith('ter')) w = w.slice(3);
  else if (w.startsWith('me') || w.startsWith('di') || w.startsWith('pe') || w.startsWith('se') || w.startsWith('ke')) w = w.slice(2);
  
  return w;
}

function tokenize(text: string): string[] {
  const cleaned = cleanText(text);
  const words = cleaned.split(' ').filter(w => w.length > 1);
  const tokens: string[] = [];

  for (let w of words) {
    if (STOPWORDS.has(w)) continue;
    
    // Ekspansi Singkatan & Sinonim terlebih dahulu
    if (SYNONYMS[w]) {
      SYNONYMS[w].forEach(syn => syn.split(' ').forEach(sw => {
        if (!STOPWORDS.has(sw)) tokens.push(stemId(sw));
      }));
    }
    tokens.push(stemId(w));
  }
  return tokens;
}

// ─── 5. CORE SEARCH ENGINE (Hierarchical BM25) ────────────────────────────────

export interface KnowledgeHit { text: string; score: number; context: string; }

class BM25Engine {
  private documents: string[];
  private docTokens: string[][];
  private docCount: number;
  private avgDocLen: number;
  private termFreqs: Map<string, number>;
  
  // Tuning Params: k1 mengatur kejenuhan frekuensi (saturation), b mengatur normalisasi panjang dokumen
  private k1 = 1.2; 
  private b = 0.75;

  constructor(documents: string[]) {
    this.documents = documents;
    this.docCount = documents.length;
    let totalLen = 0;
    this.docTokens = [];
    this.termFreqs = new Map();

    for (const doc of this.documents) {
      const tokens = tokenize(doc);
      this.docTokens.push(tokens);
      totalLen += tokens.length;
      
      const uniqueTokens = new Set(tokens);
      uniqueTokens.forEach(t => this.termFreqs.set(t, (this.termFreqs.get(t) || 0) + 1));
    }
    this.avgDocLen = this.docCount > 0 ? totalLen / this.docCount : 0;
  }

  private calculateIDF(term: string): number {
    const df = this.termFreqs.get(term) || 0;
    if (df === 0) return 0;
    // IDF smoothing
    return Math.log(1 + (this.docCount - df + 0.5) / (df + 0.5));
  }

  public search(queryTokens: string[], exactQueryText: string): { idx: number, score: number }[] {
    if (this.docCount === 0 || queryTokens.length === 0) return [];

    return this.documents.map((doc, idx) => {
      const tokens = this.docTokens[idx];
      let score = 0;
      
      // Exact string matching boost (super intelligent contextual matching)
      const cleanDocText = cleanText(doc);
      const cleanQuery = cleanText(exactQueryText);
      if (cleanDocText.includes(cleanQuery) && cleanQuery.length > 5) {
        score += 20; 
      }

      for (const qTerm of queryTokens) {
        const tf = tokens.filter(t => t === qTerm).length;
        if (tf === 0) continue;
        
        const idf = this.calculateIDF(qTerm);
        const numerator = tf * (this.k1 + 1);
        const denominator = tf + this.k1 * (1 - this.b + this.b * (tokens.length / this.avgDocLen));
        score += idf * (numerator / denominator);
      }
      return { idx, score };
    }).sort((a, b) => b.score - a.score);
  }
}

// ─── 6. NATURAL LANGUAGE GENERATOR (NLG) & PARAPHRASER ────────────────────────

class AnswerSynthesizer {
  
  /**
   * Membersihkan teks mentah hasil ekstraksi dari kata sambung aneh di awal kalimat.
   */
  private static cleanSnippet(snippet: string): string {
    return snippet
      .replace(/^(dan|serta|sehingga|namun|tetapi|karena itu|oleh karena itu|kemudian)\s+/i, '')
      .replace(/^[\-\*]\s*/, '') // Hapus bullet points di awal jika ada
      .trim();
  }

  /**
   * Menggabungkan beberapa kalimat menjadi satu untaian koheren
   */
  private static weaveSentences(sentences: string[]): string {
    if (sentences.length === 1) return this.cleanSnippet(sentences[0]);
    
    // Urutkan kalimat yang akan digabung, lalu rapikan
    const cleaned = sentences.map(s => this.cleanSnippet(s));
    return cleaned.join('. ') + '.';
  }

  /**
   * Fungsi utama untuk merangkai jawaban agar tidak terdengar kaku.
   */
  public static generateResponse(intent: Intent, rawSnippets: string[], subject: string, fullContext: string): string {
    const wovenAnswer = this.weaveSentences(rawSnippets);
    const hasLongAnswer = wovenAnswer.length > 80;

    // Jika potongannya terlalu pendek, kita asumsikan butuh konteks penuh
    const finalData = wovenAnswer.length < 25 ? fullContext : wovenAnswer;

    // Variasi Intro agar bot tidak membosankan (Randomized Selection)
    const howIntros = [
      `Terkait ${subject}, berikut adalah langkah-langkah yang dapat Anda ikuti:\n`,
      `Berdasarkan data yang saya miliki, prosedur untuk ${subject} adalah sebagai berikut:\n`,
      `Untuk ${subject}, silakan perhatikan panduan berikut:\n`
    ];

    const whereIntros = [
      `Untuk detail lokasi ${subject}, Anda dapat merujuk ke informasi berikut: `,
      `Mengenai tempat atau lokasi ${subject}, data kami menunjukkan: `,
      `Informasi alamat/lokasi terkait ${subject} adalah: `
    ];

    const whenIntros = [
      `Terkait jadwal dan waktu untuk ${subject}, informasinya adalah: `,
      `Catat waktunya! Berikut jadwal terkait ${subject}: `,
      `Pelaksanaan atau jadwal ${subject} ditentukan pada: `
    ];

    const generalIntros = [
      `Mengenai ${subject}, ini informasi yang saya temukan:\n`,
      `Terkait hal tersebut, berikut penjelasannya:\n`,
      `Dari basis data kami terkait ${subject}:\n`
    ];

    // Pemilihan template berdasarkan intent
    let responseText = "";

    switch (intent) {
      case Intent.HOW:
        responseText = howIntros[Math.floor(Math.random() * howIntros.length)] + `"${finalData}"`;
        break;
      case Intent.WHERE:
        responseText = whereIntros[Math.floor(Math.random() * whereIntros.length)] + `"${finalData}"`;
        break;
      case Intent.WHEN:
        responseText = whenIntros[Math.floor(Math.random() * whenIntros.length)] + `"${finalData}"`;
        break;
      case Intent.WHO:
        responseText = `Pihak atau kontak yang berkaitan dengan ${subject} adalah: "${finalData}"`;
        break;
      case Intent.COST:
        responseText = `Mengenai rincian biaya atau tarif untuk ${subject}: "${finalData}"`;
        break;
      case Intent.WHAT:
      case Intent.WHY:
      case Intent.GENERAL:
      default:
        // Pengecekan cerdas: jika jawaban sudah terdengar seperti kalimat utuh/langsung
        const lowerData = finalData.toLowerCase();
        if (lowerData.startsWith('adalah') || lowerData.startsWith('merupakan') || lowerData.startsWith('yaitu')) {
          responseText = `${subject} ${finalData}`;
        } else {
          responseText = generalIntros[Math.floor(Math.random() * generalIntros.length)] + `"${finalData}"`;
        }
        break;
    }

    // Tambahkan kalimat penutup sopan jika jawaban cukup panjang
    if (hasLongAnswer) {
      const outros = [
        "Semoga penjelasan ini cukup membantu Anda.",
        "Jika ada hal lain yang perlu diperjelas, jangan ragu untuk bertanya.",
        "Demikian informasi yang dapat saya sampaikan."
      ];
      responseText += `\n\n_${outros[Math.floor(Math.random() * outros.length)]}_`;
    }

    return responseText;
  }
}

// ─── 7. ENDPOINT UTAMA (THE BRAIN) ────────────────────────────────────────────

/**
 * SuperBrain Chatbot Core
 * Menerima pertanyaan pengguna, melakukan analisis lapis ganda (Chunk -> Sentence),
 * dan melakukan parafrase dinamis.
 * 
 * @param query String pertanyaan dari user
 * @param documentRaw Teks mentah dari file database (.txt)
 * @returns Jawaban cerdas yang sudah dirangkai
 */
export function askChatbot(query: string, documentRaw: string): string {
  // 1. Cek Sapaan Awal
  const cleanQ = cleanText(query);
  if (GREETINGS.has(cleanQ) || cleanQ.length < 3) {
    return CONFIG.GREETING_REPLY;
  }

  // 2. Tokenisasi Pertanyaan
  const queryTokens = tokenize(query);
  if (!queryTokens.length) return CONFIG.FALLBACK;

  // 3. LEVEL 1: PENCARIAN PARAGRAF (Macro Context)
  const chunks = chunkDoc(preprocessDoc(documentRaw));
  const chunkEngine = new BM25Engine(chunks);
  const bestChunks = chunkEngine.search(queryTokens, query);

  if (!bestChunks.length || bestChunks[0].score < CONFIG.THRESHOLD_CHUNK) {
    return CONFIG.FALLBACK;
  }

  const winningChunk = chunks[bestChunks[0].idx];
  
  // 4. LEVEL 2: PENCARIAN KALIMAT (Micro Snippeting)
  // Kita bedah paragraf yang menang menjadi kalimat-kalimat tunggal
  const sentences = splitSentences(winningChunk);
  const sentenceEngine = new BM25Engine(sentences);
  const bestSentences = sentenceEngine.search(queryTokens, query);

  let selectedSnippets: string[] = [];

  // Jika kita menemukan kalimat spesifik yang skornya tinggi
  if (bestSentences.length > 0 && bestSentences[0].score >= CONFIG.THRESHOLD_SENTENCE) {
    // Ambil maksimal N kalimat terbaik agar jawaban fokus
    const topSentencesIdx = bestSentences
      .filter(s => s.score >= CONFIG.THRESHOLD_SENTENCE)
      .slice(0, CONFIG.MAX_SENTENCES_IN_ANSWER)
      .map(s => s.idx)
      .sort((a, b) => a - b); // Urutkan kembali berdasarkan kemunculan di teks asli (kronologis)

    // Jika indexnya loncat-loncat (misal kalimat 1 lalu kalimat 4), 
    // kita cukup sisipkan kalimat jembatan jika perlu, atau gabungkan saja.
    for (let i = 0; i < topSentencesIdx.length; i++) {
      const idx = topSentencesIdx[i];
      selectedSnippets.push(sentences[idx]);
      
      // Ambil kalimat penerusnya (+1) secara otomatis JIKA kalimat ini gantung
      // Misalnya kalimat diakhiri dengan tanda ":" atau koma ","
      if (sentences[idx].trim().endsWith(':') || sentences[idx].trim().endsWith(',')) {
        if (idx + 1 < sentences.length && !topSentencesIdx.includes(idx + 1)) {
          selectedSnippets.push(sentences[idx + 1]);
        }
      }
    }
  }

  // Fallback: Jika sistem gagal menemukan kalimat spesifik yang kuat, kembalikan seluruh paragraf utuh
  if (selectedSnippets.length === 0) {
    selectedSnippets = [winningChunk];
  }

  // 5. NATURAL LANGUAGE GENERATION (Menenun Jawaban)
  const intent = detectIntent(query);
  const subject = extractSubject(query);
  const finalResponse = AnswerSynthesizer.generateResponse(intent, selectedSnippets, subject, winningChunk);

  return finalResponse;
}

/**
 * Fallback Function: Jika UI membutuhkan Top N jawaban beserta context array-nya (untuk debugging)
 */
export function searchKnowledgeTop(query: string, documentRaw: string, topN = 2): KnowledgeHit[] {
  const chunks = chunkDoc(preprocessDoc(documentRaw));
  const engine = new BM25Engine(chunks);
  const results = engine.search(tokenize(query), query);
  
  return results
    .filter(r => r.score >= CONFIG.THRESHOLD_CHUNK)
    .slice(0, topN)
    .map(r => ({
      text: chunks[r.idx].length > CONFIG.MAX_CHARS ? chunks[r.idx].slice(0, CONFIG.MAX_CHARS).trim() + '…' : chunks[r.idx],
      score: r.score,
      context: chunks[r.idx]
    }));
}
