import { getNextRangeKeyboardValue, type RangeKeyboardOptions } from "../shared/keyboard.ts";
import type { SliderRange, SliderThumbIndex, SliderValue } from "./types.ts";
import { normalizeSliderValue } from "./value.ts";

export function getNextSliderKeyboardValue(
  value: readonly number[],
  activeThumb: SliderThumbIndex,
  key: string,
  options?: SliderRange,
  keyboard?: RangeKeyboardOptions,
): SliderValue | undefined {
  const nextThumbValue = getNextRangeKeyboardValue(value[activeThumb], key, options, keyboard);

  if (nextThumbValue === undefined) {
    return undefined;
  }

  const nextValue = [...value];
  nextValue[activeThumb] = nextThumbValue;

  return normalizeSliderValue(nextValue, {
    ...options,
    activeThumb,
  });
}
