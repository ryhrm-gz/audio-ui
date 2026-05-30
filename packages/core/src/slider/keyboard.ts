import { getNextRangeKeyboardValue, type RangeKeyboardOptions } from "../shared/keyboard.ts";
import type { SliderRange } from "./types.ts";

export function getNextSliderKeyboardValue(
  value: number,
  key: string,
  options: SliderRange = {},
  keyboard: RangeKeyboardOptions = {},
) {
  return getNextRangeKeyboardValue(value, key, options, keyboard);
}
