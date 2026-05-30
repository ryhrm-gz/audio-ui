import type { RangeValueOptions } from "../shared/range.ts";
import { getKnobAngle } from "./angle.ts";
import { resolveKnobOptions } from "./options.ts";
import type { KnobOptions, KnobState } from "./types.ts";
import { getKnobPercent, normalizeKnobValue } from "./value.ts";

export function createKnobState(
  value: number,
  options: KnobOptions & RangeValueOptions = {},
): KnobState {
  const resolvedOptions = resolveKnobOptions(options);
  const normalizedValue = normalizeKnobValue(value, {
    ...resolvedOptions,
    valueStep: options.valueStep,
  });

  return {
    ...resolvedOptions,
    value: normalizedValue,
    percent: getKnobPercent(normalizedValue, resolvedOptions),
    angle: getKnobAngle(normalizedValue, resolvedOptions),
  };
}
