import type { RangeValueOptions } from "../shared/range.ts";
import { resolveFaderOptions } from "./options.ts";
import type { FaderOptions, FaderState } from "./types.ts";
import { getFaderGain, getFaderPercent, normalizeFaderValue } from "./value.ts";

export function createFaderState(
  value: number,
  options: FaderOptions & RangeValueOptions = {},
): FaderState {
  const resolvedOptions = resolveFaderOptions(options);
  const normalizedValue = normalizeFaderValue(value, {
    ...resolvedOptions,
    valueStep: options.valueStep,
  });

  return {
    ...resolvedOptions,
    value: normalizedValue,
    percent: getFaderPercent(normalizedValue, resolvedOptions),
    unityPercent: getFaderPercent(resolvedOptions.unity, resolvedOptions),
    gain: getFaderGain(normalizedValue, resolvedOptions),
  };
}
