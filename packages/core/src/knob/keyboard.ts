import { getNextRangeKeyboardValue } from "../shared/keyboard.ts";
import type { KnobRange } from "./types.ts";

export function getNextKeyboardValue(value: number, key: string, options: KnobRange = {}) {
  return getNextRangeKeyboardValue(value, key, options);
}
