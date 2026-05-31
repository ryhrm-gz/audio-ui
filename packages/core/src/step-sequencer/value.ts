import type { StepSequencerOptions, StepSequencerValue, StepSequencerValueInput } from "./types.ts";

export function normalizeStepSequencerValue(
  value: StepSequencerValueInput,
  options: Pick<StepSequencerOptions, "trackCount" | "stepCount"> = {},
): StepSequencerValue {
  const trackCount = normalizeCount(options.trackCount, value.length || 1);
  const stepCount = normalizeCount(options.stepCount, getLongestTrackLength(value) || 16);

  return Array.from({ length: trackCount }, (_, trackIndex) => {
    const track = value[trackIndex] ?? [];

    return Array.from({ length: stepCount }, (_, stepIndex) => Boolean(track[stepIndex]));
  });
}

export function setStepSequencerStepActive(
  value: StepSequencerValueInput,
  trackIndex: number,
  stepIndex: number,
  active: boolean,
  options: Pick<StepSequencerOptions, "trackCount" | "stepCount"> = {},
): StepSequencerValue {
  const normalizedValue = normalizeStepSequencerValue(value, {
    trackCount: options.trackCount,
    stepCount: options.stepCount,
  });

  if (!hasStepSequencerStep(normalizedValue, trackIndex, stepIndex)) {
    return normalizedValue;
  }

  normalizedValue[trackIndex] = [...(normalizedValue[trackIndex] as boolean[])];
  (normalizedValue[trackIndex] as boolean[])[stepIndex] = active;

  return normalizedValue;
}

export function toggleStepSequencerStep(
  value: StepSequencerValueInput,
  trackIndex: number,
  stepIndex: number,
  options: Pick<StepSequencerOptions, "trackCount" | "stepCount"> = {},
): StepSequencerValue {
  const normalizedValue = normalizeStepSequencerValue(value, options);

  if (!hasStepSequencerStep(normalizedValue, trackIndex, stepIndex)) {
    return normalizedValue;
  }

  return setStepSequencerStepActive(
    normalizedValue,
    trackIndex,
    stepIndex,
    !normalizedValue[trackIndex]?.[stepIndex],
    {
      trackCount: normalizedValue.length,
      stepCount: normalizedValue[0]?.length ?? 1,
    },
  );
}

export function getStepSequencerPositionPercent(index: number, count: number): number {
  if (count <= 1) {
    return 0;
  }

  return Math.min(Math.max(index, 0), count - 1) / (count - 1);
}

export function areStepSequencerValuesEqual(
  left: StepSequencerValueInput,
  right: StepSequencerValueInput,
): boolean {
  if (left.length !== right.length) {
    return false;
  }

  return left.every((track, trackIndex) => {
    const rightTrack = right[trackIndex];

    return (
      rightTrack !== undefined &&
      track.length === rightTrack.length &&
      track.every((step, stepIndex) => Boolean(step) === Boolean(rightTrack[stepIndex]))
    );
  });
}

function hasStepSequencerStep(
  value: StepSequencerValueInput,
  trackIndex: number,
  stepIndex: number,
): boolean {
  return trackIndex >= 0 && stepIndex >= 0 && value[trackIndex]?.[stepIndex] !== undefined;
}

function getLongestTrackLength(value: StepSequencerValueInput): number {
  return value.reduce((max, track) => Math.max(max, track.length), 0);
}

function normalizeCount(value: number | undefined, fallback: number): number {
  if (value === undefined || !Number.isFinite(value)) {
    return fallback;
  }

  return Math.max(1, Math.round(value));
}
