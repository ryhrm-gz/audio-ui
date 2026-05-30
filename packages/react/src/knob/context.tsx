import type { KnobState } from "@audio-ui/core";
import { createContext, useContext } from "react";

export interface KnobContextValue {
  state: KnobState;
  disabled: boolean;
  readOnly: boolean;
  fineControl: boolean;
  dragging: boolean;
  valueId: string;
  name?: string;
  required?: boolean;
  setDragging: (dragging: boolean) => void;
  setValue: (value: number, options?: KnobValueOptions) => void;
  commitValue: (value: number, options?: KnobValueOptions) => void;
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
