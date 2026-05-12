'use client';
import React, { Component } from 'react';
import {
  TextStepContainer, Bubble, AvatarImage, ImageContainer,
  OptionsStepContainer, OptionsList, OptionItem, OptionButton,
  CustomStepContainer, LoadingDot,
} from './styled-components';
import type { ChatStep, RenderedStep } from './types';

// ─── Loading indicator ────────────────────────────────────────────────────────
export const Loading: React.FC = () => (
  <span className="rsc-loading">
    <LoadingDot delay="0s">.</LoadingDot>
    <LoadingDot delay=".2s">.</LoadingDot>
    <LoadingDot delay=".4s">.</LoadingDot>
  </span>
);

// ─── TextStep ─────────────────────────────────────────────────────────────────
interface TextStepProps {
  step: ChatStep;
  steps: Record<string, RenderedStep>;
  previousStep: ChatStep;
  previousValue: string;
  isFirst: boolean;
  isLast: boolean;
  avatarStyle: React.CSSProperties;
  bubbleStyle: React.CSSProperties;
  hideBotAvatar: boolean;
  hideUserAvatar: boolean;
  speak: (step: ChatStep, prev: string) => void;
  triggerNextStep: (data?: { trigger?: string; value?: string }) => void;
  speechSynthesis?: { enable: boolean };
}

interface TextStepState { loading: boolean }

export class TextStep extends Component<TextStepProps, TextStepState> {
  state: TextStepState = { loading: true };

  static defaultProps = {
    previousStep: {},
    previousValue: '',
    speak: () => {},
    steps: {},
  };

  componentDidMount() {
    const { step, speak, previousValue, triggerNextStep } = this.props;
    const { component, delay, waitAction } = step;

    setTimeout(() => {
      this.setState({ loading: false }, () => {
        if (!(component && waitAction) && !step.rendered) triggerNextStep();
        speak(step, previousValue);
      });
    }, delay);
  }

  private getMessage(): string {
    const { previousValue, step } = this.props;
    return step.message ? step.message.replace(/{previousValue}/g, previousValue) : '';
  }

  private renderMessage(): React.ReactNode {
    const { step, steps, previousStep, triggerNextStep } = this.props;
    if (step.component) {
      return React.cloneElement(step.component, { step, steps, previousStep, triggerNextStep });
    }
    return this.getMessage();
  }

  render() {
    const { step, isFirst, isLast, avatarStyle, bubbleStyle, hideBotAvatar, hideUserAvatar } = this.props;
    const { loading } = this.state;
    const { avatar, user, botName } = step;
    const showAvatar = user ? !hideUserAvatar : !hideBotAvatar;

    return (
      <TextStepContainer className={`rsc-ts ${user ? 'rsc-ts-user' : 'rsc-ts-bot'}`} user={user}>
        <ImageContainer className="rsc-ts-image-container" user={user}>
          {isFirst && showAvatar && (
            <AvatarImage
              className="rsc-ts-image"
              style={avatarStyle}
              user={user}
              src={avatar}
              alt={user ? 'Your avatar' : `${botName ?? 'Bot'}'s avatar`}
            />
          )}
        </ImageContainer>
        <Bubble
          className="rsc-ts-bubble"
          style={bubbleStyle}
          user={user}
          showAvatar={showAvatar}
          isFirst={isFirst}
          isLast={isLast}
        >
          {loading ? <Loading /> : this.renderMessage()}
        </Bubble>
      </TextStepContainer>
    );
  }
}

// ─── OptionsStep ──────────────────────────────────────────────────────────────
interface OptionsStepProps {
  step: ChatStep;
  previousValue: string;
  bubbleOptionStyle: React.CSSProperties;
  triggerNextStep: (data: { value: string }) => void;
}

export class OptionsStep extends Component<OptionsStepProps> {
  private onOptionClick = ({ value }: { value: string }) => {
    this.props.triggerNextStep({ value });
  };

  render() {
    const { step, bubbleOptionStyle } = this.props;
    const { options = [] } = step;

    return (
      <OptionsStepContainer className="rsc-os">
        <OptionsList className="rsc-os-options">
          {options.map(opt => (
            <OptionItem key={opt.value} className="rsc-os-option">
              <OptionButton
                className="rsc-os-option-element"
                style={bubbleOptionStyle}
                onClick={() => this.onOptionClick({ value: opt.value })}
              >
                {opt.label}
              </OptionButton>
            </OptionItem>
          ))}
        </OptionsList>
      </OptionsStepContainer>
    );
  }
}

// ─── CustomStep ───────────────────────────────────────────────────────────────
interface CustomStepProps {
  step: ChatStep;
  steps: Record<string, RenderedStep>;
  previousStep: ChatStep;
  previousValue: string;
  style: React.CSSProperties;
  speak: (step: ChatStep, prev: string) => void;
  triggerNextStep: (data?: { trigger?: string; value?: string }) => void;
}

interface CustomStepState { loading: boolean }

export class CustomStep extends Component<CustomStepProps, CustomStepState> {
  state: CustomStepState = { loading: true };

  static defaultProps = { previousValue: '', speak: () => {} };

  componentDidMount() {
    const { speak, step, previousValue, triggerNextStep } = this.props;
    const { delay, waitAction } = step;

    setTimeout(() => {
      this.setState({ loading: false }, () => {
        if (!waitAction && !step.rendered) triggerNextStep();
        speak(step, previousValue);
      });
    }, delay);
  }

  render() {
    const { loading } = this.state;
    const { step, steps, previousStep, triggerNextStep, style } = this.props;

    return (
      <CustomStepContainer className="rsc-cs" style={style}>
        {loading ? (
          <Loading />
        ) : (
          step.component
            ? React.cloneElement(step.component, { step, steps, previousStep, triggerNextStep })
            : null
        )}
      </CustomStepContainer>
    );
  }
}
