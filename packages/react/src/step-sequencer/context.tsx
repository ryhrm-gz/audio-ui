import type {
  StepSequencerState,
  StepSequencerStepState,
  StepSequencerValue,
} from "@ryhrm-gz/audio-ui-core";
import { createContext, useContext } from "react";

export interface StepSequencerContextValue {
  state: StepSequencerState;
  disabled: boolean;
  readOnly: boolean;
  name?: string;
  required?: boolean;
  getStep: (trackIndex: number, stepIndex: number) => StepSequencerStepState | undefined;
  setStepActive: (trackIndex: number, stepIndex: number, active: boolean) => void;
  toggleStep: (trackIndex: number, stepIndex: number) => void;
  setValue: (value: StepSequencerValue) => void;
}

export const StepSequencerContext = createContext<StepSequencerContextValue | undefined>(undefined);

export function useStepSequencerContext(partName: string) {
  const context = useContext(StepSequencerContext);

  if (context === undefined) {
    throw new Error(`${partName} must be used inside StepSequencer.Root.`);
  }

  return context;
}
