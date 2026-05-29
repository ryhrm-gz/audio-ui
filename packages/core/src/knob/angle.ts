import { resolveKnobOptions } from "./options.ts";
import type { KnobOptions, KnobPoint } from "./types.ts";
import { getKnobPercent, getKnobValueFromPercent } from "./value.ts";

const fullTurn = 360;

export function getKnobAngle(value: number, options: KnobOptions = {}) {
  const { minAngle, maxAngle } = resolveKnobOptions(options);
  const percent = getKnobPercent(value, options);
  return minAngle + (maxAngle - minAngle) * percent;
}

export function getKnobValueFromAngle(angle: number, options: KnobOptions = {}) {
  const { minAngle, maxAngle } = resolveKnobOptions(options);
  const clampedAngle = clampAngleToRange(angle, minAngle, maxAngle);
  const angleSpan = maxAngle - minAngle;
  const percent = angleSpan === 0 ? 0 : (clampedAngle - minAngle) / angleSpan;

  return getKnobValueFromPercent(percent, options);
}

export function getKnobValueFromPoint(point: KnobPoint, options: KnobOptions = {}) {
  const angle = getAngleFromPoint(point);
  return getKnobValueFromAngle(angle, options);
}

export function getAngleFromPoint(point: KnobPoint) {
  const radians = Math.atan2(point.pointY - point.centerY, point.pointX - point.centerX);
  return normalizeAngle((radians * 180) / Math.PI + 90);
}

export function normalizeAngle(angle: number) {
  return ((((angle + 180) % fullTurn) + fullTurn) % fullTurn) - 180;
}

function clampAngleToRange(angle: number, minAngle: number, maxAngle: number) {
  const normalizedAngle = normalizeAngle(angle);

  if (normalizedAngle >= minAngle && normalizedAngle <= maxAngle) {
    return normalizedAngle;
  }

  return getAngleDistance(normalizedAngle, minAngle) < getAngleDistance(normalizedAngle, maxAngle)
    ? minAngle
    : maxAngle;
}

function getAngleDistance(angle: number, target: number) {
  const diff = Math.abs(normalizeAngle(angle - target));
  return Math.min(diff, fullTurn - diff);
}
