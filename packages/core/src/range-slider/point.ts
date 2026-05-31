import { defaultRangeSliderOptions, resolveRangeSliderOptions } from "./options.ts";
import type {
  RangeSliderOptions,
  RangeSliderPoint,
  RangeSliderThumbIndex,
  RangeSliderValue,
} from "./types.ts";
import { getClosestRangeSliderThumbIndex, getRangeSliderValueFromPercent } from "./value.ts";

export function getRangeSliderPercentFromPoint(
  point: RangeSliderPoint,
  options: RangeSliderOptions = {},
) {
  const { orientation, inverted } = resolveRangeSliderOptions(options);
  const trackSize =
    orientation === "vertical" ? getValidSize(point.trackHeight) : getValidSize(point.trackWidth);
  const rawPercent =
    orientation === "vertical"
      ? 1 - (point.pointY - point.trackY) / trackSize
      : (point.pointX - point.trackX) / trackSize;
  const percent = inverted ? 1 - rawPercent : rawPercent;

  return Math.min(Math.max(percent, 0), 1);
}

export function getRangeSliderValueFromPoint(
  point: RangeSliderPoint,
  value: readonly [number, number],
  activeThumb: RangeSliderThumbIndex,
  options: RangeSliderOptions = {},
): RangeSliderValue {
  const percent = getRangeSliderPercentFromPoint(point, options);
  return getRangeSliderValueFromPercent(percent, value, activeThumb, options);
}

export function getClosestRangeSliderThumbIndexFromPoint(
  point: RangeSliderPoint,
  value: readonly [number, number],
  options: RangeSliderOptions = {},
) {
  return getClosestRangeSliderThumbIndex(
    value,
    getRangeSliderPercentFromPoint(point, options),
    options,
  );
}

function getValidSize(size: number) {
  return Number.isFinite(size) && size > 0 ? size : defaultRangeSliderOptions.max;
}
