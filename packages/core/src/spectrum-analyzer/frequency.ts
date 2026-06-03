import { resolveSpectrumAnalyzerOptions } from "./options.ts";
import type { SpectrumAnalyzerOptions } from "./types.ts";

export function getSpectrumAnalyzerFrequencyPercent(
  frequency: number,
  options: SpectrumAnalyzerOptions = {},
) {
  const resolvedOptions = resolveSpectrumAnalyzerOptions(options);

  if (resolvedOptions.maxFrequency === resolvedOptions.minFrequency) {
    return 0;
  }

  const clampedFrequency = Math.min(
    Math.max(resolveFinite(frequency, resolvedOptions.minFrequency), resolvedOptions.minFrequency),
    resolvedOptions.maxFrequency,
  );

  if (resolvedOptions.frequencyScale === "linear") {
    return normalizePercent(
      (clampedFrequency - resolvedOptions.minFrequency) /
        (resolvedOptions.maxFrequency - resolvedOptions.minFrequency),
    );
  }

  const logMin = Math.log(resolvedOptions.minFrequency);
  const logMax = Math.log(resolvedOptions.maxFrequency);
  const span = logMax - logMin;

  if (span === 0) {
    return 0;
  }

  return normalizePercent((Math.log(clampedFrequency) - logMin) / span);
}

export function getSpectrumAnalyzerFrequencyFromPercent(
  percent: number,
  options: SpectrumAnalyzerOptions = {},
) {
  const resolvedOptions = resolveSpectrumAnalyzerOptions(options);
  const clampedPercent = normalizePercent(percent);

  if (clampedPercent === 0) {
    return resolvedOptions.minFrequency;
  }

  if (clampedPercent === 1) {
    return resolvedOptions.maxFrequency;
  }

  if (resolvedOptions.frequencyScale === "linear") {
    return (
      resolvedOptions.minFrequency +
      clampedPercent * (resolvedOptions.maxFrequency - resolvedOptions.minFrequency)
    );
  }

  return Math.exp(
    Math.log(resolvedOptions.minFrequency) +
      (Math.log(resolvedOptions.maxFrequency) - Math.log(resolvedOptions.minFrequency)) *
        clampedPercent,
  );
}

export function normalizeSpectrumAnalyzerFrequency(
  frequency: number,
  options: SpectrumAnalyzerOptions = {},
) {
  const resolvedOptions = resolveSpectrumAnalyzerOptions(options);
  return Math.min(
    Math.max(resolveFinite(frequency, resolvedOptions.minFrequency), resolvedOptions.minFrequency),
    resolvedOptions.maxFrequency,
  );
}

function normalizePercent(percent: number) {
  return Number.isFinite(percent) ? Math.min(Math.max(percent, 0), 1) : 0;
}

function resolveFinite(value: number, fallback: number) {
  return Number.isFinite(value) ? value : fallback;
}
