import { resolveKnobOptions } from "./options.ts";
import type { KnobRange } from "./types.ts";

export function clampValue(value: number, options: KnobRange = {}) {
  const { min, max } = resolveKnobOptions(options);
  return Math.min(Math.max(value, min), max);
}

export function snapValueToStep(value: number, options: KnobRange = {}) {
  const { min, max, step } = resolveKnobOptions(options);
  const steppedValue = Math.round((value - min) / step) * step + min;
  const precision = getDecimalPrecision(step);
  return clampValue(Number(steppedValue.toFixed(precision)), { min, max, step });
}

export function normalizeKnobValue(value: number, options: KnobRange = {}) {
  const { min, max, step } = resolveKnobOptions(options);
  return snapValueToStep(value, { min, max, step });
}

export function getKnobPercent(value: number, options: KnobRange = {}) {
  const { min, max } = resolveKnobOptions(options);
  const span = max - min;

  if (span === 0) {
    return 0;
  }

  return (clampValue(value, { min, max }) - min) / span;
}

export function getKnobValueFromPercent(percent: number, options: KnobRange = {}) {
  const { min, max, step } = resolveKnobOptions(options);
  const clampedPercent = Math.min(Math.max(percent, 0), 1);
  return normalizeKnobValue(min + (max - min) * clampedPercent, { min, max, step });
}

function getDecimalPrecision(value: number) {
  const valueText = value.toString();
  const decimalIndex = valueText.indexOf(".");

  if (decimalIndex === -1) {
    return 0;
  }

  return valueText.length - decimalIndex - 1;
}
