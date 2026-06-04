import type { SliderState, SliderThumbIndex, SliderValue } from "@ryhrm-gz/audio-ui-core";
import { createContext, useContext, type RefObject } from "react";
import type { FineControlProp } from "../shared/fine-control.ts";

export interface SliderContextValue {
  state: SliderState;
  disabled: boolean;
  readOnly: boolean;
  fineControl: FineControlProp;
  getFineFactor: () => number;
  resetOnDoubleClick: boolean;
  allowTrackClick: boolean;
  dragging: boolean;
  activeThumb: SliderThumbIndex | null;
  valueId: string;
  name?: string;
  required?: boolean;
  trackRef: RefObject<HTMLDivElement | null>;
  setDragging: (dragging: boolean) => void;
  setActiveThumb: (index: SliderThumbIndex | null) => void;
  setValue: (value: SliderValue, options?: SliderValueOptions) => void;
  commitValue: (value: SliderValue, options?: SliderValueOptions) => void;
  resetValue: () => void;
}

export interface SliderValueOptions {
  activeThumb?: SliderThumbIndex;
  fine?: boolean;
}

export const SliderContext = createContext<SliderContextValue | undefined>(undefined);

export function useSliderContext(partName: string) {
  const context = useContext(SliderContext);

  if (context === undefined) {
    throw new Error(`${partName} must be used inside Slider.Root.`);
  }

  return context;
}
