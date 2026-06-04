import type { EQCurveState, EQCurveValue } from "@ryhrm-gz/audio-ui-core";
import { createContext, useContext, type RefObject } from "react";
import type { FineControlAxesProp } from "../shared/fine-control.ts";

export interface EQCurveContextValue {
  state: EQCurveState;
  disabled: boolean;
  readOnly: boolean;
  fineControl: FineControlAxesProp<"frequency" | "gain" | "q">;
  getFineValueStep: (step: number, axis: "frequency" | "gain" | "q") => number;
  draggingBand: string | null;
  valueId: string;
  name?: string;
  required?: boolean;
  graphRef: RefObject<HTMLDivElement | null>;
  setDraggingBand: (bandId: string | null) => void;
  setValue: (value: EQCurveValue, options?: EQCurveValueChangeOptions) => void;
  commitValue: (value: EQCurveValue, options?: EQCurveValueChangeOptions) => void;
}

export interface EQCurveValueChangeOptions {
  fine?: boolean;
  activeBand?: string | null;
}

export const EQCurveContext = createContext<EQCurveContextValue | undefined>(undefined);

export function useEQCurveContext(partName: string) {
  const context = useContext(EQCurveContext);

  if (context === undefined) {
    throw new Error(`${partName} must be used inside EQCurve.Root.`);
  }

  return context;
}
