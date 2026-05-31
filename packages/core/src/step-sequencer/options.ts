import type { ResolvedStepSequencerOptions, StepSequencerOptions } from "./types.ts";
import { getStepSequencerPositionPercent, normalizeStepSequencerValue } from "./value.ts";

const DEFAULT_TRACK_COUNT = 1;
const DEFAULT_STEP_COUNT = 16;

export function resolveStepSequencerOptions(
  options: StepSequencerOptions = {},
): ResolvedStepSequencerOptions {
  const trackCount = normalizeCount(options.trackCount, DEFAULT_TRACK_COUNT);
  const stepCount = normalizeCount(options.stepCount, DEFAULT_STEP_COUNT);
  const playhead = normalizeStepSequencerPlayhead(options.playhead, stepCount);
  const loop = normalizeStepSequencerLoop(options.loopStart, options.loopEnd, stepCount);

  return {
    trackCount,
    stepCount,
    disabledSteps: normalizeStepSequencerValue(options.disabledSteps ?? [], {
      trackCount,
      stepCount,
    }),
    playhead,
    playheadPercent:
      playhead === undefined ? undefined : getStepSequencerPositionPercent(playhead, stepCount),
    loopStart: loop.start,
    loopEnd: loop.end,
    orientation: options.orientation === "vertical" ? "vertical" : "horizontal",
  };
}

export function normalizeStepSequencerPlayhead(
  playhead: number | undefined,
  stepCount: number,
): number | undefined {
  if (playhead === undefined || !Number.isFinite(playhead) || stepCount <= 0) {
    return undefined;
  }

  return clampIndex(Math.round(playhead), stepCount);
}

export function normalizeStepSequencerLoop(
  loopStart: number | undefined,
  loopEnd: number | undefined,
  stepCount: number,
): { start: number; end: number } {
  const fallbackEnd = Math.max(0, stepCount - 1);
  const normalizedStart = normalizeOptionalIndex(loopStart, stepCount) ?? 0;
  const normalizedEnd = normalizeOptionalIndex(loopEnd, stepCount) ?? fallbackEnd;

  return {
    start: Math.min(normalizedStart, normalizedEnd),
    end: Math.max(normalizedStart, normalizedEnd),
  };
}

function normalizeCount(value: number | undefined, fallback: number): number {
  if (value === undefined || !Number.isFinite(value)) {
    return fallback;
  }

  return Math.max(1, Math.round(value));
}

function normalizeOptionalIndex(value: number | undefined, count: number): number | undefined {
  if (value === undefined || !Number.isFinite(value) || count <= 0) {
    return undefined;
  }

  return clampIndex(Math.round(value), count);
}

function clampIndex(value: number, count: number): number {
  return Math.min(Math.max(value, 0), Math.max(0, count - 1));
}
