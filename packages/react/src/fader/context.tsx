import type { FaderState } from "@ryhrm-gz/audio-ui-core";
import { createContext, useContext, type RefObject } from "react";
import type { FineControlProp } from "../shared/fine-control.ts";

export interface FaderContextValue {
  state: FaderState;
  disabled: boolean;
  readOnly: boolean;
  fineControl: FineControlProp;
  getFineFactor: () => number;
  resetOnDoubleClick: boolean;
  allowTrackClick: boolean;
  dragging: boolean;
  valueId: string;
  name?: string;
  required?: boolean;
  trackRef: RefObject<HTMLDivElement | null>;
  setDragging: (dragging: boolean) => void;
  setValue: (value: number, options?: FaderValueOptions) => void;
  commitValue: (value: number, options?: FaderValueOptions) => void;
  resetValue: () => void;
}

export interface FaderValueOptions {
  fine?: boolean;
}

export const FaderContext = createContext<FaderContextValue | undefined>(undefined);

export function useFaderContext(partName: string) {
  const context = useContext(FaderContext);

  if (context === undefined) {
    throw new Error(`${partName} must be used inside Fader.Root.`);
  }

  return context;
}
