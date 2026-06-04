import type { RangeOptions } from "../shared/range.ts";

export type RangeSliderOrientation = "horizontal" | "vertical";
export type RangeSliderThumbIndex = 0 | 1;
export type RangeSliderValue = [number, number];

export interface RangeSliderRange extends RangeOptions {
  minStepsBetweenThumbs?: number;
  minDistance?: number;
}

export interface RangeSliderOptions extends RangeSliderRange {
  orientation?: RangeSliderOrientation;
  inverted?: boolean;
}

export interface RangeSliderPoint {
  trackX: number;
  trackY: number;
  trackWidth: number;
  trackHeight: number;
  pointX: number;
  pointY: number;
}

export interface RangeSliderLinearDrag extends RangeSliderPoint {
  startValue: number;
  startPointX: number;
  startPointY: number;
}

export interface RangeSliderDragOptions {
  fine?: boolean;
  fineFactor?: number;
}

export interface RangeSliderThumbState {
  index: RangeSliderThumbIndex;
  value: number;
  percent: number;
  min: number;
  max: number;
}

export interface RangeSliderState {
  value: RangeSliderValue;
  min: number;
  max: number;
  step: number;
  minStepsBetweenThumbs: number;
  minDistance: number;
  percent: RangeSliderValue;
  startPercent: number;
  endPercent: number;
  sizePercent: number;
  orientation: RangeSliderOrientation;
  inverted: boolean;
  thumbs: [RangeSliderThumbState, RangeSliderThumbState];
}
