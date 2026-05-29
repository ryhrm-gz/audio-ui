import type { RangeOptions } from "../shared/range.ts";

export type SliderOrientation = "horizontal" | "vertical";

export interface SliderRange extends RangeOptions {}

export interface SliderOptions extends SliderRange {
  orientation?: SliderOrientation;
  inverted?: boolean;
}

export interface SliderPoint {
  trackX: number;
  trackY: number;
  trackWidth: number;
  trackHeight: number;
  pointX: number;
  pointY: number;
}

export interface SliderState {
  value: number;
  min: number;
  max: number;
  step: number;
  percent: number;
  orientation: SliderOrientation;
  inverted: boolean;
}
