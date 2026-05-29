import type { RangeOptions } from "../shared/range.ts";

export interface KnobRange extends RangeOptions {}

export interface KnobAngleRange {
  minAngle?: number;
  maxAngle?: number;
}

export interface KnobOptions extends KnobRange, KnobAngleRange {}

export interface KnobPoint {
  centerX: number;
  centerY: number;
  pointX: number;
  pointY: number;
}

export interface KnobLinearDrag {
  startValue: number;
  startY: number;
  pointY: number;
  trackSize: number;
}

export interface KnobState {
  value: number;
  min: number;
  max: number;
  step: number;
  minAngle: number;
  maxAngle: number;
  percent: number;
  angle: number;
}
