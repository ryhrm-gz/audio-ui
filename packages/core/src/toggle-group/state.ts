import type { ToggleGroupOptions, ToggleGroupState, ToggleGroupValue } from "./types.ts";
import { getToggleGroupValues, normalizeToggleGroupValue } from "./value.ts";

export function createToggleGroupState(
  value: ToggleGroupValue | undefined,
  options: ToggleGroupOptions = {},
): ToggleGroupState {
  const type = options.type ?? "single";

  return {
    type,
    value: normalizeToggleGroupValue(value, { ...options, type }),
    values: getToggleGroupValues(value, { ...options, type }),
    orientation: options.orientation ?? "horizontal",
    allowEmpty: options.allowEmpty ?? false,
  };
}
