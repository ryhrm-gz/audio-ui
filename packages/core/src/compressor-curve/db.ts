import { normalizeRangeValue } from "../shared/range.ts";
import { resolveCompressorCurveOptions } from "./options.ts";
import type { CompressorCurveOptions } from "./types.ts";

export function getCompressorCurveInputPercent(
  input: number,
  options: CompressorCurveOptions = {},
) {
  const { minInput, maxInput } = resolveCompressorCurveOptions(options);

  return normalizePercent((input - minInput) / (maxInput - minInput));
}

export function getCompressorCurveInputFromPercent(
  percent: number,
  options: CompressorCurveOptions = {},
) {
  const resolvedOptions = resolveCompressorCurveOptions(options);
  const input =
    resolvedOptions.minInput +
    normalizePercent(percent) * (resolvedOptions.maxInput - resolvedOptions.minInput);

  return normalizeRangeValue(input, {
    min: resolvedOptions.minInput,
    max: resolvedOptions.maxInput,
    step: resolvedOptions.stepThreshold,
  });
}

export function getCompressorCurveOutputPercent(
  output: number,
  options: CompressorCurveOptions = {},
) {
  const { minOutput, maxOutput } = resolveCompressorCurveOptions(options);

  return normalizePercent((output - minOutput) / (maxOutput - minOutput));
}

export function getCompressorCurveOutputFromPercent(
  percent: number,
  options: CompressorCurveOptions = {},
) {
  const resolvedOptions = resolveCompressorCurveOptions(options);
  const output =
    resolvedOptions.minOutput +
    normalizePercent(percent) * (resolvedOptions.maxOutput - resolvedOptions.minOutput);

  return normalizeRangeValue(output, {
    min: resolvedOptions.minOutput,
    max: resolvedOptions.maxOutput,
    step: resolvedOptions.stepMakeupGain,
  });
}

function normalizePercent(percent: number) {
  return Number.isFinite(percent) ? Math.min(Math.max(percent, 0), 1) : 0;
}
