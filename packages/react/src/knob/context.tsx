import type { KnobState } from "@audio-ui/core";
import { createContext, useContext } from "react";

export interface KnobContextValue {
  state: KnobState;
  disabled: boolean;
  readOnly: boolean;
  dragging: boolean;
  valueId: string;
  name?: string;
  required?: boolean;
  setDragging: (dragging: boolean) => void;
  setValue: (value: number) => void;
  commitValue: (value: number) => void;
}

export const KnobContext = createContext<KnobContextValue | undefined>(undefined);

export function useKnobContext(partName: string) {
  const context = useContext(KnobContext);

  if (context === undefined) {
    throw new Error(`${partName} must be used inside Knob.Root.`);
  }

  return context;
}
