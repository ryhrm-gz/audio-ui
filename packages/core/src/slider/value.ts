import {
  getRangePercent,
  getRangeValueFromPercent,
  normalizeRangeValue,
  type RangeValueOptions,
} from "../shared/range.ts";
import type { SliderRange } from "./types.ts";

export function normalizeSliderValue(value: number, options: SliderRange & RangeValueOptions = {}) {
  return normalizeRangeValue(value, options);
}

export function getSliderPercent(value: number, options: SliderRange = {}) {
  return getRangePercent(value, options);
}

export function getSliderValueFromPercent(
  percent: number,
  options: SliderRange & RangeValueOptions = {},
) {
  return getRangeValueFromPercent(percent, options);
}
