import type { EQCurveOptions, ResolvedEQCurveOptions } from "./types.ts";

export const defaultEQCurveOptions = {
  minFrequency: 20,
  maxFrequency: 20000,
  minGain: -24,
  maxGain: 24,
  minQ: 0.1,
  maxQ: 18,
  stepFrequency: 1,
  stepGain: 0.1,
  stepQ: 0.1,
  curveResolution: 128,
} satisfies ResolvedEQCurveOptions;

export function resolveEQCurveOptions(options: EQCurveOptions = {}): ResolvedEQCurveOptions {
  const minFrequency = getPositiveOption(options.minFrequency, defaultEQCurveOptions.minFrequency);
  const maxFrequency = getPositiveOption(options.maxFrequency, defaultEQCurveOptions.maxFrequency);
  const minGain = getFiniteOption(options.minGain, defaultEQCurveOptions.minGain);
  const maxGain = getFiniteOption(options.maxGain, defaultEQCurveOptions.maxGain);
  const minQ = getPositiveOption(options.minQ, defaultEQCurveOptions.minQ);
  const maxQ = getPositiveOption(options.maxQ, defaultEQCurveOptions.maxQ);

  return {
    minFrequency: Math.min(minFrequency, maxFrequency),
    maxFrequency: Math.max(minFrequency, maxFrequency),
    minGain: Math.min(minGain, maxGain),
    maxGain: Math.max(minGain, maxGain),
    minQ: Math.min(minQ, maxQ),
    maxQ: Math.max(minQ, maxQ),
    stepFrequency: getPositiveOption(options.stepFrequency, defaultEQCurveOptions.stepFrequency),
    stepGain: getPositiveOption(options.stepGain, defaultEQCurveOptions.stepGain),
    stepQ: getPositiveOption(options.stepQ, defaultEQCurveOptions.stepQ),
    curveResolution: Math.max(
      2,
      Math.round(getPositiveOption(options.curveResolution, defaultEQCurveOptions.curveResolution)),
    ),
  };
}

function getFiniteOption(value: number | undefined, fallback: number) {
  return typeof value === "number" && Number.isFinite(value) ? value : fallback;
}

function getPositiveOption(value: number | undefined, fallback: number) {
  return typeof value === "number" && Number.isFinite(value) && value > 0 ? value : fallback;
}
