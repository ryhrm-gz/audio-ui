export interface KnobRange {
  min?: number;
  max?: number;
  step?: number;
}

export interface KnobAngleRange {
  minAngle?: number;
  maxAngle?: number;
}

export interface KnobOptions extends KnobRange, KnobAngleRange {}

export type KnobDragMode = "radial" | "vertical" | "horizontal";

export interface KnobPoint {
  centerX: number;
  centerY: number;
  pointX: number;
  pointY: number;
}

export interface KnobLinearDrag {
  mode: Exclude<KnobDragMode, "radial">;
  startValue: number;
  startX: number;
  startY: number;
  pointX: number;
  pointY: number;
  trackSize: number;
}

export interface KnobState {
  value: number;
  min: number;
  max: number;
  step: number;
  minAngle: number;
  maxAngle: number;
  percent: number;
  angle: number;
}

export const defaultKnobOptions = {
  min: 0,
  max: 100,
  step: 1,
  minAngle: -135,
  maxAngle: 135,
} satisfies Required<KnobOptions>;

const fullTurn = 360;

export function resolveKnobOptions(options: KnobOptions = {}) {
  const min = options.min ?? defaultKnobOptions.min;
  const max = options.max ?? defaultKnobOptions.max;
  const step = options.step ?? defaultKnobOptions.step;
  const minAngle = options.minAngle ?? defaultKnobOptions.minAngle;
  const maxAngle = options.maxAngle ?? defaultKnobOptions.maxAngle;

  return {
    min: Math.min(min, max),
    max: Math.max(min, max),
    step: Number.isFinite(step) && step > 0 ? step : defaultKnobOptions.step,
    minAngle,
    maxAngle,
  };
}

export function clampValue(value: number, options: KnobRange = {}) {
  const { min, max } = resolveKnobOptions(options);
  return Math.min(Math.max(value, min), max);
}

export function snapValueToStep(value: number, options: KnobRange = {}) {
  const { min, max, step } = resolveKnobOptions(options);
  const steppedValue = Math.round((value - min) / step) * step + min;
  const precision = getDecimalPrecision(step);
  return clampValue(Number(steppedValue.toFixed(precision)), { min, max, step });
}

export function normalizeKnobValue(value: number, options: KnobRange = {}) {
  const { min, max, step } = resolveKnobOptions(options);
  return snapValueToStep(value, { min, max, step });
}

export function getKnobPercent(value: number, options: KnobRange = {}) {
  const { min, max } = resolveKnobOptions(options);
  const span = max - min;

  if (span === 0) {
    return 0;
  }

  return (clampValue(value, { min, max }) - min) / span;
}

export function getKnobValueFromPercent(percent: number, options: KnobRange = {}) {
  const { min, max, step } = resolveKnobOptions(options);
  const clampedPercent = Math.min(Math.max(percent, 0), 1);
  return normalizeKnobValue(min + (max - min) * clampedPercent, { min, max, step });
}

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

export function getKnobValueFromLinearDrag(drag: KnobLinearDrag, options: KnobRange = {}) {
  const { min, max, step } = resolveKnobOptions(options);
  const range = max - min;
  const trackSize =
    Number.isFinite(drag.trackSize) && drag.trackSize > 0 ? drag.trackSize : defaultKnobOptions.max;
  const delta = drag.mode === "vertical" ? drag.startY - drag.pointY : drag.pointX - drag.startX;
  const nextValue = drag.startValue + range * (delta / trackSize);

  return normalizeKnobValue(nextValue, { min, max, step });
}

export function createKnobState(value: number, options: KnobOptions = {}): KnobState {
  const resolvedOptions = resolveKnobOptions(options);
  const normalizedValue = normalizeKnobValue(value, resolvedOptions);

  return {
    ...resolvedOptions,
    value: normalizedValue,
    percent: getKnobPercent(normalizedValue, resolvedOptions),
    angle: getKnobAngle(normalizedValue, resolvedOptions),
  };
}

export function getNextKeyboardValue(value: number, key: string, options: KnobRange = {}) {
  const { min, max, step } = resolveKnobOptions(options);
  const largeStep = step * 10;

  switch (key) {
    case "ArrowUp":
    case "ArrowRight":
      return normalizeKnobValue(value + step, { min, max, step });
    case "ArrowDown":
    case "ArrowLeft":
      return normalizeKnobValue(value - step, { min, max, step });
    case "PageUp":
      return normalizeKnobValue(value + largeStep, { min, max, step });
    case "PageDown":
      return normalizeKnobValue(value - largeStep, { min, max, step });
    case "Home":
      return min;
    case "End":
      return max;
    default:
      return undefined;
  }
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

function getDecimalPrecision(value: number) {
  const valueText = value.toString();
  const decimalIndex = valueText.indexOf(".");

  if (decimalIndex === -1) {
    return 0;
  }

  return valueText.length - decimalIndex - 1;
}
