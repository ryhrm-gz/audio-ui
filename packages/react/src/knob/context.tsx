import type { KnobState } from "@ryhrm-gz/audio-ui-core";
import { createContext, useContext } from "react";
import type { FineControlProp } from "../shared/fine-control.ts";

export interface KnobContextValue {
  state: KnobState;
  disabled: boolean;
  readOnly: boolean;
  fineControl: FineControlProp;
  getFineFactor: () => number;
  resetOnDoubleClick: boolean;
  dragging: boolean;
  valueId: string;
  name?: string;
  required?: boolean;
  setDragging: (dragging: boolean) => void;
  setValue: (value: number, options?: KnobValueOptions) => void;
  commitValue: (value: number, options?: KnobValueOptions) => void;
  resetValue: () => void;
}

export interface KnobValueOptions {
  fine?: boolean;
}

export const KnobContext = createContext<KnobContextValue | undefined>(undefined);

export function useKnobContext(partName: string) {
  const context = useContext(KnobContext);

  if (context === undefined) {
    throw new Error(`${partName} must be used inside Knob.Root.`);
  }

  return context;
}
