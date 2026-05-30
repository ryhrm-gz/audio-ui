import type { RangeOptions } from "./range.ts";
import { getFineStep, normalizeRangeValue, resolveRangeOptions } from "./range.ts";

export interface RangeKeyboardOptions {
  fine?: boolean;
}

export function getNextRangeKeyboardValue(
  value: number,
  key: string,
  options: RangeOptions = {},
  keyboard: RangeKeyboardOptions = {},
) {
  const { min, max, step } = resolveRangeOptions(options);
  const valueStep = keyboard.fine ? getFineStep(step) : step;
  const largeStep = valueStep * 10;

  switch (key) {
    case "ArrowUp":
    case "ArrowRight":
      return normalizeRangeValue(value + valueStep, { min, max, step, valueStep });
    case "ArrowDown":
    case "ArrowLeft":
      return normalizeRangeValue(value - valueStep, { min, max, step, valueStep });
    case "PageUp":
      return normalizeRangeValue(value + largeStep, { min, max, step, valueStep });
    case "PageDown":
      return normalizeRangeValue(value - largeStep, { min, max, step, valueStep });
    case "Home":
      return min;
    case "End":
      return max;
    default:
      return undefined;
  }
}
