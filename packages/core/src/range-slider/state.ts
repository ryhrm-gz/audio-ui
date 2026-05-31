import { resolveRangeSliderOptions } from "./options.ts";
import type { RangeSliderOptions, RangeSliderState } from "./types.ts";
import {
  type RangeSliderValueOptions,
  getRangeSliderPercent,
  getRangeSliderRangePercents,
  getRangeSliderThumbBounds,
  normalizeRangeSliderValue,
} from "./value.ts";

export function createRangeSliderState(
  value: readonly [number, number],
  options: RangeSliderOptions & RangeSliderValueOptions = {},
): RangeSliderState {
  const resolvedOptions = resolveRangeSliderOptions(options);
  const normalizedValue = normalizeRangeSliderValue(value, {
    ...resolvedOptions,
    valueStep: options.valueStep,
    activeThumb: options.activeThumb,
  });
  const percent = getRangeSliderPercent(normalizedValue, resolvedOptions);
  const bounds = getRangeSliderThumbBounds(normalizedValue, resolvedOptions);

  return {
    ...resolvedOptions,
    value: normalizedValue,
    percent,
    ...getRangeSliderRangePercents(percent),
    thumbs: [
      {
        index: 0,
        value: normalizedValue[0],
        percent: percent[0],
        min: bounds[0].min,
        max: bounds[0].max,
      },
      {
        index: 1,
        value: normalizedValue[1],
        percent: percent[1],
        min: bounds[1].min,
        max: bounds[1].max,
      },
    ],
  };
}
