// ─── Speech Recognition wrapper ──────────────────────────────────────────────
// Singleton — only one instance per page (browser limitation)

type Noop = () => void;

interface RecognitionState {
  inputValue: string;
  lang: string;
  onChange: (v: string) => void;
  onEnd: Noop;
  onStop: Noop;
  speaking?: boolean;
  force?: boolean;
}

// Extend Window for webkit prefix
declare global {
  interface Window {
    webkitSpeechRecognition: new () => SpeechRecognition;
  }
}

let singleton: Recognition | null = null;

export default class Recognition {
  private state: RecognitionState;
  private recognition!: SpeechRecognition;

  static isSupported(): boolean {
    return typeof window !== 'undefined' && 'webkitSpeechRecognition' in window;
  }

  constructor(
    onChange: (v: string) => void = () => {},
    onEnd: Noop = () => {},
    onStop: Noop = () => {},
    lang = 'en',
  ) {
    if (singleton) return singleton;

    this.state = { inputValue: '', lang, onChange, onEnd, onStop };
    this.onResult = this.onResult.bind(this);
    this.onEnd    = this.onEnd.bind(this);
    this.setup();

    singleton = this;
    return singleton;
  }

  private setState(next: Partial<RecognitionState>): void {
    this.state = { ...this.state, ...next };
  }

  private onChange(interim: string): void {
    this.setState({ inputValue: interim });
    this.state.onChange(interim);
  }

  private onFinal(final: string): void {
    this.setState({ inputValue: final });
    this.recognition.stop();
  }

  private onEnd(): void {
    const { onStop, onEnd, force } = this.state;
    this.setState({ speaking: false });
    force ? onStop() : onEnd();
  }

  private onResult(event: SpeechRecognitionEvent): void {
    let interim = '';
    let final   = '';
    for (let i = event.resultIndex; i < event.results.length; i++) {
      if (event.results[i].isFinal) {
        final += event.results[i][0].transcript;
        this.onFinal(final);
      } else {
        interim += event.results[i][0].transcript;
        this.onChange(interim);
      }
    }
  }

  setup(): this {
    if (!Recognition.isSupported()) return this;
    this.recognition = new window.webkitSpeechRecognition();
    this.recognition.continuous     = true;
    this.recognition.interimResults = true;
    this.recognition.lang           = this.state.lang;
    this.recognition.onresult       = this.onResult;
    this.recognition.onend          = this.onEnd;
    return this;
  }

  setLang(lang: string): this {
    this.setState({ lang });
    this.setup();
    return this;
  }

  speak(): this {
    if (!Recognition.isSupported()) return this;
    if (!this.state.speaking) {
      this.recognition.start();
      this.setState({ speaking: true, inputValue: '' });
    } else {
      this.setState({ force: true });
      this.recognition.stop();
    }
    return this;
  }
}

// ─── Speech Synthesis helper ──────────────────────────────────────────────────
export function speakFn(opts: { enable: boolean; lang: string; voice: SpeechSynthesisVoice | null }) {
  return (step: { message?: string; user?: boolean; metadata?: Record<string, unknown> }, previousValue: string) => {
    if (!opts.enable || step.user) return;
    if (typeof window === 'undefined') return;
    if (!window.SpeechSynthesisUtterance || !window.speechSynthesis) return;

    const raw = (step.metadata?.speak as string) ?? step.message ?? '';
    const text = typeof raw === 'string' ? raw : '';
    if (!text) return;

    const msg  = new window.SpeechSynthesisUtterance();
    msg.text   = text.replace(/{previousValue}/g, previousValue);
    msg.lang   = opts.lang;
    msg.voice  = opts.voice;
    window.speechSynthesis.speak(msg);
  };
}
