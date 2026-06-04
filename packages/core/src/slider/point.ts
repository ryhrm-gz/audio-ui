import { defaultSliderOptions, resolveSliderOptions } from "./options.ts";
import type {
  SliderDragOptions,
  SliderLinearDrag,
  SliderOptions,
  SliderPoint,
  SliderThumbIndex,
  SliderValue,
} from "./types.ts";
import { getClosestSliderThumbIndex, getSliderValueFromPercent } from "./value.ts";
import { getRangePercent, resolveFineControlFactor } from "../shared/range.ts";

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

export function getSliderValueFromPoint(
  point: SliderPoint,
  value: readonly number[],
  activeThumb: SliderThumbIndex,
  options: SliderOptions = {},
): SliderValue {
  const percent = getSliderPercentFromPoint(point, options);
  return getSliderValueFromPercent(percent, value, activeThumb, options);
}

export function getSliderValueFromLinearDrag(
  drag: SliderLinearDrag,
  value: readonly number[],
  activeThumb: SliderThumbIndex,
  options: SliderOptions = {},
  dragOptions: SliderDragOptions = {},
): SliderValue {
  const resolvedOptions = resolveSliderOptions(options);
  const dragFactor = dragOptions.fine ? resolveFineControlFactor(dragOptions.fineFactor) : 1;
  const trackSize =
    resolvedOptions.orientation === "vertical"
      ? getValidSize(drag.trackHeight)
      : getValidSize(drag.trackWidth);
  const pointDelta =
    resolvedOptions.orientation === "vertical"
      ? drag.startPointY - drag.pointY
      : drag.pointX - drag.startPointX;
  const direction = resolvedOptions.inverted ? -1 : 1;
  const deltaPercent = (pointDelta / trackSize) * direction * dragFactor;
  const nextPercent = getRangePercent(drag.startValue, resolvedOptions) + deltaPercent;

  return getSliderValueFromPercent(nextPercent, value, activeThumb, resolvedOptions);
}

export function getClosestSliderThumbIndexFromPoint(
  point: SliderPoint,
  value: readonly number[],
  options: SliderOptions = {},
) {
  return getClosestSliderThumbIndex(value, getSliderPercentFromPoint(point, options), options);
}

function getValidSize(size: number) {
  return Number.isFinite(size) && size > 0 ? size : defaultSliderOptions.max;
}
