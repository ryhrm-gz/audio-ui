import {
  clampValue as clampRangeValue,
  getRangePercent,
  getRangeValueFromPercent,
  normalizeRangeValue,
  snapValueToStep as snapRangeValueToStep,
  type RangeValueOptions,
} from "../shared/range.ts";
import type { KnobRange } from "./types.ts";

export function clampValue(value: number, options: KnobRange = {}) {
  return clampRangeValue(value, options);
}

export function snapValueToStep(value: number, options: KnobRange & RangeValueOptions = {}) {
  return snapRangeValueToStep(value, options);
}

export function normalizeKnobValue(value: number, options: KnobRange & RangeValueOptions = {}) {
  return normalizeRangeValue(value, options);
}

export function getKnobPercent(value: number, options: KnobRange = {}) {
  return getRangePercent(value, options);
}

export function getKnobValueFromPercent(
  percent: number,
  options: KnobRange & RangeValueOptions = {},
) {
  return getRangeValueFromPercent(percent, options);
}
