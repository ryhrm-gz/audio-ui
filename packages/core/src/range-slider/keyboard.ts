import { getNextRangeKeyboardValue, type RangeKeyboardOptions } from "../shared/keyboard.ts";
import { getFineStep, resolveRangeOptions } from "../shared/range.ts";
import type { RangeSliderRange, RangeSliderThumbIndex, RangeSliderValue } from "./types.ts";
import { normalizeRangeSliderValue } from "./value.ts";

export function getNextRangeSliderKeyboardValue(
  value: readonly [number, number],
  activeThumb: RangeSliderThumbIndex,
  key: string,
  options: RangeSliderRange = {},
  keyboard: RangeKeyboardOptions = {},
): RangeSliderValue | undefined {
  const nextThumbValue = getNextRangeKeyboardValue(value[activeThumb], key, options, keyboard);

  if (nextThumbValue === undefined) {
    return undefined;
  }

  const nextValue: RangeSliderValue = [...value] as RangeSliderValue;
  nextValue[activeThumb] = nextThumbValue;

  return normalizeRangeSliderValue(nextValue, {
    ...options,
    activeThumb,
    valueStep: keyboard.fine ? getFineStep(resolveRangeOptions(options).step) : undefined,
  });
}
