import { resolveXYPadOptions } from "./options.ts";
import type { XYPadOptions, XYPadState, XYPadValue, XYPadValueOptions } from "./types.ts";
import { getXYPadXPercent, getXYPadYPercent, normalizeXYPadValue } from "./value.ts";

export function createXYPadState(
  value: XYPadValue,
  options: XYPadOptions & XYPadValueOptions = {},
): XYPadState {
  const resolvedOptions = resolveXYPadOptions(options);
  const normalizedValue = normalizeXYPadValue(value, {
    ...resolvedOptions,
    valueStepX: options.valueStepX,
    valueStepY: options.valueStepY,
  });

  return {
    ...resolvedOptions,
    value: normalizedValue,
    xPercent: getXYPadXPercent(normalizedValue, resolvedOptions),
    yPercent: getXYPadYPercent(normalizedValue, resolvedOptions),
  };
}
