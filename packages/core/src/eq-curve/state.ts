import { getEQCurveBandStates, normalizeEQCurveValue } from "./bands.ts";
import { getEQCurvePoints } from "./curve.ts";
import { resolveEQCurveOptions } from "./options.ts";
import type { EQCurveOptions, EQCurveState, EQCurveValue, EQCurveValueOptions } from "./types.ts";

export function createEQCurveState(
  value: EQCurveValue,
  options: EQCurveOptions & EQCurveValueOptions & { activeBand?: string | null } = {},
): EQCurveState {
  const resolvedOptions = resolveEQCurveOptions(options);
  const normalizedValue = normalizeEQCurveValue(value, {
    ...resolvedOptions,
    valueStepFrequency: options.valueStepFrequency,
    valueStepGain: options.valueStepGain,
    valueStepQ: options.valueStepQ,
  });

  return {
    ...resolvedOptions,
    value: normalizedValue,
    bands: getEQCurveBandStates(normalizedValue, resolvedOptions),
    curve: getEQCurvePoints(normalizedValue, resolvedOptions),
    activeBand: options.activeBand ?? null,
  };
}
