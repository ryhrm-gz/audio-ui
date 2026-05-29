import { getNextRangeKeyboardValue } from "../shared/keyboard.ts";
import type { FaderRange } from "./types.ts";

export function getNextFaderKeyboardValue(value: number, key: string, options: FaderRange = {}) {
  return getNextRangeKeyboardValue(value, key, options);
}
