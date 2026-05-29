import type { FaderScalePoint } from "./types.ts";

interface FaderScaleRange {
  min: number;
  max: number;
  unity: number;
}

export const defaultFaderScale = [
  { value: -60, percent: 0, label: "-inf" },
  { value: -50, percent: 0.08, label: "-50" },
  { value: -40, percent: 0.16, label: "-40" },
  { value: -30, percent: 0.26, label: "-30" },
  { value: -20, percent: 0.39, label: "-20" },
  { value: -10, percent: 0.56, label: "-10" },
  { value: -5, percent: 0.68, label: "-5" },
  { value: 0, percent: 0.78, label: "0" },
  { value: 5, percent: 0.89, label: "+5" },
  { value: 10, percent: 0.97, label: "+10" },
  { value: 12, percent: 1, label: "+12" },
] satisfies readonly FaderScalePoint[];

export function resolveFaderScale(
  scale: readonly FaderScalePoint[] | undefined,
  range: FaderScaleRange,
) {
  const source = scale ?? defaultFaderScale;
  const points: FaderScalePoint[] = [
    { value: range.min, percent: 0, label: getEndpointLabel(range.min) },
    { value: range.max, percent: 1, label: formatFaderScaleLabel(range.max) },
  ];

  if (range.unity > range.min && range.unity < range.max) {
    points.push({ value: range.unity, percent: getUnityPercent(source, range.unity), label: "0" });
  }

  points.push(
    ...source
      .filter((point) => isFiniteNumber(point.value) && isFiniteNumber(point.percent))
      .map((point) => ({
        value: clamp(point.value, range.min, range.max),
        percent: clamp(point.percent, 0, 1),
        label: point.label,
      })),
  );

  const sortedPoints = points.sort((left, right) => left.value - right.value);
  const resolvedPoints: FaderScalePoint[] = [];
  let lastValue: number | undefined;
  let lastPercent = -Infinity;

  for (const point of sortedPoints) {
    if (lastValue === point.value) {
      resolvedPoints[resolvedPoints.length - 1] = point;
      lastPercent = point.percent;
      continue;
    }

    if (point.percent < lastPercent) {
      continue;
    }

    resolvedPoints.push({
      ...point,
      label: point.label ?? formatFaderScaleLabel(point.value),
    });
    lastValue = point.value;
    lastPercent = point.percent;
  }

  return resolvedPoints;
}

export function getFaderPercentFromScale(value: number, scale: readonly FaderScalePoint[]) {
  return interpolateScale(value, scale, "value", "percent");
}

export function getFaderValueFromScale(percent: number, scale: readonly FaderScalePoint[]) {
  return interpolateScale(percent, scale, "percent", "value");
}

function interpolateScale(
  input: number,
  scale: readonly FaderScalePoint[],
  inputKey: "value" | "percent",
  outputKey: "value" | "percent",
) {
  if (scale.length === 0) {
    return 0;
  }

  const sortedScale = [...scale].sort((left, right) => left[inputKey] - right[inputKey]);
  const firstPoint = sortedScale[0]!;
  const lastPoint = sortedScale[sortedScale.length - 1]!;

  if (input <= firstPoint[inputKey]) {
    return firstPoint[outputKey];
  }

  if (input >= lastPoint[inputKey]) {
    return lastPoint[outputKey];
  }

  for (let index = 1; index < sortedScale.length; index += 1) {
    const lowerPoint = sortedScale[index - 1]!;
    const upperPoint = sortedScale[index]!;

    if (input > upperPoint[inputKey]) {
      continue;
    }

    const span = upperPoint[inputKey] - lowerPoint[inputKey];
    const localPercent = span === 0 ? 0 : (input - lowerPoint[inputKey]) / span;
    return lowerPoint[outputKey] + (upperPoint[outputKey] - lowerPoint[outputKey]) * localPercent;
  }

  return lastPoint[outputKey];
}

function getUnityPercent(source: readonly FaderScalePoint[], unity: number) {
  const unityPoint = source.find((point) => point.value === unity);
  return unityPoint?.percent ?? 0.78;
}

function getEndpointLabel(value: number) {
  return value === defaultFaderScale[0].value
    ? defaultFaderScale[0].label
    : formatFaderScaleLabel(value);
}

function formatFaderScaleLabel(value: number) {
  if (value > 0) {
    return `+${value}`;
  }

  return String(value);
}

function isFiniteNumber(value: number) {
  return Number.isFinite(value);
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}
