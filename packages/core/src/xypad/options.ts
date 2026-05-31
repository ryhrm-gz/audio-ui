import { resolveRangeOptions } from "../shared/range.ts";
import type { XYPadOptions } from "./types.ts";

export const defaultXYPadOptions = {
  minX: 0,
  maxX: 100,
  stepX: 1,
  minY: 0,
  maxY: 100,
  stepY: 1,
} satisfies Required<XYPadOptions>;

export function resolveXYPadOptions(options: XYPadOptions = {}) {
  const xRange = resolveRangeOptions(
    {
      min: options.minX,
      max: options.maxX,
      step: options.stepX,
    },
    {
      min: defaultXYPadOptions.minX,
      max: defaultXYPadOptions.maxX,
      step: defaultXYPadOptions.stepX,
    },
  );
  const yRange = resolveRangeOptions(
    {
      min: options.minY,
      max: options.maxY,
      step: options.stepY,
    },
    {
      min: defaultXYPadOptions.minY,
      max: defaultXYPadOptions.maxY,
      step: defaultXYPadOptions.stepY,
    },
  );

  return {
    minX: xRange.min,
    maxX: xRange.max,
    stepX: xRange.step,
    minY: yRange.min,
    maxY: yRange.max,
    stepY: yRange.step,
  };
}
