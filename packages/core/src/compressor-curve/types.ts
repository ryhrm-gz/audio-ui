export interface CompressorCurveValue {
  threshold: number;
  ratio: number;
  knee: number;
  makeupGain: number;
}

export interface CompressorCurveOptions {
  minInput?: number;
  maxInput?: number;
  minOutput?: number;
  maxOutput?: number;
  minThreshold?: number;
  maxThreshold?: number;
  minRatio?: number;
  maxRatio?: number;
  minKnee?: number;
  maxKnee?: number;
  minMakeupGain?: number;
  maxMakeupGain?: number;
  stepThreshold?: number;
  stepRatio?: number;
  stepKnee?: number;
  stepMakeupGain?: number;
  curveResolution?: number;
}

export interface CompressorCurveValueOptions {
  valueStepThreshold?: number;
  valueStepRatio?: number;
  valueStepKnee?: number;
  valueStepMakeupGain?: number;
}

export interface ResolvedCompressorCurveOptions {
  minInput: number;
  maxInput: number;
  minOutput: number;
  maxOutput: number;
  minThreshold: number;
  maxThreshold: number;
  minRatio: number;
  maxRatio: number;
  minKnee: number;
  maxKnee: number;
  minMakeupGain: number;
  maxMakeupGain: number;
  stepThreshold: number;
  stepRatio: number;
  stepKnee: number;
  stepMakeupGain: number;
  curveResolution: number;
}

export interface CompressorCurvePosition {
  x: number;
  y: number;
}

export interface CompressorCurvePoint extends CompressorCurvePosition {
  input: number;
  output: number;
}

export interface CompressorCurveState extends ResolvedCompressorCurveOptions {
  value: CompressorCurveValue;
  curve: CompressorCurvePoint[];
}
