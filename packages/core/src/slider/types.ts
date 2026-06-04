import type { RangeOptions } from "../shared/range.ts";

export type SliderOrientation = "horizontal" | "vertical";
export type SliderOrigin = "left" | "center" | "right";
export type SliderThumbIndex = number;
export type SliderValue = number[];

export interface SliderThumbOptions {
  min?: number;
  max?: number;
}

export interface SliderRange extends RangeOptions {
  minStepsBetweenThumbs?: number;
  minDistance?: number;
  thumbs?: readonly SliderThumbOptions[];
}

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
  fineFactor?: number;
}

export interface SliderThumbState {
  index: SliderThumbIndex;
  value: number;
  percent: number;
  min: number;
  max: number;
}

export interface SliderState {
  min: number;
  max: number;
  step: number;
  minStepsBetweenThumbs: number;
  minDistance: number;
  value: SliderValue;
  percent: SliderValue;
  origin: SliderOrigin;
  originPercent: number;
  rangeStartPercent: number;
  rangeEndPercent: number;
  rangeSizePercent: number;
  orientation: SliderOrientation;
  inverted: boolean;
  thumbs: SliderThumbState[];
}
