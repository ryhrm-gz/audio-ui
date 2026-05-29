import { resolveKnobOptions } from "./options.ts";
import type { KnobRange } from "./types.ts";
import { normalizeKnobValue } from "./value.ts";

export function getNextKeyboardValue(value: number, key: string, options: KnobRange = {}) {
  const { min, max, step } = resolveKnobOptions(options);
  const largeStep = step * 10;

  switch (key) {
    case "ArrowUp":
    case "ArrowRight":
      return normalizeKnobValue(value + step, { min, max, step });
    case "ArrowDown":
    case "ArrowLeft":
      return normalizeKnobValue(value - step, { min, max, step });
    case "PageUp":
      return normalizeKnobValue(value + largeStep, { min, max, step });
    case "PageDown":
      return normalizeKnobValue(value - largeStep, { min, max, step });
    case "Home":
      return min;
    case "End":
      return max;
    default:
      return undefined;
  }
}
