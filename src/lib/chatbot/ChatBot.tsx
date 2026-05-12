'use client';
import React, { Component } from 'react';
import Random from 'random-id';
import { TextStep, OptionsStep, CustomStep } from './steps';
import schema from './schemas';
import { getData, setData } from './storage';
import Recognition, { speakFn } from './recognition';
import { isMobile } from './theme';
import { defaultTheme, BOT_AVATAR, USER_AVATAR } from './theme';
import {
  ChatBotContainer, Content, Header, HeaderTitle, HeaderIcon,
  FloatButton, FloatingIcon, Footer, Input, SubmitButton,
  ChatIcon, CloseIcon, SubmitIcon, MicIcon,
} from './styled-components';
import type { ChatBotProps, ChatBotState, ChatStep, RenderedStep } from './types';

// ─── ChatBot ──────────────────────────────────────────────────────────────────
class ChatBot extends Component<ChatBotProps, ChatBotState> {
  private content: HTMLDivElement | null = null;
  private input:   HTMLInputElement | null = null;
  private recognition!: Recognition;
  private supportsScrollBehavior = false;
  private speak: (step: ChatStep, prev: string) => void;

  static defaultProps: Partial<ChatBotProps> = {
    avatarStyle:        {},
    botDelay:           1000,
    botName:            'Bot',
    botAvatar:          BOT_AVATAR,
    userAvatar:         USER_AVATAR,
    bubbleOptionStyle:  {},
    bubbleStyle:        {},
    cache:              false,
    cacheName:          'rsc_cache',
    className:          '',
    contentStyle:       {},
    customStyle:        {},
    controlStyle:       { position: 'absolute', right: '0', top: '0' },
    customDelay:        1000,
    enableMobileAutoFocus: false,
    enableSmoothScroll: false,
    extraControl:       undefined,
    floating:           false,
    floatingIcon:       <ChatIcon />,
    floatingStyle:      {},
    footerStyle:        {},
    handleEnd:          undefined,
    headerComponent:    undefined,
    headerTitle:        'Chat',
    height:             '520px',
    hideBotAvatar:      false,
    hideHeader:         false,
    hideSubmitButton:   false,
    hideUserAvatar:     false,
    inputStyle:         {},
    opened:             undefined,
    placeholder:        'Type the message ...',
    inputAttributes:    {},
    recognitionEnable:  false,
    recognitionLang:    'en',
    recognitionPlaceholder: 'Listening ...',
    speechSynthesis:    { enable: false, lang: 'en', voice: null },
    style:              {},
    submitButtonStyle:  {},
    toggleFloating:     undefined,
    userDelay:          1000,
    width:              '350px',
  };

  constructor(props: ChatBotProps) {
    super(props);

    this.state = {
      renderedSteps:    [],
      previousSteps:    [],
      currentStep:      {} as ChatStep,
      previousStep:     {} as ChatStep,
      steps:            {},
      disabled:         true,
      opened:           props.opened ?? !props.floating,
      inputValue:       '',
      inputInvalid:     false,
      speaking:         false,
      recognitionEnable: !!(props.recognitionEnable && Recognition.isSupported()),
      defaultUserSettings: {},
    };

    this.speak = speakFn(props.speechSynthesis ?? { enable: false, lang: 'en', voice: null });
  }

  componentDidMount() {
    const {
      steps, botDelay, botAvatar, botName, cache, cacheName,
      customDelay, enableMobileAutoFocus, userAvatar, userDelay,
      recognitionEnable, recognitionLang,
    } = this.props;

    const defaultBotSettings    = { delay: botDelay, avatar: botAvatar, botName };
    const defaultUserSettings   = { delay: userDelay, avatar: userAvatar, hideInput: false, hideExtraControl: false };
    const defaultCustomSettings = { delay: customDelay };

    const chatSteps: Record<string, ChatStep> = {};

    for (const step of steps) {
      const settings =
        step.user                        ? defaultUserSettings   :
        (step.message || step.asMessage) ? defaultBotSettings    :
        step.component                   ? defaultCustomSettings : {};

      chatSteps[step.id as string] = Object.assign({}, settings, schema.parse({ ...step }));
    }

    schema.checkInvalidIds(chatSteps);

    const firstStep = steps[0];
    if (firstStep.message) {
      const msg = firstStep.message;
      firstStep.message = typeof msg === 'function' ? msg({ previousValue: '', steps: {} }) : msg;
      chatSteps[firstStep.id as string].message = firstStep.message;
    }

    if (recognitionEnable && this.state.recognitionEnable) {
      this.recognition = new Recognition(
        v => this.setState({ inputValue: v }),
        () => { this.setState({ speaking: false }); this.handleSubmitButton(); },
        () => this.setState({ speaking: false }),
        recognitionLang,
      );
    }

    this.supportsScrollBehavior = 'scrollBehavior' in document.documentElement.style;

    if (this.content) {
      this.content.addEventListener('DOMNodeInserted', this.onNodeInserted);
      window.addEventListener('resize', this.onResize);
    }

    const { currentStep, previousStep, previousSteps, renderedSteps } = getData(
      { cacheName: cacheName!, cache: cache!, firstStep, steps: chatSteps },
      () => {
        this.setState({ disabled: false }, () => {
          if (enableMobileAutoFocus || !isMobile()) this.input?.focus();
        });
      },
    );

    this.setState({ currentStep, defaultUserSettings, previousStep, previousSteps, renderedSteps, steps: chatSteps });
  }

  static getDerivedStateFromProps(props: ChatBotProps, state: ChatBotState): Partial<ChatBotState> | null {
    const { opened, toggleFloating } = props;
    if (toggleFloating !== undefined && opened !== undefined && opened !== state.opened) {
      return { ...state, opened };
    }
    return null;
  }

  componentWillUnmount() {
    this.content?.removeEventListener('DOMNodeInserted', this.onNodeInserted);
    window.removeEventListener('resize', this.onResize);
  }

  // ── Scroll ──────────────────────────────────────────────────────────────────
  private onNodeInserted = (event: Event) => {
    const target = event.currentTarget as HTMLElement;
    if (this.props.enableSmoothScroll && this.supportsScrollBehavior) {
      target.scroll({ top: target.scrollHeight, left: 0, behavior: 'smooth' });
    } else {
      target.scrollTop = target.scrollHeight;
    }
  };

  private onResize = () => {
    if (this.content) this.content.scrollTop = this.content.scrollHeight;
  };

  // ── Step helpers ─────────────────────────────────────────────────────────────
  private getTriggeredStep(trigger: ChatStep['trigger'], value: string): string | number {
    const steps = this.generateRenderedStepsById();
    return typeof trigger === 'function' ? trigger({ value, steps }) : (trigger as string | number);
  }

  private getStepMessage(message: ChatStep['message']): string {
    const { previousSteps } = this.state;
    const lastIdx = previousSteps.length > 0 ? previousSteps.length - 1 : 0;
    const steps   = this.generateRenderedStepsById();
    const prev    = previousSteps[lastIdx]?.value ?? '';
    return typeof message === 'function' ? message({ previousValue: prev, steps }) : (message ?? '');
  }

  private generateRenderedStepsById(): Record<string, RenderedStep> {
    const result: Record<string, RenderedStep> = {};
    for (const s of this.state.previousSteps) {
      result[s.id as string] = { id: s.id, message: s.message, value: s.value, metadata: s.metadata };
    }
    return result;
  }

  // ── triggerNextStep ──────────────────────────────────────────────────────────
  triggerNextStep = (data?: { trigger?: string; value?: string; hideInput?: boolean; hideExtraControl?: boolean }) => {
    const { enableMobileAutoFocus } = this.props;
    const { defaultUserSettings, previousSteps, renderedSteps, steps } = this.state;
    let { currentStep, previousStep } = this.state;

    if (data?.value)            currentStep.value            = data.value;
    if (data?.hideInput)        currentStep.hideInput        = data.hideInput;
    if (data?.hideExtraControl) currentStep.hideExtraControl = data.hideExtraControl;
    if (data?.trigger)          currentStep.trigger          = this.getTriggeredStep(data.trigger, data.value ?? '');

    if (currentStep.end) {
      this.handleEnd();
      return;
    }

    if (currentStep.options && data) {
      const option  = currentStep.options.find(o => o.value === data.value)!;
      const trigger = this.getTriggeredStep(option.trigger, currentStep.value ?? '');
      delete currentStep.options;

      currentStep = Object.assign({}, currentStep, option, defaultUserSettings, {
        user: true, message: option.label, trigger,
      });

      renderedSteps.pop();
      previousSteps.pop();
      renderedSteps.push(currentStep);
      previousSteps.push(currentStep);
      this.setState({ currentStep, renderedSteps, previousSteps });

    } else if (currentStep.trigger) {
      if (currentStep.replace) renderedSteps.pop();

      const trigger  = this.getTriggeredStep(currentStep.trigger, currentStep.value ?? '');
      let nextStep   = { ...steps[trigger as string] };

      if (nextStep.message) {
        nextStep.message = this.getStepMessage(nextStep.message);
      } else if (nextStep.update) {
        const updateStep = nextStep;
        nextStep = { ...steps[updateStep.update as string] };
        if (nextStep.options) {
          nextStep.options.forEach(o => { o.trigger = updateStep.trigger as string; });
        } else {
          nextStep.trigger = updateStep.trigger;
        }
      }

      nextStep.key = Random(24);
      previousStep = currentStep;
      currentStep  = nextStep;

      this.setState({ renderedSteps, currentStep, previousStep }, () => {
        if (nextStep.user) {
          this.setState({ disabled: false }, () => {
            if (enableMobileAutoFocus || !isMobile()) this.input?.focus();
          });
        } else {
          renderedSteps.push(nextStep);
          previousSteps.push(nextStep);
          this.setState({ renderedSteps, previousSteps });
        }
      });
    }

    const { cache, cacheName } = this.props;
    if (cache) {
      setTimeout(() => setData(cacheName!, { currentStep, previousStep, previousSteps, renderedSteps }), 300);
    }
  };

  // ── handleEnd ────────────────────────────────────────────────────────────────
  private handleEnd() {
    const { handleEnd } = this.props;
    if (!handleEnd) return;

    const { previousSteps } = this.state;
    const renderedSteps = previousSteps.map(({ id, message, value, metadata }) => ({ id, message, value, metadata }));
    const stepsMap: Record<string, RenderedStep> = {};
    for (const { id, message, value, metadata } of previousSteps) {
      stepsMap[id as string] = { id, message, value, metadata };
    }
    const values = previousSteps.filter(s => s.value).map(s => s.value!);
    handleEnd({ renderedSteps, steps: stepsMap, values });
  }

  // ── Input ────────────────────────────────────────────────────────────────────
  private isInputValueEmpty = () => !this.state.inputValue?.length;

  private handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') this.submitUserMessage();
  };

  private handleSubmitButton = () => {
    const { speaking, recognitionEnable } = this.state;
    if ((this.isInputValueEmpty() || speaking) && recognitionEnable) {
      this.recognition.speak();
      if (!speaking) this.setState({ speaking: true });
      return;
    }
    this.submitUserMessage();
  };

  private submitUserMessage = () => {
    const { defaultUserSettings, inputValue, previousSteps, renderedSteps } = this.state;
    let { currentStep } = this.state;

    if (currentStep.validator && this.checkInvalidInput()) return;

    currentStep = Object.assign({}, defaultUserSettings, currentStep, { message: inputValue, value: inputValue });
    renderedSteps.push(currentStep);
    previousSteps.push(currentStep);

    this.setState({ currentStep, renderedSteps, previousSteps, disabled: true, inputValue: '' }, () => {
      this.input?.blur();
    });
  };

  private checkInvalidInput = (): boolean => {
    const { enableMobileAutoFocus } = this.props;
    const { currentStep, inputValue } = this.state;
    const result = currentStep.validator!(inputValue);
    if (typeof result === 'boolean' && result) return false;

    const saved = inputValue;
    this.setState({ inputValue: result.toString(), inputInvalid: true, disabled: true }, () => {
      setTimeout(() => {
        this.setState({ inputValue: saved, inputInvalid: false, disabled: false }, () => {
          if (enableMobileAutoFocus || !isMobile()) this.input?.focus();
        });
      }, 2000);
    });
    return true;
  };

  // ── Toggle ───────────────────────────────────────────────────────────────────
  private toggleChatBot = (opened: boolean) => {
    const { toggleFloating } = this.props;
    toggleFloating ? toggleFloating({ opened }) : this.setState({ opened });
  };

  // ── Position helpers ─────────────────────────────────────────────────────────
  private isLastPosition(step: ChatStep): boolean {
    const { renderedSteps } = this.state;
    const idx = renderedSteps.map(s => s.key).indexOf(step.key);
    if (renderedSteps.length <= 1 || idx + 1 === renderedSteps.length) return true;
    const next = renderedSteps[idx + 1];
    if (!next.message && !next.asMessage) return true;
    return step.user !== next.user;
  }

  private isFirstPosition(step: ChatStep): boolean {
    const { renderedSteps } = this.state;
    const idx = renderedSteps.map(s => s.key).indexOf(step.key);
    if (idx === 0) return true;
    const prev = renderedSteps[idx - 1];
    if (!prev.message && !prev.asMessage) return true;
    return step.user !== prev.user;
  }

  // ── renderStep ───────────────────────────────────────────────────────────────
  private renderStep = (step: ChatStep, index: number) => {
    const { renderedSteps } = this.state;
    const {
      avatarStyle = {}, bubbleStyle = {}, bubbleOptionStyle = {},
      customStyle = {}, hideBotAvatar = false, hideUserAvatar = false,
    } = this.props;
    const previousStep = index > 0 ? renderedSteps[index - 1] : ({} as ChatStep);
    const steps = this.generateRenderedStepsById();

    if (step.component && !step.asMessage) {
      return (
        <CustomStep
          key={index}
          speak={this.speak}
          step={step}
          steps={steps}
          style={customStyle}
          previousStep={previousStep}
          previousValue={previousStep.value ?? ''}
          triggerNextStep={this.triggerNextStep}
        />
      );
    }

    if (step.options) {
      return (
        <OptionsStep
          key={index}
          step={step}
          previousValue={previousStep.value ?? ''}
          triggerNextStep={this.triggerNextStep}
          bubbleOptionStyle={bubbleOptionStyle}
        />
      );
    }

    return (
      <TextStep
        key={index}
        step={step}
        steps={steps}
        speak={this.speak}
        previousStep={previousStep}
        previousValue={previousStep.value ?? ''}
        triggerNextStep={this.triggerNextStep}
        avatarStyle={avatarStyle}
        bubbleStyle={bubbleStyle}
        hideBotAvatar={hideBotAvatar}
        hideUserAvatar={hideUserAvatar}
        isFirst={this.isFirstPosition(step)}
        isLast={this.isLastPosition(step)}
      />
    );
  };

  // ── render ───────────────────────────────────────────────────────────────────
  render() {
    const { currentStep, disabled, inputInvalid, inputValue, opened, renderedSteps, speaking, recognitionEnable } = this.state;
    const {
      className = '', contentStyle, extraControl, controlStyle,
      floating, floatingIcon, floatingStyle = {}, footerStyle,
      headerComponent, headerTitle, hideHeader, hideSubmitButton,
      inputStyle, placeholder, inputAttributes, recognitionPlaceholder,
      style, submitButtonStyle, width, height,
    } = this.props;

    const header = headerComponent ?? (
      <Header className="rsc-header">
        <HeaderTitle id={floating ? 'sipedas-chat-title' : undefined} className="rsc-header-title">
          {headerTitle}
        </HeaderTitle>
        {floating && (
          <HeaderIcon
            className="rsc-header-close-button"
            onClick={() => this.toggleChatBot(false)}
            aria-label="Tutup chat"
          >
            <CloseIcon />
          </HeaderIcon>
        )}
      </Header>
    );

    let customControl: React.ReactElement | undefined;
    if (extraControl) {
      customControl = React.cloneElement(extraControl, { disabled, speaking, invalid: inputInvalid });
    }

    const icon = (this.isInputValueEmpty() || speaking) && recognitionEnable ? <MicIcon /> : <SubmitIcon />;
    const inputPlaceholder = speaking ? recognitionPlaceholder : (currentStep.placeholder ?? placeholder);
    const inputAttrsOverride = currentStep.inputAttributes ?? inputAttributes;

    return (
      <div className={`rsc ${className}`}>
        {floating && (
          <FloatButton
            className="rsc-float-button"
            style={floatingStyle as React.CSSProperties}
            opened={opened}
            onClick={() => this.toggleChatBot(true)}
            aria-label="Buka asisten SIPEDAS"
            aria-expanded={opened}
            aria-haspopup="dialog"
          >
            {typeof floatingIcon === 'string' ? <FloatingIcon src={floatingIcon} /> : floatingIcon}
          </FloatButton>
        )}

        <ChatBotContainer
          id={floating ? 'sipedas-chat-dialog' : undefined}
          className="rsc-container"
          floating={floating}
          floatingStyle={floatingStyle}
          opened={opened}
          style={style}
          width={width}
          height={height}
          role={floating ? 'dialog' : undefined}
          aria-modal={floating ? true : undefined}
          aria-labelledby={floating ? 'sipedas-chat-title' : undefined}
          aria-hidden={floating ? !opened : undefined}
        >
          {!hideHeader && header}

          <Content
            className="rsc-content"
            ref={(el: HTMLDivElement | null) => { this.content = el; }}
            floating={floating}
            style={contentStyle}
            height={height}
            hideInput={currentStep.hideInput}
          >
            {renderedSteps.map(this.renderStep)}
          </Content>

          <Footer className="rsc-footer" style={footerStyle}>
            {!currentStep.hideInput && (
              <Input
                style={inputStyle}
                ref={(el: HTMLInputElement | null) => { this.input = el; }}
                className="rsc-input"
                placeholder={inputInvalid ? '' : inputPlaceholder}
                onKeyPress={this.handleKeyPress}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => this.setState({ inputValue: e.target.value })}
                value={inputValue}
                floating={floating}
                invalid={inputInvalid}
                disabled={disabled}
                hasButton={!hideSubmitButton}
                {...(inputAttrsOverride as object)}
              />
            )}
            <div style={controlStyle} className="rsc-controls">
              {!currentStep.hideInput && !currentStep.hideExtraControl && customControl}
              {!currentStep.hideInput && !hideSubmitButton && (
                <SubmitButton
                  className="rsc-submit-button"
                  style={submitButtonStyle}
                  onClick={this.handleSubmitButton}
                  invalid={inputInvalid}
                  disabled={disabled}
                  speaking={speaking}
                >
                  {icon}
                </SubmitButton>
              )}
            </div>
          </Footer>
        </ChatBotContainer>
      </div>
    );
  }
}

export default ChatBot;
