export type StepSequencerOrientation = "horizontal" | "vertical";

export type StepSequencerValue = boolean[][];
export type StepSequencerValueInput = readonly (readonly boolean[])[];

export interface StepSequencerPosition {
  trackIndex: number;
  stepIndex: number;
}

export interface StepSequencerOptions {
  trackCount?: number;
  stepCount?: number;
  disabledSteps?: StepSequencerValueInput;
  playhead?: number;
  loopStart?: number;
  loopEnd?: number;
  orientation?: StepSequencerOrientation;
}

export interface ResolvedStepSequencerOptions {
  trackCount: number;
  stepCount: number;
  disabledSteps: StepSequencerValue;
  playhead?: number;
  playheadPercent?: number;
  loopStart: number;
  loopEnd: number;
  orientation: StepSequencerOrientation;
}

export interface StepSequencerStepState extends StepSequencerPosition {
  active: boolean;
  disabled: boolean;
  current: boolean;
  inLoop: boolean;
  trackPercent: number;
  stepPercent: number;
}

export interface StepSequencerTrackState {
  trackIndex: number;
  steps: StepSequencerStepState[];
  activeStepCount: number;
  disabledStepCount: number;
  trackPercent: number;
}

export interface StepSequencerState extends ResolvedStepSequencerOptions {
  value: StepSequencerValue;
  tracks: StepSequencerTrackState[];
  steps: StepSequencerStepState[];
  activeSteps: StepSequencerStepState[];
  currentSteps: StepSequencerStepState[];
}
