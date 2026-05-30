import {
  getRangePercent,
  getRangeValueFromPercent,
  normalizeRangeValue,
  type RangeValueOptions,
} from "../shared/range.ts";
import type { SliderOrigin, SliderRange } from "./types.ts";

export function normalizeSliderValue(value: number, options: SliderRange & RangeValueOptions = {}) {
  return normalizeRangeValue(value, options);
}

export function getSliderPercent(value: number, options: SliderRange = {}) {
  return getRangePercent(value, options);
}

export function getSliderOriginPercent(origin: SliderOrigin) {
  if (origin === "center") {
    return 0.5;
  }

  if (origin === "right") {
    return 1;
  }

  return 0;
}

export function getSliderRangePercents(valuePercent: number, originPercent: number) {
  const rangeStartPercent = Math.min(valuePercent, originPercent);
  const rangeEndPercent = Math.max(valuePercent, originPercent);

  return {
    rangeStartPercent,
    rangeEndPercent,
    rangeSizePercent: rangeEndPercent - rangeStartPercent,
  };
}

export function getSliderValueFromPercent(
  percent: number,
  options: SliderRange & RangeValueOptions = {},
) {
  return getRangeValueFromPercent(percent, options);
}
