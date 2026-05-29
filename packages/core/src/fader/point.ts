import { defaultFaderOptions, resolveFaderOptions } from "./options.ts";
import type { FaderOptions, FaderPoint } from "./types.ts";
import { getFaderValueFromPercent } from "./value.ts";

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

function getValidSize(size: number) {
  return Number.isFinite(size) && size > 0 ? size : defaultFaderOptions.max;
}
