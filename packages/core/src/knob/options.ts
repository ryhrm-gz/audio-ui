import type { KnobOptions } from "./types.ts";

export const defaultKnobOptions = {
  min: 0,
  max: 100,
  step: 1,
  minAngle: -135,
  maxAngle: 135,
} satisfies Required<KnobOptions>;

export function resolveKnobOptions(options: KnobOptions = {}) {
  const min = options.min ?? defaultKnobOptions.min;
  const max = options.max ?? defaultKnobOptions.max;
  const step = options.step ?? defaultKnobOptions.step;
  const minAngle = options.minAngle ?? defaultKnobOptions.minAngle;
  const maxAngle = options.maxAngle ?? defaultKnobOptions.maxAngle;

  return {
    min: Math.min(min, max),
    max: Math.max(min, max),
    step: Number.isFinite(step) && step > 0 ? step : defaultKnobOptions.step,
    minAngle,
    maxAngle,
  };
}
