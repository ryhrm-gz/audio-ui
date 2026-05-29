import { resolveSliderOptions } from "./options.ts";
import type { SliderOptions, SliderState } from "./types.ts";
import { getSliderPercent, normalizeSliderValue } from "./value.ts";

export function createSliderState(value: number, options: SliderOptions = {}): SliderState {
  const resolvedOptions = resolveSliderOptions(options);
  const normalizedValue = normalizeSliderValue(value, resolvedOptions);

  return {
    ...resolvedOptions,
    value: normalizedValue,
    percent: getSliderPercent(normalizedValue, resolvedOptions),
  };
}
