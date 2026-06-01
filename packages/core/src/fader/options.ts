import { resolveRangeOptions } from "../shared/range.ts";
import { defaultFaderScale, resolveFaderScale } from "./scale.ts";
import type { FaderOptions } from "./types.ts";

export const defaultFaderOptions = {
  min: -60,
  max: 12,
  step: 0.1,
  orientation: "vertical",
  unity: 0,
  inverted: false,
  scale: defaultFaderScale,
} satisfies Required<FaderOptions>;

export function resolveFaderOptions(options: FaderOptions = {}) {
  const range = resolveRangeOptions(options, defaultFaderOptions);
  const unity = resolveUnity(options.unity, range.min, range.max);
  const orientation = options.orientation ?? defaultFaderOptions.orientation;
  const inverted = options.inverted ?? defaultFaderOptions.inverted;
  const scale = resolveFaderScale(options.scale, { ...range, unity });

  return {
    ...range,
    orientation,
    unity,
    inverted,
    scale,
  };
}

function resolveUnity(unity: number | undefined, min: number, max: number) {
  const nextUnity = unity ?? defaultFaderOptions.unity;
  const finiteUnity = Number.isFinite(nextUnity) ? nextUnity : defaultFaderOptions.unity;

  return Math.min(Math.max(finiteUnity, min), max);
}
