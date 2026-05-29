import type { SliderState } from "@audio-ui/core";
import { createContext, useContext, type RefObject } from "react";

export interface SliderContextValue {
  state: SliderState;
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

export const SliderContext = createContext<SliderContextValue | undefined>(undefined);

export function useSliderContext(partName: string) {
  const context = useContext(SliderContext);

  if (context === undefined) {
    throw new Error(`${partName} must be used inside Slider.Root.`);
  }

  return context;
}
