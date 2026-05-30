import type { RangeOptions } from "../shared/range.ts";

export interface FaderRange extends RangeOptions {}

export interface FaderScalePoint {
  value: number;
  percent: number;
  label?: string;
}

export interface FaderOptions extends FaderRange {
  inverted?: boolean;
  unity?: number;
  scale?: readonly FaderScalePoint[];
}

export interface FaderPoint {
  trackX: number;
  trackY: number;
  trackWidth: number;
  trackHeight: number;
  pointX: number;
  pointY: number;
}

export interface FaderLinearDrag extends FaderPoint {
  startValue: number;
  startPointX: number;
  startPointY: number;
}

export interface FaderDragOptions {
  fine?: boolean;
}

export interface FaderState {
  value: number;
  min: number;
  max: number;
  step: number;
  percent: number;
  inverted: boolean;
  unity: number;
  unityPercent: number;
  gain: number;
  scale: FaderScalePoint[];
}
