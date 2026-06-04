import { defaultSliderOptions, resolveSliderOptions } from "./options.ts";
import type { SliderDragOptions, SliderLinearDrag, SliderOptions, SliderPoint } from "./types.ts";
import { getSliderPercent, getSliderValueFromPercent } from "./value.ts";
import { resolveFineControlFactor } from "../shared/range.ts";

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

export function getSliderValueFromLinearDrag(
  drag: SliderLinearDrag,
  options: SliderOptions = {},
  dragOptions: SliderDragOptions = {},
) {
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
  const nextPercent = getSliderPercent(drag.startValue, resolvedOptions) + deltaPercent;

  return getSliderValueFromPercent(nextPercent, resolvedOptions);
}

function getValidSize(size: number) {
  return Number.isFinite(size) && size > 0 ? size : defaultSliderOptions.max;
}
