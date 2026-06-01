import { getCompressorCurvePoints } from "./curve.ts";
import { resolveCompressorCurveOptions } from "./options.ts";
import { normalizeCompressorCurveValue } from "./value.ts";
import type {
  CompressorCurveOptions,
  CompressorCurveState,
  CompressorCurveValue,
  CompressorCurveValueOptions,
} from "./types.ts";

export function createCompressorCurveState(
  value: CompressorCurveValue,
  options: CompressorCurveOptions & CompressorCurveValueOptions = {},
): CompressorCurveState {
  const resolvedOptions = resolveCompressorCurveOptions(options);
  const normalizedValue = normalizeCompressorCurveValue(value, {
    ...resolvedOptions,
    valueStepThreshold: options.valueStepThreshold,
    valueStepRatio: options.valueStepRatio,
    valueStepKnee: options.valueStepKnee,
    valueStepMakeupGain: options.valueStepMakeupGain,
  });

  return {
    ...resolvedOptions,
    value: normalizedValue,
    curve: getCompressorCurvePoints(normalizedValue, resolvedOptions),
  };
}
