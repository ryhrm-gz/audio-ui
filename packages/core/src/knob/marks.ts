import { resolveKnobOptions } from "./options.ts";
import type { KnobMarkPoint, KnobOptions } from "./types.ts";
import { clampValue, getKnobPercent } from "./value.ts";
import { getKnobAngle } from "./angle.ts";

export function getKnobMarkPoint(value: number, options: KnobOptions = {}): KnobMarkPoint {
  const resolvedOptions = resolveKnobOptions(options);
  const resolvedValue = clampValue(value, resolvedOptions);
  const angle = getKnobAngle(resolvedValue, resolvedOptions);
  const angleRadians = (angle * Math.PI) / 180;

  return {
    value: resolvedValue,
    percent: getKnobPercent(resolvedValue, resolvedOptions),
    angle,
    x: Math.sin(angleRadians),
    y: -Math.cos(angleRadians),
  };
}

export function getKnobTickPoints(count: number, options: KnobOptions = {}): KnobMarkPoint[] {
  if (!Number.isFinite(count) || count <= 0) {
    return [];
  }

  const resolvedCount = Math.floor(count);
  const resolvedOptions = resolveKnobOptions(options);

  if (resolvedCount === 1) {
    return [getKnobMarkPoint(resolvedOptions.min, resolvedOptions)];
  }

  return Array.from({ length: resolvedCount }, (_, index) => {
    const percent = index / (resolvedCount - 1);
    const value = resolvedOptions.min + (resolvedOptions.max - resolvedOptions.min) * percent;
    return getKnobMarkPoint(value, resolvedOptions);
  });
}
