import type { RangeOptions } from "../shared/range.ts";

export type SliderOrientation = "horizontal" | "vertical";
export type SliderOrigin = "left" | "center" | "right";

export interface SliderRange extends RangeOptions {}

export interface SliderOptions extends SliderRange {
  orientation?: SliderOrientation;
  inverted?: boolean;
  origin?: SliderOrigin;
}

export interface SliderPoint {
  trackX: number;
  trackY: number;
  trackWidth: number;
  trackHeight: number;
  pointX: number;
  pointY: number;
}

export interface SliderLinearDrag extends SliderPoint {
  startValue: number;
  startPointX: number;
  startPointY: number;
}

export interface SliderDragOptions {
  fine?: boolean;
}

export interface SliderState {
  value: number;
  min: number;
  max: number;
  step: number;
  percent: number;
  origin: SliderOrigin;
  originPercent: number;
  rangeStartPercent: number;
  rangeEndPercent: number;
  rangeSizePercent: number;
  orientation: SliderOrientation;
  inverted: boolean;
}
