import { resolveStepSequencerOptions } from "./options.ts";
import type {
  StepSequencerOptions,
  StepSequencerState,
  StepSequencerStepState,
  StepSequencerValueInput,
} from "./types.ts";
import { getStepSequencerPositionPercent, normalizeStepSequencerValue } from "./value.ts";

export function createStepSequencerState(
  value: StepSequencerValueInput = [],
  options: StepSequencerOptions = {},
): StepSequencerState {
  const resolvedOptions = resolveStepSequencerOptions({
    ...options,
    trackCount: options.trackCount ?? getValueTrackCount(value),
    stepCount: options.stepCount ?? getLongestTrackLength(value),
  });
  const normalizedValue = normalizeStepSequencerValue(value, resolvedOptions);
  const steps: StepSequencerStepState[] = [];
  const tracks = normalizedValue.map((track, trackIndex) => {
    const trackSteps = track.map<StepSequencerStepState>((active, stepIndex) => {
      const step: StepSequencerStepState = {
        trackIndex,
        stepIndex,
        active,
        disabled: Boolean(resolvedOptions.disabledSteps[trackIndex]?.[stepIndex]),
        current: resolvedOptions.playhead === stepIndex,
        inLoop: stepIndex >= resolvedOptions.loopStart && stepIndex <= resolvedOptions.loopEnd,
        trackPercent: getStepSequencerPositionPercent(trackIndex, resolvedOptions.trackCount),
        stepPercent: getStepSequencerPositionPercent(stepIndex, resolvedOptions.stepCount),
      };

      steps.push(step);
      return step;
    });

    return {
      trackIndex,
      steps: trackSteps,
      activeStepCount: trackSteps.filter((step) => step.active).length,
      disabledStepCount: trackSteps.filter((step) => step.disabled).length,
      trackPercent: getStepSequencerPositionPercent(trackIndex, resolvedOptions.trackCount),
    };
  });

  return {
    ...resolvedOptions,
    value: normalizedValue,
    tracks,
    steps,
    activeSteps: steps.filter((step) => step.active),
    currentSteps: steps.filter((step) => step.current),
  };
}

function getValueTrackCount(value: StepSequencerValueInput): number | undefined {
  return value.length > 0 ? value.length : undefined;
}

function getLongestTrackLength(value: StepSequencerValueInput): number | undefined {
  const length = value.reduce((max, track) => Math.max(max, track.length), 0);

  return length > 0 ? length : undefined;
}
