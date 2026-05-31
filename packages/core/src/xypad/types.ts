import type { RangeOptions } from "../shared/range.ts";

export interface XYPadValue {
  x: number;
  y: number;
}

export interface XYPadRangeOptions {
  minX?: number;
  maxX?: number;
  stepX?: number;
  minY?: number;
  maxY?: number;
  stepY?: number;
}

export interface XYPadValueOptions {
  valueStepX?: number;
  valueStepY?: number;
}

export interface XYPadResolvedOptions {
  minX: number;
  maxX: number;
  stepX: number;
  minY: number;
  maxY: number;
  stepY: number;
}

export interface XYPadOptions extends XYPadRangeOptions {}

export interface XYPadAxisOptions extends RangeOptions {}

export interface XYPadPoint {
  areaX: number;
  areaY: number;
  areaWidth: number;
  areaHeight: number;
  pointX: number;
  pointY: number;
}

export interface XYPadLinearDrag extends XYPadPoint {
  startValue: XYPadValue;
  startPointX: number;
  startPointY: number;
}

export interface XYPadDragOptions {
  fine?: boolean;
}

export interface XYPadState extends XYPadResolvedOptions {
  value: XYPadValue;
  xPercent: number;
  yPercent: number;
}
