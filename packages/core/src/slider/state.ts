import type { RangeValueOptions } from "../shared/range.ts";
import { resolveSliderOptions } from "./options.ts";
import type { SliderOptions, SliderState } from "./types.ts";
import {
  getSliderOriginPercent,
  getSliderPercent,
  getSliderRangePercents,
  normalizeSliderValue,
} from "./value.ts";

export function createSliderState(
  value: number,
  options: SliderOptions & RangeValueOptions = {},
): SliderState {
  const resolvedOptions = resolveSliderOptions(options);
  const normalizedValue = normalizeSliderValue(value, {
    ...resolvedOptions,
    valueStep: options.valueStep,
  });
  const percent = getSliderPercent(normalizedValue, resolvedOptions);
  const originPercent = getSliderOriginPercent(resolvedOptions.origin);

  return {
    ...resolvedOptions,
    value: normalizedValue,
    percent,
    originPercent,
    ...getSliderRangePercents(percent, originPercent),
  };
}
