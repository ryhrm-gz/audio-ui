import { resolveFaderOptions } from "./options.ts";
import type { FaderOptions, FaderState } from "./types.ts";
import { getFaderGain, getFaderPercent, normalizeFaderValue } from "./value.ts";

export function createFaderState(value: number, options: FaderOptions = {}): FaderState {
  const resolvedOptions = resolveFaderOptions(options);
  const normalizedValue = normalizeFaderValue(value, resolvedOptions);

  return {
    ...resolvedOptions,
    value: normalizedValue,
    percent: getFaderPercent(normalizedValue, resolvedOptions),
    unityPercent: getFaderPercent(resolvedOptions.unity, resolvedOptions),
    gain: getFaderGain(normalizedValue, resolvedOptions),
  };
}
