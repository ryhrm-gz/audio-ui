import { normalizeRangeValue } from "../shared/range.ts";
import { resolveCompressorCurveOptions } from "./options.ts";
import type {
  CompressorCurveOptions,
  CompressorCurveValue,
  CompressorCurveValueOptions,
} from "./types.ts";

export function normalizeCompressorCurveValue(
  value: CompressorCurveValue,
  options: CompressorCurveOptions & CompressorCurveValueOptions = {},
): CompressorCurveValue {
  const resolvedOptions = resolveCompressorCurveOptions(options);

  return {
    threshold: normalizeRangeValue(value.threshold, {
      min: resolvedOptions.minThreshold,
      max: resolvedOptions.maxThreshold,
      step: resolvedOptions.stepThreshold,
      valueStep: options.valueStepThreshold,
    }),
    ratio: normalizeRangeValue(value.ratio, {
      min: resolvedOptions.minRatio,
      max: resolvedOptions.maxRatio,
      step: resolvedOptions.stepRatio,
      valueStep: options.valueStepRatio,
    }),
    knee: normalizeRangeValue(value.knee, {
      min: resolvedOptions.minKnee,
      max: resolvedOptions.maxKnee,
      step: resolvedOptions.stepKnee,
      valueStep: options.valueStepKnee,
    }),
    makeupGain: normalizeRangeValue(value.makeupGain, {
      min: resolvedOptions.minMakeupGain,
      max: resolvedOptions.maxMakeupGain,
      step: resolvedOptions.stepMakeupGain,
      valueStep: options.valueStepMakeupGain,
    }),
  };
}

export function compressorTransferCurveValuesEqual(
  first: CompressorCurveValue,
  second: CompressorCurveValue,
) {
  return (
    first.threshold === second.threshold &&
    first.ratio === second.ratio &&
    first.knee === second.knee &&
    first.makeupGain === second.makeupGain
  );
}
