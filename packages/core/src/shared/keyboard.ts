import type { RangeOptions } from "./range.ts";
import { normalizeRangeValue, resolveRangeOptions } from "./range.ts";

export function getNextRangeKeyboardValue(value: number, key: string, options: RangeOptions = {}) {
  const { min, max, step } = resolveRangeOptions(options);
  const largeStep = step * 10;

  switch (key) {
    case "ArrowUp":
    case "ArrowRight":
      return normalizeRangeValue(value + step, { min, max, step });
    case "ArrowDown":
    case "ArrowLeft":
      return normalizeRangeValue(value - step, { min, max, step });
    case "PageUp":
      return normalizeRangeValue(value + largeStep, { min, max, step });
    case "PageDown":
      return normalizeRangeValue(value - largeStep, { min, max, step });
    case "Home":
      return min;
    case "End":
      return max;
    default:
      return undefined;
  }
}
