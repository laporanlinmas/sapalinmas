import { stringify, parse } from 'flatted';
import type { ChatStep } from './types';

// ─── Types ────────────────────────────────────────────────────────────────────
interface StorageData {
  currentStep: ChatStep;
  previousStep: ChatStep;
  previousSteps: ChatStep[];
  renderedSteps: ChatStep[];
}

interface GetDataParams {
  cacheName: string;
  cache: boolean;
  firstStep: ChatStep;
  steps: Record<string, ChatStep>;
}

// ─── Read from localStorage ───────────────────────────────────────────────────
export function getData(params: GetDataParams, onCacheReady: () => void): StorageData {
  const { cacheName, cache, firstStep, steps } = params;

  const defaults: StorageData = {
    currentStep:   firstStep,
    previousStep:  {} as ChatStep,
    previousSteps: [steps[firstStep.id as string]],
    renderedSteps: [steps[firstStep.id as string]],
  };

  if (!cache) return defaults;

  const raw = typeof window !== 'undefined' ? localStorage.getItem(cacheName) : null;
  if (!raw) return defaults;

  try {
    const data: StorageData = parse(raw);
    const lastStep = data.renderedSteps[data.renderedSteps.length - 1];

    // Clear cache if conversation ended
    if (lastStep?.end) {
      localStorage.removeItem(cacheName);
      return defaults;
    }

    // Restore delays & rendered flags; re-attach components
    for (let i = 0; i < data.renderedSteps.length; i++) {
      data.renderedSteps[i].delay = 0;
      data.renderedSteps[i].rendered = true;
      if (data.renderedSteps[i].component) {
        const id = data.renderedSteps[i].id as string;
        data.renderedSteps[i].component = steps[id]?.component;
      }
    }

    const { trigger, end, options, id } = data.currentStep;

    if (options) delete data.currentStep.rendered;

    // Re-attach trigger functions
    if (!trigger && !end) {
      if (options) {
        for (let i = 0; i < options.length; i++) {
          options[i].trigger = steps[id as string]?.options?.[i]?.trigger;
        }
      } else {
        data.currentStep.trigger = steps[id as string]?.trigger;
      }
    }

    if (data.currentStep.user) onCacheReady();

    return data;
  } catch (err) {
    console.info(`Unable to parse cache '${cacheName}':`, err);
    return defaults;
  }
}

// ─── Write to localStorage ────────────────────────────────────────────────────
export function setData(cacheName: string, cachedData: StorageData): void {
  const data: StorageData = parse(stringify(cachedData));

  // Strip React components before serialising
  for (const key of Object.keys(data) as (keyof StorageData)[]) {
    const arr = data[key] as ChatStep[];
    if (!Array.isArray(arr)) continue;
    for (const step of arr) {
      if (step.component) step.component = step.id as unknown as React.ReactElement;
    }
  }

  localStorage.setItem(cacheName, stringify(data));
}
