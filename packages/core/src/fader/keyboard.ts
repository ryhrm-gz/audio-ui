import { getNextRangeKeyboardValue, type RangeKeyboardOptions } from "../shared/keyboard.ts";
import type { FaderRange } from "./types.ts";

export function getNextFaderKeyboardValue(
  value: number,
  key: string,
  options: FaderRange = {},
  keyboard: RangeKeyboardOptions = {},
) {
  return getNextRangeKeyboardValue(value, key, options, keyboard);
}
