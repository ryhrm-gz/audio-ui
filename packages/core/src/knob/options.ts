import { resolveRangeOptions } from "../shared/range.ts";
import type { KnobOptions } from "./types.ts";

export const defaultKnobOptions = {
  min: 0,
  max: 100,
  step: 1,
  minAngle: -135,
  maxAngle: 135,
} satisfies Required<KnobOptions>;

export function resolveKnobOptions(options: KnobOptions = {}) {
  const minAngle = options.minAngle ?? defaultKnobOptions.minAngle;
  const maxAngle = options.maxAngle ?? defaultKnobOptions.maxAngle;
  const range = resolveRangeOptions(options, defaultKnobOptions);

  return {
    ...range,
    minAngle,
    maxAngle,
  };
}
