import { normalizeRangeValue } from "../shared/range.ts";
import { resolveEQCurveOptions } from "./options.ts";
import type { EQCurveOptions, EQCurveValueOptions } from "./types.ts";

export function normalizeEQCurveFrequency(
  frequency: number,
  options: EQCurveOptions & EQCurveValueOptions = {},
) {
  const { minFrequency, maxFrequency, stepFrequency } = resolveEQCurveOptions(options);

  return normalizeRangeValue(frequency, {
    min: minFrequency,
    max: maxFrequency,
    step: stepFrequency,
    valueStep: options.valueStepFrequency,
  });
}

export function getEQCurveFrequencyPercent(frequency: number, options: EQCurveOptions = {}) {
  const { minFrequency, maxFrequency } = resolveEQCurveOptions(options);
  const logMin = Math.log(minFrequency);
  const logMax = Math.log(maxFrequency);
  const span = logMax - logMin;

  if (span === 0) {
    return 0;
  }

  const clampedFrequency = Math.min(Math.max(frequency, minFrequency), maxFrequency);
  return (Math.log(clampedFrequency) - logMin) / span;
}

export function getEQCurveFrequencyFromPercent(
  percent: number,
  options: EQCurveOptions & EQCurveValueOptions = {},
) {
  const { minFrequency, maxFrequency } = resolveEQCurveOptions(options);
  const clampedPercent = clampPercent(percent);
  const frequency = Math.exp(
    Math.log(minFrequency) + (Math.log(maxFrequency) - Math.log(minFrequency)) * clampedPercent,
  );

  return normalizeEQCurveFrequency(frequency, options);
}

function clampPercent(percent: number) {
  return Math.min(Math.max(percent, 0), 1);
}
