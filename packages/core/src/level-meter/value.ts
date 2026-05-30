import { resolveLevelMeterOptions } from "./options.ts";
import type { LevelMeterOptions, LevelMeterValue } from "./types.ts";

export function normalizeLevelMeterValue(value: number, options: LevelMeterOptions = {}) {
  const resolvedOptions = resolveLevelMeterOptions(options);

  return clamp(resolveFinite(value, resolvedOptions.min), resolvedOptions.min, resolvedOptions.max);
}

export function normalizeLevelMeterValues(
  value: LevelMeterValue | undefined,
  options: LevelMeterOptions = {},
) {
  const resolvedOptions = resolveLevelMeterOptions(options);
  const values = Array.isArray(value) ? value : [value ?? resolvedOptions.min];
  const normalizedValues = values
    .slice(0, resolvedOptions.channels)
    .map((nextValue) => normalizeLevelMeterValue(nextValue, resolvedOptions));

  while (normalizedValues.length < resolvedOptions.channels) {
    normalizedValues.push(resolvedOptions.min);
  }

  return normalizedValues;
}

export function getLevelMeterPercent(value: number, options: LevelMeterOptions = {}) {
  const resolvedOptions = resolveLevelMeterOptions(options);
  const normalizedValue = normalizeLevelMeterValue(value, resolvedOptions);

  if (resolvedOptions.max === resolvedOptions.min) {
    return 0;
  }

  return (normalizedValue - resolvedOptions.min) / (resolvedOptions.max - resolvedOptions.min);
}

export function getLevelMeterDbFromAmplitude(amplitude: number, options: LevelMeterOptions = {}) {
  const resolvedOptions = resolveLevelMeterOptions(options);

  if (!Number.isFinite(amplitude) || amplitude <= 0) {
    return resolvedOptions.min;
  }

  return normalizeLevelMeterValue(20 * Math.log10(amplitude), resolvedOptions);
}

export function getLevelMeterAmplitudeFromDb(value: number, options: LevelMeterOptions = {}) {
  const normalizedValue = normalizeLevelMeterValue(value, options);

  return 10 ** (normalizedValue / 20);
}

function resolveFinite(value: number, fallback: number): number {
  return Number.isFinite(value) ? value : fallback;
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}
