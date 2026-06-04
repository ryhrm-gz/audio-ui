import { resolveFineControlFactor } from "../shared/range.ts";
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
  const dragFactorX = dragOptions.fine ? resolveFineControlFactor(dragOptions.fineFactorX) : 1;
  const dragFactorY = dragOptions.fine ? resolveFineControlFactor(dragOptions.fineFactorY) : 1;
  const width = getValidSize(drag.areaWidth);
  const height = getValidSize(drag.areaHeight);
  const startPercent = getXYPadPercent(drag.startValue, resolvedOptions);
  const nextPercent = {
    x: startPercent.x + ((drag.pointX - drag.startPointX) / width) * dragFactorX,
    y: startPercent.y + ((drag.startPointY - drag.pointY) / height) * dragFactorY,
  };

  return getXYPadValueFromPercent(nextPercent, resolvedOptions);
}

function clampPercent(percent: number) {
  return Math.min(Math.max(percent, 0), 1);
}

function getValidSize(size: number) {
  return Number.isFinite(size) && size > 0 ? size : defaultXYPadOptions.maxX;
}
