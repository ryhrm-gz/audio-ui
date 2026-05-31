import { getFineStep, getRangePercent } from "../shared/range.ts";
import { defaultRangeSliderOptions, resolveRangeSliderOptions } from "./options.ts";
import type {
  RangeSliderDragOptions,
  RangeSliderLinearDrag,
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

export function getRangeSliderValueFromLinearDrag(
  drag: RangeSliderLinearDrag,
  value: readonly [number, number],
  activeThumb: RangeSliderThumbIndex,
  options: RangeSliderOptions = {},
  dragOptions: RangeSliderDragOptions = {},
): RangeSliderValue {
  const resolvedOptions = resolveRangeSliderOptions(options);
  const valueStep = dragOptions.fine ? getFineStep(resolvedOptions.step) : resolvedOptions.step;
  const dragFactor = dragOptions.fine ? 0.1 : 1;
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

  return getRangeSliderValueFromPercent(nextPercent, value, activeThumb, {
    ...resolvedOptions,
    valueStep,
  });
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
