import { getNextRangeKeyboardValue, type RangeKeyboardOptions } from "../shared/keyboard.ts";
import type { KnobRange } from "./types.ts";

export function getNextKeyboardValue(
  value: number,
  key: string,
  options: KnobRange = {},
  keyboard: RangeKeyboardOptions = {},
) {
  return getNextRangeKeyboardValue(value, key, options, keyboard);
}
