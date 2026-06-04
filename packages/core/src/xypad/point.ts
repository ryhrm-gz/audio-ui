import { getFineStep } from "../shared/range.ts";
import { defaultXYPadOptions, resolveXYPadOptions } from "./options.ts";
import type { XYPadDragOptions, XYPadLinearDrag, XYPadOptions, XYPadPoint } from "./types.ts";
import { getXYPadPercent, getXYPadValueFromPercent } from "./value.ts";

export function getXYPadPercentFromPoint(point: XYPadPoint) {
  const width = getValidSize(point.areaWidth);
  const height = getValidSize(point.areaHeight);
  const x = (point.pointX - point.areaX) / width;
  const y = 1 - (point.pointY - point.areaY) / height;

  return {
    x: clampPercent(x),
    y: clampPercent(y),
  };
}

export function getXYPadValueFromPoint(point: XYPadPoint, options: XYPadOptions = {}) {
  return getXYPadValueFromPercent(getXYPadPercentFromPoint(point), options);
}

export function getXYPadValueFromLinearDrag(
  drag: XYPadLinearDrag,
  options: XYPadOptions = {},
  dragOptions: XYPadDragOptions = {},
) {
  const resolvedOptions = resolveXYPadOptions(options);
  const dragFactor = dragOptions.fine ? 0.1 : 1;
  const width = getValidSize(drag.areaWidth);
  const height = getValidSize(drag.areaHeight);
  const startPercent = getXYPadPercent(drag.startValue, resolvedOptions);
  const nextPercent = {
    x: startPercent.x + ((drag.pointX - drag.startPointX) / width) * dragFactor,
    y: startPercent.y + ((drag.startPointY - drag.pointY) / height) * dragFactor,
  };

  return getXYPadValueFromPercent(nextPercent, {
    ...resolvedOptions,
    valueStepX: dragOptions.fine
      ? getFineStep(resolvedOptions.stepX, dragOptions.fineStepX)
      : undefined,
    valueStepY: dragOptions.fine
      ? getFineStep(resolvedOptions.stepY, dragOptions.fineStepY)
      : undefined,
  });
}

function clampPercent(percent: number) {
  return Math.min(Math.max(percent, 0), 1);
}

function getValidSize(size: number) {
  return Number.isFinite(size) && size > 0 ? size : defaultXYPadOptions.maxX;
}
