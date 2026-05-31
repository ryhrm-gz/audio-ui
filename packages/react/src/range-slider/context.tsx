import type {
  RangeSliderState,
  RangeSliderThumbIndex,
  RangeSliderValue,
} from "@ryhrm-gz/audio-ui-core";
import { createContext, useContext, type RefObject } from "react";

export interface RangeSliderContextValue {
  state: RangeSliderState;
  disabled: boolean;
  readOnly: boolean;
  fineControl: boolean;
  resetOnDoubleClick: boolean;
  dragging: boolean;
  activeThumb: RangeSliderThumbIndex | null;
  valueId: string;
  name?: string;
  required?: boolean;
  trackRef: RefObject<HTMLDivElement | null>;
  setActiveThumb: (index: RangeSliderThumbIndex | null) => void;
  setValue: (value: RangeSliderValue, options?: RangeSliderValueOptions) => void;
  commitValue: (value: RangeSliderValue, options?: RangeSliderValueOptions) => void;
  resetValue: () => void;
}

export interface RangeSliderValueOptions {
  activeThumb?: RangeSliderThumbIndex;
  fine?: boolean;
}

export const RangeSliderContext = createContext<RangeSliderContextValue | undefined>(undefined);

export function useRangeSliderContext(partName: string) {
  const context = useContext(RangeSliderContext);

  if (context === undefined) {
    throw new Error(`${partName} must be used inside RangeSlider.Root.`);
  }

  return context;
}
