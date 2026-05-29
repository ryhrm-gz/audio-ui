import { resolveRangeOptions } from "../shared/range.ts";
import type { SliderOptions } from "./types.ts";

export const defaultSliderOptions = {
  min: 0,
  max: 100,
  step: 1,
  orientation: "horizontal",
  inverted: false,
} satisfies Required<SliderOptions>;

export function resolveSliderOptions(options: SliderOptions = {}) {
  const range = resolveRangeOptions(options, defaultSliderOptions);
  const orientation = options.orientation ?? defaultSliderOptions.orientation;
  const inverted = options.inverted ?? defaultSliderOptions.inverted;

  return {
    ...range,
    orientation,
    inverted,
  };
}
