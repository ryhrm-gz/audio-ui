import type { FaderState } from "@audio-ui/core";
import { createContext, useContext, type RefObject } from "react";

export interface FaderContextValue {
  state: FaderState;
  disabled: boolean;
  readOnly: boolean;
  allowTrackClick: boolean;
  dragging: boolean;
  valueId: string;
  name?: string;
  required?: boolean;
  trackRef: RefObject<HTMLDivElement | null>;
  setDragging: (dragging: boolean) => void;
  setValue: (value: number) => void;
  commitValue: (value: number) => void;
}

export const FaderContext = createContext<FaderContextValue | undefined>(undefined);

export function useFaderContext(partName: string) {
  const context = useContext(FaderContext);

  if (context === undefined) {
    throw new Error(`${partName} must be used inside Fader.Root.`);
  }

  return context;
}
