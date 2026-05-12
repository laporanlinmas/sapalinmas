'use client';
import React from 'react';
import styled, { css } from 'styled-components';
import { defaultTheme } from './theme';
import { loading, scale, invalidInput, pulse } from './animations';
import type { ChatTheme, FloatingStyle } from './types';

// ─── Prop interfaces for styled components ────────────────────────────────────
interface ContainerProps {
  floating?: boolean;
  floatingStyle?: FloatingStyle;
  opened?: boolean;
  width?: string;
  height?: string;
  theme?: ChatTheme;
}
interface ContentProps  { floating?: boolean; height?: string; hideInput?: boolean; }
interface FloatProps    { opened?: boolean; theme?: ChatTheme }
interface BubbleProps   { user?: boolean; isFirst?: boolean; isLast?: boolean; showAvatar?: boolean; theme?: ChatTheme }
interface InputProps    { invalid?: boolean; disabled?: boolean; hasButton?: boolean; floating?: boolean }
interface SubmitProps   { speaking?: boolean; invalid?: boolean; disabled?: boolean; theme?: ChatTheme }
interface LoadStepProps { delay?: string }

// ─── Layout ───────────────────────────────────────────────────────────────────
export const ChatBotContainer = styled.div<ContainerProps>`
  background: ${({ theme }) => theme.background};
  border-radius: 10px;
  box-shadow: 0 12px 24px 0 rgba(0,0,0,0.15);
  font-family: ${({ theme }) => theme.fontFamily};
  overflow: hidden;
  position: ${({ floating }) => (floating ? 'fixed' : 'relative')};
  bottom: ${({ floating, floatingStyle }) => floating ? (floatingStyle?.bottom ?? '32px') : 'initial'};
  top:    ${({ floating, floatingStyle }) => floating ? (floatingStyle?.top    ?? 'initial') : 'initial'};
  right:  ${({ floating, floatingStyle }) => floating ? (floatingStyle?.right  ?? '32px') : 'initial'};
  left:   ${({ floating, floatingStyle }) => floating ? (floatingStyle?.left   ?? 'initial') : 'initial'};
  width:  ${({ width })  => width};
  height: ${({ height }) => height};
  z-index: 999;
  transform: ${({ opened }) => (opened ? 'scale(1)' : 'scale(0)')};
  transform-origin: ${({ floatingStyle }) => floatingStyle?.transformOrigin ?? 'bottom right'};
  transition: transform 0.3s ease;

  @media screen and (max-width: 568px) {
    border-radius: ${({ floating }) => (floating ? '0' : '')};
    bottom: 0 !important;
    left: initial !important;
    height: 100%;
    right: 0 !important;
    top: initial !important;
    width: 100%;
  }
`;
ChatBotContainer.defaultProps = { theme: defaultTheme };

export const Content = styled.div<ContentProps>`
  height: calc(${p => p.height} - ${p => (p.hideInput ? '56px' : '112px')});
  overflow-y: scroll;
  margin-top: 2px;
  padding-top: 6px;
  @media screen and (max-width: 568px) {
    height: ${p => (p.floating ? 'calc(100% - 112px)' : '')};
  }
`;

export const Header = styled.div`
  align-items: center;
  background: ${({ theme }: { theme?: ChatTheme }) => theme?.headerBgColor};
  color: ${({ theme }: { theme?: ChatTheme }) => theme?.headerFontColor};
  display: flex;
  fill: ${({ theme }: { theme?: ChatTheme }) => theme?.headerFontColor};
  height: 56px;
  justify-content: space-between;
  padding: 0 10px;
`;
Header.defaultProps = { theme: defaultTheme };

export const HeaderTitle = styled.h2`
  margin: 0;
  font-size: ${({ theme }: { theme?: ChatTheme }) => theme?.headerFontSize};
`;
HeaderTitle.defaultProps = { theme: defaultTheme };

export const HeaderIcon = styled.button.attrs({ type: 'button' as const })`
  cursor: pointer;
  border: 0; padding: 0; margin: 0;
  background: transparent;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: inherit;
  fill: inherit;
  &:focus-visible { outline: 2px solid currentColor; outline-offset: 2px; border-radius: 4px; }
`;

export const Footer = styled.div`position: relative;`;

export const FloatButton = styled.button.attrs({ type: 'button' as const })<FloatProps>`
  align-items: center;
  appearance: none;
  border: 0; padding: 0; margin: 0;
  cursor: pointer;
  background: ${({ theme }) => theme?.headerBgColor ?? '#6e48aa'};
  bottom: 32px;
  border-radius: 100%;
  box-shadow: 0 12px 24px 0 rgba(0,0,0,0.15);
  display: flex;
  fill: ${({ theme }) => theme?.headerFontColor ?? '#fff'};
  height: 56px;
  justify-content: center;
  position: fixed;
  right: 32px;
  transform: ${p => (p.opened ? 'scale(0)' : 'scale(1)')};
  transition: transform 0.3s ease;
  width: 56px;
  z-index: 999;
  &:focus-visible { outline: 3px solid #fff; outline-offset: 3px; }
`;
FloatButton.defaultProps = { theme: defaultTheme };

export const FloatingIcon = styled.img`height: 24px; width: 24px;`;

// ─── Input & Submit ───────────────────────────────────────────────────────────
export const Input = styled.input<InputProps>`
  animation: ${p => p.invalid ? css`${invalidInput} .2s ease` : ''};
  border: 0;
  border-radius: 0;
  border-bottom-left-radius: 10px;
  border-bottom-right-radius: 10px;
  border-top: ${p => (p.invalid ? '0' : '1px solid #eee')};
  box-shadow: ${p => (p.invalid ? 'inset 0 0 2px #E53935' : 'none')};
  box-sizing: border-box;
  color: ${p => (p.invalid ? '#E53935' : '')};
  font-size: 16px;
  opacity: ${p => (p.disabled && !p.invalid ? '.5' : '1')};
  outline: none;
  padding: ${p => (p.hasButton ? '16px 52px 16px 10px' : '16px 10px')};
  width: 100%;
  -webkit-appearance: none;
  &:disabled { background: #fff; }
  @media screen and (max-width: 568px) {
    border-bottom-left-radius:  ${p => (p.floating ? '0' : '10px')};
    border-bottom-right-radius: ${p => (p.floating ? '0' : '10px')};
  }
`;

export const SubmitButton = styled.button<SubmitProps>`
  background-color: transparent;
  border: 0;
  border-bottom-right-radius: 10px;
  box-shadow: none;
  cursor: ${p => (p.disabled ? 'default' : 'pointer')};
  fill: ${p => p.speaking ? (p.theme?.headerBgColor ?? '#6e48aa') : p.invalid ? '#E53935' : '#4a4a4a'};
  opacity: ${p => (p.disabled && !p.invalid ? '.5' : '1')};
  outline: none;
  padding: 14px 16px 12px 16px;
  &:before {
    content: '';
    position: absolute;
    width: 23px; height: 23px;
    border-radius: 50%;
    animation: ${({ theme, speaking }) =>
      speaking ? css`${pulse(theme?.headerBgColor ?? '#6e48aa')} 2s ease infinite` : ''};
  }
  &:not(:disabled):hover { opacity: 0.7; }
`;
SubmitButton.defaultProps = { theme: defaultTheme };

// ─── Bubble & message layout ──────────────────────────────────────────────────
export const TextStepContainer = styled.div<{ user?: boolean }>`
  align-items: flex-end;
  display: flex;
  justify-content: ${p => (p.user ? 'flex-end' : 'flex-start')};
`;

export const Bubble = styled.div<BubbleProps>`
  animation: ${scale} 0.3s ease forwards;
  background: ${p => (p.user ? p.theme?.userBubbleColor : p.theme?.botBubbleColor)};
  border-radius: ${p => {
    const { isFirst, isLast, user } = p;
    if (!isFirst && !isLast) return user ? '18px 0 0 18px'    : '0 18px 18px 0px';
    if (!isFirst && isLast)  return user ? '18px 0 18px 18px' : '0 18px 18px 18px';
    return user ? '18px 18px 0 18px' : '18px 18px 18px 0';
  }};
  box-shadow: 0 1px 2px 0 rgba(0,0,0,0.15);
  color: ${p => (p.user ? p.theme?.userFontColor : p.theme?.botFontColor)};
  display: inline-block;
  font-size: 14px;
  max-width: 50%;
  margin: ${p => {
    const { isFirst, showAvatar, user } = p;
    if (!isFirst && showAvatar)  return user ? '-8px 46px 10px 0' : '-8px 0 10px 46px';
    if (!isFirst && !showAvatar) return user ? '-8px 0px 10px 0'  : '-8px 0 10px 0px';
    return '0 0 10px 0';
  }};
  overflow: hidden;
  position: relative;
  padding: 12px;
  transform: scale(0);
  transform-origin: ${p => {
    if (p.isFirst) return p.user ? 'bottom right' : 'bottom left';
    return p.user ? 'top right' : 'top left';
  }};
`;
Bubble.defaultProps = { theme: defaultTheme };

export const AvatarImage = styled.img<{ user?: boolean }>`
  animation: ${scale} 0.3s ease forwards;
  border-radius: ${p => (p.user ? '50% 50% 50% 0' : '50% 50% 0 50%')};
  box-shadow: rgba(0,0,0,0.15) 0px 1px 2px 0px;
  height: 40px;
  min-width: 40px;
  padding: 3px;
  transform: scale(0);
  transform-origin: ${p => (p.user ? 'bottom left' : 'bottom right')};
  width: 40px;
`;

export const ImageContainer = styled.div<{ user?: boolean }>`
  display: inline-block;
  order: ${p => (p.user ? '1' : '0')};
  padding: 6px;
`;

// ─── Options ──────────────────────────────────────────────────────────────────
export const OptionsStepContainer = styled.div``;

export const OptionsList = styled.ul`
  margin: 2px 0 12px 0;
  padding: 0 6px;
`;

export const OptionItem = styled.li`
  animation: ${scale} 0.3s ease forwards;
  cursor: pointer;
  display: inline-block;
  margin: 2px;
  transform: scale(0);
`;

export const OptionButton = styled.button<{ theme?: ChatTheme }>`
  background: ${({ theme }) => theme?.botBubbleColor ?? '#6e48aa'};
  border: 0;
  border-radius: 22px;
  box-shadow: 0 1px 2px 0 rgba(0,0,0,0.15);
  color: ${({ theme }) => theme?.botFontColor ?? '#fff'};
  display: inline-block;
  font-size: 14px;
  padding: 12px;
  cursor: pointer;
  &:hover { opacity: 0.7; }
  &:active, &:hover:focus { outline: none; }
`;
OptionButton.defaultProps = { theme: defaultTheme };

// ─── Custom step container ────────────────────────────────────────────────────
export const CustomStepContainer = styled.div`
  background: #fff;
  border-radius: 5px;
  box-shadow: rgba(0,0,0,0.15) 0px 1px 2px 0px;
  display: flex;
  justify-content: center;
  margin: 0 6px 10px 6px;
  padding: 16px;
`;

// ─── Loading dots ─────────────────────────────────────────────────────────────
export const LoadingDot = styled.span<LoadStepProps>`
  animation: ${loading} 1.4s infinite both;
  animation-delay: ${p => p.delay ?? '0s'};
`;

// ─── Icons (inline SVG React components) ─────────────────────────────────────
export const ChatIcon: React.FC = () => (
  <svg height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
    <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z" />
    <path d="M0 0h24v24H0z" fill="none" />
  </svg>
);

export const CloseIcon: React.FC = () => (
  <svg height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
    <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
    <path d="M0 0h24v24H0z" fill="none" />
  </svg>
);

export const SubmitIcon: React.FC<{ size?: number }> = ({ size = 20 }) => (
  <svg version="1.1" xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 500 500">
    <polygon points="0,497.25 535.5,267.75 0,38.25 0,216.75 382.5,267.75 0,318.75" />
  </svg>
);

export const MicIcon: React.FC<{ size?: number }> = ({ size = 20 }) => (
  <svg version="1.1" xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 400 400">
    <path d="M290.991,240.991c0,26.392-21.602,47.999-48.002,47.999h-11.529c-26.4,0-48.002-21.607-48.002-47.999V104.002c0-26.4,21.602-48.004,48.002-48.004h11.529c26.4,0,48.002,21.604,48.002,48.004V240.991z" />
    <path d="M342.381,209.85h-8.961c-4.932,0-8.961,4.034-8.961,8.961v8.008c0,50.26-37.109,91.001-87.361,91.001c-50.26,0-87.109-40.741-87.109-91.001v-8.008c0-4.927-4.029-8.961-8.961-8.961h-8.961c-4.924,0-8.961,4.034-8.961,8.961v8.008c0,58.862,40.229,107.625,96.07,116.362v36.966h-34.412c-4.932,0-8.961,4.039-8.961,8.971v17.922c0,4.923,4.029,8.961,8.961,8.961h104.688c4.926,0,8.961-4.038,8.961-8.961v-17.922c0-4.932-4.035-8.971-8.961-8.971h-34.43v-36.966c55.889-8.729,96.32-57.5,96.32-116.362v-8.008C351.342,213.884,347.303,209.85,342.381,209.85z" />
  </svg>
);
