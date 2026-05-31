import { resolveRangeOptions } from "../shared/range.ts";
import type { RangeSliderOptions } from "./types.ts";

export const defaultRangeSliderOptions = {
  min: 0,
  max: 100,
  step: 1,
  minStepsBetweenThumbs: 0,
  minDistance: 0,
  orientation: "horizontal",
  inverted: false,
} satisfies Required<RangeSliderOptions>;

export function resolveRangeSliderOptions(options: RangeSliderOptions = {}) {
  const range = resolveRangeOptions(options, defaultRangeSliderOptions);
  const orientation = options.orientation ?? defaultRangeSliderOptions.orientation;
  const inverted = options.inverted ?? defaultRangeSliderOptions.inverted;
  const minStepsBetweenThumbs = resolveNonNegative(options.minStepsBetweenThumbs, 0);
  const requestedDistance =
    minStepsBetweenThumbs > 0
      ? minStepsBetweenThumbs * range.step
      : resolveNonNegative(options.minDistance, defaultRangeSliderOptions.minDistance);
  const minDistance = Math.min(requestedDistance, range.max - range.min);

  return {
    ...range,
    minStepsBetweenThumbs,
    minDistance,
    orientation,
    inverted,
  };
}

function resolveNonNegative(value: number | undefined, fallback: number) {
  return typeof value === "number" && Number.isFinite(value) && value > 0 ? value : fallback;
}
