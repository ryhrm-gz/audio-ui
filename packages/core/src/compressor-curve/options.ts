import type {
  CompressorCurveOptions,
  CompressorCurveValue,
  ResolvedCompressorCurveOptions,
} from "./types.ts";

export const defaultCompressorCurveValue = {
  threshold: -24,
  ratio: 4,
  knee: 6,
  makeupGain: 0,
} satisfies CompressorCurveValue;

export const defaultCompressorCurveOptions = {
  minInput: -60,
  maxInput: 12,
  minOutput: -60,
  maxOutput: 12,
  minThreshold: -60,
  maxThreshold: 12,
  minRatio: 1,
  maxRatio: 20,
  minKnee: 0,
  maxKnee: 48,
  minMakeupGain: -24,
  maxMakeupGain: 24,
  stepThreshold: 0.1,
  stepRatio: 0.1,
  stepKnee: 0.1,
  stepMakeupGain: 0.1,
  curveResolution: 128,
} satisfies ResolvedCompressorCurveOptions;

export function resolveCompressorCurveOptions(
  options: CompressorCurveOptions = {},
): ResolvedCompressorCurveOptions {
  const minInput = getFiniteOption(options.minInput, defaultCompressorCurveOptions.minInput);
  const maxInput = getFiniteOption(options.maxInput, defaultCompressorCurveOptions.maxInput);
  const minOutput = getFiniteOption(options.minOutput, defaultCompressorCurveOptions.minOutput);
  const maxOutput = getFiniteOption(options.maxOutput, defaultCompressorCurveOptions.maxOutput);
  const minThreshold = getFiniteOption(
    options.minThreshold,
    defaultCompressorCurveOptions.minThreshold,
  );
  const maxThreshold = getFiniteOption(
    options.maxThreshold,
    defaultCompressorCurveOptions.maxThreshold,
  );
  const minRatio = getPositiveOption(options.minRatio, defaultCompressorCurveOptions.minRatio);
  const maxRatio = getPositiveOption(options.maxRatio, defaultCompressorCurveOptions.maxRatio);
  const minKnee = getNonNegativeOption(options.minKnee, defaultCompressorCurveOptions.minKnee);
  const maxKnee = getNonNegativeOption(options.maxKnee, defaultCompressorCurveOptions.maxKnee);
  const minMakeupGain = getFiniteOption(
    options.minMakeupGain,
    defaultCompressorCurveOptions.minMakeupGain,
  );
  const maxMakeupGain = getFiniteOption(
    options.maxMakeupGain,
    defaultCompressorCurveOptions.maxMakeupGain,
  );

  return {
    minInput: Math.min(minInput, maxInput),
    maxInput: Math.max(minInput, maxInput),
    minOutput: Math.min(minOutput, maxOutput),
    maxOutput: Math.max(minOutput, maxOutput),
    minThreshold: Math.min(minThreshold, maxThreshold),
    maxThreshold: Math.max(minThreshold, maxThreshold),
    minRatio: Math.min(minRatio, maxRatio),
    maxRatio: Math.max(minRatio, maxRatio),
    minKnee: Math.min(minKnee, maxKnee),
    maxKnee: Math.max(minKnee, maxKnee),
    minMakeupGain: Math.min(minMakeupGain, maxMakeupGain),
    maxMakeupGain: Math.max(minMakeupGain, maxMakeupGain),
    stepThreshold: getPositiveOption(
      options.stepThreshold,
      defaultCompressorCurveOptions.stepThreshold,
    ),
    stepRatio: getPositiveOption(options.stepRatio, defaultCompressorCurveOptions.stepRatio),
    stepKnee: getPositiveOption(options.stepKnee, defaultCompressorCurveOptions.stepKnee),
    stepMakeupGain: getPositiveOption(
      options.stepMakeupGain,
      defaultCompressorCurveOptions.stepMakeupGain,
    ),
    curveResolution: Math.max(
      2,
      Math.round(
        getPositiveOption(options.curveResolution, defaultCompressorCurveOptions.curveResolution),
      ),
    ),
  };
}

function getFiniteOption(value: number | undefined, fallback: number) {
  return typeof value === "number" && Number.isFinite(value) ? value : fallback;
}

function getPositiveOption(value: number | undefined, fallback: number) {
  return typeof value === "number" && Number.isFinite(value) && value > 0 ? value : fallback;
}

function getNonNegativeOption(value: number | undefined, fallback: number) {
  return typeof value === "number" && Number.isFinite(value) && value >= 0 ? value : fallback;
}
