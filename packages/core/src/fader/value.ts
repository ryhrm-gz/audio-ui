import { normalizeRangeValue } from "../shared/range.ts";
import { resolveFaderOptions } from "./options.ts";
import { getFaderPercentFromScale, getFaderValueFromScale } from "./scale.ts";
import type { FaderOptions, FaderRange } from "./types.ts";

export function normalizeFaderValue(value: number, options: FaderRange = {}) {
  return normalizeRangeValue(value, options);
}

export function getFaderPercent(value: number, options: FaderOptions = {}) {
  const resolvedOptions = resolveFaderOptions(options);
  const normalizedValue = normalizeFaderValue(value, resolvedOptions);

  return getFaderPercentFromScale(normalizedValue, resolvedOptions.scale);
}

export function getFaderValueFromPercent(percent: number, options: FaderOptions = {}) {
  const resolvedOptions = resolveFaderOptions(options);
  const scaledValue = getFaderValueFromScale(percent, resolvedOptions.scale);

  return normalizeFaderValue(scaledValue, resolvedOptions);
}

export function getFaderGain(value: number, options: FaderOptions = {}) {
  const resolvedOptions = resolveFaderOptions(options);
  const normalizedValue = normalizeFaderValue(value, resolvedOptions);

  if (normalizedValue <= resolvedOptions.min) {
    return 0;
  }

  return 10 ** (normalizedValue / 20);
}

export function getFaderValueFromGain(gain: number, options: FaderOptions = {}) {
  if (!Number.isFinite(gain) || gain <= 0) {
    const resolvedOptions = resolveFaderOptions(options);
    return resolvedOptions.min;
  }

  return normalizeFaderValue(20 * Math.log10(gain), options);
}
