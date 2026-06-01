export type LevelMeterValue = number | readonly number[];
export type LevelMeterOrientation = "horizontal" | "vertical";

export interface LevelMeterScalePoint {
  value: number;
  percent: number;
  label?: string;
}

export interface LevelMeterSegment {
  from: number;
  to: number;
  id?: string;
  label?: string;
}

export interface LevelMeterSegmentState extends Required<LevelMeterSegment> {
  startPercent: number;
  endPercent: number;
  sizePercent: number;
}

export interface LevelMeterOptions {
  min?: number;
  max?: number;
  clip?: number;
  channels?: number;
  orientation?: LevelMeterOrientation;
  scale?: readonly LevelMeterScalePoint[];
  segments?: readonly LevelMeterSegment[];
}

export interface LevelMeterChannelState {
  value: number;
  percent: number;
  clipped: boolean;
}

export interface LevelMeterState {
  value: number[];
  min: number;
  max: number;
  clip: number;
  channels: LevelMeterChannelState[];
  peak: LevelMeterChannelState[];
  peakValue: number[];
  maxValue: number;
  maxPercent: number;
  orientation: LevelMeterOrientation;
  clipped: boolean;
  scale: LevelMeterScalePoint[];
  segments: LevelMeterSegmentState[];
}
