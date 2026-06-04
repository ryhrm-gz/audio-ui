import { normalizeRangeValue } from "../shared/range.ts";
import { resolveXYPadOptions } from "./options.ts";
import type { XYPadOptions, XYPadValue } from "./types.ts";

export type XYPadKeyboardOptions = object;

export function getNextXYPadKeyboardValue(
  value: XYPadValue,
  key: string,
  options: XYPadOptions = {},
  _keyboard: XYPadKeyboardOptions = {},
): XYPadValue | undefined {
  const { minX, maxX, stepX, minY, maxY, stepY } = resolveXYPadOptions(options);
  const largeStepY = stepY * 10;

  switch (key) {
    case "ArrowRight":
      return {
        ...value,
        x: normalizeRangeValue(value.x + stepX, {
          min: minX,
          max: maxX,
          step: stepX,
        }),
      };
    case "ArrowLeft":
      return {
        ...value,
        x: normalizeRangeValue(value.x - stepX, {
          min: minX,
          max: maxX,
          step: stepX,
        }),
      };
    case "ArrowUp":
      return {
        ...value,
        y: normalizeRangeValue(value.y + stepY, {
          min: minY,
          max: maxY,
          step: stepY,
        }),
      };
    case "ArrowDown":
      return {
        ...value,
        y: normalizeRangeValue(value.y - stepY, {
          min: minY,
          max: maxY,
          step: stepY,
        }),
      };
    case "PageUp":
      return {
        ...value,
        y: normalizeRangeValue(value.y + largeStepY, {
          min: minY,
          max: maxY,
          step: stepY,
        }),
      };
    case "PageDown":
      return {
        ...value,
        y: normalizeRangeValue(value.y - largeStepY, {
          min: minY,
          max: maxY,
          step: stepY,
        }),
      };
    case "Home":
      return { x: minX, y: minY };
    case "End":
      return { x: maxX, y: maxY };
    default:
      return undefined;
  }
}
