import { getNextRangeKeyboardValue } from "../shared/keyboard.ts";
import type { SliderRange } from "./types.ts";

export function getNextSliderKeyboardValue(value: number, key: string, options: SliderRange = {}) {
  return getNextRangeKeyboardValue(value, key, options);
}
