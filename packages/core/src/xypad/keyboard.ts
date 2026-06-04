import { getFineStep, normalizeRangeValue } from "../shared/range.ts";
import { resolveXYPadOptions } from "./options.ts";
import type { XYPadOptions, XYPadValue } from "./types.ts";

export interface XYPadKeyboardOptions {
  fine?: boolean;
  fineStepX?: number;
  fineStepY?: number;
}

export function getNextXYPadKeyboardValue(
  value: XYPadValue,
  key: string,
  options: XYPadOptions = {},
  keyboard: XYPadKeyboardOptions = {},
): XYPadValue | undefined {
  const { minX, maxX, stepX, minY, maxY, stepY } = resolveXYPadOptions(options);
  const valueStepX = keyboard.fine ? getFineStep(stepX, keyboard.fineStepX) : stepX;
  const valueStepY = keyboard.fine ? getFineStep(stepY, keyboard.fineStepY) : stepY;
  const largeStepY = valueStepY * 10;

  switch (key) {
    case "ArrowRight":
      return {
        ...value,
        x: normalizeRangeValue(value.x + valueStepX, {
          min: minX,
          max: maxX,
          step: stepX,
          valueStep: valueStepX,
        }),
      };
    case "ArrowLeft":
      return {
        ...value,
        x: normalizeRangeValue(value.x - valueStepX, {
          min: minX,
          max: maxX,
          step: stepX,
          valueStep: valueStepX,
        }),
      };
    case "ArrowUp":
      return {
        ...value,
        y: normalizeRangeValue(value.y + valueStepY, {
          min: minY,
          max: maxY,
          step: stepY,
          valueStep: valueStepY,
        }),
      };
    case "ArrowDown":
      return {
        ...value,
        y: normalizeRangeValue(value.y - valueStepY, {
          min: minY,
          max: maxY,
          step: stepY,
          valueStep: valueStepY,
        }),
      };
    case "PageUp":
      return {
        ...value,
        y: normalizeRangeValue(value.y + largeStepY, {
          min: minY,
          max: maxY,
          step: stepY,
          valueStep: valueStepY,
        }),
      };
    case "PageDown":
      return {
        ...value,
        y: normalizeRangeValue(value.y - largeStepY, {
          min: minY,
          max: maxY,
          step: stepY,
          valueStep: valueStepY,
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
