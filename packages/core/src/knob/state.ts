import { getKnobAngle } from "./angle.ts";
import { resolveKnobOptions } from "./options.ts";
import type { KnobOptions, KnobState } from "./types.ts";
import { getKnobPercent, normalizeKnobValue } from "./value.ts";

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
