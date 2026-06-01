export type EQCurveBandType = "bell" | "low-shelf" | "high-shelf" | "low-pass" | "high-pass";

export interface EQCurveBand {
  id: string;
  type: EQCurveBandType;
  frequency: number;
  gain: number;
  q: number;
  enabled?: boolean;
}

export type EQCurveValue = EQCurveBand[];

export interface EQCurveOptions {
  minFrequency?: number;
  maxFrequency?: number;
  minGain?: number;
  maxGain?: number;
  minQ?: number;
  maxQ?: number;
  stepFrequency?: number;
  stepGain?: number;
  stepQ?: number;
  curveResolution?: number;
}

export interface EQCurveValueOptions {
  valueStepFrequency?: number;
  valueStepGain?: number;
  valueStepQ?: number;
}

export interface ResolvedEQCurveOptions {
  minFrequency: number;
  maxFrequency: number;
  minGain: number;
  maxGain: number;
  minQ: number;
  maxQ: number;
  stepFrequency: number;
  stepGain: number;
  stepQ: number;
  curveResolution: number;
}

export interface EQCurvePosition {
  x: number;
  y: number;
}

export interface EQCurveBandRect {
  graphX: number;
  graphY: number;
  graphWidth: number;
  graphHeight: number;
  pointX: number;
  pointY: number;
}

export interface EQCurveBandState extends EQCurveBand, EQCurvePosition {
  enabled: boolean;
}

export interface EQCurvePoint extends EQCurvePosition {
  frequency: number;
  gain: number;
}

export interface EQCurveState extends ResolvedEQCurveOptions {
  value: EQCurveValue;
  bands: EQCurveBandState[];
  curve: EQCurvePoint[];
  activeBand: string | null;
}
