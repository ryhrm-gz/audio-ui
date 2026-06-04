import type { XYPadState, XYPadValue } from "@ryhrm-gz/audio-ui-core";
import { createContext, useContext, type RefObject } from "react";
import type { FineControlAxesProp } from "../shared/fine-control.ts";

export interface XYPadContextValue {
  state: XYPadState;
  disabled: boolean;
  readOnly: boolean;
  fineControl: FineControlAxesProp<"x" | "y">;
  getFineValueStep: (step: number, axis: "x" | "y") => number;
  resetOnDoubleClick: boolean;
  allowTrackClick: boolean;
  dragging: boolean;
  valueId: string;
  name?: string;
  required?: boolean;
  areaRef: RefObject<HTMLDivElement | null>;
  setDragging: (dragging: boolean) => void;
  setValue: (value: XYPadValue, options?: XYPadValueChangeOptions) => void;
  commitValue: (value: XYPadValue, options?: XYPadValueChangeOptions) => void;
  resetValue: () => void;
}

export interface XYPadValueChangeOptions {
  fine?: boolean;
}

export const XYPadContext = createContext<XYPadContextValue | undefined>(undefined);

export function useXYPadContext(partName: string) {
  const context = useContext(XYPadContext);

  if (context === undefined) {
    throw new Error(`${partName} must be used inside XYPad.Root.`);
  }

  return context;
}
