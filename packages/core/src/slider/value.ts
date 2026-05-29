import { getRangePercent, getRangeValueFromPercent, normalizeRangeValue } from "../shared/range.ts";
import type { SliderRange } from "./types.ts";

export function normalizeSliderValue(value: number, options: SliderRange = {}) {
  return normalizeRangeValue(value, options);
}

export function getSliderPercent(value: number, options: SliderRange = {}) {
  return getRangePercent(value, options);
}

export function getSliderValueFromPercent(percent: number, options: SliderRange = {}) {
  return getRangeValueFromPercent(percent, options);
}
