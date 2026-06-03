export type SpectrumAnalyzerFrequencyScale = "linear" | "log";

export interface SpectrumAnalyzerBin {
  frequency: number;
  magnitude: number;
  id?: string;
  label?: string;
}

export type SpectrumAnalyzerValue = readonly (number | SpectrumAnalyzerBin)[];

export interface SpectrumAnalyzerOptions {
  minFrequency?: number;
  maxFrequency?: number;
  minMagnitude?: number;
  maxMagnitude?: number;
  frequencyScale?: SpectrumAnalyzerFrequencyScale;
}

export interface ResolvedSpectrumAnalyzerOptions {
  minFrequency: number;
  maxFrequency: number;
  minMagnitude: number;
  maxMagnitude: number;
  frequencyScale: SpectrumAnalyzerFrequencyScale;
}

export interface SpectrumAnalyzerPosition {
  x: number;
  y: number;
}

export interface SpectrumAnalyzerBinState extends SpectrumAnalyzerBin, SpectrumAnalyzerPosition {
  id: string;
  index: number;
  rawFrequency: number;
  rawMagnitude: number;
  frequencyPercent: number;
  magnitudePercent: number;
  barStart: number;
  barEnd: number;
  barWidth: number;
  clipped: boolean;
  outOfRange: boolean;
}

export interface SpectrumAnalyzerState extends ResolvedSpectrumAnalyzerOptions {
  value: SpectrumAnalyzerBin[];
  bins: SpectrumAnalyzerBinState[];
  curve: SpectrumAnalyzerBinState[];
  peak: SpectrumAnalyzerBinState | null;
  binCount: number;
  empty: boolean;
}
