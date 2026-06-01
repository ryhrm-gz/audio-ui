import {
  getCompressorCurveInputFromPercent,
  getCompressorCurveInputPercent,
  getCompressorCurveOutputPercent,
} from "./db.ts";
import { resolveCompressorCurveOptions } from "./options.ts";
import { normalizeCompressorCurveValue } from "./value.ts";
import type {
  CompressorCurveOptions,
  CompressorCurvePoint,
  CompressorCurveValue,
} from "./types.ts";

export function getCompressorCurveOutput(input: number, value: CompressorCurveValue): number {
  const normalizedRatio = Math.max(1, value.ratio);
  const knee = Math.max(0, value.knee);
  const lowerKnee = value.threshold - knee / 2;
  const upperKnee = value.threshold + knee / 2;
  let output: number;

  if (knee === 0 || input <= lowerKnee) {
    output =
      input < value.threshold
        ? input
        : value.threshold + (input - value.threshold) / normalizedRatio;
  } else if (input >= upperKnee) {
    output = value.threshold + (input - value.threshold) / normalizedRatio;
  } else {
    const kneePosition = input - value.threshold + knee / 2;
    output = input + ((1 / normalizedRatio - 1) * (kneePosition * kneePosition)) / (2 * knee);
  }

  return output + value.makeupGain;
}

export function getCompressorCurvePoints(
  value: CompressorCurveValue,
  options: CompressorCurveOptions = {},
): CompressorCurvePoint[] {
  const resolvedOptions = resolveCompressorCurveOptions(options);
  const normalizedValue = normalizeCompressorCurveValue(value, resolvedOptions);
  const points: CompressorCurvePoint[] = [];

  for (let index = 0; index < resolvedOptions.curveResolution; index += 1) {
    const x =
      resolvedOptions.curveResolution === 1 ? 0 : index / (resolvedOptions.curveResolution - 1);
    const input = getCompressorCurveInputFromPercent(x, {
      ...resolvedOptions,
      stepThreshold: 0.000001,
    });
    const output = getCompressorCurveOutput(input, normalizedValue);

    points.push({
      input,
      output,
      x: getCompressorCurveInputPercent(input, resolvedOptions),
      y: getCompressorCurveOutputPercent(output, resolvedOptions),
    });
  }

  return points;
}

export function getCompressorCurvePath(points: CompressorCurvePoint[]) {
  return points
    .map(
      (point, index) =>
        `${index === 0 ? "M" : "L"} ${roundPath(point.x)} ${roundPath(1 - point.y)}`,
    )
    .join(" ");
}

function roundPath(value: number) {
  return Number(value.toFixed(6));
}
