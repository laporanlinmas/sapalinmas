import { keyframes } from 'styled-components';
import { rgba } from './theme';

// ─── Keyframe animations ──────────────────────────────────────────────────────

export const loading = keyframes`
  0%   { opacity: .2; }
  20%  { opacity: 1;  }
  100% { opacity: .2; }
`;

export const scale = keyframes`
  100% { transform: scale(1); }
`;

export const invalidInput = keyframes`
  25%  { transform: rotate(-1deg); }
  100% { transform: rotate(1deg);  }
`;

export const pulse = (color: string) => keyframes`
  0%   { box-shadow: 0 0 0 0    ${rgba(color, 0.4)}; }
  70%  { box-shadow: 0 0 0 10px ${rgba(color, 0)};   }
  100% { box-shadow: 0 0 0 0    ${rgba(color, 0)};   }
`;
