import { defaultSliderOptions, resolveSliderOptions } from "./options.ts";
import type { SliderOptions, SliderPoint } from "./types.ts";
import { getSliderValueFromPercent } from "./value.ts";

export function getSliderPercentFromPoint(point: SliderPoint, options: SliderOptions = {}) {
  const { orientation, inverted } = resolveSliderOptions(options);
  const trackSize =
    orientation === "vertical" ? getValidSize(point.trackHeight) : getValidSize(point.trackWidth);
  const rawPercent =
    orientation === "vertical"
      ? 1 - (point.pointY - point.trackY) / trackSize
      : (point.pointX - point.trackX) / trackSize;
  const percent = inverted ? 1 - rawPercent : rawPercent;

  return Math.min(Math.max(percent, 0), 1);
}

export function getSliderValueFromPoint(point: SliderPoint, options: SliderOptions = {}) {
  const percent = getSliderPercentFromPoint(point, options);
  return getSliderValueFromPercent(percent, options);
}

function getValidSize(size: number) {
  return Number.isFinite(size) && size > 0 ? size : defaultSliderOptions.max;
}
