import { getFineStep } from "../shared/range.ts";
import { defaultFaderOptions, resolveFaderOptions } from "./options.ts";
import type { FaderDragOptions, FaderLinearDrag, FaderOptions, FaderPoint } from "./types.ts";
import { getFaderPercent, getFaderValueFromPercent } from "./value.ts";

export function getFaderPercentFromPoint(point: FaderPoint, options: FaderOptions = {}) {
  const { inverted } = resolveFaderOptions(options);
  const trackSize = getValidSize(point.trackHeight);
  const rawPercent = 1 - (point.pointY - point.trackY) / trackSize;
  const percent = inverted ? 1 - rawPercent : rawPercent;

  return Math.min(Math.max(percent, 0), 1);
}

export function getFaderValueFromPoint(point: FaderPoint, options: FaderOptions = {}) {
  const percent = getFaderPercentFromPoint(point, options);
  return getFaderValueFromPercent(percent, options);
}

export function getFaderValueFromLinearDrag(
  drag: FaderLinearDrag,
  options: FaderOptions = {},
  dragOptions: FaderDragOptions = {},
) {
  const resolvedOptions = resolveFaderOptions(options);
  const valueStep = dragOptions.fine ? getFineStep(resolvedOptions.step) : resolvedOptions.step;
  const dragFactor = dragOptions.fine ? 0.1 : 1;
  const trackSize = getValidSize(drag.trackHeight);
  const pointDelta = drag.startPointY - drag.pointY;
  const direction = resolvedOptions.inverted ? -1 : 1;
  const deltaPercent = (pointDelta / trackSize) * direction * dragFactor;
  const nextPercent = getFaderPercent(drag.startValue, resolvedOptions) + deltaPercent;

  return getFaderValueFromPercent(nextPercent, { ...resolvedOptions, valueStep });
}

function getValidSize(size: number) {
  return Number.isFinite(size) && size > 0 ? size : defaultFaderOptions.max;
}
