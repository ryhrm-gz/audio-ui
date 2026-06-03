import { resolveSpectrumAnalyzerOptions } from "./options.ts";
import type { SpectrumAnalyzerOptions } from "./types.ts";

export function normalizeSpectrumAnalyzerMagnitude(
  magnitude: number,
  options: SpectrumAnalyzerOptions = {},
) {
  const resolvedOptions = resolveSpectrumAnalyzerOptions(options);

  return Math.min(
    Math.max(resolveFinite(magnitude, resolvedOptions.minMagnitude), resolvedOptions.minMagnitude),
    resolvedOptions.maxMagnitude,
  );
}

export function getSpectrumAnalyzerMagnitudePercent(
  magnitude: number,
  options: SpectrumAnalyzerOptions = {},
) {
  const resolvedOptions = resolveSpectrumAnalyzerOptions(options);
  const normalizedMagnitude = normalizeSpectrumAnalyzerMagnitude(magnitude, resolvedOptions);

  if (resolvedOptions.maxMagnitude === resolvedOptions.minMagnitude) {
    return 0;
  }

  return (
    (normalizedMagnitude - resolvedOptions.minMagnitude) /
    (resolvedOptions.maxMagnitude - resolvedOptions.minMagnitude)
  );
}

export function getSpectrumAnalyzerMagnitudeFromPercent(
  percent: number,
  options: SpectrumAnalyzerOptions = {},
) {
  const resolvedOptions = resolveSpectrumAnalyzerOptions(options);
  const clampedPercent = Number.isFinite(percent) ? Math.min(Math.max(percent, 0), 1) : 0;

  return (
    resolvedOptions.minMagnitude +
    clampedPercent * (resolvedOptions.maxMagnitude - resolvedOptions.minMagnitude)
  );
}

function resolveFinite(value: number, fallback: number) {
  return Number.isFinite(value) ? value : fallback;
}
