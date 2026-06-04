import { resolveSliderOptions } from "./options.ts";
import type { SliderOptions, SliderState } from "./types.ts";
import {
  getSliderOriginPercent,
  getSliderPercent,
  getSliderThumbBounds,
  getSliderValueRangePercents,
  type SliderValueOptions,
  normalizeSliderValue,
} from "./value.ts";

export function createSliderState(
  value: readonly number[],
  options: SliderOptions & SliderValueOptions = {},
): SliderState {
  const resolvedOptions = resolveSliderOptions(options);
  const normalizedValue = normalizeSliderValue(value, {
    ...resolvedOptions,
    valueStep: options.valueStep,
    activeThumb: options.activeThumb,
  });
  const percent = getSliderPercent(normalizedValue, resolvedOptions);
  const originPercent = getSliderOriginPercent(resolvedOptions.origin);
  const bounds = getSliderThumbBounds(normalizedValue, resolvedOptions);

  return {
    ...resolvedOptions,
    value: normalizedValue,
    percent,
    originPercent,
    ...getSliderValueRangePercents(percent, originPercent),
    thumbs: normalizedValue.map((thumbValue, index) => ({
      index,
      value: thumbValue,
      percent: percent[index],
      min: bounds[index].min,
      max: bounds[index].max,
    })),
  };
}
