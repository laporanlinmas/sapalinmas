// ─── Types & Interfaces ───────────────────────────────────────────────────────

export interface ChatTheme {
  background: string;
  fontFamily: string;
  headerBgColor: string;
  headerFontColor: string;
  headerFontSize: string;
  botBubbleColor: string;
  botFontColor: string;
  userBubbleColor: string;
  userFontColor: string;
}

export interface StepOption {
  value: string;
  label: string;
  trigger?: string | number | ((args: { value: string; steps: Record<string, RenderedStep> }) => string);
}

export interface ChatStep {
  id: string | number;
  // text step
  message?: string | ((args: { previousValue: string; steps: Record<string, RenderedStep> }) => string);
  // options step
  options?: StepOption[];
  // custom component step
  component?: React.ReactElement;
  asMessage?: boolean;
  waitAction?: boolean;
  // user input step
  user?: boolean;
  validator?: (value: string) => boolean | string;
  // shared
  trigger?: string | number | ((args: { value: string; steps: Record<string, RenderedStep> }) => string);
  update?: string | number;
  end?: boolean;
  replace?: boolean;
  delay?: number;
  avatar?: string;
  botName?: string;
  hideInput?: boolean;
  hideExtraControl?: boolean;
  placeholder?: string;
  inputAttributes?: Record<string, unknown>;
  metadata?: Record<string, unknown>;
  // runtime
  key?: string;
  value?: string;
  rendered?: boolean;
}

export interface RenderedStep {
  id: string | number;
  message?: string;
  value?: string;
  metadata?: Record<string, unknown>;
}

export interface SpeechSynthesisOptions {
  enable: boolean;
  lang: string;
  voice: SpeechSynthesisVoice | null;
}

export interface ChatBotState {
  renderedSteps: ChatStep[];
  previousSteps: ChatStep[];
  currentStep: ChatStep;
  previousStep: ChatStep;
  steps: Record<string, ChatStep>;
  disabled: boolean;
  opened: boolean;
  inputValue: string;
  inputInvalid: boolean;
  speaking: boolean;
  recognitionEnable: boolean;
  defaultUserSettings: Partial<ChatStep>;
}

export interface FloatingStyle {
  bottom?: string;
  top?: string;
  right?: string;
  left?: string;
  background?: string;
  zIndex?: number;
  transformOrigin?: string;
  [key: string]: unknown;
}

export interface ChatBotProps {
  steps: ChatStep[];
  // appearance
  style?: React.CSSProperties;
  contentStyle?: React.CSSProperties;
  footerStyle?: React.CSSProperties;
  inputStyle?: React.CSSProperties;
  submitButtonStyle?: React.CSSProperties;
  bubbleStyle?: React.CSSProperties;
  bubbleOptionStyle?: React.CSSProperties;
  avatarStyle?: React.CSSProperties;
  customStyle?: React.CSSProperties;
  controlStyle?: React.CSSProperties;
  width?: string;
  height?: string;
  className?: string;
  // header
  headerTitle?: string;
  headerComponent?: React.ReactElement;
  hideHeader?: boolean;
  // floating
  floating?: boolean;
  floatingIcon?: string | React.ReactElement;
  floatingStyle?: FloatingStyle;
  opened?: boolean;
  toggleFloating?: (args: { opened: boolean }) => void;
  // avatars
  botAvatar?: string;
  userAvatar?: string;
  botName?: string;
  hideBotAvatar?: boolean;
  hideUserAvatar?: boolean;
  // delays
  botDelay?: number;
  userDelay?: number;
  customDelay?: number;
  // input
  placeholder?: string;
  inputAttributes?: Record<string, unknown>;
  hideSubmitButton?: boolean;
  extraControl?: React.ReactElement;
  // behaviour
  cache?: boolean;
  cacheName?: string;
  enableMobileAutoFocus?: boolean;
  enableSmoothScroll?: boolean;
  handleEnd?: (args: { renderedSteps: RenderedStep[]; steps: Record<string, RenderedStep>; values: string[] }) => void;
  // speech
  recognitionEnable?: boolean;
  recognitionLang?: string;
  recognitionPlaceholder?: string;
  speechSynthesis?: SpeechSynthesisOptions;
}
