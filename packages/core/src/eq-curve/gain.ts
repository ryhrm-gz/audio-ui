import { getRangePercent, getRangeValueFromPercent, normalizeRangeValue } from "../shared/range.ts";
import { resolveEQCurveOptions } from "./options.ts";
import type { EQCurveOptions, EQCurveValueOptions } from "./types.ts";

export function normalizeEQCurveGain(
  gain: number,
  options: EQCurveOptions & EQCurveValueOptions = {},
) {
  const { minGain, maxGain, stepGain } = resolveEQCurveOptions(options);

  return normalizeRangeValue(gain, {
    min: minGain,
    max: maxGain,
    step: stepGain,
    valueStep: options.valueStepGain,
  });
}

export function getEQCurveGainPercent(gain: number, options: EQCurveOptions = {}) {
  const { minGain, maxGain } = resolveEQCurveOptions(options);
  return getRangePercent(gain, { min: minGain, max: maxGain });
}

export function getEQCurveGainFromPercent(
  percent: number,
  options: EQCurveOptions & EQCurveValueOptions = {},
) {
  const { minGain, maxGain, stepGain } = resolveEQCurveOptions(options);

  return getRangeValueFromPercent(percent, {
    min: minGain,
    max: maxGain,
    step: stepGain,
    valueStep: options.valueStepGain,
  });
}
