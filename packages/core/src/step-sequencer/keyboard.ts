import type { StepSequencerPosition, StepSequencerState } from "./types.ts";

export function resolveStepSequencerKeyboardTarget(
  current: StepSequencerPosition,
  key: string,
  state: Pick<StepSequencerState, "trackCount" | "stepCount">,
): StepSequencerPosition | undefined {
  switch (key) {
    case "ArrowLeft":
      return clampStepSequencerPosition({ ...current, stepIndex: current.stepIndex - 1 }, state);
    case "ArrowRight":
      return clampStepSequencerPosition({ ...current, stepIndex: current.stepIndex + 1 }, state);
    case "ArrowUp":
      return clampStepSequencerPosition({ ...current, trackIndex: current.trackIndex - 1 }, state);
    case "ArrowDown":
      return clampStepSequencerPosition({ ...current, trackIndex: current.trackIndex + 1 }, state);
    case "Home":
      return clampStepSequencerPosition({ ...current, stepIndex: 0 }, state);
    case "End":
      return clampStepSequencerPosition({ ...current, stepIndex: state.stepCount - 1 }, state);
    default:
      return undefined;
  }
}

function clampStepSequencerPosition(
  position: StepSequencerPosition,
  state: Pick<StepSequencerState, "trackCount" | "stepCount">,
): StepSequencerPosition {
  return {
    trackIndex: clampIndex(position.trackIndex, state.trackCount),
    stepIndex: clampIndex(position.stepIndex, state.stepCount),
  };
}

function clampIndex(value: number, count: number): number {
  return Math.min(Math.max(value, 0), Math.max(0, count - 1));
}
