import { resolveRangeOptions } from "../shared/range.ts";
import type { SliderOptions } from "./types.ts";

export const defaultSliderOptions = {
  min: 0,
  max: 100,
  step: 1,
  minStepsBetweenThumbs: 0,
  minDistance: 0,
  thumbs: [],
  orientation: "horizontal",
  inverted: false,
  origin: "left",
} satisfies Required<SliderOptions>;

export function resolveSliderOptions(options: SliderOptions = {}) {
  const range = resolveRangeOptions(options, defaultSliderOptions);
  const orientation = options.orientation ?? defaultSliderOptions.orientation;
  const inverted = options.inverted ?? defaultSliderOptions.inverted;
  const origin = options.origin ?? defaultSliderOptions.origin;
  const thumbs = options.thumbs ?? defaultSliderOptions.thumbs;
  const minStepsBetweenThumbs = resolveNonNegative(options.minStepsBetweenThumbs, 0);
  const requestedDistance =
    minStepsBetweenThumbs > 0
      ? minStepsBetweenThumbs * range.step
      : resolveNonNegative(options.minDistance, defaultSliderOptions.minDistance);
  const minDistance = Math.min(requestedDistance, range.max - range.min);

  return {
    ...range,
    minStepsBetweenThumbs,
    minDistance,
    thumbs,
    orientation,
    inverted,
    origin,
  };
}

function resolveNonNegative(value: number | undefined, fallback: number) {
  return typeof value === "number" && Number.isFinite(value) && value > 0 ? value : fallback;
}
