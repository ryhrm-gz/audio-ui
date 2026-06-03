import type { ResolvedSpectrumAnalyzerOptions, SpectrumAnalyzerOptions } from "./types.ts";

export const defaultSpectrumAnalyzerOptions = {
  minFrequency: 20,
  maxFrequency: 20000,
  minMagnitude: -90,
  maxMagnitude: 0,
  frequencyScale: "log",
} satisfies ResolvedSpectrumAnalyzerOptions;

export function resolveSpectrumAnalyzerOptions(
  options: SpectrumAnalyzerOptions = {},
): ResolvedSpectrumAnalyzerOptions {
  const frequencyScale = options.frequencyScale === "linear" ? "linear" : "log";
  const minFrequency =
    frequencyScale === "log"
      ? getPositiveOption(options.minFrequency, defaultSpectrumAnalyzerOptions.minFrequency)
      : getNonNegativeOption(options.minFrequency, defaultSpectrumAnalyzerOptions.minFrequency);
  const maxFrequency = getPositiveOption(
    options.maxFrequency,
    defaultSpectrumAnalyzerOptions.maxFrequency,
  );
  const minMagnitude = getFiniteOption(
    options.minMagnitude,
    defaultSpectrumAnalyzerOptions.minMagnitude,
  );
  const maxMagnitude = getFiniteOption(
    options.maxMagnitude,
    defaultSpectrumAnalyzerOptions.maxMagnitude,
  );

  return {
    minFrequency: Math.min(minFrequency, maxFrequency),
    maxFrequency: Math.max(minFrequency, maxFrequency),
    minMagnitude: Math.min(minMagnitude, maxMagnitude),
    maxMagnitude: Math.max(minMagnitude, maxMagnitude),
    frequencyScale,
  };
}

function getFiniteOption(value: number | undefined, fallback: number) {
  return typeof value === "number" && Number.isFinite(value) ? value : fallback;
}

function getPositiveOption(value: number | undefined, fallback: number) {
  return typeof value === "number" && Number.isFinite(value) && value > 0 ? value : fallback;
}

function getNonNegativeOption(value: number | undefined, fallback: number) {
  return typeof value === "number" && Number.isFinite(value) && value >= 0 ? value : fallback;
}
